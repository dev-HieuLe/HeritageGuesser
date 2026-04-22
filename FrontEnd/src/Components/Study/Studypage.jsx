import { useState, useEffect, useRef, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { lessons } from "./lessons";
import { AuthContext } from "../../Context/authContext";
import ProgressAnalysis from "./ProgressAnalysis";
import { useLang } from "../../Context/languageContext";
import t from "../../translations";

const SLIDE_INTERVAL = 5700;

export default function StudyPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { lang } = useLang();
  const tx = t[lang].studyPage;
  const CATS = [
    { label: tx.catAll, value: null },
    { label: tx.catNatural, value: "Natural Heritage" },
    { label: tx.catHistorical, value: "Historical Site" },
    { label: tx.catScenic, value: "Scenic Heritage" },
  ];
  const [activeCat, setActiveCat] = useState(null);
  const [search, setSearch] = useState("");

  // Set of lesson IDs the user has permanently read
  const readLessonIds = useMemo(() => {
    if (!user?.id) return new Set();
    const ids = new Set();
    lessons.forEach((l) => {
      if (localStorage.getItem(`lesson_done_${l.id}_${user.id}`)) ids.add(l.id);
    });
    return ids;
  }, [user?.id]);

  // Slider state
  const [slideIdx, setSlideIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState(null);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  const featured = lessons[slideIdx];

  const goTo = (idx) => {
    if (animating || idx === slideIdx) return;
    setPrevIdx(slideIdx);
    setAnimating(true);
    setSlideIdx(idx);
    setTimeout(() => { setPrevIdx(null); setAnimating(false); }, 800);
  };

  const next = () => goTo((slideIdx + 1) % lessons.length);
  const prev = () => goTo((slideIdx - 1 + lessons.length) % lessons.length);

  // Auto-advance — never pauses, even on hover
  useEffect(() => {
    timerRef.current = setInterval(next, SLIDE_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [slideIdx]);

  const filtered = lessons.filter((l) => {
    const matchCat = !activeCat || l.type === activeCat;
    const matchSearch =
      !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      (l.desc[lang] ?? l.desc.en).toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ backgroundColor: "#12140e", minHeight: "100vh", color: "#e3e3d9" }}>

      {/* ── HERO SLIDER ── */}
      <div style={{ position: "relative", height: 540, overflow: "hidden" }}>
        {/* Slides */}
        {lessons.map((l, i) => {
          const isCurrent = i === slideIdx;
          const isPrev = i === prevIdx;
          if (!isCurrent && !isPrev) return null;
          return (
            <div
              key={l.id}
              style={{
                position: "absolute", inset: 0,
                opacity: isCurrent ? 1 : 0,
                transition: "opacity 0.85s cubic-bezier(0.4,0,0.2,1)",
                zIndex: isCurrent ? 2 : 1,
              }}
            >
              <img
                src={l.images[0]}
                alt={l.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
              />
            </div>
          );
        })}

        {/* Persistent overlays */}
        <div style={{ position: "absolute", inset: 0, zIndex: 3, background: "linear-gradient(to right, rgba(14,18,12,0.97) 0%, rgba(14,18,12,0.6) 52%, rgba(14,18,12,0.08) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 3, background: "linear-gradient(to top, rgba(14,18,12,0.96) 0%, transparent 38%)" }} />

        {/* Hero text — cross-fades with slide */}
        <div
          key={slideIdx}
          style={{
            position: "absolute", top: "50%", left: 48, transform: "translateY(-52%)",
            maxWidth: 560, zIndex: 4,
            animation: "heroFadeIn 0.55s ease forwards",
          }}
        >
          {/* Category pill */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, backgroundColor: "rgba(162,209,187,0.1)", border: "1px solid rgba(162,209,187,0.25)", borderRadius: 24, padding: "5px 16px", marginBottom: 18 }}>
            <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.18em", color: "#a2d1bb" }}>
              ✦ {featured.typeVi.toUpperCase()}
            </span>
          </div>

          <h1 style={{ fontSize: 38, fontWeight: 900, color: "#fff", lineHeight: 1.15, marginBottom: 14, textTransform: "uppercase" }}>
            {featured.name}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.1em", backgroundColor: "#a2d1bb", color: "#12140e", padding: "4px 11px", borderRadius: 4 }}>
              🔥 {tx.newest}
            </span>
            <span style={{ fontSize: 13, color: "rgba(192,200,195,0.5)" }}>
              ⏱ {featured.year}
            </span>
          </div>

          <p style={{ fontSize: 14, color: "rgba(192,200,195,0.82)", lineHeight: 1.7, marginBottom: 26 }}>
            {featured.desc[lang] ?? featured.desc.en}
          </p>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              onClick={() => navigate(`/study/${featured.id}`)}
              style={{ display: "flex", alignItems: "center", gap: 8, backgroundColor: "#a2d1bb", color: "#12140e", border: "none", borderRadius: 24, padding: "12px 26px", fontSize: 13, fontWeight: 900, cursor: "pointer", letterSpacing: "0.06em" }}
            >
              ▶ {tx.readNow}
            </button>
            <button
              style={{ width: 42, height: 42, borderRadius: "50%", border: "1px solid rgba(162,209,187,0.3)", backgroundColor: "rgba(162,209,187,0.08)", cursor: "pointer", color: "rgba(162,209,187,0.65)", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              ♡
            </button>
          </div>
        </div>

        {/* Arrow controls */}
        <button
          onClick={prev}
          style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", zIndex: 6, ...arrowBtn }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chevron_left</span>
        </button>
        <button
          onClick={next}
          style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", zIndex: 6, ...arrowBtn }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chevron_right</span>
        </button>

        {/* Thumbnail strip + progress dots */}
        <div style={{ position: "absolute", bottom: 18, right: 28, zIndex: 5, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
          {/* Thumbnails */}
          <div style={{ display: "flex", gap: 8 }}>
            {lessons.slice(0, 4).map((l, i) => (
              <button
                key={l.id}
                onClick={() => goTo(i)}
                style={{
                  width: 88, height: 60, borderRadius: 8, overflow: "hidden",
                  border: i === slideIdx ? "2px solid #a2d1bb" : "2px solid rgba(162,209,187,0.18)",
                  cursor: "pointer", padding: 0, background: "none",
                  position: "relative", flexShrink: 0,
                  opacity: i === slideIdx ? 1 : 0.65,
                  transition: "opacity 0.2s, border-color 0.2s",
                }}
              >
                <img src={l.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(14,18,12,0.85) 0%, transparent 55%)" }} />
                <span style={{ position: "absolute", bottom: 3, left: 4, right: 4, fontSize: 6, fontWeight: 900, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", lineHeight: 1.25 }}>
                  {l.name.split(" ").slice(0, 3).join(" ")}
                </span>
              </button>
            ))}
          </div>

          {/* Progress dots */}
          <div style={{ display: "flex", gap: 5 }}>
            {lessons.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                style={{
                  width: i === slideIdx ? 22 : 6, height: 6,
                  borderRadius: 3, border: "none", padding: 0, cursor: "pointer",
                  backgroundColor: i === slideIdx ? "#a2d1bb" : "rgba(162,209,187,0.25)",
                  transition: "width 0.3s, background-color 0.3s",
                }}
              />
            ))}
          </div>
        </div>

        {/* Auto-play progress bar */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, zIndex: 5, backgroundColor: "rgba(162,209,187,0.1)" }}>
          <div
            key={`${slideIdx}-bar`}
            style={{
              height: "100%", backgroundColor: "#a2d1bb",
              animation: `slideProgress ${SLIDE_INTERVAL}ms linear forwards`,
            }}
          />
        </div>
      </div>

      {/* ── SEARCH + FILTERS ── */}
      <div style={{ padding: "22px 32px 0" }}>
        {/* Search bar */}
        <div style={{ position: "relative", marginBottom: 16 }}>
          <span className="material-symbols-outlined" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 18, color: "rgba(162,209,187,0.38)", pointerEvents: "none" }}>
            search
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={tx.searchPlaceholder}
            style={{ width: "100%", padding: "13px 48px 13px 46px", borderRadius: 32, backgroundColor: "rgba(255,255,255,0.035)", border: "1px solid rgba(162,209,187,0.12)", color: "#e3e3d9", fontSize: 13, outline: "none", boxSizing: "border-box" }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(162,209,187,0.4)", fontSize: 16 }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Category tabs */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 16 }}>
          {CATS.map((c) => (
            <button
              key={c.label}
              onClick={() => setActiveCat(c.value)}
              style={{
                padding: "8px 20px", borderRadius: 24, whiteSpace: "nowrap", cursor: "pointer",
                fontSize: 11, fontWeight: 900, letterSpacing: "0.08em",
                border: activeCat === c.value ? "none" : "1px solid rgba(162,209,187,0.18)",
                backgroundColor: activeCat === c.value ? "#a2d1bb" : "#1e201a",
                color: activeCat === c.value ? "#12140e" : "rgba(162,209,187,0.75)",
                transition: "all 0.15s",
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CARD GRID ── */}
      <div style={{ padding: "8px 32px 52px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
        {filtered.map((l) => (
          <LessonCard key={l.id} lesson={l} isRead={readLessonIds.has(l.id)} onClick={() => navigate(`/study/${l.id}`)} tx={tx} lang={lang} />
        ))}
        {!filtered.length && (
          <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "rgba(192,200,195,0.25)", fontSize: 13, padding: "60px 0" }}>
            {tx.noResults}
          </p>
        )}
      </div>

      {/* ── PROGRESS ANALYSIS ── */}
      <ProgressAnalysis />

      {/* ── KEYFRAME STYLES ── */}
      <style>{`
        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateY(calc(-52% + 12px)); }
          to   { opacity: 1; transform: translateY(-52%); }
        }
        @keyframes slideProgress {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}

// ── Lesson card ────────────────────────────────────────────────────────────────
function LessonCard({ lesson, onClick, isRead = false, tx, lang = "vi" }) {
  const lessonType = lang === "vi" ? lesson.typeVi : lang === "cn" ? lesson.typeCn : lang === "fr" ? (lesson.typeFr ?? lesson.typeEn) : lesson.typeEn;
  const lessonDesc = lesson.desc[lang] ?? lesson.desc.en;
  const [imgErr, setImgErr] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "#1a1c16",
        borderRadius: 18,
        overflow: "hidden",
        cursor: "pointer",
        border: hovered ? `1px solid ${lesson.typeColor}` : "1px solid rgba(65,73,68,0.5)",
        boxShadow: hovered
          ? `0 0 0 1px ${lesson.typeColor}55, 0 16px 40px rgba(0,0,0,0.55)`
          : "none",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        transition: "transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease",
      }}
    >
      {/* Image section */}
      <div style={{ position: "relative", height: 190, backgroundColor: "#12140e", overflow: "hidden" }}>
        {!imgErr
          ? (
            <img
              src={lesson.images[0]}
              alt={lesson.name}
              onError={() => setImgErr(true)}
              style={{ width: "100%", height: "100%", objectFit: "cover", transform: hovered ? "scale(1.04)" : "scale(1)", transition: "transform 0.35s ease" }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 44, color: "rgba(162,209,187,0.12)" }}>{lesson.icon}</span>
            </div>
          )
        }
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(14,18,12,0.9) 0%, transparent 52%)" }} />

        {/* Category badge */}
        <div style={{
          position: "absolute", top: 10, left: 10,
          backgroundColor: hovered ? `${lesson.typeColor}22` : lesson.typeBg,
          border: `1px solid ${lesson.typeColor}${hovered ? "88" : "44"}`,
          borderRadius: 4, padding: "3px 9px",
          transition: "background-color 0.2s, border-color 0.2s",
        }}>
          <span style={{ fontSize: 8, fontWeight: 900, color: lesson.typeColor, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            {lessonType}
          </span>
        </div>

        {/* Read badge */}
        {isRead && (
          <div style={{
            position: "absolute", top: 10, right: 10,
            display: "flex", alignItems: "center", gap: 4,
            backgroundColor: "rgba(8,26,18,0.88)", border: "1px solid rgba(162,209,187,0.35)",
            borderRadius: 4, padding: "3px 8px", backdropFilter: "blur(6px)",
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 11, color: "#a2d1bb", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span style={{ fontSize: 8, fontWeight: 900, color: "#a2d1bb", letterSpacing: "0.1em", textTransform: "uppercase" }}>{tx.readBadge}</span>
          </div>
        )}

        {/* Image-area name watermark */}
        <div style={{ position: "absolute", bottom: 10, left: 12, right: 12 }}>
          <p style={{ fontSize: 9, fontWeight: 900, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.04em", lineHeight: 1.3, margin: 0 }}>
            {lesson.name}
          </p>
          <p style={{ fontSize: 7.5, color: "rgba(255,255,255,0.3)", margin: "2px 0 0", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {lesson.altNames.split(";")[0].trim()}
          </p>
        </div>
      </div>

      {/* Text content */}
      <div style={{ padding: "14px 16px" }}>
        <h3 style={{
          fontSize: 14, fontWeight: 900, color: hovered ? "#fff" : "#e3e3d9",
          lineHeight: 1.35, marginBottom: 8, textTransform: "uppercase",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          transition: "color 0.2s",
        }}>
          {lesson.name}
        </h3>
        <p style={{ fontSize: 12, color: "rgba(192,200,195,0.6)", lineHeight: 1.6, marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {lessonDesc}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${hovered ? lesson.typeColor + "33" : "rgba(65,73,68,0.4)"}`, paddingTop: 10, transition: "border-color 0.2s" }}>
          <span style={{ fontSize: 11, color: "rgba(192,200,195,0.38)" }}>{lesson.year}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: hovered ? lesson.typeColor : "#a2d1bb", letterSpacing: "0.04em", transition: "color 0.2s" }}>
            {tx.viewBtn}
          </span>
        </div>
      </div>
    </div>
  );
}

const arrowBtn = {
  width: 36, height: 36, borderRadius: "50%",
  border: "1px solid rgba(162,209,187,0.25)",
  backgroundColor: "rgba(14,18,12,0.65)",
  backdropFilter: "blur(6px)",
  color: "rgba(162,209,187,0.8)",
  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
  transition: "background-color 0.15s",
};
