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
