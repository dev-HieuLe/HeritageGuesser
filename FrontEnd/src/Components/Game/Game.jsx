import { useState, useEffect, useRef, useContext } from "react";
import {
  GoogleMap,
  StreetViewPanorama,
  LoadScriptNext,
} from "@react-google-maps/api";
import axios from "axios";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { AuthContext } from "../../Context/authContext";
import { Link } from "react-router-dom";

const DAILY_KEY = "dailyChallenge";
const DAILY_PLAYS = 5;

function getTodayStr() {
  return new Date().toDateString();
}

function getDailyStorage() {
  const raw = JSON.parse(localStorage.getItem(DAILY_KEY)) || {};
  if (raw.date !== getTodayStr()) {
    const fresh = { date: getTodayStr(), count: 0, completed: false };
    localStorage.setItem(DAILY_KEY, JSON.stringify(fresh));
    return fresh;
  }
  return raw;
}

function saveDailyStorage(data) {
  localStorage.setItem(DAILY_KEY, JSON.stringify(data));
}

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

  // Daily challenge state
  const [playsLeft, setPlaysLeft] = useState(DAILY_PLAYS);
  const [canPlay, setCanPlay] = useState(true);
  const [dailyCompleted, setDailyCompleted] = useState(false);

  const messagesEndRef = useRef(null);
  const { width, height } = useWindowSize();
  const { user, setUser } = useContext(AuthContext);

  const updateLimitState = () => {
    const data = getDailyStorage();
    setPlaysLeft(DAILY_PLAYS - data.count);
    setDailyCompleted(data.completed);
    setCanPlay(!data.completed && data.count < DAILY_PLAYS);
  };

  useEffect(() => {
    updateLimitState();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingReply]);

  // Load today's 5 fixed daily locations
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/locations/daily`)
      .then((res) => setLocations(res.data))
      .catch((err) => console.error("Error fetching daily locations", err));
  }, []);

  const startNewRound = () => {
    const data = getDailyStorage();
    if (data.completed || data.count >= DAILY_PLAYS) {
      setCanPlay(false);
      setDailyCompleted(data.completed);
      return;
    }

    data.count += 1;
    saveDailyStorage(data);
    setPlaysLeft(DAILY_PLAYS - data.count);
    setIsBlurred(true);
    setCountdown(1);
    setTimeLeft(180);
    setShowConfetti(false);

    let counter = 1;
    const interval = setInterval(() => {
      counter--;
      setCountdown(counter);
      if (counter === 0) {
        clearInterval(interval);
        setIsBlurred(false);
      }
    }, 1000);
  };

  useEffect(() => {
    if (locations.length > 0 && canPlay) startNewRound();
  }, [index, locations]);

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
    if (sessionMessages >= MAX_SESSION_MESSAGES) {
      alert("Session limit reached.");
      return;
    }
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
        { withCredentials: true },
      );
      setMessages((prev) => [...prev, { role: "bot", text: res.data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Failed to connect to The Archivist." },
      ]);
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
        { withCredentials: true },
      );
      const { nameScore, similarity } = res.data;

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

      if (user) {
        setUser({ ...user, level: (user.level || 0) + levelGain });
        try {
          await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/player/update-level`,
            { levelGain },
            { withCredentials: true },
          );
        } catch {}

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
      if (total === 10) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 7000);
      }
    } catch (err) {
      console.error("Check answer failed:", err);
    }
  };

  const handleContinue = async () => {
    const nextIndex = index + 1;

    if (nextIndex >= locations.length) {
      // All 5 done — mark daily challenge complete and award 20 pts
      const data = getDailyStorage();
      data.completed = true;
      saveDailyStorage(data);
      setDailyCompleted(true);
      setCanPlay(false);
      setFinished(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 8000);

      if (user) {
        try {
          await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/player/add-points`,
            { amount: 20 },
            { withCredentials: true },
          );
          setUser((u) => (u ? { ...u, points: (u.points || 0) + 20 } : u));
        } catch {}
      }
    } else {
      setIndex(nextIndex);
      setHeritage("");
      setAgeGuess("");
      setResult(null);
      setMessages([]);
      setChatCount(0);
      setSessionMessages(0);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isSending) sendMessage();
    }
  };

  const current = locations[index];
  const accuracy = current
    ? Math.min(100, Math.round((chatCount / 10) * 50 + 50))
    : 94;
  const mins = Math.floor(timeLeft / 60);
  const secs = String(timeLeft % 60).padStart(2, "0");

  return (
    <LoadScriptNext googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div
        className="w-full h-screen flex flex-col relative overflow-hidden"
        style={{
          backgroundColor: "#12140e",
          fontFamily: "'Be Vietnam Pro', sans-serif",
        }}
      >
        {showConfetti && (
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={350}
          />
        )}

        {/* ── DAILY CHALLENGE COMPLETE WALL ── */}
        {dailyCompleted && !finished && (
          <div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center"
            style={{ backgroundColor: "rgba(18,20,14,0.97)" }}
          >
            <span
              className="material-symbols-outlined mb-4"
              style={{
                color: "#e9c349",
                fontSize: "64px",
                fontVariationSettings: "'FILL' 1",
              }}
            >
              task_alt
            </span>
            <h2
              className="text-3xl font-black mb-2"
              style={{ color: "#e9c349" }}
            >
              Daily Challenge Complete!
            </h2>
            <p style={{ color: "rgba(192,200,195,0.6)", fontSize: "14px" }}>
              You've finished today's 5 heritage sites.
            </p>
            <p
              className="mt-1"
              style={{ color: "rgba(192,200,195,0.4)", fontSize: "13px" }}
            >
              Come back tomorrow for a new set.
            </p>
            <Link
              to="/"
              className="mt-8 px-8 py-3 font-black uppercase tracking-widest"
              style={{
                backgroundColor: "#e9c349",
                color: "#12140e",
                borderRadius: "4px",
                fontSize: "11px",
                textDecoration: "none",
              }}
            >
              Return to Sanctuary
            </Link>
          </div>
        )}

        {/* ── DAILY CHALLENGE FINISHED OVERLAY (after last round) ── */}
        {finished && (
          <div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center"
            style={{ backgroundColor: "rgba(18,20,14,0.97)" }}
          >
            <span
              className="material-symbols-outlined mb-3"
              style={{
                color: "#e9c349",
                fontSize: "72px",
                fontVariationSettings: "'FILL' 1",
              }}
            >
              emoji_events
            </span>
            <h2
              className="text-4xl font-black mb-2"
              style={{ color: "#e9c349" }}
            >
              Daily Challenge Complete!
            </h2>
            <p style={{ color: "rgba(192,200,195,0.7)", fontSize: "14px" }}>
              All 5 heritage sites catalogued for today.
            </p>
            <div
              className="flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full"
              style={{
                backgroundColor: "rgba(233,195,73,0.12)",
                border: "1px solid rgba(233,195,73,0.3)",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  color: "#e9c349",
                  fontSize: "18px",
                  fontVariationSettings: "'FILL' 1",
                }}
              >
                star
              </span>
              <span
                className="font-black"
                style={{ color: "#e9c349", fontSize: "14px" }}
              >
                +20 Points Awarded
              </span>
            </div>
            <p
              className="mt-3"
              style={{ color: "rgba(192,200,195,0.35)", fontSize: "12px" }}
            >
              New challenge resets at midnight.
            </p>
            <div className="flex gap-4 mt-8">
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
                Sanctuary
              </Link>
              <Link
                to="/leaderboard"
                className="px-8 py-3 font-black uppercase tracking-widest"
                style={{
                  backgroundColor: "#e9c349",
                  color: "#12140e",
                  borderRadius: "4px",
                  fontSize: "11px",
                  textDecoration: "none",
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
          style={{
            background:
              "linear-gradient(to bottom, rgba(15,61,46,0.95), transparent)",
          }}
        >
          <Link
            to="/"
            style={{
              color: "#a2d1bb",
              fontWeight: "900",
              fontSize: "16px",
              textDecoration: "none",
            }}
          >
            Heritage Guessr
          </Link>

          {/* Timer */}
          {!finished && !dailyCompleted && (
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
                style={{
                  backgroundColor: timeLeft > 60 ? "#a2d1bb" : "#bb0308",
                  animation: "pulse 1s infinite",
                }}
              />
              <span
                className="font-black tracking-widest"
                style={{
                  color: timeLeft > 60 ? "#e9c349" : "#ffb4a9",
                  fontSize: "14px",
                }}
              >
                {mins}:{secs}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Daily Challenge checkbox */}
            <div
              className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-full"
              style={{
                backgroundColor: "rgba(30,32,26,0.7)",
                backdropFilter: "blur(12px)",
                border: dailyCompleted
                  ? "1px solid rgba(233,195,73,0.4)"
                  : "1px solid rgba(65,73,68,0.4)",
              }}
            >
              <div
                className="flex items-center justify-center rounded"
                style={{
                  width: "16px",
                  height: "16px",
                  backgroundColor: dailyCompleted ? "#e9c349" : "transparent",
                  border: dailyCompleted
                    ? "none"
                    : "1.5px solid rgba(162,209,187,0.4)",
                  flexShrink: 0,
                }}
              >
                {dailyCompleted && (
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "12px",
                      color: "#12140e",
                      fontVariationSettings: "'FILL' 1",
                    }}
                  >
                    check
                  </span>
                )}
              </div>
              <span
                style={{
                  color: dailyCompleted ? "#e9c349" : "rgba(192,200,195,0.7)",
                  fontSize: "11px",
                  fontWeight: "700",
                  whiteSpace: "nowrap",
                }}
              >
                Daily Challenge
              </span>
            </div>

            {/* Plays left */}
            <div
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-full"
              style={{
                backgroundColor: "rgba(30,32,26,0.7)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(65,73,68,0.4)",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ color: "#e9c349", fontSize: "13px" }}
              >
                play_circle
              </span>
              <span
                style={{
                  color: "rgba(192,200,195,0.7)",
                  fontSize: "11px",
                  fontWeight: "700",
                }}
              >
                {playsLeft}/{DAILY_PLAYS}
              </span>
            </div>

            {user && (
              <div
                className="hidden sm:block"
                style={{
                  color: "rgba(162,209,187,0.6)",
                  fontSize: "11px",
                  fontWeight: "700",
                }}
              >
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
              center={
                current
                  ? { lat: current.lat, lng: current.lng }
                  : { lat: 16.0471, lng: 108.2062 }
              }
              zoom={14}
              options={{ disableDefaultUI: true }}
            >
              {current && !isBlurred && (
                <StreetViewPanorama
                  key={index}
                  position={{ lat: current.lat, lng: current.lng }}
                  visible
                  options={{
                    disableDefaultUI: true,
                    linksControl: true,
                    panControl: true,
                  }}
                />
              )}
            </GoogleMap>
          )}

          {/* COUNTDOWN OVERLAY */}
          {isBlurred && !finished && !dailyCompleted && canPlay && (
            <div
              className="absolute inset-0 flex items-center justify-center z-20"
              style={{
                backgroundColor: "rgba(12,14,10,0.85)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div className="text-center">
                {countdown > 0 ? (
                  <>
                    <span
                      className="font-black"
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
                      style={{
                        color: "rgba(162,209,187,0.6)",
                        fontSize: "12px",
                      }}
                    >
                      Daily Challenge · Site {index + 1} of {DAILY_PLAYS}
                    </p>
                  </>
                ) : null}
              </div>
            </div>
          )}

          {/* TOP LEFT: Chamber info */}
          {!isBlurred && !result && !finished && !dailyCompleted && (
            <div
              className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20 p-3 sm:p-5 rounded-xl"
              style={{
                background: "rgba(18,20,14,0.7)",
                backdropFilter: "blur(20px)",
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
                Daily · Site {index + 1}/{DAILY_PLAYS}
              </p>
              <h2
                className="font-black text-base sm:text-xl"
                style={{ color: "#ffffff" }}
              >
                {current?.region || "Unknown"} Heritage
              </h2>
              <div className="flex gap-1 sm:gap-1.5 mt-2 sm:mt-3">
                {Array(DAILY_PLAYS)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="h-1 w-6 sm:w-10 rounded-full"
                      style={{
                        backgroundColor:
                          i < index
                            ? "#e9c349"
                            : i === index
                              ? "#a2d1bb"
                              : "rgba(162,209,187,0.15)",
                      }}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* TOP RIGHT: Archive Synchrony */}
          {!isBlurred && !result && !finished && !dailyCompleted && (
            <div
              className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 p-3 sm:p-5 rounded-xl text-right"
              style={{
                background: "rgba(18,20,14,0.7)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(65,73,68,0.3)",
              }}
            >
              <p
                className="uppercase tracking-widest font-bold mb-1 hidden sm:block"
                style={{ color: "rgba(162,209,187,0.6)", fontSize: "9px" }}
              >
                Archive Synchrony
              </p>
              <div className="flex items-end justify-end gap-2">
                <span
                  className="font-black text-2xl sm:text-4xl"
                  style={{ color: "#ffb4a9" }}
                >
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

          {/* Archivist hint */}
          {!isBlurred &&
            !result &&
            !finished &&
            !dailyCompleted &&
            messages.length > 0 && (
              <div
                className="hidden sm:block absolute bottom-24 right-4 z-20 p-4 rounded-xl max-w-xs"
                style={{
                  background: "rgba(18,20,14,0.75)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(65,73,68,0.4)",
                }}
              >
                <p
                  className="uppercase tracking-widest font-black mb-2"
                  style={{ color: "#e9c349", fontSize: "9px" }}
                >
                  The Archivist
                </p>
                <p
                  style={{
                    color: "#e3e3d9",
                    fontSize: "12px",
                    lineHeight: "1.5",
                  }}
                >
                  {messages.filter((m) => m.role === "bot").slice(-1)[0]
                    ?.text || ""}
                </p>
              </div>
            )}

          {/* RESULT OVERLAY */}
          {result && !finished && (
            <div
              className="absolute inset-0 z-20 flex items-center justify-center overflow-y-auto"
              style={{
                backgroundColor: "rgba(12,14,10,0.92)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div
                className="p-5 sm:p-8 rounded-2xl max-w-lg w-full mx-3 sm:mx-4 my-4"
                style={{
                  backgroundColor: "#1e201a",
                  border: `2px solid ${result.total === 10 ? "#e9c349" : "rgba(65,73,68,0.6)"}`,
                  boxShadow:
                    result.total === 10
                      ? "0 0 60px rgba(233,195,73,0.2)"
                      : "none",
                }}
              >
                <div className="text-center mb-6">
                  <p
                    className="uppercase tracking-widest font-black mb-2"
                    style={{ color: "rgba(192,200,195,0.5)", fontSize: "10px" }}
                  >
                    Archive Score · Site {index + 1}/{DAILY_PLAYS}
                  </p>
                  <div
                    className="text-7xl font-black"
                    style={{
                      color:
                        result.total >= 8
                          ? "#e9c349"
                          : result.total >= 5
                            ? "#a2d1bb"
                            : "#ffb4a9",
                    }}
                  >
                    {result.total}
                    <span
                      style={{
                        fontSize: "32px",
                        color: "rgba(192,200,195,0.4)",
                      }}
                    >
                      /10
                    </span>
                  </div>
                  {result.total === 10 && (
                    <p
                      className="uppercase tracking-widest font-black mt-2"
                      style={{ color: "#e9c349", fontSize: "11px" }}
                    >
                      Perfect Curation!
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div
                    className="text-center p-4 rounded-xl"
                    style={{ backgroundColor: "#292b24" }}
                  >
                    <p
                      style={{
                        color: "rgba(192,200,195,0.5)",
                        fontSize: "10px",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      Name Score
                    </p>
                    <p
                      className="font-black text-3xl mt-1"
                      style={{ color: "#a2d1bb" }}
                    >
                      {result.nameScore}
                      <span
                        style={{
                          fontSize: "16px",
                          color: "rgba(162,209,187,0.4)",
                        }}
                      >
                        /5
                      </span>
                    </p>
                    <p
                      style={{
                        color: "rgba(192,200,195,0.4)",
                        fontSize: "10px",
                        marginTop: "4px",
                      }}
                    >
                      {Math.round(result.similarity * 100)}% similarity
                    </p>
                  </div>
                  <div
                    className="text-center p-4 rounded-xl"
                    style={{ backgroundColor: "#292b24" }}
                  >
                    <p
                      style={{
                        color: "rgba(192,200,195,0.5)",
                        fontSize: "10px",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      Age Score
                    </p>
                    <p
                      className="font-black text-3xl mt-1"
                      style={{ color: "#e9c349" }}
                    >
                      {result.ageScore}
                      <span
                        style={{
                          fontSize: "16px",
                          color: "rgba(233,195,73,0.4)",
                        }}
                      >
                        /5
                      </span>
                    </p>
                    <p
                      style={{
                        color: "rgba(192,200,195,0.4)",
                        fontSize: "10px",
                        marginTop: "4px",
                      }}
                    >
                      {result.ageDiff} yr diff
                    </p>
                  </div>
                </div>

                <div
                  className="p-4 rounded-xl mb-6"
                  style={{
                    backgroundColor: "#12140e",
                    border: "1px solid rgba(65,73,68,0.4)",
                  }}
                >
                  <div className="flex justify-between mb-2">
                    <span
                      style={{
                        color: "rgba(192,200,195,0.5)",
                        fontSize: "11px",
                      }}
                    >
                      Correct Site
                    </span>
                    <span
                      className="font-bold"
                      style={{ color: "#a2d1bb", fontSize: "11px" }}
                    >
                      {result.correctName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      style={{
                        color: "rgba(192,200,195,0.5)",
                        fontSize: "11px",
                      }}
                    >
                      Est. Age
                    </span>
                    <span
                      className="font-bold"
                      style={{ color: "#e9c349", fontSize: "11px" }}
                    >
                      {result.correctAge} years
                    </span>
                  </div>
                </div>

                {/* Show +20 pts teaser on last site */}
                {index === DAILY_PLAYS - 1 && (
                  <div
                    className="flex items-center gap-2 justify-center px-4 py-2 rounded-lg mb-4"
                    style={{
                      backgroundColor: "rgba(233,195,73,0.08)",
                      border: "1px solid rgba(233,195,73,0.2)",
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{
                        color: "#e9c349",
                        fontSize: "15px",
                        fontVariationSettings: "'FILL' 1",
                      }}
                    >
                      star
                    </span>
                    <span
                      style={{
                        color: "#e9c349",
                        fontSize: "12px",
                        fontWeight: "700",
                      }}
                    >
                      Complete daily challenge → +20 Points
                    </span>
                  </div>
                )}

                <button
                  onClick={handleContinue}
                  className="w-full py-3 font-black uppercase tracking-widest transition-all active:scale-95"
                  style={{
                    backgroundColor:
                      index === DAILY_PLAYS - 1 ? "#e9c349" : "#bb0308",
                    color: index === DAILY_PLAYS - 1 ? "#12140e" : "#ffc8c0",
                    borderRadius: "6px",
                    fontSize: "12px",
                    border: "none",
                    cursor: "pointer",
                    boxShadow:
                      index === DAILY_PLAYS - 1
                        ? "0 4px 24px rgba(233,195,73,0.3)"
                        : "0 4px 20px rgba(187,3,8,0.3)",
                  }}
                >
                  {index === DAILY_PLAYS - 1
                    ? "Complete Daily Challenge →"
                    : `Next Site (${index + 2}/${DAILY_PLAYS}) →`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM INPUT BAR */}
        {!isBlurred && !result && !finished && !dailyCompleted && canPlay && (
          <div
            className="flex-shrink-0 z-20"
            style={{
              background:
                "linear-gradient(to top, rgba(12,14,10,0.98) 60%, transparent)",
            }}
          >
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
                <div
                  className="flex items-center justify-between px-4 py-2"
                  style={{ borderBottom: "1px solid rgba(65,73,68,0.3)" }}
                >
                  <span
                    className="uppercase tracking-widest font-black"
                    style={{ color: "#e9c349", fontSize: "9px" }}
                  >
                    Consult the Archivist ({chatCount}/10)
                  </span>
                  <button
                    onClick={() => setShowChat(false)}
                    style={{
                      color: "rgba(162,209,187,0.4)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "18px",
                    }}
                    className="material-symbols-outlined"
                  >
                    close
                  </button>
                </div>
                <div
                  className="overflow-y-auto p-3 space-y-2"
                  style={{ maxHeight: "140px" }}
                >
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className="flex gap-2"
                      style={{
                        justifyContent:
                          msg.role === "user" ? "flex-end" : "flex-start",
                      }}
                    >
                      <div
                        className="px-3 py-2 rounded-lg max-w-xs"
                        style={{
                          backgroundColor:
                            msg.role === "user" ? "#bb0308" : "#292b24",
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
                      <div
                        className="px-3 py-2 rounded-lg"
                        style={{ backgroundColor: "#292b24" }}
                      >
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
                <div
                  className="flex gap-2 p-2"
                  style={{ borderTop: "1px solid rgba(65,73,68,0.3)" }}
                >
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={chatCount >= 10 || isSending}
                    placeholder={
                      chatCount >= 10
                        ? "Chat limit reached"
                        : "Ask the Archivist..."
                    }
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
                      color:
                        chatCount >= 10 ? "rgba(192,200,195,0.3)" : "#ffc8c0",
                      border: "none",
                      cursor: chatCount >= 10 ? "not-allowed" : "pointer",
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "18px" }}
                    >
                      send
                    </span>
                  </button>
                </div>
              </div>
            )}

            <div className="game-input-bar flex items-center gap-2 sm:gap-3 px-3 sm:px-4 pb-3 sm:pb-4 pt-2">
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
              <div
                className="game-input-age relative"
                style={{ width: "100px" }}
              >
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
              <button
                onClick={() => setShowChat((p) => !p)}
                className="game-btn-chat flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2.5 sm:py-3 rounded-xl font-black uppercase tracking-widest transition-all"
                style={{
                  backgroundColor: showChat
                    ? "rgba(162,209,187,0.15)"
                    : "rgba(30,32,26,0.8)",
                  backdropFilter: "blur(12px)",
                  border: showChat
                    ? "1px solid rgba(162,209,187,0.3)"
                    : "1px solid rgba(65,73,68,0.5)",
                  color: showChat ? "#a2d1bb" : "rgba(162,209,187,0.6)",
                  fontSize: "10px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "18px" }}
                >
                  forum
                </span>
                <span className="hidden sm:inline">Consult Archive</span>
              </button>
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
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "18px" }}
                >
                  check_circle
                </span>
                <span className="hidden sm:inline">Record Guess</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </LoadScriptNext>
  );
}
