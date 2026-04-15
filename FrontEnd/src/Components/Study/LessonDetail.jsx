import { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { lessons } from "./lessons";
import { AuthContext } from "../../Context/authContext";

const FONT_SIZES = [13, 16, 19];

export default function LessonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lesson = lessons.find((l) => l.id === Number(id));
  const { user, addPoints } = useContext(AuthContext);

  const [fontIdx, setFontIdx] = useState(1);
  const [copied, setCopied] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [imgErrors, setImgErrors] = useState({});
  // Permanent key — never expires (marks lesson as read forever)
  const doneKey = user ? `lesson_done_${lesson.id}_${user.id}` : null;
  // Daily key — for points eligibility (resets each day)
  const todayKey = user ? `lesson_read_${lesson.id}_${user.id}_${new Date().toDateString()}` : null;
  const [readDone, setReadDone] = useState(() => !!doneKey && !!localStorage.getItem(doneKey));

  const handleFinishReading = () => {
    if (!user || readDone) return;
    // Mark as permanently read
    localStorage.setItem(doneKey, "1");
    setReadDone(true);
    // Award points only once per day
    if (todayKey && !localStorage.getItem(todayKey)) {
      localStorage.setItem(todayKey, "1");
      addPoints(5, "Lesson Read");
    }
  };

  if (!lesson) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, backgroundColor: "#12140e" }}>
        <span className="material-symbols-outlined" style={{ fontSize: 48, color: "rgba(162,209,187,0.18)" }}>search_off</span>
        <p style={{ color: "rgba(192,200,195,0.3)", fontSize: 13 }}>Bài học không tồn tại.</p>
        <button
          onClick={() => navigate("/study")}
          style={{ padding: "8px 18px", borderRadius: 8, border: "1px solid rgba(162,209,187,0.2)", backgroundColor: "rgba(162,209,187,0.06)", color: "#a2d1bb", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
        >
          ← Quay lại
        </button>
      </div>
    );
  }

  const fs = FONT_SIZES[fontIdx];
  const visibleImages = lesson.images.filter((_, i) => !imgErrors[i]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const goTo = (newId) => {
    navigate(`/study/${newId}`);
    setActiveImg(0);
    setImgErrors({});
  };

  return (
    <div style={{ backgroundColor: "#12140e", minHeight: "100vh", color: "#e3e3d9" }}>

      {/* ── TOP TOOLBAR ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "9px 32px",
        borderBottom: "1px solid rgba(65,73,68,0.3)",
        position: "sticky", top: 64, zIndex: 20,
        backgroundColor: "rgba(18,20,14,0.95)", backdropFilter: "blur(8px)",
      }}>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setFontIdx((f) => Math.max(0, f - 1))} disabled={fontIdx === 0} style={toolBtnStyle(fontIdx === 0)}>A-</button>
          <button onClick={() => setFontIdx((f) => Math.min(2, f + 1))} disabled={fontIdx === 2} style={toolBtnStyle(fontIdx === 2)}>A+</button>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => navigate("/study")} style={toolBtnStyle(false)} title="Danh sách bài học">
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>menu_book</span>
          </button>
        </div>
      </div>

      {/* ── BODY: Sidebar + Article ── */}
      <div style={{ display: "flex", maxWidth: 1120, margin: "0 auto" }}>

        {/* ── SIDEBAR ── */}
        <aside style={{
          width: 224, flexShrink: 0,
          position: "sticky", top: 112, alignSelf: "flex-start",
          padding: "28px 20px 28px 28px",
          borderRight: "1px solid rgba(65,73,68,0.3)",
        }}>
          {/* Back */}
          <button
            onClick={() => navigate("/study")}
            style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", color: "rgba(192,200,195,0.45)", fontSize: 11, fontWeight: 900, padding: 0, marginBottom: 22, letterSpacing: "0.1em" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>arrow_back</span>
            QUAY LẠI
          </button>

          {/* Meta */}
          <div style={{ borderTop: "1px solid rgba(65,73,68,0.35)", paddingTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
            <MetaItem label="CHUYÊN MỤC" value={lesson.typeVi.toUpperCase()} valueStyle={{ color: lesson.typeColor, fontWeight: 900 }} />
            <MetaItem label="VỊ TRÍ" value={lesson.location} />
            <MetaItem label="GIAI ĐOẠN" value={lesson.era} />
            <MetaItem label="NĂM" value={lesson.year} />
          </div>

          {/* Copy link */}
          <button
            onClick={handleCopy}
            style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", color: copied ? "#a2d1bb" : "rgba(162,209,187,0.5)", fontSize: 10, fontWeight: 900, padding: "16px 0 0", letterSpacing: "0.07em", marginTop: 16, width: "100%", borderTop: "1px solid rgba(65,73,68,0.35)" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>link</span>
            {copied ? "ĐÃ SAO CHÉP!" : "SAO CHÉP LINK"}
          </button>

          {/* Prev / Next nav */}
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 7 }}>
            {lesson.id > 1 && (
              <button onClick={() => goTo(lesson.id - 1)} style={navSmallBtnStyle}>
                <span className="material-symbols-outlined" style={{ fontSize: 12 }}>arrow_back</span> BÀI TRƯỚC
              </button>
            )}
            {lesson.id < lessons.length && (
              <button onClick={() => goTo(lesson.id + 1)} style={navSmallBtnStyle}>
                BÀI TIẾP <span className="material-symbols-outlined" style={{ fontSize: 12 }}>arrow_forward</span>
              </button>
            )}
          </div>
        </aside>

        {/* ── MAIN ARTICLE ── */}
        <main style={{ flex: 1, padding: "36px 52px 60px 40px", minWidth: 0 }}>

          {/* Hero image */}
          {visibleImages.length > 0 && (
            <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", marginBottom: 28, backgroundColor: "#1a1c16", border: "1px solid rgba(65,73,68,0.3)" }}>
              <img
                src={lesson.images[activeImg] ?? lesson.images[0]}
                alt={lesson.name}
                onError={() => setImgErrors((p) => ({ ...p, [activeImg]: true }))}
                style={{ width: "100%", height: 310, objectFit: "cover", display: "block" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(14,18,12,0.55) 0%, transparent 45%)", pointerEvents: "none" }} />
              {lesson.images.length > 1 && (
                <div style={{ position: "absolute", bottom: 12, right: 12, display: "flex", gap: 6 }}>
                  {lesson.images.map((src, i) =>
                    !imgErrors[i] && (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        style={{ width: 52, height: 38, borderRadius: 6, overflow: "hidden", border: i === activeImg ? "2px solid #a2d1bb" : "2px solid rgba(162,209,187,0.25)", cursor: "pointer", padding: 0, background: "none" }}
                      >
                        <img src={src} alt="" onError={() => setImgErrors((p) => ({ ...p, [i]: true }))} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          )}

          {/* Title block */}
          <div style={{ marginBottom: 24 }}>
            <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: "0.14em", backgroundColor: lesson.typeBg, color: lesson.typeColor, padding: "3px 10px", borderRadius: 4, textTransform: "uppercase", display: "inline-block", marginBottom: 12 }}>
              {lesson.typeVi}
            </span>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: "#e3e3d9", lineHeight: 1.25, marginBottom: 8 }}>
              {lesson.name}
            </h1>
            <p style={{ fontSize: 12, color: "rgba(192,200,195,0.4)", fontStyle: "italic" }}>
              {lesson.altNames}
            </p>
          </div>

          {/* Lead / intro */}
          <p style={{ fontSize: fs + 1, lineHeight: 1.85, color: "#e3e3d9", fontWeight: 500, marginBottom: 20, textAlign: "justify", borderLeft: "3px solid rgba(162,209,187,0.35)", paddingLeft: 16 }}>
            {lesson.desc}
          </p>

          <div style={{ height: 1, backgroundColor: "rgba(65,73,68,0.35)", margin: "20px 0" }} />

          {/* Article paragraphs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {lesson.paragraphs.map((para, i) => (
              <p key={i} style={{ fontSize: fs, lineHeight: 1.85, color: "rgba(192,200,195,0.85)", margin: 0, textAlign: "justify" }}>
                {para}
              </p>
            ))}
          </div>

          {/* Sources */}
          <div style={{ marginTop: 40, padding: "18px 22px", borderRadius: 12, backgroundColor: "#1a1c16", border: "1px solid rgba(65,73,68,0.4)" }}>
            <p style={{ fontSize: 8, fontWeight: 900, letterSpacing: "0.14em", color: "rgba(162,209,187,0.4)", textTransform: "uppercase", marginBottom: 10 }}>
              NGUỒN THAM KHẢO
            </p>
            <ul style={{ margin: 0, padding: "0 0 0 14px", display: "flex", flexDirection: "column", gap: 5 }}>
              {lesson.sources.map((s, i) => (
                <li key={i} style={{ fontSize: 12, color: "rgba(192,200,195,0.5)", lineHeight: 1.65 }}>{s}</li>
              ))}
            </ul>
          </div>

          {/* Finish Reading button */}
          {user && (
            <div style={{ marginTop: 28, display: "flex", justifyContent: "center" }}>
              <button
                onClick={handleFinishReading}
                disabled={readDone}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "12px 28px", borderRadius: 10,
                  background: readDone ? "rgba(162,209,187,0.07)" : "linear-gradient(135deg, #0f3d2e, #a2d1bb)",
                  border: readDone ? "1px solid rgba(162,209,187,0.2)" : "none",
                  color: readDone ? "#a2d1bb" : "#073829",
                  fontWeight: 800, fontSize: 12, letterSpacing: "0.08em",
                  textTransform: "uppercase", cursor: readDone ? "default" : "pointer",
                  opacity: readDone ? 0.7 : 1, transition: "all 0.2s",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: readDone ? "'FILL' 1" : "'FILL' 0" }}>
                  {readDone ? "check_circle" : "menu_book"}
                </span>
                {readDone ? "Đã hoàn thành (+5 pts)" : "Đánh dấu đã đọc · +5 pts"}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function MetaItem({ label, value, valueStyle = {} }) {
  return (
    <div>
      <p style={{ fontSize: 8, fontWeight: 900, letterSpacing: "0.14em", color: "rgba(192,200,195,0.28)", textTransform: "uppercase", marginBottom: 3 }}>
        {label}
      </p>
      <p style={{ fontSize: 12, color: "rgba(192,200,195,0.75)", fontWeight: 600, margin: 0, ...valueStyle }}>
        {value}
      </p>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const toolBtnStyle = (disabled) => ({
  padding: "5px 12px",
  borderRadius: 6,
  border: "1px solid rgba(65,73,68,0.5)",
  backgroundColor: "#1e201a",
  color: disabled ? "rgba(192,200,195,0.2)" : "rgba(192,200,195,0.7)",
  fontSize: 12,
  fontWeight: 700,
  cursor: disabled ? "default" : "pointer",
  letterSpacing: "0.04em",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 4,
});

const navSmallBtnStyle = {
  display: "flex",
  alignItems: "center",
  gap: 5,
  padding: "7px 10px",
  borderRadius: 6,
  border: "1px solid rgba(65,73,68,0.35)",
  backgroundColor: "rgba(162,209,187,0.04)",
  color: "rgba(162,209,187,0.6)",
  fontSize: 9,
  fontWeight: 900,
  cursor: "pointer",
  letterSpacing: "0.08em",
  width: "100%",
  justifyContent: "center",
};
