import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../Context/authContext";
import { useLang } from "../../Context/languageContext";
import t from "../../translations";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";

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

const rankColors = [
  "#8a938d",
  "#c87941",
  "#c0c8c3",
  "#e9c349",
  "#a2d1bb",
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#ec4899",
  "#bb0308",
];

const rankGlows = [
  "rgba(138,147,141,0.35)",
  "rgba(200,121,65,0.35)",
  "rgba(192,200,195,0.35)",
  "rgba(233,195,73,0.45)",
  "rgba(162,209,187,0.35)",
  "rgba(34,197,94,0.35)",
  "rgba(59,130,246,0.35)",
  "rgba(168,85,247,0.35)",
  "rgba(236,72,153,0.35)",
  "rgba(187,3,8,0.55)",
];

const rankRingGradients = [
  "linear-gradient(135deg, #4b5563, #9ca3af, #e5e7eb, #9ca3af, #4b5563)",
  "linear-gradient(135deg, #78350f, #c87941, #fcd9a0, #c87941, #78350f)",
  "linear-gradient(135deg, #6b7280, #c0c8c3, #f1f5f4, #e2e8e0, #c0c8c3, #6b7280)",
  "linear-gradient(135deg, #92400e, #e9c349, #fef08a, #e9c349, #92400e)",
  "linear-gradient(135deg, #134e4a, #a2d1bb, #d1fae5, #a2d1bb, #134e4a)",
  "linear-gradient(135deg, #14532d, #22c55e, #86efac, #22c55e, #14532d)",
  "linear-gradient(135deg, #1e3a8a, #3b82f6, #93c5fd, #3b82f6, #1e3a8a)",
  "linear-gradient(135deg, #4c1d95, #a855f7, #d8b4fe, #a855f7, #4c1d95)",
  "linear-gradient(135deg, #831843, #ec4899, #f9a8d4, #ec4899, #831843)",
  "linear-gradient(135deg, #7f1d1d, #bb0308, #ef4444, #bb0308, #7f1d1d)",
];

export default function RankDashboard() {
  const { user } = useContext(AuthContext);
  const { lang } = useLang();
  const tx = t[lang];
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/status`)
      .then(r => { if (r.data?.maintenanceMode) setMaintenanceMode(true); })
      .catch(() => {});
  }, []);

  if (maintenanceMode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: "#12140e" }}>
        <span className="material-symbols-outlined mb-4" style={{ color: "#e9c349", fontSize: "64px", fontVariationSettings: "'FILL' 1" }}>construction</span>
        <h2 className="font-black mb-2" style={{ color: "#e3e3d9", fontSize: "28px" }}>Under Maintenance</h2>
        <p style={{ color: "rgba(192,200,195,0.6)", fontSize: "14px", textAlign: "center", maxWidth: "320px" }}>
          The Ranked Archive is temporarily closed for maintenance. Please check back later.
        </p>
        <Link to="/" className="mt-8 px-8 py-3 font-black uppercase tracking-widest" style={{ backgroundColor: "#1e201a", color: "#a2d1bb", border: "1px solid rgba(162,209,187,0.2)", borderRadius: "4px", fontSize: "11px", textDecoration: "none" }}>
          Back to Home
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ backgroundColor: "#12140e", color: "#a2d1bb" }}
      >
        <span className="material-symbols-outlined animate-spin mr-2">
          progress_activity
        </span>
        Loading rank data...
      </div>
    );
  }

  const rankIndex = Math.max(
    0,
    Math.min((user.rank || 1) - 1, rankNames.length - 1),
  );
  const rankName = rankNames[rankIndex];
  const rankColor = rankColors[rankIndex];
  const rankGlow = rankGlows[rankIndex];
  const rankRing = rankRingGradients[rankIndex];
  const stars = user.rank_progress || 0;
  const progressPct = (stars / 5) * 100;

  return (
    <div
      className="min-h-screen dong-son-bg flex flex-col"
      style={{ backgroundColor: "#12140e", color: "#e3e3d9" }}
    >
      {/* Header */}
      <header
        className="flex justify-between items-center px-4 sm:px-10 py-3 sm:py-5 sticky z-30"
        style={{
          backgroundColor: "#12140e",
          borderBottom: "1px solid rgba(65,73,68,0.4)",
        }}
      >
        <div>
          <p
            className="uppercase tracking-widest font-bold"
            style={{ fontSize: "10px", color: "#a2d1bb" }}
          >
            Chronicles
          </p>
          <h2
            className="text-2xl font-black tracking-tight"
            style={{ color: "#a2d1bb" }}
          >
            Your Rank
          </h2>
        </div>

        <Link
          to="/game/rank"
          className="flex items-center gap-2 px-5 py-2.5 font-black uppercase tracking-widest transition-all active:scale-95"
          style={{
            backgroundColor: "#bb0308",
            color: "#ffc8c0",
            borderRadius: "4px",
            fontSize: "11px",
            textDecoration: "none",
            boxShadow: "0 4px 16px rgba(187,3,8,0.3)",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "16px" }}
          >
            play_arrow
          </span>
          Rank Now
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-10 py-10 sm:py-16">
        <div className="w-full max-w-2xl">
          {/* Main rank card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl p-5 sm:p-8 relative overflow-hidden"
            style={{
              backgroundColor: "#1e201a",
              border: `1px solid ${rankColor}30`,
              boxShadow: `0 0 60px ${rankGlow}`,
            }}
          >
            {/* Background glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 50% 0%, ${rankGlow} 0%, transparent 60%)`,
              }}
            />

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Avatar — hero element with rank gradient ring */}
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="relative mb-10"
              >
                {/* Outer ambient glow */}
                <div
                  className="absolute rounded-full blur-3xl pointer-events-none"
                  style={{
                    inset: "-24px",
                    background: rankRing,
                    opacity: 0.35,
                  }}
                />

                {/* Gradient ring */}
                <div
                  className="relative rounded-full p-[5px]"
                  style={{
                    background: rankRing,
                    boxShadow: `0 0 48px ${rankGlow}, 0 0 96px ${rankGlow}`,
                  }}
                >
                  {/* Dark gap between ring and avatar */}
                  <div
                    className="rounded-full p-[3px]"
                    style={{ background: "#12140e" }}
                  >
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        className="w-36 h-36 sm:w-48 sm:h-48 rounded-full object-cover block"
                      />
                    ) : (
                      <div
                        className="w-36 h-36 sm:w-48 sm:h-48 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "#1a1c16" }}
                      >
                        <span
                          className="font-black"
                          style={{ color: rankColor, fontSize: "56px" }}
                        >
                          {user.name.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rank name badge pinned at bottom of ring */}
                <div
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full font-black uppercase tracking-widest whitespace-nowrap"
                  style={{
                    background: rankRing,
                    color: "#12140e",
                    fontSize: "11px",
                    boxShadow: `0 4px 20px ${rankGlow}`,
                  }}
                >
                  {rankName}
                </div>
              </motion.div>

              {/* Player name */}
              <h1
                className="text-3xl font-black uppercase tracking-tight mb-1"
                style={{ color: "#e3e3d9" }}
              >
                {user.name}
              </h1>
              <p
                style={{
                  color: "rgba(192,200,195,0.5)",
                  fontSize: "12px",
                  letterSpacing: "0.1em",
                }}
              >
                RANK {user.rank || 1} — {rankName.toUpperCase()}
              </p>

              {/* Stars */}
              <div className="flex items-center gap-2 my-6">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4 + i * 0.08 }}
                      className="material-symbols-outlined"
                      style={{
                        fontSize: "30px",
                        color: i < stars ? "#e9c349" : "rgba(65,73,68,0.5)",
                        fontVariationSettings:
                          i < stars ? "'FILL' 1" : "'FILL' 0",
                        filter:
                          i < stars
                            ? "drop-shadow(0 0 8px rgba(233,195,73,0.6))"
                            : "none",
                      }}
                    >
                      star
                    </motion.span>
                  ))}
              </div>

              {/* Progress bar */}
              <div className="w-full mb-8">
                <div className="flex justify-between mb-2">
                  <span
                    style={{
                      fontSize: "10px",
                      color: "rgba(192,200,195,0.5)",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {tx.ranking.progressToNextRank}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      color: rankColor,
                      fontWeight: "700",
                    }}
                  >
                    {stars} / 5 stars
                  </span>
                </div>
                <div
                  className="w-full h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: "#292b24" }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${rankColor}80, ${rankColor})`,
                      boxShadow: `0 0 12px ${rankGlow}`,
                    }}
                  />
                </div>
              </div>

              {/* Stats row */}
              <div
                className="w-full grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-6"
                style={{ borderTop: "1px solid rgba(65,73,68,0.4)" }}
              >
                <div className="text-center">
                  <p
                    style={{
                      color: "rgba(192,200,195,0.4)",
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {tx.ranking.rankTier}
                  </p>
                  <p
                    className="font-black text-2xl mt-1"
                    style={{ color: rankColor }}
                  >
                    {user.rank || 1}
                  </p>
                </div>
                <div className="text-center">
                  <p
                    style={{
                      color: "rgba(192,200,195,0.4)",
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {tx.ranking.level}
                  </p>
                  <p
                    className="font-black text-2xl mt-1"
                    style={{ color: "#a2d1bb" }}
                  >
                    {user.level || 0}
                  </p>
                </div>
                <div className="text-center">
                  <p
                    style={{
                      color: "rgba(192,200,195,0.4)",
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {tx.ranking.stars}
                  </p>
                  <p
                    className="font-black text-2xl mt-1"
                    style={{ color: "#e9c349" }}
                  >
                    {stars}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* All ranks reference */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-4 sm:mt-6 rounded-xl p-4 sm:p-5"
            style={{
              backgroundColor: "#1e201a",
              border: "1px solid rgba(65,73,68,0.4)",
            }}
          >
            <p
              className="uppercase tracking-widest font-black mb-3 sm:mb-4"
              style={{ fontSize: "10px", color: "rgba(192,200,195,0.5)" }}
            >
              {tx.ranking.rankLadder}
            </p>
            <div className="grid grid-cols-5 gap-1 sm:gap-2">
              {rankNames.map((_name, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-1.5 py-2 rounded-lg"
                  style={{
                    backgroundColor:
                      i === rankIndex ? `${rankColors[i]}15` : "transparent",
                    border:
                      i === rankIndex
                        ? `1px solid ${rankColors[i]}40`
                        : "1px solid transparent",
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      background:
                        i <= rankIndex
                          ? rankRingGradients[i]
                          : "rgba(65,73,68,0.3)",
                      boxShadow:
                        i === rankIndex ? `0 0 10px ${rankGlows[i]}` : "none",
                      opacity: i > rankIndex ? 0.3 : 1,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "8px",
                      color:
                        i === rankIndex
                          ? rankColors[i]
                          : "rgba(192,200,195,0.35)",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.02em",
                      textAlign: "center",
                    }}
                  >
                    {tx.ranking.rankNames[i]}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
