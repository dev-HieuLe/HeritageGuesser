// Controllers/LeaderboardController.js
import db from "../Config/db.js";

export const getLeaderboard = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT id, name, level, \`rank\`, rank_progress 
       FROM users
       ORDER BY \`rank\` ASC, rank_progress DESC, level DESC
       LIMIT 20`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};
