import React, { useState, useEffect, useRef, useContext } from "react";
import {
  GoogleMap,
  StreetViewPanorama,
  LoadScriptNext,
} from "@react-google-maps/api";
import {
  Send,
  MapPin,
  Landmark,
  MessageCircle,
  CheckCircle,
  Bot,
} from "lucide-react";
import axios from "axios";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { AuthContext } from "../../Context/authContext";

export default function RankPlay() {
  // gameplay & UI
  const [heritage, setHeritage] = useState("");
  const [ageGuess, setAgeGuess] = useState(100);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatCount, setChatCount] = useState(0);

  // 🔥 DAILY LIMIT SYSTEM
  const MAX_DAILY_PLAYS = 50;
  const [canPlay, setCanPlay] = useState(true);
  const [playsLeft, setPlaysLeft] = useState(MAX_DAILY_PLAYS);

  // session: 20 locations per round
  const [sessionLocations, setSessionLocations] = useState([]);
  const [sessionIndex, setSessionIndex] = useState(0);

  const [result, setResult] = useState(null);
  const [finished, setFinished] = useState(false);
  const [loadingReply, setLoadingReply] = useState(false);

  // ui helpers
  const [countdown, setCountdown] = useState(3);
  const [isBlurred, setIsBlurred] = useState(true);
  const [timeLeft, setTimeLeft] = useState(180);
  const [showConfetti, setShowConfetti] = useState(false);
  const [notification, setNotification] = useState(null);

  const { user, setUser } = useContext(AuthContext);

  const messagesEndRef = useRef(null);
  const countdownRef = useRef(null);
  const timerRef = useRef(null);
  const { width, height } = useWindowSize();

  const current = sessionLocations[sessionIndex] || null;
  const getTodayData = () => {
    const today = new Date().toDateString();
    const data = JSON.parse(localStorage.getItem("rankGameUsage")) || {};

    if (data.date !== today) {
      const newData = { date: today, count: 0 };
      localStorage.setItem("rankGameUsage", JSON.stringify(newData));
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

  // initial load - get 20 random locations
  useEffect(() => {
    updateLimitState();

    const loadInitial = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/locations/random?count=20`,
        );
        setSessionLocations(res.data);
        setSessionIndex(0);

        // ✅ ONLY START IF CAN PLAY
        const data = getTodayData();
        const remaining = MAX_DAILY_PLAYS - data.count;

        if (remaining > 0) {
          setCanPlay(true);
          startNewRound();
        } else {
          setCanPlay(false);
          setNotification("🚫 Daily limit reached");
          setTimeout(() => setNotification(null), 3000);
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
  }, []);

  const startNewRound = () => {
    const data = getTodayData();
    const remaining = MAX_DAILY_PLAYS - data.count;

    if (remaining <= 0) {
      setCanPlay(false);
      setIsBlurred(true); // keep overlay
      setCountdown(0);

      setNotification("🚫 No plays left today");
      setTimeout(() => setNotification(null), 3000);

      return;
    }

    // ✅ increment usage
    data.count += 1;
    localStorage.setItem("rankGameUsage", JSON.stringify(data));

    const newRemaining = MAX_DAILY_PLAYS - data.count;

    setPlaysLeft(newRemaining);
    setCanPlay(newRemaining > 0);
    setNotification(`🎮 New Round! Plays left: ${newRemaining}`);
    setTimeout(() => setNotification(null), 2500);

    clearInterval(countdownRef.current);
    clearInterval(timerRef.current);

    setIsBlurred(true);
    setCountdown(3);
    setTimeLeft(180);
    setShowConfetti(false);

    let counter = 3;
    countdownRef.current = setInterval(() => {
      counter--;
      setCountdown(counter);
      if (counter <= 0) {
        clearInterval(countdownRef.current);
        setIsBlurred(false);
      }
    }, 1000);
  };

  useEffect(() => {
    if (!canPlay) return;
    if (!sessionLocations.length) return;
    if (!isBlurred) return;

    startNewRound();
  }, [sessionIndex, canPlay, sessionLocations]);

  useEffect(() => {
    clearInterval(timerRef.current);

    if (!isBlurred && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerRef.current);
    } else if (!isBlurred && timeLeft === 0) {
      if (current && !result) {
        handleSubmit();
      }
    }
  }, [isBlurred, timeLeft, current, result]);

  const [sending, setSending] = useState(false);

  const sendMessage = async () => {
    if (!current) return;
    if (!chatInput.trim() || chatCount >= 10) return;
    if (sending) return; // prevent duplicate sends

    setSending(true);
    const userMsg = { role: "user", text: chatInput.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput(""); // clear input immediately
    setChatCount((prev) => prev + 1);
    setLoadingReply(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/chat`,
        { message: userMsg.text, locationId: current.id },
      );

      const botMsg = { role: "bot", text: res.data.reply || "No reply" };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.warn("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Failed to connect to Gemini API." },
      ]);
    } finally {
      setLoadingReply(false);
      setSending(false);
    }
  };

  const handleSubmit = async () => {
    if (!current) return;

    try {
      const checkResp = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/heritage/check`,
        {
          answer: heritage,
          locationId: current.id,
        },
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
          {
            locationId: current.id,
            score: total,
            nameScore,
            ageScore,
            difficulty: current.difficulty || 1,
          },
          { withCredentials: true },
        );
      } catch (err) {
        console.warn("failed to record history:", err);
      }

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

      if (user) {
        let rankMessage = null;
        try {
          if (total >= 8) {
            const r = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/player/update-rank`,
              { levelGain, result: "win" },
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

            if ((user.rank || 1) < newRank) {
              rankMessage = `🏅 Rank Up! You are now ${
                rankNames[newRank - 1]
              } (${newRank})`;
            } else if ((user.rank || 1) > newRank) {
              rankMessage = `⬇️ Rank Down to ${
                rankNames[newRank - 1]
              } (${newRank})`;
            }

            setUser({
              ...user,
              level: newLevel,
              rank: newRank,
              rank_progress: newProgress,
            });
          } else if (total <= 4) {
            const r = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/player/update-rank`,
              { levelGain, result: "lose" },
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

            if ((user.rank || 1) < newRank) {
              rankMessage = `🏅 Rank Up! You are now ${
                rankNames[newRank - 1]
              } (${newRank})`;
            } else if ((user.rank || 1) > newRank) {
              rankMessage = `⬇️ Rank Down to ${
                rankNames[newRank - 1]
              } (${newRank})`;
            }

            setUser({
              ...user,
              level: newLevel,
              rank: newRank,
              rank_progress: newProgress,
            });
          } else {
            await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/player/update-level`,
              { levelGain },
              { withCredentials: true },
            );
            const newLevel = (user.level || 0) + levelGain;
            setUser({ ...user, level: newLevel });
          }

          if (rankMessage) {
            setNotification(`${rankMessage} (+${levelGain.toFixed(2)} LV)`);
          } else {
            setNotification(`Level +${levelGain.toFixed(2)}`);
          }
          setTimeout(() => setNotification(null), 3000);
        } catch (err) {
          console.warn("⚠️ Failed to sync rank/level with server:", err);
          const optimisticLevel = (user.level || 0) + levelGain;
          setUser({ ...user, level: optimisticLevel });
          setNotification(`Level +${levelGain.toFixed(2)}`);
          setTimeout(() => setNotification(null), 3000);
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

      if (total === 10) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 7000);
      }
    } catch (err) {
      console.error("Check answer failed:", err);
    }
  };

  // CONTINUE: next location or new 20
  const handleContinue = async () => {
    setHeritage("");
    setAgeGuess(100);
    setResult(null);
    setMessages([]);
    setChatCount(0);

    if (sessionIndex + 1 < sessionLocations.length) {
      setSessionIndex((s) => s + 1);
      return;
    }

    // fetch new 20 random locations
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/locations/random?count=20`,
      );
      setSessionLocations(res.data);
      setSessionIndex(0);
      setNotification("Next 20 locations loaded");
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error("Failed to load next 20 locations:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getFeedback = (score) => {
    if (score <= 5) {
      return {
        title: "❌ Not quite!",
        color: "text-red-400",
        description: "Better luck next time!",
      };
    } else if (score >= 6 && score <= 7) {
      return {
        title: "🟡 You are on the right track!",
        color: "text-yellow-400",
        description: "Almost there, keep going!",
      };
    } else if (score >= 8 && score <= 9) {
      return {
        title: "🔵 You are close!",
        color: "text-blue-400",
        description: "Very good attempt!",
      };
    } else if (score === 10) {
      return {
        title: "🎉 Congratulations!",
        color: "text-green-400",
        description: "Perfect guess!",
      };
    }
  };

  return (
    <LoadScriptNext googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div className="w-full h-screen flex bg-[#0F0B1A] text-white relative">
        {/* 🔥 LIMIT OVERLAY */}

        {!canPlay && (
          <div className="w-full h-screen flex items-center justify-center bg-black text-white z-50000000">
            <div className="text-center">
              <h2 className="text-3xl text-red-400 font-bold mb-4">
                Daily Limit Reached
              </h2>
              <p>You can only play {MAX_DAILY_PLAYS} games per day.</p>
              <p className="text-gray-400 mt-2">Come back tomorrow.</p>
            </div>
          </div>
        )}

        {notification && (
          <div className="absolute top-10 right-10 bg-gradient-to-r from-green-500 to-emerald-400 text-white px-6 py-3 rounded-xl font-bold shadow-lg animate-bounce z-50">
            {notification}
          </div>
        )}

        {showConfetti && (
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={400}
            gravity={1}
          />
        )}

        {!finished && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-[#0F0B1A] px-4 py-2 rounded-xl text-white font-bold text-lg z-20">
            ⏳ {Math.floor(timeLeft / 60)}:
            {String(timeLeft % 60).padStart(2, "0")}
          </div>
        )}

        {isBlurred && !finished && (
          <div className="absolute inset-0 bg-[#0F0B1A] flex items-center justify-center z-50000000">
            <span className="text-6xl font-bold text-white animate-pulse">
              {countdown > 0 ? countdown : ""}
            </span>
          </div>
        )}
        {canPlay && (
          <div className="absolute left-4 text-lg text-gray-300 z-50000000">
            🎮 Plays left: {playsLeft}
          </div>
        )}

        {/* LEFT MAP + GUESS */}
        <div className="flex-1 flex flex-col items-center">
          <div className="relative w-[95%] h-[70vh] mt-6 rounded-2xl overflow-hidden shadow-xl">
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={
                current
                  ? { lat: current.lat, lng: current.lng }
                  : { lat: 0, lng: 0 }
              }
              zoom={14}
              options={{
                disableDefaultUI: true,
                gestureHandling: "none",
                keyboardShortcuts: false,
                linksControl: true,
                clickToGo: true,
              }}
            >
              <StreetViewPanorama
                key={sessionIndex}
                position={
                  current
                    ? { lat: current.lat, lng: current.lng }
                    : { lat: 0, lng: 0 }
                }
                visible={true}
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
                  const randomHeading = Math.floor(Math.random() * 360);
                  pano.setPov({ heading: randomHeading, pitch: 0 });
                  pano.setZoom(1);
                }}
              />
            </GoogleMap>
          </div>

          <div className="w-[95%] bg-[#1D1633] p-6 shadow-inner rounded-xl mt-6 flex flex-col space-y-6">
            {finished ? (
              <div className="text-center text-xl">🎉 You finished all!</div>
            ) : result ? (
              <div className="text-center">
                {(() => {
                  const feedback = getFeedback(result.total);
                  return (
                    <>
                      <h2
                        className={`text-2xl font-bold mb-4 ${feedback.color}`}
                      >
                        {feedback.title}
                      </h2>
                      <p className="mb-2">{feedback.description}</p>
                      <p>
                        Correct:{" "}
                        <span className="font-semibold">
                          {result.correctName}
                        </span>{" "}
                        ({result.correctAge} years old)
                      </p>
                    </>
                  );
                })()}

                <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700 text-left">
                  <div className="text-cyan-300 font-bold text-lg mb-2">
                    Your Score: {result.total}/10
                  </div>
                  <div className="text-sm text-gray-300">
                    <div>
                      <strong>Name:</strong> {result.nameScore}/5 —{" "}
                      {(result.similarity * 100).toFixed(0)}% similarity
                    </div>
                    <div>
                      <strong>Age:</strong> {result.ageScore}/5 — difference of{" "}
                      {result.ageDiff} years
                    </div>
                  </div>
                </div>
                {current.description && (
                  <div className="mt-5 mb-4 p-4 bg-gray-800 text-left text-gray-300 rounded-lg border border-gray-700 shadow-inner">
                    <h3 className="font-bold mb-2 text-cyan-300">
                      About this Heritage:
                    </h3>
                    <p className="whitespace-pre-line">{current.description}</p>
                  </div>
                )}

                <button
                  onClick={handleContinue}
                  className="mt-6 bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 rounded-xl font-bold shadow-lg"
                >
                  Continue
                </button>
              </div>
            ) : (
              <>
                <div>
                  <label className="flex items-center text-sm mb-2">
                    <MapPin size={16} className="mr-2" /> Name of Heritage
                  </label>
                  <input
                    type="text"
                    placeholder="Type your guess..."
                    value={heritage}
                    onChange={(e) => setHeritage(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm mb-2">
                    <Landmark size={16} className="mr-2" /> Years Old (guess)
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="1"
                      max="1000"
                      value={ageGuess}
                      onChange={(e) => setAgeGuess(Number(e.target.value))}
                      className="flex-1 accent-cyan-400"
                    />
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={ageGuess}
                      onChange={(e) => setAgeGuess(Number(e.target.value))}
                      className="w-20 rounded px-2 py-1 bg-gray-800 text-white"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  className="flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 rounded-xl shadow-lg font-bold transition"
                >
                  <CheckCircle className="mr-2" size={18} /> Submit Guess
                </button>
              </>
            )}
          </div>
        </div>

        {/* RIGHT CHAT */}
        <div className="w-[350px] bg-[#1D1633] flex flex-col p-4 border-l border-gray-700">
          <div className="text-sm text-gray-300 mb-2 flex items-center">
            <MessageCircle size={16} className="mr-2" /> AI Assistant
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 mb-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start space-x-2 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "bot" && (
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-cyan-600">
                    <Bot size={18} />
                  </div>
                )}
                <div
                  className={`p-2 rounded-lg max-w-[70%] ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-200"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loadingReply && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-cyan-600">
                  <Bot size={18} />
                </div>
                <div className="flex space-x-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder={
                chatCount >= 10 ? "Limit reached (10/10)" : "Ask Gemini..."
              }
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={chatCount >= 10}
              className="flex-1 px-3 py-2 rounded-lg bg-gray-800 text-white"
            />
            <button
              onClick={sendMessage}
              disabled={chatCount >= 10}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-lg"
            >
              <Send size={18} />
            </button>
          </div>
          <div className="text-xs text-gray-400 mt-2 text-center">
            {chatCount}/10 questions used
          </div>
        </div>
      </div>
    </LoadScriptNext>
  );
}
