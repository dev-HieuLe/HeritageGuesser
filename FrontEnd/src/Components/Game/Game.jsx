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

export default function Game() {
  const [index, setIndex] = useState(0);
  const [heritage, setHeritage] = useState("");
  const [ageGuess, setAgeGuess] = useState(100);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatCount, setChatCount] = useState(0);
  const [locations, setLocations] = useState([]);
  const [result, setResult] = useState(null);
  const [finished, setFinished] = useState(false);
  const [loadingReply, setLoadingReply] = useState(false);

  // 🔒 Anti-abuse states
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

  // 🔥 DAILY LIMIT SYSTEM
  const MAX_DAILY_PLAYS = 5;
  const [canPlay, setCanPlay] = useState(true);
  const [playsLeft, setPlaysLeft] = useState(MAX_DAILY_PLAYS);

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

  const increaseUsage = () => {
    const data = getTodayData();
    data.count += 1;

    localStorage.setItem("gameUsage", JSON.stringify(data));

    const remaining = MAX_DAILY_PLAYS - data.count;

    setPlaysLeft(remaining);
    setCanPlay(remaining > 0);

    setNotification(`🎮 Plays left: ${remaining}`);
    setTimeout(() => setNotification(null), 2500);
  };

  const { user, setUser } = useContext(AuthContext);

  const messagesEndRef = useRef(null);
  const { width, height } = useWindowSize();

  // ✅ INIT LIMIT ON LOAD (FIXES REFRESH BYPASS)
  useEffect(() => {
    updateLimitState();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingReply]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/locations`,
        );
        setLocations(res.data);
      } catch (err) {
        console.error("Error fetching locations", err);
      }
    };
    fetchLocations();
  }, []);

  const startNewRound = () => {
    console.log("🚀 startNewRound ENTERED");
    const data = getTodayData();
    console.log("🎯 BEFORE increment:", data.count);

    const remaining = MAX_DAILY_PLAYS - data.count;

    if (remaining <= 0) {
      setCanPlay(false);
      return;
    }

    // ✅ SAFE increment
    data.count += 1;
    localStorage.setItem("gameUsage", JSON.stringify(data));

    console.log("✅ AFTER increment:", data.count);

    const newRemaining = MAX_DAILY_PLAYS - data.count;
    console.log("🎮 Remaining:", newRemaining);

    setPlaysLeft(newRemaining);
    setCanPlay(newRemaining > 0);

    setNotification(`🎮 Plays left: ${newRemaining}`);
    setTimeout(() => setNotification(null), 2500);

    setIsBlurred(true);
    setCountdown(3);
    setTimeLeft(180);
    setShowConfetti(false);

    let counter = 3;
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
    if (locations.length > 0 && canPlay) {
      startNewRound();
    }
  }, [index, locations, canPlay]);

  useEffect(() => {
    if (!isBlurred && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [isBlurred, timeLeft]);

  // 🔒 SAFE CHAT FUNCTION
  const sendMessage = async () => {
    if (locations.length === 0) return;
    const current = locations[index];

    if (!chatInput.trim() || chatCount >= 10) return;

    if (sessionMessages >= MAX_SESSION_MESSAGES) {
      alert("Session limit reached.");
      return;
    }

    const now = Date.now();
    if (now - lastSentTime < COOLDOWN) return;
    if (isSending) return;

    setIsSending(true);
    setLastSentTime(now);

    const userMsg = { role: "user", text: chatInput.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatCount((prev) => prev + 1);
    setSessionMessages((prev) => prev + 1);
    setLoadingReply(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/chat`,
        {
          message: userMsg.text,
          locationId: current.id,
        },
        {
          withCredentials: true,
        },
      );

      const botMsg = { role: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Failed to connect to server." },
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
        {
          answer: heritage,
          locationId: current.id,
        },
        { withCredentials: true },
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
        const newLevel = (user.level || 0) + levelGain;
        setUser({ ...user, level: newLevel });

        try {
          await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/player/update-level`,
            { levelGain },
            { withCredentials: true },
          );
        } catch {}

        setNotification(`Level +${levelGain.toFixed(2)}`);
        setTimeout(() => setNotification(null), 3000);
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

  const handleContinue = () => {
    if (index + 1 < locations.length) {
      setIndex((s) => s + 1);
      setHeritage("");
      setAgeGuess(100);
      setResult(null);
      setMessages([]);
      setChatCount(0);
      setSessionMessages(0);

      updateLimitState(); // ✅ re-check limit before next round
    } else {
      setFinished(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isSending) sendMessage();
    }
  };

  return (
    <LoadScriptNext googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div className="w-full h-screen flex bg-[#0F0B1A] text-white relative">
        {/* 🔥 LIMIT OVERLAY */}
        {!canPlay && (
          <div className="absolute inset-0 bg-black z-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-3xl text-red-400 font-bold mb-4">
                Daily Limit Reached
              </h2>
              <p>You can only play {MAX_DAILY_PLAYS} games per day.</p>
              <p className="text-gray-400 mt-2">Come back tomorrow.</p>
            </div>
          </div>
        )}

        {/* ✅ Plays left indicator */}
        {canPlay && (
          <div className="absolute top-4 left-4 text-sm text-gray-300">
            🎮 Plays left: {playsLeft}
          </div>
        )}

        {notification && (
          <div className="absolute top-10 right-10 bg-green-500 px-6 py-3 rounded-xl font-bold z-50">
            {notification}
          </div>
        )}

        {showConfetti && (
          <Confetti width={width} height={height} recycle={false} />
        )}

        {!finished && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            ⏳ {Math.floor(timeLeft / 60)}:
            {String(timeLeft % 60).padStart(2, "0")}
          </div>
        )}

        {isBlurred && !finished && (
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <span className="text-6xl">{countdown > 0 ? countdown : ""}</span>
          </div>
        )}

        <div className="flex-1 flex flex-col items-center">
          <div className="w-[95%] h-[70vh] mt-6 rounded-2xl overflow-hidden">
            {canPlay && (
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={
                  locations.length > 0 ? locations[index] : { lat: 0, lng: 0 }
                }
                zoom={14}
                options={{ disableDefaultUI: true }}
              >
                {locations.length > 0 && !isBlurred && (
                  <StreetViewPanorama
                    key={index}
                    position={locations[index]}
                    visible={true}
                  />
                )}
              </GoogleMap>
            )}
          </div>
        </div>

        <div className="w-[350px] bg-[#1D1633] flex flex-col p-4">
          <div className="flex-1 overflow-y-auto">
            {messages.map((msg, i) => (
              <div key={i}>{msg.text}</div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={chatCount >= 10 || isSending}
            className="bg-gray-800 p-2"
          />

          <button onClick={sendMessage} disabled={chatCount >= 10 || isSending}>
            Send
          </button>

          {Date.now() - lastSentTime < COOLDOWN && (
            <div className="text-yellow-400 text-xs text-center">
              Slow down...
            </div>
          )}
        </div>
      </div>
    </LoadScriptNext>
  );
}
