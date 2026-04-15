import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { VRMModel } from "./VRMModel";

/**
 * AvatarCanvas
 * ─────────────────────────────────────────────────────────────────────────────
 * Props
 *   isSpeaking    boolean   — drives mouth + speaking gestures
 *   spokenText    string    — scanned for greeting keywords (triggers wave)
 *   onSendMessage fn(text)  — called when user sends a chat message
 *   messages      array     — [{ role: "user"|"bot", text }] for history popup
 *   loadingReply  boolean   — shows loading dots in chat bar
 */
export default function AvatarCanvas({
  isSpeaking,
  spokenText,
  onSendMessage,
  messages = [],
  loadingReply = false,
  isLoading = false,
}) {
  const [loadError,      setLoadError]      = useState(null);
  const [chatInput,      setChatInput]      = useState("");
  const [showHistory,    setShowHistory]    = useState(false);
  const [historyHovered, setHistoryHovered] = useState(false);
  const historyRef  = useRef(null);
  const inputRef    = useRef(null);

  // Close history popup when clicking outside
  useEffect(() => {
    if (!showHistory) return;
    const handler = (e) => {
      if (historyRef.current && !historyRef.current.contains(e.target)) {
        setShowHistory(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showHistory]);

  const handleSend = () => {
    const text = chatInput.trim();
    if (!text || loadingReply || isLoading || isSpeaking) return;
    onSendMessage?.(text);
    setChatInput("");
    inputRef.current?.focus();
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div style={outerWrap}>

      {/* ── 3D model card ─────────────────────────────────────────────── */}
      <div style={cardStyle}>
        {/* Speaking glow border */}
        <div style={glowBorder(isSpeaking)} />

        {/* ARCHIVIST label */}
        <div style={labelRow}>
          <span style={labelDot(isSpeaking)} />
          <span style={labelText}>ARCHIVIST</span>
        </div>

        {/* Chat history button — top-right corner of card */}
        <div style={{ position: "absolute", top: "12px", right: "12px", zIndex: 10 }}>
          <button
            title="Chat history"
            onMouseEnter={() => setHistoryHovered(true)}
            onMouseLeave={() => setHistoryHovered(false)}
            onClick={() => setShowHistory((v) => !v)}
            style={historyBtnStyle(historyHovered, showHistory)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "17px", lineHeight: 1 }}>
              history
            </span>
            <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.04em" }}>History</span>
            {historyHovered && !showHistory && (
              <span style={historyTooltipStyle}>Chat history</span>
            )}
          </button>
        </div>

        {/* History popup */}
        {showHistory && (
          <div ref={historyRef} style={historyPopup}>
            <div style={historyHeader}>
              <span style={{ fontWeight: 700, fontSize: "11px", color: "#a2d1bb", letterSpacing: "0.08em" }}>
                CHAT HISTORY
              </span>
              <button onClick={() => setShowHistory(false)} style={closeBtn}>✕</button>
            </div>
            <div style={historyBody}>
              {messages.length === 0 ? (
                <p style={{ color: "rgba(192,200,195,0.4)", fontSize: "11px", textAlign: "center", paddingTop: "20px" }}>
                  No messages yet
                </p>
              ) : (
                messages.map((m, i) => (
                  <div key={i} style={msgBubble(m.role)}>
                    <span style={msgLabel(m.role)}>{m.role === "user" ? "You" : "Archivist"}</span>
                    <p style={msgText(m.role)}>{m.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Loading overlay — visible while waiting for TTS to start */}
        {isLoading && !isSpeaking && (
          <div style={loadingOverlay}>
            <div style={loadingDots}>
              <span style={dot(0)} />
              <span style={dot(1)} />
              <span style={dot(2)} />
            </div>
          </div>
        )}

        {loadError ? (
          <div style={errorStyle}>
            <span style={{ fontSize: "28px", opacity: 0.4 }}>⚠</span>
            <span style={{ fontSize: "10px", opacity: 0.5, marginTop: "4px" }}>Avatar unavailable</span>
          </div>
        ) : (
          <Canvas
            camera={{ position: [0, 0, 1.62], fov: 38, near: 0.01, far: 20 }}
            gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
            style={canvasStyle}
          >
            <ambientLight intensity={0.7} />
            <directionalLight position={[1.5, 2.5, 2]} intensity={1.4} color="#ffe8d6" />
            <directionalLight position={[-1, 1, 1]}    intensity={0.4} color="#c8e8ff" />
            <VRMModel
              isSpeaking={isSpeaking}
              spokenText={spokenText}
              onError={(msg) => { console.warn("[AvatarCanvas] VRM load error:", msg); setLoadError(msg); }}
            />
          </Canvas>
        )}
      </div>

      {/* ── Chat bar ──────────────────────────────────────────────────── */}
      {(() => {
        const blocked = loadingReply || isLoading || isSpeaking;
        const placeholder = loadingReply
          ? "Archivist is thinking…"
          : (isLoading || isSpeaking)
            ? "Archivist is speaking…"
            : "Ask the Archivist…";
        return (
          <div style={chatBar}>
            <input
              ref={inputRef}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={placeholder}
              disabled={blocked}
              style={chatInput_style(blocked)}
            />
            <button
              onClick={handleSend}
              disabled={!chatInput.trim() || blocked}
              style={sendBtn(!chatInput.trim() || blocked)}
            >
              {blocked
                ? <span style={dotsStyle}>···</span>
                : <span className="material-symbols-outlined" style={{ fontSize: "17px", lineHeight: 1 }}>send</span>
              }
            </button>
          </div>
        );
      })()}

    </div>
  );
}

// ─── Outer container (model card + chat bar stacked) ─────────────────────────
const outerWrap = {
  position:  "fixed",
  bottom:    "36px",   // raised ~8px
  right:     "28px",
  width:     "300px",  // narrower
  zIndex:    1000,
  display:   "flex",
  flexDirection: "column",
  gap:       "8px",
  pointerEvents: "none",   // children opt-in with pointerEvents: "auto"
};

// ─── 3D card ──────────────────────────────────────────────────────────────────
const cardStyle = {
  position:        "relative",
  width:           "100%",
  height:          "310px",   // ~7% taller than previous 290px → model appears bigger
  borderRadius:    "16px",
  overflow:        "hidden",
  backgroundColor: "rgba(14, 18, 12, 0.72)",
  backdropFilter:  "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border:          "1px solid rgba(162, 209, 187, 0.13)",
  boxShadow:       "0 8px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(162,209,187,0.07)",
  pointerEvents:   "auto",
};

function glowBorder(speaking) {
  return {
    position:     "absolute",
    inset:        0,
    borderRadius: "16px",
    border:       speaking
      ? "1px solid rgba(162,209,187,0.45)"
      : "1px solid rgba(162,209,187,0.08)",
    transition:   "border-color 0.4s ease",
    pointerEvents: "none",
    zIndex:        2,
  };
}

const labelRow = {
  position:        "absolute",
  bottom:          "10px",
  left:            0,
  right:           0,
  display:         "flex",
  alignItems:      "center",
  justifyContent:  "center",
  gap:             "5px",
  zIndex:          3,
  pointerEvents:   "none",
};

function labelDot(speaking) {
  return {
    width:           "5px",
    height:          "5px",
    borderRadius:    "50%",
    backgroundColor: speaking ? "#a2d1bb" : "rgba(162,209,187,0.35)",
    boxShadow:       speaking ? "0 0 6px #a2d1bb" : "none",
    transition:      "background-color 0.3s ease, box-shadow 0.3s ease",
    flexShrink:      0,
  };
}

const labelText = {
  fontSize:      "9px",
  fontWeight:    "900",
  letterSpacing: "0.14em",
  color:         "rgba(162,209,187,0.55)",
};

const canvasStyle = { width: "100%", height: "100%", background: "transparent", display: "block" };
const errorStyle  = { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#a2d1bb" };

// ─── History button ───────────────────────────────────────────────────────────
function historyBtnStyle(hovered, active) {
  return {
    position:        "relative",
    display:         "flex",
    alignItems:      "center",
    justifyContent:  "center",
    gap:             "5px",
    padding:         "7px 12px",
    border:          active ? "1px solid rgba(162,209,187,0.4)" : "1px solid rgba(162,209,187,0.15)",
    borderRadius:    "10px",
    cursor:          "pointer",
    backgroundColor: active || hovered ? "rgba(162,209,187,0.18)" : "rgba(162,209,187,0.07)",
    color:           "#a2d1bb",
    transition:      "background 0.2s, border-color 0.2s",
    pointerEvents:   "auto",
    backdropFilter:  "blur(8px)",
  };
}

const historyTooltipStyle = {
  position:        "absolute",
  top:             "calc(100% + 6px)",
  right:           0,
  backgroundColor: "rgba(14,18,12,0.97)",
  border:          "1px solid rgba(162,209,187,0.2)",
  borderRadius:    "8px",
  padding:         "5px 10px",
  fontSize:        "11px",
  fontWeight:      "600",
  color:           "#a2d1bb",
  whiteSpace:      "nowrap",
  pointerEvents:   "none",
  zIndex:          20,
};

// ─── History popup ────────────────────────────────────────────────────────────
const historyPopup = {
  position:        "absolute",
  top:             "44px",
  right:           "0px",
  width:           "340px",
  maxHeight:       "360px",
  borderRadius:    "12px",
  overflow:        "hidden",
  backgroundColor: "rgba(14,18,12,0.97)",
  backdropFilter:  "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border:          "1px solid rgba(162,209,187,0.2)",
  boxShadow:       "0 8px 32px rgba(0,0,0,0.6)",
  zIndex:          15,
  display:         "flex",
  flexDirection:   "column",
  pointerEvents:   "auto",
};

const historyHeader = {
  display:         "flex",
  alignItems:      "center",
  justifyContent:  "space-between",
  padding:         "14px 16px 10px",
  borderBottom:    "1px solid rgba(65,73,68,0.5)",
  flexShrink:      0,
};

const historyBody = {
  overflowY:  "auto",
  flex:       1,
  padding:    "8px",
  display:    "flex",
  flexDirection: "column",
  gap:        "6px",
};

const closeBtn = {
  background: "none",
  border:     "none",
  cursor:     "pointer",
  color:      "rgba(192,200,195,0.5)",
  fontSize:   "12px",
  padding:    0,
  lineHeight: 1,
};

function msgBubble(role) {
  return {
    display:         "flex",
    flexDirection:   "column",
    alignItems:      role === "user" ? "flex-end" : "flex-start",
    gap:             "2px",
  };
}
function msgLabel(role) {
  return {
    fontSize:  "9px",
    fontWeight: "700",
    letterSpacing: "0.08em",
    color:     role === "user" ? "rgba(162,209,187,0.5)" : "rgba(233,195,73,0.5)",
    textTransform: "uppercase",
  };
}
function msgText(role) {
  return {
    margin:          0,
    padding:         "8px 12px",
    borderRadius:    role === "user" ? "10px 10px 2px 10px" : "10px 10px 10px 2px",
    backgroundColor: role === "user" ? "rgba(162,209,187,0.1)" : "rgba(233,195,73,0.08)",
    color:           "rgba(192,200,195,0.9)",
    fontSize:        "13px",
    lineHeight:      "1.55",
    maxWidth:        "92%",
    wordBreak:       "break-word",
  };
}

// ─── Chat bar ─────────────────────────────────────────────────────────────────
const chatBar = {
  display:         "flex",
  alignItems:      "center",
  gap:             "8px",
  padding:         "8px 10px",
  borderRadius:    "12px",
  backgroundColor: "rgba(14,18,12,0.80)",
  backdropFilter:  "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border:          "1px solid rgba(162,209,187,0.13)",
  boxShadow:       "0 4px 20px rgba(0,0,0,0.4)",
  pointerEvents:   "auto",
};

function chatInput_style(disabled) {
  return {
    flex:            1,
    background:      "none",
    border:          "none",
    outline:         "none",
    color:           disabled ? "rgba(192,200,195,0.35)" : "#e3e3d9",
    fontSize:        "12px",
    fontFamily:      "inherit",
    placeholder:     "#666",
    cursor:          disabled ? "not-allowed" : "text",
  };
}

function sendBtn(disabled) {
  return {
    flexShrink:      0,
    width:           "30px",
    height:          "30px",
    borderRadius:    "8px",
    border:          "none",
    cursor:          disabled ? "not-allowed" : "pointer",
    backgroundColor: disabled ? "rgba(162,209,187,0.08)" : "rgba(162,209,187,0.18)",
    color:           disabled ? "rgba(162,209,187,0.3)" : "#a2d1bb",
    display:         "flex",
    alignItems:      "center",
    justifyContent:  "center",
    transition:      "background 0.2s",
  };
}

const dotsStyle = {
  fontSize:      "18px",
  letterSpacing: "2px",
  lineHeight:    1,
  animation:     "pulse 1s infinite",
};

// ─── Loading overlay (waiting for TTS to start) ───────────────────────────────
const loadingOverlay = {
  position:        "absolute",
  inset:           0,
  borderRadius:    "16px",
  display:         "flex",
  alignItems:      "flex-end",
  justifyContent:  "center",
  paddingBottom:   "38px",
  zIndex:          4,
  pointerEvents:   "none",
  background:      "linear-gradient(to top, rgba(14,18,12,0.55) 0%, transparent 55%)",
};

const loadingDots = {
  display:         "flex",
  alignItems:      "center",
  gap:             "7px",
};

function dot(i) {
  return {
    display:         "inline-block",
    width:           "7px",
    height:          "7px",
    borderRadius:    "50%",
    backgroundColor: "#a2d1bb",
    opacity:         0.85,
    animation:       `avatarDotBounce 1.1s ease-in-out ${i * 0.18}s infinite`,
  };
}

// Inject keyframes once
if (typeof document !== "undefined" && !document.getElementById("avatarDotStyle")) {
  const s = document.createElement("style");
  s.id = "avatarDotStyle";
  s.textContent = `
    @keyframes avatarDotBounce {
      0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
      40%           { transform: translateY(-8px); opacity: 1; }
    }
  `;
  document.head.appendChild(s);
}
