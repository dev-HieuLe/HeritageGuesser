import { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/authContext";
import { useLang } from "../../Context/languageContext";
import t from "../../translations";

const INITIAL_VISIBLE = 20;
const MAX_PLAYERS = 100;

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

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [scrollDir, setScrollDir] = useState("down"); // "down" → button scrolls to bottom, "up" → to top
  const { user } = useContext(AuthContext);
  const { lang } = useLang();
  const tx = t[lang];
  const listEndRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/leaderboard`, {
        withCredentials: true,
      })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setPlayers(res.data.slice(0, MAX_PLAYERS));
        }
      })
      .catch((err) => console.error("Leaderboard fetch failed:", err))
      .finally(() => setLoading(false));
  }, []);

  // Flip the scroll button between "go down" and "go up" based on scroll position
  useEffect(() => {
    const onScroll = () => {
      const halfway = (document.documentElement.scrollHeight - window.innerHeight) / 2;
      setScrollDir(window.scrollY > halfway ? "up" : "down");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [showAll, players.length]);

  const handleShowMore = () => {
    setShowAll(true);
    // Scroll the user just past the fold so the new entries are visible
    requestAnimationFrame(() => {
      listEndRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleScrollToggle = () => {
    if (scrollDir === "down") {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div
        className="flex justify-center items-center min-h-screen"
        style={{ backgroundColor: "#12140e", color: "#a2d1bb" }}
      >
        <span className="material-symbols-outlined animate-spin mr-2">
          progress_activity
        </span>
        Loading sages...
      </div>
    );
  }

  const top3 = players.slice(0, 3);

  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);
  const podiumStyles = [
    {
      size: "w-16 h-16 sm:w-24 sm:h-24",
      border: "#a2d1bb",
      badge: "#a2d1bb",
      badgeText: "#073829",
      badgeSize: "w-6 h-6 sm:w-8 sm:h-8",
      crown: false,
      pts: "text-sm sm:text-base",
    },
    {
      size: "w-20 h-20 sm:w-32 sm:h-32",
      border: "#e9c349",
      badge: "#e9c349",
      badgeText: "#3c2f00",
      badgeSize: "w-7 h-7 sm:w-10 sm:h-10",
      crown: true,
      pts: "text-base sm:text-lg",
    },
    {
      size: "w-14 h-14 sm:w-20 sm:h-20",
      border: "#ffb4a9",
      badge: "#ffb4a9",
      badgeText: "#690002",
      badgeSize: "w-5 h-5 sm:w-7 sm:h-7",
      crown: false,
      pts: "text-xs sm:text-sm",
    },
  ];
  const podiumRanks = [2, 1, 3];

  return (
    <div
      className="min-h-screen dong-son-bg"
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
            Global Ranks
          </p>
          <h2
            className="text-2xl font-black tracking-tight"
            style={{ color: "#a2d1bb" }}
          >
            Top 100 Players
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span
            className="material-symbols-outlined"
            style={{
              color: "#e9c349",
              fontSize: "28px",
              fontVariationSettings: "'FILL' 1",
            }}
          >
            workspace_premium
          </span>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-3 sm:px-6 py-10 sm:py-14">
        {/* Podium — Top 3 */}
        {top3.length > 0 && (
          <div className="lb-podium flex items-end justify-center gap-4 sm:gap-10 mb-8 sm:mb-14">
            {podiumOrder.map((player, i) => {
              if (!player) return null;
              const style = podiumStyles[i];
              const rank = podiumRanks[1];
              const isFirst = rank === 1;
              const rankIndex = Math.min(
                (player.rank || 1) - 1,
                rankNames.length - 1,
              );
              const rankName = tx.ranking.rankNames[rankIndex];

              return (
                <div key={player.id} className="flex flex-col items-center">
                  {/* Crown for #1 */}
                  {style.crown && (
                    <span
                      className="material-symbols-outlined mb-2"
                      style={{
                        color: "#e9c349",
                        fontSize: "36px",
                        fontVariationSettings: "'FILL' 1",
                      }}
                    >
                      workspace_premium
                    </span>
                  )}

                  {/* Avatar */}
                  <div className="relative">
                    {/* Glow ring */}
                    <div
                      className="absolute inset-0 rounded-full blur-xl"
                      style={{
                        backgroundColor: style.border,
                        opacity: isFirst ? 0.35 : 0.2,
                      }}
                    />
                    <div
                      className={`relative ${style.size} rounded-full flex items-center justify-center border-4 overflow-hidden`}
                      style={{
                        backgroundColor: "#1e201a",
                        borderColor: style.border,
                      }}
                    >
                      {player.avatar_url ? (
                        <img
                          src={player.avatar_url}
                          alt={player.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span
                          className="material-symbols-outlined"
                          style={{
                            color: style.border,
                            fontSize: isFirst ? "28px" : "22px",
                            fontVariationSettings: "'FILL' 0",
                          }}
                        >
                          account_circle
                        </span>
                      )}
                    </div>

                    {/* Rank badge */}
                    <div
                      className={`absolute -bottom-2 -right-2 ${style.badgeSize} rounded-full flex items-center justify-center font-black shadow-lg`}
                      style={{
                        backgroundColor: style.badge,
                        color: style.badgeText,
                        fontSize: isFirst ? "16px" : "13px",
                      }}
                    >
                      {rank}
                    </div>
                  </div>

                  {/* Name + PTS */}
                  <div className={`mt-${isFirst ? "6" : "4"} text-center`}>
                    <h3
                      className={`font-black tracking-tight ${isFirst ? "text-2xl uppercase" : "text-lg"}`}
                      style={{ color: "#e3e3d9" }}
                    >
                      {player.name}
                    </h3>
                    <p
                      className={`font-bold tracking-widest ${style.pts}`}
                      style={{ color: style.border }}
                    >
                      Lv. {player.level}
                    </p>
                    <p
                      style={{
                        color: "rgba(192,200,195,0.5)",
                        fontSize: "10px",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {rankName}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Table */}
        <div className="space-y-2">
          {/* Column headers */}
          <div
            className="lb-table-header grid px-4 sm:px-8 py-2"
            style={{
              gridTemplateColumns: "48px 1fr 80px 80px",
              fontSize: "10px",
              color: "rgba(192,200,195,0.4)",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
            }}
          >
            <div>{tx.leaderboard.rank}</div>
            <div>{tx.leaderboard.curator}</div>
            <div className="lb-col-tier text-right">{tx.leaderboard.tier}</div>
            <div className="text-right">{tx.leaderboard.level}</div>
          </div>

          {/* All players list */}
          {(showAll ? players : players.slice(0, INITIAL_VISIBLE)).map((p, index) => {
            const rank = index + 1;
            const isUser = user && p.id === user.id;
            const rankIndex = Math.min((p.rank || 1) - 1, rankNames.length - 1);
            const rankName = tx.ranking.rankNames[rankIndex];

            return (
              <div
                key={p.id ?? index}
                className="lb-table-row relative grid items-center px-4 sm:px-8 py-3 sm:py-4 rounded-xl transition-colors"
                style={{
                  gridTemplateColumns: "48px 1fr 80px 80px",
                  backgroundColor: isUser ? "#1e201a" : "#1a1c16",
                  border: isUser
                    ? "2px solid #e9c349"
                    : "1px solid rgba(65,73,68,0.3)",
                  boxShadow: isUser ? "0 0 30px rgba(233,195,73,0.08)" : "none",
                }}
              >
                {/* "You" indicator bar */}
                {isUser && (
                  <div
                    className="absolute -left-0.5 top-1/2 -translate-y-1/2 w-1 h-10 rounded-full"
                    style={{
                      backgroundColor: "#bb0308",
                      boxShadow: "0 0 12px rgba(187,3,8,0.5)",
                    }}
                  />
                )}

                {/* Rank number */}
                <div>
                  <span
                    className="font-black italic"
                    style={{
                      color:
                        rank === 1
                          ? "#e9c349"
                          : rank === 2
                            ? "#a2d1bb"
                            : rank === 3
                              ? "#ffb4a9"
                              : "rgba(192,200,195,0.5)",
                      fontSize: rank <= 3 ? "18px" : "14px",
                    }}
                  >
                    {rank}
                  </span>
                </div>

                {/* Name + avatar */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center border overflow-hidden"
                    style={{
                      backgroundColor: "#292b24",
                      borderColor: isUser
                        ? "rgba(187,3,8,0.4)"
                        : "rgba(65,73,68,0.4)",
                    }}
                  >
                    {p.avatar_url ? (
                      <img
                        src={p.avatar_url}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span
                        className="material-symbols-outlined"
                        style={{
                          color: "rgba(162,209,187,0.4)",
                          fontSize: "20px",
                        }}
                      >
                        account_circle
                      </span>
                    )}
                  </div>
                  <div>
                    <span
                      className="font-bold"
                      style={{
                        color: "#e3e3d9",
                        fontSize: isUser ? "16px" : "14px",
                      }}
                    >
                      {p.name ?? "Player"}
                    </span>
                    {isUser && (
                      <span
                        className="ml-2 px-2 py-0.5 rounded-full font-black uppercase"
                        style={{
                          backgroundColor: "rgba(187,3,8,0.2)",
                          color: "#ffb4a9",
                          fontSize: "9px",
                          letterSpacing: "0.1em",
                        }}
                      >
                        You
                      </span>
                    )}
                  </div>
                </div>

                {/* Rank tier */}
                <div className="lb-col-tier text-right">
                  <span
                    style={{ color: "rgba(192,200,195,0.6)", fontSize: "11px" }}
                  >
                    {rankName}
                  </span>
                </div>

                {/* Level */}
                <div className="text-right">
                  <span
                    className="font-black tracking-wider"
                    style={{ color: "#e9c349" }}
                  >
                    {p.level ?? "-"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sentinel for "Show More" smooth-scroll target */}
        <div ref={listEndRef} />

        {/* Show more / show less */}
        {players.length > INITIAL_VISIBLE && (
          <div className="mt-6 flex justify-center">
            {!showAll ? (
              <button
                type="button"
                onClick={handleShowMore}
                className="flex items-center gap-2 px-6 py-3 rounded-full transition-colors"
                style={{
                  border: "1px solid rgba(162,209,187,0.3)",
                  backgroundColor: "#1a1c16",
                  color: "#a2d1bb",
                  fontSize: "11px",
                  fontWeight: "700",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#1e201a";
                  e.currentTarget.style.borderColor = "rgba(162,209,187,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#1a1c16";
                  e.currentTarget.style.borderColor = "rgba(162,209,187,0.3)";
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                  expand_more
                </span>
                {tx.leaderboard.showMore(players.length - INITIAL_VISIBLE)}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setShowAll(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-full transition-colors"
                style={{
                  border: "1px solid rgba(255,180,169,0.3)",
                  backgroundColor: "#1a1c16",
                  color: "#ffb4a9",
                  fontSize: "11px",
                  fontWeight: "700",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                  expand_less
                </span>
                {tx.leaderboard.showLess}
              </button>
            )}
          </div>
        )}

        {/* Footer summary */}
        {players.length === 0 && (
          <div
            className="text-center py-20"
            style={{ color: "rgba(192,200,195,0.4)" }}
          >
            No sages found in the archive.
          </div>
        )}

        {players.length > 0 && (
          <div className="mt-10 flex justify-center">
            <div
              className="flex items-center gap-2 px-8 py-3 rounded-full"
              style={{
                border: "1px solid rgba(233,195,73,0.2)",
                color: "#e9c349",
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                backgroundColor: "#1e201a",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "16px" }}
              >
                history_edu
              </span>
              {tx.leaderboard.curatorsInArchive(players.length)}
            </div>
          </div>
        )}
      </section>

      {/* ── Floating scroll-to-bottom / scroll-to-top button ── */}
      {players.length > INITIAL_VISIBLE && (
        <button
          type="button"
          onClick={handleScrollToggle}
          className="fixed z-40 flex items-center justify-center rounded-full shadow-lg transition-transform active:scale-95"
          style={{
            bottom: "24px",
            right: "24px",
            width: "48px",
            height: "48px",
            backgroundColor: "#1e201a",
            border: "1px solid rgba(233,195,73,0.4)",
            color: "#e9c349",
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          }}
          aria-label={scrollDir === "down" ? tx.leaderboard.scrollToBottom : tx.leaderboard.scrollToTop}
          title={scrollDir === "down" ? tx.leaderboard.scrollToBottom : tx.leaderboard.scrollToTop}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>
            {scrollDir === "down" ? "keyboard_double_arrow_down" : "keyboard_double_arrow_up"}
          </span>
        </button>
      )}

      {/* Decorative corner element */}
      <div
        className="fixed bottom-0 right-0 p-8 pointer-events-none"
        style={{ opacity: 0.04 }}
      >
        <svg
          width="200"
          height="200"
          viewBox="0 0 400 400"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#e9c349"
            d="M200 0L210.5 140.5L351 151L239.5 239.5L250 380L160.5 289.5L50 300L139.5 210.5L0 200L140.5 189.5L151 49L239.5 160.5L380 150L289.5 239.5L300 350L210.5 260.5L200 400L189.5 259.5L49 249L160.5 160.5L150 20L239.5 110.5L350 100L260.5 189.5L400 200L259.5 210.5L249 351L160.5 239.5L20 250L110.5 160.5L100 50L189.5 139.5L200 0Z"
          />
        </svg>
      </div>
    </div>
  );
}
