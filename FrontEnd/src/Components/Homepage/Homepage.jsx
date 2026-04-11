import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/authContext";
import { useLang } from "../../Context/languageContext";
import t from "../../translations";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

const slideLeft = {
  hidden: { opacity: 0, x: -60 },
  show: { opacity: 1, x: 0, transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] } },
};

const slideRight = {
  hidden: { opacity: 0, x: 60 },
  show: { opacity: 1, x: 0, transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.05 } },
};

const SIDEBAR_W = 256;

export default function Homepage() {
  const { auth, user, logout, loading } = useContext(AuthContext);
  const { lang, toggleLang } = useLang();
  const tx = t[lang];

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [topPlayers, setTopPlayers] = useState([]);

  const NAV_ITEMS = [
    { to: "/", label: tx.sidebar.sanctuary, icon: "home" },
    { to: "/rank", label: tx.sidebar.PlayRank, icon: "history_edu" },
    { to: "/leaderboard", label: tx.sidebar.globalRanks, icon: "leaderboard" },
    { to: "/explore", label: tx.sidebar.atlas, icon: "explore" },
    { to: "/study", label: tx.sidebar.academy, icon: "school" },
    { to: "/contribute", label: tx.sidebar.contribute, icon: "add_location_alt" },
    { to: "/tutorial", label: tx.sidebar.tutorial, icon: "help_center" },
  ];

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/leaderboard`, {
        withCredentials: true,
      })
      .then((res) => setTopPlayers((res.data || []).slice(0, 2)))
      .catch(() => {});
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0e1513] text-[#a2d1bb]">
        <span className="material-symbols-outlined animate-spin mr-2">
          progress_activity
        </span>
        {tx.loading}
      </div>
    );
  }

  const displayName = auth && user?.name ? user.name : "The Archivist";
  const displaySub =
    auth && user ? ` Level ${user.level ?? 0}` : tx.sidebar.imperialScholar;
  const initials = displayName.slice(0, 2).toUpperCase();

  const ease = "all 0.3s cubic-bezier(0.4,0,0.2,1)";
  const ml = sidebarOpen ? `${SIDEBAR_W}px` : "0px";

  const scholars =
    topPlayers.length > 0
      ? topPlayers.map((p, i) => ({
          rank: String(i + 1).padStart(2, "0"),
          initials: (p.name || "??").slice(0, 2).toUpperCase(),
          name: p.name || "—",
          score: ((p.level || 0) * 48 + 1200).toLocaleString(),
          gold: i === 0,
        }))
      : [
          {
            rank: "01",
            initials: "TH",
            name: "Thanh_Huy",
            score: "48,200",
            gold: true,
          },
          {
            rank: "02",
            initials: "ML",
            name: "Minh_Lan",
            score: "45,150",
            gold: false,
          },
        ];

  return (
    <div className="bg-[#0e1513] text-[#dde4e0] min-h-screen">
      {/* ══ TOP NAV ══ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-5 sm:px-10 py-4 sm:py-5"
        style={{
          background: "rgba(14,21,19,0.60)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.35), inset 0 -1px 0 rgba(162,209,187,0.08)",
        }}
      >
        <div className="flex items-center gap-4">
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="bg-transparent border-none cursor-pointer text-[#a2d1bb] p-[6px] flex items-center rounded-lg transition-colors duration-150 hover:bg-white/[0.08]"
            aria-label="Toggle sidebar"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "26px" }}>menu</span>
          </button>

          {/* Logo */}
          <span
            className="select-none"
            style={{ color: "#e9c349", fontSize: "22px", fontWeight: "800", letterSpacing: "-0.04em" }}
          >
            Heritage Guesser
          </span>
        </div>

        {/* Nav links — centered, desktop only */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-7">
          {[
            { label: tx.nav.home,        to: "/",             active: true  },
            { label: tx.nav.explore,     to: "/explore",      active: false },
            { label: tx.nav.leaderboard, to: "/leaderboard",  active: false },
            { label: tx.nav.rank,        to: "/rank",         active: false },
            { label: tx.nav.study,       to: "/study",        active: false },
            { label: tx.nav.contribute,  to: "/contribute",   active: false },
            { label: tx.nav.tutorial,    to: "/tutorial",     active: false },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              style={{ fontSize: "15px", letterSpacing: "0.01em" }}
              className={`no-underline pb-1 tracking-wide transition-all duration-150 border-b-2 ${
                l.active
                  ? "text-[#e9c349] font-semibold border-[#e9c349]"
                  : "text-[#c0c8c3] font-normal border-transparent hover:text-[#e3e3de] hover:border-[rgba(162,209,187,0.3)]"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="bg-transparent border border-[rgba(162,209,187,0.2)] cursor-pointer text-[#a2d1bb] px-3 py-2 flex items-center gap-1.5 rounded-lg font-bold uppercase tracking-widest transition-colors duration-150 hover:bg-white/[0.06] hover:border-[rgba(162,209,187,0.4)]"
            style={{ fontSize: "12px" }}
            aria-label="Toggle language"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
              language
            </span>
            {lang === "en" ? "VI" : "EN"}
          </button>

          {/* Auth button */}
          {auth ? (
            <button
              onClick={logout}
              className="bg-transparent border border-[rgba(162,209,187,0.2)] cursor-pointer text-[#a2d1bb] px-4 py-2 flex items-center gap-2 rounded-lg font-semibold transition-colors duration-150 hover:bg-white/[0.06] hover:border-[rgba(162,209,187,0.4)]"
              style={{ fontSize: "13px" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
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
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]">
                login
              </span>
              <span className="hidden sm:inline">{tx.nav.signIn}</span>
            </Link>
          )}
        </div>
      </nav>

      {/* ══ SIDEBAR ══ */}
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        style={{
          transform: sidebarOpen
            ? "translateX(0)"
            : `translateX(-${SIDEBAR_W}px)`,
          transition: ease,
        }}
        className="fixed left-0 top-0 h-full z-40 w-64 bg-[#0e1513] border-r border-white/[0.05] flex flex-col pt-16 sm:pt-20 overflow-y-auto overflow-x-hidden"
      >
        {/* User block */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#242b29] border border-[rgba(65,73,68,0.3)] flex items-center justify-center shrink-0">
              <span className="text-[13px] font-bold text-[#e9c349] select-none">
                {initials}
              </span>
            </div>
            <div className="min-w-0">
              <div className="font-black text-[#e9c349] text-[14px] whitespace-nowrap overflow-hidden text-ellipsis">
                {displayName}
              </div>
              <div className="text-[10px] text-[#c0c8c3] uppercase tracking-[0.15em]">
                {displaySub}
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2">
          {NAV_ITEMS.map((item, i) => {
            const isActive = i === 0;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
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

        {/* Bottom */}
        <div className="p-4">
          <Link
            to="/game"
            onClick={() => setSidebarOpen(false)}
            className="block w-full p-3 bg-[rgba(233,195,73,0.1)] border border-[rgba(233,195,73,0.2)] text-[#e9c349] text-[12px] font-black uppercase tracking-[0.15em] text-center no-underline rounded-xl mb-6 transition-colors duration-150 hover:bg-[rgba(233,195,73,0.2)] box-border"
          >
            {tx.sidebar.dailyQuest}
          </Link>

          <div className="border-t border-white/[0.05] pt-3 flex flex-col gap-1">
            {[
              { label: tx.sidebar.settings, icon: "settings", to: "/tutorial" },
              {
                label: tx.sidebar.support,
                icon: "contact_support",
                to: "/tutorial",
              },
            ].map((l) => (
              <Link
                key={l.label}
                to={l.to}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-2 rounded-xl text-[#c0c8c3] text-[12px] font-medium no-underline transition-colors duration-150 hover:bg-white/[0.05]"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {l.icon}
                </span>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* ══ SCROLLABLE CONTENT ══ */}
      <div
        className="pt-14 sm:pt-16"
        style={{ marginLeft: ml, transition: ease }}
      >
        {/* ─── HERO ─── */}
        <section className="relative pt-10 pb-10 sm:pt-12 sm:pb-12 px-5 sm:px-8 md:pl-20 lg:pl-24 min-h-[520px] sm:min-h-[700px] md:min-h-[870px] flex items-center">
          <div className="absolute inset-0 overflow-hidden z-0">
            <div
              className="absolute inset-0 z-10"
              style={{
                background:
                  "linear-gradient(to right, #0e1513, rgba(14,21,19,0.4), transparent)",
              }}
            />
            <div
              className="absolute inset-0 z-10"
              style={{
                background: "linear-gradient(to top, #0e1513, transparent)",
              }}
            />
            <img
              src="/banner.png"
              alt="Vietnam Heritage"
              className="w-full h-full object-cover scale-105"
            />
          </div>

          <div className="relative z-20 max-w-3xl w-full">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[rgba(15,61,46,0.3)] border border-[rgba(162,209,187,0.2)] mb-4 sm:mb-6 backdrop-blur-[12px]">
              <span className="w-2 h-2 rounded-full bg-[#e9c349] mr-2 inline-block" />
              <span className="text-[10px] sm:text-[11px] font-bold text-[#a2d1bb] uppercase tracking-[0.2em]">
                {tx.hero.badge}
              </span>
            </div>

            <h1
              className="font-black text-[#e3e3de] mb-4 sm:mb-6 leading-none tracking-[-0.03em]"
              style={{ fontSize: "clamp(36px, 7vw, 96px)" }}
            >
              {tx.hero.headline1}{" "}
              <span className="text-[#e9c349] italic">{tx.hero.headline2}</span>{" "}
              {tx.hero.headline3}
            </h1>

            <p className="text-[15px] sm:text-[18px] md:text-[20px] text-[#c0c8c3] mb-7 sm:mb-10 max-w-[560px] leading-relaxed">
              {tx.hero.body}
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Link
                to="/rank"
                style={{
                  background: "linear-gradient(135deg, #e9c349, #f0d060)",
                  transition: ease,
                  boxShadow: "0 10px 30px rgba(233,195,73,0.35)",
                }}
                className="px-5 sm:px-8 py-3 sm:py-4 text-[#2a1f00] font-black rounded-xl flex items-center gap-2 no-underline text-[13px] sm:text-[14px] hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(233,195,73,0.55)] hover:brightness-110 active:translate-y-0"
              >
                {tx.hero.startGuessing}
                <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
                  explore
                </span>
              </Link>
              <Link
                to="/explore"
                style={{ transition: ease }}
                className="px-5 sm:px-8 py-3 sm:py-4 bg-[rgba(36,43,41,0.5)] backdrop-blur-[24px] border border-[rgba(65,73,68,0.3)] text-[#dde4e0] font-semibold rounded-xl flex items-center gap-2 no-underline text-[13px] sm:text-[14px] hover:bg-[rgba(47,54,52,0.7)]"
              >
                {tx.hero.viewMap}
                <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
                  map
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ─── BENTO ─── */}
        <section className="px-4 sm:px-8 pb-10 sm:pb-16">
          {/* Mobile: stack cards; Tablet+: 3-col grid */}
          <div className="max-w-6xl mx-auto">
          <motion.div
            className="flex flex-col sm:grid sm:gap-6"
            style={{ gridTemplateColumns: "1fr 3fr 2fr" }}
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
          >
            {/* Live Now */}
            <motion.div variants={fadeUp} className="mb-4 sm:mb-0 bg-[#161d1b] p-5 sm:p-6 rounded-xl flex flex-col justify-between border border-[rgba(65,73,68,0.1)] shadow-[0_20px_40px_rgba(0,0,0,0.3)] relative overflow-hidden min-h-[160px] sm:min-h-[200px]">
              <div className="relative z-[1]">
                <span className="text-[13px] sm:text-[14px] font-medium text-[#c0c8c3] block mb-1">
                  {tx.bento.liveNow}
                </span>
                <div className="text-[30px] sm:text-[36px] font-black text-[#a2d1bb] leading-none tracking-[-0.02em]">
                  12,482
                </div>
                <p className="text-[11px] sm:text-[12px] text-[rgba(192,200,195,0.6)] mt-2">
                  {tx.bento.archivistsExploring}
                </p>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
                <span className="material-symbols-outlined text-[80px] sm:text-[96px]">
                  groups
                </span>
              </div>
            </motion.div>

            {/* Today's Quest */}
            <motion.div variants={fadeUp} className="mb-4 sm:mb-0 bg-[#1a211f] rounded-xl p-1 flex flex-col sm:flex-row items-center border border-[rgba(65,73,68,0.1)] shadow-[0_25px_50px_rgba(0,0,0,0.3)]">
              <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full overflow-hidden shrink-0 m-2 sm:m-1 relative">
                <img
                  src="/NhaThoLon.png"
                  alt="My Son"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </div>
              <div className="p-4 sm:p-8 flex-grow min-w-0 w-full sm:w-auto text-center sm:text-left">
                <div className="flex items-center gap-2 mb-2 flex-wrap justify-center sm:justify-start">
                  <span className="text-[10px] font-bold px-[10px] py-[2px] bg-[#e9c349] text-[#3c2f00] rounded-full uppercase whitespace-nowrap">
                    {tx.bento.todaysQuest}
                  </span>
                  <span className="text-[11px] sm:text-[12px] text-[#c0c8c3]">
                    {tx.bento.endsIn} 04:12:30
                  </span>
                </div>
                <h3 className="text-[18px] sm:text-[24px] font-bold text-[#e3e3de] mb-2 tracking-[-0.02em] leading-[1.2]">
                  {tx.bento.questTitle}
                </h3>
                <p className="text-[13px] sm:text-[14px] text-[#c0c8c3] max-w-[320px] mb-3 sm:mb-4 leading-relaxed mx-auto sm:mx-0">
                  {tx.bento.questDesc}
                </p>
                <span className="text-[11px] sm:text-[12px] font-bold text-[#e9c349]">
                  {tx.bento.xpReward}
                </span>
              </div>
            </motion.div>

            {/* Imperial Scholars */}
            <motion.div variants={fadeUp} className="bg-[rgba(36,43,41,0.4)] backdrop-blur-[12px] rounded-xl p-5 sm:p-6 border border-[rgba(65,73,68,0.2)] flex flex-col justify-between">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-[11px] sm:text-[12px] uppercase tracking-[0.12em] text-[#c0c8c3]">
                  {tx.bento.imperialScholars}
                </h4>
                <span className="material-symbols-outlined text-[#e9c349] text-[18px]">
                  military_tech
                </span>
              </div>

              <div className="flex flex-col gap-3 flex-1">
                {scholars.map((p) => (
                  <div
                    key={p.rank}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl ${
                      p.gold ? "bg-white/[0.05]" : "bg-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[12px] font-bold ${p.gold ? "text-[#e9c349]" : "text-[#8a938d]"}`}
                      >
                        {p.rank}
                      </span>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] text-[#a2d1bb] font-bold ${p.gold ? "bg-[#0f3d2e]" : "bg-[#1a211f]"}`}
                      >
                        {p.initials}
                      </div>
                      <span className="text-[13px] sm:text-[14px] font-semibold text-[#dde4e0] truncate max-w-[100px]">
                        {p.name}
                      </span>
                    </div>
                    <span
                      className={`text-[12px] font-bold shrink-0 ${p.gold ? "text-[#a2d1bb]" : "text-[#c0c8c3]"}`}
                    >
                      {p.score}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                to="/leaderboard"
                className="block mt-4 text-[11px] font-bold text-center text-[#c0c8c3] uppercase tracking-[0.15em] underline underline-offset-4 transition-colors duration-150 hover:text-[#e9c349]"
              >
                {tx.bento.fullRankings}
              </Link>
            </motion.div>
          </motion.div>
          </div>
        </section>

        {/* ─── ATLAS SECTION ─── */}
        <section className="px-4 sm:px-8 pb-12 sm:pb-20 md:pb-24">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 sm:gap-12 md:gap-16">
          <motion.div
            className="flex-1 min-w-0 w-full"
            variants={slideLeft}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
            <div className="w-full max-w-[720px] mx-auto overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-[rgba(65,73,68,0.3)]">
              <img
                src="/VietnamCastle.png"
                alt="Vietnam Castle"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            className="flex-1 min-w-0 w-full"
            variants={slideRight}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
            <span className="text-[#e9c349] font-black tracking-[0.2em] uppercase text-[12px] mb-3 sm:mb-4 block">
              {tx.atlas.eyebrow}
            </span>
            <h2
              className="font-extrabold text-[#e3e3de] mb-6 sm:mb-8 leading-[1.1] tracking-[-0.02em]"
              style={{ fontSize: "clamp(26px, 4vw, 52px)" }}
            >
              {tx.atlas.headline1}
              <br />
              {tx.atlas.headline2}{" "}
              <em className="text-[#a2d1bb] italic">{tx.atlas.headline3}</em>{" "}
              {tx.atlas.headline4}
            </h2>
            <div className="flex flex-col gap-6 sm:gap-8">
              {tx.atlas.features.map((f, i) => (
                <div key={i} className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[rgba(15,61,46,0.4)] flex items-center justify-center border border-[rgba(162,209,187,0.2)]">
                    <span className="material-symbols-outlined text-[#a2d1bb] text-[20px] sm:text-[22px]">
                      {["history_edu", "travel_explore", "gesture"][i]}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-[16px] sm:text-[18px] font-bold text-[#dde4e0] mb-1">
                      {f.title}
                    </h4>
                    <p className="text-[13px] sm:text-[14px] text-[#c0c8c3] leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="px-4 sm:px-8 pb-12 sm:pb-20 md:pb-24">
          <div className="max-w-6xl mx-auto">
          <motion.div
            className="relative bg-[#1a211f] rounded-xl p-6 sm:p-10 md:p-16 overflow-hidden border border-[rgba(65,73,68,0.1)] shadow-[0_0_100px_rgba(15,61,46,0.5)]"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div
              className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
              style={{
                background:
                  "linear-gradient(to left, rgba(162,209,187,0.1), transparent)",
              }}
            />
            <div className="relative z-10 flex flex-col items-center text-center">
              <h2
                className="font-black text-[#e3e3de] mb-4 sm:mb-6 tracking-[-0.03em]"
                style={{ fontSize: "clamp(26px, 5vw, 64px)" }}
              >
                {tx.cta.headline}
              </h2>
              <p className="text-[14px] sm:text-[16px] md:text-[18px] text-[#c0c8c3] max-w-[640px] mb-7 sm:mb-10 leading-relaxed">
                {tx.cta.body}
              </p>
              <div className="flex gap-3 sm:gap-4 flex-wrap justify-center">
                <Link
                  to="/register"
                  style={{ transition: ease }}
                  className="px-6 sm:px-10 py-3 sm:py-5 bg-[#e9c349] text-[#3c2f00] font-black rounded-xl no-underline text-[13px] sm:text-[14px] uppercase tracking-[0.15em] hover:shadow-[0_0_30px_rgba(233,195,73,0.4)]"
                >
                  {tx.cta.createProfile}
                </Link>
                <Link
                  to="/login"
                  style={{ transition: ease }}
                  className="px-6 sm:px-10 py-3 sm:py-5 bg-white/[0.05] border border-white/10 text-white font-black rounded-xl no-underline text-[13px] sm:text-[14px] uppercase tracking-[0.15em] hover:bg-white/10"
                >
                  {tx.cta.questLogin}
                </Link>
              </div>
            </div>
            <div className="absolute -bottom-20 -left-20 opacity-[0.05] pointer-events-none hidden sm:block">
              <span
                className="material-symbols-outlined text-[300px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                temple_buddhist
              </span>
            </div>
          </motion.div>
          </div>
        </section>

        {/* ─── CONTACT ─── */}
        <section className="px-4 sm:px-8 pb-12 sm:pb-20 md:pb-28">
          <div className="max-w-6xl mx-auto">

            {/* Header */}
            <motion.div
              className="mb-10 sm:mb-14"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              <span className="text-[#e9c349] font-black tracking-[0.2em] uppercase text-[12px] mb-3 block">
                {tx.contact.eyebrow}
              </span>
              <h2
                className="font-extrabold text-[#e3e3de] leading-[1.1] tracking-[-0.02em]"
                style={{ fontSize: "clamp(28px, 4vw, 56px)" }}
              >
                {tx.contact.headline}{" "}
                <em className="text-[#a2d1bb] italic">{tx.contact.headlineAccent}</em>
              </h2>
              <p className="mt-4 text-[14px] sm:text-[16px] text-[#c0c8c3] max-w-[520px] leading-relaxed">
                {tx.contact.body}
              </p>
            </motion.div>

            {/* Channel cards */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
            >
              {tx.contact.channels.map((ch) => (
                <motion.a
                  key={ch.label}
                  href={ch.href}
                  target={ch.href.startsWith("mailto") ? "_self" : "_blank"}
                  rel="noreferrer"
                  variants={fadeUp}
                  className="group no-underline flex flex-col justify-between p-6 sm:p-7 rounded-2xl border border-[rgba(65,73,68,0.2)] bg-[#161d1b] relative overflow-hidden"
                  style={{ transition: "border-color 0.25s, box-shadow 0.25s" }}
                  whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
                >
                  {/* Glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none rounded-2xl"
                    style={{
                      transition: "opacity 0.3s",
                      background: "radial-gradient(ellipse at top left, rgba(162,209,187,0.07), transparent 70%)",
                    }}
                  />

                  {/* Icon */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 relative z-10"
                    style={{ backgroundColor: "rgba(15,61,46,0.5)", border: "1px solid rgba(162,209,187,0.2)" }}
                  >
                    <span className="material-symbols-outlined text-[#a2d1bb]" style={{ fontSize: "22px", fontVariationSettings: "'FILL' 1" }}>
                      {ch.icon}
                    </span>
                  </div>

                  {/* Label + value */}
                  <div className="relative z-10 flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8a938d] mb-1">
                      {ch.label}
                    </p>
                    <p className="text-[14px] sm:text-[15px] font-semibold text-[#dde4e0] break-all leading-snug">
                      {ch.value}
                    </p>
                  </div>

                  {/* CTA arrow */}
                  <div className="relative z-10 mt-6 flex items-center gap-2 text-[#a2d1bb] text-[12px] font-bold uppercase tracking-[0.12em]">
                    {ch.cta}
                    <span
                      className="material-symbols-outlined text-[16px] group-hover:translate-x-1"
                      style={{ transition: "transform 0.2s" }}
                    >
                      arrow_forward
                    </span>
                  </div>

                  {/* Corner accent */}
                  <div
                    className="absolute -bottom-6 -right-6 opacity-[0.06] pointer-events-none"
                  >
                    <span className="material-symbols-outlined text-[100px] text-[#a2d1bb]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {ch.icon}
                    </span>
                  </div>
                </motion.a>
              ))}
            </motion.div>

          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <motion.footer
          className="bg-[#09100e] px-4 sm:px-8 md:px-16 lg:px-24 py-8 sm:py-12 border-t border-white/[0.05]"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-8 flex-wrap">
            <div className="text-center sm:text-left">
              <div className="text-[17px] sm:text-[18px] font-black text-[#e9c349] mb-2">
                Heritage Guesser
              </div>
              <p className="text-[12px] text-[#c0c8c3]">
                {tx.footer.copyright}
              </p>
            </div>
            <div className="flex gap-5 sm:gap-8 flex-wrap justify-center">
              {tx.footer.links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="text-[13px] sm:text-[14px] font-medium text-[#c0c8c3] no-underline transition-colors duration-150 hover:text-[#e9c349]"
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="flex gap-3">
              {["language", "shield"].map((icon) => (
                <div
                  key={icon}
                  className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center cursor-pointer transition-colors duration-150 hover:bg-[rgba(233,195,73,0.2)]"
                >
                  <span className="material-symbols-outlined text-[#c0c8c3] text-[20px]">
                    {icon}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.footer>
      </div>

      {/* Dong Son dot grid */}
      <div
        className="fixed inset-0 -z-[1] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, rgba(233,195,73,0.03) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}
