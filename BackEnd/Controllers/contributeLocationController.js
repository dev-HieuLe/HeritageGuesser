import db from "../Config/db.js";

const NLP_SERVICE_URL = process.env.NLP_SERVICE_URL || "http://localhost:8000";

/**
 * Parse lat/lng from a Google Maps URL.
 * Supports both:
 *   @lat,lng,...  (Street View / place URLs)
 *   query=lat,lng (simple search URLs)
 */
function parseLatLng(url) {
  // Primary: @lat,lng pattern
  const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (atMatch) {
    return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
  }

  // Fallback: query=lat,lng pattern
  const queryMatch = url.match(/[?&]query=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (queryMatch) {
    return { lat: parseFloat(queryMatch[1]), lng: parseFloat(queryMatch[2]) };
  }

  return null;
}

/**
 * Validate a URL is a Google Maps link.
 */
function isGoogleMapsUrl(url) {
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname === "www.google.com" ||
      parsed.hostname === "maps.google.com" ||
      parsed.hostname === "goo.gl" ||
      parsed.hostname === "maps.app.goo.gl"
    );
  } catch {
    return false;
  }
}

/**
 * POST /api/contribute
 * Submit a new heritage site for review.
 */
export const submitContribution = async (req, res) => {
  const userId = req.user.id;
  const { name, mapsUrl, userDescription } = req.body;

  // --- Validation ---
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({ error: "Heritage name is required." });
  }
  if (name.trim().length > 255) {
    return res
      .status(400)
      .json({ error: "Heritage name is too long (max 255 characters)." });
  }

  if (!mapsUrl || typeof mapsUrl !== "string" || mapsUrl.trim().length === 0) {
    return res.status(400).json({ error: "Google Maps URL is required." });
  }

  const trimmedUrl = mapsUrl.trim();

  if (!isGoogleMapsUrl(trimmedUrl)) {
    return res.status(400).json({
      error:
        "Invalid URL. Please provide a valid Google Maps link (google.com/maps/...).",
    });
  }

  const coords = parseLatLng(trimmedUrl);
  if (!coords) {
    return res.status(400).json({
      error:
        "Could not extract coordinates from the URL. Make sure it's a full Google Maps URL with a location pin (not just a search result).",
    });
  }

  const { lat, lng } = coords;

  // Sanity-check coordinate ranges
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return res
      .status(400)
      .json({ error: "Extracted coordinates are out of valid range." });
  }

  // --- RAG metadata generation via Python NLP service (Qwen on Deep Infra) ---
  let metadata = {
    description: userDescription?.trim() || "",
    era: null,
    built_year: null,
    region: null,
    aliases: null,
    difficulty: 2,
  };

  try {
    const nlpRes = await fetch(`${NLP_SERVICE_URL}/heritage/rag-contribute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        lat,
        lng,
        userDescription: userDescription?.trim() || "",
      }),
      signal: AbortSignal.timeout(60_000), // 60 s — Qwen can be slow
    });

    // 422 = Qwen determined this is NOT a heritage site → reject immediately
    if (nlpRes.status === 422) {
      const body = await nlpRes.json();
      const reason = body?.detail?.reason || "This location does not appear to be a recognised heritage or historical site.";
      return res.status(422).json({ error: reason });
    }

    if (!nlpRes.ok) {
      const errText = await nlpRes.text();
      throw new Error(`NLP service error ${nlpRes.status}: ${errText}`);
    }

    const parsed = await nlpRes.json();

    metadata.description = parsed.description?.trim() || userDescription?.trim() || "";
    metadata.era        = typeof parsed.era === "string" ? parsed.era.trim() : null;
    metadata.built_year = Number.isInteger(parsed.built_year) && parsed.built_year > 0
      ? parsed.built_year : null;
    metadata.region     = typeof parsed.region === "string" ? parsed.region.trim() : null;
    metadata.aliases    = typeof parsed.aliases === "string" ? parsed.aliases.trim() : null;
    metadata.difficulty = [1, 2, 3].includes(parsed.difficulty) ? parsed.difficulty : 2;

    // RAG source tracing — visible in Node.js terminal
    console.log("[RAG TRACE]", JSON.stringify({
      rag_context_used:    parsed.rag_context_used,
      rag_sources:         parsed.rag_sources,
      rag_similarity_note: parsed.rag_similarity_note,
    }, null, 2));
  } catch (err) {
    console.error("RAG metadata generation failed:", err.message);
    if (!metadata.description) {
      metadata.description = `${name.trim()} is a heritage site submitted for review.`;
    }
    metadata.difficulty = 2;
  }

  // --- Insert into DB ---
  try {
    const [result] = await db.execute(
      `INSERT INTO contribute_location
         (name, description, lat, lng, url, user_id, built_year, aliases, region, era, difficulty, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        name.trim(),
        metadata.description,
        lat,
        lng,
        trimmedUrl,
        userId,
        metadata.built_year,
        metadata.aliases,
        metadata.region,
        metadata.era,
        metadata.difficulty,
      ],
    );

    return res.status(201).json({
      message:
        "Your heritage submission has been received and is pending review. Thank you for your contribution!",
      id: result.insertId,
    });
  } catch (err) {
    console.error("DB insert error:", err.message);
    return res
      .status(500)
      .json({ error: "Failed to save your contribution. Please try again." });
  }
};

/**
 * GET /api/contribute
 * Fetch all contributions made by the authenticated user.
 */
export const getUserContributions = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.execute(
      `SELECT id, name, description, lat, lng, built_year, aliases, region, era, difficulty, status, stars, created_at
       FROM contribute_location
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId],
    );

    return res.json(rows);
  } catch (err) {
    console.error("getUserContributions error:", err.message);
    return res
      .status(500)
      .json({ error: "Failed to fetch your contributions." });
  }
};

/**
 * GET /api/contribute/all
 * Fetch all contributed locations (public) with live average rating and current user's rating.
 * Works even if location_ratings table does not exist yet.
 */
export const getAllLocations = async (req, res) => {
  const userId = req.user?.id ?? null;

  // Step 1: always fetch all rows from contribute_location + contributor info
  let rows;
  try {
    [rows] = await db.execute(
      `SELECT cl.id, cl.name, cl.description, cl.region, cl.era,
              cl.built_year, cl.difficulty, cl.status, cl.created_at,
              cl.lat, cl.lng, cl.url,
              u.name AS contributor_name, u.avatar_url AS contributor_avatar
       FROM contribute_location cl
       LEFT JOIN users u ON u.id = cl.user_id
       ORDER BY cl.created_at DESC`,
    );
  } catch (err) {
    console.error("getAllLocations base query error:", err.message);
    return res.status(500).json({ error: "Failed to fetch locations." });
  }

  if (rows.length === 0) return res.json([]);

  // Step 2: try to enrich with ratings (graceful – skipped if table missing)
  let avgMap = {};
  let myMap = {};
  try {
    const ids = rows.map((r) => r.id);
    const placeholders = ids.map(() => "?").join(",");

    const [avgRows] = await db.execute(
      `SELECT location_id, ROUND(AVG(rating), 2) AS stars
       FROM location_ratings
       WHERE source = 'contribute' AND location_id IN (${placeholders})
       GROUP BY location_id`,
      ids,
    );
    avgRows.forEach((r) => { avgMap[r.location_id] = parseFloat(r.stars); });

    if (userId) {
      const [myRows] = await db.execute(
        `SELECT location_id, rating
         FROM location_ratings
         WHERE source = 'contribute' AND location_id IN (${placeholders}) AND user_id = ?`,
        [...ids, userId],
      );
      myRows.forEach((r) => { myMap[r.location_id] = parseFloat(r.rating); });
    }
  } catch {
    // location_ratings table doesn't exist yet — ratings will show as 0
  }

  const result = rows.map((r) => ({
    ...r,
    stars: avgMap[r.id] ?? 0,
    my_rating: myMap[r.id] ?? null,
  }));

  return res.json(result);
};

/**
 * POST /api/contribute/rate/:id
 * Submit or update a star rating (0–5) for a contributed location.
 */
export const rateLocation = async (req, res) => {
  const userId = req.user.id;
  const locationId = parseInt(req.params.id, 10);
  const rating = parseFloat(req.body.rating);

  if (!locationId || isNaN(locationId)) {
    return res.status(400).json({ error: "Invalid location ID." });
  }
  if (isNaN(rating) || rating < 0 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 0 and 5." });
  }

  try {
    // Upsert the individual rating
    await db.execute(
      `INSERT INTO location_ratings (location_id, user_id, rating, source)
       VALUES (?, ?, ?, 'contribute')
       ON DUPLICATE KEY UPDATE rating = VALUES(rating)`,
      [locationId, userId, rating],
    );

    const [[{ avg_stars }]] = await db.execute(
      `SELECT ROUND(AVG(rating), 2) AS avg_stars
       FROM location_ratings WHERE source = 'contribute' AND location_id = ?`,
      [locationId],
    );

    const newStars = parseFloat((avg_stars || 0).toFixed(2));

    return res.json({ stars: newStars, my_rating: rating });
  } catch (err) {
    console.error("rateLocation error:", err.message);
    return res.status(500).json({ error: "Failed to save rating." });
  }
};
