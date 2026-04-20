import { useRef, useState, useEffect } from "react";
import { useLang } from "../../Context/languageContext";
import t from "../../translations";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Mail, X } from "lucide-react";
import { FaLinkedin, FaFacebook } from "react-icons/fa";

/* ─── Static data (language-independent) ───────────────── */
const foundersMeta = [
  {
    image: "/founder_pic/hoapfp.jpg",
    initials: "TH",
    social: {
      linkedin: "https://www.linkedin.com/in/thaihoadang/",
      facebook: "https://www.facebook.com/hoadang.thai.395/",
      email: "mailto:dthoa@stu.dgs.org.vn",
    },
  },
  {
    image: "/founder_pic/hieupfp.jpg",
    initials: "TH",
    social: {
      linkedin: "https://www.linkedin.com/in/hieule-dev/",
      facebook: "https://www.facebook.com/hieu.le.791557",
      email: "mailto:lthieu@stu.dgs.org.vn",
    },
  },
  {
    image: "/founder_pic/Tommypfp.jpg",
    initials: "TS",
    social: {
      linkedin: "https://www.linkedin.com/in/tony-nguyen-5b0a0b1b0/",
      facebook: "https://www.facebook.com/tommy.nguyen.598125/",
      email: "mailto:ntson@stu.dgs.org.vn",
    },
  },
];

/* ─── Mouse-tilt wrapper with shine coords ──────────────── */
function TiltCard({ children, className, onClick }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // raw pixel coords for the shine spot
  const shineX = useMotionValue(50);
  const shineY = useMotionValue(50);
  const sx = useSpring(x, { stiffness: 180, damping: 22 });
  const sy = useSpring(y, { stiffness: 180, damping: 22 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-7, 7]);

  // shine opacity tied to tilt magnitude
  const shineOpacity = useTransform([sx, sy], ([lx, ly]) =>
    Math.min(Math.sqrt(lx * lx + ly * ly) * 2.8, 1),
  );

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 900,
      }}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        x.set(nx);
        y.set(ny);
        shineX.set(((e.clientX - r.left) / r.width) * 100);
        shineY.set(((e.clientY - r.top) / r.height) * 100);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      onClick={onClick}
    >
      {children}
      {/* Specular shine layer — follows cursor, fades with tilt */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: useTransform(
            [shineX, shineY],
            ([px, py]) =>
              `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.09) 0%, rgba(162,209,187,0.04) 30%, transparent 65%)`,
          ),
          opacity: shineOpacity,
          mixBlendMode: "screen",
          zIndex: 30,
        }}
      />
    </motion.div>
  );
}

/* ─── Modal ─────────────────────────────────────────────── */
function FounderModal({ founder, onClose, tx }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      {/* Backdrop — matches site style */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(8,13,11,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      />

      {/* Panel */}
      <motion.div
        className="relative z-10 w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col sm:flex-row"
        style={{
          background: "#161d1b",
          border: "1px solid rgba(162,209,187,0.15)",
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.6), 0 0 80px rgba(15,61,46,0.35)",
        }}
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 24 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer border-none"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(65,73,68,0.3)",
            color: "#8a938d",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(162,209,187,0.1)";
            e.currentTarget.style.color = "#a2d1bb";
            e.currentTarget.style.borderColor = "rgba(162,209,187,0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            e.currentTarget.style.color = "#8a938d";
            e.currentTarget.style.borderColor = "rgba(65,73,68,0.3)";
          }}
        >
          <X size={14} />
        </button>

        {/* ── Left: portrait panel ── */}
        <div
          className="relative sm:w-56 shrink-0 flex flex-col items-center justify-center gap-5 py-10 px-6 overflow-hidden"
          style={{
            background: "#1a211f",
            borderRight: "1px solid rgba(65,73,68,0.2)",
          }}
        >
          {/* Mint radial glow — matches contact card hover */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 30%, rgba(162,209,187,0.08), transparent 70%)",
            }}
          />

          {/* Temple watermark — same as CTA section */}
          <div className="absolute -bottom-8 -right-8 opacity-[0.05] pointer-events-none">
            <span
              className="material-symbols-outlined text-[#a2d1bb]"
              style={{ fontSize: "130px", fontVariationSettings: "'FILL' 1" }}
            >
              temple_buddhist
            </span>
          </div>

          {/* Avatar */}
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.15,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div
              className="w-[108px] h-[108px] rounded-2xl overflow-hidden flex items-center justify-center"
              style={{
                background: "#242b29",
                border: "1.5px solid rgba(162,209,187,0.2)",
                boxShadow:
                  "0 0 32px rgba(162,209,187,0.1), 0 8px 24px rgba(0,0,0,0.4)",
              }}
            >
              {founder.image ? (
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <span className="text-[36px] font-black text-[#e9c349]">
                  {founder.initials}
                </span>
              )}
            </div>
          </motion.div>

          {/* Name + role */}
          <motion.div
            className="relative z-10 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.22,
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p className="font-black text-[#e3e3de] text-[16px] tracking-[-0.01em]">
              {founder.name}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e9c349] mt-1 leading-snug">
              {tx.founderBadge}
            </p>
          </motion.div>

          {/* Divider dot row */}
          <div className="relative z-10 flex items-center gap-1.5">
            {[1, 0.45, 0.2].map((op, i) => (
              <div
                key={i}
                className="rounded-full"
                style={{
                  width: `${5 - i}px`,
                  height: `${5 - i}px`,
                  background: "#a2d1bb",
                  opacity: op,
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Right: details ── */}
        <motion.div
          className="flex-1 flex flex-col p-7 sm:p-8"
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Role eyebrow */}
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#e9c349] mb-3 block">
            {founder.role}
          </span>

          {/* Name */}
          <h3 className="font-black text-[#e3e3de] text-[22px] sm:text-[26px] tracking-[-0.02em] leading-tight mb-1">
            {founder.name}
          </h3>

          {/* Rule */}
          <div
            className="w-10 h-[2px] rounded-full mb-5 mt-3"
            style={{
              background:
                "linear-gradient(90deg, #e9c349, rgba(233,195,73,0.2))",
            }}
          />

          {/* Bio */}
          <p className="text-[14px] text-[#c0c8c3] leading-relaxed flex-1">
            {founder.bio}
          </p>

          {/* Social */}
          <div className="mt-7 pt-5 border-t border-[rgba(65,73,68,0.25)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a938d] mb-3">
              {tx.connect}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                {
                  href: founder.social.linkedin,
                  Icon: FaLinkedin,
                  label: "LinkedIn",
                },
                {
                  href: founder.social.facebook,
                  Icon: FaFacebook,
                  label: "Facebook",
                },
                { href: founder.social.email, Icon: Mail, label: "Email" },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto") ? "_self" : "_blank"}
                  rel="noreferrer"
                  aria-label={label}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl no-underline text-[12px] font-bold uppercase tracking-[0.1em]"
                  style={{
                    background: "rgba(15,61,46,0.4)",
                    border: "1px solid rgba(162,209,187,0.18)",
                    color: "#a2d1bb",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(162,209,187,0.1)";
                    e.currentTarget.style.borderColor =
                      "rgba(162,209,187,0.35)";
                    e.currentTarget.style.boxShadow =
                      "0 0 12px rgba(162,209,187,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(15,61,46,0.4)";
                    e.currentTarget.style.borderColor =
                      "rgba(162,209,187,0.18)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <Icon size={13} />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Founder card ──────────────────────────────────────── */
function FounderCard({ founder, index, onOpen, tx }) {
  return (
    <motion.div
      className="h-full"
      variants={{
        hidden: { opacity: 0, y: 48, scale: 0.95 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.75,
            delay: index * 0.13,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
    >
      <TiltCard
        className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer bg-[#161d1b] border border-[rgba(65,73,68,0.2)]"
        onClick={() => onOpen(founder)}
      >
        {/* Hover glow — exactly like contact cards */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none rounded-2xl"
          style={{
            transition: "opacity 0.3s",
            background:
              "radial-gradient(ellipse at top center, rgba(162,209,187,0.07), transparent 70%)",
          }}
        />

        {/* Hover border upgrade */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none"
          style={{
            transition: "opacity 0.3s",
            boxShadow: "inset 0 0 0 1px rgba(162,209,187,0.18)",
          }}
        />

        {/* ── Photo — tall, not full card ── */}
        <div className="relative overflow-hidden" style={{ height: "405px" }}>
          {founder.image ? (
            <img
              src={founder.image}
              alt={founder.name}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#1a211f]">
              <span className="text-[72px] font-black text-[#e9c349] opacity-20">
                {founder.initials}
              </span>
            </div>
          )}

          {/* Click to see more overlay */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 pointer-events-none"
            style={{
              background: "rgba(8,13,11,0.58)",
              backdropFilter: "blur(3px)",
              WebkitBackdropFilter: "blur(3px)",
              transition: "opacity 0.35s ease",
            }}
          >
            <motion.span
              className="material-symbols-outlined"
              style={{
                fontSize: "42px",
                color: "#e9c349",
                fontVariationSettings: "'FILL' 1",
              }}
              animate={{ scale: [1, 0.78, 1.08, 1], y: [0, 4, -2, 0] }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                repeatDelay: 0.6,
                ease: "easeInOut",
              }}
            >
              touch_app
            </motion.span>
            <span
              className="text-[13px] font-black uppercase tracking-[0.18em]"
              style={{
                color: "#e9c349",
                textShadow: "0 2px 12px rgba(0,0,0,0.6)",
              }}
            >
              Click to see more
            </span>
          </div>

          {/* Soft bottom fade into the strip */}
          <div
            className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, transparent, #161d1b)",
            }}
          />
        </div>

        {/* ── Bottom strip — solid bg + stacked info ── */}
        <div
          className="relative px-4 pt-3 pb-4 overflow-hidden"
          style={{ background: "#161d1b" }}
        >
          {/* Heritage icon watermark — faded */}
          <div className="absolute -bottom-3 -right-3 pointer-events-none select-none opacity-[0.06]">
            <span
              className="material-symbols-outlined text-[#a2d1bb]"
              style={{ fontSize: "100px", fontVariationSettings: "'FILL' 1" }}
            >
              temple_buddhist
            </span>
          </div>
          <div className="absolute top-3 left-3 pointer-events-none select-none opacity-[0.04]">
            <span
              className="material-symbols-outlined text-[#e9c349]"
              style={{ fontSize: "56px", fontVariationSettings: "'FILL' 1" }}
            >
              fort
            </span>
          </div>

          {/* Thin gold rule at top of strip */}
          <div
            className="absolute top-0 left-5 right-5 h-px"
            style={{
              background:
                "linear-gradient(90deg, rgba(233,195,73,0.25), transparent)",
            }}
          />

          {/* Founder badge — top, red */}
          <span
            className="inline-block px-2.5 py-0.5 rounded-md mb-1.5 text-[10px] font-black uppercase tracking-[0.14em]"
            style={{
              background: "rgba(220,38,38,0.2)",
              border: "1px solid rgba(220,38,38,0.38)",
              color: "#fca5a5",
            }}
          >
            {tx.founderBadge}
          </span>

          {/* Role badge — below founder */}
          <div className="mb-2">
            <span
              className="inline-block px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-[0.08em]"
              style={{
                background: "rgba(162,209,187,0.09)",
                border: "1px solid rgba(162,209,187,0.2)",
                color: "#a2d1bb",
              }}
            >
              {founder.role}
            </span>
          </div>

          {/* Name */}
          <h3 className="font-black text-[#e3e3de] text-[20px] tracking-[-0.02em] leading-tight mb-0 transition-transform duration-300 group-hover:-translate-y-0.5">
            {founder.name}
          </h3>

          {/* View profile hint */}
          <p className="text-[10px] text-[#a2d1bb] font-semibold tracking-[0.06em] mt-1 opacity-0 group-hover:opacity-60 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
            {tx.viewProfile}
          </p>
        </div>
      </TiltCard>
    </motion.div>
  );
}

/* ─── Section ───────────────────────────────────────────── */
export default function FoundersSection() {
  const { lang } = useLang();
  const tx = t[lang].founders;
  const [activeFounder, setActiveFounder] = useState(null);

  // Merge static meta with translated name/role/bio
  const founders = foundersMeta.map((meta, i) => ({
    id: i,
    ...meta,
    ...tx.members[i],
  }));

  return (
    <section className="px-4 sm:px-8 pb-12 sm:pb-20 md:pb-24">
      <div className="max-w-6xl mx-auto">
        {/* ── Header ── */}
        <motion.div
          className="mb-10 sm:mb-14 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
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
              groups
            </span>
          </div>

          <span className="block text-[#e9c349] font-black tracking-[0.2em] uppercase text-[12px] mb-3">
            {tx.eyebrow}
          </span>

          <h2
            className="font-extrabold text-[#e3e3de] leading-[1.1] tracking-[-0.02em]"
            style={{ fontSize: "clamp(28px, 4vw, 52px)" }}
          >
            {tx.headline}{" "}
            <em className="text-[#a2d1bb] italic">{tx.headlineAccent}</em>
          </h2>

          <p className="mt-4 text-[14px] sm:text-[16px] text-[#c0c8c3] max-w-[480px] mx-auto leading-relaxed">
            {tx.subtitle}
          </p>
        </motion.div>

        {/* ── Cards grid ── */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.13, delayChildren: 0.05 },
            },
          }}
        >
          {founders.map((founder, index) => (
            <FounderCard
              key={founder.id}
              founder={founder}
              index={index}
              onOpen={setActiveFounder}
              tx={tx}
            />
          ))}
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeFounder && (
          <FounderModal
            founder={activeFounder}
            onClose={() => setActiveFounder(null)}
            tx={tx}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
