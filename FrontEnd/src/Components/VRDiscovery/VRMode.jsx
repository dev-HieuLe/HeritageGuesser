/**
 * VRMode — Google Cardboard dual-panorama Street View
 *
 * Optical rules:
 * - Both eyes show the SAME panorama, same POV, same zoom. No heading/pitch offset.
 * - Left pano drives motion tracking (gyroscope). Right pano follows via event sync.
 * - Each pano div is centered inside its half-screen container so the image center
 *   aligns with the cardboard lens center.
 * - Eye window width defaults to 45 vw; if the user enters their phone's physical
 *   screen width in mm, it is auto-computed as (lensDistanceMM / screenWidthMM) × 100 vw.
 * - Vertical offset shifts the pano div up/down inside its container (physical alignment).
 * - All calibration values persist in localStorage.
 *
 * Props:
 *   location          { lat, lng, panoId?, name }
 *   permissionGranted boolean   — iOS DeviceOrientation permission already granted
 *   onExit            () => void
 */

import { useEffect, useRef, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const LS_KEY  = "vr_calib_v2";

// ─── Calibration defaults ────────────────────────────────────────────────────
const DEFAULTS = {
  lensDistanceMM:  63.9,   // Google Cardboard standard inter-lens distance
  screenWidthMM:   0,      // 0 = unknown → use manual eyeWidthVW
  eyeWidthVW:      45,     // manual fallback
  verticalOffsetPX: 0,     // positive → shift image down (see lower content)
  zoom:            1,      // Street View zoom: 0=180°FOV, 1=standard, 3=max
};

function loadCalib() {
  try {
    const raw = JSON.parse(localStorage.getItem(LS_KEY));
    return { ...DEFAULTS, ...(raw || {}) };
  } catch { return { ...DEFAULTS }; }
}

function persistCalib(c) {
  localStorage.setItem(LS_KEY, JSON.stringify(c));
}

// Compute eye window width from physical measurements when available
function computeEyeVW(calib) {
  if (calib.screenWidthMM > 0) {
    const vw = (calib.lensDistanceMM / calib.screenWidthMM) * 100;
    return parseFloat(Math.min(Math.max(vw, 20), 65).toFixed(1));
  }
  return null;
}

// ─── Street View shared options (no UI) ──────────────────────────────────────
const PANO_UI_OFF = {
  addressControl:        false,
  fullscreenControl:     false,
  linksControl:          false,
  panControl:            false,
  zoomControl:           false,
  motionTrackingControl: false,
  showRoadLabels:        false,
  clickToGo:             false,
  disableDefaultUI:      true,
  visible:               true,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Simple [−] value [+] stepper */
function Stepper({ value, onChange, min = -Infinity, max = Infinity, step = 1, decimals = 0, disabled = false }) {
  const clamp = (v) => parseFloat(Math.min(max, Math.max(min, v)).toFixed(decimals));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      <button
        onClick={() => onChange(clamp(value - step))}
        disabled={disabled || value <= min}
        style={stepBtn(disabled || value <= min)}
      >−</button>
      <span style={{
        minWidth: 72, textAlign: "center",
        fontSize: 13, fontWeight: 700,
        color: disabled ? "rgba(192,200,195,0.28)" : "#e3e3d9",
        userSelect: "none",
      }}>
        {value.toFixed(decimals)}
      </span>
      <button
        onClick={() => onChange(clamp(value + step))}
        disabled={disabled || value >= max}
        style={stepBtn(disabled || value >= max)}
      >+</button>
    </div>
  );
}
function stepBtn(off) {
  return {
    width: 34, height: 34, borderRadius: 8,
    border: `1px solid ${off ? "rgba(65,73,68,0.25)" : "rgba(162,209,187,0.22)"}`,
    backgroundColor: off ? "rgba(26,28,22,0.4)" : "rgba(26,28,22,0.9)",
    color: off ? "rgba(162,209,187,0.18)" : "#a2d1bb",
    fontSize: 20, lineHeight: 1, cursor: off ? "default" : "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "monospace", flexShrink: 0,
  };
}

/** Label row with stepper */
function CalibRow({ label, display, hint, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(192,200,195,0.75)", margin: 0, letterSpacing: "0.03em" }}>{label}</p>
          {hint && <p style={{ fontSize: 9, color: "rgba(162,209,187,0.32)", margin: "3px 0 0", letterSpacing: "0.06em", lineHeight: 1.5 }}>{hint}</p>}
        </div>
        <span style={{ fontSize: 13, fontWeight: 900, color: "#e9c349", marginLeft: 12, whiteSpace: "nowrap", flexShrink: 0 }}>
          {display}
        </span>
      </div>
      {children}
    </div>
  );
}

/** Full calibration panel rendered as an overlay inside the VR container */
function CalibrationPanel({ draft, setDraft, onSave, onReset, onClose }) {
  const autoVW = computeEyeVW(draft);
  const set    = (key) => (v) => setDraft((d) => ({ ...d, [key]: v }));

  return (
    <div
      style={{
        position: "absolute", inset: 0, zIndex: 300,
        backgroundColor: "rgba(6,9,6,0.92)", backdropFilter: "blur(18px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16, fontFamily: "'Be Vietnam Pro', sans-serif",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#191d17",
          border: "1px solid rgba(65,73,68,0.55)",
          borderRadius: 22, padding: "26px 24px 22px",
          width: "min(100%, 370px)",
          maxHeight: "92vh", overflowY: "auto",
          boxShadow: "0 48px 96px rgba(0,0,0,0.7)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 900, color: "#e3e3d9", margin: 0, letterSpacing: "-0.01em" }}>VR Calibration</h2>
            <p style={{ fontSize: 9, color: "rgba(162,209,187,0.3)", margin: "4px 0 0", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Adjust to match your cardboard headset
            </p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(162,209,187,0.35)", fontSize: 24, lineHeight: 1, padding: "0 0 0 12px" }}>
            ✕
          </button>
        </div>

        {/* ── 1. Eye Window Width ── */}
        <CalibRow
          label="Eye Window Width"
          display={`${(autoVW ?? draft.eyeWidthVW).toFixed(1)} vw`}
          hint={
            autoVW
              ? `Auto-computed from screen size · manual override disabled`
              : `Manual · set phone screen width below to auto-compute`
          }
        >
          <Stepper
            value={draft.eyeWidthVW}
            onChange={set("eyeWidthVW")}
            min={25} max={60} step={1}
            disabled={draft.screenWidthMM > 0}
          />
        </CalibRow>

        {/* ── 2. Vertical Offset ── */}
        <CalibRow
          label="Vertical Offset"
          display={`${draft.verticalOffsetPX >= 0 ? "+" : ""}${draft.verticalOffsetPX} px`}
          hint="Shifts the image down (+) or up (−) inside the headset"
        >
          <Stepper
            value={draft.verticalOffsetPX}
            onChange={set("verticalOffsetPX")}
            min={-200} max={200} step={5}
          />
        </CalibRow>

        {/* ── 3. Zoom ── */}
        <CalibRow
          label="Street View Zoom"
          display={draft.zoom.toFixed(1)}
          hint="0 = 180° FOV (very wide)  ·  1 = standard  ·  3 = max telephoto"
        >
          <Stepper
            value={draft.zoom}
            onChange={set("zoom")}
            min={0} max={3} step={0.1} decimals={1}
          />
        </CalibRow>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: "rgba(65,73,68,0.3)", margin: "8px 0 22px" }} />
        <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.2em", color: "rgba(162,209,187,0.28)", textTransform: "uppercase", margin: "0 0 18px" }}>
          Precision — Cardboard optics
        </p>

        {/* ── 4. Inter-lens Distance ── */}
        <CalibRow
          label="Inter-lens Distance"
          display={`${draft.lensDistanceMM.toFixed(1)} mm`}
          hint="Google Cardboard v2 standard: 63.9 mm"
        >
          <Stepper
            value={draft.lensDistanceMM}
            onChange={set("lensDistanceMM")}
            min={40} max={90} step={0.5} decimals={1}
          />
        </CalibRow>

        {/* ── 5. Screen Width ── */}
        <CalibRow
          label="Phone Screen Width"
          display={draft.screenWidthMM > 0 ? `${draft.screenWidthMM} mm` : "Unknown"}
          hint={`Measure the horizontal screen width in landscape (long side).  Set to 0 to use manual eye width.`}
        >
          <Stepper
            value={draft.screenWidthMM}
            onChange={set("screenWidthMM")}
            min={0} max={200} step={1}
          />
        </CalibRow>

        {/* Auto-computed result callout */}
        {autoVW && (
          <div style={{
            backgroundColor: "rgba(162,209,187,0.06)",
            border: "1px solid rgba(162,209,187,0.18)",
            borderRadius: 10, padding: "10px 14px",
            textAlign: "center", marginBottom: 20,
          }}>
            <p style={{ fontSize: 11, color: "#a2d1bb", margin: 0 }}>
              Computed eye window: <strong>{autoVW} vw</strong>
            </p>
            <p style={{ fontSize: 9, color: "rgba(162,209,187,0.42)", margin: "4px 0 0", letterSpacing: "0.06em" }}>
              = {draft.lensDistanceMM} mm ÷ {draft.screenWidthMM} mm × 100
            </p>
          </div>
        )}

        {/* Buttons */}
        <button
          onClick={onSave}
          style={{
            width: "100%", padding: "13px 0", borderRadius: 12,
            backgroundColor: "#a2d1bb", color: "#12140e",
            border: "none", fontSize: 12, fontWeight: 900,
            letterSpacing: "0.12em", textTransform: "uppercase",
            cursor: "pointer", marginBottom: 8,
            fontFamily: "'Be Vietnam Pro', sans-serif",
          }}
        >
          Save &amp; Apply
        </button>
        <button
          onClick={onReset}
          style={{
            width: "100%", padding: "10px 0", borderRadius: 12,
            backgroundColor: "transparent", color: "rgba(192,200,195,0.4)",
            border: "1px solid rgba(65,73,68,0.4)", fontSize: 11, fontWeight: 700,
            letterSpacing: "0.08em", textTransform: "uppercase",
            cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif",
          }}
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}

// ─── HUD button style ─────────────────────────────────────────────────────────
const HUD = {
  display: "flex", alignItems: "center", gap: 5,
  backgroundColor: "rgba(8,11,8,0.82)",
  border: "1px solid rgba(162,209,187,0.22)",
  borderRadius: 20, padding: "6px 14px",
  color: "#a2d1bb", fontSize: 10, fontWeight: 900,
  letterSpacing: "0.12em", textTransform: "uppercase",
  cursor: "pointer", backdropFilter: "blur(14px)",
  fontFamily: "'Be Vietnam Pro', sans-serif",
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function VRMode({ location, permissionGranted, onExit }) {
  const containerRef = useRef(null);
  // These refs are the CONTAINERS — the actual pano divs are inside them
  const leftContRef  = useRef(null);
  const rightContRef = useRef(null);
  // These refs are the pano canvas divs (resized by calibration)
  const leftPaneRef  = useRef(null);
  const rightPaneRef = useRef(null);

  const leftPano    = useRef(null);
  const rightPano   = useRef(null);
  const syncing     = useRef(false); // guard against pov feedback loop

  const [calib,      setCalib]      = useState(loadCalib);
  const [draft,      setDraft]      = useState(loadCalib);
  const [panoReady,  setPanoReady]  = useState(false);
  const [isCalib,    setIsCalib]    = useState(false);
  const [orientFail, setOrientFail] = useState(false);

  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: API_KEY });

  // Effective eye width — auto or manual
  const eyeVW = computeEyeVW(calib) ?? calib.eyeWidthVW;

  // ── Fullscreen + orientation lock ───────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    (el.requestFullscreen?.() ?? el.webkitRequestFullscreen?.() ?? Promise.resolve()).catch(() => {});

    if (screen.orientation?.lock) {
      screen.orientation.lock("landscape").catch(() => setOrientFail(true));
    } else {
      setOrientFail(true);
    }

    const checkOrientation = () => {
      // portrait warning handled via CSS media query + JS for the fallback hint
    };
    checkOrientation();

    return () => {
      screen.orientation?.unlock();
      document.exitFullscreen?.().catch(() => {});
    };
  }, []);

  // ── Create/recreate panoramas when API loads or location changes ────────────
  useEffect(() => {
    console.log("[VRMode] isLoaded:", isLoaded, "leftPane:", !!leftPaneRef.current, "rightPane:", !!rightPaneRef.current);
    if (!isLoaded || !leftPaneRef.current || !rightPaneRef.current) return;

    console.log("[VRMode] Creating panoramas for location:", location);
    setPanoReady(false);

    // Base position — prefer panoId for exact panorama
    const position = location.panoId
      ? undefined
      : { lat: location.lat, lng: location.lng };

    const sharedCfg = {
      ...PANO_UI_OFF,
      ...(location.panoId ? { pano: location.panoId } : { position }),
      pov:  { heading: 0, pitch: 0 },
      zoom: calib.zoom,
    };

    // ── Left eye: gyroscope enabled ──────────────────────────────────────────
    const left = new window.google.maps.StreetViewPanorama(leftPaneRef.current, {
      ...sharedCfg,
      motionTracking: !!permissionGranted,
    });

    // ── Right eye: mirrors left, no independent motion ───────────────────────
    const right = new window.google.maps.StreetViewPanorama(rightPaneRef.current, {
      ...sharedCfg,
      motionTracking: false,
    });

    leftPano.current  = left;
    rightPano.current = right;

    // ── Sync listeners (left → right, no offset) ────────────────────────────
    //
    // Rule: right always mirrors left exactly — same heading, pitch, zoom, position.
    // The `syncing` guard prevents the right pano's own events from triggering
    // another sync call (potential feedback loop).

    const povL = left.addListener("pov_changed", () => {
      if (syncing.current) return;
      syncing.current = true;
      const pov = left.getPov();
      // Copy heading + pitch exactly — NO artificial offset
      right.setPov({ heading: pov.heading, pitch: pov.pitch });
      syncing.current = false;
    });

    const zoomL = left.addListener("zoom_changed", () => {
      if (syncing.current) return;
      syncing.current = true;
      right.setZoom(left.getZoom());
      syncing.current = false;
    });

    const posL = left.addListener("position_changed", () => {
      if (syncing.current) return;
      syncing.current = true;
      const pos = left.getPosition();
      if (pos) right.setPosition(pos);
      syncing.current = false;
    });

    // Mark ready once left pano has tiles
    const tilesL = left.addListener("tilesloaded", () => {
      console.log("[VRMode] tilesloaded fired ✓");
      setPanoReady(true);
    });
    // Fallback: also accept status_changed OK (some devices fire this instead)
    const statL  = left.addListener("status_changed", () => {
      const status = left.getStatus();
      console.log("[VRMode] status_changed:", status);
      if (status === "OK") setPanoReady(true);
    });

    return () => {
      [povL, zoomL, posL, tilesL, statL].forEach((l) =>
        window.google?.maps.event.removeListener(l)
      );
      window.google?.maps.event.clearInstanceListeners(left);
      window.google?.maps.event.clearInstanceListeners(right);
      leftPano.current  = null;
      rightPano.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, location, permissionGranted]);

  // ── Apply zoom from calibration to running panoramas ───────────────────────
  useEffect(() => {
    leftPano.current?.setZoom(calib.zoom);
    rightPano.current?.setZoom(calib.zoom);
  }, [calib.zoom]);

  // ── Keyboard shortcuts ──────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (isCalib) setIsCalib(false);
        else onExit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isCalib, onExit]);

  // ── Calibration save ────────────────────────────────────────────────────────
  const applyCalib = () => {
    const next = { ...draft };
    // If physical size is known, store the computed value as eyeWidthVW too
    const auto = computeEyeVW(next);
    if (auto) next.eyeWidthVW = auto;
    setCalib(next);
    persistCalib(next);
    setIsCalib(false);
    // Immediately update running panos' zoom
    leftPano.current?.setZoom(next.zoom);
    rightPano.current?.setZoom(next.zoom);
  };

  const resetCalib = () => setDraft({ ...DEFAULTS });

  const openCalib = () => {
    setDraft({ ...calib });
    setIsCalib(true);
  };

  // ── Pano div style — centered in its half, offset vertically ───────────────
  //
  // Layout:
  //   [left container 50%][right container 50%]
  //   Each container: overflow hidden
  //   Pano div inside: width = eyeVW vw (vw = viewport units, may exceed 50%)
  //                    centered horizontally → left lens / right lens aligns
  //                    shifted vertically by verticalOffsetPX for physical fit
  //
  // Why vw units for the pano width?
  //   The Google Maps API camera is ALWAYS at the center of its div.
  //   By making the pano div eyeVW vw wide and centering it in the 50% container,
  //   the camera center lands at 25 vw (left eye) and 75 vw (right eye) —
  //   matching the physical lens positions.
  //
  const paneDivStyle = {
    position: "absolute",
    width:    `${eyeVW}vw`,
    height:   "100%",
    left:     "50%",                      // center of each 50%-wide container
    top:      0,
    transform: `translateX(-50%) translateY(${calib.verticalOffsetPX}px)`,
    // overflow is clipped by the parent container
  };

  return (
    <>
      <style>{`
        /* Portrait overlay — pure CSS, no JS needed */
        .vr-portrait {
          display: none;
          position: fixed; inset: 0; z-index: 99999;
          background: #0a0c09;
          flex-direction: column; align-items: center; justify-content: center;
          gap: 18px; color: #a2d1bb;
          font-family: 'Be Vietnam Pro', sans-serif;
        }
        @media (orientation: portrait) {
          .vr-portrait { display: flex; }
        }
        /* Suppress Google Maps attribution in VR panels */
        .vr-eye .gmnoprint,
        .vr-eye .gm-style-cc,
        .vr-eye a[href*="maps.google"],
        .vr-eye button[title="Report a problem"],
        .vr-eye button[title="Keyboard shortcuts"] {
          display: none !important;
          pointer-events: none !important;
        }
        @keyframes vr-spin { to { transform: rotate(360deg); } }
        @keyframes vr-rot  { 0%,100% { transform: rotate(-15deg); } 50% { transform: rotate(15deg); } }
      `}</style>

      {/* Portrait warning (CSS-driven) */}
      <div className="vr-portrait">
        <span className="material-symbols-outlined" style={{ fontSize: 60, animation: "vr-rot 1.6s ease-in-out infinite" }}>
          screen_rotation
        </span>
        <p style={{ fontSize: 17, fontWeight: 900, margin: 0, letterSpacing: "0.02em" }}>Rotate to landscape</p>
        <p style={{ fontSize: 12, color: "rgba(162,209,187,0.5)", margin: 0 }}>VR requires horizontal orientation</p>
      </div>

      {/* ── VR root ─────────────────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          backgroundColor: "#000",
          display: "flex", flexDirection: "row",
          overflow: "hidden",
        }}
      >
        {/* Loading overlay */}
        {!panoReady && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 50,
            backgroundColor: "#0a0c09",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 16, color: "#a2d1bb",
            fontFamily: "'Be Vietnam Pro', sans-serif",
          }}>
            <span className="material-symbols-outlined"
              style={{ fontSize: 48, animation: "vr-spin 1s linear infinite" }}>
              progress_activity
            </span>
            <p style={{ fontSize: 13, fontWeight: 700, margin: 0, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Loading panorama…
            </p>
          </div>
        )}

        {/* ── Left eye container ───────────────────────────────────────────── */}
        {/*
          Container is exactly 50% of viewport width, overflow: hidden.
          The pano div inside is eyeVW wide, centered → camera at 25vw.
          overflow:hidden clips anything that bleeds past the 50% boundary.
        */}
        <div
          ref={leftContRef}
          style={{
            width: "50%", height: "100%",
            position: "relative", overflow: "hidden",
            flexShrink: 0, backgroundColor: "#000",
          }}
        >
          <div ref={leftPaneRef} className="vr-eye" style={paneDivStyle} />
        </div>

        {/* ── Center nose divider ──────────────────────────────────────────── */}
        {/*
          This 3 px black bar sits at 50vw — the nose bridge of the cardboard.
          It physically separates the two optical paths and prevents cross-eye bleed.
        */}
        <div style={{
          position: "absolute",
          left: "50%", top: 0, bottom: 0,
          width: 3, backgroundColor: "#000",
          transform: "translateX(-50%)",
          zIndex: 40,
          flexShrink: 0,
        }} />

        {/* ── Right eye container ──────────────────────────────────────────── */}
        <div
          ref={rightContRef}
          style={{
            width: "50%", height: "100%",
            position: "relative", overflow: "hidden",
            flexShrink: 0, backgroundColor: "#000",
          }}
        >
          <div ref={rightPaneRef} className="vr-eye" style={paneDivStyle} />
        </div>

        {/* ── Lens vignette (aesthetic — mimics cardboard barrel distortion darkening) */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 45, pointerEvents: "none",
          background: [
            "radial-gradient(ellipse 46% 72% at 25% 50%, transparent 58%, rgba(0,0,0,0.65) 100%)",
            "radial-gradient(ellipse 46% 72% at 75% 50%, transparent 58%, rgba(0,0,0,0.65) 100%)",
          ].join(", "),
        }} />

        {/* ── HUD ─────────────────────────────────────────────────────────── */}
        <button onClick={onExit}    style={{ position: "absolute", top: 14, left: 14,  zIndex: 60, ...HUD }}>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
          Exit VR
        </button>

        <button onClick={openCalib} style={{ position: "absolute", top: 14, right: 14, zIndex: 60, ...HUD }}>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>tune</span>
          Calibrate
        </button>

        {/* Active calibration values — shown as a mini pill so user can see current state */}
        {panoReady && !isCalib && (
          <div style={{
            position: "absolute", bottom: 14, left: "50%",
            transform: "translateX(-50%)",
            zIndex: 60,
            display: "flex", alignItems: "center", gap: 10,
            backgroundColor: "rgba(8,11,8,0.78)",
            border: "1px solid rgba(162,209,187,0.15)",
            borderRadius: 20, padding: "5px 14px",
            backdropFilter: "blur(10px)",
            fontFamily: "'Be Vietnam Pro', sans-serif",
          }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(162,209,187,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
              {location.name}
            </span>
            <div style={{ width: 1, height: 10, backgroundColor: "rgba(162,209,187,0.15)" }} />
            <span style={{ fontSize: 9, color: "rgba(162,209,187,0.35)", whiteSpace: "nowrap" }}>
              {eyeVW.toFixed(0)}vw · zoom {calib.zoom.toFixed(1)}
              {calib.verticalOffsetPX !== 0 ? ` · ${calib.verticalOffsetPX > 0 ? "+" : ""}${calib.verticalOffsetPX}px` : ""}
            </span>
          </div>
        )}

        {/* Orientation fallback hint (only on iOS where lock fails) */}
        {orientFail && panoReady && !isCalib && (
          <div style={{
            position: "absolute", bottom: 44, left: "50%",
            transform: "translateX(-50%)",
            zIndex: 60,
            backgroundColor: "rgba(8,11,8,0.65)",
            borderRadius: 12, padding: "4px 12px",
            color: "rgba(162,209,187,0.3)",
            fontSize: 8, fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", whiteSpace: "nowrap",
            fontFamily: "'Be Vietnam Pro', sans-serif",
          }}>
            Keep phone horizontal
          </div>
        )}

        {/* ── Calibration panel overlay ────────────────────────────────────── */}
        {isCalib && (
          <CalibrationPanel
            draft={draft}
            setDraft={setDraft}
            onSave={applyCalib}
            onReset={resetCalib}
            onClose={() => setIsCalib(false)}
          />
        )}
      </div>
    </>
  );
}
