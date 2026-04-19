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
  chatCount = 0,
  maxChat = 10,
}) {
  const [loadError,      setLoadError]      = useState(null);
  const [modelLoaded,    setModelLoaded]    = useState(false);
  const [contextLost,    setContextLost]    = useState(false);
  const [chatInput,      setChatInput]      = useState("");
  const [showHistory,    setShowHistory]    = useState(false);
  const [historyHovered, setHistoryHovered] = useState(false);
  const [showIntro,      setShowIntro]      = useState(true);
  const [isMobile,       setIsMobile]       = useState(() => window.innerWidth < 768);
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const historyRef = useRef(null);
  const inputRef   = useRef(null);

  // Track mobile breakpoint
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Reset model state when mobile panel closes so spinner shows again on reopen
  useEffect(() => {
    if (!mobileOpen) { setModelLoaded(false); setContextLost(false); setLoadError(null); }
  }, [mobileOpen]);

  // Auto-dismiss intro after 5 seconds
  useEffect(() => {
    if (!showIntro) return;
    const t = setTimeout(() => setShowIntro(false), 5000);
    return () => clearTimeout(t);
  }, [showIntro]);

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

  const chatLimitReached = chatCount >= maxChat;

  const handleSend = () => {
    const text = chatInput.trim();
    if (!text || loadingReply || isLoading || isSpeaking || chatLimitReached) return;
    onSendMessage?.(text);
    setChatInput("");
    inputRef.current?.focus();
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // ── Shared panel content (3D card + chat bar) ──────────────────────────────
  const blocked     = loadingReply || isLoading || isSpeaking || chatLimitReached;
  const placeholder = chatLimitReached
    ? "Question limit reached"
    : loadingReply
      ? "Archivist is thinking…"
      : (isLoading || isSpeaking)
        ? "Archivist is speaking…"
        : "Ask the Archivist…";

  const cardContent = (mobile) => (
    <>
      {/* Intro notification */}
      {showIntro && (
        <div style={introBanner}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <span className="material-symbols-outlined" style={{ color: "#e9c349", fontSize: "18px", flexShrink: 0, marginTop: "1px", fontVariationSettings: "'FILL' 1" }}>
                emoji_people
              </span>
              <div>
                <p style={{ margin: 0, fontSize: "12px", fontWeight: "800", color: "#e3e3d9", letterSpacing: "0.02em" }}>
                  Meet Savannah, your Archivist!
                </p>
                <p style={{ margin: "4px 0 0", fontSize: "11px", color: "rgba(192,200,195,0.75)", lineHeight: "1.5" }}>
                  Ask her up to <span style={{ color: "#e9c349", fontWeight: "700" }}>10 questions</span> for hints about this heritage site. Use them wisely!
                </p>
              </div>
            </div>
            <button onClick={() => setShowIntro(false)} style={introCloseBtn}>✕</button>
          </div>
        </div>
      )}

      {/* 3D model card */}
      <div style={cardStyle(mobile)}>
        <div style={glowBorder(isSpeaking)} />

        <div style={labelRow}>
          <span style={labelDot(isSpeaking)} />
          <span style={labelText}>SAVANNAH</span>
          <div style={chatCounterBadge(chatCount, maxChat)}>
            <span className="material-symbols-outlined" style={{ fontSize: "11px", lineHeight: 1 }}>chat</span>
            <span style={{ fontSize: "10px", fontWeight: "800" }}>{chatCount}/{maxChat}</span>
          </div>
        </div>

        {/* Chat history button */}
        <div style={{ position: "absolute", top: "12px", right: "12px", zIndex: 10 }}>
          <button
            title="Chat history"
            onMouseEnter={() => setHistoryHovered(true)}
            onMouseLeave={() => setHistoryHovered(false)}
            onClick={() => setShowHistory((v) => !v)}
            style={historyBtnStyle(historyHovered, showHistory)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "17px", lineHeight: 1 }}>history</span>
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

        {/* TTS loading overlay (speaking dots) */}
        {isLoading && !isSpeaking && modelLoaded && (
          <div style={loadingOverlay}>
            <div style={loadingDots}>
              <span style={dot(0)} />
              <span style={dot(1)} />
              <span style={dot(2)} />
            </div>
          </div>
        )}

        {/* Model loading spinner — shown until VRM finishes loading */}
        {!modelLoaded && !loadError && !contextLost && (
          <div style={modelLoadingOverlay}>
            <div style={modelSpinner} />
            <span style={{ fontSize: "11px", color: "rgba(162,209,187,0.55)", marginTop: "12px", letterSpacing: "0.06em" }}>
              Loading Savannah…
            </span>
          </div>
        )}

        {/* WebGL context lost */}
        {contextLost && (
          <div style={errorStyle}>
            <span className="material-symbols-outlined" style={{ fontSize: "28px", color: "rgba(162,209,187,0.3)" }}>warning</span>
            <span style={{ fontSize: "10px", color: "rgba(192,200,195,0.4)", marginTop: "6px", textAlign: "center", padding: "0 12px" }}>
              GPU context lost
            </span>
            <button
              onClick={() => { setContextLost(false); setModelLoaded(false); }}
              style={{ marginTop: "10px", fontSize: "10px", padding: "5px 12px", borderRadius: "8px", border: "1px solid rgba(162,209,187,0.3)", background: "rgba(162,209,187,0.08)", color: "#a2d1bb", cursor: "pointer" }}
            >
              Retry
            </button>
          </div>
        )}

        {loadError && !contextLost && (
          <div style={errorStyle}>
            <span style={{ fontSize: "28px", opacity: 0.4 }}>⚠</span>
            <span style={{ fontSize: "10px", opacity: 0.5, marginTop: "4px" }}>Avatar unavailable</span>
          </div>
        )}

        {!loadError && !contextLost && (
          <Canvas
            camera={{ position: [0, 0, 1.62], fov: 38, near: 0.01, far: 20 }}
            gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
            style={canvasStyle}
            onCreated={({ gl }) => {
              gl.domElement.addEventListener("webglcontextlost", (e) => {
                e.preventDefault();
                setContextLost(true);
                setModelLoaded(false);
              });
              gl.domElement.addEventListener("webglcontextrestored", () => {
                setContextLost(false);
                setModelLoaded(false);
              });
            }}
          >
            <ambientLight intensity={0.7} />
            <directionalLight position={[1.5, 2.5, 2]} intensity={1.4} color="#ffe8d6" />
            <directionalLight position={[-1, 1, 1]}    intensity={0.4} color="#c8e8ff" />
            <VRMModel
              isSpeaking={isSpeaking}
              spokenText={spokenText}
              onLoaded={() => setModelLoaded(true)}
              onError={(msg) => { console.warn("[AvatarCanvas] VRM load error:", msg); setLoadError(msg); }}
            />
          </Canvas>
        )}
      </div>

      {/* Chat bar */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", pointerEvents: "auto" }}>
        {chatLimitReached && (
          <div style={{
            padding: "8px 12px",
            borderRadius: "10px",
            backgroundColor: "rgba(187,3,8,0.15)",
            border: "1px solid rgba(187,3,8,0.3)",
            color: "#ffb4a9",
            fontSize: "11px",
            fontWeight: "600",
            textAlign: "center",
            letterSpacing: "0.02em",
          }}>
            You've used all 10 questions. Make your guess!
          </div>
        )}
        <div style={chatBar}>
          <input
            ref={inputRef}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={placeholder}
            disabled={blocked}
            style={chatInputStyle(blocked)}
          />
          <button
            onClick={handleSend}
            disabled={!chatInput.trim() || blocked}
            style={sendBtn(!chatInput.trim() || blocked)}
          >
            {blocked && !chatLimitReached
              ? <span style={dotsStyle}>···</span>
              : <span className="material-symbols-outlined" style={{ fontSize: "17px", lineHeight: 1 }}>send</span>
            }
          </button>
        </div>
      </div>
    </>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── MOBILE: header button always visible; panel pops below it ── */}
      {isMobile && (
        <div style={mobileContainer}>
          {/* Header row — the open/close button lives here at the top-right of the chatbot */}
          <div style={mobileHeaderRow}>
            {!mobileOpen && (
              <div style={chatbotHintBubble}>
                <span style={{ fontSize: "12px", fontWeight: "800", color: "#e3e3d9", display: "block", lineHeight: 1.3 }}>
                  Chat with Savannah
                </span>
                <span style={{ fontSize: "10px", color: "rgba(192,200,195,0.65)", display: "block", marginTop: "2px" }}>
                  Your AI Archivist
                </span>
              </div>
            )}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              style={mobileHeaderBtn(mobileOpen)}
              aria-label={mobileOpen ? "Close chatbot" : "Open chatbot"}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "20px", lineHeight: 1, fontVariationSettings: "'FILL' 1" }}>
                {mobileOpen ? "close" : "chat"}
              </span>
              {mobileOpen && (
                <span style={{ fontSize: "11px", fontWeight: "800", letterSpacing: "0.06em" }}>Close</span>
              )}
            </button>
          </div>

          {/* Panel — pops up below the header button */}
          {mobileOpen && (
            <div style={mobilePanelWrap}>
              {cardContent(true)}
            </div>
          )}
        </div>
      )}

      {/* ── DESKTOP: original layout, no changes ── */}
      {!isMobile && (
        <div style={desktopWrap}>
          {cardContent(false)}
        </div>
      )}
    </>
  );
}

// ─── Desktop outer container ──────────────────────────────────────────────────
const desktopWrap = {
  position:      "fixed",
  bottom:        "36px",
  right:         "28px",
  width:         "300px",
  zIndex:        1000,
  display:       "flex",
  flexDirection: "column",
  gap:           "8px",
  pointerEvents: "none",
};

// ─── Mobile outer container — anchored to top-right corner, panel drops down ───
const mobileContainer = {
  position:      "fixed",
  top:           "56px",   // just below the top nav bar (~50-56px tall on mobile)
  right:         "0px",
  width:         "260px",
  zIndex:        1001,
  display:       "flex",
  flexDirection: "column",
  gap:           "0px",
  alignItems:    "flex-end",
  pointerEvents: "none",
};

// ─── Mobile header row (open/close button) ────────────────────────────────────
const mobileHeaderRow = {
  display:        "flex",
  alignItems:     "center",
  justifyContent: "flex-end",
  gap:            "10px",
  padding:        "6px 12px 6px 0",
  pointerEvents:  "auto",
};

// ─── Mobile open/close button ─────────────────────────────────────────────────
function mobileHeaderBtn(open) {
  return {
    display:         "flex",
    alignItems:      "center",
    gap:             open ? "8px" : "0",
    padding:         open ? "10px 14px" : "10px 12px",
    borderRadius:    "12px",
    border:          "1px solid rgba(162,209,187,0.3)",
    cursor:          "pointer",
    backgroundColor: open ? "rgba(162,209,187,0.15)" : "rgba(15,61,46,0.88)",
    color:           "#a2d1bb",
    backdropFilter:  "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    boxShadow:       "0 4px 20px rgba(0,0,0,0.5)",
    flexShrink:      0,
    transition:      "background 0.2s",
  };
}

// ─── Mobile hint bubble (shown when closed, to the left of the button) ───────
const chatbotHintBubble = {
  padding:         "7px 12px",
  borderRadius:    "10px",
  backgroundColor: "rgba(14,18,12,0.92)",
  backdropFilter:  "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border:          "1px solid rgba(162,209,187,0.25)",
  boxShadow:       "0 4px 16px rgba(0,0,0,0.5)",
  pointerEvents:   "auto",
  whiteSpace:      "nowrap",
};

// ─── Mobile panel wrapper (drops below the header button) ─────────────────────
const mobilePanelWrap = {
  display:       "flex",
  flexDirection: "column",
  gap:           "8px",
  padding:       "4px 12px 12px 12px",
  width:         "260px",
  pointerEvents: "none",
};

// ─── 3D card ──────────────────────────────────────────────────────────────────
function cardStyle(mobile) {
  return {
    position:        "relative",
    width:           "100%",
    height:          mobile ? "240px" : "310px",
    borderRadius:    "16px",
    overflow:        "hidden",
    backgroundColor: "rgba(14, 18, 12, 0.72)",
    backdropFilter:  "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    border:          "1px solid rgba(162, 209, 187, 0.13)",
    boxShadow:       "0 8px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(162,209,187,0.07)",
    pointerEvents:   "auto",
  };
}

function glowBorder(speaking) {
  return {
    position:      "absolute",
    inset:         0,
    borderRadius:  "16px",
    border:        speaking
      ? "1px solid rgba(162,209,187,0.45)"
      : "1px solid rgba(162,209,187,0.08)",
    transition:    "border-color 0.4s ease",
    pointerEvents: "none",
    zIndex:        2,
  };
}

const labelRow = {
  position:       "absolute",
  bottom:         "10px",
  left:           0,
  right:          0,
  display:        "flex",
  alignItems:     "center",
  justifyContent: "center",
  gap:            "5px",
  zIndex:         3,
  pointerEvents:  "none",
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
  width:           "260px",
  maxHeight:       "320px",
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
  display:      "flex",
  alignItems:   "center",
  justifyContent: "space-between",
  padding:      "14px 16px 10px",
  borderBottom: "1px solid rgba(65,73,68,0.5)",
  flexShrink:   0,
};

const historyBody = {
  overflowY:     "auto",
  flex:          1,
  padding:       "8px",
  display:       "flex",
  flexDirection: "column",
  gap:           "6px",
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
    display:       "flex",
    flexDirection: "column",
    alignItems:    role === "user" ? "flex-end" : "flex-start",
    gap:           "2px",
  };
}
function msgLabel(role) {
  return {
    fontSize:      "9px",
    fontWeight:    "700",
    letterSpacing: "0.08em",
    color:         role === "user" ? "rgba(162,209,187,0.5)" : "rgba(233,195,73,0.5)",
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

function chatInputStyle(disabled) {
  return {
    flex:       1,
    background: "none",
    border:     "none",
    outline:    "none",
    color:      disabled ? "rgba(192,200,195,0.35)" : "#e3e3d9",
    fontSize:   "12px",
    fontFamily: "inherit",
    cursor:     disabled ? "not-allowed" : "text",
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

// ─── Loading overlay ──────────────────────────────────────────────────────────
const loadingOverlay = {
  position:      "absolute",
  inset:         0,
  borderRadius:  "16px",
  display:       "flex",
  alignItems:    "flex-end",
  justifyContent: "center",
  paddingBottom: "38px",
  zIndex:        4,
  pointerEvents: "none",
  background:    "linear-gradient(to top, rgba(14,18,12,0.55) 0%, transparent 55%)",
};

const loadingDots = {
  display:    "flex",
  alignItems: "center",
  gap:        "7px",
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

// ─── Intro banner ─────────────────────────────────────────────────────────────
const introBanner = {
  padding:         "12px 14px",
  borderRadius:    "12px",
  backgroundColor: "rgba(14,18,12,0.92)",
  backdropFilter:  "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border:          "1px solid rgba(233,195,73,0.3)",
  boxShadow:       "0 4px 20px rgba(0,0,0,0.5)",
  pointerEvents:   "auto",
};

const introCloseBtn = {
  background: "none",
  border:     "none",
  cursor:     "pointer",
  color:      "rgba(192,200,195,0.4)",
  fontSize:   "12px",
  padding:    0,
  lineHeight: 1,
  flexShrink: 0,
};

function chatCounterBadge(count, max) {
  const pct   = count / max;
  const color = count >= max ? "#ffb4a9" : pct >= 0.8 ? "#e9c349" : "#a2d1bb";
  return {
    display:         "flex",
    alignItems:      "center",
    gap:             "3px",
    padding:         "2px 7px",
    borderRadius:    "20px",
    backgroundColor: count >= max ? "rgba(187,3,8,0.25)" : "rgba(162,209,187,0.1)",
    border:          `1px solid ${color}40`,
    color,
    marginLeft:      "6px",
  };
}

// ─── Model loading overlay (covers canvas while VRM loads) ───────────────────
const modelLoadingOverlay = {
  position:       "absolute",
  inset:          0,
  borderRadius:   "16px",
  display:        "flex",
  flexDirection:  "column",
  alignItems:     "center",
  justifyContent: "center",
  zIndex:         5,
  background:     "rgba(14,18,12,0.72)",
  pointerEvents:  "none",
};

const modelSpinner = {
  width:        "32px",
  height:       "32px",
  borderRadius: "50%",
  border:       "2px solid rgba(162,209,187,0.15)",
  borderTop:    "2px solid #a2d1bb",
  animation:    "avatarSpin 0.9s linear infinite",
};

// Inject keyframes once
if (typeof document !== "undefined" && !document.getElementById("avatarDotStyle")) {
  const s = document.createElement("style");
  s.id = "avatarDotStyle";
  s.textContent = `
    @keyframes avatarDotBounce {
      0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
      40%           { transform: translateY(-8px); opacity: 1; }
    }
    @keyframes avatarSpin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(s);
}
