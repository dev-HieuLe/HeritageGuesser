import db from "../Config/db.js";
import axios from "axios";

export const checkAnswer = async (req, res) => {
  try {
    const { answer, locationId } = req.body;

    const [rows] = await db.execute(
      "SELECT * FROM locations WHERE id = ?",
      [locationId]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "Location not found" });

    const expected = rows[0].name;
    const aliases = rows[0].aliases ? rows[0].aliases.split(",") : []; // optional

    const response = await axios.post("http://localhost:8000/heritage/check", {
      answer,
      expected,
      aliases,
    });

    res.json({
      location: rows[0],
      ...response.data,
    });
  } catch (err) {
    console.error("checkAnswer error:", err.message);
    res.status(500).json({ error: "Failed to check answer" });
  }
};
