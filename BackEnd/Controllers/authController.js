import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../Config/db.js";

const SALT_ROUNDS = 10;
const isProd = process.env.NODE_ENV === "production";

// 📝 REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const trimmedName = typeof name === "string" ? name.trim() : "";
    const trimmedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 50)
      return res
        .status(400)
        .json({ error: "Name must be between 2 and 50 characters" });
    if (!/[a-zA-Z0-9]/.test(trimmedName))
      return res
        .status(400)
        .json({ error: "Name must contain at least one letter or number" });
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail))
      return res.status(400).json({ error: "Invalid email address" });
    if (!password || password.length < 8)
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters" });
    if (password.length > 128)
      return res
        .status(400)
        .json({ error: "Password must be less than 128 characters" });

    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    // 👇 include level, rank, rank_progress with default 0
    const sql = `
      INSERT INTO users (name, email, password, level, \`rank\`, rank_progress)
      VALUES (?, ?, ?, 0, 1, 0)
    `;

    const [result] = await db.execute(sql, [trimmedName, trimmedEmail, hash]);
    const id = result.insertId;

    const accessToken = jwt.sign({ name: trimmedName, email: trimmedEmail, id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(
      { id, email: trimmedEmail },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("token", accessToken, {
      httpOnly: true,
      sameSite: isProd ? "None" : "Lax",
      secure: isProd,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: isProd ? "None" : "Lax",
      secure: isProd,
    });

    return res.status(201).json({
      status: "Success",
      user: { name: trimmedName, email: trimmedEmail, id, level: 0, rank: 1, rank_progress: 0, points: 0, accessToken, refreshToken },
    });
  } catch (err) {
    console.error("Register error:", err.message);
    if (err.message.includes("for key 'users.email'")) {
      return res.status(409).json({ error: "Email already registered!" });
    } else if (err.message.includes("for key 'users.name'")) {
      return res.status(409).json({ error: "Name already taken!" });
    } else {
      return res.status(500).json({ error: "Server error" });
    }
  }
};

// 📝 LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Account created via Google — no password set
    if (!rows[0].password) {
      return res
        .status(401)
        .json({
          error: "This account uses Google sign-in. Please log in with Google.",
        });
    }

    if (!(await bcrypt.compare(password, rows[0].password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const { id, name, level, rank, rank_progress, points, max_play, subscription_plan } = rows[0];

    const accessToken = jwt.sign({ id, email, name }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(
      { id, email, name },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: isProd ? "None" : "Lax",
      secure: isProd,
    });
    res.cookie("token", accessToken, {
      httpOnly: true,
      sameSite: isProd ? "None" : "Lax",
      secure: isProd,
    });

    return res.status(200).json({
      status: "Success",
      user: { id, name, email, level, rank, rank_progress, points, max_play: max_play ?? 15, subscription_plan: subscription_plan ?? "basic", accessToken, refreshToken },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

// 📝 GET LOGGED-IN USER
export const getPlayer = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, name, email, level, `rank`, rank_progress, avatar_url, points, max_play, subscription_plan FROM users WHERE id = ?",
      [req.user.id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      status: "Success",
      id: rows[0].id,
      name: rows[0].name,
      email: rows[0].email,
      level: rows[0].level,
      rank: rows[0].rank,
      rank_progress: rows[0].rank_progress,
      avatar_url: rows[0].avatar_url,
      points: rows[0].points ?? 0,
      max_play: rows[0].max_play ?? 15,
      subscription_plan: rows[0].subscription_plan ?? "basic",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

// 📝 LOGOUT
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: isProd ? "None" : "Lax",
    secure: isProd,
    path: "/",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: isProd ? "None" : "Lax",
    secure: isProd,
    path: "/",
  });
  return res.json({ Status: "Success" });
};

// 📝 GOOGLE OAUTH (Supabase)
export const googleAuth = async (req, res) => {
  try {
    const { access_token } = req.body;
    if (!access_token)
      return res.status(400).json({ error: "No token provided" });

    // Verify with Supabase and get user info
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(access_token);
    if (error || !user)
      return res.status(401).json({ error: "Invalid Google token" });

    const email = user.email;
    const googleId = user.id;
    const displayName = (
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      email.split("@")[0]
    ).substring(0, 50);
    const avatarUrl =
      user.user_metadata?.avatar_url || user.user_metadata?.picture || null;

    // Find or create user in MySQL
    let [rows] = await db.execute(
      "SELECT id, name, email, level, `rank`, rank_progress, avatar_url, points, max_play, subscription_plan FROM users WHERE google_id = ?",
      [googleId],
    );

    if (rows.length === 0) {
      [rows] = await db.execute(
        "SELECT id, name, email, level, `rank`, rank_progress, avatar_url, points, max_play, subscription_plan FROM users WHERE email = ?",
        [email],
      );
      if (rows.length > 0) {
        // Link Google ID to existing account and update avatar
        await db.execute(
          "UPDATE users SET google_id = ?, avatar_url = ? WHERE id = ?",
          [googleId, avatarUrl, rows[0].id],
        );
        rows[0].avatar_url = avatarUrl;
      } else {
        // Create new user
        let name = displayName;
        const [nameCheck] = await db.execute(
          "SELECT id FROM users WHERE name = ?",
          [name],
        );
        if (nameCheck.length > 0) {
          name = `${name.substring(0, 43)}_${Date.now().toString().slice(-6)}`;
        }
        const [result] = await db.execute(
          "INSERT INTO users (name, email, password, google_id, avatar_url, level, `rank`, rank_progress) VALUES (?, ?, NULL, ?, ?, 0, 1, 0)",
          [name, email, googleId, avatarUrl],
        );
        rows = [
          {
            id: result.insertId,
            name,
            email,
            level: 0,
            rank: 1,
            rank_progress: 0,
            avatar_url: avatarUrl,
            points: 0,
          },
        ];
      }
    } else {
      // Update avatar on every Google login (user may have changed their profile pic)
      await db.execute("UPDATE users SET avatar_url = ? WHERE id = ?", [
        avatarUrl,
        rows[0].id,
      ]);
      rows[0].avatar_url = avatarUrl;
    }

    const { id, name, level, rank, rank_progress, avatar_url, points, max_play, subscription_plan } =
      rows[0];

    const accessToken = jwt.sign({ id, name, email }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(
      { id, email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", accessToken, {
      httpOnly: true,
      sameSite: isProd ? "None" : "Lax",
      secure: isProd,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: isProd ? "None" : "Lax",
      secure: isProd,
    });

    return res.status(200).json({
      status: "Success",
      user: {
        id,
        name,
        email,
        level,
        rank,
        rank_progress,
        avatar_url,
        points: points ?? 0,
        max_play: max_play ?? 15,
        subscription_plan: subscription_plan ?? "basic",
      },
    });
  } catch (err) {
    console.error("Google auth error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
};

// 📝 UPDATE PROFILE (name / email / password)
export const updateProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const [rows] = await db.execute(
      "SELECT id, name, email, password FROM users WHERE id = ?",
      [userId],
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "User not found" });

    const current = rows[0];
    const updates = {};

    if (name !== undefined && name.trim() !== current.name) {
      if (name.trim().length < 2 || name.trim().length > 50)
        return res
          .status(400)
          .json({ error: "Name must be between 2 and 50 characters" });
      const [nameCheck] = await db.execute(
        "SELECT id FROM users WHERE name = ? AND id != ?",
        [name.trim(), userId],
      );
      if (nameCheck.length > 0)
        return res.status(409).json({ error: "Username already taken" });
      updates.name = name.trim();
    }

    if (email !== undefined && email.trim() !== current.email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
        return res.status(400).json({ error: "Invalid email address" });
      const [emailCheck] = await db.execute(
        "SELECT id FROM users WHERE email = ? AND id != ?",
        [email.trim(), userId],
      );
      if (emailCheck.length > 0)
        return res.status(409).json({ error: "Email already in use" });
      updates.email = email.trim();
    }

    if (newPassword) {
      if (!currentPassword)
        return res.status(400).json({ error: "Current password is required" });
      if (!current.password)
        return res
          .status(400)
          .json({
            error:
              "Password cannot be set for Google-only accounts via this method",
          });
      const match = await bcrypt.compare(currentPassword, current.password);
      if (!match)
        return res.status(401).json({ error: "Current password is incorrect" });
      if (newPassword.length < 8)
        return res
          .status(400)
          .json({ error: "New password must be at least 8 characters" });
      updates.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    }

    if (Object.keys(updates).length === 0)
      return res.status(400).json({ error: "No changes provided" });

    const setClauses = Object.keys(updates)
      .map((k) => `\`${k}\` = ?`)
      .join(", ");
    await db.execute(`UPDATE users SET ${setClauses} WHERE id = ?`, [
      ...Object.values(updates),
      userId,
    ]);

    const [updated] = await db.execute(
      "SELECT id, name, email, level, `rank`, rank_progress, avatar_url, points FROM users WHERE id = ?",
      [userId],
    );

    return res.json({ status: "Success", user: updated[0] });
  } catch (err) {
    console.error("Update profile error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
};

// 📝 REFRESH TOKEN
export const refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: "No refresh token" });

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, user) => {
      if (err) return res.status(403).json({ error: "Invalid refresh token" });

      const [rows] = await db.execute("SELECT name FROM users WHERE id = ?", [
        user.id,
      ]);
      const name = rows[0].name;

      const newAccessToken = jwt.sign(
        { id: user.id, email: user.email, name },
        process.env.JWT_SECRET,
        { expiresIn: "15m" },
      );
      res.cookie("token", newAccessToken, {
        httpOnly: true,
        sameSite: isProd ? "None" : "Lax",
        secure: isProd,
      });
      return res.json({ status: "Success" });
    },
  );
};
