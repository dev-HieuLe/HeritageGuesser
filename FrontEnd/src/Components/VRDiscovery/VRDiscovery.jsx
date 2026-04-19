import { useState, useEffect, useRef } from "react";
import { useLang } from "../../Context/languageContext";
import t from "../../translations";
import { vrLocations } from "./vrLocations";
import VRMode from "./VRMode";

// ── Onboarding steps shown before VR launches ──────────────────────────────
const STEPS = [
  {
    icon: "screen_rotation",
    title: "Rotate Your Phone",
    titleVi: "Xoay Màn Hình",
    desc: "Hold your phone horizontally in landscape mode.",
    descVi: "Giữ điện thoại ngang theo chiều landscape.",
    color: "#a2d1bb",
  },
  {
    icon: "view_in_ar",
    title: "Insert Into Cardboard",
    titleVi: "Đặt Vào Kính VR",
    desc: "Slide your phone into your Google Cardboard headset.",
    descVi: "Đặt điện thoại vào kính Google Cardboard.",
    color: "#e9c349",
  },
  {
    icon: "visibility",
    title: "Put On the Headset",
    titleVi: "Đeo Kính Vào",
    desc: "Hold the headset up to your eyes and adjust the lenses.",
    descVi: "Đưa kính lên mắt và điều chỉnh thấu kính cho rõ.",
    color: "#a2d1bb",
  },
  {
    icon: "rocket_launch",
    title: "Entering the Space…",
    titleVi: "Đang Mở Không Gian…",
    desc: "Stay still — the panorama is loading.",
    descVi: "Giữ nguyên — toàn cảnh đang tải.",
    color: "#e9c349",
  },
];

const STEP_DURATION = 2000; // ms per step
const TOTAL_DURATION = STEPS.length * STEP_DURATION; // 8 000 ms

// ── Category filters ────────────────────────────────────────────────────────
const CATS = [
  { label: "ALL",         labelVi: "TẤT CẢ",       value: null },
  { label: "NATURAL",     labelVi: "THIÊN NHIÊN",   value: "Natural Heritage" },
  { label: "CULTURAL",    labelVi: "VĂN HÓA",       value: "Cultural Heritage" },
  { label: "HISTORICAL",  labelVi: "LỊCH SỬ",       value: "Historical Site" },
];

function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && window.innerWidth < 900);
}

// ── Onboarding animation overlay ───────────────────────────────────────────
function Onboarding({ lang, onComplete }) {
  const [step,    setStep]    = useState(0);
  const [visible, setVisible] = useState(true);
  const progressRef = useRef(null);

  useEffect(() => {
    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += STEP_DURATION;
      const nextStep = Math.floor(elapsed / STEP_DURATION);
      if (nextStep < STEPS.length) {
        setStep(nextStep);
      } else {
        clearInterval(interval);
        setVisible(false);
        setTimeout(onComplete, 400); // fade-out then launch VR
      }
    }, STEP_DURATION);
    return () => clearInterval(interval);
  }, [onComplete]);

  const s = STEPS[step];
  const progress = ((step * STEP_DURATION) / TOTAL_DURATION) * 100;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        backgroundColor: "#0a0c09",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease",
        fontFamily: "'Be Vietnam Pro', sans-serif",
        padding: 32,
      }}
    >
      {/* Step counter */}
      <p style={{
        fontSize: 10, fontWeight: 900, letterSpacing: "0.2em",
        color: "rgba(162,209,187,0.35)", textTransform: "uppercase",
        marginBottom: 40, margin: "0 0 40px",
      }}>
        {step + 1} / {STEPS.length}
      </p>

      {/* Animated icon */}
      <div
        key={step}
        style={{
          width: 120, height: 120,
          borderRadius: "50%",
          border: `2px solid ${s.color}44`,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 36,
          backgroundColor: `${s.color}0d`,
          animation: "vrStepPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 56, color: s.color, fontVariationSettings: "'FILL' 1" }}
        >
          {s.icon}
        </span>
      </div>

      {/* Text — cross-fades on step change */}
      <div
        key={`txt-${step}`}
        style={{
          textAlign: "center", maxWidth: 300,
          animation: "vrStepFade 0.35s ease both",
        }}
      >
        <h2 style={{
          fontSize: 24, fontWeight: 900, color: "#e3e3d9",
          margin: "0 0 12px", letterSpacing: "-0.02em",
        }}>
          {lang === "vi" ? s.titleVi : s.title}
        </h2>
        <p style={{
          fontSize: 14, color: "rgba(192,200,195,0.6)",
          lineHeight: 1.65, margin: 0,
        }}>
          {lang === "vi" ? s.descVi : s.desc}
        </p>
      </div>

      {/* Progress bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: 3, backgroundColor: "rgba(162,209,187,0.1)",
      }}>
        <div
          ref={progressRef}
          style={{
            height: "100%",
            backgroundColor: s.color,
            width: `${progress + (100 / STEPS.length)}%`,
            transition: `width ${STEP_DURATION}ms linear`,
          }}
        />
      </div>

      {/* Skip */}
      <button
        onClick={() => { setVisible(false); setTimeout(onComplete, 400); }}
        style={{
          position: "absolute", top: 20, right: 20,
          background: "none", border: "none", cursor: "pointer",
          color: "rgba(162,209,187,0.35)", fontSize: 11,
          fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
          fontFamily: "'Be Vietnam Pro', sans-serif",
        }}
      >
        Skip →
      </button>

      <style>{`
        @keyframes vrStepPop {
          from { transform: scale(0.7); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        @keyframes vrStepFade {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ── Desktop-only warning modal ─────────────────────────────────────────────
function DesktopWarning({ onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 8000,
        backgroundColor: "rgba(8,11,8,0.88)", backdropFilter: "blur(14px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24, fontFamily: "'Be Vietnam Pro', sans-serif",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#1a1e18",
          border: "1px solid rgba(65,73,68,0.5)",
          borderRadius: 20, padding: 36,
          maxWidth: 380, textAlign: "center",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 56, color: "#e9c349", fontVariationSettings: "'FILL' 1", display: "block", marginBottom: 20 }}
        >
          smartphone
        </span>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: "#e3e3d9", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
          Mobile Only
        </h2>
        <p style={{ fontSize: 13, color: "rgba(192,200,195,0.6)", lineHeight: 1.65, margin: "0 0 28px" }}>
          VR Discovery requires a smartphone and a Google Cardboard headset.
          Open this page on your phone, tap Deep Dive, and step inside.
        </p>
        <button
          onClick={onClose}
          style={{
            width: "100%", padding: "12px 0",
            backgroundColor: "rgba(233,195,73,0.1)",
            border: "1px solid rgba(233,195,73,0.25)",
            borderRadius: 12, color: "#e9c349",
            fontSize: 11, fontWeight: 900, letterSpacing: "0.12em",
            textTransform: "uppercase", cursor: "pointer",
            fontFamily: "'Be Vietnam Pro', sans-serif",
          }}
        >
          Got It
        </button>
      </div>
    </div>
  );
}

// ── Location card ──────────────────────────────────────────────────────────
function LocationCard({ loc, lang, onDiveIn }) {
  const [hovered,  setHovered]  = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "#1a1c16",
        borderRadius: 18, overflow: "hidden",
        border: hovered
          ? `1px solid ${loc.typeColor}66`
          : "1px solid rgba(65,73,68,0.5)",
        boxShadow: hovered
          ? `0 0 0 1px ${loc.typeColor}33, 0 16px 40px rgba(0,0,0,0.5)`
          : "none",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        transition: "transform 0.22s ease, border-color 0.22s, box-shadow 0.22s",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 200, backgroundColor: "#12140e", overflow: "hidden" }}>
        {!imgError ? (
          <img
            src={loc.image}
            alt={loc.name}
            onError={() => setImgError(true)}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              transform: hovered ? "scale(1.04)" : "scale(1)",
              transition: "transform 0.35s ease",
            }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 44, color: "rgba(162,209,187,0.12)" }}>360</span>
          </div>
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(14,18,12,0.92) 0%, transparent 52%)" }} />

        {/* Type badge */}
        <div style={{
          position: "absolute", top: 10, left: 10,
          backgroundColor: loc.typeBg,
          border: `1px solid ${loc.typeColor}44`,
          borderRadius: 4, padding: "3px 9px",
        }}>
          <span style={{ fontSize: 8, fontWeight: 900, color: loc.typeColor, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            {loc.typeVi}
          </span>
        </div>

        {/* 360 badge */}
        <div style={{
          position: "absolute", top: 10, right: 10,
          display: "flex", alignItems: "center", gap: 4,
          backgroundColor: "rgba(10,12,9,0.75)",
          border: "1px solid rgba(162,209,187,0.2)",
          borderRadius: 4, padding: "3px 8px",
          backdropFilter: "blur(6px)",
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 10, color: "#a2d1bb" }}>360</span>
          <span style={{ fontSize: 8, fontWeight: 900, color: "#a2d1bb", letterSpacing: "0.1em" }}>VR</span>
        </div>

        {/* Location watermark */}
        <div style={{ position: "absolute", bottom: 10, left: 12, right: 12 }}>
          <p style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
            {loc.location}
          </p>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{
          fontSize: 15, fontWeight: 900, color: hovered ? "#fff" : "#e3e3d9",
          lineHeight: 1.3, margin: "0 0 6px", textTransform: "uppercase",
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
          transition: "color 0.2s",
        }}>
          {loc.name}
        </h3>
        <p style={{
          fontSize: 12, color: "rgba(192,200,195,0.58)", lineHeight: 1.6,
          margin: "0 0 16px", flex: 1,
          display: "-webkit-box", WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {loc.desc}
        </p>

        {/* Deep Dive button */}
        <button
          onClick={() => onDiveIn(loc)}
          style={{
            width: "100%",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "11px 0",
            backgroundColor: hovered ? loc.typeColor : "rgba(42,50,47,0.7)",
            color: hovered ? "#12140e" : loc.typeColor,
            border: `1px solid ${loc.typeColor}${hovered ? "ff" : "44"}`,
            borderRadius: 12,
            fontSize: 11, fontWeight: 900, letterSpacing: "0.12em",
            textTransform: "uppercase", cursor: "pointer",
            transition: "all 0.18s ease",
            fontFamily: "'Be Vietnam Pro', sans-serif",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 15, fontVariationSettings: "'FILL' 1" }}>
            view_in_ar
          </span>
          {lang === "vi" ? "KHÁM PHÁ SÂU" : "DEEP DIVE"}
        </button>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function VRDiscovery() {
  const { lang } = useLang();
  const tx = t[lang];

  const [activeCat,   setActiveCat]   = useState(null);
  const [search,      setSearch]      = useState("");

  // Flow state
  const [showDesktop,   setShowDesktop]   = useState(false);
  const [onboarding,    setOnboarding]    = useState(false);    // animation running
  const [vrActive,      setVrActive]      = useState(false);    // VR dual-pano running
  const [vrLocation,    setVrLocation]    = useState(null);     // chosen location
  const [permGranted,   setPermGranted]   = useState(false);    // iOS permission

  const filtered = vrLocations.filter((l) => {
    const matchCat    = !activeCat || l.type === activeCat;
    const matchSearch = !search    ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // ── Handle "Deep Dive" click ─────────────────────────────────────────────
  const handleDiveIn = async (loc) => {
    if (!isMobileDevice()) {
      setShowDesktop(true);
      return;
    }

    // Request iOS DeviceOrientation permission here (requires user gesture)
    let granted = false;
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      try {
        const res = await DeviceOrientationEvent.requestPermission();
        granted = res === "granted";
      } catch {
        granted = false;
      }
    } else {
      // Android / desktop — no permission API needed
      granted = true;
    }

    setPermGranted(granted);
    setVrLocation(loc);
    setOnboarding(true);
  };

  const launchVR = () => {
    setOnboarding(false);
    setVrActive(true);
  };

  const exitVR = () => {
    setVrActive(false);
    setVrLocation(null);
  };

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div style={{ backgroundColor: "#12140e", minHeight: "100vh", color: "#e3e3d9", fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* Overlays */}
      {showDesktop  && <DesktopWarning onClose={() => setShowDesktop(false)} />}
      {onboarding   && <Onboarding lang={lang} onComplete={launchVR} />}
      {vrActive && vrLocation && (
        <VRMode
          location={vrLocation}
          permissionGranted={permGranted}
          onExit={exitVR}
        />
      )}

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative", overflow: "hidden",
          padding: "64px 40px 52px", borderBottom: "1px solid rgba(65,73,68,0.2)",
          background: "linear-gradient(135deg, rgba(14,21,19,1) 0%, rgba(10,28,20,0.8) 100%)",
        }}
      >
        {/* Decorative glow */}
        <div style={{
          position: "absolute", top: -80, right: -80, width: 400, height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(162,209,187,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 720 }}>
          {/* Beta pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            backgroundColor: "rgba(162,209,187,0.08)",
            border: "1px solid rgba(162,209,187,0.22)",
            borderRadius: 24, padding: "5px 14px", marginBottom: 20,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 13, color: "#a2d1bb", fontVariationSettings: "'FILL' 1" }}>view_in_ar</span>
            <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.2em", color: "#a2d1bb", textTransform: "uppercase" }}>
              VR Discovery · Beta
            </span>
          </div>

          <h1 style={{
            fontSize: 48, fontWeight: 900, letterSpacing: "-0.04em",
            color: "#e9c349", margin: "0 0 16px", lineHeight: 1.05,
          }}>
            {lang === "vi" ? "Không Gian Di Sản" : "Heritage Space"}
          </h1>

          <p style={{
            fontSize: 15, color: "rgba(192,200,195,0.6)", lineHeight: 1.7,
            margin: "0 0 28px", maxWidth: 540,
          }}>
            {lang === "vi"
              ? "Bước vào không gian 360° của các di sản Việt Nam qua kính VR Google Cardboard. Mỗi địa điểm là một cuộc hành trình thực sự."
              : "Step inside Vietnam's heritage sites through Google Cardboard VR. Each location is a real 360° panorama — hold your phone up and disappear into history."}
          </p>

          {/* Instruction row */}
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[
              { icon: "smartphone",  text: lang === "vi" ? "Điện thoại" : "Mobile only" },
              { icon: "view_in_ar",  text: "Google Cardboard" },
              { icon: "360",         text: lang === "vi" ? "Toàn cảnh 360°" : "360° panorama" },
              { icon: "sensors",     text: lang === "vi" ? "Con quay hồi chuyển" : "Gyroscope tracking" },
            ].map((item) => (
              <div key={item.icon} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 15, color: "rgba(162,209,187,0.55)" }}>
                  {item.icon}
                </span>
                <span style={{ fontSize: 11, color: "rgba(192,200,195,0.45)", fontWeight: 600, letterSpacing: "0.04em" }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Search + Filters ────────────────────────────────────────────── */}
      <div style={{ padding: "24px 40px 0" }}>
        {/* Search */}
        <div style={{ position: "relative", marginBottom: 16, maxWidth: 480 }}>
          <span className="material-symbols-outlined" style={{
            position: "absolute", left: 16, top: "50%",
            transform: "translateY(-50%)", fontSize: 17,
            color: "rgba(162,209,187,0.35)", pointerEvents: "none",
          }}>search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={lang === "vi" ? "Tìm kiếm địa điểm…" : "Search locations…"}
            style={{
              width: "100%", padding: "12px 44px 12px 46px",
              borderRadius: 32,
              backgroundColor: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(162,209,187,0.1)",
              color: "#e3e3d9", fontSize: 13, outline: "none",
              boxSizing: "border-box",
              fontFamily: "'Be Vietnam Pro', sans-serif",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute", right: 14, top: "50%",
                transform: "translateY(-50%)",
                background: "none", border: "none",
                cursor: "pointer", color: "rgba(162,209,187,0.4)", fontSize: 15,
              }}
            >✕</button>
          )}
        </div>

        {/* Category tabs */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 16 }}>
          {CATS.map((c) => (
            <button
              key={c.label}
              onClick={() => setActiveCat(c.value)}
              style={{
                padding: "8px 20px", borderRadius: 24, whiteSpace: "nowrap",
                cursor: "pointer", fontSize: 11, fontWeight: 900, letterSpacing: "0.08em",
                border: activeCat === c.value ? "none" : "1px solid rgba(162,209,187,0.18)",
                backgroundColor: activeCat === c.value ? "#a2d1bb" : "#1e201a",
                color: activeCat === c.value ? "#12140e" : "rgba(162,209,187,0.75)",
                transition: "all 0.15s",
                fontFamily: "'Be Vietnam Pro', sans-serif",
              }}
            >
              {lang === "vi" ? c.labelVi : c.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Location grid ───────────────────────────────────────────────── */}
      <div style={{
        padding: "8px 40px 64px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 22,
      }}>
        {filtered.map((loc) => (
          <LocationCard
            key={loc.id}
            loc={loc}
            lang={lang}
            onDiveIn={handleDiveIn}
          />
        ))}
        {!filtered.length && (
          <p style={{
            gridColumn: "1 / -1", textAlign: "center",
            color: "rgba(192,200,195,0.2)", fontSize: 13, padding: "60px 0",
          }}>
            {lang === "vi" ? "Không tìm thấy địa điểm phù hợp." : "No locations found."}
          </p>
        )}
      </div>

      {/* ── How it works ────────────────────────────────────────────────── */}
      <div style={{
        borderTop: "1px solid rgba(65,73,68,0.2)",
        padding: "52px 40px 64px",
      }}>
        <p style={{
          fontSize: 9, fontWeight: 900, letterSpacing: "0.2em",
          color: "rgba(162,209,187,0.35)", textTransform: "uppercase",
          marginBottom: 8,
        }}>
          {lang === "vi" ? "Cách hoạt động" : "How it works"}
        </p>
        <h2 style={{
          fontSize: 28, fontWeight: 900, letterSpacing: "-0.03em",
          color: "#e3e3d9", margin: "0 0 36px",
        }}>
          {lang === "vi" ? "Bước vào di sản trong 60 giây." : "Inside heritage in 60 seconds."}
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 20,
        }}>
          {[
            { icon: "touch_app",    n: "01", title: lang === "vi" ? "Chọn địa điểm" : "Choose a location",  desc: lang === "vi" ? "Nhấn Deep Dive trên bất kỳ thẻ nào." : "Tap Deep Dive on any location card." },
            { icon: "screen_rotation", n: "02", title: lang === "vi" ? "Xoay điện thoại" : "Rotate phone",   desc: lang === "vi" ? "Giữ điện thoại nằm ngang." : "Hold your phone horizontally." },
            { icon: "view_in_ar",   n: "03", title: lang === "vi" ? "Đặt vào kính" : "Insert Cardboard",   desc: lang === "vi" ? "Đặt điện thoại vào kính Cardboard." : "Slide phone into your Cardboard." },
            { icon: "travel_explore", n: "04", title: lang === "vi" ? "Khám phá" : "Explore",              desc: lang === "vi" ? "Xoay đầu để nhìn xung quanh." : "Turn your head to look around." },
          ].map((step) => (
            <div
              key={step.n}
              style={{
                backgroundColor: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(65,73,68,0.3)",
                borderRadius: 16, padding: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{
                  fontSize: 10, fontWeight: 900, color: "rgba(162,209,187,0.3)",
                  letterSpacing: "0.1em",
                }}>{step.n}</span>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#a2d1bb", fontVariationSettings: "'FILL' 1" }}>
                  {step.icon}
                </span>
              </div>
              <h3 style={{ fontSize: 13, fontWeight: 900, color: "#e3e3d9", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {step.title}
              </h3>
              <p style={{ fontSize: 12, color: "rgba(192,200,195,0.5)", lineHeight: 1.6, margin: 0 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
