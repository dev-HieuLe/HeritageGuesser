/**
 * VRMode — Google Cardboard dual-panorama Street View experience.
 *
 * Props:
 *   location         { lat, lng, panoId? }  — the heritage site to view
 *   permissionGranted boolean               — iOS DeviceOrientation already granted upstream
 *   onExit           () => void             — called when user exits VR
 */
import { useEffect, useRef, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// All UI stripped — clean panorama canvas
const PANO_BASE = {
  addressControl: false,
  fullscreenControl: false,
  linksControl: false,
  panControl: false,
  zoomControl: false,
  motionTrackingControl: false,
  showRoadLabels: false,
  clickToGo: false,
  disableDefaultUI: true,
  visible: true,
  pov: { heading: 34, pitch: 10, zoom: 1 },
};

export default function VRMode({ location, permissionGranted, onExit }) {
  const containerRef = useRef(null);
  const leftRef     = useRef(null);
  const rightRef    = useRef(null);
  const leftPano    = useRef(null);
  const rightPano   = useRef(null);
  const listeners   = useRef([]);

  const [isPortrait,      setIsPortrait]      = useState(false);
  const [orientLockFailed, setOrientLockFailed] = useState(false);
  const [panoReady,       setPanoReady]       = useState(false);

  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: API_KEY });

  // ── Fullscreen + orientation lock ──────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Enter fullscreen (best effort)
    (el.requestFullscreen?.() ??
      el.webkitRequestFullscreen?.() ??
      Promise.resolve()
    ).catch(() => {});

    // Lock landscape (Chrome Android supports this; iOS Safari does not)
    if (screen.orientation?.lock) {
      screen.orientation.lock("landscape").catch(() => {
        setOrientLockFailed(true);
      });
    } else {
      setOrientLockFailed(true);
    }

    // Watch for portrait on devices that can't be locked
    const onOrientChange = () => {
      const portrait = window.innerHeight > window.innerWidth;
      setIsPortrait(portrait);
    };
    onOrientChange();
    window.addEventListener("resize", onOrientChange);

    return () => {
      window.removeEventListener("resize", onOrientChange);
      screen.orientation?.unlock();
      document.exitFullscreen?.().catch(() => {});
    };
  }, []);

  // ── Create panoramas once API and DOM are ready ────────────────────────────
  useEffect(() => {
    if (!isLoaded) return;
    if (!leftRef.current || !rightRef.current) return;

    const baseCfg = { ...PANO_BASE };
    if (location.panoId) {
      baseCfg.pano = location.panoId;
    } else {
      baseCfg.position = { lat: location.lat, lng: location.lng };
    }

    // Left eye — motion tracking enabled (gyroscope drives the view)
    const left = new window.google.maps.StreetViewPanorama(leftRef.current, {
      ...baseCfg,
      motionTracking: !!permissionGranted,
    });

    // Right eye — follows left, no independent tracking
    const right = new window.google.maps.StreetViewPanorama(rightRef.current, {
      ...baseCfg,
      motionTracking: false,
    });

    leftPano.current  = left;
    rightPano.current = right;

    // Sync POV: every frame the left pano's heading/pitch pushes to the right
    const povL = left.addListener("pov_changed", () => {
      right.setPov(left.getPov());
    });

    // Sync position: if user walks forward on the left, right follows
    const posL = left.addListener("position_changed", () => {
      const pos = left.getPosition();
      if (pos) right.setPosition(pos);
    });

    listeners.current = [povL, posL];
    setPanoReady(true);

    return () => {
      listeners.current.forEach((l) =>
        window.google?.maps.event.removeListener(l)
      );
      if (left)  window.google?.maps.event.clearInstanceListeners(left);
      if (right) window.google?.maps.event.clearInstanceListeners(right);
      leftPano.current  = null;
      rightPano.current = null;
    };
  }, [isLoaded, location, permissionGranted]);

  // ── Exit on Escape key ─────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onExit(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onExit]);

  return (
    <>
      {/* Inject orientation-responsive CSS */}
      <style>{`
        .vr-portrait-overlay {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 10001;
          background: #0a0c09;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          color: #a2d1bb;
          font-family: 'Be Vietnam Pro', sans-serif;
        }
        @media (orientation: portrait) {
          .vr-portrait-overlay { display: flex; }
        }
        /* Hide Google Maps attribution in VR */
        .vr-pane .gmnoprint,
        .vr-pane .gm-style-cc,
        .vr-pane a[href*="maps.google"] {
          display: none !important;
        }
      `}</style>

      {/* ── Portrait warning ─── */}
      <div className="vr-portrait-overlay">
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 64, animation: "spin 2s linear infinite" }}
        >
          screen_rotation
        </span>
        <p style={{ fontSize: 18, fontWeight: 900, letterSpacing: "0.04em", textAlign: "center", margin: 0 }}>
          Rotate your phone to landscape
        </p>
        <p style={{ fontSize: 13, color: "rgba(162,209,187,0.55)", margin: 0 }}>
          VR mode requires horizontal orientation
        </p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>

      {/* ── Main VR container ─── */}
      <div
        ref={containerRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          backgroundColor: "#000",
          display: "flex",
          overflow: "hidden",
        }}
      >
        {/* Loading overlay */}
        {!panoReady && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 20,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            backgroundColor: "#0a0c09",
            gap: 16, color: "#a2d1bb",
            fontFamily: "'Be Vietnam Pro', sans-serif",
          }}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 48, animation: "vrSpin 1s linear infinite" }}
            >
              progress_activity
            </span>
            <p style={{ fontSize: 14, fontWeight: 700, margin: 0, letterSpacing: "0.06em" }}>
              LOADING PANORAMA…
            </p>
            <style>{`@keyframes vrSpin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* ── Left eye ─────────────────────── */}
        <div
          ref={leftRef}
          className="vr-pane"
          style={{
            width: "50%",
            height: "100%",
            position: "relative",
            overflow: "hidden",
            flexShrink: 0,
          }}
        />

        {/* ── Center divider ────────────────── */}
        <div style={{
          position: "absolute",
          left: "50%",
          top: 0,
          bottom: 0,
          width: 4,
          backgroundColor: "#000",
          transform: "translateX(-50%)",
          zIndex: 15,
          flexShrink: 0,
        }} />

        {/* ── Right eye ────────────────────── */}
        <div
          ref={rightRef}
          className="vr-pane"
          style={{
            width: "50%",
            height: "100%",
            position: "relative",
            overflow: "hidden",
            flexShrink: 0,
          }}
        />

        {/* ── Vignette overlay (aesthetic lens effect) ── */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 16, pointerEvents: "none",
          background: "radial-gradient(ellipse 48% 80% at 25% 50%, transparent 60%, rgba(0,0,0,0.55) 100%), radial-gradient(ellipse 48% 80% at 75% 50%, transparent 60%, rgba(0,0,0,0.55) 100%)",
        }} />

        {/* ── Exit button ─── shown at centre-top ── */}
        <button
          onClick={onExit}
          style={{
            position: "absolute",
            top: 14,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            gap: 6,
            backgroundColor: "rgba(10,12,9,0.82)",
            border: "1px solid rgba(162,209,187,0.3)",
            borderRadius: 24,
            padding: "7px 18px",
            color: "#a2d1bb",
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            cursor: "pointer",
            backdropFilter: "blur(12px)",
            fontFamily: "'Be Vietnam Pro', sans-serif",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>close</span>
          Exit VR
        </button>

        {/* ── Location label ── */}
        {panoReady && (
          <div style={{
            position: "absolute",
            bottom: 18,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 20,
            backgroundColor: "rgba(10,12,9,0.72)",
            border: "1px solid rgba(162,209,187,0.18)",
            borderRadius: 24,
            padding: "5px 16px",
            color: "rgba(162,209,187,0.7)",
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            backdropFilter: "blur(8px)",
            fontFamily: "'Be Vietnam Pro', sans-serif",
            whiteSpace: "nowrap",
          }}>
            {location.name}
          </div>
        )}

        {/* ── Orientation hint if lock failed ── */}
        {orientLockFailed && !isPortrait && (
          <div style={{
            position: "absolute", bottom: 48, left: "50%",
            transform: "translateX(-50%)",
            zIndex: 20,
            backgroundColor: "rgba(10,12,9,0.7)",
            borderRadius: 12,
            padding: "6px 14px",
            color: "rgba(162,209,187,0.45)",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            textAlign: "center",
            whiteSpace: "nowrap",
            fontFamily: "'Be Vietnam Pro', sans-serif",
          }}>
            Keep phone horizontal for best experience
          </div>
        )}
      </div>
    </>
  );
}
