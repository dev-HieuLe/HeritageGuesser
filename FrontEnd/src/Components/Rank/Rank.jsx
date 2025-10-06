import React, { useContext } from "react";
import { AuthContext } from "../../Context/authContext";
import { motion } from "framer-motion";
import { Star, User } from "lucide-react";
import { Link } from "react-router-dom";

const rankNames = [
  "Iron", "Bronze", "Silver", "Gold", "Platinum", 
  "Emerald", "Diamond", "Master", "Grandmaster", "Challenger",
];

const rankColors = [
  "bg-gray-500", "bg-orange-700", "bg-gray-300", "bg-yellow-400", 
  "bg-cyan-400", "bg-green-400", "bg-blue-500", "bg-purple-500", 
  "bg-pink-500", "bg-red-500",
];

export default function RankDashboard() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400 text-lg">
        Loading rank data...
      </div>
    );
  }

  const rankIndex = Math.min(user.rank - 1, rankNames.length - 1);
  const rankName = rankNames[rankIndex];
  const rankColor = rankColors[rankIndex];
  const stars = user.rank_progress || 0;
  const progressPercentage = (stars / 5) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-purple-950 text-white px-4 relative">
      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center gap-6 max-w-sm w-full bg-purple-900/70 backdrop-blur-md rounded-2xl shadow-2xl p-8 z-10 relative"
      >
        {/* Rank Badge */}
        <div
          className={`relative w-36 h-36 flex items-center justify-center rounded-full shadow-lg ${rankColor}`}
        >
          <span className="text-xl font-semibold tracking-wider">{rankName}</span>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-2">
          {Array(5).fill(0).map((_, i) => (
            <Star
              key={i}
              size={28}
              className={`${
                i < stars
                  ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.7)]"
                  : "text-gray-700"
              } transition-all`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-purple-800 rounded-full overflow-hidden relative">
          <div
            className="absolute top-0 left-0 h-full rounded-full overflow-hidden"
            style={{ width: `${progressPercentage}%` }}
          >
            <motion.div
              className="h-full w-full rounded-full"
              style={{
                backgroundImage: "linear-gradient(90deg, #7c3aed, #22d3ee, #7c3aed)",
                backgroundSize: "200% 100%",
                filter: "brightness(1.5) blur(1px)",
              }}
              animate={{ backgroundPositionX: ["0%", "200%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>

        {/* Player Info */}
        <div className="text-center mt-4">
          <div className="flex items-center justify-center gap-2">
            <User size={20} className="text-purple-200" />
            <h1 className="text-lg font-semibold">{user.name}</h1>
          </div>
          <p className="text-sm text-purple-300 mt-1">
            Rank {user.rank} — {rankName}
          </p>
        </div>
      </motion.div>

      {/* Rank Now Button outside the blur box */}
      <motion.div
        className="mt-8 z-20"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Link
          to="/game/rank"
          className="px-10 py-3 bg-gradient-to-r from-purple-600 to-cyan-400 rounded-full text-white font-bold shadow-2xl hover:scale-105 transition-transform hover:shadow-pink-500/50"
        >
          Rank Now
        </Link>
      </motion.div>
    </div>
  );
}
