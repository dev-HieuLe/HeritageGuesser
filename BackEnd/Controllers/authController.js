import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../Config/db.js";

const SALT_ROUNDS = 10;
const isProd = process.env.NODE_ENV === "production";

// 📝 REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      !name ||
      typeof name !== "string" ||
      name.trim().length < 2 ||
      name.trim().length > 50
    )
      return res
        .status(400)
        .json({ error: "Name must be between 2 and 50 characters" });
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ error: "Invalid email address" });
    if (!password || password.length < 8)
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters" });

    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    // 👇 include level, rank, rank_progress with default 0
    const sql = `
      INSERT INTO users (name, email, password, level, \`rank\`, rank_progress)
      VALUES (?, ?, ?, 0, 1, 0)
    `;

    const [result] = await db.execute(sql, [name, email, hash]);
    const id = result.insertId;

    const accessToken = jwt.sign({ name, email, id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(
      { id, email },
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
      user: { name, email, id, level: 0, rank: 1, rank_progress: 0 },
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

    if (
      rows.length === 0 ||
      !(await bcrypt.compare(password, rows[0].password))
    ) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const { id, name, level, rank, rank_progress } = rows[0];

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
      user: { id, name, email, level, rank, rank_progress },
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
      "SELECT id, name, email, level, `rank`, rank_progress FROM users WHERE id = ?",
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
