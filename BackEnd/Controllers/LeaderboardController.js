// Controllers/LeaderboardController.js
import db from "../Config/db.js";

export const getLeaderboard = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT id, name, level, \`rank\`, rank_progress, avatar_url
       FROM users
       ORDER BY \`rank\` DESC, rank_progress DESC, level DESC
       LIMIT 100`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};
