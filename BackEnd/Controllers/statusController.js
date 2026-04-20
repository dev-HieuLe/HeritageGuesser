import db from "../Config/db.js";

// Run once in your DB:
// CREATE TABLE IF NOT EXISTS site_stats (
//   month VARCHAR(7) PRIMARY KEY,
//   streetview_loads INT DEFAULT 0
// );

const MONTHLY_SV_LIMIT = 4800;

export const getSiteStatus = async (_req, res) => {
  try {
    const month = new Date().toISOString().slice(0, 7); // YYYY-MM
    const [rows] = await db.execute(
      `SELECT streetview_loads FROM site_stats WHERE month = ?`,
      [month]
    );
    const loads = rows[0]?.streetview_loads || 0;
    res.json({ maintenanceMode: loads >= MONTHLY_SV_LIMIT, loads });
  } catch (err) {
    console.error("getSiteStatus error:", err);
    res.status(500).json({ error: "Failed to get status" });
  }
};

// Called once per game session. Atomically increments only if under limit.
export const recordStreetViewLoad = async (_req, res) => {
  try {
    const month = new Date().toISOString().slice(0, 7);

    // Ensure row exists
    await db.execute(
      `INSERT INTO site_stats (month, streetview_loads) VALUES (?, 0)
       ON DUPLICATE KEY UPDATE month = month`,
      [month]
    );

    // Atomically increment only if still under limit — 0 rows = already at limit
    const [result] = await db.execute(
      `UPDATE site_stats SET streetview_loads = streetview_loads + 1
       WHERE month = ? AND streetview_loads < ?`,
      [month, MONTHLY_SV_LIMIT]
    );

    if (result.affectedRows === 0) {
      return res.status(403).json({ maintenanceMode: true });
    }

    const [rows] = await db.execute(
      `SELECT streetview_loads FROM site_stats WHERE month = ?`,
      [month]
    );
    res.json({ ok: true, loads: rows[0]?.streetview_loads });
  } catch (err) {
    console.error("recordStreetViewLoad error:", err);
    res.status(500).json({ error: "Failed to record load" });
  }
};
