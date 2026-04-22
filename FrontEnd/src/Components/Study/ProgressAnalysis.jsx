import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/authContext";
import { useLang } from "../../Context/languageContext";
import t from "../../translations";

const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function streetViewThumb(lat, lng, size = "400x220") {
  return `https://maps.googleapis.com/maps/api/streetview?size=${size}&location=${lat},${lng}&fov=90&pitch=0&key=${MAPS_KEY}`;
}

// ── Stat tile ────────────────────────────────────────────────────────────────
function StatTile({ icon, label, value, sub, color = "#a2d1bb" }) {
  return (
    <div
      style={{
        backgroundColor: "rgba(30,32,26,0.85)",
        border: "1px solid rgba(162,209,187,0.12)",
        borderRadius: 16,
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        flex: "1 1 140px",
        minWidth: 130,
      }}
    >
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span style={{ fontSize: 22, fontWeight: 900, color, lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: 10, fontWeight: 700, color: "#e3e3d9", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</span>
      {sub && <span style={{ fontSize: 10, color: "rgba(192,200,195,0.45)", marginTop: 2 }}>{sub}</span>}
    </div>
  );
}

// ── Suggestion card ───────────────────────────────────────────────────────────
function SuggestionCard({ icon, title, detail, index }) {
  const colors = ["#a2d1bb", "#e9c349", "#ffb4a9"];
  const color = colors[index % colors.length];
  return (
    <div
      style={{
        backgroundColor: "rgba(30,32,26,0.7)",
        border: `1px solid ${color}22`,
        borderLeft: `3px solid ${color}`,
        borderRadius: 14,
        padding: "16px 18px",
        display: "flex",
        gap: 14,
        alignItems: "flex-start",
      }}
    >
      <span style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <div>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: "#e3e3d9", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {title}
        </p>
        <p style={{ margin: 0, fontSize: 12, color: "rgba(192,200,195,0.7)", lineHeight: 1.65 }}>{detail}</p>
      </div>
    </div>
  );
}

// ── Bar chart for distributions ───────────────────────────────────────────────
function DistributionBar({ label, data, color }) {
  const total = Object.values(data).reduce((s, v) => s + v, 0) || 1;
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);

  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 900, letterSpacing: "0.12em", color: "rgba(162,209,187,0.55)", textTransform: "uppercase" }}>
        {label}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {entries.map(([key, val]) => {
          const pct = Math.round((val / total) * 100);
          return (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 10, color: "rgba(192,200,195,0.6)", width: 130, flexShrink: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {key}
              </span>
              <div style={{ flex: 1, height: 6, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${pct}%`,
                    height: "100%",
                    backgroundColor: color,
                    borderRadius: 3,
                    transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
                  }}
                />
              </div>
              <span style={{ fontSize: 10, color: "rgba(192,200,195,0.4)", width: 34, textAlign: "right", flexShrink: 0 }}>
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Skeleton loader ───────────────────────────────────────────────────────────
function Skeleton({ height = 16, width = "100%", mb = 8 }) {
  return (
    <div
      style={{
        height,
        width,
        borderRadius: 8,
        backgroundColor: "rgba(162,209,187,0.06)",
        marginBottom: mb,
        animation: "skeletonPulse 1.6s ease-in-out infinite",
      }}
    />
  );
}

// ── Wrong location card ───────────────────────────────────────────────────────
function WrongLocationCard({ loc, lang }) {
  const [tipStatus, setTipStatus] = useState("idle"); // idle | loading | done | error
  const [tip, setTip] = useState(null);
  const [imgErr, setImgErr] = useState(false);
  const T = t[lang].wrongLocations;

  const handleTip = async () => {
    setTipStatus("loading");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/player/history/wrong-locations/${loc.id}/tip?lang=${lang}`,
        { withCredentials: true }
      );
      setTip(res.data.tip);
      setTipStatus("done");
    } catch {
      setTipStatus("error");
    }
  };

  const focusColor = tip?.focusArea === "name" ? "#a2d1bb" : tip?.focusArea === "age" ? "#ffb4a9" : "#e9c349";

  return (
    <div
      style={{
        backgroundColor: "rgba(22,24,18,0.9)",
        border: "1px solid rgba(255,180,169,0.15)",
        borderRadius: 16,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: "relative", height: 130, backgroundColor: "#0e120c", overflow: "hidden", flexShrink: 0 }}>
        {!imgErr && MAPS_KEY ? (
          <img
            src={streetViewThumb(loc.lat, loc.lng)}
            alt={loc.name}
            onError={() => setImgErr(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 36, color: "rgba(255,180,169,0.2)" }}>location_on</span>
          </div>
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(14,18,12,0.92) 0%, transparent 55%)" }} />
        {/* Wrong count badge */}
        <div style={{
          position: "absolute", top: 8, right: 8,
          backgroundColor: "rgba(255,80,80,0.85)", borderRadius: 8,
          padding: "3px 9px", display: "flex", alignItems: "center", gap: 4,
        }}>
          <span style={{ fontSize: 9, fontWeight: 900, color: "#fff", letterSpacing: "0.08em" }}>
            {T.wrongCount(loc.wrong_count)}
          </span>
        </div>
        {/* Street View link */}
        <a
          href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${loc.lat},${loc.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Open in Street View"
          style={{
            position: "absolute", bottom: 8, left: 8,
            display: "flex", alignItems: "center", gap: 4,
            backgroundColor: "rgba(14,18,12,0.78)", backdropFilter: "blur(4px)",
            border: "1px solid rgba(162,209,187,0.25)", borderRadius: 7,
            padding: "4px 9px", textDecoration: "none",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 12, color: "#a2d1bb" }}>panorama_photosphere</span>
          <span style={{ fontSize: 9, fontWeight: 800, color: "#a2d1bb", letterSpacing: "0.07em" }}>Street View</span>
        </a>
      </div>

      {/* Info */}
      <div style={{ padding: "12px 14px 14px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: "#e3e3d9", lineHeight: 1.35, textTransform: "uppercase" }}>
          {loc.name}
        </p>
        <p style={{ margin: 0, fontSize: 10, color: "rgba(192,200,195,0.45)", letterSpacing: "0.04em" }}>
          {loc.region || "Vietnam"}
        </p>
        {/* Score bars */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
          {[
            { label: T.nameLabel, val: loc.avg_name_score, max: 5, color: "#a2d1bb" },
            { label: T.yearLabel, val: loc.avg_age_score, max: 5, color: "#ffb4a9" },
          ].map(({ label, val, max, color }) => {
            const pct = val != null ? Math.round(((val || 0) / max) * 100) : 0;
            return (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 9, color: "rgba(192,200,195,0.45)", width: 26, flexShrink: 0 }}>{label}</span>
                <div style={{ flex: 1, height: 4, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", backgroundColor: color, borderRadius: 2 }} />
                </div>
                <span style={{ fontSize: 9, color: "rgba(192,200,195,0.4)", width: 28, textAlign: "right", flexShrink: 0 }}>
                  {val != null ? `${val}/${max}` : "-"}
                </span>
              </div>
            );
          })}
        </div>

        {/* AI Tip button / result */}
        {tipStatus === "idle" && (
          <button
            onClick={handleTip}
            style={{
              marginTop: 8,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              backgroundColor: "rgba(162,209,187,0.08)",
              border: "1px solid rgba(162,209,187,0.2)",
              borderRadius: 10, padding: "8px 12px",
              fontSize: 10, fontWeight: 800, color: "#a2d1bb",
              cursor: "pointer", letterSpacing: "0.06em",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>auto_awesome</span>
            {T.aiBtn}
          </button>
        )}

        {tipStatus === "loading" && (
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", backgroundColor: "rgba(162,209,187,0.04)", borderRadius: 10, border: "1px solid rgba(162,209,187,0.1)" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#a2d1bb", animation: "skeletonPulse 1s ease-in-out infinite", flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: "rgba(162,209,187,0.5)" }}>{T.aiLoading}</span>
          </div>
        )}

        {tipStatus === "error" && (
          <button
            onClick={handleTip}
            style={{ marginTop: 8, fontSize: 10, color: "rgba(255,180,169,0.6)", background: "none", border: "1px solid rgba(255,180,169,0.15)", borderRadius: 10, padding: "7px 12px", cursor: "pointer" }}
          >
            {T.retry}
          </button>
        )}

        {tipStatus === "done" && tip && (
          <div style={{ marginTop: 8, backgroundColor: `rgba(${focusColor === "#a2d1bb" ? "162,209,187" : focusColor === "#ffb4a9" ? "255,180,169" : "233,195,73"},0.05)`, border: `1px solid ${focusColor}22`, borderLeft: `3px solid ${focusColor}`, borderRadius: 10, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
            <p style={{ margin: 0, fontSize: 11, color: "rgba(227,227,217,0.85)", lineHeight: 1.6 }}>{tip.tip}</p>
            {tip.memoryHook && (
              <p style={{ margin: 0, fontSize: 10, color: `${focusColor}cc`, lineHeight: 1.5 }}>
                💡 {tip.memoryHook}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Wrong locations section ───────────────────────────────────────────────────
function WrongLocationsSection() {
  const { auth } = useContext(AuthContext);
  const { lang } = useLang();
  const T = t[lang].wrongLocations;
  const [status, setStatus] = useState("idle"); // idle | loading | done | error | empty
  const [locations, setLocations] = useState([]);

  const handleLoad = async () => {
    if (!auth) return;
    setStatus("loading");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/player/history/wrong-locations`,
        { withCredentials: true }
      );
      if (!res.data.locations?.length) {
        setStatus("empty");
      } else {
        setLocations(res.data.locations);
        setStatus("done");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section style={{ margin: "0 32px 64px", borderTop: "1px solid rgba(162,209,187,0.1)", paddingTop: 52 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, backgroundColor: "rgba(255,180,169,0.08)", border: "1px solid rgba(255,180,169,0.18)", borderRadius: 24, padding: "5px 14px", marginBottom: 14 }}>
          <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.18em", color: "#ffb4a9" }}>✦ {T.badge}</span>
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: "#fff", lineHeight: 1.2, margin: "0 0 10px", textTransform: "uppercase" }}>
          {T.title}
        </h2>
        <p style={{ fontSize: 13, color: "rgba(192,200,195,0.55)", margin: 0, maxWidth: 480, lineHeight: 1.65 }}>
          {T.subtitle}
        </p>
      </div>

      {status === "idle" && (
        <div style={{ backgroundColor: "rgba(18,20,14,0.6)", border: "1px dashed rgba(255,180,169,0.18)", borderRadius: 20, padding: "36px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", backgroundColor: "rgba(255,180,169,0.08)", border: "1px solid rgba(255,180,169,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 26, color: "#ffb4a9" }}>crisis_alert</span>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#e3e3d9" }}>
                {auth ? T.loadLabel : T.loginLabel}
              </p>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "rgba(192,200,195,0.45)" }}>
                {auth ? T.loadSub : T.loginSub}
              </p>
            </div>
          </div>
          {auth ? (
            <button
              onClick={handleLoad}
              style={{ display: "flex", alignItems: "center", gap: 8, backgroundColor: "#ffb4a9", color: "#12140e", border: "none", borderRadius: 24, padding: "13px 28px", fontSize: 12, fontWeight: 900, cursor: "pointer", letterSpacing: "0.07em", textTransform: "uppercase", whiteSpace: "nowrap" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 17 }}>search</span>
              {T.loadBtn}
            </button>
          ) : (
            <span style={{ fontSize: 12, color: "rgba(255,180,169,0.4)", fontStyle: "italic" }}>{T.notLoggedIn}</span>
          )}
        </div>
      )}

      {status === "loading" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ backgroundColor: "rgba(22,24,18,0.9)", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,180,169,0.1)" }}>
              <Skeleton height={130} mb={0} />
              <div style={{ padding: "12px 14px" }}>
                <Skeleton height={14} width="80%" />
                <Skeleton height={10} width="50%" />
              </div>
            </div>
          ))}
        </div>
      )}

      {status === "empty" && (
        <div style={{ backgroundColor: "rgba(18,20,14,0.6)", border: "1px solid rgba(162,209,187,0.1)", borderRadius: 20, padding: "40px 36px", textAlign: "center" }}>
          <span style={{ fontSize: 36, display: "block", marginBottom: 14 }}>🎉</span>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#e3e3d9", marginBottom: 8 }}>{T.empty}</p>
          <p style={{ margin: 0, fontSize: 12, color: "rgba(192,200,195,0.5)", lineHeight: 1.65 }}>{T.emptySub}</p>
          <button onClick={() => setStatus("idle")} style={{ marginTop: 16, background: "none", border: "1px solid rgba(162,209,187,0.2)", borderRadius: 24, padding: "8px 20px", fontSize: 11, color: "rgba(162,209,187,0.6)", cursor: "pointer" }}>
            {T.back}
          </button>
        </div>
      )}

      {status === "error" && (
        <div style={{ backgroundColor: "rgba(18,20,14,0.6)", border: "1px solid rgba(255,180,169,0.15)", borderRadius: 20, padding: "36px", textAlign: "center" }}>
          <span style={{ fontSize: 28, display: "block", marginBottom: 12 }}>⚠️</span>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(192,200,195,0.6)" }}>{T.errorMsg}</p>
          <button onClick={() => setStatus("idle")} style={{ marginTop: 16, background: "none", border: "1px solid rgba(255,180,169,0.2)", borderRadius: 24, padding: "8px 20px", fontSize: 11, color: "rgba(255,180,169,0.6)", cursor: "pointer" }}>{T.retry}</button>
        </div>
      )}

      {status === "done" && locations.length > 0 && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {locations.map((loc) => <WrongLocationCard key={loc.id} loc={loc} lang={lang} />)}
          </div>
          <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={() => { setStatus("idle"); setLocations([]); }}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px solid rgba(255,180,169,0.2)", borderRadius: 24, padding: "8px 18px", fontSize: 11, color: "rgba(255,180,169,0.5)", cursor: "pointer", letterSpacing: "0.05em" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>refresh</span>
              {T.refresh}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ProgressAnalysis() {
  const { auth } = useContext(AuthContext);
  const { lang } = useLang();
  const T = t[lang].progressAnalysis;
  const [status, setStatus] = useState("idle"); // idle | loading | done | error | insufficient
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!auth) return;
    setStatus("loading");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/player/history/analyze`,
        { withCredentials: true }
      );
      if (res.data.notEnoughData) {
        setStatus("insufficient");
      } else {
        setResult(res.data);
        setStatus("done");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
    <section
      style={{
        margin: "0 32px 64px",
        borderTop: "1px solid rgba(162,209,187,0.1)",
        paddingTop: 52,
      }}
    >
      {/* ── Section Header ── */}
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            backgroundColor: "rgba(162,209,187,0.08)",
            border: "1px solid rgba(162,209,187,0.18)",
            borderRadius: 24,
            padding: "5px 14px",
            marginBottom: 14,
          }}
        >
          <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.18em", color: "#a2d1bb" }}>
            ✦ {T.badge}
          </span>
        </div>
        <h2
          style={{
            fontSize: 26,
            fontWeight: 900,
            color: "#fff",
            lineHeight: 1.2,
            margin: "0 0 10px",
            textTransform: "uppercase",
          }}
        >
          {T.title}
        </h2>
        <p style={{ fontSize: 13, color: "rgba(192,200,195,0.55)", margin: 0, maxWidth: 480, lineHeight: 1.65 }}>
          {T.subtitle}
        </p>
      </div>

      {/* ── CTA — idle ── */}
      {status === "idle" && (
        <div
          style={{
            backgroundColor: "rgba(18,20,14,0.6)",
            border: "1px dashed rgba(162,209,187,0.18)",
            borderRadius: 20,
            padding: "40px 36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                backgroundColor: "rgba(162,209,187,0.08)",
                border: "1px solid rgba(162,209,187,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 26, color: "#a2d1bb" }}>
                analytics
              </span>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#e3e3d9" }}>
                {auth ? T.readyLabel : T.loginLabel}
              </p>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "rgba(192,200,195,0.45)" }}>
                {auth ? T.readySub : T.loginSub}
              </p>
            </div>
          </div>
          {auth ? (
            <button
              onClick={handleAnalyze}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                backgroundColor: "#a2d1bb",
                color: "#12140e",
                border: "none",
                borderRadius: 24,
                padding: "13px 28px",
                fontSize: 12,
                fontWeight: 900,
                cursor: "pointer",
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 17 }}>auto_awesome</span>
              {T.analyzeBtn}
            </button>
          ) : (
            <span style={{ fontSize: 12, color: "rgba(162,209,187,0.4)", fontStyle: "italic" }}>
              {T.notLoggedIn}
            </span>
          )}
        </div>
      )}

      {/* ── Loading skeleton ── */}
      {status === "loading" && (
        <div
          style={{
            backgroundColor: "rgba(18,20,14,0.6)",
            border: "1px solid rgba(162,209,187,0.1)",
            borderRadius: 20,
            padding: "36px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#a2d1bb",
                animation: "skeletonPulse 1s ease-in-out infinite",
              }}
            />
            <span style={{ fontSize: 11, color: "rgba(162,209,187,0.55)", letterSpacing: "0.1em" }}>
              {T.loadingLabel}
            </span>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} height={88} width={140} mb={0} />)}
          </div>
          <Skeleton height={14} width="90%" />
          <Skeleton height={14} width="75%" />
          <Skeleton height={14} width="55%" mb={20} />
          <Skeleton height={70} mb={10} />
          <Skeleton height={70} mb={10} />
          <Skeleton height={70} />
        </div>
      )}

      {/* ── Insufficient data ── */}
      {status === "insufficient" && (
        <div
          style={{
            backgroundColor: "rgba(18,20,14,0.6)",
            border: "1px solid rgba(162,209,187,0.1)",
            borderRadius: 20,
            padding: "40px 36px",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: 36, display: "block", marginBottom: 14 }}>🎮</span>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#e3e3d9", marginBottom: 8 }}>
            {T.needMoreData}
          </p>
          <p style={{ margin: 0, fontSize: 12, color: "rgba(192,200,195,0.5)", lineHeight: 1.65 }}>
            {T.needMoreDataSub}
          </p>
          <button
            onClick={() => setStatus("idle")}
            style={{ marginTop: 20, background: "none", border: "1px solid rgba(162,209,187,0.2)", borderRadius: 24, padding: "8px 20px", fontSize: 11, color: "rgba(162,209,187,0.6)", cursor: "pointer" }}
          >
            {T.back}
          </button>
        </div>
      )}

      {/* ── Error ── */}
      {status === "error" && (
        <div
          style={{
            backgroundColor: "rgba(18,20,14,0.6)",
            border: "1px solid rgba(255,180,169,0.15)",
            borderRadius: 20,
            padding: "36px",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: 28, display: "block", marginBottom: 12 }}>⚠️</span>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(192,200,195,0.6)" }}>
            {T.errorMsg}
          </p>
          <button
            onClick={() => setStatus("idle")}
            style={{ marginTop: 16, background: "none", border: "1px solid rgba(255,180,169,0.2)", borderRadius: 24, padding: "8px 20px", fontSize: 11, color: "rgba(255,180,169,0.6)", cursor: "pointer" }}
          >
            {T.retry}
          </button>
        </div>
      )}

      {/* ── Results ── */}
      {status === "done" && result && (() => {
        const { analysis, stats } = result;
        const hasRegions = stats.regionCount && Object.keys(stats.regionCount).length > 0;
        const hasEras    = stats.eraCount    && Object.keys(stats.eraCount).length    > 0;

        return (
          <div
            style={{
              backgroundColor: "rgba(14,16,11,0.7)",
              border: "1px solid rgba(162,209,187,0.13)",
              borderRadius: 20,
              overflow: "hidden",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Top accent bar */}
            <div style={{ height: 3, background: "linear-gradient(to right, #a2d1bb, #e9c349, #ffb4a9)" }} />

            <div style={{ padding: "32px 32px 36px" }}>

              {/* ── Stat tiles ── */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
                <StatTile icon="🎮" label={T.totalGames} value={stats.total} color="#a2d1bb" />
                <StatTile
                  icon="⭐"
                  label={T.avgScore}
                  value={`${stats.avgScore}/10`}
                  sub={stats.recentAvg != null ? `${T.recent}: ${stats.recentAvg}/10` : undefined}
                  color="#e9c349"
                />
                <StatTile icon="🏛️" label={T.nameRecog} value={`${stats.avgName}/5`} color="#a2d1bb" />
                <StatTile icon="📅" label={T.ageGuess} value={`${stats.avgAge}/5`} color="#ffb4a9" />
              </div>

              {/* ── AI Summary ── */}
              {analysis?.overallSummary && (
                <div
                  style={{
                    backgroundColor: "rgba(162,209,187,0.04)",
                    border: "1px solid rgba(162,209,187,0.12)",
                    borderRadius: 14,
                    padding: "18px 20px",
                    marginBottom: 24,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#a2d1bb" }}>
                      auto_awesome
                    </span>
                    <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.15em", color: "rgba(162,209,187,0.6)", textTransform: "uppercase" }}>
                      {T.summaryLabel}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: "rgba(227,227,217,0.85)", lineHeight: 1.7 }}>
                    {analysis.overallSummary}
                  </p>
                </div>
              )}

              {/* ── Strengths / Weaknesses ── */}
              {(analysis?.strengths?.length > 0 || analysis?.weaknesses?.length > 0) && (
                <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
                  {analysis.strengths?.length > 0 && (
                    <div
                      style={{
                        flex: "1 1 200px",
                        backgroundColor: "rgba(162,209,187,0.04)",
                        border: "1px solid rgba(162,209,187,0.12)",
                        borderRadius: 14,
                        padding: "16px 18px",
                      }}
                    >
                      <p style={{ margin: "0 0 10px", fontSize: 9, fontWeight: 900, letterSpacing: "0.15em", color: "#a2d1bb", textTransform: "uppercase" }}>
                        ✦ {T.strengths}
                      </p>
                      <ul style={{ margin: 0, padding: "0 0 0 16px" }}>
                        {analysis.strengths.map((s, i) => (
                          <li key={i} style={{ fontSize: 12, color: "rgba(192,200,195,0.75)", lineHeight: 1.6, marginBottom: 4 }}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysis.weaknesses?.length > 0 && (
                    <div
                      style={{
                        flex: "1 1 200px",
                        backgroundColor: "rgba(255,180,169,0.04)",
                        border: "1px solid rgba(255,180,169,0.12)",
                        borderRadius: 14,
                        padding: "16px 18px",
                      }}
                    >
                      <p style={{ margin: "0 0 10px", fontSize: 9, fontWeight: 900, letterSpacing: "0.15em", color: "#ffb4a9", textTransform: "uppercase" }}>
                        ✦ {T.weaknesses}
                      </p>
                      <ul style={{ margin: 0, padding: "0 0 0 16px" }}>
                        {analysis.weaknesses.map((w, i) => (
                          <li key={i} style={{ fontSize: 12, color: "rgba(192,200,195,0.75)", lineHeight: 1.6, marginBottom: 4 }}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* ── Distribution charts ── */}
              {(hasRegions || hasEras) && (
                <div style={{ display: "flex", gap: 28, marginBottom: 24, flexWrap: "wrap" }}>
                  {hasRegions && (
                    <div style={{ flex: "1 1 220px" }}>
                      <DistributionBar label={T.regionDist} data={stats.regionCount} color="#a2d1bb" />
                    </div>
                  )}
                  {hasEras && (
                    <div style={{ flex: "1 1 220px" }}>
                      <DistributionBar label={T.eraDist} data={stats.eraCount} color="#e9c349" />
                    </div>
                  )}
                </div>
              )}

              {/* ── Suggestions ── */}
              {analysis?.suggestions?.length > 0 && (
                <div style={{ marginBottom: 22 }}>
                  <p style={{ margin: "0 0 12px", fontSize: 9, fontWeight: 900, letterSpacing: "0.15em", color: "rgba(162,209,187,0.5)", textTransform: "uppercase" }}>
                    ✦ {T.suggestions}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {analysis.suggestions.map((s, i) => (
                      <SuggestionCard key={i} icon={s.icon} title={s.title} detail={s.detail} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {/* ── Motivational note ── */}
              {analysis?.motivationalNote && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    backgroundColor: "rgba(233,195,73,0.05)",
                    border: "1px solid rgba(233,195,73,0.12)",
                    borderRadius: 12,
                    padding: "14px 18px",
                  }}
                >
                  <span style={{ fontSize: 16, flexShrink: 0 }}>✨</span>
                  <p style={{ margin: 0, fontSize: 12, color: "rgba(233,195,73,0.8)", fontStyle: "italic", lineHeight: 1.55 }}>
                    {analysis.motivationalNote}
                  </p>
                </div>
              )}

              {/* Re-analyze */}
              <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => { setStatus("idle"); setResult(null); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "none",
                    border: "1px solid rgba(162,209,187,0.2)",
                    borderRadius: 24,
                    padding: "8px 18px",
                    fontSize: 11,
                    color: "rgba(162,209,187,0.5)",
                    cursor: "pointer",
                    letterSpacing: "0.05em",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 13 }}>refresh</span>
                  {T.reanalyze}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes skeletonPulse {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.9; }
        }
      `}</style>
    </section>
    <WrongLocationsSection />
    </>
  );
}
