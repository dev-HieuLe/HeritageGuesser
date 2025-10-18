import db from "../Config/db.js";

export const recordHistory = async (req, res) => {
  try {
    const userId = req.user.id; // from verifyUser middleware
    const { locationId, score, nameScore, ageScore, difficulty } = req.body;

    await db.execute(
      `INSERT INTO player_history (user_id, location_id, score, name_score, age_score, difficulty)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, locationId, score, nameScore, ageScore, difficulty || 1]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to record history" });
  }
};
