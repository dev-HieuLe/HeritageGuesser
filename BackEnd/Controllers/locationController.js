import db from "../Config/db.js";

const currentYear = new Date().getFullYear();

/**
 * Enrich a raw locations array with the user's own rating.
 * `stars` comes directly from the locations.stars column (default 0 in DB).
 */
async function enrichWithRatings(rows, userId = null) {
  if (rows.length === 0) return rows;

  let myMap = {};

  if (userId) {
    const ids = rows.map((r) => r.id);
    const placeholders = ids.map(() => "?").join(",");
    try {
      const [myRows] = await db.execute(
        `SELECT location_id, rating
         FROM location_ratings
         WHERE source = 'game' AND location_id IN (${placeholders}) AND user_id = ?`,
        [...ids, userId],
      );
      myRows.forEach((r) => { myMap[r.location_id] = parseFloat(r.rating); });
    } catch {
      // graceful skip if table not ready
    }
  }

  return rows.map((loc) => ({
    ...loc,
    lat: Number(loc.lat),
    lng: Number(loc.lng),
    years_old: loc.built_year ? currentYear - loc.built_year : 0,
    stars: parseFloat(loc.stars ?? 0),
    my_rating: myMap[loc.id] ?? null,
  }));
}

export const getLocations = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM locations");
    const userId = req.user?.id ?? null;
    res.json(await enrichWithRatings(rows, userId));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
};

export const getDailyLocations = async (req, res) => {
  try {
    const now = new Date();
    const seed =
      now.getFullYear() * 10000 +
      (now.getMonth() + 1) * 100 +
      now.getDate();

    const [rows] = await db.query(
      `SELECT * FROM locations ORDER BY RAND(${seed}) LIMIT 5`,
    );
    const userId = req.user?.id ?? null;
    res.json(await enrichWithRatings(rows, userId));
  } catch (err) {
    console.error("getDailyLocations error:", err);
    res.status(500).json({ error: "Failed to fetch daily locations" });
  }
};

export const getRandomLocations = async (req, res) => {
  let count = parseInt(req.query.count, 10);
  if (isNaN(count) || count <= 0) count = 5;
  if (count > 50) count = 50;

  try {
    const [rows] = await db.query(
      `SELECT * FROM locations ORDER BY RAND() LIMIT ${count}`,
    );
    const userId = req.user?.id ?? null;
    res.json(await enrichWithRatings(rows, userId));
  } catch (err) {
    console.error("getRandomLocations error:", err);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
};

/**
 * POST /api/locations/rate/:id
 * Submit or update a 1–5 star rating for a game location.
 */
export const rateGameLocation = async (req, res) => {
  const userId = req.user.id;
  const locationId = parseInt(req.params.id, 10);
  const rating = parseFloat(req.body.rating);

  if (!locationId || isNaN(locationId)) {
    return res.status(400).json({ error: "Invalid location ID." });
  }
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5." });
  }

  try {
    await db.execute(
      `INSERT INTO location_ratings (location_id, user_id, rating, source)
       VALUES (?, ?, ?, 'game')
       ON DUPLICATE KEY UPDATE rating = VALUES(rating)`,
      [locationId, userId, rating],
    );

    const [[{ avg_stars, total_ratings }]] = await db.execute(
      `SELECT ROUND(AVG(rating), 2) AS avg_stars, COUNT(*) AS total_ratings
       FROM location_ratings WHERE source = 'game' AND location_id = ?`,
      [locationId],
    );

    const newStars = parseFloat((avg_stars || 0).toFixed(2));

    // Write back the cached average to locations.stars
    await db.execute(
      `UPDATE locations SET stars = ? WHERE id = ?`,
      [newStars, locationId],
    );

    return res.json({
      stars: newStars,
      total_ratings: parseInt(total_ratings),
      my_rating: rating,
    });
  } catch (err) {
    console.error("rateGameLocation error:", err.message);
    return res.status(500).json({ error: "Failed to save rating." });
  }
};

/**
 * GET /api/locations/rating/:id
 * Get avg rating + current user's rating for a single location.
 */
export const getGameLocationRating = async (req, res) => {
  const userId = req.user?.id ?? null;
  const locationId = parseInt(req.params.id, 10);

  if (!locationId || isNaN(locationId)) {
    return res.status(400).json({ error: "Invalid location ID." });
  }

  try {
    const [[loc]] = await db.execute(
      `SELECT stars FROM locations WHERE id = ?`,
      [locationId],
    );
    const [[{ total_ratings }]] = await db.execute(
      `SELECT COUNT(*) AS total_ratings FROM location_ratings
       WHERE source = 'game' AND location_id = ?`,
      [locationId],
    );

    let myRating = null;
    if (userId) {
      const [[row]] = await db.execute(
        `SELECT rating FROM location_ratings
         WHERE source = 'game' AND location_id = ? AND user_id = ?`,
        [locationId, userId],
      );
      myRating = row?.rating ?? null;
    }

    return res.json({
      stars: parseFloat(loc?.stars ?? 0),
      total_ratings: parseInt(total_ratings),
      my_rating: myRating,
    });
  } catch {
    return res.json({ stars: 0, total_ratings: 0, my_rating: null });
  }
};
