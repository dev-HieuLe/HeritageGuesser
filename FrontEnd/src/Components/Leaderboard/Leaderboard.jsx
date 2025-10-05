import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { User } from "lucide-react";
import { AuthContext } from "../../Context/authContext";

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/leaderboard`, {
        withCredentials: true,
      })
      .then((res) => {
        if (Array.isArray(res.data)) setPlayers(res.data);
      })
      .catch((err) => console.error("❌ Leaderboard fetch failed:", err));
  }, []);

  const rankColors = {
    1: "from-yellow-400 to-yellow-600",
    2: "from-blue-400 to-blue-600",
    3: "from-green-400 to-green-600",
    default: "from-[#A78BFA] to-[#5B21B6]",
  };

  const rankNumberColors = {
    1: "text-yellow-400",
    2: "text-blue-400",
    3: "text-green-400",
    default: "text-[#A78BFA]/40",
  };

  if (!players.length) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-400">
        Loading leaderboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 font-sans text-white bg-[#120D1D]">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-widest text-[#A78BFA] flex items-center justify-center gap-2">
          🏆 LEADERBOARD 🏆
        </h1>
      </div>

      {/* Table Container */}
      <div className="w-[90%] max-w-6xl border border-[#A78BFA]/30 rounded-lg bg-[#1A1028]/90 shadow-[0_0_25px_rgba(167,139,250,0.2)] overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[220px_1fr_1fr_120px] bg-[#281A3F] py-4 px-8 font-semibold text-sm tracking-wide border-b border-[#A78BFA]/30 uppercase">
          <div className="flex items-center gap-4">
            <span>Rank</span>
          </div>
          <div className="flex items-center justify-center">Name</div>
          <div className="flex items-center justify-center">ID</div>
          <div className="flex items-center justify-center">Matches</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-[#A78BFA]/15">
          {players.map((p, index) => {
            const rank = index + 1;
            const color = rankColors[rank] || rankColors.default;
            const numberColor =
              rankNumberColors[rank] || rankNumberColors.default;
            const isUser = user && p.id === user.id;
            const isChampion = rank === 1;

            const avatarSize = isChampion ? "w-14 h-14" : "w-12 h-12";
            const fontSize = isChampion ? "text-lg" : "text-base";
            const rowSpacing = "py-4";

            return (
              <div
                key={p.id ?? index}
                className={`relative grid grid-cols-[220px_1fr_1fr_120px] items-center ${rowSpacing} px-8 my-2 mx-2 rounded-md transition-all duration-300 ${
                  isUser
                    ? "bg-[#A78BFA]/15 hover:bg-[#A78BFA]/25 border border-[#A78BFA]/40"
                    : "bg-[#221132]/60 hover:bg-[#2C1843]/90 border border-transparent"
                }`}
              >
                {/* Rank + Avatar */}
                <div className="flex items-center gap-4 relative z-20">
                  {/* Rank number — behind but visible */}
                  <span
                    className={`absolute font-extrabold select-none ${numberColor}`}
                    style={{
                      fontSize: isChampion ? "2.3rem" : "1.7rem",
                      left: "-1.6rem", // moved closer so more visible
                      top: "50%",
                      transform: "translateY(-50%)",
                      opacity: isChampion ? 0.6 : 0.45, // more solid
                      textShadow: isChampion
                        ? "0 0 14px rgba(255,255,0,0.65)"
                        : "0 0 10px rgba(0,0,0,0.3)",
                      zIndex: 30, // in front of avatar now
                    }}
                  >
                    #{rank}
                  </span>

                  {/* Avatar (hexagon) */}
                  <div
                    className={`relative ${avatarSize} bg-gradient-to-br ${color} flex-shrink-0 ${
                      isUser ? "ring-2 ring-[#A78BFA]" : ""
                    }`}
                    style={{
                      clipPath:
                        "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)",
                      boxShadow: isChampion
                        ? "0 0 25px rgba(255,255,0,0.25)"
                        : "0 0 10px rgba(167,139,250,0.15)",
                      transition: "transform 0.2s ease",
                      zIndex: 10,
                      transform: "translateX(16px)",
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <User
                        size={isChampion ? 22 : 18}
                        className="text-black/60"
                      />
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div
                  className={`flex items-center justify-center font-medium z-10 ${fontSize}`}
                >
                  {p.name ?? "Player"}
                  {isUser && (
                    <span className="ml-2 text-sm text-[#A78BFA] font-bold">
                      (You)
                    </span>
                  )}
                </div>

                {/* ID */}
                <div className="flex items-center justify-center text-gray-300 text-sm font-mono break-all z-10">
                  {p.id ?? "-"}
                </div>

                {/* Matches */}
                <div className="flex items-center justify-center font-semibold text-[#A78BFA] z-10">
                  {p.matches ?? "-"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
