import db from "../Config/db.js";

// 🧠 Update player level after each game (+5 points)
export const updateLevel = async (req, res) => {
  try {
    const { levelGain } = req.body;
    const playerId = req.user.id; // from auth middleware

    if (!levelGain || isNaN(levelGain)) {
      return res.status(400).json({ error: "Invalid level gain" });
    }

    await db.execute(
      "UPDATE users SET level = level + ?, points = COALESCE(points, 0) + 5 WHERE id = ?",
      [levelGain, playerId],
    );

    const [rows] = await db.execute("SELECT points FROM users WHERE id = ?", [playerId]);
    res.json({ success: true, message: `+${levelGain} level added, +5 points`, points: rows[0]?.points ?? 0 });
  } catch (err) {
    console.error("Error updating level:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// 🏆 Update player level and rank after each game (+5 points)
export const updateRank = async (req, res) => {
  try {
    const { levelGain, result } = req.body; // result = "win" or "lose"
    const playerId = req.user.id; // from auth middleware

    if (levelGain === undefined || isNaN(levelGain)) {
      return res.status(400).json({ error: "Invalid level gain" });
    }
    if (!["win", "lose"].includes(result)) {
      return res
        .status(400)
        .json({ error: "Invalid result (must be 'win' or 'lose')" });
    }

    // Get current player data
    const [rows] = await db.execute(
      "SELECT `rank`, rank_progress, level, points FROM users WHERE id = ?",
      [playerId],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Player not found" });
    }

    let { rank, rank_progress, level, points } = rows[0];

    // --- 🧩 Apply match result logic ---
    if (result === "win") {
      rank_progress += 1;
      if (rank_progress > 5) {
        if (rank < 10) {
          rank += 1;
          rank_progress = 0;
        } else {
          rank_progress = 5; // already max rank
        }
      }
    } else if (result === "lose") {
      rank_progress -= 1;
      if (rank_progress < 0) {
        if (rank > 1) {
          rank -= 1;
          rank_progress = 4;
        } else {
          rank_progress = 0;
        }
      }
    }

    // Update level, rank, progress, and points
    await db.execute(
      "UPDATE users SET level = level + ?, `rank` = ?, rank_progress = ?, points = COALESCE(points, 0) + 5 WHERE id = ?",
      [levelGain, rank, rank_progress, playerId],
    );

    res.json({
      success: true,
      message: `Result: ${result}, Level +${levelGain}, Rank ${rank} (${rank_progress}/5), +5 points`,
      newData: { rank, rank_progress, level: level + levelGain, points: points + 5 },
    });
  } catch (err) {
    console.error("Error updating level and rank:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// 💎 Add points to player (contributions, lessons, check-in)
export const addPoints = async (req, res) => {
  try {
    const { amount } = req.body;
    const playerId = req.user.id;

    const parsed = Number(amount);
    if (!parsed || isNaN(parsed) || parsed <= 0 || parsed > 1000) {
      return res.status(400).json({ error: "Invalid points amount" });
    }

    await db.execute("UPDATE users SET points = COALESCE(points, 0) + ? WHERE id = ?", [parsed, playerId]);
    const [rows] = await db.execute("SELECT points FROM users WHERE id = ?", [playerId]);
    res.json({ success: true, message: `+${parsed} points added`, points: rows[0]?.points ?? 0 });
  } catch (err) {
    console.error("Error adding points:", err);
    res.status(500).json({ error: "Server error" });
  }
};
