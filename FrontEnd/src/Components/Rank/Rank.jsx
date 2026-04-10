import { useContext } from "react";
import { AuthContext } from "../../Context/authContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const rankNames = [
  "Iron", "Bronze", "Silver", "Gold", "Platinum",
  "Emerald", "Diamond", "Master", "Grandmaster", "Challenger",
];

const rankColors = [
  "#8a938d", "#c87941", "#c0c8c3", "#e9c349",
  "#a2d1bb", "#22c55e", "#3b82f6", "#a855f7",
  "#ec4899", "#bb0308",
];

const rankGlows = [
  "rgba(138,147,141,0.3)", "rgba(200,121,65,0.3)", "rgba(192,200,195,0.3)", "rgba(233,195,73,0.4)",
  "rgba(162,209,187,0.3)", "rgba(34,197,94,0.3)", "rgba(59,130,246,0.3)", "rgba(168,85,247,0.3)",
  "rgba(236,72,153,0.3)", "rgba(187,3,8,0.5)",
];

export default function RankDashboard() {
  const { user } = useContext(AuthContext);

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

  const rankIndex = Math.max(0, Math.min((user.rank || 1) - 1, rankNames.length - 1));
  const rankName = rankNames[rankIndex];
  const rankColor = rankColors[rankIndex];
  const rankGlow = rankGlows[rankIndex];
  const stars = user.rank_progress || 0;
  const progressPct = (stars / 5) * 100;

  return (
    <div
      className="min-h-screen dong-son-bg flex flex-col"
      style={{ backgroundColor: "#12140e", color: "#e3e3d9" }}
    >
      {/* Header */}
      <header
        className="flex justify-between items-center px-4 sm:px-10 py-3 sm:py-5 sticky top-16 sm:top-[73px] z-30"
        style={{
          backgroundColor: "#12140e",
          borderBottom: "1px solid rgba(65,73,68,0.4)",
        }}
      >
        <div>
          <p className="uppercase tracking-widest font-bold" style={{ fontSize: "10px", color: "#a2d1bb" }}>
            Chronicles
          </p>
          <h2 className="text-2xl font-black tracking-tight" style={{ color: "#a2d1bb" }}>
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
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
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
              {/* Rank badge */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative mb-6"
              >
                <div
                  className="absolute inset-0 rounded-full blur-2xl"
                  style={{ backgroundColor: rankGlow, transform: "scale(1.5)" }}
                />
                <div
                  className="relative w-24 h-24 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center font-black"
                  style={{
                    border: `4px solid ${rankColor}`,
                    backgroundColor: "#12140e",
                    boxShadow: `0 0 40px ${rankGlow}, inset 0 0 20px ${rankColor}10`,
                  }}
                >
                  <span
                    className="material-symbols-outlined mb-1"
                    style={{ color: rankColor, fontSize: "26px", fontVariationSettings: "'FILL' 1" }}
                  >
                    military_tech
                  </span>
                  <span
                    className="uppercase tracking-widest font-black"
                    style={{ color: rankColor, fontSize: "9px" }}
                  >
                    {rankName}
                  </span>
                </div>
              </motion.div>

              {/* Player name */}
              <h1
                className="text-3xl font-black uppercase tracking-tight mb-1"
                style={{ color: "#e3e3d9" }}
              >
                {user.name}
              </h1>
              <p style={{ color: "rgba(192,200,195,0.5)", fontSize: "12px", letterSpacing: "0.1em" }}>
                RANK {user.rank || 1} — {rankName.toUpperCase()}
              </p>

              {/* Stars */}
              <div className="flex items-center gap-2 my-6">
                {Array(5).fill(0).map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "30px",
                      color: i < stars ? "#e9c349" : "rgba(65,73,68,0.5)",
                      fontVariationSettings: i < stars ? "'FILL' 1" : "'FILL' 0",
                      filter: i < stars ? "drop-shadow(0 0 8px rgba(233,195,73,0.6))" : "none",
                    }}
                  >
                    star
                  </motion.span>
                ))}
              </div>

              {/* Progress bar */}
              <div className="w-full mb-8">
                <div className="flex justify-between mb-2">
                  <span style={{ fontSize: "10px", color: "rgba(192,200,195,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Progress to next rank
                  </span>
                  <span style={{ fontSize: "10px", color: rankColor, fontWeight: "700" }}>
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
                  <p style={{ color: "rgba(192,200,195,0.4)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Rank Tier
                  </p>
                  <p className="font-black text-2xl mt-1" style={{ color: rankColor }}>
                    {user.rank || 1}
                  </p>
                </div>
                <div className="text-center">
                  <p style={{ color: "rgba(192,200,195,0.4)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Level
                  </p>
                  <p className="font-black text-2xl mt-1" style={{ color: "#a2d1bb" }}>
                    {user.level || 0}
                  </p>
                </div>
                <div className="text-center">
                  <p style={{ color: "rgba(192,200,195,0.4)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Stars
                  </p>
                  <p className="font-black text-2xl mt-1" style={{ color: "#e9c349" }}>
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
            style={{ backgroundColor: "#1e201a", border: "1px solid rgba(65,73,68,0.4)" }}
          >
            <p
              className="uppercase tracking-widest font-black mb-3 sm:mb-4"
              style={{ fontSize: "10px", color: "rgba(192,200,195,0.5)" }}
            >
              Rank Ladder
            </p>
            <div className="grid grid-cols-5 gap-1 sm:gap-2">
              {rankNames.map((name, i) => (
                <div
                  key={name}
                  className="flex flex-col items-center gap-1 py-2 rounded-lg"
                  style={{
                    backgroundColor: i === rankIndex ? `${rankColors[i]}15` : "transparent",
                    border: i === rankIndex ? `1px solid ${rankColors[i]}30` : "1px solid transparent",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "18px",
                      color: rankColors[i],
                      fontVariationSettings: i === rankIndex ? "'FILL' 1" : "'FILL' 0",
                      opacity: i > rankIndex ? 0.35 : 1,
                    }}
                  >
                    military_tech
                  </span>
                  <span
                    style={{
                      fontSize: "8px",
                      color: i === rankIndex ? rankColors[i] : "rgba(192,200,195,0.35)",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.02em",
                      textAlign: "center",
                    }}
                  >
                    {name}
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
