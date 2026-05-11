import { useContext, useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../Context/authContext";
import { useLang } from "../Context/languageContext";
import t from "../translations";

const LANGS = [
  { code: "en", label: "English", short: "EN" },
  { code: "vi", label: "Tiếng Việt", short: "VI" },
  { code: "cn", label: "中文", short: "CN" },
  { code: "fr", label: "Français", short: "FR" },
  { code: "ko", label: "한국어", short: "KO" },
];

export default function Navbar({ onMenuClick }) {
  const { auth, logout } = useContext(AuthContext);
  const { lang, changeLang } = useLang();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const tx = t[lang];
  const location = useLocation();

  const navLinks = [
    { label: tx.nav.home, to: "/" },
    { label: tx.nav.about, to: "/about" },
    { label: tx.nav.atlas, to: "/explore" },
    { label: tx.nav.leaderboard, to: "/leaderboard" },
    { label: tx.nav.study, to: "/study" },
    { label: tx.nav.contribute, to: "/contribute" },
    { label: tx.nav.shop, to: "/shop" },
    { label: tx.nav.tutorial, to: "/tutorial" },
    { label: tx.nav.members, to: "/subscription" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-5 sm:px-10 py-4 sm:py-5"
      style={{
        background: "rgba(14,21,19,0.60)",
        backdropFilter: "blur(32px)",
        WebkitBackdropFilter: "blur(32px)",
        boxShadow:
          "0 8px 40px rgba(0,0,0,0.35), inset 0 -1px 0 rgba(162,209,187,0.08)",
      }}
    >
      {/* Left: Hamburger + Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="bg-transparent border-none cursor-pointer text-[#a2d1bb] p-[6px] flex items-center rounded-lg transition-colors duration-150 hover:bg-white/[0.08]"
          aria-label="Toggle sidebar"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "26px" }}
          >
            menu
          </span>
        </button>
        <Link to="/" style={{ textDecoration: "none" }}>
          <span
            className="text-[17px] sm:text-[22px]"
            style={{
              color: "#e9c349",
              fontWeight: "800",
              letterSpacing: "-0.04em",
              userSelect: "none",
            }}
          >
            Heritage Guessr
          </span>
        </Link>
      </div>

      {/* Center: Nav links */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-5">
        {navLinks.map((l) => {
          const active = location.pathname === l.to;
          return (
            <Link
              key={l.to}
              to={l.to}
              className={`no-underline pb-1 transition-all duration-150 border-b-2 whitespace-nowrap ${
                active
                  ? "text-[#e9c349] font-semibold border-[#e9c349]"
                  : "text-[#c0c8c3] font-normal border-transparent hover:text-[#e3e3de] hover:border-[rgba(162,209,187,0.3)]"
              }`}
              style={{ fontSize: "14px", letterSpacing: "0.01em" }}
            >
              {l.label}
              {l.badge && (
                <span className="ml-1 text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full align-middle" style={{ backgroundColor: "rgba(162,209,187,0.15)", color: "#a2d1bb", border: "1px solid rgba(162,209,187,0.25)" }}>{l.badge}</span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Right: Points + Language + Auth */}
      <div className="flex items-center gap-2 sm:gap-3">
<div ref={langRef} style={{ position: "relative" }}>
          <button
            onClick={() => setLangOpen((o) => !o)}
            className="bg-transparent border border-[rgba(162,209,187,0.2)] cursor-pointer text-[#a2d1bb] px-3 py-2 flex items-center gap-1.5 rounded-lg font-bold uppercase tracking-widest transition-colors duration-150 hover:bg-white/[0.06] hover:border-[rgba(162,209,187,0.4)]"
            style={{ fontSize: "12px" }}
            aria-label="Select language"
          >
            <span className="material-symbols-outlined hidden sm:inline" style={{ fontSize: "16px" }}>language</span>
            {lang.toUpperCase()}
            <span className="material-symbols-outlined" style={{ fontSize: "14px", transition: "transform 0.15s", transform: langOpen ? "rotate(180deg)" : "rotate(0deg)" }}>expand_more</span>
          </button>
          {langOpen && (
            <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, backgroundColor: "#191d17", border: "1px solid rgba(65,73,68,0.55)", borderRadius: "10px", overflow: "hidden", minWidth: "140px", boxShadow: "0 16px 40px rgba(0,0,0,0.5)", zIndex: 100 }}>
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { changeLang(l.code); setLangOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-100 hover:bg-white/[0.06] bg-transparent border-none cursor-pointer"
                  style={{ color: lang === l.code ? "#a2d1bb" : "rgba(192,200,195,0.7)", fontSize: "13px", fontWeight: lang === l.code ? 700 : 400 }}
                >
                  <span style={{ fontSize: "10px", fontWeight: 900, color: lang === l.code ? "#e9c349" : "rgba(162,209,187,0.35)", minWidth: "22px" }}>{l.short}</span>
                  {l.label}
                  {lang === l.code && <span className="material-symbols-outlined ml-auto" style={{ fontSize: "14px", color: "#a2d1bb" }}>check</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {auth ? (
          <button
            onClick={logout}
            className="bg-transparent border border-[rgba(162,209,187,0.2)] cursor-pointer text-[#a2d1bb] px-4 py-2 flex items-center gap-2 rounded-lg font-semibold transition-colors duration-150 hover:bg-white/[0.06] hover:border-[rgba(162,209,187,0.4)]"
            style={{ fontSize: "13px" }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "18px" }}
            >
              logout
            </span>
            <span className="hidden sm:inline">{tx.nav.logout}</span>
          </button>
        ) : (
          <Link
            to="/login"
            className="border border-[rgba(233,195,73,0.35)] text-[#e9c349] px-4 py-2 flex items-center gap-2 rounded-lg font-semibold no-underline transition-colors duration-150 hover:bg-[rgba(233,195,73,0.08)] hover:border-[rgba(233,195,73,0.7)]"
            style={{ fontSize: "13px" }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "18px" }}
            >
              login
            </span>
            <span className="hidden sm:inline">{tx.nav.signIn}</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
