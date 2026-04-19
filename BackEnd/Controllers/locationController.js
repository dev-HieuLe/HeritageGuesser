import db from "../Config/db.js";

export const getLocations = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM locations");

    const currentYear = new Date().getFullYear();

    const locations = rows.map((loc) => ({
      ...loc,
      lat: Number(loc.lat),
      lng: Number(loc.lng),
      years_old: loc.built_year ? currentYear - loc.built_year : 0,
    }));

    res.json(locations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
};

export const getDailyLocations = async (_req, res) => {
  try {
    // Seed RAND() with today's date integer (e.g. 20260418) — same 5 every day for all users
    const now = new Date();
    const seed =
      now.getFullYear() * 10000 +
      (now.getMonth() + 1) * 100 +
      now.getDate();

    const [rows] = await db.query(
      `SELECT * FROM locations ORDER BY RAND(${seed}) LIMIT 5`,
    );

    const currentYear = new Date().getFullYear();
    const locations = rows.map((loc) => ({
      ...loc,
      lat: Number(loc.lat),
      lng: Number(loc.lng),
      years_old: loc.built_year ? currentYear - loc.built_year : 0,
    }));

    res.json(locations);
  } catch (err) {
    console.error("getDailyLocations error:", err);
    res.status(500).json({ error: "Failed to fetch daily locations" });
  }
};

export const getRandomLocations = async (req, res) => {
  // Parse and validate count
  let count = parseInt(req.query.count, 10);
  if (isNaN(count) || count <= 0) count = 5;
  if (count > 50) count = 50; // cap to prevent abuse

  try {
    const [rows] = await db.query(
      `SELECT * FROM locations ORDER BY RAND() LIMIT ${count}`
    );

    const currentYear = new Date().getFullYear();
    const locations = rows.map((loc) => ({
      ...loc,
      lat: Number(loc.lat),
      lng: Number(loc.lng),
      years_old: loc.built_year ? currentYear - loc.built_year : 0,
    }));

    res.json(locations);
  } catch (err) {
    console.error("getRandomLocations error:", err);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
};

