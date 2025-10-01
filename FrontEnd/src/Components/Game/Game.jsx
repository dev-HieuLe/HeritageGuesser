import React, { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  StreetViewPanorama,
  LoadScript,
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

export default function Game() {
  const [index, setIndex] = useState(0);
  const [heritage, setHeritage] = useState(""); // name guess
  const [ageGuess, setAgeGuess] = useState(100); // years old guess via slider
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatCount, setChatCount] = useState(0);
  const [locations, setLocations] = useState([]);
  const [result, setResult] = useState(null);
  const [finished, setFinished] = useState(false);
  const [loadingReply, setLoadingReply] = useState(false);

  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingReply]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/locations`
        );
        setLocations(res.data);
      } catch (err) {
        console.error("Error fetching locations", err);
      }
    };
    fetchLocations();
  }, []);

  const sendMessage = async () => {
    if (locations.length === 0) return;
    const current = locations[index];

    if (!chatInput.trim() || chatCount >= 10) return;

    const userMsg = { role: "user", text: chatInput.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatCount((prev) => prev + 1);

    setLoadingReply(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/chat`,
        { message: userMsg.text, locationId: current.id }
      );

      const botMsg = { role: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Failed to connect to Gemini API." },
      ]);
    } finally {
      setLoadingReply(false);
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
        }
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

      setResult({
        total,
        nameScore,
        ageScore,
        similarity,
        ageDiff: diff,
        correctName: current.name,
        correctAge: current.years_old,
      });
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
    } else {
      setFinished(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getFeedback = (score) => {
    if (score < 5) {
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
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div className="w-full h-screen flex bg-[#0F0B1A] text-white">
        {/* LEFT */}
        <div className="flex-1 flex flex-col items-center">
          {/* VR Window */}
          <div className="relative w-[95%] h-[70vh] mt-6 rounded-2xl overflow-hidden shadow-xl">
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={
                locations.length > 0 ? locations[index] : { lat: 0, lng: 0 }
              }
              zoom={14}
              options={{
                disableDefaultUI: true,
                draggable: false,
              }}
            >
              <StreetViewPanorama
                position={
                  locations.length > 0 ? locations[index] : { lat: 0, lng: 0 }
                }
                visible={true}
                options={{
                  pov: { heading: 100, pitch: 0 },
                  zoom: 1,
                  disableDefaultUI: true,
                }}
              />
            </GoogleMap>
          </div>

          {/* Guess Section */}
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

        {/* RIGHT: Chatbot */}
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
    </LoadScript>
  );
}
