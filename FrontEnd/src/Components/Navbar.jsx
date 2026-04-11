import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../Context/authContext";
import { useLang } from "../Context/languageContext";
import t from "../translations";

export default function Navbar({ onMenuClick }) {
  const { auth, logout } = useContext(AuthContext);
  const { lang, toggleLang } = useLang();
  const tx = t[lang];
  const location = useLocation();

  const navLinks = [
    { label: tx.nav.home,        to: "/" },
    { label: tx.nav.explore,     to: "/explore" },
    { label: tx.nav.leaderboard, to: "/leaderboard" },
    { label: tx.nav.rank,        to: "/rank" },
    { label: tx.nav.study,       to: "/study" },
    { label: tx.nav.contribute,  to: "/contribute" },
    { label: tx.nav.tutorial,    to: "/tutorial" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-5 sm:px-10 py-4 sm:py-5"
      style={{
        background: "rgba(14,21,19,0.60)",
        backdropFilter: "blur(32px)",
        WebkitBackdropFilter: "blur(32px)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.35), inset 0 -1px 0 rgba(162,209,187,0.08)",
      }}
    >
      {/* Left: Hamburger + Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="bg-transparent border-none cursor-pointer text-[#a2d1bb] p-[6px] flex items-center rounded-lg transition-colors duration-150 hover:bg-white/[0.08]"
          aria-label="Toggle sidebar"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "26px" }}>menu</span>
        </button>
        <Link to="/" style={{ textDecoration: "none" }}>
          <span
            style={{
              color: "#e9c349",
              fontSize: "22px",
              fontWeight: "800",
              letterSpacing: "-0.04em",
              userSelect: "none",
            }}
          >
            Heritage Guesser
          </span>
        </Link>
      </div>

      {/* Center: Nav links */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-7">
        {navLinks.map((l) => {
          const active = location.pathname === l.to;
          return (
            <Link
              key={l.to}
              to={l.to}
              className={`no-underline pb-1 tracking-wide transition-all duration-150 border-b-2 ${
                active
                  ? "text-[#e9c349] font-semibold border-[#e9c349]"
                  : "text-[#c0c8c3] font-normal border-transparent hover:text-[#e3e3de] hover:border-[rgba(162,209,187,0.3)]"
              }`}
              style={{ fontSize: "15px", letterSpacing: "0.01em" }}
            >
              {l.label}
            </Link>
          );
        })}
      </div>

      {/* Right: Language + Auth */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={toggleLang}
          className="bg-transparent border border-[rgba(162,209,187,0.2)] cursor-pointer text-[#a2d1bb] px-3 py-2 flex items-center gap-1.5 rounded-lg font-bold uppercase tracking-widest transition-colors duration-150 hover:bg-white/[0.06] hover:border-[rgba(162,209,187,0.4)]"
          style={{ fontSize: "12px" }}
          aria-label="Toggle language"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>language</span>
          {lang === "en" ? "VI" : "EN"}
        </button>

        {auth ? (
          <button
            onClick={logout}
            className="bg-transparent border border-[rgba(162,209,187,0.2)] cursor-pointer text-[#a2d1bb] px-4 py-2 flex items-center gap-2 rounded-lg font-semibold transition-colors duration-150 hover:bg-white/[0.06] hover:border-[rgba(162,209,187,0.4)]"
            style={{ fontSize: "13px" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>logout</span>
            <span className="hidden sm:inline">{tx.nav.logout}</span>
          </button>
        ) : (
          <Link
            to="/login"
            className="border border-[rgba(233,195,73,0.35)] text-[#e9c349] px-4 py-2 flex items-center gap-2 rounded-lg font-semibold no-underline transition-colors duration-150 hover:bg-[rgba(233,195,73,0.08)] hover:border-[rgba(233,195,73,0.7)]"
            style={{ fontSize: "13px" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>login</span>
            <span className="hidden sm:inline">{tx.nav.signIn}</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
