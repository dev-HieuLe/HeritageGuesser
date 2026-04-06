// Controllers/DiscoverController.js
import axios from "axios";

// 🧠 In-memory store
const usageMap = new Map();

// Purge stale entries once per hour to prevent memory leak
setInterval(() => {
  const today = new Date().toISOString().split("T")[0];
  for (const [key, val] of usageMap) {
    if (val.date !== today) usageMap.delete(key);
  }
}, 60 * 60 * 1000);

export const searchDiscover = async (req, res) => {
  const q = (req.query.query || "").trim();
  const userId = req.user?.id || req.ip; // fallback to IP

  if (!q) return res.status(400).json({ error: "Query is required" });

  try {
    const today = new Date().toISOString().split("T")[0];

    // Initialize user record
    if (!usageMap.has(userId)) {
      usageMap.set(userId, { date: today, count: 0 });
    }

    const userData = usageMap.get(userId);

    // Reset if new day
    if (userData.date !== today) {
      userData.date = today;
      userData.count = 0;
    }

    // 🛑 LIMIT CHECK
    if (userData.count >= 4) {
      return res.status(429).json({
        error: "Daily Street View limit reached (4/day)",
      });
    }

    // 🔍 Google API call
    const GOOGLE_KEY = process.env.GOOGLE_MAPS_API_KEY;

    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: { address: q, key: GOOGLE_KEY },
      },
    );

    if (!data.results || data.results.length === 0) {
      return res.status(404).json({ error: "No results found" });
    }

    const first = data.results[0];

    // ✅ INCREMENT USAGE
    userData.count++;

    return res.json({
      place: {
        name:
          first.address_components?.[0]?.long_name ||
          first.formatted_address ||
          q,
        lat: first.geometry.location.lat,
        lng: first.geometry.location.lng,
      },
      remaining: 4 - userData.count,
    });
  } catch (err) {
    console.error("Discover error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
