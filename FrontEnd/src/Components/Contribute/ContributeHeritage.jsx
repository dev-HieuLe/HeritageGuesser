import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../Context/authContext";
import { useLang } from "../../Context/languageContext";
import t from "../../translations";

const API = import.meta.env.VITE_API_BASE_URL;

/* ─────────────────────────────────────────────────────────
   Status badge helper
───────────────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const map = {
    pending: {
      label: "Pending Review",
      bg: "bg-[#0f3d2e]",
      text: "text-[#e9c349]",
      dot: "bg-[#e9c349]",
      pulse: true,
    },
    accepted: {
      label: "Approved",
      bg: "bg-primary-container",
      text: "text-[#a2d1bb]",
      dot: "bg-[#a2d1bb]",
      pulse: false,
    },
    rejected: {
      label: "Rejected",
      bg: "bg-error-container",
      text: "text-[#ffb4ab]",
      dot: null,
      pulse: false,
    },
  };
  const s = map[status] ?? map.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter ${s.bg} ${s.text}`}
    >
      {s.dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${s.dot} ${s.pulse ? "animate-pulse" : ""}`}
        />
      )}
      {s.label}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────
   Toast notification
───────────────────────────────────────────────────────── */
function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDismiss, 5000);
    return () => clearTimeout(t);
  }, [toast, onDismiss]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key="toast"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-24 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl
            ${
              toast.type === "success"
                ? "bg-[#0f3d2e]/90 border-[#a2d1bb]/20 text-[#a2d1bb]"
                : "bg-[#93000a]/90 border-[#ffb4ab]/20 text-[#ffb4ab]"
            }`}
        >
          <span className="material-symbols-outlined text-xl">
            {toast.type === "success" ? "check_circle" : "error"}
          </span>
          <p className="text-sm font-medium max-w-sm">{toast.message}</p>
          <button
            onClick={onDismiss}
            className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────
   Contribution card
───────────────────────────────────────────────────────── */
function ContributionCard({ item }) {
  const date = new Date(item.created_at).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className="p-5 rounded-2xl shadow-lg hover:translate-x-1 transition-transform cursor-pointer"
      style={{
        background: "rgba(26, 33, 31, 0.7)",
        backdropFilter: "blur(20px)",
        borderLeft: `4px solid ${
          item.status === "accepted"
            ? "#a2d1bb"
            : item.status === "rejected"
              ? "rgba(255,180,171,0.5)"
              : "#e9c349"
        }`,
        borderTop: "1px solid rgba(65,73,68,0.15)",
        borderRight: "1px solid rgba(65,73,68,0.15)",
        borderBottom: "1px solid rgba(65,73,68,0.15)",
      }}
    >
      <div className="flex justify-between items-start mb-3">
        <StatusBadge status={item.status} />
        <span className="text-[10px] text-[#c0c8c3] font-label">{date}</span>
      </div>
      <h4 className="text-base font-headline font-bold text-[#dde4e0] leading-tight">
        {item.name}
      </h4>
      {item.region && (
        <p className="text-xs text-[#c0c8c3] mt-1 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">
            location_on
          </span>
          {item.region}, Vietnam
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Modal — Anchor a New Heritage
───────────────────────────────────────────────────────── */
function AnchorModal({ onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [mapsUrl, setMapsUrl] = useState("");
  const [userDescription, setUserDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState({});
  const recaptchaRef = useRef(null);
  const isMobile = window.innerWidth < 768;

  const validate = () => {
    const errors = {};
    if (!name.trim()) errors.name = "Heritage name is required.";
    else if (name.trim().length > 255)
      errors.name = "Name too long (max 255 chars).";

    if (!mapsUrl.trim()) {
      errors.mapsUrl = "Google Maps URL is required.";
    } else {
      try {
        const u = new URL(mapsUrl.trim());
        const validHosts = [
          "www.google.com",
          "maps.google.com",
          "goo.gl",
          "maps.app.goo.gl",
        ];
        if (!validHosts.includes(u.hostname)) {
          errors.mapsUrl = "Must be a Google Maps URL (google.com/maps/...).";
        }
      } catch {
        errors.mapsUrl = "Please enter a valid URL.";
      }
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length) {
      setFieldError(errors);
      return;
    }
    const recaptchaToken = isMobile ? null : recaptchaRef.current?.getValue();
    if (!isMobile && !recaptchaToken) {
      setFieldError({ ...errors, recaptcha: "Please tick the reCAPTCHA box." });
      return;
    }

    setFieldError({});
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${API}/contribute`,
        {
          name: name.trim(),
          mapsUrl: mapsUrl.trim(),
          userDescription: userDescription.trim(),
          ...(isMobile ? { type: "mobile" } : { recaptchaToken }),
        },
        { withCredentials: true },
      );
      onSuccess(data.message);
      onClose();
    } catch (err) {
      recaptchaRef.current?.reset();
      const msg =
        err.response?.data?.error || "Something went wrong. Please try again.";
      onSuccess(msg, "error");
      if (err.response?.status !== 500) onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-2xl rounded-3xl overflow-hidden relative shadow-[0px_24px_48px_rgba(0,0,0,0.6)]"
        style={{
          background: "rgba(36, 43, 41, 0.95)",
          backdropFilter: "blur(32px)",
          border: "1px solid rgba(65,73,68,0.2)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#c0c8c3] hover:text-[#e9c349] transition-colors z-10"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        <div className="p-10">
          <div className="mb-8 text-center">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 border border-[#e9c349]/20"
              style={{ background: "rgba(233,195,73,0.1)" }}
            >
              <span
                className="material-symbols-outlined text-3xl text-[#e9c349]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                foundation
              </span>
            </div>
            <h2 className="font-headline text-3xl font-extrabold text-[#e3e3de]">
              Anchor a New Heritage
            </h2>
            <p className="text-[#c0c8c3] mt-2 text-sm">
              Fill the scrolls with the wisdom of the past.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-[#e9c349] mb-2">
                Heritage Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Imperial Citadel of Thang Long"
                className={`w-full rounded-xl px-4 py-4 text-[#e3e3de] placeholder:text-[#c0c8c3]/30 transition-all outline-none focus:ring-1 focus:ring-[#e9c349]
                  ${fieldError.name ? "ring-1 ring-[#ffb4ab]" : ""}`}
                style={{ background: "#09100e", border: "none" }}
              />
              {fieldError.name && (
                <p className="mt-1 text-xs text-[#ffb4ab]">{fieldError.name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-[#e9c349] mb-2">
                Google Street View URL
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={mapsUrl}
                  onChange={(e) => setMapsUrl(e.target.value)}
                  placeholder="https://www.google.com/maps/place/..."
                  className={`w-full rounded-xl px-4 py-4 pl-12 text-[#e3e3de] placeholder:text-[#c0c8c3]/30 transition-all outline-none focus:ring-1 focus:ring-[#e9c349]
                    ${fieldError.mapsUrl ? "ring-1 ring-[#ffb4ab]" : ""}`}
                  style={{ background: "#09100e", border: "none" }}
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#c0c8c3]/50">
                  streetview
                </span>
              </div>
              {fieldError.mapsUrl ? (
                <p className="mt-1 text-xs text-[#ffb4ab]">
                  {fieldError.mapsUrl}
                </p>
              ) : (
                <p className="mt-1 text-xs text-[#c0c8c3]/60">
                  Open Google Maps → find the location → copy the full URL from
                  your browser.
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-[#e9c349] mb-2">
                Cultural Significance{" "}
                <span className="normal-case font-normal text-[#c0c8c3]/50">
                  (optional — AI will generate if left blank)
                </span>
              </label>
              <textarea
                value={userDescription}
                onChange={(e) => setUserDescription(e.target.value)}
                placeholder="Detail the historical importance, architectural style, or local lore…"
                rows={4}
                className="w-full rounded-xl px-4 py-4 text-[#e3e3de] placeholder:text-[#c0c8c3]/30 transition-all outline-none focus:ring-1 focus:ring-[#e9c349] resize-none"
                style={{ background: "#09100e", border: "none" }}
              />
            </div>

            {!isMobile && (
              <div className="flex flex-col items-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={import.meta.env.VITE_RECAPTCHA_V2_SITE_KEY}
                  theme="dark"
                  onChange={() =>
                    setFieldError((prev) => ({ ...prev, recaptcha: "" }))
                  }
                />
                {fieldError.recaptcha && (
                  <p className="mt-1.5 text-xs text-[#ffb4ab]">
                    {fieldError.recaptcha}
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 rounded-xl font-headline font-bold text-[#dde4e0] transition-all border border-[#414944]/10 hover:bg-[#333b38]"
                style={{ background: "#2f3634" }}
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] py-4 rounded-xl font-headline font-bold text-[#073829] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-[#a2d1bb]/20 disabled:opacity-60"
                style={{
                  background: loading
                    ? "#1a211f"
                    : "linear-gradient(135deg, #0f3d2e, #a2d1bb)",
                }}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray="31.4"
                        strokeDashoffset="10"
                      />
                    </svg>
                    <span className="text-[#a2d1bb]">Submitting…</span>
                  </>
                ) : (
                  "Contribute to Archive"
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Star rating widget
───────────────────────────────────────────────────────── */
function StarRating({ value, onChange, readonly = false, size = "text-xl" }) {
  const [hovered, setHovered] = useState(null);
  const display = hovered ?? value ?? 0;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = display >= star;
        const half = !filled && display >= star - 0.5;
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            className={`${size} leading-none transition-transform ${readonly ? "cursor-default" : "hover:scale-110"}`}
            style={{ color: filled || half ? "#e9c349" : "#2f3634", background: "none", border: "none", padding: 0 }}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(null)}
            onClick={() => !readonly && onChange && onChange(star)}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: filled ? "'FILL' 1" : half ? "'FILL' 0" : "'FILL' 0", fontSize: "inherit" }}
            >
              {half ? "star_half" : "star"}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Community location card with rating
───────────────────────────────────────────────────────── */
const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function CommunityCard({ item, auth, onRated }) {
  const [submitting, setSubmitting] = useState(false);
  const [myRating, setMyRating] = useState(item.my_rating ?? null);
  const [avgStars, setAvgStars] = useState(item.stars ?? 0);
  const [imgError, setImgError] = useState(false);

  const streetViewThumb =
    item.lat && item.lng && MAPS_KEY && !imgError
      ? `https://maps.googleapis.com/maps/api/streetview?size=600x280&location=${item.lat},${item.lng}&fov=90&key=${MAPS_KEY}`
      : null;

  const handleRate = async (star) => {
    if (!auth) return;
    setSubmitting(true);
    try {
      const { data } = await axios.post(
        `${API}/contribute/rate/${item.id}`,
        { rating: star },
        { withCredentials: true },
      );
      setMyRating(data.my_rating);
      setAvgStars(data.stars);
      onRated?.();
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  };

  const initials = (item.contributor_name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: "rgba(26,33,31,0.7)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(65,73,68,0.15)",
      }}
    >
      {/* Street View thumbnail */}
      <div className="relative w-full h-40 bg-[#09100e] flex items-center justify-center overflow-hidden">
        {streetViewThumb ? (
          <img
            src={streetViewThumb}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="material-symbols-outlined text-4xl text-[#414944]">
            panorama
          </span>
        )}
        {/* Status badge overlay */}
        <div className="absolute top-2 right-2">
          <StatusBadge status={item.status} />
        </div>
        {/* Open in Maps button */}
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold text-[#073829] hover:scale-105 transition-transform"
            style={{ background: "rgba(162,209,187,0.9)" }}
          >
            <span className="material-symbols-outlined text-[13px]">open_in_new</span>
            Open in Maps
          </a>
        )}
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* Name */}
        <h4 className="text-sm font-headline font-bold text-[#dde4e0] leading-tight">
          {item.name}
        </h4>

        {/* Region */}
        {item.region && (
          <p className="text-xs text-[#c0c8c3] flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">location_on</span>
            {item.region}, Vietnam
          </p>
        )}

        {/* Description */}
        {item.description && (
          <p className="text-xs text-[#c0c8c3] leading-relaxed line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Contributor */}
        <div className="flex items-center gap-2 pt-1">
          {item.contributor_avatar ? (
            <img
              src={item.contributor_avatar}
              alt={item.contributor_name}
              className="w-5 h-5 rounded-full object-cover"
            />
          ) : (
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-[#073829]"
              style={{ background: "linear-gradient(135deg,#0f3d2e,#a2d1bb)" }}
            >
              {initials}
            </div>
          )}
          <span className="text-[11px] text-[#c0c8c3]/70">
            by <span className="text-[#a2d1bb] font-medium">{item.contributor_name || "Unknown"}</span>
          </span>
        </div>

        {/* Rating row */}
        <div className="flex items-center justify-between pt-2 mt-auto border-t border-[#414944]/20">
          <div className="flex items-center gap-1.5">
            <StarRating value={avgStars} readonly size="text-sm" />
            <span className="text-xs text-[#c0c8c3]">
              {avgStars > 0 ? avgStars.toFixed(1) : "—"}
            </span>
          </div>

          {auth ? (
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-[#c0c8c3]/50">
                {myRating ? "Rated:" : "Rate:"}
              </span>
              <StarRating
                value={myRating ?? 0}
                onChange={submitting ? undefined : handleRate}
                size="text-sm"
              />
            </div>
          ) : (
            <span className="text-[10px] text-[#c0c8c3]/40 italic">Log in to rate</span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────────────── */
export default function ContributeHeritage() {
  const { user, auth, addPoints } = useContext(AuthContext);
  const { lang } = useLang();
  const tx = t[lang];
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [loadingContribs, setLoadingContribs] = useState(true);
  const [tutorialPlaying, setTutorialPlaying] = useState(false);
  const [allLocations, setAllLocations] = useState([]);
  const [loadingAll, setLoadingAll] = useState(true);
  const [communitySearch, setCommunitySearch] = useState("");

  const tutorialEmbedUrl =
    "https://www.youtube.com/embed/o0pVcJJC31A?si=8QN7blbT3itKOvL2&autoplay=1&rel=0";

  const tutorialThumbnail =
    "https://img.youtube.com/vi/o0pVcJJC31A/hqdefault.jpg";

  const fetchContributions = async () => {
    if (!auth) return;
    setLoadingContribs(true);
    try {
      const { data } = await axios.get(`${API}/contribute`, {
        withCredentials: true,
      });
      setContributions(data);
    } catch {
      // silently fail — user may not be logged in
    } finally {
      setLoadingContribs(false);
    }
  };

  const fetchAllLocations = async () => {
    setLoadingAll(true);
    try {
      const { data } = await axios.get(`${API}/contribute/all`, {
        withCredentials: true,
      });
      setAllLocations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetchAllLocations failed:", err.response?.status, err.response?.data || err.message);
    } finally {
      setLoadingAll(false);
    }
  };

  useEffect(() => {
    fetchContributions();
    fetchAllLocations();
  }, [auth]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleSuccess = (message, type = "success") => {
    showToast(message, type);
    if (type === "success") {
      fetchContributions();
      addPoints(10, "Heritage Contribution");
    }
  };

  const stats = {
    total: contributions.length,
    approved: contributions.filter((c) => c.status === "accepted").length,
    pending: contributions.filter((c) => c.status === "pending").length,
    rejected: contributions.filter((c) => c.status === "rejected").length,
  };

  const filteredLocations = communitySearch.trim()
    ? allLocations.filter(
        (l) =>
          l.name.toLowerCase().includes(communitySearch.toLowerCase()) ||
          (l.region ?? "").toLowerCase().includes(communitySearch.toLowerCase()),
      )
    : allLocations;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#0e1513", color: "#dde4e0" }}
    >
      <div
        className="fixed -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "rgba(233,195,73,0.05)", filter: "blur(120px)" }}
      />
      <div
        className="fixed top-1/2 -left-48 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "rgba(162,209,187,0.05)", filter: "blur(150px)" }}
      />

      <Toast toast={toast} onDismiss={() => setToast(null)} />

      <AnimatePresence>
        {modalOpen && (
          <AnchorModal
            onClose={() => setModalOpen(false)}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 space-y-14">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-16">
          <div className="lg:col-span-7 space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl lg:text-7xl font-headline font-extrabold tracking-tighter leading-none text-[#dde4e0]"
            >
              {tx.contribute.legacyHeading[0]}{" "}
              <span className="text-[#e9c349] italic">{tx.contribute.legacyHeading[1]}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-[#c0c8c3] max-w-xl leading-relaxed"
            >
              {tx.contribute.heroDesc}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <button
                onClick={() => {
                  if (!auth) {
                    showToast(
                      "Please log in to contribute heritage sites.",
                      "error",
                    );
                    return;
                  }
                  setModalOpen(true);
                }}
                className="px-8 py-5 rounded-xl font-headline font-bold text-lg flex items-center gap-3 hover:scale-105 transition-transform shadow-[0_10px_30px_rgba(15,61,46,0.5)]"
                style={{
                  background: "linear-gradient(135deg, #0f3d2e, #a2d1bb)",
                  color: "#073829",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  add_circle
                </span>
                {tx.contribute.registerNewHeritage}
              </button>
            </motion.div>
          </div>

          <div className="lg:col-span-5 relative hidden lg:block">
            <div
              className="aspect-square rounded-full border-2 border-dashed border-[#414944]/20 absolute -inset-4"
              style={{ animation: "spin 60s linear infinite" }}
            />
            <div
              className="aspect-square rounded-full overflow-hidden p-4"
              style={{
                background: "rgba(26,33,31,0.7)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(65,73,68,0.15)",
              }}
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDe3R61LytIrN80GARYfDdhXyOpLiitUY4mfflxEuS1PEpN3oaWA2pk226R7p4gXLZPGrn-hnxb1lINc4qhfuJ9P2nSpw1JKZTbgn0rMWHfXV2e92q32PFe1mtDH5rvF2F2cCofp9aFoR80wIOOHvSUrPJgMO7QYznYQVXIK490N-VouQ1mDh2J1sX_Zt4KYUAY_EvzOYRrMbEkwN4AwZSFO_pp7UmyYeeHbO0QLjyRqGq7IWmUPAAAeDOAJtUYE-84ac9Ll0DrP1p3"
                alt="Ancient Vietnamese bronze drum"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        </section>

        {auth && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {[
              {
                label: tx.contribute.totalSubmitted,
                value: stats.total,
                icon: "inventory_2",
                color: "#a2d1bb",
              },
              {
                label: tx.contribute.approved,
                value: stats.approved,
                icon: "verified",
                color: "#a2d1bb",
              },
              {
                label: tx.contribute.pending,
                value: stats.pending,
                icon: "hourglass_top",
                color: "#e9c349",
              },
              {
                label: tx.contribute.declined,
                value: stats.rejected,
                icon: "cancel",
                color: "#ffb4ab",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl p-5 flex items-center gap-4"
                style={{
                  background: "rgba(26,33,31,0.7)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(65,73,68,0.15)",
                }}
              >
                <span
                  className="material-symbols-outlined text-2xl"
                  style={{ color: s.color }}
                >
                  {s.icon}
                </span>
                <div>
                  <p className="text-2xl font-headline font-extrabold text-[#dde4e0]">
                    {s.value}
                  </p>
                  <p className="text-xs text-[#c0c8c3] uppercase tracking-wider font-label">
                    {s.label}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-headline font-bold text-[#e9c349] flex items-center gap-3">
                  <span className="material-symbols-outlined">movie</span>
                  {tx.contribute.theArtOfArchiving}
                </h3>
                <span className="text-xs font-label uppercase tracking-widest text-[#c0c8c3]">
                  Tutorial Series 01
                </span>
              </div>

              <div
                className="relative group aspect-video rounded-3xl overflow-hidden shadow-2xl"
                style={{
                  background: "rgba(26,33,31,0.7)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(65,73,68,0.1)",
                }}
              >
                {!tutorialPlaying ? (
                  <>
                    <img
                      src={tutorialThumbnail}
                      alt="The Art of Archiving tutorial"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(14,21,19,0.75), rgba(14,21,19,0.25))",
                      }}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
                      <button
                        type="button"
                        onClick={() => setTutorialPlaying(true)}
                        aria-label="Play tutorial video"
                        className="w-20 h-20 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(233,195,73,0.4)] hover:scale-105 transition-transform"
                        style={{ background: "rgba(233,195,73,0.9)" }}
                      >
                        <span
                          className="material-symbols-outlined text-4xl text-[#3c2f00]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          play_arrow
                        </span>
                      </button>

                      <div className="text-center">
                        <p className="text-[#e9c349] font-bold font-headline text-xl">
                          Capturing Coordinates
                        </p>
                        <p className="text-[#c0c8c3] text-sm mt-1">
                          Module 2: Precise Metadata &amp; Environmental
                          Lighting
                        </p>
                      </div>
                    </div>

                    <div className="absolute bottom-4 right-4 flex items-center gap-2">
                      <span className="text-xs text-[#a2d1bb] font-bold">
                        YouTube
                      </span>
                      <div
                        className="w-24 h-1 rounded-full overflow-hidden"
                        style={{ background: "#2f3634" }}
                      >
                        <div
                          className="w-1/3 h-full"
                          style={{ background: "#e9c349" }}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <iframe
                    className="w-full h-full"
                    src={tutorialEmbedUrl}
                    title="The Art of Archiving tutorial video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tx.contribute.cards.map((card) => (
                  <div
                    key={card.title}
                    className="p-6 rounded-2xl flex items-start gap-4"
                    style={{
                      background: "rgba(26,33,31,0.7)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(65,73,68,0.15)",
                    }}
                  >
                    <span className="material-symbols-outlined text-[#e9c349]">
                      {card.icon}
                    </span>
                    <div>
                      <h4 className="font-bold text-[#dde4e0]">{card.title}</h4>
                      <p className="text-xs text-[#c0c8c3] mt-1 leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section
              className="rounded-2xl p-8 space-y-4"
              style={{
                background: "rgba(26,33,31,0.7)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(65,73,68,0.15)",
              }}
            >
              <h4 className="font-headline font-bold text-[#e9c349] flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">
                  help_outline
                </span>
                {tx.contribute.howToGetUrl}
              </h4>
              <ol className="space-y-3 text-sm text-[#c0c8c3]">
                {tx.contribute.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center"
                      style={{ background: "#0f3d2e", color: "#e9c349" }}
                    >
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center justify-between sticky top-24">
              <h3 className="text-2xl font-headline font-bold text-[#dde4e0]">
                {tx.contribute.yourContributions}
              </h3>
              <button
                onClick={fetchContributions}
                className="text-[#c0c8c3] hover:text-[#a2d1bb] transition-colors"
                title="Refresh"
              >
                <span className="material-symbols-outlined">refresh</span>
              </button>
            </div>

            {!auth ? (
              <div
                className="rounded-2xl p-8 text-center"
                style={{
                  background: "rgba(26,33,31,0.7)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(65,73,68,0.15)",
                }}
              >
                <span className="material-symbols-outlined text-4xl text-[#414944] mb-3 block">
                  lock
                </span>
                <p className="text-sm text-[#c0c8c3]">
                  Log in to view and submit your contributions.
                </p>
              </div>
            ) : loadingContribs ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-24 rounded-2xl animate-pulse"
                    style={{ background: "rgba(26,33,31,0.5)" }}
                  />
                ))}
              </div>
            ) : contributions.length === 0 ? (
              <div
                className="rounded-2xl p-8 text-center"
                style={{
                  background: "rgba(26,33,31,0.7)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(65,73,68,0.15)",
                }}
              >
                <span className="material-symbols-outlined text-4xl text-[#414944] mb-3 block">
                  add_location_alt
                </span>
                <p className="text-sm text-[#c0c8c3]">
                  {tx.contribute.noContributions}
                </p>
                <button
                  onClick={() => setModalOpen(true)}
                  className="mt-4 px-5 py-2 rounded-xl text-sm font-bold text-[#073829] transition-all hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #0f3d2e, #a2d1bb)",
                  }}
                >
                  {tx.contribute.submitFirstSite}
                </button>
              </div>
            ) : (
              <div
                className="space-y-4 max-h-[900px] overflow-y-auto pr-1"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#2f3634 #09100e",
                }}
              >
                <AnimatePresence initial={false}>
                  {contributions.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                    >
                      <ContributionCard item={item} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* ── Community Contributed Locations ── */}
        <section className="space-y-6 pb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-2xl font-headline font-bold text-[#dde4e0] flex items-center gap-3">
              <span
                className="material-symbols-outlined text-[#e9c349]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                public
              </span>
              Community Contributed Locations
            </h3>
            <div className="relative">
              <input
                type="text"
                value={communitySearch}
                onChange={(e) => setCommunitySearch(e.target.value)}
                placeholder="Search locations…"
                className="rounded-xl px-4 py-2 pl-10 text-sm text-[#e3e3de] placeholder:text-[#c0c8c3]/40 outline-none focus:ring-1 focus:ring-[#e9c349] w-full sm:w-64"
                style={{ background: "rgba(26,33,31,0.7)", border: "1px solid rgba(65,73,68,0.2)" }}
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#c0c8c3]/50 text-[18px]">
                search
              </span>
            </div>
          </div>

          {loadingAll ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-36 rounded-2xl animate-pulse"
                  style={{ background: "rgba(26,33,31,0.5)" }}
                />
              ))}
            </div>
          ) : allLocations.length === 0 ? (
            <div
              className="rounded-2xl p-10 text-center"
              style={{
                background: "rgba(26,33,31,0.7)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(65,73,68,0.15)",
              }}
            >
              <span className="material-symbols-outlined text-4xl text-[#414944] mb-3 block">
                location_off
              </span>
              <p className="text-sm text-[#c0c8c3]">
                No locations contributed yet. Be the first!
              </p>
            </div>
          ) : filteredLocations.length === 0 ? (
            <p className="text-sm text-[#c0c8c3] text-center py-8">
              No results for "{communitySearch}".
            </p>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
            >
              {filteredLocations.map((item) => (
                <motion.div
                  key={item.id}
                  variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                >
                  <CommunityCard
                    item={item}
                    auth={auth}
                    onRated={fetchAllLocations}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
