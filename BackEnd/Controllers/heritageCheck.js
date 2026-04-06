import db from "../Config/db.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const checkAnswer = async (req, res) => {
  try {
    const { answer, locationId } = req.body;

    if (!answer || typeof answer !== "string" || answer.trim().length === 0)
      return res.status(400).json({ error: "Answer is required" });
    if (answer.length > 200)
      return res.status(400).json({ error: "Answer too long (max 200 characters)" });
    if (!locationId || !Number.isInteger(Number(locationId)))
      return res.status(400).json({ error: "Valid locationId is required" });

    const [rows] = await db.execute("SELECT * FROM locations WHERE id = ?", [
      locationId,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Location not found" });

    const expected = rows[0].name;
    const aliases = rows[0].aliases ? rows[0].aliases.split(",") : []; // optional

    const response = await axios.post(
      `${process.env.API_BASE_URL}/heritage/check`,
      {
        answer,
        expected,
        aliases,
      },
    );

    res.json({
      location: rows[0],
      ...response.data,
    });
  } catch (err) {
    console.error("checkAnswer error:", err.message);
    res.status(500).json({ error: "Failed to check answer" });
  }
};
