// Controllers/DiscoverController.js
import db from "../Config/db.js";
import axios from "axios";

export const searchDiscover = async (req, res) => {
  const q = (req.query.query || "").trim();
  console.log("🎯 searchDiscover triggered with query:", q);

  if (!q) return res.status(400).json({ error: "Query is required" });

  try {
    // 1️⃣ Check MySQL first
    const like = `%${q}%`;
    const [rows] = await db.execute(
      `SELECT id, name, region, difficulty, description, lat, lng, built_year, aliases
       FROM locations
       WHERE LOWER(name) = LOWER(?) 
          OR LOWER(name) LIKE LOWER(?) 
          OR LOWER(aliases) LIKE LOWER(?)
       LIMIT 1`,
      [q, like, like]
    );

    if (rows.length > 0) {
      console.log("✅ Found in database:", rows[0].name);
      return res.json({ source: "db", place: rows[0] });
    }

    // 2️⃣ If not found, fallback to Google
    const GOOGLE_KEY = process.env.GOOGLE_MAPS_API_KEY;
    if (!GOOGLE_KEY) {
      return res.status(500).json({ error: "Google API key not configured" });
    }

    console.log("🌐 Fetching from Google Maps API...");
    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: { address: q, key: GOOGLE_KEY },
      }
    );

    if (!data.results || data.results.length === 0) {
      console.warn(`⚠️ No Google results for: ${q}`);
      return res.status(404).json({
        source: "google",
        error: "No results found",
      });
    }

    const first = data.results[0];
    const lat = first.geometry?.location?.lat;
    const lng = first.geometry?.location?.lng;
    const formatted_address = first.formatted_address;

    return res.json({
      source: "google",
      place: {
        name: first.address_components?.[0]?.long_name || formatted_address || q,
        formatted_address,
        lat,
        lng,
      },
    });
  } catch (err) {
    console.error("❌ Discover search error:", err.message);
    res.status(500).json({ error: "Server error while searching" });
  }
};
