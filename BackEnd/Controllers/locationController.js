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
