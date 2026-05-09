import { useState, useEffect, useRef } from "react";
import { useLang } from "../../Context/languageContext";
import t from "../../translations";
import { vrLocations } from "./vrLocations";
import VRMode from "./VRMode";
import axios from "axios";
import { Link } from "react-router-dom";
import vrAmbientSound from "./Sounds.mp3";

// ─── Onboarding steps ────────────────────────────────────────────────────────
const STEPS = [
  {
    icon: "screen_rotation",
    title: "Rotate Your Phone",
    titleVi: "Xoay Màn Hình",
    desc: "Hold your phone horizontally in landscape mode.",
    descVi: "Giữ điện thoại ngang theo chiều landscape.",
    color: "#a2d1bb",
    aura: "rgba(162,209,187,0.18)",
  },
  {
    icon: "view_in_ar",
    title: "Insert Into Cardboard",
    titleVi: "Đặt Vào Kính VR",
    desc: "Slide your phone into your Google Cardboard headset.",
    descVi: "Đặt điện thoại vào kính Google Cardboard.",
    color: "#e9c349",
    aura: "rgba(233,195,73,0.18)",
  },
  {
    icon: "visibility",
    title: "Put On the Headset",
    titleVi: "Đeo Kính Vào",
    desc: "Hold the headset up to your eyes and adjust the lenses.",
    descVi: "Đưa kính lên mắt và điều chỉnh thấu kính cho rõ.",
    color: "#a2d1bb",
    aura: "rgba(162,209,187,0.18)",
  },
  {
    icon: "rocket_launch",
    title: "Entering the Space…",
    titleVi: "Đang Mở Không Gian…",
    desc: "Stay still — the panorama is loading.",
    descVi: "Giữ nguyên — toàn cảnh đang tải.",
    color: "#e9c349",
    aura: "rgba(233,195,73,0.22)",
  },
];

const STEP_DURATION = 2000;
const TOTAL_DURATION = STEPS.length * STEP_DURATION;

// ─── Category filters ─────────────────────────────────────────────────────────
const CATS = [
  { label: "ALL", labelVi: "TẤT CẢ", value: null },
  { label: "NATURAL", labelVi: "THIÊN NHIÊN", value: "Natural Heritage" },
  { label: "CULTURAL", labelVi: "VĂN HÓA", value: "Cultural Heritage" },
  { label: "HISTORY", labelVi: "LỊCH SỬ", value: "Historical Site" },
];

// ─── Step icon numbers ────────────────────────────────────────────────────────
const STEP_COLORS = ["#a2d1bb", "#e9c349", "#d4845a", "#c47abf"];

function isMobileDevice() {
  return (
    /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && window.innerWidth < 900)
  );
}

// ─── Onboarding overlay ───────────────────────────────────────────────────────
function Onboarding({ lang, onComplete }) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let elapsed = 0;
    const id = setInterval(() => {
      elapsed += STEP_DURATION;
      const next = Math.floor(elapsed / STEP_DURATION);
      if (next < STEPS.length) {
        setStep(next);
      } else {
        clearInterval(id);
        setVisible(false);
        setTimeout(onComplete, 450);
      }
    }, STEP_DURATION);
    return () => clearInterval(id);
  }, [onComplete]);

  const s = STEPS[step];
  const barWidth = ((step + 1) / STEPS.length) * 100;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        background:
          "radial-gradient(ellipse 120% 100% at 50% 0%, #0d2318 0%, #080f0c 60%, #030705 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.45s ease",
        fontFamily: "'Be Vietnam Pro', sans-serif",
        padding: 32,
        overflow: "hidden",
      }}
    >
      {/* Ambient background aura — changes per step */}
      <div
        key={`aura-${step}`}
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${s.aura} 0%, transparent 68%)`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -58%)",
          pointerEvents: "none",
          animation: "auraBreath 2s ease-in-out forwards",
        }}
      />

      {/* Step dots */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 48,
          position: "relative",
          zIndex: 2,
        }}
      >
        {STEPS.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === step ? 24 : 7,
              height: 7,
              borderRadius: 4,
              backgroundColor: i === step ? s.color : "rgba(162,209,187,0.18)",
              transition: "width 0.4s ease, background-color 0.4s ease",
            }}
          />
        ))}
      </div>

      {/* Icon circle */}
      <div
        key={`icon-${step}`}
        style={{
          position: "relative",
          zIndex: 2,
          width: 130,
          height: 130,
          borderRadius: "50%",
          border: `2px solid ${s.color}55`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 36,
          backgroundColor: `${s.color}14`,
          boxShadow: `0 0 60px ${s.aura}, 0 0 120px ${s.aura}`,
          animation: "stepPop 0.45s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: 62,
            color: s.color,
            fontVariationSettings: "'FILL' 1",
            filter: `drop-shadow(0 0 12px ${s.color}88)`,
          }}
        >
          {s.icon}
        </span>
      </div>

      {/* Text */}
      <div
        key={`txt-${step}`}
        style={{
          textAlign: "center",
          maxWidth: 320,
          position: "relative",
          zIndex: 2,
          animation: "stepFade 0.38s ease both",
        }}
      >
        <h2
          style={{
            fontSize: 26,
            fontWeight: 900,
            color: "#f0f4f1",
            margin: "0 0 14px",
            letterSpacing: "-0.025em",
          }}
        >
          {lang === "vi" ? s.titleVi : s.title}
        </h2>
        <p
          style={{
            fontSize: 15,
            color: "rgba(192,210,200,0.72)",
            lineHeight: 1.65,
            margin: 0,
          }}
        >
          {lang === "vi" ? s.descVi : s.desc}
        </p>
      </div>

      {/* Progress bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          backgroundColor: "rgba(162,209,187,0.1)",
        }}
      >
        <div
          style={{
            height: "100%",
            backgroundColor: s.color,
            width: `${barWidth}%`,
            transition: `width ${STEP_DURATION}ms linear`,
            boxShadow: `0 0 8px ${s.color}`,
          }}
        />
      </div>

      {/* Skip */}
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onComplete, 450);
        }}
        style={{
          position: "absolute",
          top: 22,
          right: 22,
          background: "none",
          border: "1px solid rgba(162,209,187,0.15)",
          borderRadius: 20,
          padding: "6px 16px",
          cursor: "pointer",
          color: "rgba(162,209,187,0.5)",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          fontFamily: "'Be Vietnam Pro', sans-serif",
          backdropFilter: "blur(8px)",
          transition: "border-color 0.2s, color 0.2s",
        }}
      >
        Skip
      </button>

      <style>{`
        @keyframes stepPop  { from { transform: scale(0.65); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes stepFade { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes auraBreath { from { opacity: 0; transform: translate(-50%,-58%) scale(0.6); } to { opacity: 1; transform: translate(-50%,-58%) scale(1); } }
      `}</style>
    </div>
  );
}

// ─── Desktop warning modal ────────────────────────────────────────────────────
function DesktopWarning({ onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 8000,
        backgroundColor: "rgba(4,8,5,0.88)",
        backdropFilter: "blur(18px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "'Be Vietnam Pro', sans-serif",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#171f1c",
          border: "1px solid rgba(162,209,187,0.18)",
          borderRadius: 24,
          padding: "40px 36px",
          maxWidth: 380,
          textAlign: "center",
          boxShadow:
            "0 0 0 1px rgba(162,209,187,0.06), 0 48px 96px rgba(0,0,0,0.7)",
        }}
      >
        {/* Glow ring around icon */}
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(233,195,73,0.18) 0%, transparent 70%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            border: "1px solid rgba(233,195,73,0.22)",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: 44,
              color: "#e9c349",
              fontVariationSettings: "'FILL' 1",
              filter: "drop-shadow(0 0 10px rgba(233,195,73,0.5))",
            }}
          >
            smartphone
          </span>
        </div>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 900,
            color: "#f0f4f1",
            margin: "0 0 12px",
            letterSpacing: "-0.02em",
          }}
        >
          Mobile Only
        </h2>
        <p
          style={{
            fontSize: 14,
            color: "rgba(192,210,200,0.7)",
            lineHeight: 1.7,
            margin: "0 0 28px",
          }}
        >
          VR Discovery needs a smartphone and a Google Cardboard headset. Open
          this page on your phone, tap{" "}
          <strong style={{ color: "#a2d1bb" }}>Deep Dive</strong>, and step
          inside.
        </p>
        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "13px 0",
            background:
              "linear-gradient(135deg, rgba(233,195,73,0.15), rgba(233,195,73,0.08))",
            border: "1px solid rgba(233,195,73,0.3)",
            borderRadius: 12,
            color: "#e9c349",
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            cursor: "pointer",
            fontFamily: "'Be Vietnam Pro', sans-serif",
          }}
        >
          Got It
        </button>
      </div>
    </div>
  );
}

// ─── Location card ────────────────────────────────────────────────────────────
function LocationCard({ loc, lang, onDiveIn }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? "#1e2a23" : "#192119",
        borderRadius: 20,
        overflow: "hidden",
        border: hovered
          ? `1px solid ${loc.typeColor}88`
          : "1px solid rgba(162,209,187,0.1)",
        boxShadow: hovered
          ? `0 0 0 1px ${loc.typeColor}22, 0 24px 56px rgba(0,0,0,0.55), 0 0 40px ${loc.typeColor}18`
          : "0 2px 12px rgba(0,0,0,0.25)",
        transform: hovered
          ? "translateY(-6px) scale(1.005)"
          : "translateY(0) scale(1)",
        transition:
          "transform 0.25s cubic-bezier(0.34,1.2,0.64,1), border-color 0.22s, box-shadow 0.25s, background-color 0.2s",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Image ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          height: 210,
          backgroundColor: "#111714",
          overflow: "hidden",
        }}
      >
        {!imgError ? (
          <img
            src={loc.image}
            alt={loc.name}
            onError={() => setImgError(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: hovered ? "scale(1.06)" : "scale(1)",
              transition: "transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)",
              filter: hovered
                ? "brightness(1.08) saturate(1.1)"
                : "brightness(0.9) saturate(1)",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "radial-gradient(circle, rgba(162,209,187,0.06) 0%, transparent 70%)",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 52, color: "rgba(162,209,187,0.2)" }}
            >
              360
            </span>
          </div>
        )}

        {/* Gradient — lighter so photo breathes */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(14,21,17,0.88) 0%, rgba(14,21,17,0.3) 45%, transparent 100%)",
          }}
        />
        {/* Subtle top gradient for badge legibility */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 70,
            background:
              "linear-gradient(to bottom, rgba(10,15,12,0.55) 0%, transparent 100%)",
          }}
        />

        {/* Type badge */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            backgroundColor: `${loc.typeColor}22`,
            border: `1px solid ${loc.typeColor}66`,
            borderRadius: 6,
            padding: "4px 10px",
            backdropFilter: "blur(8px)",
          }}
        >
          <span
            style={{
              fontSize: 9,
              fontWeight: 900,
              color: loc.typeColor,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            {loc.typeVi}
          </span>
        </div>

        {/* VR badge */}
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            display: "flex",
            alignItems: "center",
            gap: 5,
            backgroundColor: "rgba(8,12,10,0.75)",
            border: "1px solid rgba(162,209,187,0.28)",
            borderRadius: 6,
            padding: "4px 10px",
            backdropFilter: "blur(8px)",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: 11,
              color: "#a2d1bb",
              fontVariationSettings: "'FILL' 1",
            }}
          >
            360
          </span>
          <span
            style={{
              fontSize: 9,
              fontWeight: 900,
              color: "#a2d1bb",
              letterSpacing: "0.12em",
            }}
          >
            360° VR
          </span>
        </div>

        {/* Bottom location label */}
        <div style={{ position: "absolute", bottom: 12, left: 14, right: 14 }}>
          <p
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.65)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              margin: 0,
              fontWeight: 600,
            }}
          >
            📍 {loc.location}
          </p>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div
        style={{
          padding: "16px 18px 18px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <h3
          style={{
            fontSize: 15,
            fontWeight: 900,
            color: hovered ? "#ffffff" : "#dfe8e2",
            lineHeight: 1.3,
            margin: "0 0 8px",
            textTransform: "uppercase",
            letterSpacing: "0.02em",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            transition: "color 0.2s",
          }}
        >
          {loc.name}
        </h3>
        <p
          style={{
            fontSize: 12.5,
            color: "rgba(192,210,200,0.72)",
            lineHeight: 1.65,
            margin: "0 0 18px",
            flex: 1,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {loc.desc}
        </p>

        {/* Deep Dive button */}
        <button
          onClick={() => onDiveIn(loc)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "12px 0",
            background: hovered
              ? `linear-gradient(135deg, ${loc.typeColor}, ${loc.typeColor}cc)`
              : `linear-gradient(135deg, ${loc.typeColor}22, ${loc.typeColor}10)`,
            color: hovered ? "#0d1a14" : loc.typeColor,
            border: `1px solid ${loc.typeColor}${hovered ? "dd" : "55"}`,
            borderRadius: 12,
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            cursor: "pointer",
            boxShadow: hovered ? `0 0 24px ${loc.typeColor}44` : "none",
            transition: "all 0.22s cubic-bezier(0.34,1.2,0.64,1)",
            fontFamily: "'Be Vietnam Pro', sans-serif",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: 16,
              fontVariationSettings: "'FILL' 1",
              filter: hovered
                ? `drop-shadow(0 0 4px ${loc.typeColor})`
                : "none",
            }}
          >
            view_in_ar
          </span>
          {lang === "vi" ? "KHÁM PHÁ SÂU" : "DEEP DIVE"}
        </button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function VRDiscovery() {
  const { lang } = useLang();
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/status`)
      .then((r) => {
        if (r.data?.maintenanceMode) setMaintenanceMode(true);
      })
      .catch(() => {});
  }, []);

  const [activeCat, setActiveCat] = useState(null);
  const [search, setSearch] = useState("");
  const [showDesktop, setShowDesktop] = useState(false);
  const [onboarding, setOnboarding] = useState(false);
  const [vrActive, setVrActive] = useState(false);
  const [vrLocation, setVrLocation] = useState(null);
  const [permGranted, setPermGranted] = useState(false);

  if (maintenanceMode) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen"
        style={{ backgroundColor: "#12140e" }}
      >
        <span
          className="material-symbols-outlined mb-4"
          style={{
            color: "#e9c349",
            fontSize: "64px",
            fontVariationSettings: "'FILL' 1",
          }}
        >
          construction
        </span>
        <h2
          className="font-black mb-2"
          style={{ color: "#e3e3d9", fontSize: "28px" }}
        >
          Under Maintenance
        </h2>
        <p
          style={{
            color: "rgba(192,200,195,0.6)",
            fontSize: "14px",
            textAlign: "center",
            maxWidth: "320px",
          }}
        >
          VR Discovery is temporarily closed for maintenance. Please check back
          later.
        </p>
        <Link
          to="/"
          className="mt-8 px-8 py-3 font-black uppercase tracking-widest"
          style={{
            backgroundColor: "#1e201a",
            color: "#a2d1bb",
            border: "1px solid rgba(162,209,187,0.2)",
            borderRadius: "4px",
            fontSize: "11px",
            textDecoration: "none",
          }}
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const filtered = vrLocations.filter((l) => {
    const matchCat = !activeCat || l.type === activeCat;
    const matchSearch =
      !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleDiveIn = async (loc) => {
    if (!isMobileDevice()) {
      setShowDesktop(true);
      return;
    }

    let granted = false;
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      try {
        granted =
          (await DeviceOrientationEvent.requestPermission()) === "granted";
      } catch {
        granted = false;
      }
    } else {
      granted = true;
    }

    setPermGranted(granted);
    setVrLocation(loc);
    setOnboarding(true);
  };

  const vrAudioRef = useRef(null);

  const launchVR = () => {
    console.log("[VR Audio] launchVR called");
    console.log("[VR Audio] vrAmbientSound src:", vrAmbientSound);
    const audio = new Audio(vrAmbientSound);
    audio.loop = true;
    console.log("[VR Audio] Audio object created:", audio);
    const promise = audio.play();
    console.log("[VR Audio] play() promise:", promise);
    if (promise !== undefined) {
      promise
        .then(() =>
          console.log("[VR Audio] play() resolved — sound is playing"),
        )
        .catch((err) => console.error("[VR Audio] play() rejected:", err));
    }
    vrAudioRef.current = audio;
    setOnboarding(false);
    setVrActive(true);
  };

  const exitVR = () => {
    if (vrAudioRef.current) {
      vrAudioRef.current.pause();
      vrAudioRef.current.src = "";
      vrAudioRef.current = null;
    }
    setVrActive(false);
    setVrLocation(null);
  };

  return (
    <div
      style={{
        backgroundColor: "#101612",
        minHeight: "100vh",
        color: "#dfe8e2",
        fontFamily: "'Be Vietnam Pro', sans-serif",
      }}
    >
      {/* Overlays */}
      {showDesktop && <DesktopWarning onClose={() => setShowDesktop(false)} />}
      {onboarding && <Onboarding lang={lang} onComplete={launchVR} />}
      {vrActive && vrLocation && (
        <VRMode
          location={vrLocation}
          permissionGranted={permGranted}
          onExit={exitVR}
        />
      )}

      {/* ── Hero header ──────────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "72px 48px 60px",
          background:
            "linear-gradient(160deg, #0a1f16 0%, #0d2318 35%, #0b1a14 65%, #080f0c 100%)",
          borderBottom: "1px solid rgba(162,209,187,0.1)",
        }}
      >
        {/* Large ambient orbs */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -60,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(162,209,187,0.12) 0%, rgba(162,209,187,0.04) 45%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -40,
            width: 380,
            height: 380,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(233,195,73,0.08) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
        {/* Subtle grid texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.025,
            backgroundImage:
              "linear-gradient(rgba(162,209,187,1) 1px, transparent 1px), linear-gradient(90deg, rgba(162,209,187,1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div style={{ maxWidth: 740, position: "relative", zIndex: 2 }}>
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background:
                "linear-gradient(135deg, rgba(162,209,187,0.14), rgba(162,209,187,0.06))",
              border: "1px solid rgba(162,209,187,0.3)",
              borderRadius: 24,
              padding: "6px 16px",
              marginBottom: 24,
              boxShadow: "0 0 20px rgba(162,209,187,0.08)",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: 14,
                color: "#a2d1bb",
                fontVariationSettings: "'FILL' 1",
                filter: "drop-shadow(0 0 4px rgba(162,209,187,0.5))",
              }}
            >
              view_in_ar
            </span>
            <span
              style={{
                fontSize: 9,
                fontWeight: 900,
                letterSpacing: "0.22em",
                color: "#a2d1bb",
                textTransform: "uppercase",
              }}
            >
              VR Discovery · Beta
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: "clamp(36px, 6vw, 56px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              margin: "0 0 8px",
              background:
                "linear-gradient(135deg, #e9c349 0%, #f0d878 40%, #d4a83a 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {lang === "vi" ? "Không Gian" : "Heritage"}
          </h1>
          <h1
            style={{
              fontSize: "clamp(36px, 6vw, 56px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              margin: "0 0 24px",
              color: "#f0f4f1",
            }}
          >
            {lang === "vi" ? "Di Sản Việt Nam" : "Space"}
          </h1>

          <p
            style={{
              fontSize: 15,
              color: "rgba(192,215,204,0.82)",
              lineHeight: 1.75,
              margin: "0 0 32px",
              maxWidth: 520,
            }}
          >
            {lang === "vi"
              ? "Bước vào không gian 360° của các di sản Việt Nam qua kính VR Google Cardboard. Mỗi địa điểm là một cuộc hành trình thực sự."
              : "Step inside Vietnam's UNESCO heritage sites through Google Cardboard VR. Each location is a real 360° panorama — put your phone inside the headset and disappear into history."}
          </p>

          {/* Feature chips */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              {
                icon: "smartphone",
                text: lang === "vi" ? "Chỉ dành cho mobile" : "Mobile only",
              },
              { icon: "view_in_ar", text: "Google Cardboard" },
              { icon: "360", text: "360° panorama" },
              {
                icon: "sensors",
                text:
                  lang === "vi" ? "Con quay hồi chuyển" : "Gyroscope tracking",
              },
            ].map((f) => (
              <div
                key={f.icon}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  backgroundColor: "rgba(162,209,187,0.07)",
                  border: "1px solid rgba(162,209,187,0.16)",
                  borderRadius: 20,
                  padding: "6px 14px",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 14, color: "#a2d1bb" }}
                >
                  {f.icon}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: "rgba(192,215,204,0.8)",
                    fontWeight: 600,
                    letterSpacing: "0.03em",
                  }}
                >
                  {f.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Search + filters ──────────────────────────────────────────────── */}
      <div style={{ padding: "28px 48px 0" }}>
        <div style={{ position: "relative", marginBottom: 16, maxWidth: 500 }}>
          <span
            className="material-symbols-outlined"
            style={{
              position: "absolute",
              left: 17,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 17,
              color: "rgba(162,209,187,0.45)",
              pointerEvents: "none",
            }}
          >
            search
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              lang === "vi"
                ? "Tìm kiếm địa điểm…"
                : "Search heritage locations…"
            }
            style={{
              width: "100%",
              padding: "13px 44px 13px 48px",
              borderRadius: 32,
              backgroundColor: "rgba(162,209,187,0.05)",
              border: "1px solid rgba(162,209,187,0.14)",
              color: "#dfe8e2",
              fontSize: 13,
              outline: "none",
              boxSizing: "border-box",
              fontFamily: "'Be Vietnam Pro', sans-serif",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = "rgba(162,209,187,0.36)")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = "rgba(162,209,187,0.14)")
            }
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute",
                right: 15,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgba(162,209,187,0.5)",
                fontSize: 16,
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            paddingBottom: 16,
          }}
        >
          {CATS.map((c) => (
            <button
              key={c.label}
              onClick={() => setActiveCat(c.value)}
              style={{
                padding: "8px 20px",
                borderRadius: 24,
                whiteSpace: "nowrap",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: "0.1em",
                border:
                  activeCat === c.value
                    ? "1px solid rgba(162,209,187,0.4)"
                    : "1px solid rgba(162,209,187,0.14)",
                background:
                  activeCat === c.value
                    ? "linear-gradient(135deg, #a2d1bb, #88c0a6)"
                    : "rgba(162,209,187,0.05)",
                color:
                  activeCat === c.value ? "#0d1a14" : "rgba(162,209,187,0.78)",
                boxShadow:
                  activeCat === c.value
                    ? "0 0 16px rgba(162,209,187,0.3)"
                    : "none",
                transition: "all 0.18s ease",
                fontFamily: "'Be Vietnam Pro', sans-serif",
              }}
            >
              {lang === "vi" ? c.labelVi : c.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Card grid ─────────────────────────────────────────────────────── */}
      <div
        style={{
          padding: "8px 48px 72px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
          gap: 24,
        }}
      >
        {filtered.map((loc) => (
          <LocationCard
            key={loc.id}
            loc={loc}
            lang={lang}
            onDiveIn={handleDiveIn}
          />
        ))}
        {!filtered.length && (
          <p
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              color: "rgba(192,215,204,0.28)",
              fontSize: 14,
              padding: "70px 0",
            }}
          >
            {lang === "vi"
              ? "Không tìm thấy địa điểm phù hợp."
              : "No locations found."}
          </p>
        )}
      </div>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <div
        style={{
          borderTop: "1px solid rgba(162,209,187,0.1)",
          background:
            "linear-gradient(180deg, rgba(10,18,13,0) 0%, rgba(8,14,10,0.6) 100%)",
          padding: "60px 48px 80px",
        }}
      >
        <p
          style={{
            fontSize: 9,
            fontWeight: 900,
            letterSpacing: "0.24em",
            color: "rgba(162,209,187,0.45)",
            textTransform: "uppercase",
            margin: "0 0 10px",
          }}
        >
          {lang === "vi" ? "Cách hoạt động" : "How it works"}
        </p>
        <h2
          style={{
            fontSize: 30,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            color: "#f0f4f1",
            margin: "0 0 40px",
          }}
        >
          {lang === "vi"
            ? "Bước vào di sản trong 60 giây."
            : "Inside heritage in 60 seconds."}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
            gap: 18,
          }}
        >
          {[
            {
              icon: "touch_app",
              n: "01",
              color: STEP_COLORS[0],
              title: lang === "vi" ? "Chọn địa điểm" : "Choose a location",
              desc:
                lang === "vi"
                  ? "Nhấn Deep Dive trên bất kỳ thẻ nào."
                  : "Tap Deep Dive on any location card.",
            },
            {
              icon: "screen_rotation",
              n: "02",
              color: STEP_COLORS[1],
              title: lang === "vi" ? "Xoay điện thoại" : "Rotate your phone",
              desc:
                lang === "vi"
                  ? "Giữ điện thoại nằm ngang."
                  : "Hold your phone horizontally.",
            },
            {
              icon: "view_in_ar",
              n: "03",
              color: STEP_COLORS[2],
              title: lang === "vi" ? "Đặt vào kính" : "Insert Cardboard",
              desc:
                lang === "vi"
                  ? "Đặt điện thoại vào kính Cardboard."
                  : "Slide phone into your Cardboard headset.",
            },
            {
              icon: "travel_explore",
              n: "04",
              color: STEP_COLORS[3],
              title: lang === "vi" ? "Khám phá" : "Explore freely",
              desc:
                lang === "vi"
                  ? "Xoay đầu để nhìn xung quanh."
                  : "Turn your head to look around in 360°.",
            },
          ].map((s) => (
            <div
              key={s.n}
              style={{
                background: `linear-gradient(145deg, ${s.color}0d 0%, rgba(22,30,25,0.6) 100%)`,
                border: `1px solid ${s.color}28`,
                borderRadius: 18,
                padding: "22px 20px",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${s.color}66`;
                e.currentTarget.style.boxShadow = `0 0 28px ${s.color}18`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${s.color}28`;
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 900,
                    color: s.color,
                    letterSpacing: "0.06em",
                    opacity: 0.7,
                  }}
                >
                  {s.n}
                </span>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: `${s.color}18`,
                    border: `1px solid ${s.color}33`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: 19,
                      color: s.color,
                      fontVariationSettings: "'FILL' 1",
                    }}
                  >
                    {s.icon}
                  </span>
                </div>
              </div>
              <h3
                style={{
                  fontSize: 13,
                  fontWeight: 900,
                  color: "#e8f0eb",
                  margin: "0 0 7px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  fontSize: 12.5,
                  color: "rgba(192,215,204,0.65)",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
