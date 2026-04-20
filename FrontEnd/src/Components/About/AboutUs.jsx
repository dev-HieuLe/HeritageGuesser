import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useLang } from "../../Context/languageContext";
import t from "../../translations";
import { FaFacebook, FaGithub } from "react-icons/fa";

/* ─── Animation variants ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const slideLeft = {
  hidden: { opacity: 0, x: -48 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};
const slideRight = {
  hidden: { opacity: 0, x: 48 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─── Animated counter ───────────────────────────────────── */
function AnimatedNumber({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const steps = 60;
    const inc = target / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(inc * step), target);
      setVal(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ─── Tech card ──────────────────────────────────────────── */
function TechCard({ icon, name, desc, color = "#a2d1bb", materialIcon }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      variants={fadeUp}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-xl p-4 sm:p-5 flex flex-col gap-2 cursor-default overflow-hidden"
      style={{
        background: hovered ? "#1a211f" : "#161d1b",
        border: `1px solid ${hovered ? `${color}33` : "rgba(65,73,68,0.2)"}`,
        boxShadow: hovered ? `0 0 24px ${color}14` : "none",
        transition: "all 0.25s ease",
      }}
    >
      {/* Corner glow */}
      <div
        className="absolute top-0 right-0 w-16 h-16 pointer-events-none"
        style={{
          background: `radial-gradient(circle at top right, ${color}18, transparent 70%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.25s",
        }}
      />
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{
          background: `${color}14`,
          border: `1px solid ${color}28`,
        }}
      >
        {materialIcon ? (
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "18px",
              color,
              fontVariationSettings: "'FILL' 1",
            }}
          >
            {materialIcon}
          </span>
        ) : (
          <span style={{ fontSize: "16px" }}>{icon}</span>
        )}
      </div>
      <div>
        <p className="font-black text-[13px] text-[#e3e3de] leading-tight">
          {name}
        </p>
        <p className="text-[11px] text-[#8a938d] mt-0.5 leading-snug">{desc}</p>
      </div>
    </motion.div>
  );
}

/* ─── Feature pill ───────────────────────────────────────── */
function FeaturePill({ icon, label, color = "#a2d1bb" }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-full"
      style={{
        background: `${color}12`,
        border: `1px solid ${color}28`,
      }}
    >
      <span
        className="material-symbols-outlined"
        style={{ fontSize: "14px", color, fontVariationSettings: "'FILL' 1" }}
      >
        {icon}
      </span>
      <span
        style={{
          color,
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ─── Timeline item ──────────────────────────────────────── */
function TimelineItem({ year, title, desc, last = false }) {
  return (
    <motion.div variants={fadeUp} className="flex gap-5 sm:gap-6">
      {/* Spine */}
      <div className="flex flex-col items-center">
        <div
          className="w-3 h-3 rounded-full shrink-0 mt-1"
          style={{
            background: "#e9c349",
            boxShadow: "0 0 10px rgba(233,195,73,0.5)",
          }}
        />
        {!last && (
          <div
            className="w-px flex-1 mt-2"
            style={{
              background:
                "linear-gradient(to bottom, rgba(233,195,73,0.3), transparent)",
            }}
          />
        )}
      </div>
      {/* Content */}
      <div
        className={`pb-8 ${last ? "" : "border-b border-[rgba(65,73,68,0.1)]"} mb-2`}
      >
        <span
          className="inline-block text-[10px] font-black uppercase tracking-[0.2em] mb-1.5"
          style={{ color: "#e9c349" }}
        >
          {year}
        </span>
        <h4 className="font-black text-[#e3e3de] text-[15px] mb-1">{title}</h4>
        <p className="text-[13px] text-[#8a938d] leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

/* ─── Main component ─────────────────────────────────────── */
export default function AboutUs() {
  const { lang } = useLang();
  const tx = t[lang];

  const TECH_STACK = [
    {
      materialIcon: "code",
      name: "React 19 + Vite 7",
      desc: "Lightning-fast frontend with HMR",
      color: "#61dafb",
    },
    {
      materialIcon: "map",
      name: "Google Street View",
      desc: "Immersive 360° heritage exploration",
      color: "#4ade80",
    },
    {
      materialIcon: "smart_toy",
      name: "Gemma 4 · 26B via DeepInfra",
      desc: "AI guide & site personalization",
      color: "#a2d1bb",
    },
    {
      materialIcon: "record_voice_over",
      name: "Gemini TTS (Despina)",
      desc: "Natural bilingual voice synthesis",
      color: "#e9c349",
    },
    {
      materialIcon: "psychology",
      name: "NLP · MarianMT + Transformers",
      desc: "Multilingual answer scoring",
      color: "#c084fc",
    },
    {
      materialIcon: "view_in_ar",
      name: "Three.js + VRM Avatar",
      desc: "3D animated AI companion Savannah",
      color: "#f97316",
    },
    {
      materialIcon: "storage",
      name: "Node.js + MySQL",
      desc: "Express 5 REST API + relational DB",
      color: "#86efac",
    },
    {
      materialIcon: "palette",
      name: "TailwindCSS 4 + Framer Motion",
      desc: "Fluid animations, utility-first UI",
      color: "#38bdf8",
    },
  ];

  const STATS = [
    { value: 500, suffix: "+", label: "Students Reached" },
    { value: 100, suffix: "+", label: "Heritage Sites" },
    { value: 3, suffix: "", label: "AI Models" },
    { value: 2, suffix: "", label: "Schools Piloting" },
  ];

  const TIMELINE = [
    {
      year: "2024 · Conception",
      title: "Born at Delta Global School",
      desc: "Heritage Guessr began as a capstone project at DGS Hanoi — blending education, AI, and Vietnamese cultural preservation into a single platform.",
    },
    {
      year: "2024 · Build Phase",
      title: "AI & NLP Integration",
      desc: "Integrated Google Street View, a custom Gemma-powered chat guide named Savannah, and a multilingual NLP scoring engine that understands both English and Vietnamese guesses.",
    },
    {
      year: "2025 · Pilot Launch",
      title: "600+ Students Onboarded",
      desc: "Rolled out to Delta Global School and Luong Van Can High School. Players explored over 40 UNESCO and national heritage sites through immersive gameplay.",
    },
    {
      year: "Now · Open Platform",
      title: "Community & Growth",
      desc: "Any logged-in user can contribute new heritage sites. Gemma auto-generates metadata; curators review before approval. The archive grows with the community.",
      last: true,
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#0e1513", color: "#dde4e0" }}
    >
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative px-4 sm:px-8 pt-16 sm:pt-24 pb-16 sm:pb-20 overflow-hidden">
        {/* Background orbs */}
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(162,209,187,0.06) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(233,195,73,0.05) 0%, transparent 70%)",
          }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(162,209,187,0.04) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
              style={{
                background: "rgba(15,61,46,0.4)",
                border: "1px solid rgba(162,209,187,0.2)",
                backdropFilter: "blur(12px)",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "14px",
                  color: "#a2d1bb",
                  fontVariationSettings: "'FILL' 1",
                }}
              >
                temple_buddhist
              </span>
              <span
                style={{
                  color: "#a2d1bb",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                Heritage Guessr
              </span>
            </div>
          </motion.div>

          <motion.h1
            className="font-black leading-none tracking-[-0.03em] mb-6"
            style={{ fontSize: "clamp(38px, 7vw, 88px)" }}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.85,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <span style={{ color: "#e3e3de" }}>Built to </span>
            <span
              style={{
                color: "#e9c349",
                fontStyle: "italic",
                WebkitBackgroundClip: "text",
              }}
            >
              Preserve.
            </span>
            <br />
            <span style={{ color: "#e3e3de" }}>Designed to </span>
            <em style={{ color: "#a2d1bb" }}>Inspire.</em>
          </motion.h1>

          <motion.p
            className="text-[15px] sm:text-[18px] md:text-[20px] leading-relaxed max-w-2xl mx-auto mb-8"
            style={{ color: "#c0c8c3" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Heritage Guessr drops you into real Google Street View panoramas of
            Vietnamese heritage sites. Explore with your AI guide{" "}
            <em style={{ color: "#e9c349" }}>Savannah</em>, guess the site's
            name and age, and climb a global leaderboard — all while learning
            about Vietnam's cultural treasures.
          </motion.p>

          {/* Feature pills */}
          <motion.div
            className="flex flex-wrap gap-2 justify-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <FeaturePill icon="360" label="Street View" color="#a2d1bb" />
            <FeaturePill icon="smart_toy" label="AI Guide" color="#e9c349" />
            <FeaturePill
              icon="psychology"
              label="NLP Scoring"
              color="#c084fc"
            />
            <FeaturePill icon="school" label="Study Mode" color="#38bdf8" />
            <FeaturePill icon="storefront" label="XP Shop" color="#f97316" />
            <FeaturePill
              icon="view_in_ar"
              label="VR Discovery"
              color="#4ade80"
            />
          </motion.div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────── */}
      <section className="px-4 sm:px-8 pb-16 sm:pb-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="text-center p-5 sm:p-7 rounded-2xl"
                style={{
                  background: "#161d1b",
                  border: "1px solid rgba(65,73,68,0.2)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                }}
              >
                <div
                  className="font-black leading-none mb-2"
                  style={{ fontSize: "clamp(32px,5vw,52px)", color: "#e9c349" }}
                >
                  <AnimatedNumber target={s.value} suffix={s.suffix} />
                </div>
                <p
                  className="text-[11px] font-bold uppercase tracking-[0.15em]"
                  style={{ color: "#8a938d" }}
                >
                  {s.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── MISSION ──────────────────────────────────────────── */}
      <section className="px-4 sm:px-8 pb-16 sm:pb-24">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 sm:gap-16 items-center">
          {/* Left: Image */}
          <motion.div
            className="flex-1 w-full"
            variants={slideLeft}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{ border: "1px solid rgba(65,73,68,0.3)" }}
            >
              <img
                src="/VietnamCastle.png"
                alt="Vietnamese Heritage"
                className="w-full h-[300px] sm:h-[420px] object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(14,21,19,0.8) 0%, transparent 50%)",
                }}
              />
              <div className="absolute bottom-5 left-5 right-5">
                <p
                  className="font-black text-[13px] uppercase tracking-[0.2em] mb-1"
                  style={{ color: "#e9c349" }}
                >
                  Our Mission
                </p>
                <p className="text-[15px] sm:text-[17px] font-semibold text-white leading-snug">
                  Lan tỏa, kết nối và gìn giữ.
                </p>
                <p
                  style={{
                    color: "#a2d1bb",
                    fontSize: "12px",
                    marginTop: "2px",
                  }}
                >
                  Spread, connect, and preserve.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: Text */}
          <motion.div
            className="flex-1 w-full"
            variants={slideRight}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
            <span
              className="block text-[11px] font-black uppercase tracking-[0.22em] mb-3"
              style={{ color: "#e9c349" }}
            >
              Why We Built This
            </span>
            <h2
              className="font-extrabold leading-[1.1] tracking-[-0.02em] mb-5"
              style={{ fontSize: "clamp(26px, 4vw, 46px)", color: "#e3e3de" }}
            >
              Vietnam has over{" "}
              <em style={{ color: "#a2d1bb" }}>40,000 heritage sites.</em>
              <br />
              Most go unnoticed.
            </h2>
            <p
              className="text-[14px] sm:text-[15px] leading-relaxed mb-5"
              style={{ color: "#c0c8c3" }}
            >
              Heritage Guessr was conceived at{" "}
              <strong style={{ color: "#e3e3de" }}>
                Delta Global School, Hanoi
              </strong>{" "}
              as a technology-driven initiative to make Vietnamese cultural
              heritage accessible, engaging, and unforgettable — starting with
              students and expanding outward.
            </p>
            <p
              className="text-[14px] sm:text-[15px] leading-relaxed mb-7"
              style={{ color: "#c0c8c3" }}
            >
              We combine{" "}
              <strong style={{ color: "#e3e3de" }}>Google Street View</strong>,{" "}
              <strong style={{ color: "#e3e3de" }}>generative AI</strong>, and{" "}
              <strong style={{ color: "#e3e3de" }}>multilingual NLP</strong> to
              turn passive scrolling into active learning — while tracking your
              progress against players worldwide.
            </p>

            {/* Highlight badges */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: "school", label: "DGS Hanoi", color: "#a2d1bb" },
                { icon: "people", label: "600+ Students", color: "#e9c349" },
                { icon: "public", label: "UNESCO Sites", color: "#4ade80" },
                { icon: "auto_awesome", label: "AI-Powered", color: "#c084fc" },
              ].map((b) => (
                <FeaturePill
                  key={b.label}
                  icon={b.icon}
                  label={b.label}
                  color={b.color}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TECHNOLOGY ───────────────────────────────────────── */}
      <section className="px-4 sm:px-8 pb-16 sm:pb-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-10 sm:mb-14 text-center"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div
              className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-5"
              style={{
                background: "rgba(15,61,46,0.5)",
                border: "1px solid rgba(162,209,187,0.2)",
              }}
            >
              <span
                className="material-symbols-outlined text-[#a2d1bb]"
                style={{ fontSize: "22px", fontVariationSettings: "'FILL' 1" }}
              >
                hub
              </span>
            </div>
            <span className="block text-[#e9c349] font-black tracking-[0.2em] uppercase text-[12px] mb-3">
              Under the Hood
            </span>
            <h2
              className="font-extrabold text-[#e3e3de] leading-[1.1] tracking-[-0.02em]"
              style={{ fontSize: "clamp(26px, 4vw, 48px)" }}
            >
              Powered by Eight{" "}
              <em className="text-[#a2d1bb] italic">Technologies</em>
            </h2>
            <p className="mt-4 text-[14px] sm:text-[16px] text-[#c0c8c3] max-w-xl mx-auto leading-relaxed">
              From real-time 3D Street View to multilingual neural networks —
              every layer is chosen to serve the experience.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
          >
            {TECH_STACK.map((tech) => (
              <TechCard key={tech.name} {...tech} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── STORY TIMELINE ───────────────────────────────────── */}
      <section className="px-4 sm:px-8 pb-16 sm:pb-24">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-14 lg:gap-20">
          {/* Left: header */}
          <motion.div
            className="lg:w-72 shrink-0"
            variants={slideLeft}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
            <div
              className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-5"
              style={{
                background: "rgba(233,195,73,0.1)",
                border: "1px solid rgba(233,195,73,0.2)",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "22px",
                  color: "#e9c349",
                  fontVariationSettings: "'FILL' 1",
                }}
              >
                history_edu
              </span>
            </div>
            <span className="block text-[#e9c349] font-black tracking-[0.2em] uppercase text-[12px] mb-3">
              Our Journey
            </span>
            <h2
              className="font-extrabold text-[#e3e3de] leading-[1.1] tracking-[-0.02em] mb-5"
              style={{ fontSize: "clamp(24px, 3vw, 40px)" }}
            >
              How It All <em className="text-[#a2d1bb] italic">Started</em>
            </h2>
            <p className="text-[14px] text-[#c0c8c3] leading-relaxed">
              From a classroom idea to a full-stack platform serving hundreds of
              students — here's the Heritage Guessr story.
            </p>

            {/* Quote */}
            <div
              className="mt-8 p-5 rounded-2xl"
              style={{
                background: "rgba(15,61,46,0.3)",
                border: "1px solid rgba(162,209,187,0.15)",
              }}
            >
              <p
                className="text-[14px] italic leading-relaxed mb-3"
                style={{ color: "#c0c8c3" }}
              >
                "We asked — what if rediscovering Vietnam's past could feel like
                playing a game? That question became Heritage Guessr."
              </p>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center"
                  style={{
                    background: "rgba(162,209,187,0.15)",
                    border: "1px solid rgba(162,209,187,0.25)",
                  }}
                >
                  <img
                    src="/founder_pic/hoapfp.jpg"
                    alt="Thai Hoa"
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
                <div>
                  <p className="font-black text-[12px] text-[#a2d1bb]">
                    Đặng Thái Hoà
                  </p>
                  <p className="text-[10px] text-[#8a938d] uppercase tracking-widest">
                    Innovation Leader
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: timeline */}
          <motion.div
            className="flex-1"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
          >
            {TIMELINE.map((item, i) => (
              <TimelineItem
                key={i}
                {...item}
                last={i === TIMELINE.length - 1}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── AI SAVANNAH SPOTLIGHT ─────────────────────────────── */}
      <section className="px-4 sm:px-8 pb-16 sm:pb-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="relative rounded-2xl overflow-hidden p-8 sm:p-12 md:p-16"
            style={{
              background:
                "linear-gradient(135deg, #0f3d2e 0%, #1a211f 50%, #0e1513 100%)",
              border: "1px solid rgba(162,209,187,0.15)",
              boxShadow: "0 0 80px rgba(15,61,46,0.4)",
            }}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Background decoration */}
            <div
              className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at top right, rgba(162,209,187,0.08), transparent 65%)",
              }}
            />
            <div className="absolute -bottom-16 -right-16 opacity-[0.06] pointer-events-none">
              <span
                className="material-symbols-outlined text-[#a2d1bb]"
                style={{ fontSize: "260px", fontVariationSettings: "'FILL' 1" }}
              >
                smart_toy
              </span>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-14 items-center">
              {/* Avatar placeholder */}
              <div className="shrink-0 flex flex-col items-center gap-3">
                <div
                  className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "rgba(162,209,187,0.1)",
                    border: "1.5px solid rgba(162,209,187,0.25)",
                    boxShadow: "0 0 40px rgba(162,209,187,0.12)",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "48px",
                      color: "#a2d1bb",
                      fontVariationSettings: "'FILL' 1",
                    }}
                  >
                    face_3
                  </span>
                </div>
                {/* Pulse indicator */}
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: "#4ade80",
                      animation: "pulse 1.5s ease-in-out infinite",
                      boxShadow: "0 0 6px rgba(74,222,128,0.8)",
                    }}
                  />
                  <span
                    style={{
                      color: "#4ade80",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    ONLINE
                  </span>
                </div>
              </div>

              {/* Text */}
              <div>
                <span
                  className="block text-[11px] font-black uppercase tracking-[0.22em] mb-2"
                  style={{ color: "#a2d1bb" }}
                >
                  Meet Your AI Guide
                </span>
                <h2
                  className="font-black leading-tight mb-4 tracking-[-0.02em]"
                  style={{
                    fontSize: "clamp(24px, 3.5vw, 44px)",
                    color: "#e3e3de",
                  }}
                >
                  Savannah — Your{" "}
                  <em style={{ color: "#e9c349" }}>Heritage Expert</em>
                </h2>
                <p
                  className="text-[14px] sm:text-[15px] leading-relaxed mb-5 max-w-xl"
                  style={{ color: "#c0c8c3" }}
                >
                  Powered by{" "}
                  <strong style={{ color: "#e3e3de" }}>Gemma 4 26B</strong> via
                  DeepInfra, Savannah gives you contextual hints without ever
                  spoiling the answer. She speaks in{" "}
                  <strong style={{ color: "#e3e3de" }}>natural language</strong>
                  , reads her replies aloud via{" "}
                  <strong style={{ color: "#e3e3de" }}>Gemini TTS</strong>{" "}
                  (Despina voice), and comes to life as a 3D VRM avatar you can
                  watch blink and animate in real-time.
                </p>
                <div className="flex flex-wrap gap-2">
                  <FeaturePill
                    icon="chat"
                    label="Gemma 4 · 26B Chat"
                    color="#a2d1bb"
                  />
                  <FeaturePill
                    icon="volume_up"
                    label="Gemini TTS"
                    color="#e9c349"
                  />
                  <FeaturePill
                    icon="view_in_ar"
                    label="3D VRM Avatar"
                    color="#f97316"
                  />
                  <FeaturePill
                    icon="translate"
                    label="EN + VI"
                    color="#38bdf8"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── HIEU QUOTE ───────────────────────────────────────── */}
      <section className="px-4 sm:px-8 pb-16 sm:pb-24">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="relative rounded-2xl overflow-hidden py-12 sm:py-16 px-8 sm:px-14"
            style={{
              background: "linear-gradient(135deg, #12140e 0%, #1a211f 100%)",
              border: "1px solid rgba(65,73,68,0.25)",
            }}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Vertical gold bar */}
            <div
              className="absolute left-0 top-8 bottom-8 w-[3px] rounded-r-full"
              style={{
                background:
                  "linear-gradient(to bottom, #e9c349, rgba(233,195,73,0.08))",
              }}
            />
            {/* Oversized decorative quote mark */}
            <div
              className="absolute -top-4 left-8 sm:left-12 pointer-events-none select-none"
              style={{
                fontSize: "160px",
                color: "#e9c349",
                opacity: 0.06,
                lineHeight: 1,
                fontFamily: "Georgia, serif",
              }}
            >
              &#8220;
            </div>
            {/* Subtle right glow */}
            <div
              className="absolute top-0 right-0 w-72 h-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at right center, rgba(233,195,73,0.04), transparent 70%)",
              }}
            />

            <div className="relative z-10">
              <p
                className="font-black leading-[1.35] tracking-[-0.01em] mb-7"
                style={{
                  fontSize: "clamp(18px, 3vw, 30px)",
                  color: "#e3e3de",
                }}
              >
                "I wrote every{" "}
                <i
                  style={{
                    fontStyle: "italic",
                    color: "#f1cf63",
                    background:
                      "linear-gradient(180deg, #fff6c7 0%, #f8de7a 38%, #e9c349 62%, #c9961a 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow:
                      "0 1px 0 rgba(255,255,255,0.22), 0 2px 10px rgba(233,195,73,0.18)",
                    filter: "drop-shadow(0 2px 6px rgba(233,195,73,0.14))",
                    letterSpacing: "-0.01em",
                  }}
                >
                  line of code
                </i>{" "}
                with one goal: make Vietnam's heritage{" "}
                <em
                  style={{
                    fontStyle: "italic",
                    background:
                      "linear-gradient(180deg, #fff8d6 0%, #f7dc74 42%, #e9c349 68%, #c79216 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow:
                      "0 1px 0 rgba(255,255,255,0.2), 0 2px 10px rgba(233,195,73,0.16)",
                    filter: "drop-shadow(0 2px 6px rgba(233,195,73,0.12))",
                  }}
                >
                  impossible to forget.
                </em>
                "
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <div
                  className="w-11 h-11 rounded-xl overflow-hidden shrink-0"
                  style={{
                    border: "1.5px solid rgba(233,195,73,0.3)",
                    boxShadow: "0 0 12px rgba(233,195,73,0.1)",
                  }}
                >
                  <img
                    src="/founder_pic/hieupfp.jpg"
                    alt="Hieu"
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
                <div>
                  <p
                    className="font-black text-[14px]"
                    style={{ color: "#e9c349" }}
                  >
                    Lê Trung Hiếu
                  </p>
                  <p
                    className="text-[11px] uppercase tracking-[0.14em]"
                    style={{ color: "#8a938d" }}
                  >
                    Lead Developer · Designer · Author
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TEAM / CONTACT ───────────────────────────────────── */}
      <section className="px-4 sm:px-8 pb-16 sm:pb-28">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="flex flex-col md:flex-row gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
          >
            {/* Crafted By card */}
            <motion.div
              variants={fadeUp}
              className="flex-1 relative rounded-2xl p-7 sm:p-9 overflow-hidden"
              style={{
                background: "#161d1b",
                border: "1px solid rgba(65,73,68,0.2)",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at top left, rgba(162,209,187,0.04), transparent 60%)",
                }}
              />
              <div className="absolute -bottom-10 -right-10 opacity-[0.03] pointer-events-none">
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "160px",
                    color: "#a2d1bb",
                    fontVariationSettings: "'FILL' 1",
                  }}
                >
                  groups
                </span>
              </div>

              <div className="relative z-10">
                <span
                  className="block text-[10px] font-black uppercase tracking-[0.22em] mb-1"
                  style={{ color: "#a2d1bb" }}
                >
                  Crafted By
                </span>
                <h3 className="font-black text-[20px] text-[#e3e3de] mb-1 tracking-[-0.01em]">
                  The Founding Team
                </h3>
                <p className="text-[13px] mb-7" style={{ color: "#8a938d" }}>
                  Three students at Delta Global School, Hanoi — united by one
                  mission.
                </p>

                <div className="flex flex-col gap-3">
                  {[
                    {
                      img: "/founder_pic/hoapfp.jpg",
                      name: "Đặng Thái Hoà",
                      role: "Innovation Leader",
                      initials: "TH",
                      accent: "#a2d1bb",
                    },
                    {
                      img: "/founder_pic/hieupfp.jpg",
                      name: "Lê Trung Hiếu",
                      role: "Lead Developer · Designer · Author",
                      initials: "LH",
                      accent: "#a2d1bb",
                    },
                    {
                      img: "/founder_pic/Tommypfp.jpg",
                      name: "Nguyễn Thái Sơn",
                      role: "Creative Content Specialist",
                      initials: "TS",
                      accent: "#a2d1bb",
                    },
                  ].map((f) => (
                    <div
                      key={f.name}
                      className="flex items-center gap-3.5 p-3 rounded-xl"
                      style={{
                        background: f.badge
                          ? "rgba(233,195,73,0.04)"
                          : "rgba(255,255,255,0.02)",
                        border: `1px solid ${
                          f.badge
                            ? "rgba(233,195,73,0.12)"
                            : "rgba(65,73,68,0.15)"
                        }`,
                      }}
                    >
                      <div
                        className="w-11 h-11 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
                        style={{ border: `1.5px solid ${f.accent}30` }}
                      >
                        <img
                          src={f.img}
                          alt={f.name}
                          className="w-full h-full object-cover object-top"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.parentElement.innerHTML = `<span style="color:${f.accent};font-weight:900;font-size:14px">${f.initials}</span>`;
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-black text-[14px] text-[#e3e3de] leading-tight">
                            {f.name}
                          </p>
                          {f.badge && (
                            <span
                              className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-[0.1em]"
                              style={{
                                background: "rgba(233,195,73,0.12)",
                                border: "1px solid rgba(233,195,73,0.25)",
                                color: "#e9c349",
                              }}
                            >
                              {f.badge}
                            </span>
                          )}
                        </div>
                        <p
                          className="text-[11px] truncate"
                          style={{
                            color: f.badge ? "#a2d1bb" : "#8a938d",
                            marginTop: "2px",
                          }}
                        >
                          {f.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* School + team CTA */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col gap-6 md:w-72 shrink-0"
            >
              {/* DGS card */}
              <div
                className="flex-1 rounded-2xl p-6 relative overflow-hidden"
                style={{
                  background: "#161d1b",
                  border: "1px solid rgba(65,73,68,0.2)",
                }}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at bottom right, rgba(162,209,187,0.06), transparent 65%)",
                  }}
                />
                <div className="relative z-10">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: "rgba(162,209,187,0.1)",
                      border: "1px solid rgba(162,209,187,0.2)",
                    }}
                  >
                    <span
                      className="material-symbols-outlined text-[#a2d1bb]"
                      style={{
                        fontSize: "20px",
                        fontVariationSettings: "'FILL' 1",
                      }}
                    >
                      school
                    </span>
                  </div>
                  <h4 className="font-black text-[15px] text-[#e3e3de] mb-1">
                    Delta Global School
                  </h4>
                  <p
                    style={{
                      color: "#8a938d",
                      fontSize: "11px",
                      marginBottom: "10px",
                    }}
                  >
                    Hanoi, Vietnam
                  </p>
                  <p
                    className="text-[12px] sm:text-[13px] leading-relaxed"
                    style={{ color: "#c0c8c3" }}
                  >
                    Heritage Guessr was conceived and built at DGS as part of an
                    initiative to preserve and promote Vietnamese cultural
                    heritage through technology.
                  </p>
                </div>
              </div>

              {/* Meet the team CTA */}
              <Link
                to="/"
                className="rounded-2xl p-6 no-underline relative overflow-hidden group"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(15,61,46,0.6), rgba(14,21,19,0.9))",
                  border: "1px solid rgba(162,209,187,0.18)",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(162,209,187,0.35)";
                  e.currentTarget.style.boxShadow =
                    "0 0 24px rgba(162,209,187,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(162,209,187,0.18)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at top left, rgba(162,209,187,0.07), transparent 70%)",
                    transition: "opacity 0.3s",
                  }}
                />
                <div className="relative z-10">
                  <span
                    className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2"
                    style={{ color: "#a2d1bb" }}
                  >
                    The Team
                  </span>
                  <p className="font-black text-[15px] text-[#e3e3de] mb-1">
                    Meet the Founders
                  </p>
                  <p
                    className="text-[12px] leading-relaxed mb-4"
                    style={{ color: "#8a938d" }}
                  >
                    See the full team behind Heritage Guessr on our homepage.
                  </p>
                  <div
                    className="flex items-center gap-1.5"
                    style={{ color: "#a2d1bb" }}
                  >
                    <span style={{ fontSize: "12px", fontWeight: 700 }}>
                      View Founders
                    </span>
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "14px" }}
                    >
                      arrow_forward
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── BOTTOM STRIP ─────────────────────────────────────── */}
      <motion.div
        className="px-4 sm:px-8 pb-12 sm:pb-16"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div
          className="max-w-6xl mx-auto text-center py-10 sm:py-12 px-6 rounded-2xl"
          style={{
            background: "#161d1b",
            border: "1px solid rgba(65,73,68,0.15)",
          }}
        >
          <span
            className="block font-black text-[11px] uppercase tracking-[0.25em] mb-3"
            style={{ color: "#a2d1bb" }}
          >
            Open Source · Educational
          </span>
          <h3
            className="font-black tracking-[-0.02em] mb-3"
            style={{ fontSize: "clamp(18px, 3vw, 30px)", color: "#e3e3de" }}
          >
            Built with ❤️ for Vietnamese Cultural Heritage
          </h3>
          <p
            className="text-[13px] sm:text-[14px] mb-6 max-w-lg mx-auto"
            style={{ color: "#8a938d" }}
          >
            Copyright © 2025 Le Trung Hieu and the Heritage Guessr Team. All
            rights reserved.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a
              href="https://github.com/dev-HieuLe/HeritageGuesser"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl no-underline text-[12px] font-bold"
              style={{
                background: "rgba(162,209,187,0.06)",
                border: "1px solid rgba(162,209,187,0.15)",
                color: "#a2d1bb",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(162,209,187,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(162,209,187,0.06)";
              }}
            >
              <FaGithub size={14} />
              GitHub
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61568386015819"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl no-underline text-[12px] font-bold"
              style={{
                background: "rgba(233,195,73,0.06)",
                border: "1px solid rgba(233,195,73,0.15)",
                color: "#e9c349",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(233,195,73,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(233,195,73,0.06)";
              }}
            >
              <FaFacebook size={14} />
              Follow Us
            </a>
            <Link
              to="/contribute"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl no-underline text-[12px] font-bold"
              style={{
                background: "rgba(74,222,128,0.06)",
                border: "1px solid rgba(74,222,128,0.15)",
                color: "#4ade80",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(74,222,128,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(74,222,128,0.06)";
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "14px" }}
              >
                add_location_alt
              </span>
              Contribute a Site
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
