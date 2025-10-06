import db from "../Config/db.js";

// 🧠 Update player level after each game
export const updateLevel = async (req, res) => {
  try {
    const { levelGain } = req.body;
    const playerId = req.id; // from auth middleware

    if (!levelGain || isNaN(levelGain)) {
      return res.status(400).json({ error: "Invalid level gain" });
    }

    await db.execute("UPDATE Users SET level = level + ? WHERE id = ?", [
      levelGain,
      playerId,
    ]);

    res.json({ success: true, message: `+${levelGain} level added` });
  } catch (err) {
    console.error("Error updating level:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// 🏆 Update player level and rank after each game
export const updateRank = async (req, res) => {
  try {
    const { levelGain, result } = req.body; // result = "win" or "lose"
    const playerId = req.id; // from auth middleware

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
      "SELECT `rank`, rank_progress, level FROM Users WHERE id = ?",
      [playerId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Player not found" });
    }

    let { rank, rank_progress, level } = rows[0];

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

    // Update level, rank, and progress
    await db.execute(
      "UPDATE Users SET level = level + ?, `rank` = ?, rank_progress = ? WHERE id = ?",
      [levelGain, rank, rank_progress, playerId]
    );

    res.json({
      success: true,
      message: `Result: ${result}, Level +${levelGain}, Rank ${rank} (${rank_progress}/5)`,
      newData: { rank, rank_progress, level: level + levelGain },
    });
  } catch (err) {
    console.error("Error updating level and rank:", err);
    res.status(500).json({ error: "Server error" });
  }
};
