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

export const getRandomLocations = async (req, res) => {
  // Parse and validate count
  let count = parseInt(req.query.count, 10);
  if (isNaN(count) || count <= 0) count = 3;
  if (count > 20) count = 20; // cap to prevent abuse

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

