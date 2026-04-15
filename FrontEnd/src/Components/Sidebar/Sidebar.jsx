import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../Context/authContext";
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

const ease = "all 0.3s cubic-bezier(0.4,0,0.2,1)";

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const location = useLocation();
  const { auth, user } = useContext(AuthContext);
  const { lang } = useLang();
  const tx = t[lang];

  const navItems = [
    { to: "/", label: tx.sidebar.sanctuary, icon: "home" },
    { to: "/rank", label: tx.sidebar.PlayRank, icon: "history_edu" },
    { to: "/leaderboard", label: tx.sidebar.globalRanks, icon: "leaderboard" },
    { to: "/explore", label: tx.sidebar.atlas, icon: "explore" },
    { to: "/study", label: tx.sidebar.academy, icon: "school" },
    { to: "/contribute", label: tx.sidebar.contribute, icon: "add_location_alt" },
    { to: "/tutorial", label: tx.sidebar.tutorial, icon: "help_center" },
  ];

  const rankIndex = user?.rank
    ? Math.min(user.rank - 1, rankNames.length - 1)
    : 0;
  const rankName = rankNames[rankIndex] || "Iron";

  const displayName = auth && user?.name ? user.name : "The Archivist";
  const displaySub =
    auth && user ? tx.sidebar.rankLabel(rankName) : tx.sidebar.imperialScholar;
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <aside
      className={`sidebar-nav${isOpen ? " sidebar-open" : ""} flex flex-col overflow-y-auto overflow-x-hidden`}
      style={{
        width: "256px",
        backgroundColor: "#0e1513",
        boxShadow: "4px 0 24px rgba(0,0,0,0.35)",
        borderRight: "1px solid rgba(65,73,68,0.15)",
      }}
    >
      {/* Mobile close button */}
      <button
        onClick={onClose}
        className="md:hidden absolute top-4 right-4 z-10 bg-transparent border-none cursor-pointer p-1 rounded-lg flex items-center justify-center transition-colors duration-150 hover:bg-white/[0.06]"
        style={{ color: "rgba(162,209,187,0.6)" }}
        aria-label="Close menu"
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: "22px" }}
        >
          close
        </span>
      </button>

      {/* ── User block ── */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#242b29] border border-[rgba(65,73,68,0.3)] flex items-center justify-center shrink-0 overflow-hidden">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={displayName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[13px] font-bold text-[#e9c349] select-none">
                {initials}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <div className="font-black text-[#e9c349] text-[14px] whitespace-nowrap overflow-hidden text-ellipsis">
              {displayName}
            </div>
            <div className="text-[10px] text-[#c0c8c3] uppercase tracking-[0.15em] mt-0.5">
              {displaySub}
            </div>
          </div>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 px-2 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              style={{ transition: ease }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium no-underline mb-1 border-l-4 ${
                isActive
                  ? "text-[#a2d1bb] bg-[#0f3d2e] border-[#e9c349]"
                  : "text-[#c0c8c3] bg-transparent border-transparent hover:bg-white/[0.05] hover:translate-x-1"
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom ── */}
      <div className="p-4">
        <Link
          to="/game"
          onClick={onClose}
          className="block w-full p-3 bg-[rgba(233,195,73,0.1)] border border-[rgba(233,195,73,0.2)] text-[#e9c349] text-[12px] font-black uppercase tracking-[0.15em] text-center no-underline rounded-xl mb-4 transition-colors duration-150 hover:bg-[rgba(233,195,73,0.2)] box-border"
        >
          {tx.sidebar.dailyQuest}
        </Link>

        <div className="border-t border-white/[0.05] pt-3 flex flex-col gap-0.5">
          <Link
            to="/settings"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-[#c0c8c3] text-[12px] font-medium no-underline transition-colors duration-150 hover:bg-white/[0.05]"
          >
            <span className="material-symbols-outlined text-[18px]">
              settings
            </span>
            {tx.sidebar.settings}
          </Link>

          <Link
            to="/tutorial"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-[#c0c8c3] text-[12px] font-medium no-underline transition-colors duration-150 hover:bg-white/[0.05]"
          >
            <span className="material-symbols-outlined text-[18px]">
              contact_support
            </span>
            {tx.sidebar.support}
          </Link>
        </div>
      </div>
    </aside>
  );
}
