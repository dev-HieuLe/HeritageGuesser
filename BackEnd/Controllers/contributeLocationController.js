import db from "../Config/db.js";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.deepinfra.com/v1/openai",
  apiKey: process.env.DEEPINFRA_API_KEY,
});

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
    return res.status(400).json({ error: "Heritage name is too long (max 255 characters)." });
  }

  if (!mapsUrl || typeof mapsUrl !== "string" || mapsUrl.trim().length === 0) {
    return res.status(400).json({ error: "Google Maps URL is required." });
  }

  const trimmedUrl = mapsUrl.trim();

  if (!isGoogleMapsUrl(trimmedUrl)) {
    return res.status(400).json({
      error: "Invalid URL. Please provide a valid Google Maps link (google.com/maps/...).",
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
    return res.status(400).json({ error: "Extracted coordinates are out of valid range." });
  }

  // --- Gemini 2.5 Flash metadata generation ---
  let metadata = {
    description: userDescription?.trim() || "",
    era: null,
    built_year: null,
    region: null,
    aliases: null,
    difficulty: 2,
  };

  try {
    const descriptionHint = userDescription?.trim()
      ? `User hint: "${userDescription.trim()}"`
      : "No additional description provided.";

    const prompt = `
You are an expert on Vietnamese cultural heritage sites. A user has submitted a heritage location with the following details:
- Name: "${name.trim()}"
- Coordinates: latitude ${lat}, longitude ${lng}
- ${descriptionHint}

Please provide structured metadata about this location in valid JSON format ONLY (no markdown, no code fences, no extra text):
{
  "description": "A detailed 2–3 sentence description of the site's cultural and historical significance",
  "era": "The historical era or dynasty (e.g. 'Lý Dynasty', 'French Colonial', 'Modern Era', 'Prehistoric') or null if unknown",
  "built_year": A four-digit integer year the site was built/founded, or null if unknown or if it's a natural site,
  "region": "The Vietnamese region name (e.g. 'Hanoi', 'Ho Chi Minh City', 'Hue', 'Hoi An', 'Da Nang', 'Ninh Binh') or the closest city/province",
  "aliases": "Comma-separated alternative names or null if none",
  "difficulty": An integer from 1 to 3 (1=well-known tourist site, 2=moderately known, 3=obscure or specialised)
}
`.trim();

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: process.env.DEEPINFRA_GEMMA_MODEL || "google/gemma-4-26B-A4B-it",
    });
    const raw = completion.choices[0].message.content.trim();

    // Strip possible markdown fences
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const parsed = JSON.parse(cleaned);

    metadata.description =
      parsed.description?.trim() || userDescription?.trim() || "";
    metadata.era = typeof parsed.era === "string" ? parsed.era.trim() : null;
    metadata.built_year =
      Number.isInteger(parsed.built_year) && parsed.built_year > 0
        ? parsed.built_year
        : null;
    metadata.region =
      typeof parsed.region === "string" ? parsed.region.trim() : null;
    metadata.aliases =
      typeof parsed.aliases === "string" ? parsed.aliases.trim() : null;
    metadata.difficulty = [1, 2, 3].includes(parsed.difficulty)
      ? parsed.difficulty
      : 2;
  } catch (err) {
    console.error("Gemini metadata generation failed:", err.message);
    // Non-fatal: proceed with whatever we have; description may be empty
    if (!metadata.description) {
      metadata.description = `${name.trim()} is a heritage site submitted for review.`;
    }
    metadata.difficulty = 2;
  }

  // --- Insert into DB ---
  try {
    const [result] = await db.execute(
      `INSERT INTO contribute_location
         (name, description, lat, lng, user_id, built_year, aliases, region, era, difficulty, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        name.trim(),
        metadata.description,
        lat,
        lng,
        userId,
        metadata.built_year,
        metadata.aliases,
        metadata.region,
        metadata.era,
        metadata.difficulty,
      ]
    );

    return res.status(201).json({
      message: "Your heritage submission has been received and is pending review. Thank you for your contribution!",
      id: result.insertId,
    });
  } catch (err) {
    console.error("DB insert error:", err.message);
    return res.status(500).json({ error: "Failed to save your contribution. Please try again." });
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
      `SELECT id, name, description, lat, lng, built_year, aliases, region, era, difficulty, status, created_at
       FROM contribute_location
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    return res.json(rows);
  } catch (err) {
    console.error("getUserContributions error:", err.message);
    return res.status(500).json({ error: "Failed to fetch your contributions." });
  }
};
