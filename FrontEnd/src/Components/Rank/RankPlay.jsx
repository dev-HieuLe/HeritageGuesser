import { useState, useEffect, useRef, useContext } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { AuthContext } from "../../Context/authContext";
import { Link, useNavigate } from "react-router-dom";
import AvatarCanvas from "../Avatar/AvatarCanvas";
import { useGeminiTTS } from "../../hooks/useGeminiTTS";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useLang } from "../../Context/languageContext";
import t from "../../translations";

const rankNames = [
  "Iron",
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Emerald",
  "Diamond",
  "Master",
  "Grandmaster",
  "Challenger",
];

const getFeedback = (score, feedbacks) => {
  if (score === 10) return { label: feedbacks.perfect, color: "#e9c349", icon: "workspace_premium" };
  if (score >= 8) return { label: feedbacks.exceptional, color: "#a2d1bb", icon: "military_tech" };
  if (score >= 6) return { label: feedbacks.onTrack, color: "#e9c349", icon: "trending_up" };
  if (score >= 4) return { label: feedbacks.partial, color: "#ffb4a9", icon: "history_edu" };
  return { label: feedbacks.lost, color: "#bb0308", icon: "cancel" };
};

const glassPanel = {
  background: "rgba(14, 21, 19, 0.65)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(162, 209, 187, 0.1)",
};

/** Read-only 5-star display. Empty stars are clearly outlined. */
function StarDisplay({ stars = 0, size = 16 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => {
        const filled = stars >= s;
        const half   = !filled && stars >= s - 0.5;
        return (
          <span
            key={s}
            className="material-symbols-outlined"
            style={{
              fontSize: size,
              color: filled || half ? "#e9c349" : "rgba(162,209,187,0.2)",
              fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0",
              lineHeight: 1,
            }}
          >
            {half ? "star_half" : "star"}
          </span>
        );
      })}
    </div>
  );
}

export default function RankPlay() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [heritage, setHeritage] = useState("");
  const [ageGuess, setAgeGuess] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatCount, setChatCount] = useState(0);

  const [canPlay, setCanPlay] = useState(true);
  const [playsLeft, setPlaysLeft] = useState(15);
  const [todayDbCount, setTodayDbCount] = useState(0);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const [sessionLocations, setSessionLocations] = useState([]);
  const [sessionIndex, setSessionIndex] = useState(0);

  const [result, setResult] = useState(null);
  const [finished, setFinished] = useState(false);
  const [loadingReply, setLoadingReply] = useState(false);
  const [locationRating, setLocationRating] = useState({ stars: 0, total_ratings: 0, my_rating: null });
  const [ratingSubmitting, setRatingSubmitting] = useState(false);

  const [countdown, setCountdown] = useState(3);
  const [isBlurred, setIsBlurred] = useState(true);
  const [timeLeft, setTimeLeft] = useState(180);
  const [svError, setSvError] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [rankChangeMsg, setRankChangeMsg] = useState(null);
  const [timesUp, setTimesUp] = useState(false);
  const [isRatingName, setIsRatingName] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const hintShownRef = useRef(false);

  const {
    user,
    setUser,
    authCheckedOnce,
    showPointsToast,
    claimDailyCheckin,
    addPoints,
  } = useContext(AuthContext);

  const { lang } = useLang();
  const txRP = t[lang].rankPlay;

  const MAX_DAILY_PLAYS = user?.max_play ?? 15;
  const isUnlimited = user?.max_play === -1;
  const navigate = useNavigate();

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (authCheckedOnce && !user) {
      navigate("/login", { replace: true });
    }
  }, [authCheckedOnce, user, navigate]);

  const messagesEndRef = useRef(null);
  const countdownRef = useRef(null);
  const timerRef = useRef(null);
  const svContainerRef = useRef(null);
  const svPanoramaRef = useRef(null);
  const svLoadRecordedRef = useRef(false); // ensure sv-load is called exactly once per mount
  const svPositionPendingRef = useRef(null); // debounce rapid setPosition calls
  const { width, height } = useWindowSize();

  const [sending, setSending] = useState(false);

  // ── Avatar TTS ─────────────────────────────────────────────────────────────
  const { speak, stop: stopSpeech, isSpeaking } = useGeminiTTS();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const isMobile = window.innerWidth < 768;
  const [lastBotText, setLastBotText] = useState("");
  const [isWaitingToSpeak, setIsWaitingToSpeak] = useState(false);

  // Clear waiting state the moment audio actually starts
  useEffect(() => {
    if (isSpeaking) setIsWaitingToSpeak(false);
  }, [isSpeaking]);

  const current = sessionLocations[sessionIndex] || null;

  // Initialize Street View panorama once — only after Maps API is loaded
  useEffect(() => {
    if (!isLoaded || !svContainerRef.current || svPanoramaRef.current) return;
    const pano = new window.google.maps.StreetViewPanorama(svContainerRef.current, {
      disableDefaultUI: true,
      clickToGo: false,
      linksControl: false,
      addressControl: false,
      motionTracking: false,
      motionTrackingControl: false,
      enableCloseButton: false,
      scrollwheel: true,
    });
    pano.addListener("status_changed", () => {
      if (pano.getStatus() === window.google.maps.StreetViewStatus.ZERO_RESULTS) {
        setSvError(true);
      }
    });
    pano.addListener("tiles_loaded", () => {
      setSvError(false);
    });
    svPanoramaRef.current = pano;
  }, [isLoaded]);

  // Update position each round — debounced to avoid concurrent tile requests
  useEffect(() => {
    if (!svPanoramaRef.current || !current) return;
    setSvError(false);
    clearTimeout(svPositionPendingRef.current);
    svPositionPendingRef.current = setTimeout(() => {
      if (!svPanoramaRef.current) return;
      svPanoramaRef.current.setPosition({ lat: current.lat, lng: current.lng });
      svPanoramaRef.current.setPov({ heading: Math.floor(Math.random() * 360), pitch: 0 });
      svPanoramaRef.current.setZoom(1);
    }, 80);
  }, [current]);

  const applyLimitFromCount = (count) => {
    const limit = user?.max_play ?? 15;
    if (limit === -1) {
      setPlaysLeft(Infinity);
      setCanPlay(true);
      return;
    }
    const remaining = limit - count;
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
    if (!isMobile && !executeRecaptcha) return;
    if (!user) return;

    const loadInitial = async () => {
      // Guard: only record once per component lifetime (prevents Strict Mode double-fire)
      if (!svLoadRecordedRef.current) {
        svLoadRecordedRef.current = true;
        try {
          const svRes = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/status/sv-load`,
            {},
            { withCredentials: true }
          );
          if (svRes.data?.maintenanceMode) {
            setMaintenanceMode(true);
            return;
          }
        } catch (err) {
          if (err.response?.status === 403) {
            setMaintenanceMode(true);
            return;
          }
          // Network/server error — don't block the game
        }
      }

      try {
        const [locRes, countRes] = await Promise.all([
          (async () => {
            const token = isMobile ? null : await executeRecaptcha("load_game");
            const query = isMobile ? "count=15&type=mobile" : `count=15&recaptchaToken=${token}`;
            return axios.get(`${import.meta.env.VITE_API_BASE_URL}/locations/random?${query}`);
          })(),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/player/history/today-count`, { withCredentials: true }),
        ]);

        const shuffled = locRes.data.sort(() => Math.random() - 0.5);
        setSessionLocations(shuffled);
        setSessionIndex(0);

        const dbCount = countRes.data.count || 0;
        setTodayDbCount(dbCount);

        if (isUnlimited) {
          setCanPlay(true);
          startNewRound(0);
          return;
        }
        applyLimitFromCount(dbCount);
        if (dbCount < (user?.max_play ?? 15)) {
          startNewRound(dbCount);
        }
      } catch (err) {
        console.error("Failed to load locations:", err);
      }
    };
    loadInitial();
    return () => {
      clearInterval(countdownRef.current);
      clearInterval(timerRef.current);
    };
  }, [user?.id, executeRecaptcha]);

  const startNewRound = (overrideCount) => {
    const limit = user?.max_play ?? 15;
    if (limit !== -1) {
      // Use overrideCount (passed from loadInitial where we have the fresh DB value)
      // or fall back to the current state value for subsequent rounds
      const currentCount = overrideCount ?? todayDbCount;
      if (currentCount >= limit) {
        setCanPlay(false);
        setIsBlurred(true);
        return;
      }
      setTodayDbCount(currentCount + 1);
      const remaining = limit - (currentCount + 1);
      setPlaysLeft(remaining);
      setCanPlay(remaining > 0);
    }

    clearInterval(countdownRef.current);
    clearInterval(timerRef.current);
    stopSpeech(); // silence avatar between rounds
    setIsBlurred(true);
    setCountdown(3);
    setTimeLeft(120);
    setShowConfetti(false);

    let counter = 3;
    countdownRef.current = setInterval(() => {
      counter--;
      setCountdown(counter);
      if (counter <= 0) {
        clearInterval(countdownRef.current);
        setIsBlurred(false);
        // First-round-of-session hint: dismisses on its own after a few seconds
        if (!hintShownRef.current) {
          hintShownRef.current = true;
          setShowHint(true);
          setTimeout(() => setShowHint(false), 9000);
        }
      }
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

  const sendAvatarMessage = async (text) => {
    if (!current || !text.trim() || chatCount >= 10 || sending) return;
    setSending(true);
    setIsWaitingToSpeak(true);
    const userMsg = { role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setChatCount((p) => p + 1);
    setLoadingReply(true);
    try {
      const recaptchaToken = isMobile ? undefined : executeRecaptcha ? await executeRecaptcha("chat") : null;
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/chat`,
        { message: text.trim(), locationId: current.id, ...(isMobile ? { type: "mobile" } : { recaptchaToken }) },
        { withCredentials: true },
      );
      const reply = res.data.reply || "No reply";
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
      setLastBotText(reply);
      speak(reply);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Failed to reach The Archivist." },
      ]);
      setIsWaitingToSpeak(false);
    } finally {
      setLoadingReply(false);
      setSending(false);
    }
  };

  const handleSubmit = async () => {
    if (!current) return;
    clearInterval(timerRef.current);
    setIsRatingName(true);
    try {
      const token = isMobile ? null : executeRecaptcha ? await executeRecaptcha("guess") : null;
      const checkResp = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/heritage/check`,
        { answer: heritage, locationId: current.id, ...(isMobile ? { type: "mobile" } : { recaptchaToken: token }) },
        { withCredentials: true },
      );
      const { nameScore = 0, similarity = 0 } = checkResp.data || {};

      const diff = Math.abs(Number(ageGuess) - Number(current.years_old || 0));
      let ageScore = 0;
      if (diff <= 50) ageScore = 5;
      else if (diff <= 100) ageScore = 4;
      else if (diff <= 200) ageScore = 3;
      else if (diff <= 250) ageScore = 2;
      else if (diff <= 500) ageScore = 1;
      else ageScore = 0;

      const total = nameScore + ageScore;
      const levelGain = total / 10;

      try {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/player/history`,
          {
            locationId: current.id,
            score: total,
            nameScore,
            ageScore,
            difficulty: current.difficulty || 1,
          },
          { withCredentials: true },
        );
      } catch {}

      if (user) {
        // Optimistic: always show +5 toast and update points immediately
        showPointsToast(5, "Game Complete");
        setUser((u) => (u ? { ...u, points: (u.points || 0) + 5 } : u));
        if (claimDailyCheckin()) addPoints(10, "Daily Check-in");

        try {
          const endpoint = total >= 7 ? "win" : total < 3 ? "lose" : null;
          if (endpoint) {
            const r = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/player/update-rank`,
              { levelGain, result: endpoint },
              { withCredentials: true },
            );
            const newData = r.data.newData || {};
            const newRank = Number(newData.rank ?? user.rank ?? 1);
            const newProgress = Number(
              newData.rank_progress ?? user.rank_progress ?? 0,
            );
            const newLevel = Number(
              newData.level ?? (user.level || 0) + levelGain,
            );

            if ((user.rank || 1) < newRank)
              setRankChangeMsg({ type: "up", rankName: rankNames[newRank - 1] });
            else if ((user.rank || 1) > newRank)
              setRankChangeMsg({ type: "down", rankName: rankNames[newRank - 1] });
            else setRankChangeMsg(null);

            // Confirm rank/level from server; points already handled optimistically
            setUser((u) =>
              u
                ? {
                    ...u,
                    level: newLevel,
                    rank: newRank,
                    rank_progress: newProgress,
                  }
                : u,
            );
            if (newData.points > 0)
              setUser((u) => (u ? { ...u, points: newData.points } : u));
          } else {
            const lvlRes = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/player/update-level`,
              { levelGain },
              { withCredentials: true },
            );
            setUser((u) =>
              u ? { ...u, level: (u.level || 0) + levelGain } : u,
            );
            if (lvlRes.data.points > 0)
              setUser((u) => (u ? { ...u, points: lvlRes.data.points } : u));
            setRankChangeMsg(null);
          }
        } catch {
          // Rank/level update failed — points were already updated optimistically
          setUser((u) => (u ? { ...u, level: (u.level || 0) + levelGain } : u));
        }
      }

      setResult({
        total,
        nameScore,
        ageScore,
        similarity,
        ageDiff: diff,
        correctName: current.name,
        correctAge: current.years_old,
      });

      // Seed rating display from the data already on the location object
      setLocationRating({
        stars: current.stars ?? 0,
        total_ratings: current.total_ratings ?? 0,
        my_rating: current.my_rating ?? null,
      });
      if (total === 10) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 7000);
      }
    } catch (err) {
      console.error("Check answer failed:", err);
      // Always show result so the game doesn't freeze (e.g. empty answer rejected by server)
      const ageDiff = Math.abs(
        Number(ageGuess) - Number(current.years_old || 0),
      );
      setResult({
        total: 0,
        nameScore: 0,
        ageScore: 0,
        similarity: 0,
        ageDiff,
        correctName: current.name,
        correctAge: current.years_old,
      });
    } finally {
      setIsRatingName(false);
    }
  };

  const handleNextRound = async () => {
    setResult(null);
    setHeritage("");
    setAgeGuess("");
    setMessages([]);
    setChatCount(0);
    setRankChangeMsg(null);
    setLocationRating({ stars: 0, total_ratings: 0, my_rating: null });

    const nextIndex = sessionIndex + 1;

    // Re-fetch a fresh random batch when the current one is exhausted
    if (nextIndex >= sessionLocations.length) {
      try {
        const token = isMobile ? null : executeRecaptcha ? await executeRecaptcha("next_round") : null;
        const query = isMobile ? "count=15&type=mobile" : `count=15&recaptchaToken=${token}`;
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/locations/random?${query}`,
        );
        const fresh = res.data.sort(() => Math.random() - 0.5);
        setSessionLocations(fresh);
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

  const mins = Math.floor(timeLeft / 60);
  const secs = String(timeLeft % 60).padStart(2, "0");
  const sessionProgress =
    sessionLocations.length > 0
      ? Math.round((sessionIndex / sessionLocations.length) * 100)
      : 0;

  const ptsEarned = result ? Math.round((result.total / 10) * 5000) : 0;
  const accuracyPct = result ? Math.round((result.total / 10) * 100) : 0;
  const fb = result ? getFeedback(result.total, txRP.feedbacks) : null;

  return (
      <div
        className="w-screen h-screen overflow-hidden relative"
        style={{
          backgroundColor: "#0e1513",
          fontFamily: "'Be Vietnam Pro', sans-serif",
        }}
      >
        {showConfetti && (
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={400}
          />
        )}

        {/* ── VRM Avatar overlay — bottom-right, speaks bot replies ── */}
        {!isBlurred && !result && canPlay && (
          <AvatarCanvas
            isSpeaking={isSpeaking}
            spokenText={lastBotText}
            messages={messages}
            loadingReply={loadingReply}
            isLoading={isWaitingToSpeak}
            onSendMessage={sendAvatarMessage}
            chatCount={chatCount}
            maxChat={10}
          />
        )}

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
              <span
                style={{
                  color: "#e9c349",
                  fontSize: "16px",
                  fontWeight: "700",
                  letterSpacing: "-0.03em",
                }}
              >
                Heritage Guessr
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              {[
                { label: txRP.navExplore, to: "/", active: false },
                { label: txRP.navLeaderboard, to: "/leaderboard", active: false },
                { label: txRP.navStudy, to: "/study", active: false },
                { label: txRP.navChallenge, to: "/game/rank", active: true },
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
          <div
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-1.5 sm:py-2 rounded-full"
            style={{
              ...glassPanel,
              border: timesUp
                ? "1px solid rgba(187,3,8,0.6)"
                : timeLeft <= 30
                  ? "1px solid rgba(187,3,8,0.4)"
                  : "1px solid rgba(233,195,73,0.2)",
              transition: "border-color 0.3s",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                color: timesUp
                  ? "#bb0308"
                  : timeLeft <= 30
                    ? "#ffb4a9"
                    : "#e9c349",
                fontSize: "15px",
              }}
            >
              {timesUp ? "timer_off" : "schedule"}
            </span>
            <span
              className="font-black tracking-widest"
              style={{
                color: timesUp
                  ? "#bb0308"
                  : timeLeft <= 30
                    ? "#ffb4a9"
                    : "#e3e3de",
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
              style={{
                ...glassPanel,
                border: "1px solid rgba(162,209,187,0.15)",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ color: "#a2d1bb", fontSize: "14px" }}
              >
                play_circle
              </span>
              <span
                style={{
                  color: "rgba(192,200,195,0.8)",
                  fontSize: "11px",
                  fontWeight: "700",
                }}
              >
                {isUnlimited ? "∞" : txRP.playsLeft(playsLeft)}
              </span>
            </div>
            {/* Session counter */}
            <div
              className="hidden xs:flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full"
              style={{
                ...glassPanel,
                border: "1px solid rgba(233,195,73,0.15)",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ color: "#e9c349", fontSize: "13px" }}
              >
                collections_bookmark
              </span>
              <span
                style={{
                  color: "rgba(192,200,195,0.8)",
                  fontSize: "11px",
                  fontWeight: "700",
                }}
              >
                {sessionIndex + 1}/{sessionLocations.length || 15}
              </span>
            </div>
            {/* Account */}
            <button
              className="bg-transparent border-none cursor-pointer p-1 sm:p-2 flex items-center rounded-full transition-colors duration-150 hover:bg-white/[0.06]"
              style={{ color: "#a2d1bb" }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "22px" }}
              >
                account_circle
              </span>
            </button>
          </div>
        </nav>

        {/* ── STREET VIEW CANVAS (full screen behind everything) ── */}
        <div className="fixed inset-0 z-0">
          <div ref={svContainerRef} style={{ width: "100%", height: "100%" }} />
          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: "inset 0 0 150px rgba(0,0,0,0.75)" }}
          />
          {/* Top-to-bottom gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 25%, transparent 55%, rgba(0,0,0,0.6) 100%)",
            }}
          />
          {/* Street View unavailable fallback */}
          {svError && !isBlurred && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
              style={{ backgroundColor: "rgba(14,21,19,0.92)" }}
            >
              <span
                className="material-symbols-outlined mb-3"
                style={{ color: "rgba(162,209,187,0.4)", fontSize: "48px" }}
              >
                panorama_photosphere_off
              </span>
              <p
                className="uppercase tracking-widest font-black"
                style={{ color: "rgba(162,209,187,0.5)", fontSize: "11px" }}
              >
                {txRP.noImagery}
              </p>
              <p style={{ color: "rgba(192,200,195,0.35)", fontSize: "11px", marginTop: "4px" }}>
                {txRP.useClues}
              </p>
            </div>
          )}
        </div>

        {/* ── MAINTENANCE WALL ── */}
        {maintenanceMode && (
          <div
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center"
            style={{ backgroundColor: "rgba(14,21,19,0.97)" }}
          >
            <span
              className="material-symbols-outlined mb-4"
              style={{ color: "#e9c349", fontSize: "64px", fontVariationSettings: "'FILL' 1" }}
            >
              construction
            </span>
            <h2 className="font-black mb-2" style={{ color: "#e3e3d9", fontSize: "28px" }}>
              {txRP.maintenanceTitle}
            </h2>
            <p style={{ color: "rgba(192,200,195,0.6)", fontSize: "14px", textAlign: "center", maxWidth: "320px" }}>
              {txRP.maintenanceDesc}
            </p>
            <Link
              to="/"
              className="mt-8 px-8 py-3 font-black uppercase tracking-widest"
              style={{ backgroundColor: "#1e201a", color: "#a2d1bb", border: "1px solid rgba(162,209,187,0.2)", borderRadius: "4px", fontSize: "11px", textDecoration: "none" }}
            >
              {txRP.backHome}
            </Link>
          </div>
        )}

        {/* ── DAILY LIMIT WALL ── */}
        {!canPlay && (
          <div
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center"
            style={{ backgroundColor: "rgba(14,21,19,0.97)" }}
          >
            <span
              className="material-symbols-outlined mb-4"
              style={{
                color: "#bb0308",
                fontSize: "64px",
                fontVariationSettings: "'FILL' 1",
              }}
            >
              block
            </span>
            <h2
              className="font-black mb-2"
              style={{ color: "#ffb4a9", fontSize: "28px" }}
            >
              {txRP.sealedTitle}
            </h2>
            <p style={{ color: "rgba(192,200,195,0.6)", fontSize: "14px", textAlign: "center", maxWidth: 320 }}>
              {txRP.sealedDesc(MAX_DAILY_PLAYS)}
            </p>

            {/* Subscription upsell */}
            <div style={{
              marginTop: 28, padding: "20px 28px", borderRadius: 14,
              border: "1px solid rgba(162,209,187,0.2)",
              background: "rgba(162,209,187,0.05)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
              maxWidth: 320, width: "100%",
            }}>
              <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.16em", color: "#a2d1bb", textTransform: "uppercase" }}>
                {txRP.upgradeTitle}
              </span>
              <p style={{ fontSize: 12, color: "rgba(192,200,195,0.55)", textAlign: "center", margin: 0, lineHeight: 1.6 }}>
                {txRP.upgradeDesc}
              </p>
              <Link
                to="/subscription"
                style={{
                  marginTop: 4, padding: "10px 24px", borderRadius: 8,
                  background: "linear-gradient(135deg, #0f3d2e, #a2d1bb)",
                  color: "#073829", fontWeight: 900, fontSize: 11,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                {txRP.viewSubscription}
              </Link>
            </div>

            <Link
              to="/"
              className="mt-5 font-black uppercase tracking-widest"
              style={{
                color: "rgba(192,200,195,0.35)",
                fontSize: "11px",
                textDecoration: "none",
              }}
            >
              ← {txRP.backHome}
            </Link>
          </div>
        )}

        {/* ── COUNTDOWN OVERLAY ── */}
        {isBlurred && !finished && canPlay && (
          <div
            className="fixed inset-0 z-30 flex items-center justify-center"
            style={{
              top: "64px",
              backgroundColor: "rgba(12,14,10,0.9)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="text-center">
              {countdown > 0 && (
                <>
                  <span
                    className="font-black block"
                    style={{
                      fontSize: "120px",
                      color: "#e9c349",
                      lineHeight: 1,
                      textShadow: "0 0 60px rgba(233,195,73,0.5)",
                    }}
                  >
                    {countdown}
                  </span>
                  <p
                    className="uppercase tracking-widest mt-4"
                    style={{ color: "rgba(162,209,187,0.6)", fontSize: "12px" }}
                  >
                    {txRP.preparingArchive}
                  </p>
                  <div className="mt-6 w-64 mx-auto">
                    <div className="flex justify-between mb-1">
                      <span
                        style={{
                          color: "rgba(192,200,195,0.4)",
                          fontSize: "10px",
                        }}
                      >
                        {txRP.sessionProgress}
                      </span>
                      <span
                        style={{
                          color: "#a2d1bb",
                          fontSize: "10px",
                          fontWeight: "700",
                        }}
                      >
                        {sessionIndex} / {sessionLocations.length || 15}
                      </span>
                    </div>
                    <div
                      className="w-full h-1 rounded-full overflow-hidden"
                      style={{ backgroundColor: "#292b24" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${sessionProgress}%`,
                          backgroundColor: "#a2d1bb",
                          transition: "width 0.5s ease",
                        }}
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
            <span
              className="material-symbols-outlined mb-4"
              style={{
                color: "#e9c349",
                fontSize: "64px",
                fontVariationSettings: "'FILL' 1",
              }}
            >
              workspace_premium
            </span>
            <h2
              className="font-black mb-2"
              style={{ color: "#e3e3d9", fontSize: "36px" }}
            >
              {txRP.sessionComplete}
            </h2>
            <p style={{ color: "rgba(192,200,195,0.6)", fontSize: "14px" }}>
              {txRP.allCatalogued}
            </p>
            <div className="flex gap-4 mt-8">
              <Link
                to="/rank"
                className="px-8 py-3 font-black uppercase tracking-widest"
                style={{
                  backgroundColor: "#bb0308",
                  color: "#ffc8c0",
                  borderRadius: "4px",
                  fontSize: "11px",
                  textDecoration: "none",
                }}
              >
                {txRP.viewRank}
              </Link>
              <Link
                to="/"
                className="px-8 py-3 font-black uppercase tracking-widest"
                style={{
                  backgroundColor: "#1e201a",
                  color: "#a2d1bb",
                  border: "1px solid rgba(162,209,187,0.2)",
                  borderRadius: "4px",
                  fontSize: "11px",
                  textDecoration: "none",
                }}
              >
                {txRP.sanctuary}
              </Link>
            </div>
          </div>
        )}

        {/* ── TIME'S UP FLASH ── */}
        {timesUp && (
          <div
            className="fixed inset-0 z-30 flex flex-col items-center justify-center pointer-events-none"
            style={{
              top: "64px",
              backgroundColor: "rgba(187,3,8,0.12)",
              backdropFilter: "blur(4px)",
            }}
          >
            <span
              className="font-black uppercase tracking-widest"
              style={{
                color: "#bb0308",
                fontSize: "56px",
                textShadow: "0 0 40px rgba(187,3,8,0.7)",
                animation: "pulse 0.5s ease-in-out infinite alternate",
              }}
            >
              {txRP.timesUp}
            </span>
            <p
              className="uppercase tracking-widest mt-3"
              style={{ color: "rgba(255,180,169,0.8)", fontSize: "13px" }}
            >
              {txRP.submitting}
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
            <p
              className="uppercase tracking-widest font-black mb-1"
              style={{ color: "#bb0308", fontSize: "9px" }}
            >
              {txRP.chamber(sessionIndex + 1)}
            </p>
            <h2
              className="font-black"
              style={{ color: "#ffffff", fontSize: "15px" }}
            >
              {txRP.heritage(current?.region || txRP.noRatings)}
            </h2>
            <div className="flex gap-1 mt-2 flex-wrap">
              {Array(Math.min(10, sessionLocations.length))
                .fill(0)
                .map((_, i) => {
                  const dotIndex = sessionIndex % 10;
                  return (
                    <div
                      key={i}
                      className="h-1 w-4 sm:w-5 rounded-full"
                      style={{
                        backgroundColor:
                          i < dotIndex
                            ? "#bb0308"
                            : i === dotIndex
                              ? "#a2d1bb"
                              : "rgba(162,209,187,0.15)",
                      }}
                    />
                  );
                })}
            </div>

            {/* Overall location rating */}
            <div className="flex items-center gap-1.5 mt-3 pt-2" style={{ borderTop: "1px solid rgba(162,209,187,0.08)" }}>
              <StarDisplay stars={current?.stars ?? 0} size={13} />
              <span style={{ color: "rgba(192,200,195,0.5)", fontSize: "10px", fontWeight: 700 }}>
                {current?.stars > 0 ? current.stars.toFixed(1) : txRP.noRatings}
              </span>
            </div>
          </div>
        )}

        {/* ── RANK PROGRESS (bottom-left, during play) — hidden on small phones ── */}
        {!isBlurred && !result && !finished && user && canPlay && (
          <div
            className="hidden sm:flex fixed z-30 flex-col items-center gap-3 py-5 px-4 rounded-2xl"
            style={{
              bottom: "140px",
              left: "16px",
              ...glassPanel,
              minWidth: "72px",
            }}
          >
            {/* Rank icon */}
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: "44px",
                height: "44px",
                backgroundColor: "rgba(233,195,73,0.12)",
                border: "1px solid rgba(233,195,73,0.2)",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  color: "#e9c349",
                  fontSize: "24px",
                  fontVariationSettings: "'FILL' 1",
                }}
              >
                military_tech
              </span>
            </div>

            {/* Rank name */}
            <p
              className="font-black uppercase tracking-wider text-center"
              style={{ color: "#a2d1bb", fontSize: "10px" }}
            >
              {rankNames[Math.max(0, (user.rank || 1) - 1)]}
            </p>

            {/* Stars — vertical stack */}
            <div className="flex flex-col gap-1.5 items-center">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "20px",
                      color:
                        i < (user.rank_progress || 0)
                          ? "#e9c349"
                          : "rgba(65,73,68,0.4)",
                      fontVariationSettings:
                        i < (user.rank_progress || 0) ? "'FILL' 1" : "'FILL' 0",
                      transition: "color 0.3s",
                    }}
                  >
                    star
                  </span>
                ))}
            </div>

            {/* Progress label */}
            <p
              className="uppercase tracking-widest font-black text-center"
              style={{ color: "rgba(192,200,195,0.4)", fontSize: "9px" }}
            >
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
                      backgroundColor: rankChangeMsg.type === "up"
                        ? "rgba(162,209,187,0.1)"
                        : "rgba(187,3,8,0.1)",
                      border: `1px solid ${rankChangeMsg.type === "up" ? "rgba(162,209,187,0.3)" : "rgba(187,3,8,0.3)"}`,
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{
                        color: rankChangeMsg.type === "up" ? "#a2d1bb" : "#ffb4a9",
                        fontSize: "16px",
                      }}
                    >
                      {rankChangeMsg.type === "up" ? "arrow_upward" : "arrow_downward"}
                    </span>
                    <span
                      className="font-black uppercase tracking-wider"
                      style={{
                        color: rankChangeMsg.type === "up" ? "#a2d1bb" : "#ffb4a9",
                        fontSize: "11px",
                      }}
                    >
                      {rankChangeMsg.type === "up"
                        ? txRP.rankUp(rankChangeMsg.rankName)
                        : txRP.rankDown(rankChangeMsg.rankName)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h3
                      className="font-black"
                      style={{
                        color: "#a2d1bb",
                        fontSize: "20px",
                        fontFamily: "'Be Vietnam Pro', sans-serif",
                      }}
                    >
                      {fb.label}
                    </h3>
                    <p
                      style={{
                        color: "rgba(192,200,195,0.7)",
                        fontSize: "13px",
                        marginTop: "2px",
                      }}
                    >
                      {result.correctName}
                      {result.correctAge
                        ? ` · ${result.correctAge} ${txRP.yrsOld}`
                        : ""}
                    </p>
                    {current?.description && (
                      <p
                        style={{
                          color: "rgba(192,200,195,0.45)",
                          fontSize: "11px",
                          marginTop: "4px",
                          lineHeight: "1.4",
                          maxWidth: "360px",
                        }}
                      >
                        {current.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right ml-6 flex-shrink-0">
                    <span
                      className="font-black"
                      style={{
                        color: "#e9c349",
                        fontSize: "40px",
                        fontFamily: "'Be Vietnam Pro', sans-serif",
                        lineHeight: 1,
                      }}
                    >
                      {ptsEarned.toLocaleString()}
                    </span>
                    <span
                      className="block uppercase tracking-widest"
                      style={{
                        color: "rgba(192,200,195,0.6)",
                        fontSize: "10px",
                        marginTop: "2px",
                      }}
                    >
                      {txRP.ptsEarned}
                    </span>
                    {/* Score breakdown */}
                    <div className="flex gap-3 mt-2 justify-end">
                      <span
                        style={{
                          color: "#a2d1bb",
                          fontSize: "11px",
                          fontWeight: "700",
                        }}
                      >
                        {txRP.scoreName} {result.nameScore}/5
                      </span>
                      <span
                        style={{
                          color: "#e9c349",
                          fontSize: "11px",
                          fontWeight: "700",
                        }}
                      >
                        {txRP.scoreAge} {result.ageScore}/5
                      </span>
                    </div>
                  </div>
                </div>

                {/* Accuracy Bar */}
                <div
                  className="h-1.5 w-full rounded-full overflow-hidden"
                  style={{ backgroundColor: "rgba(42,50,47,0.8)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${accuracyPct}%`,
                      background:
                        "linear-gradient(90deg, #a2d1bb 0%, #e9c349 100%)",
                      boxShadow: "0 0 12px rgba(162,209,187,0.4)",
                      transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
                    }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span
                    className="uppercase tracking-widest"
                    style={{ color: "rgba(162,209,187,0.5)", fontSize: "10px" }}
                  >
                    {txRP.similarity(Math.round(result.similarity * 100))}
                  </span>
                  <span
                    className="uppercase tracking-widest"
                    style={{ color: "rgba(162,209,187,0.5)", fontSize: "10px" }}
                  >
                    {txRP.timeline(result.ageDiff)}
                  </span>
                </div>

                {/* Location rating */}
                <div
                  className="mt-4 px-4 py-3 rounded-xl flex flex-col gap-2"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(162,209,187,0.08)" }}
                >
                  {/* Overall rating row */}
                  <div className="flex items-center justify-between">
                    <span style={{ color: "rgba(162,209,187,0.5)", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      {txRP.overallRating}
                    </span>
                    <div className="flex items-center gap-2">
                      <StarDisplay stars={locationRating.stars} size={15} />
                      <span style={{ color: "rgba(192,200,195,0.5)", fontSize: "10px" }}>
                        {locationRating.stars > 0 ? locationRating.stars.toFixed(1) : "0.0"} · {txRP.votes(locationRating.total_ratings)}
                      </span>
                    </div>
                  </div>

                  {/* User rating row */}
                  <div className="flex items-center justify-between">
                    <span style={{ color: "rgba(162,209,187,0.4)", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      {locationRating.my_rating ? txRP.yourRating : txRP.rateThis}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const filled = (locationRating.my_rating ?? 0) >= star;
                        return (
                          <button
                            key={star}
                            type="button"
                            disabled={ratingSubmitting}
                            onClick={async () => {
                              if (!current || ratingSubmitting) return;
                              setRatingSubmitting(true);
                              try {
                                const { data } = await axios.post(
                                  `${import.meta.env.VITE_API_BASE_URL}/locations/rate/${current.id}`,
                                  { rating: star },
                                  { withCredentials: true },
                                );
                                setLocationRating(data);
                              } catch {}
                              finally { setRatingSubmitting(false); }
                            }}
                            style={{
                              background: "none", border: "none", padding: "2px",
                              cursor: ratingSubmitting ? "default" : "pointer",
                              color: filled ? "#e9c349" : "rgba(162,209,187,0.2)",
                              fontSize: "22px", lineHeight: 1,
                              transition: "color 0.15s, transform 0.1s",
                            }}
                            onMouseEnter={(e) => { if (!ratingSubmitting) e.currentTarget.style.color = "#e9c349"; e.currentTarget.style.transform = "scale(1.15)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = filled ? "#e9c349" : "rgba(162,209,187,0.2)"; e.currentTarget.style.transform = "scale(1)"; }}
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: "inherit", fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0" }}
                            >
                              star
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
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
                  {txRP.continue}
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "16px" }}
                  >
                    arrow_forward
                  </span>
                </button>
              </div>
            )}

            {/* HOW-TO-PLAY BUTTON (above input row) */}
            {!result && (
              <div className="w-full flex justify-center" style={{ maxWidth: "800px" }}>
                <button
                  type="button"
                  onClick={() => setShowHowTo(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full transition-colors"
                  style={{
                    ...glassPanel,
                    border: "1px solid rgba(233,195,73,0.25)",
                    color: "#e9c349",
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                    help
                  </span>
                  {txRP.howToPlay}
                </button>
              </div>
            )}

            {/* INPUT ROW */}
            {!result && (
              <div
                className="rankplay-input-row w-full flex items-end gap-3"
                style={{ maxWidth: "800px" }}
              >
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
                      <label
                        className="block uppercase tracking-wider"
                        style={{
                          color: "rgba(162,209,187,0.5)",
                          fontSize: "10px",
                          marginBottom: "4px",
                        }}
                      >
                        {txRP.enterHeritage}
                      </label>
                      <input
                        value={heritage}
                        onChange={(e) => setHeritage(e.target.value)}
                        placeholder={txRP.heritagePlaceholder}
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
                    <div
                      className="rankplay-input-divider hidden sm:block"
                      style={{
                        width: "1px",
                        height: "40px",
                        backgroundColor: "rgba(65,73,68,0.4)",
                        margin: "0 8px",
                      }}
                    />
                    {/* Year input */}
                    <div
                      className="rankplay-year-input px-3 sm:px-4 py-1"
                      style={{ width: "110px" }}
                    >
                      <label
                        className="block uppercase tracking-wider"
                        style={{
                          color: "rgba(162,209,187,0.5)",
                          fontSize: "10px",
                          marginBottom: "4px",
                        }}
                      >
                        {txRP.yearsOldLabel}
                      </label>
                      <input
                        type="number"
                        inputMode="numeric"
                        value={ageGuess}
                        onChange={(e) =>
                          setAgeGuess(e.target.value.replace(/[^0-9]/g, ""))
                        }
                        onKeyDown={(e) =>
                          ["e", "E", "+", "-", "."].includes(e.key) &&
                          e.preventDefault()
                        }
                        placeholder={txRP.yearPlaceholder}
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
                        background:
                          timeLeft === 0 || timesUp
                            ? "rgba(42,50,47,0.8)"
                            : "linear-gradient(135deg, #0f3d2e 0%, #a2d1bb 100%)",
                        color:
                          timeLeft === 0 || timesUp
                            ? "rgba(192,200,195,0.3)"
                            : "#073829",
                        border: "none",
                        cursor:
                          timeLeft === 0 || timesUp ? "not-allowed" : "pointer",
                        fontSize: "12px",
                        fontFamily: "'Be Vietnam Pro', sans-serif",
                      }}
                    >
                      {txRP.guess}
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "15px" }}
                      >
                        send
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── HINT BANNER (first round of session) ── */}
        {showHint && !isBlurred && !result && canPlay && (
          <div
            className="fixed z-40 px-4"
            style={{
              top: "84px",
              left: "50%",
              transform: "translateX(-50%)",
              maxWidth: "560px",
              width: "calc(100% - 24px)",
              animation: "rankplay-hint-in 0.4s ease",
            }}
          >
            <div
              className="rounded-xl px-4 py-3 flex items-start gap-3"
              style={{
                ...glassPanel,
                border: "1px solid rgba(233,195,73,0.3)",
                boxShadow: "0 12px 36px rgba(0,0,0,0.4)",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ color: "#e9c349", fontSize: "20px", marginTop: "1px", fontVariationSettings: "'FILL' 1" }}
              >
                lightbulb
              </span>
              <p
                style={{
                  color: "rgba(227,227,222,0.95)",
                  fontSize: "12px",
                  lineHeight: 1.55,
                  margin: 0,
                  flex: 1,
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                }}
              >
                {txRP.hintMessage}
              </p>
              <button
                type="button"
                onClick={() => setShowHint(false)}
                className="bg-transparent border-none cursor-pointer flex-shrink-0"
                style={{ color: "rgba(192,200,195,0.5)", padding: 0 }}
                aria-label="Dismiss hint"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                  close
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ── RATING-NAME WAITING OVERLAY (Qwen call) ── */}
        {isRatingName && !result && (
          <div
            className="fixed inset-0 z-[55] flex flex-col items-center justify-center pointer-events-auto"
            style={{ backgroundColor: "rgba(12,14,10,0.78)", backdropFilter: "blur(6px)" }}
          >
            <div
              className="flex flex-col items-center gap-4 px-8 py-7 rounded-2xl"
              style={{
                ...glassPanel,
                border: "1px solid rgba(233,195,73,0.2)",
                maxWidth: "320px",
              }}
            >
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: "#e9c349",
                      animation: `rankplay-bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
                    }}
                  />
                ))}
              </div>
              <p
                className="uppercase tracking-widest font-black text-center"
                style={{ color: "#e9c349", fontSize: "12px" }}
              >
                {txRP.ratingTitle}
              </p>
              <p
                style={{
                  color: "rgba(192,200,195,0.65)",
                  fontSize: "11px",
                  textAlign: "center",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {txRP.ratingSubtitle}
              </p>
            </div>
          </div>
        )}

        {/* ── HOW-TO-PLAY MODAL ── */}
        {showHowTo && (
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center px-4"
            style={{ backgroundColor: "rgba(8,10,8,0.78)", backdropFilter: "blur(6px)" }}
            onClick={() => setShowHowTo(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="rounded-2xl p-6 sm:p-7"
              style={{
                ...glassPanel,
                border: "1px solid rgba(162,209,187,0.2)",
                maxWidth: "480px",
                width: "100%",
                maxHeight: "85vh",
                overflowY: "auto",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "#e9c349", fontSize: "22px", fontVariationSettings: "'FILL' 1" }}
                  >
                    help
                  </span>
                  <h3
                    className="font-black uppercase tracking-wider"
                    style={{ color: "#e9c349", fontSize: "14px" }}
                  >
                    {txRP.howToPlayTitle}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHowTo(false)}
                  className="bg-transparent border-none cursor-pointer"
                  style={{ color: "rgba(192,200,195,0.6)", padding: "4px" }}
                  aria-label="Close"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                    close
                  </span>
                </button>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {txRP.howToPlaySteps.map((step, i) => (
                  <li
                    key={i}
                    className="flex gap-3 mb-3"
                    style={{ color: "rgba(227,227,222,0.92)", fontSize: "13px", lineHeight: 1.6 }}
                  >
                    <span
                      className="flex items-center justify-center font-black flex-shrink-0"
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(233,195,73,0.15)",
                        color: "#e9c349",
                        fontSize: "11px",
                      }}
                    >
                      {i + 1}
                    </span>
                    <span style={{ flex: 1 }}>{step}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setShowHowTo(false)}
                className="mt-4 w-full py-2.5 rounded-xl font-black uppercase tracking-widest transition-all active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #0f3d2e 0%, #a2d1bb 100%)",
                  color: "#073829",
                  border: "none",
                  fontSize: "11px",
                  cursor: "pointer",
                }}
              >
                {txRP.gotIt}
              </button>
            </div>
          </div>
        )}

        {/* Local keyframes for the rating dots and hint slide-in */}
        <style>{`
          @keyframes rankplay-bounce {
            0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
            40% { transform: scale(1); opacity: 1; }
          }
          @keyframes rankplay-hint-in {
            from { opacity: 0; transform: translate(-50%, -8px); }
            to   { opacity: 1; transform: translate(-50%, 0); }
          }
        `}</style>

        {/* Floating particles */}
        <div className="fixed inset-0 pointer-events-none z-10">
          <div
            className="absolute"
            style={{
              top: "25%",
              left: "33%",
              width: "4px",
              height: "4px",
              backgroundColor: "rgba(233,195,73,0.3)",
              borderRadius: "50%",
              filter: "blur(2px)",
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: "33%",
              right: "25%",
              width: "8px",
              height: "8px",
              backgroundColor: "rgba(162,209,187,0.15)",
              borderRadius: "50%",
              filter: "blur(4px)",
            }}
          />
          <div
            className="absolute"
            style={{
              top: "50%",
              left: "25%",
              width: "4px",
              height: "4px",
              backgroundColor: "rgba(198,199,194,0.2)",
              borderRadius: "50%",
              filter: "blur(2px)",
            }}
          />
        </div>
      </div>
  );
}
