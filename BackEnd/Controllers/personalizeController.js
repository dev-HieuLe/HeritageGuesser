import db from "../Config/db.js";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.deepinfra.com/v1/openai",
  apiKey: process.env.ZAI_API_KEY,
});

// 🧠 In-memory cache (resets on server restart)
const personalizeCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Purge expired cache entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of personalizeCache) {
    if (now - val.time > CACHE_TTL) personalizeCache.delete(key);
  }
}, 10 * 60 * 1000);

// 🕐 Rate-limit cooldown memory
let lastRateLimitTime = 0;

export const getPersonalizedNextSet = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("🎯 Personalization request for user:", userId);

    // ✅ Cache check — use if <5 min old
    const cached = personalizeCache.get(userId);
    if (cached && Date.now() - cached.time < 5 * 60 * 1000) {
      console.log("✅ Using cached personalization for user:", userId);
      return res.json(cached.data);
    }

    // ✅ Fetch user history
    const [historyRows] = await db.execute(
      `SELECT ph.*, l.region, l.difficulty, l.era
       FROM player_history ph
       JOIN locations l ON l.id = ph.location_id
       WHERE ph.user_id = ?
       ORDER BY ph.date_played DESC
       LIMIT 30`,
      [userId]
    );

    // ✅ No history → random fallback
    if (!historyRows.length) {
      const [rows] = await db.execute(
        "SELECT * FROM locations ORDER BY RAND() LIMIT 3"
      );
      const response = {
        strategy: "random",
        reason: "No history yet",
        locations: rows,
      };
      personalizeCache.set(userId, { time: Date.now(), data: response });
      return res.json(response);
    }

    // ✅ Simplify history
    const simplifiedHistory = historyRows.map((h) => ({
      location_id: h.location_id,
      score: Number(h.score),
      region: h.region,
      difficulty: h.difficulty,
      date_played: h.date_played,
    }));

    // ✅ Prompt for ZAI
    const prompt = `
You are a personalization engine. Given the user's play history (array of objects), choose 3 location selection strategies to help the player improve.

Return JSON only:
{
  "reason": "<short explanation>",
  "filters": { "region": "<region|null>", "min_difficulty": <int>, "max_difficulty": <int> },
  "pick_strategy": "mix|focus_weak|more_challenging|review",
  "sample_sql_hint": "SELECT id FROM locations WHERE ... ORDER BY RAND() LIMIT 3"
}

User history (most recent first):
${JSON.stringify(simplifiedHistory)}
`;

    // 🧩 Handle ZAI API call safely
    let rawText = "";

    try {
      // 🧊 If recently rate-limited, skip call for a short cooldown
      if (Date.now() - lastRateLimitTime < 10 * 1000) {
        console.warn("⚠️ ZAI still in cooldown. Using fallback.");
        const fallback = await fallbackHeuristic(
          simplifiedHistory,
          db,
          "ZAI in cooldown"
        );
        personalizeCache.set(userId, { time: Date.now(), data: fallback });
        return res.json(fallback);
      }

      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "zai-org/GLM-5.1",
      });
      rawText = completion.choices[0].message.content;
    } catch (apiError) {
      console.error("❌ ZAI API error:", apiError.message || apiError);

      if (apiError.status === 429 || apiError.status === 503) {
        lastRateLimitTime = Date.now();
        console.warn(
          `⚠️ ZAI temporarily unavailable (${apiError.status}). Cooldown applied.`
        );
      }

      const fallback = await fallbackHeuristic(
        simplifiedHistory,
        db,
        "ZAI API failure"
      );
      personalizeCache.set(userId, { time: Date.now(), data: fallback });
      return res.json(fallback);
    }

    // ✅ Parse ZAI JSON
    let json;
    try {
      json = sanitizeAndParse(rawText);
    } catch (err) {
      console.warn("⚠️ Invalid ZAI output. Using fallback:", err.message);
      const fallback = await fallbackHeuristic(
        simplifiedHistory,
        db,
        "Invalid ZAI output"
      );
      personalizeCache.set(userId, { time: Date.now(), data: fallback });
      return res.json(fallback);
    }

    // ✅ Apply ZAI filters
    let query = "SELECT * FROM locations";
    const params = [];
    const conditions = [];

    if (json.filters?.region) {
      conditions.push("region = ?");
      params.push(json.filters.region);
    }
    if (json.filters?.min_difficulty != null) {
      conditions.push("difficulty >= ?");
      params.push(json.filters.min_difficulty);
    }
    if (json.filters?.max_difficulty != null) {
      conditions.push("difficulty <= ?");
      params.push(json.filters.max_difficulty);
    }

    if (conditions.length) query += " WHERE " + conditions.join(" AND ");
    query += " ORDER BY RAND() LIMIT 3";

    // ✅ Get personalized results
    const [rows] = await db.execute(query, params);
    const response = {
      strategy: json.pick_strategy || "mix",
      reason: json.reason || "Generated by ZAI GLM-5.1",
      locations: rows,
    };

    // ✅ Cache & send
    personalizeCache.set(userId, { time: Date.now(), data: response });
    // 🔧 Convert numeric fields to numbers
    response.locations = response.locations.map((loc) => ({
      ...loc,
      lat: Number(loc.lat),
      lng: Number(loc.lng),
      difficulty: Number(loc.difficulty),
      built_year: loc.built_year ? Number(loc.built_year) : null,
    }));

    console.log("🧩 Final response before send:", response);
    res.json(response);
  } catch (err) {
    console.error("❌ Personalize internal error:", err);
    res.status(500).json({ error: "Failed to generate personalized set" });
  }
};

// 🧹 Helper: sanitize & parse JSON response
function sanitizeAndParse(text) {
  if (!text || typeof text !== "string")
    throw new Error("Empty response");

  // quick normalizations
  let cleaned = text
    .replace(/[\u2018\u2019\u201C\u201D]/g, '"') // smart quotes -> "
    .replace(/```json|```/g, "") // remove code fences
    .trim();

  // helper: find first balanced JSON block (object or array)
  const findBalancedJSON = (str) => {
    const starts = ["{", "["];
    for (let startChar of starts) {
      const startIdx = str.indexOf(startChar);
      if (startIdx === -1) continue;

      let level = 0;
      let inString = false;
      let escape = false;
      for (let i = startIdx; i < str.length; i++) {
        const ch = str[i];

        if (escape) {
          escape = false;
          continue;
        }
        if (ch === "\\") {
          escape = true;
          continue;
        }
        if (ch === '"') {
          inString = !inString;
          continue;
        }
        if (!inString) {
          if (ch === startChar) {
            level++;
          } else if (
            (startChar === "{" && ch === "}") ||
            (startChar === "[" && ch === "]")
          ) {
            level--;
            if (level === 0) {
              // return substring from startIdx..i inclusive
              return str.slice(startIdx, i + 1);
            }
          }
        }
      }
    }
    return null;
  };

  const jsonText = findBalancedJSON(cleaned);
  if (!jsonText) {
    // For debugging, include a short preview of the raw text
    const preview =
      cleaned.length > 1000 ? cleaned.slice(0, 1000) + "..." : cleaned;
    const err = new Error(
      "No valid JSON block found in response. Preview: " + preview
    );
    err.raw = cleaned;
    throw err;
  }

  // Remove trailing commas before closing braces/brackets (simple safe fix)
  const stripTrailingCommas = (s) => s.replace(/,(\s*[}\]])/g, "$1");

  const finalText = stripTrailingCommas(jsonText);

  // Parse JSON safely
  try {
    return JSON.parse(finalText);
  } catch (parseErr) {
    const e = new Error(
      "Failed to JSON.parse extracted block: " + parseErr.message
    );
    e.rawExtract = finalText;
    e.original = parseErr;
    throw e;
  }
}

//
// 🧭 Fallback heuristic if ZAI fails
//
async function fallbackHeuristic(history, db, reasonMsg) {
  try {
    const regionStats = {};
    history.forEach((h) => {
      regionStats[h.region] = regionStats[h.region] || { total: 0, count: 0 };
      regionStats[h.region].total += h.score;
      regionStats[h.region].count++;
    });

    const worstRegion = Object.entries(regionStats).sort(
      (a, b) => a[1].total / a[1].count - b[1].total / b[1].count
    )[0]?.[0];

    const [rows] = await db.execute(
      "SELECT * FROM locations WHERE region = ? ORDER BY RAND() LIMIT 3",
      [worstRegion || "North"]
    );

    return {
      strategy: "focus_weak",
      reason: `Fallback: ${reasonMsg} — focusing on weakest region`,
      locations: rows,
    };
  } catch (error) {
    console.error("❌ Fallback heuristic failed:", error.message);
    const [rows] = await db.execute(
      "SELECT * FROM locations ORDER BY RAND() LIMIT 3"
    );

    return {
      strategy: "random",
      reason: `Emergency fallback — ${reasonMsg}`,
      locations: rows,
    };
  }
}
