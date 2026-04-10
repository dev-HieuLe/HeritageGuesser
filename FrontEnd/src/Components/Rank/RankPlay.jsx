import { useState, useEffect, useRef, useContext } from "react";
import { GoogleMap, StreetViewPanorama, LoadScriptNext } from "@react-google-maps/api";
import axios from "axios";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { AuthContext } from "../../Context/authContext";
import { Link } from "react-router-dom";

const rankNames = [
  "Iron", "Bronze", "Silver", "Gold", "Platinum",
  "Emerald", "Diamond", "Master", "Grandmaster", "Challenger",
];

const getFeedback = (score) => {
  if (score === 10) return { label: "Perfect Curation", color: "#e9c349", icon: "workspace_premium" };
  if (score >= 8)  return { label: "Exceptional Record", color: "#a2d1bb", icon: "military_tech" };
  if (score >= 6)  return { label: "On the Right Track", color: "#e9c349", icon: "trending_up" };
  if (score >= 4)  return { label: "Partial Archive", color: "#ffb4a9", icon: "history_edu" };
  return           { label: "Record Lost", color: "#bb0308", icon: "cancel" };
};

const glassPanel = {
  background: "rgba(14, 21, 19, 0.65)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(162, 209, 187, 0.1)",
};

export default function RankPlay() {
  const [heritage, setHeritage] = useState("");
  const [ageGuess, setAgeGuess] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatCount, setChatCount] = useState(0);
  const [showChat, setShowChat] = useState(true);

  const MAX_DAILY_PLAYS = 50;
  const [canPlay, setCanPlay] = useState(true);
  const [playsLeft, setPlaysLeft] = useState(MAX_DAILY_PLAYS);

  const [sessionLocations, setSessionLocations] = useState([]);
  const [sessionIndex, setSessionIndex] = useState(0);

  const [result, setResult] = useState(null);
  const [finished, setFinished] = useState(false);
  const [loadingReply, setLoadingReply] = useState(false);

  const [countdown, setCountdown] = useState(3);
  const [isBlurred, setIsBlurred] = useState(true);
  const [timeLeft, setTimeLeft] = useState(180);
  const [showConfetti, setShowConfetti] = useState(false);
  const [rankChangeMsg, setRankChangeMsg] = useState(null);
  const [timesUp, setTimesUp] = useState(false);

  const { user, setUser } = useContext(AuthContext);

  const messagesEndRef = useRef(null);
  const countdownRef = useRef(null);
  const timerRef = useRef(null);
  const { width, height } = useWindowSize();
  const [sending, setSending] = useState(false);

  const current = sessionLocations[sessionIndex] || null;

  const getStorageKey = () => `rankGameUsage_${user?.id ?? "guest"}`;

  const getTodayData = () => {
    const today = new Date().toDateString();
    const data = JSON.parse(localStorage.getItem(getStorageKey())) || {};
    if (data.date !== today) {
      const newData = { date: today, count: 0 };
      localStorage.setItem(getStorageKey(), JSON.stringify(newData));
      return newData;
    }
    return data;
  };

  const updateLimitState = () => {
    const data = getTodayData();
    const remaining = MAX_DAILY_PLAYS - data.count;
    setPlaysLeft(remaining);
    setCanPlay(remaining > 0);
    if (remaining <= 0) {
      clearInterval(countdownRef.current);
      setIsBlurred(true);
      setCountdown(0);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingReply]);

  useEffect(() => {
    updateLimitState();
    const loadInitial = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/locations/random?count=20`
        );
        const shuffled = res.data.sort(() => Math.random() - 0.5);
        setSessionLocations(shuffled);
        setSessionIndex(0);
        const data = getTodayData();
        const remaining = MAX_DAILY_PLAYS - data.count;
        if (remaining > 0) { setCanPlay(true); startNewRound(); }
        else { setCanPlay(false); }
      } catch (err) {
        console.error("Failed to load locations:", err);
      }
    };
    loadInitial();
    return () => { clearInterval(countdownRef.current); clearInterval(timerRef.current); };
  }, [user?.id]);

  const startNewRound = () => {
    const data = getTodayData();
    const remaining = MAX_DAILY_PLAYS - data.count;
    if (remaining <= 0) { setCanPlay(false); setIsBlurred(true); return; }

    data.count += 1;
    localStorage.setItem(getStorageKey(), JSON.stringify(data));
    const newRemaining = MAX_DAILY_PLAYS - data.count;
    setPlaysLeft(newRemaining);
    setCanPlay(newRemaining > 0);

    clearInterval(countdownRef.current);
    clearInterval(timerRef.current);
    setIsBlurred(true);
    setCountdown(3);
    setTimeLeft(120);
    setShowConfetti(false);

    let counter = 3;
    countdownRef.current = setInterval(() => {
      counter--;
      setCountdown(counter);
      if (counter <= 0) { clearInterval(countdownRef.current); setIsBlurred(false); }
    }, 1000);
  };

  useEffect(() => {
    // startNewRound is called explicitly in loadInitial and handleNextRound
  }, [sessionIndex, canPlay, sessionLocations]);

  useEffect(() => {
    clearInterval(timerRef.current);
    if (!isBlurred && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft((p) => p - 1), 1000);
      return () => clearInterval(timerRef.current);
    } else if (!isBlurred && timeLeft === 0 && current && !result) {
      setTimesUp(true);
      setTimeout(() => setTimesUp(false), 1800);
      handleSubmit();
    }
  }, [isBlurred, timeLeft, current, result]);

  const sendMessage = async () => {
    if (!current || !chatInput.trim() || chatCount >= 10 || sending) return;
    setSending(true);
    const userMsg = { role: "user", text: chatInput.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatCount((p) => p + 1);
    setLoadingReply(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/chat`,
        { message: userMsg.text, locationId: current.id },
        { withCredentials: true }
      );
      setMessages((prev) => [...prev, { role: "bot", text: res.data.reply || "No reply" }]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: "Failed to reach The Archivist." }]);
    } finally {
      setLoadingReply(false);
      setSending(false);
    }
  };

  const handleSubmit = async () => {
    if (!current) return;
    clearInterval(timerRef.current);
    try {
      const checkResp = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/heritage/check`,
        { answer: heritage, locationId: current.id },
        { withCredentials: true }
      );
      const { nameScore = 0, similarity = 0 } = checkResp.data || {};
      const diff = Math.abs(Number(ageGuess) - Number(current.years_old || 0));
      let ageScore = 0;
      if (diff <= 10) ageScore = 5;
      else if (diff <= 20) ageScore = 4;
      else if (diff <= 30) ageScore = 3;
      else if (diff <= 50) ageScore = 2;
      else if (diff <= 80) ageScore = 1;

      const total = nameScore + ageScore;
      const levelGain = total / 10;

      try {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/player/history`,
          { locationId: current.id, score: total, nameScore, ageScore, difficulty: current.difficulty || 1 },
          { withCredentials: true }
        );
      } catch {}

      if (user) {
        try {
          const endpoint = total >= 8 ? "win" : total <= 4 ? "lose" : null;
          if (endpoint) {
            const r = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/player/update-rank`,
              { levelGain, result: endpoint },
              { withCredentials: true }
            );
            const newData = r.data.newData || {};
            const newRank = Number(newData.rank ?? user.rank ?? 1);
            const newProgress = Number(newData.rank_progress ?? user.rank_progress ?? 0);
            const newLevel = Number(newData.level ?? (user.level || 0) + levelGain);

            if ((user.rank || 1) < newRank) setRankChangeMsg(`Rank Up → ${rankNames[newRank - 1]}`);
            else if ((user.rank || 1) > newRank) setRankChangeMsg(`Rank Down → ${rankNames[newRank - 1]}`);
            else setRankChangeMsg(null);

            setUser({ ...user, level: newLevel, rank: newRank, rank_progress: newProgress });
          } else {
            await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/player/update-level`,
              { levelGain },
              { withCredentials: true }
            );
            setUser({ ...user, level: (user.level || 0) + levelGain });
            setRankChangeMsg(null);
          }
        } catch {
          setUser({ ...user, level: (user.level || 0) + levelGain });
        }
      }

      setResult({ total, nameScore, ageScore, similarity, ageDiff: diff, correctName: current.name, correctAge: current.years_old });
      if (total === 10) { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 7000); }
    } catch (err) {
      console.error("Check answer failed:", err);
      // Always show result so the game doesn't freeze (e.g. empty answer rejected by server)
      const ageDiff = Math.abs(Number(ageGuess) - Number(current.years_old || 0));
      setResult({ total: 0, nameScore: 0, ageScore: 0, similarity: 0, ageDiff, correctName: current.name, correctAge: current.years_old });
    }
  };

  const handleNextRound = async () => {
    setResult(null);
    setHeritage("");
    setAgeGuess("");
    setMessages([]);
    setChatCount(0);
    setRankChangeMsg(null);
    setShowChat(false);

    const nextIndex = sessionIndex + 1;

    // Re-fetch a fresh random batch when the current one is exhausted
    if (nextIndex >= sessionLocations.length) {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/locations/random?count=20`
        );
        setSessionLocations(res.data.sort(() => Math.random() - 0.5));
        setSessionIndex(0);
      } catch (err) {
        console.error("Failed to reload locations:", err);
        setFinished(true);
        return;
      }
    } else {
      setSessionIndex(nextIndex);
    }

    startNewRound();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = String(timeLeft % 60).padStart(2, "0");
  const sessionProgress = sessionLocations.length > 0
    ? Math.round(((sessionIndex) / sessionLocations.length) * 100)
    : 0;

  const ptsEarned = result ? Math.round((result.total / 10) * 5000) : 0;
  const accuracyPct = result ? Math.round((result.total / 10) * 100) : 0;
  const fb = result ? getFeedback(result.total) : null;

  const currentRankName = rankNames[Math.max(0, (user?.rank || 1) - 1)];

  return (
    <LoadScriptNext googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div
        className="w-screen h-screen overflow-hidden relative"
        style={{ backgroundColor: "#0e1513", fontFamily: "'Be Vietnam Pro', sans-serif" }}
      >
        {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={400} />}

        {/* ── TOP NAV (Homepage-style) ── */}
        <nav
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4"
          style={{
            background: "rgba(14,21,19,0.82)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
          }}
        >
          {/* Left: Logo + Nav links */}
          <div className="flex items-center gap-3 sm:gap-6">
            <Link to="/" style={{ textDecoration: "none" }}>
              <span style={{ color: "#e9c349", fontSize: "16px", fontWeight: "700", letterSpacing: "-0.03em" }}>
                Heritage Guesser
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              {[
                { label: "Explore",      to: "/",            active: false },
                { label: "Leaderboard",  to: "/leaderboard", active: false },
                { label: "Study",        to: "/study",       active: false },
                { label: "Challenge",    to: "/game/rank",   active: true  },
              ].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  style={{ textDecoration: "none" }}
                  className={`text-[14px] pb-1 tracking-[-0.01em] transition-colors duration-150 border-b-2 ${
                    l.active
                      ? "text-[#e9c349] font-semibold border-[#e9c349]"
                      : "text-[#c0c8c3] font-normal border-transparent hover:text-[#a2d1bb]"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Center: Timer (absolute) */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-1.5 sm:py-2 rounded-full"
            style={{
              ...glassPanel,
              border: timesUp ? "1px solid rgba(187,3,8,0.6)" : timeLeft <= 30 ? "1px solid rgba(187,3,8,0.4)" : "1px solid rgba(233,195,73,0.2)",
              transition: "border-color 0.3s",
            }}
          >
            <span className="material-symbols-outlined" style={{ color: timesUp ? "#bb0308" : timeLeft <= 30 ? "#ffb4a9" : "#e9c349", fontSize: "15px" }}>
              {timesUp ? "timer_off" : "schedule"}
            </span>
            <span
              className="font-black tracking-widest"
              style={{
                color: timesUp ? "#bb0308" : timeLeft <= 30 ? "#ffb4a9" : "#e3e3de",
                fontSize: "16px",
                fontFamily: "'Be Vietnam Pro', sans-serif",
                minWidth: "44px",
                textAlign: "center",
              }}
            >
              {timesUp ? "00:00" : `${mins}:${secs}`}
            </span>
          </div>

          {/* Right: Plays left + Session + Account */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Plays left */}
            <div
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ ...glassPanel, border: "1px solid rgba(162,209,187,0.15)" }}
            >
              <span className="material-symbols-outlined" style={{ color: "#a2d1bb", fontSize: "14px" }}>play_circle</span>
              <span style={{ color: "rgba(192,200,195,0.8)", fontSize: "11px", fontWeight: "700" }}>
                {playsLeft} left
              </span>
            </div>
            {/* Session counter */}
            <div
              className="hidden xs:flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full"
              style={{ ...glassPanel, border: "1px solid rgba(233,195,73,0.15)" }}
            >
              <span className="material-symbols-outlined" style={{ color: "#e9c349", fontSize: "13px" }}>collections_bookmark</span>
              <span style={{ color: "rgba(192,200,195,0.8)", fontSize: "11px", fontWeight: "700" }}>
                {sessionIndex + 1}/{sessionLocations.length || 20}
              </span>
            </div>
            {/* Account */}
            <button
              className="bg-transparent border-none cursor-pointer p-1 sm:p-2 flex items-center rounded-full transition-colors duration-150 hover:bg-white/[0.06]"
              style={{ color: "#a2d1bb" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>account_circle</span>
            </button>
          </div>
        </nav>

        {/* ── STREET VIEW CANVAS (full screen behind everything) ── */}
        <div className="fixed inset-0 z-0">
          {canPlay && current && (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={{ lat: current.lat, lng: current.lng }}
              zoom={14}
              options={{ disableDefaultUI: true, gestureHandling: "none", keyboardShortcuts: false }}
            >
              <StreetViewPanorama
                key={sessionIndex}
                position={{ lat: current.lat, lng: current.lng }}
                visible
                options={{
                  disableDefaultUI: true,
                  clickToGo: true,
                  linksControl: true,
                  addressControl: false,
                  motionTracking: true,
                  motionTrackingControl: false,
                  enableCloseButton: false,
                }}
                onLoad={(pano) => {
                  pano.setPov({ heading: Math.floor(Math.random() * 360), pitch: 0 });
                  pano.setZoom(1);
                }}
              />
            </GoogleMap>
          )}
          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: "inset 0 0 150px rgba(0,0,0,0.75)" }}
          />
          {/* Top-to-bottom gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 25%, transparent 55%, rgba(0,0,0,0.6) 100%)" }}
          />
        </div>

        {/* ── DAILY LIMIT WALL ── */}
        {!canPlay && (
          <div
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center"
            style={{ backgroundColor: "rgba(14,21,19,0.97)" }}
          >
            <span className="material-symbols-outlined mb-4" style={{ color: "#bb0308", fontSize: "64px", fontVariationSettings: "'FILL' 1" }}>
              block
            </span>
            <h2 className="font-black mb-2" style={{ color: "#ffb4a9", fontSize: "28px" }}>Ranked Archive Sealed</h2>
            <p style={{ color: "rgba(192,200,195,0.6)", fontSize: "14px" }}>Daily ranked limit of {MAX_DAILY_PLAYS} sessions reached.</p>
            <Link
              to="/rank"
              className="mt-8 px-8 py-3 font-black uppercase tracking-widest"
              style={{ backgroundColor: "#bb0308", color: "#ffc8c0", borderRadius: "4px", fontSize: "11px", textDecoration: "none" }}
            >
              View My Rank
            </Link>
          </div>
        )}

        {/* ── COUNTDOWN OVERLAY ── */}
        {isBlurred && !finished && canPlay && (
          <div
            className="fixed inset-0 z-30 flex items-center justify-center"
            style={{ top: "64px", backgroundColor: "rgba(12,14,10,0.9)", backdropFilter: "blur(8px)" }}
          >
            <div className="text-center">
              {countdown > 0 && (
                <>
                  <span
                    className="font-black block"
                    style={{ fontSize: "120px", color: "#e9c349", lineHeight: 1, textShadow: "0 0 60px rgba(233,195,73,0.5)" }}
                  >
                    {countdown}
                  </span>
                  <p className="uppercase tracking-widest mt-4" style={{ color: "rgba(162,209,187,0.6)", fontSize: "12px" }}>
                    Prepare the Ranked Archive
                  </p>
                  <div className="mt-6 w-64 mx-auto">
                    <div className="flex justify-between mb-1">
                      <span style={{ color: "rgba(192,200,195,0.4)", fontSize: "10px" }}>Session Progress</span>
                      <span style={{ color: "#a2d1bb", fontSize: "10px", fontWeight: "700" }}>{sessionIndex} / {sessionLocations.length || 20}</span>
                    </div>
                    <div className="w-full h-1 rounded-full overflow-hidden" style={{ backgroundColor: "#292b24" }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${sessionProgress}%`, backgroundColor: "#a2d1bb", transition: "width 0.5s ease" }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── FINISHED OVERLAY ── */}
        {finished && (
          <div
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center"
            style={{ top: "64px", backgroundColor: "rgba(12,14,10,0.97)" }}
          >
            <span className="material-symbols-outlined mb-4" style={{ color: "#e9c349", fontSize: "64px", fontVariationSettings: "'FILL' 1" }}>
              workspace_premium
            </span>
            <h2 className="font-black mb-2" style={{ color: "#e3e3d9", fontSize: "36px" }}>Ranked Session Complete</h2>
            <p style={{ color: "rgba(192,200,195,0.6)", fontSize: "14px" }}>All heritage sites have been catalogued.</p>
            <div className="flex gap-4 mt-8">
              <Link to="/rank" className="px-8 py-3 font-black uppercase tracking-widest"
                style={{ backgroundColor: "#bb0308", color: "#ffc8c0", borderRadius: "4px", fontSize: "11px", textDecoration: "none" }}>
                View Rank
              </Link>
              <Link to="/" className="px-8 py-3 font-black uppercase tracking-widest"
                style={{ backgroundColor: "#1e201a", color: "#a2d1bb", border: "1px solid rgba(162,209,187,0.2)", borderRadius: "4px", fontSize: "11px", textDecoration: "none" }}>
                Sanctuary
              </Link>
            </div>
          </div>
        )}

        {/* ── TIME'S UP FLASH ── */}
        {timesUp && (
          <div
            className="fixed inset-0 z-30 flex flex-col items-center justify-center pointer-events-none"
            style={{ top: "64px", backgroundColor: "rgba(187,3,8,0.12)", backdropFilter: "blur(4px)" }}
          >
            <span
              className="font-black uppercase tracking-widest"
              style={{ color: "#bb0308", fontSize: "56px", textShadow: "0 0 40px rgba(187,3,8,0.7)", animation: "pulse 0.5s ease-in-out infinite alternate" }}
            >
              TIME'S UP
            </span>
            <p className="uppercase tracking-widest mt-3" style={{ color: "rgba(255,180,169,0.8)", fontSize: "13px" }}>
              Submitting your answer…
            </p>
          </div>
        )}

        {/* ── CHAMBER INFO (top-left, during play) ── */}
        {!isBlurred && !result && !finished && canPlay && (
          <div
            className="fixed z-30 p-3 sm:p-5 rounded-xl"
            style={{
              top: "64px",
              left: "12px",
              ...glassPanel,
              borderLeft: "3px solid #bb0308",
              minWidth: "140px",
              maxWidth: "calc(50vw - 16px)",
            }}
          >
            <p className="uppercase tracking-widest font-black mb-1" style={{ color: "#bb0308", fontSize: "9px" }}>
              Ranked · Chamber {sessionIndex + 1}
            </p>
            <h2 className="font-black" style={{ color: "#ffffff", fontSize: "15px" }}>
              {current?.region || "Unknown"} Heritage
            </h2>
            <div className="flex gap-1 mt-2 flex-wrap">
              {Array(Math.min(10, sessionLocations.length)).fill(0).map((_, i) => {
                const dotIndex = sessionIndex % 10;
                return (
                  <div
                    key={i}
                    className="h-1 w-4 sm:w-5 rounded-full"
                    style={{ backgroundColor: i < dotIndex ? "#bb0308" : i === dotIndex ? "#a2d1bb" : "rgba(162,209,187,0.15)" }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* ── RANK PROGRESS (bottom-left, during play) — hidden on small phones ── */}
        {!isBlurred && !result && !finished && user && canPlay && (
          <div
            className="hidden sm:flex fixed z-30 flex-col items-center gap-3 py-5 px-4 rounded-2xl"
            style={{ bottom: "140px", left: "16px", ...glassPanel, minWidth: "72px" }}
          >
            {/* Rank icon */}
            <div
              className="flex items-center justify-center rounded-xl"
              style={{ width: "44px", height: "44px", backgroundColor: "rgba(233,195,73,0.12)", border: "1px solid rgba(233,195,73,0.2)" }}
            >
              <span
                className="material-symbols-outlined"
                style={{ color: "#e9c349", fontSize: "24px", fontVariationSettings: "'FILL' 1" }}
              >
                military_tech
              </span>
            </div>

            {/* Rank name */}
            <p className="font-black uppercase tracking-wider text-center" style={{ color: "#a2d1bb", fontSize: "10px" }}>
              {rankNames[Math.max(0, (user.rank || 1) - 1)]}
            </p>

            {/* Stars — vertical stack */}
            <div className="flex flex-col gap-1.5 items-center">
              {Array(5).fill(0).map((_, i) => (
                <span
                  key={i}
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "20px",
                    color: i < (user.rank_progress || 0) ? "#e9c349" : "rgba(65,73,68,0.4)",
                    fontVariationSettings: i < (user.rank_progress || 0) ? "'FILL' 1" : "'FILL' 0",
                    transition: "color 0.3s",
                  }}
                >
                  star
                </span>
              ))}
            </div>

            {/* Progress label */}
            <p className="uppercase tracking-widest font-black text-center" style={{ color: "rgba(192,200,195,0.4)", fontSize: "9px" }}>
              {user.rank_progress || 0}/5
            </p>
          </div>
        )}

        {/* ── BOTTOM SECTION ── */}
        {!isBlurred && !finished && canPlay && (
          <section
            className="fixed bottom-0 z-40 p-6 flex flex-col items-center gap-4"
            style={{ left: 0, right: 0 }}
          >
            {/* RESULT / ANALYSIS COMPLETE CARD */}
            {result && (
              <div
                className="w-full rounded-2xl p-6"
                style={{
                  maxWidth: "672px",
                  ...glassPanel,
                  border: `1px solid ${fb.color}25`,
                  boxShadow: `0 0 48px ${fb.color}15`,
                }}
              >
                {/* Rank change banner */}
                {rankChangeMsg && (
                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded-lg mb-4"
                    style={{
                      backgroundColor: rankChangeMsg.includes("Up") ? "rgba(162,209,187,0.1)" : "rgba(187,3,8,0.1)",
                      border: `1px solid ${rankChangeMsg.includes("Up") ? "rgba(162,209,187,0.3)" : "rgba(187,3,8,0.3)"}`,
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ color: rankChangeMsg.includes("Up") ? "#a2d1bb" : "#ffb4a9", fontSize: "16px" }}>
                      {rankChangeMsg.includes("Up") ? "arrow_upward" : "arrow_downward"}
                    </span>
                    <span className="font-black uppercase tracking-wider" style={{ color: rankChangeMsg.includes("Up") ? "#a2d1bb" : "#ffb4a9", fontSize: "11px" }}>
                      {rankChangeMsg}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h3 className="font-black" style={{ color: "#a2d1bb", fontSize: "20px", fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                      {fb.label}
                    </h3>
                    <p style={{ color: "rgba(192,200,195,0.7)", fontSize: "13px", marginTop: "2px" }}>
                      {result.correctName}
                      {result.correctAge ? ` · ${result.correctAge} yrs old` : ""}
                    </p>
                    {current?.description && (
                      <p style={{ color: "rgba(192,200,195,0.45)", fontSize: "11px", marginTop: "4px", lineHeight: "1.4", maxWidth: "360px" }}>
                        {current.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right ml-6 flex-shrink-0">
                    <span className="font-black" style={{ color: "#e9c349", fontSize: "40px", fontFamily: "'Be Vietnam Pro', sans-serif", lineHeight: 1 }}>
                      {ptsEarned.toLocaleString()}
                    </span>
                    <span className="block uppercase tracking-widest" style={{ color: "rgba(192,200,195,0.6)", fontSize: "10px", marginTop: "2px" }}>
                      PTS EARNED
                    </span>
                    {/* Score breakdown */}
                    <div className="flex gap-3 mt-2 justify-end">
                      <span style={{ color: "#a2d1bb", fontSize: "11px", fontWeight: "700" }}>
                        Name {result.nameScore}/5
                      </span>
                      <span style={{ color: "#e9c349", fontSize: "11px", fontWeight: "700" }}>
                        Age {result.ageScore}/5
                      </span>
                    </div>
                  </div>
                </div>

                {/* Accuracy Bar */}
                <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: "rgba(42,50,47,0.8)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${accuracyPct}%`,
                      background: "linear-gradient(90deg, #a2d1bb 0%, #e9c349 100%)",
                      boxShadow: "0 0 12px rgba(162,209,187,0.4)",
                      transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
                    }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="uppercase tracking-widest" style={{ color: "rgba(162,209,187,0.5)", fontSize: "10px" }}>
                    Similarity: {Math.round(result.similarity * 100)}%
                  </span>
                  <span className="uppercase tracking-widest" style={{ color: "rgba(162,209,187,0.5)", fontSize: "10px" }}>
                    Timeline: ±{result.ageDiff} Years
                  </span>
                </div>

                {/* Continue button */}
                <button
                  onClick={handleNextRound}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-black uppercase tracking-widest transition-all active:scale-[0.98]"
                  style={{
                    backgroundColor: "rgba(162,209,187,0.1)",
                    border: "1px solid rgba(162,209,187,0.2)",
                    color: "#a2d1bb",
                    fontSize: "11px",
                    cursor: "pointer",
                  }}
                >
                  Continue
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_forward</span>
                </button>
              </div>
            )}

            {/* INPUT ROW */}
            {!result && (
              <div className="rankplay-input-row w-full flex items-end gap-3" style={{ maxWidth: "800px" }}>
                {/* Main input panel */}
                <div
                  className="rankplay-input-panel flex-1 rounded-2xl p-2 group"
                  style={{
                    ...glassPanel,
                    border: "1px solid rgba(162,209,187,0.12)",
                    transition: "border-color 0.2s",
                  }}
                >
                  <div className="flex items-center flex-wrap sm:flex-nowrap">
                    {/* Heritage identity */}
                    <div className="flex-1 px-3 sm:px-4 py-1 min-w-0 w-full sm:w-auto">
                      <label className="block uppercase tracking-wider" style={{ color: "rgba(162,209,187,0.5)", fontSize: "10px", marginBottom: "4px" }}>
                        Enter Heritage Identity
                      </label>
                      <input
                        value={heritage}
                        onChange={(e) => setHeritage(e.target.value)}
                        placeholder="Location, Dynasty, or Era..."
                        className="w-full outline-none"
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#e3e3de",
                          fontSize: "15px",
                          fontWeight: "500",
                          fontFamily: "'Be Vietnam Pro', sans-serif",
                        }}
                      />
                    </div>
                    {/* Divider */}
                    <div className="rankplay-input-divider hidden sm:block" style={{ width: "1px", height: "40px", backgroundColor: "rgba(65,73,68,0.4)", margin: "0 8px" }} />
                    {/* Year input */}
                    <div className="rankplay-year-input px-3 sm:px-4 py-1" style={{ width: "110px" }}>
                      <label className="block uppercase tracking-wider" style={{ color: "rgba(162,209,187,0.5)", fontSize: "10px", marginBottom: "4px" }}>
                        Year (Est.)
                      </label>
                      <input
                        type="number"
                        inputMode="numeric"
                        value={ageGuess}
                        onChange={(e) => setAgeGuess(e.target.value.replace(/[^0-9]/g, ""))}
                        onKeyDown={(e) => ["e","E","+","-","."].includes(e.key) && e.preventDefault()}
                        placeholder="e.g. 1802"
                        className="w-full outline-none"
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#e3e3de",
                          fontSize: "15px",
                          fontWeight: "500",
                          fontFamily: "'Be Vietnam Pro', sans-serif",
                        }}
                      />
                    </div>
                    {/* GUESS button */}
                    <button
                      onClick={handleSubmit}
                      disabled={timeLeft === 0 || timesUp}
                      className="rankplay-guess-btn flex items-center gap-2 px-4 sm:px-8 py-3 sm:py-4 rounded-xl font-black uppercase tracking-widest transition-all active:scale-95"
                      style={{
                        background: timeLeft === 0 || timesUp ? "rgba(42,50,47,0.8)" : "linear-gradient(135deg, #0f3d2e 0%, #a2d1bb 100%)",
                        color: timeLeft === 0 || timesUp ? "rgba(192,200,195,0.3)" : "#073829",
                        border: "none",
                        cursor: timeLeft === 0 || timesUp ? "not-allowed" : "pointer",
                        fontSize: "12px",
                        fontFamily: "'Be Vietnam Pro', sans-serif",
                      }}
                    >
                      GUESS
                      <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>send</span>
                    </button>
                  </div>
                </div>

                {/* Hint / Archivist Toggle */}
                <button
                  onClick={() => setShowChat((p) => !p)}
                  className="rankplay-hint-btn flex items-center justify-center rounded-2xl transition-all shrink-0"
                  style={{
                    width: "56px",
                    height: "56px",
                    ...glassPanel,
                    border: showChat ? "1px solid rgba(233,195,73,0.4)" : "1px solid rgba(162,209,187,0.12)",
                    cursor: "pointer",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "#e9c349", fontSize: "24px", transition: "transform 0.2s" }}
                  >
                    lightbulb
                  </span>
                </button>
              </div>
            )}
          </section>
        )}

        {/* ── AI SIDE PANEL TOGGLE TRIGGER (floating, when panel is closed) ── */}
        {!isBlurred && !finished && canPlay && !result && (
          <button
            onClick={() => setShowChat((p) => !p)}
            className="fixed z-50 flex items-center justify-center rounded-2xl transition-all"
            style={{
              top: "160px",
              right: "24px",
              width: "56px",
              height: "56px",
              ...glassPanel,
              border: "1px solid rgba(162,209,187,0.3)",
              cursor: "pointer",
              opacity: showChat ? 0 : 1,
              pointerEvents: showChat ? "none" : "auto",
              transform: showChat ? "scale(0.8)" : "scale(1)",
              transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
            }}
          >
            <span className="material-symbols-outlined" style={{ color: "#a2d1bb", fontSize: "22px" }}>
              auto_awesome
            </span>
          </button>
        )}

        {/* ── AI SIDE PANEL ── */}
        <aside
          className="rankplay-side-panel fixed z-50 flex flex-col gap-4"
          style={{
            top: "60px",
            right: "16px",
            bottom: "150px",
            width: "min(320px, calc(100vw - 32px))",
            transform: showChat ? "translateX(0)" : "translateX(calc(100% + 24px))",
            transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Main chat panel */}
          <div
            className="rounded-3xl p-6 flex-1 flex flex-col relative"
            style={{
              ...glassPanel,
              border: "1px solid rgba(162,209,187,0.1)",
              boxShadow: "0px 24px 48px rgba(0,0,0,0.4)",
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setShowChat(false)}
              className="absolute top-4 right-4 transition-colors"
              style={{ color: "rgba(192,200,195,0.5)", background: "none", border: "none", cursor: "pointer" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>close_fullscreen</span>
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center relative"
                style={{ backgroundColor: "#1a211f" }}
              >
                <span style={{ fontSize: "20px", lineHeight: 1 }}>🐢</span>
                <div className="absolute inset-0 rounded-full" style={{ background: "rgba(162,209,187,0.2)", filter: "blur(12px)" }} />
              </div>
              <div>
                <h2 className="font-black" style={{ color: "#e3e3de", fontSize: "14px", fontFamily: "'Be Vietnam Pro', sans-serif" }}>Toto</h2>
                <p className="font-black uppercase tracking-tighter" style={{ color: "#a2d1bb", fontSize: "10px" }}>
                  Your Heritage Buddy · {chatCount}/10
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1" style={{ scrollbarWidth: "none" }}>
              {messages.length === 0 && (
                <div
                  className="p-4 rounded-2xl"
                  style={{ backgroundColor: "rgba(26,33,31,0.8)", borderLeft: "2px solid rgba(162,209,187,0.4)" }}
                >
                  <p style={{ color: "rgba(192,200,195,0.8)", fontSize: "13px", lineHeight: "1.6" }}>
                    Hey there! I'm <span style={{ color: "#a2d1bb", fontWeight: "700" }}>Toto</span> 🐢 — slow and steady, but full of secrets! Ask me anything and I'll drop some clues about this place's <span style={{ color: "#a2d1bb", fontWeight: "700" }}>history, architecture, and dynasty.</span>
                  </p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  <div
                    className="px-4 py-3 rounded-2xl"
                    style={{
                      maxWidth: "85%",
                      backgroundColor: msg.role === "user" ? "rgba(36,44,41,0.9)" : "rgba(26,33,31,0.8)",
                      borderLeft: msg.role === "bot" ? "2px solid rgba(162,209,187,0.4)" : "none",
                      borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      color: msg.role === "user" ? "#e3e3de" : "rgba(192,200,195,0.9)",
                      fontSize: "13px",
                      lineHeight: "1.5",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loadingReply && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div
                    className="px-4 py-3 rounded-2xl"
                    style={{ backgroundColor: "rgba(26,33,31,0.8)", borderLeft: "2px solid rgba(162,209,187,0.4)", borderRadius: "16px 16px 16px 4px" }}
                  >
                    <div className="flex gap-1 items-center">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: "#a2d1bb", animation: `pulse 1s infinite ${i * 0.2}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="mt-5 relative">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={chatCount >= 10 || sending}
                placeholder={chatCount >= 10 ? "Chat limit reached" : "Ask about this era..."}
                className="w-full rounded-xl py-3 pl-4 pr-10 outline-none"
                style={{
                  backgroundColor: "rgba(9,16,14,0.8)",
                  border: "1px solid rgba(65,73,68,0.3)",
                  color: "#e3e3de",
                  fontSize: "13px",
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  transition: "border-color 0.2s",
                }}
              />
              <button
                onClick={sendMessage}
                disabled={chatCount >= 10 || sending}
                className="absolute right-2 top-1/2 -translate-y-1/2"
                style={{ color: "#a2d1bb", background: "none", border: "none", cursor: chatCount >= 10 ? "not-allowed" : "pointer" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>auto_fix</span>
              </button>
            </div>
          </div>

          {/* Global rank micro-card */}
          <div
            className="rounded-2xl p-4 flex items-center justify-between"
            style={{
              ...glassPanel,
              border: "1px solid rgba(233,195,73,0.1)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ border: "1px solid rgba(233,195,73,0.3)", backgroundColor: "#1a211f" }}
              >
                <span className="material-symbols-outlined" style={{ color: "#a2d1bb", fontSize: "16px" }}>person</span>
              </div>
              <span className="font-black uppercase tracking-widest" style={{ color: "rgba(192,200,195,0.7)", fontSize: "11px" }}>
                {user ? currentRankName : "Scholar"}
              </span>
            </div>
            <div className="flex items-center gap-1" style={{ color: "#e9c349" }}>
              <span className="font-black" style={{ fontSize: "14px" }}>
                {user ? `${user.rank_progress || 0}/5` : "0/5"}
              </span>
              <span className="material-symbols-outlined" style={{ fontSize: "14px", fontVariationSettings: "'FILL' 1" }}>hotel_class</span>
            </div>
          </div>
        </aside>

        {/* Floating particles */}
        <div className="fixed inset-0 pointer-events-none z-10">
          <div className="absolute" style={{ top: "25%", left: "33%", width: "4px", height: "4px", backgroundColor: "rgba(233,195,73,0.3)", borderRadius: "50%", filter: "blur(2px)" }} />
          <div className="absolute" style={{ bottom: "33%", right: "25%", width: "8px", height: "8px", backgroundColor: "rgba(162,209,187,0.15)", borderRadius: "50%", filter: "blur(4px)" }} />
          <div className="absolute" style={{ top: "50%", left: "25%", width: "4px", height: "4px", backgroundColor: "rgba(198,199,194,0.2)", borderRadius: "50%", filter: "blur(2px)" }} />
        </div>
      </div>
    </LoadScriptNext>
  );
}
