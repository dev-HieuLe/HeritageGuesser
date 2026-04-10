import { useEffect, useState } from "react";

/**
 * AuthToast — in-app notification for auth errors.
 * Props:
 *   message  {string}  — text to display
 *   onClose  {fn}      — called when dismissed or expired
 *   duration {number}  — ms before auto-dismiss (default 4500)
 */
export default function AuthToast({ message, onClose, duration = 4500 }) {
  const [visible, setVisible] = useState(false);

  // Slide in on mount
  useEffect(() => {
    const show = requestAnimationFrame(() => setVisible(true));
    const hide = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 350); // wait for slide-out
    }, duration);
    return () => {
      cancelAnimationFrame(show);
      clearTimeout(hide);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: "24px",
        right: "24px",
        zIndex: 9999,
        transform: visible ? "translateX(0)" : "translateX(calc(100% + 32px))",
        opacity: visible ? 1 : 0,
        transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.35s ease",
        maxWidth: "340px",
        width: "max-content",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          padding: "14px 16px",
          backgroundColor: "#0d1f18",
          border: "1px solid rgba(187, 3, 8, 0.45)",
          borderLeft: "3px solid #bb0308",
          borderRadius: "6px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(187,3,8,0.1)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          fontFamily: "'Be Vietnam Pro', sans-serif",
        }}
      >
        {/* Icon */}
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: "20px",
            color: "#ffb4a9",
            flexShrink: 0,
            marginTop: "1px",
          }}
        >
          lock
        </span>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#ffb4a9",
              marginBottom: "3px",
            }}
          >
            Access Restricted
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              color: "rgba(227, 227, 217, 0.75)",
              lineHeight: 1.5,
            }}
          >
            {message}
          </p>
        </div>

        {/* Dismiss button */}
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 350);
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "2px",
            flexShrink: 0,
            color: "rgba(162,209,187,0.4)",
            display: "flex",
            alignItems: "center",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(162,209,187,0.9)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(162,209,187,0.4)")}
          aria-label="Dismiss"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>close</span>
        </button>
      </div>

      {/* Progress bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "3px",
          right: 0,
          height: "2px",
          borderRadius: "0 0 6px 6px",
          overflow: "hidden",
          backgroundColor: "rgba(187,3,8,0.2)",
        }}
      >
        <div
          style={{
            height: "100%",
            backgroundColor: "#bb0308",
            width: visible ? "0%" : "100%",
            transition: visible ? `width ${duration}ms linear` : "none",
          }}
        />
      </div>
    </div>
  );
}
