import db from "../Config/db.js";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.deepinfra.com/v1/openai",
  apiKey: process.env.DEEPINFRA_API_KEY,
});

export const getTodayCount = async (req, res) => {
  try {
    const userId = req.user.id;
    // Use GMT+7 (Vietnam time) for the daily reset boundary
    const gmt7Now = new Date(Date.now() + 7 * 60 * 60 * 1000);
    const today = gmt7Now.toISOString().slice(0, 10); // YYYY-MM-DD in GMT+7
    const [rows] = await db.execute(
      `SELECT COUNT(*) as count FROM player_history WHERE user_id = ? AND DATE(date_played + INTERVAL 7 HOUR) = ?`,
      [userId, today]
    );
    res.json({ count: rows[0].count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch today's count" });
  }
};

export const recordHistory = async (req, res) => {
  try {
    const userId = req.user.id; // from verifyUser middleware
    const { locationId, score, nameScore, ageScore, difficulty } = req.body;

    await db.execute(
      `INSERT INTO player_history (user_id, location_id, score, name_score, age_score, difficulty)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, locationId, score, nameScore, ageScore, difficulty || 1]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to record history" });
  }
};

export const getWrongLocations = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.execute(
      `SELECT
        l.id, l.name, l.region, l.lat, l.lng,
        COUNT(*) AS wrong_count,
        ROUND(AVG(ph.score), 1) AS avg_score,
        ROUND(AVG(ph.name_score), 1) AS avg_name_score,
        ROUND(AVG(ph.age_score), 1) AS avg_age_score
       FROM player_history ph
       LEFT JOIN locations l ON ph.location_id = l.id
       WHERE ph.user_id = ? AND ph.score < 5
       GROUP BY l.id, l.name, l.region, l.lat, l.lng
       ORDER BY wrong_count DESC, avg_score ASC
       LIMIT 20`,
      [userId]
    );

    res.json({ locations: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch wrong locations" });
  }
};

export const getLocationPracticeTip = async (req, res) => {
  try {
    const userId = req.user.id;
    const locationId = parseInt(req.params.id, 10);

    // Get the location info + player's history for this location
    const [[locRows], [histRows]] = await Promise.all([
      db.execute(`SELECT id, name, region, built_year FROM locations WHERE id = ?`, [locationId]),
      db.execute(
        `SELECT score, name_score, age_score, difficulty, date_played
         FROM player_history
         WHERE user_id = ? AND location_id = ?
         ORDER BY date_played DESC
         LIMIT 20`,
        [userId, locationId]
      ),
    ]);

    if (!locRows.length) return res.status(404).json({ error: "Location not found" });

    const loc = locRows[0];
    const wrongPlays = histRows.filter((r) => r.score < 5);
    const totalPlays = histRows.length;
    const avgScore = totalPlays
      ? +(histRows.reduce((s, r) => s + (r.score || 0), 0) / totalPlays).toFixed(1)
      : 0;
    const avgName = totalPlays
      ? +(histRows.reduce((s, r) => s + (r.name_score || 0), 0) / totalPlays).toFixed(1)
      : 0;
    const avgAge = totalPlays
      ? +(histRows.reduce((s, r) => s + (r.age_score || 0), 0) / totalPlays).toFixed(1)
      : 0;

    const lang = req.query.lang === "vi" ? "vi" : "en";
  const langInstruction = lang === "vi"
    ? "Respond entirely in Vietnamese."
    : "Respond entirely in English.";

  const prompt = `You are a Vietnamese heritage learning coach for HeritageGuesser game.
A player keeps getting this location wrong:

Location: ${loc.name}
Region: ${loc.region || "Vietnam"}
Built year: ${loc.built_year || "unknown"}
Player stats for this location:
- Total attempts: ${totalPlays}
- Wrong attempts (score < 5): ${wrongPlays.length}
- Average total score: ${avgScore}/10
- Average name recognition score: ${avgName}/5
- Average age/era estimation score: ${avgAge}/5

Give a short, specific, actionable practice guide to help the player improve on this location.
${langInstruction}
Respond ONLY with valid JSON (no markdown):
{
  "tip": "2-3 sentences with specific advice on how to remember this location's name, appearance, and historical era",
  "memoryHook": "one memorable fact or visual clue to help identify this location",
  "focusArea": "name" | "age" | "both"
}`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: process.env.DEEPINFRA_GEMMA_MODEL || "google/gemma-4-26B-A4B-it",
    });

    let tip;
    try {
      const raw = completion.choices[0].message.content.trim();
      const match = raw.match(/\{[\s\S]*\}/);
      tip = JSON.parse(match ? match[0] : raw);
    } catch {
      tip = { tip: completion.choices[0].message.content, memoryHook: "", focusArea: "both" };
    }

    res.json({ tip, location: loc });
  } catch (err) {
    console.error("Practice tip error:", err.message);
    res.status(500).json({ error: "Failed to generate practice tip" });
  }
};

export const analyzeProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.execute(
      `SELECT
        ph.score, ph.name_score, ph.age_score, ph.difficulty, ph.date_played,
        l.name AS location_name, l.region, l.built_year
       FROM player_history ph
       LEFT JOIN locations l ON ph.location_id = l.id
       WHERE ph.user_id = ?
       ORDER BY ph.date_played DESC
       LIMIT 150`,
      [userId]
    );

    if (rows.length < 3) {
      return res.json({ analysis: null, notEnoughData: true, stats: { total: rows.length } });
    }

    const total = rows.length;
    const avgScore   = +(rows.reduce((s, r) => s + (r.score      || 0), 0) / total).toFixed(2);
    const avgName    = +(rows.reduce((s, r) => s + (r.name_score || 0), 0) / total).toFixed(2);
    const avgAge     = +(rows.reduce((s, r) => s + (r.age_score  || 0), 0) / total).toFixed(2);

    // Region distribution
    const regionCount = {};
    rows.forEach((r) => {
      if (r.region) regionCount[r.region] = (regionCount[r.region] || 0) + 1;
    });

    // Era distribution (group by century)
    const eraCount = {};
    rows.forEach((r) => {
      if (r.built_year != null) {
        const century = Math.floor(r.built_year / 100) * 100;
        const label = century <= 0 ? "Ancient (pre-1st century)" : `${century}s`;
        eraCount[label] = (eraCount[label] || 0) + 1;
      }
    });

    // Difficulty breakdown
    const diffCount = { Easy: 0, Medium: 0, Hard: 0 };
    rows.forEach((r) => {
      if (r.difficulty === 1) diffCount.Easy++;
      else if (r.difficulty === 2) diffCount.Medium++;
      else if (r.difficulty === 3) diffCount.Hard++;
    });

    // Recent trend (last 10 vs all older)
    const recent = rows.slice(0, 10);
    const older  = rows.slice(10);
    const recentAvg = +(recent.reduce((s, r) => s + (r.score || 0), 0) / recent.length).toFixed(2);
    const olderAvg  = older.length
      ? +(older.reduce((s, r) => s + (r.score || 0), 0) / older.length).toFixed(2)
      : null;

    const stats = { total, avgScore, avgName, avgAge, regionCount, eraCount, diffCount, recentAvg, olderAvg };

    const prompt = `You are an educational analyst for HeritageGuesser, a Vietnamese heritage learning game.
Analyze this player's gaming data and return personalized insights in JSON.

Player stats:
- Total games: ${total}
- Avg total score: ${avgScore}/10
- Avg name recognition score: ${avgName}/5
- Avg age/era estimation score: ${avgAge}/5
- Regions explored: ${JSON.stringify(regionCount)}
- Historical eras explored: ${JSON.stringify(eraCount)}
- Difficulty played: ${JSON.stringify(diffCount)}
- Recent 10 games avg score: ${recentAvg} vs overall avg: ${avgScore}${olderAvg ? ` (older avg: ${olderAvg})` : ""}

Respond with ONLY valid JSON (no markdown, no extra text) in this exact structure:
{
  "overallSummary": "2-3 sentence honest summary of performance and learning pattern",
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "suggestions": [
    {
      "type": "region",
      "icon": "🗺️",
      "title": "short title",
      "detail": "specific actionable suggestion about which Vietnamese region to explore more"
    },
    {
      "type": "era",
      "icon": "⏳",
      "title": "short title",
      "detail": "specific suggestion about which historical period/era to study"
    },
    {
      "type": "skill",
      "icon": "🎯",
      "title": "short title",
      "detail": "suggestion about improving name recognition or age estimation based on their scores"
    }
  ],
  "motivationalNote": "one encouraging sentence in Vietnamese heritage context"
}`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: process.env.DEEPINFRA_GEMMA_MODEL || "google/gemma-4-26B-A4B-it",
    });

    let analysis;
    try {
      const raw = completion.choices[0].message.content.trim();
      const match = raw.match(/\{[\s\S]*\}/);
      analysis = JSON.parse(match ? match[0] : raw);
    } catch {
      analysis = {
        overallSummary: completion.choices[0].message.content,
        strengths: [],
        weaknesses: [],
        suggestions: [],
        motivationalNote: "",
      };
    }

    res.json({ analysis, stats });
  } catch (err) {
    console.error("Progress analysis error:", err.message);
    res.status(500).json({ error: "Failed to analyze progress" });
  }
};
