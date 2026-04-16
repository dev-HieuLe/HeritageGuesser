import { useState, useEffect, useRef, useContext } from "react";
import { GoogleMap, StreetViewPanorama, LoadScriptNext } from "@react-google-maps/api";
import axios from "axios";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { AuthContext } from "../../Context/authContext";
import { Link } from "react-router-dom";

export default function Game() {
  const [index, setIndex] = useState(0);
  const [heritage, setHeritage] = useState("");
  const [ageGuess, setAgeGuess] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatCount, setChatCount] = useState(0);
  const [locations, setLocations] = useState([]);
  const [result, setResult] = useState(null);
  const [finished, setFinished] = useState(false);
  const [loadingReply, setLoadingReply] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const [isSending, setIsSending] = useState(false);
  const [lastSentTime, setLastSentTime] = useState(0);
  const [sessionMessages, setSessionMessages] = useState(0);
  const COOLDOWN = 2000;
  const MAX_SESSION_MESSAGES = 50;

  const [countdown, setCountdown] = useState(3);
  const [isBlurred, setIsBlurred] = useState(true);
  const [timeLeft, setTimeLeft] = useState(180);
  const [showConfetti, setShowConfetti] = useState(false);
  const [notification, setNotification] = useState(null);

  const MAX_DAILY_PLAYS = 5;
  const [canPlay, setCanPlay] = useState(true);
  const [playsLeft, setPlaysLeft] = useState(MAX_DAILY_PLAYS);

  const messagesEndRef = useRef(null);
  const { width, height } = useWindowSize();
  const { user, setUser } = useContext(AuthContext);

  const getTodayData = () => {
    const today = new Date().toDateString();
    const data = JSON.parse(localStorage.getItem("gameUsage")) || {};
    if (data.date !== today) {
      const newData = { date: today, count: 0 };
      localStorage.setItem("gameUsage", JSON.stringify(newData));
      return newData;
    }
    return data;
  };

  const updateLimitState = () => {
    const data = getTodayData();
    const remaining = MAX_DAILY_PLAYS - data.count;
    setPlaysLeft(remaining);
    setCanPlay(remaining > 0);
  };

  useEffect(() => { updateLimitState(); }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingReply]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/locations`)
      .then((res) => setLocations(res.data))
      .catch((err) => console.error("Error fetching locations", err));
  }, []);

  const startNewRound = () => {
    const data = getTodayData();
    const remaining = MAX_DAILY_PLAYS - data.count;
    if (remaining <= 0) { setCanPlay(false); return; }

    data.count += 1;
    localStorage.setItem("gameUsage", JSON.stringify(data));
    const newRemaining = MAX_DAILY_PLAYS - data.count;
    setPlaysLeft(newRemaining);
    setCanPlay(newRemaining > 0);
    setIsBlurred(true);
    setCountdown(3);
    setTimeLeft(180);
    setShowConfetti(false);

    let counter = 3;
    const interval = setInterval(() => {
      counter--;
      setCountdown(counter);
      if (counter === 0) { clearInterval(interval); setIsBlurred(false); }
    }, 1000);
  };

  useEffect(() => {
    if (locations.length > 0 && canPlay) startNewRound();
  }, [index, locations, canPlay]);

  useEffect(() => {
    if (!isBlurred && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((p) => p - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [isBlurred, timeLeft]);

  const sendMessage = async () => {
    if (locations.length === 0 || !chatInput.trim() || chatCount >= 10) return;
    if (sessionMessages >= MAX_SESSION_MESSAGES) { alert("Session limit reached."); return; }
    const now = Date.now();
    if (now - lastSentTime < COOLDOWN || isSending) return;

    setIsSending(true);
    setLastSentTime(now);
    const userMsg = { role: "user", text: chatInput.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatCount((p) => p + 1);
    setSessionMessages((p) => p + 1);
    setLoadingReply(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/chat`,
        { message: userMsg.text, locationId: locations[index].id },
        { withCredentials: true }
      );
      setMessages((prev) => [...prev, { role: "bot", text: res.data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: "Failed to connect to The Archivist." }]);
    } finally {
      setLoadingReply(false);
      setIsSending(false);
    }
  };

  const handleSubmit = async () => {
    if (locations.length === 0) return;
    const current = locations[index];
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/heritage/check`,
        { answer: heritage, locationId: current.id },
        { withCredentials: true }
      );
      const { nameScore, similarity } = res.data;
      const diff = Math.abs(Number(ageGuess) - Number(current.years_old));
      let ageScore = 0;
      if (diff <= 10) ageScore = 5;
      else if (diff <= 20) ageScore = 4;
      else if (diff <= 30) ageScore = 3;
      else if (diff <= 50) ageScore = 2;
      else if (diff <= 80) ageScore = 1;

      const total = nameScore + ageScore;
      const levelGain = total / 10;

      if (user) {
        setUser({ ...user, level: (user.level || 0) + levelGain });
        try {
          await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/player/update-level`,
            { levelGain },
            { withCredentials: true }
          );
        } catch {}

        try {
          await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/player/history`,
            { locationId: current.id, score: total, nameScore, ageScore, difficulty: current.difficulty || 1 },
            { withCredentials: true }
          );
        } catch {}
      }

      setResult({ total, nameScore, ageScore, similarity, ageDiff: diff, correctName: current.name, correctAge: current.years_old });
      if (total === 10) { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 7000); }
    } catch (err) {
      console.error("Check answer failed:", err);
    }
  };

  const handleContinue = () => {
    if (index + 1 < locations.length) {
      setIndex((s) => s + 1);
      setHeritage(""); setAgeGuess(""); setResult(null);
      setMessages([]); setChatCount(0); setSessionMessages(0);
      updateLimitState();
    } else {
      setFinished(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (!isSending) sendMessage(); }
  };

  const current = locations[index];
  const accuracy = current ? Math.min(100, Math.round((chatCount / 10) * 50 + 50)) : 94;
  const mins = Math.floor(timeLeft / 60);
  const secs = String(timeLeft % 60).padStart(2, "0");

  return (
    <LoadScriptNext googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div
        className="w-full h-screen flex flex-col relative overflow-hidden"
        style={{ backgroundColor: "#12140e", fontFamily: "'Be Vietnam Pro', sans-serif" }}
      >
        {showConfetti && <Confetti width={width} height={height} recycle={false} />}

        {/* Daily limit wall */}
        {!canPlay && (
          <div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center"
            style={{ backgroundColor: "rgba(18,20,14,0.97)" }}
          >
            <span className="material-symbols-outlined mb-4" style={{ color: "#bb0308", fontSize: "64px", fontVariationSettings: "'FILL' 1" }}>
              block
            </span>
            <h2 className="text-3xl font-black mb-2" style={{ color: "#ffb4a9" }}>Archive Sealed</h2>
            <p style={{ color: "rgba(192,200,195,0.6)" }}>Daily limit of {MAX_DAILY_PLAYS} sessions reached.</p>
            <p className="mt-1" style={{ color: "rgba(192,200,195,0.4)", fontSize: "13px" }}>The archive reopens tomorrow.</p>
            <Link
              to="/"
              className="mt-8 px-8 py-3 font-black uppercase tracking-widest"
              style={{
                backgroundColor: "#bb0308", color: "#ffc8c0", borderRadius: "4px",
                fontSize: "11px", textDecoration: "none",
              }}
            >
              Return to Sanctuary
            </Link>
          </div>
        )}

        {/* Finished wall */}
        {finished && (
          <div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center"
            style={{ backgroundColor: "rgba(18,20,14,0.97)" }}
          >
            <span className="material-symbols-outlined mb-4" style={{ color: "#e9c349", fontSize: "64px", fontVariationSettings: "'FILL' 1" }}>
              workspace_premium
            </span>
            <h2 className="text-4xl font-black mb-2" style={{ color: "#e3e3d9" }}>Session Complete</h2>
            <p style={{ color: "rgba(192,200,195,0.6)" }}>All heritage sites have been catalogued.</p>
            <div className="flex gap-4 mt-8">
              <Link
                to="/"
                className="px-8 py-3 font-black uppercase tracking-widest"
                style={{
                  backgroundColor: "#1e201a", color: "#a2d1bb",
                  border: "1px solid rgba(162,209,187,0.2)", borderRadius: "4px",
                  fontSize: "11px", textDecoration: "none",
                }}
              >
                Sanctuary
              </Link>
              <Link
                to="/leaderboard"
                className="px-8 py-3 font-black uppercase tracking-widest"
                style={{
                  backgroundColor: "#bb0308", color: "#ffc8c0",
                  borderRadius: "4px", fontSize: "11px", textDecoration: "none",
                }}
              >
                View Ranks
              </Link>
            </div>
          </div>
        )}

        {/* TOP BAR */}
        <header
          className="flex justify-between items-center px-3 sm:px-6 py-2 sm:py-3 z-30 flex-shrink-0"
          style={{ background: "linear-gradient(to bottom, rgba(15,61,46,0.95), transparent)" }}
        >
          <Link to="/" style={{ color: "#a2d1bb", fontWeight: "900", fontSize: "16px", textDecoration: "none" }}>
            Heritage Guessr
          </Link>

          {/* Timer */}
          {!finished && (
            <div
              className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full"
              style={{
                backgroundColor: "rgba(30,32,26,0.7)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(65,73,68,0.4)",
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: timeLeft > 60 ? "#a2d1bb" : "#bb0308", animation: "pulse 1s infinite" }}
              />
              <span
                className="font-black tracking-widest"
                style={{ color: timeLeft > 60 ? "#e9c349" : "#ffb4a9", fontSize: "14px" }}
              >
                {mins}:{secs}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-full"
              style={{ backgroundColor: "rgba(30,32,26,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(65,73,68,0.4)" }}
            >
              <span className="material-symbols-outlined" style={{ color: "#e9c349", fontSize: "13px" }}>
                play_circle
              </span>
              <span style={{ color: "rgba(192,200,195,0.7)", fontSize: "11px", fontWeight: "700" }}>
                {playsLeft} left
              </span>
            </div>
            {user && (
              <div className="hidden sm:block" style={{ color: "rgba(162,209,187,0.6)", fontSize: "11px", fontWeight: "700" }}>
                Lv. {Math.floor(user.level || 0)}
              </div>
            )}
          </div>
        </header>

        {/* STREET VIEW CANVAS */}
        <div className="flex-1 relative">
          {canPlay && (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={current ? { lat: current.lat, lng: current.lng } : { lat: 16.0471, lng: 108.2062 }}
              zoom={14}
              options={{ disableDefaultUI: true }}
            >
              {current && !isBlurred && (
                <StreetViewPanorama
                  key={index}
                  position={{ lat: current.lat, lng: current.lng }}
                  visible
                  options={{ disableDefaultUI: true, linksControl: true, panControl: true }}
                />
              )}
            </GoogleMap>
          )}

          {/* COUNTDOWN OVERLAY */}
          {isBlurred && !finished && canPlay && (
            <div
              className="absolute inset-0 flex items-center justify-center z-20"
              style={{ backgroundColor: "rgba(12,14,10,0.85)", backdropFilter: "blur(8px)" }}
            >
              <div className="text-center">
                {countdown > 0 ? (
                  <>
                    <span
                      className="font-black"
                      style={{ fontSize: "120px", color: "#e9c349", lineHeight: 1, textShadow: "0 0 60px rgba(233,195,73,0.5)" }}
                    >
                      {countdown}
                    </span>
                    <p className="uppercase tracking-widest mt-4" style={{ color: "rgba(162,209,187,0.6)", fontSize: "12px" }}>
                      Prepare the Archive
                    </p>
                  </>
                ) : null}
              </div>
            </div>
          )}

          {/* TOP LEFT: Chamber info */}
          {!isBlurred && !result && !finished && (
            <div
              className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20 p-3 sm:p-5 rounded-xl"
              style={{
                background: "rgba(18,20,14,0.7)",
                backdropFilter: "blur(20px)",
                borderLeft: "3px solid #e9c349",
                border: "1px solid rgba(65,73,68,0.3)",
                borderLeftWidth: "3px",
                borderLeftColor: "#e9c349",
                minWidth: "160px",
                maxWidth: "calc(50vw - 24px)",
              }}
            >
              <p
                className="uppercase tracking-widest font-black mb-1"
                style={{ color: "#e9c349", fontSize: "9px" }}
              >
                Chamber {index + 1}
              </p>
              <h2 className="font-black text-base sm:text-xl" style={{ color: "#ffffff" }}>
                {current?.region || "Unknown"} Heritage
              </h2>
              <div className="flex gap-1 sm:gap-1.5 mt-2 sm:mt-3">
                {locations.slice(0, Math.min(4, locations.length)).map((_, i) => (
                  <div
                    key={i}
                    className="h-1 w-6 sm:w-10 rounded-full"
                    style={{ backgroundColor: i <= index ? "#a2d1bb" : "rgba(162,209,187,0.15)" }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TOP RIGHT: Archive Synchrony */}
          {!isBlurred && !result && !finished && (
            <div
              className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 p-3 sm:p-5 rounded-xl text-right"
              style={{
                background: "rgba(18,20,14,0.7)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(65,73,68,0.3)",
              }}
            >
              <p className="uppercase tracking-widest font-bold mb-1 hidden sm:block" style={{ color: "rgba(162,209,187,0.6)", fontSize: "9px" }}>
                Archive Synchrony
              </p>
              <div className="flex items-end justify-end gap-2">
                <span className="font-black text-2xl sm:text-4xl" style={{ color: "#ffb4a9" }}>
                  {accuracy}%
                </span>
                <div
                  className="w-1.5 h-8 sm:h-10 rounded-full overflow-hidden flex flex-col justify-end"
                  style={{ backgroundColor: "#1e201a" }}
                >
                  <div
                    className="w-full rounded-full"
                    style={{
                      height: `${accuracy}%`,
                      backgroundColor: "#bb0308",
                      boxShadow: "0 0 12px rgba(187,3,8,0.7)",
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ARCHIVIST CHAT HINT (last bot message) — hidden on mobile to save space */}
          {!isBlurred && !result && !finished && messages.length > 0 && (
            <div
              className="hidden sm:block absolute bottom-24 right-4 z-20 p-4 rounded-xl max-w-xs"
              style={{
                background: "rgba(18,20,14,0.75)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(65,73,68,0.4)",
              }}
            >
              <p className="uppercase tracking-widest font-black mb-2" style={{ color: "#e9c349", fontSize: "9px" }}>
                The Archivist
              </p>
              <p style={{ color: "#e3e3d9", fontSize: "12px", lineHeight: "1.5" }}>
                {messages.filter((m) => m.role === "bot").slice(-1)[0]?.text || ""}
              </p>
            </div>
          )}

          {/* RESULT OVERLAY */}
          {result && !finished && (
            <div
              className="absolute inset-0 z-20 flex items-center justify-center overflow-y-auto"
              style={{ backgroundColor: "rgba(12,14,10,0.92)", backdropFilter: "blur(12px)" }}
            >
              <div
                className="p-5 sm:p-8 rounded-2xl max-w-lg w-full mx-3 sm:mx-4 my-4"
                style={{
                  backgroundColor: "#1e201a",
                  border: `2px solid ${result.total === 10 ? "#e9c349" : "rgba(65,73,68,0.6)"}`,
                  boxShadow: result.total === 10 ? "0 0 60px rgba(233,195,73,0.2)" : "none",
                }}
              >
                {/* Score header */}
                <div className="text-center mb-6">
                  <p className="uppercase tracking-widest font-black mb-2" style={{ color: "rgba(192,200,195,0.5)", fontSize: "10px" }}>
                    Archive Score
                  </p>
                  <div
                    className="text-7xl font-black"
                    style={{ color: result.total >= 8 ? "#e9c349" : result.total >= 5 ? "#a2d1bb" : "#ffb4a9" }}
                  >
                    {result.total}
                    <span style={{ fontSize: "32px", color: "rgba(192,200,195,0.4)" }}>/10</span>
                  </div>
                  {result.total === 10 && (
                    <p className="uppercase tracking-widest font-black mt-2" style={{ color: "#e9c349", fontSize: "11px" }}>
                      Perfect Curation!
                    </p>
                  )}
                </div>

                {/* Score breakdown */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div
                    className="text-center p-4 rounded-xl"
                    style={{ backgroundColor: "#292b24" }}
                  >
                    <p style={{ color: "rgba(192,200,195,0.5)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      Name Score
                    </p>
                    <p className="font-black text-3xl mt-1" style={{ color: "#a2d1bb" }}>
                      {result.nameScore}<span style={{ fontSize: "16px", color: "rgba(162,209,187,0.4)" }}>/5</span>
                    </p>
                    <p style={{ color: "rgba(192,200,195,0.4)", fontSize: "10px", marginTop: "4px" }}>
                      {Math.round(result.similarity * 100)}% similarity
                    </p>
                  </div>
                  <div
                    className="text-center p-4 rounded-xl"
                    style={{ backgroundColor: "#292b24" }}
                  >
                    <p style={{ color: "rgba(192,200,195,0.5)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      Age Score
                    </p>
                    <p className="font-black text-3xl mt-1" style={{ color: "#e9c349" }}>
                      {result.ageScore}<span style={{ fontSize: "16px", color: "rgba(233,195,73,0.4)" }}>/5</span>
                    </p>
                    <p style={{ color: "rgba(192,200,195,0.4)", fontSize: "10px", marginTop: "4px" }}>
                      {result.ageDiff} yr diff
                    </p>
                  </div>
                </div>

                {/* Correct answers */}
                <div
                  className="p-4 rounded-xl mb-6"
                  style={{ backgroundColor: "#12140e", border: "1px solid rgba(65,73,68,0.4)" }}
                >
                  <div className="flex justify-between mb-2">
                    <span style={{ color: "rgba(192,200,195,0.5)", fontSize: "11px" }}>Correct Site</span>
                    <span className="font-bold" style={{ color: "#a2d1bb", fontSize: "11px" }}>{result.correctName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "rgba(192,200,195,0.5)", fontSize: "11px" }}>Est. Age</span>
                    <span className="font-bold" style={{ color: "#e9c349", fontSize: "11px" }}>{result.correctAge} years</span>
                  </div>
                </div>

                <button
                  onClick={handleContinue}
                  className="w-full py-3 font-black uppercase tracking-widest transition-all active:scale-95"
                  style={{
                    backgroundColor: "#bb0308",
                    color: "#ffc8c0",
                    borderRadius: "6px",
                    fontSize: "12px",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 4px 20px rgba(187,3,8,0.3)",
                  }}
                >
                  Next Chamber →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM INPUT BAR */}
        {!isBlurred && !result && !finished && canPlay && (
          <div
            className="flex-shrink-0 z-20"
            style={{ background: "linear-gradient(to top, rgba(12,14,10,0.98) 60%, transparent)" }}
          >
            {/* Chat panel (expandable) */}
            {showChat && (
              <div
                className="mx-4 mb-2 rounded-xl overflow-hidden"
                style={{
                  backgroundColor: "rgba(18,20,14,0.85)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(65,73,68,0.4)",
                  maxHeight: "220px",
                }}
              >
                <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: "1px solid rgba(65,73,68,0.3)" }}>
                  <span className="uppercase tracking-widest font-black" style={{ color: "#e9c349", fontSize: "9px" }}>
                    Consult the Archivist ({chatCount}/10)
                  </span>
                  <button
                    onClick={() => setShowChat(false)}
                    style={{ color: "rgba(162,209,187,0.4)", background: "none", border: "none", cursor: "pointer", fontSize: "18px" }}
                    className="material-symbols-outlined"
                  >
                    close
                  </button>
                </div>
                <div className="overflow-y-auto p-3 space-y-2" style={{ maxHeight: "140px" }}>
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className="flex gap-2"
                      style={{ justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}
                    >
                      <div
                        className="px-3 py-2 rounded-lg max-w-xs"
                        style={{
                          backgroundColor: msg.role === "user" ? "#bb0308" : "#292b24",
                          color: msg.role === "user" ? "#ffc8c0" : "#e3e3d9",
                          fontSize: "12px",
                          lineHeight: "1.4",
                        }}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {loadingReply && (
                    <div className="flex gap-2">
                      <div className="px-3 py-2 rounded-lg" style={{ backgroundColor: "#292b24" }}>
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className="w-1.5 h-1.5 rounded-full"
                              style={{
                                backgroundColor: "#a2d1bb",
                                animation: `bounce 1s infinite ${i * 0.15}s`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <div className="flex gap-2 p-2" style={{ borderTop: "1px solid rgba(65,73,68,0.3)" }}>
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={chatCount >= 10 || isSending}
                    placeholder={chatCount >= 10 ? "Chat limit reached" : "Ask the Archivist..."}
                    className="flex-1 px-3 py-2 rounded-lg outline-none"
                    style={{
                      backgroundColor: "#12140e",
                      border: "1px solid rgba(65,73,68,0.4)",
                      color: "#e3e3d9",
                      fontSize: "12px",
                      fontFamily: "'Be Vietnam Pro', sans-serif",
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={chatCount >= 10 || isSending}
                    className="px-3 py-2 rounded-lg font-bold transition-all active:scale-95"
                    style={{
                      backgroundColor: chatCount >= 10 ? "#292b24" : "#bb0308",
                      color: chatCount >= 10 ? "rgba(192,200,195,0.3)" : "#ffc8c0",
                      border: "none",
                      cursor: chatCount >= 10 ? "not-allowed" : "pointer",
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>send</span>
                  </button>
                </div>
              </div>
            )}

            {/* Main input bar */}
            <div className="game-input-bar flex items-center gap-2 sm:gap-3 px-3 sm:px-4 pb-3 sm:pb-4 pt-2">
              {/* Heritage name input */}
              <div className="game-input-name flex-1 relative">
                <span
                  className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(162,209,187,0.4)", fontSize: "18px" }}
                >
                  location_on
                </span>
                <input
                  value={heritage}
                  onChange={(e) => setHeritage(e.target.value)}
                  placeholder="Name this heritage site..."
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl outline-none"
                  style={{
                    backgroundColor: "rgba(30,32,26,0.8)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(65,73,68,0.5)",
                    color: "#e3e3d9",
                    fontSize: "14px",
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                  }}
                />
              </div>

              {/* Age input */}
              <div className="game-input-age relative" style={{ width: "100px" }}>
                <span
                  className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(233,195,73,0.5)", fontSize: "15px" }}
                >
                  calendar_month
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={ageGuess}
                  onChange={(e) => setAgeGuess(e.target.value)}
                  placeholder="Age (yr)"
                  className="w-full pl-8 pr-2 py-2.5 sm:py-3 rounded-xl outline-none"
                  style={{
                    backgroundColor: "rgba(30,32,26,0.8)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(65,73,68,0.5)",
                    color: "#e3e3d9",
                    fontSize: "13px",
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                  }}
                />
              </div>

              {/* Consult Archive */}
              <button
                onClick={() => setShowChat((p) => !p)}
                className="game-btn-chat flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2.5 sm:py-3 rounded-xl font-black uppercase tracking-widest transition-all"
                style={{
                  backgroundColor: showChat ? "rgba(162,209,187,0.15)" : "rgba(30,32,26,0.8)",
                  backdropFilter: "blur(12px)",
                  border: showChat ? "1px solid rgba(162,209,187,0.3)" : "1px solid rgba(65,73,68,0.5)",
                  color: showChat ? "#a2d1bb" : "rgba(162,209,187,0.6)",
                  fontSize: "10px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>forum</span>
                <span className="hidden sm:inline">Consult Archive</span>
              </button>

              {/* Record Guess */}
              <button
                onClick={handleSubmit}
                className="game-btn-submit flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3 rounded-xl font-black uppercase tracking-widest transition-all active:scale-95"
                style={{
                  backgroundColor: "#bb0308",
                  color: "#ffc8c0",
                  fontSize: "11px",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(187,3,8,0.35)",
                  whiteSpace: "nowrap",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>check_circle</span>
                <span className="hidden sm:inline">Record Guess</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </LoadScriptNext>
  );
}
