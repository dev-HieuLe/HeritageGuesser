import { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import AuthToast from "../Components/UI/AuthToast";

export const AuthContext = createContext();

// ── Points toast notification ────────────────────────────────────────────────
function PointsToast({ amount, reason, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        top: "84px",
        right: "20px",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 18px",
        borderRadius: "14px",
        background: "rgba(8, 26, 18, 0.97)",
        border: "1px solid rgba(233,195,73,0.35)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        fontFamily: "'Be Vietnam Pro', sans-serif",
        animation: "slideInRight 0.35s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <span
        className="material-symbols-outlined"
        style={{ color: "#e9c349", fontSize: "22px", fontVariationSettings: "'FILL' 1" }}
      >
        stars
      </span>
      <div>
        <p style={{ color: "#e9c349", fontWeight: 800, fontSize: "15px", margin: 0, lineHeight: 1.2 }}>
          +{amount} pts
        </p>
        <p style={{ color: "#a2d1bb", fontSize: "11px", margin: 0, marginTop: "2px" }}>{reason}</p>
      </div>
    </div>
  );
}

const INACTIVITY_LIMIT = 5 * 60 * 1000;   // 5 minutes
const REFRESH_INTERVAL = 13 * 60 * 1000;  // refresh token every 13 min (access token lives 15 min)
const TICK_INTERVAL    = 30 * 1000;        // check every 30 seconds

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authCheckedOnce, setAuthCheckedOnce] = useState(false);
  const [wasLoggedInBefore, setWasLoggedInBefore] = useState(false);
  const [authNotification, setAuthNotification] = useState(null);
  const [pointsToast, setPointsToast] = useState(null);
  const pointsToastTimer = useRef(null);
  const checkinDoneRef = useRef(false);
  const lastActivityRef = useRef(Date.now());
  const lastRefreshRef  = useRef(Date.now());
  const authRef         = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();

  // ── Show a points earned toast ─────────────────────────────────────────────
  const showPointsToast = (amount, reason) => {
    if (pointsToastTimer.current) clearTimeout(pointsToastTimer.current);
    setPointsToast({ amount, reason });
  };

  // ── Call API + update state + show toast ───────────────────────────────────
  const addPoints = async (amount, reason = "") => {
    // Optimistic update — show toast and increment immediately
    setUser((u) => {
      if (!u) return u;
      return { ...u, points: (u.points || 0) + amount };
    });
    showPointsToast(amount, reason);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/player/add-points`,
        { amount },
        { withCredentials: true }
      );
      // Confirm with server's authoritative value (handles NULL column edge case)
      if (res.data.points != null && res.data.points > 0) {
        setUser((u) => u ? { ...u, points: res.data.points } : u);
      }
    } catch (err) {
      console.error("Failed to add points:", err);
      // Optimistic update stays — don't revert, UX is better
    }
  };

  // Keep authRef in sync so interval callbacks can read it without stale closure
  useEffect(() => { authRef.current = auth; }, [auth]);

  // ── Activity tracking + inactivity logout + proactive token refresh ──────────
  useEffect(() => {
    const updateActivity = () => { lastActivityRef.current = Date.now(); };

    const EVENTS = ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "click"];
    EVENTS.forEach((e) => window.addEventListener(e, updateActivity, { passive: true }));

    const tick = setInterval(async () => {
      if (!authRef.current) return;

      const now = Date.now();
      const idle = now - lastActivityRef.current;

      // Sign out if inactive for too long
      if (idle >= INACTIVITY_LIMIT) {
        clearInterval(tick);
        setAuth(false);
        setUser(null);
        setWasLoggedInBefore(false);
        checkinDoneRef.current = false;
        try {
          await axios.get(`${import.meta.env.VITE_API_BASE_URL}/logout`, { withCredentials: true });
        } catch (_) {}
        navigate("/login");
        return;
      }

      // Proactively refresh access token while user is active
      if (now - lastRefreshRef.current >= REFRESH_INTERVAL) {
        const ok = await tryRefreshToken();
        if (ok) lastRefreshRef.current = Date.now();
      }
    }, TICK_INTERVAL);

    return () => {
      clearInterval(tick);
      EVENTS.forEach((e) => window.removeEventListener(e, updateActivity));
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Refresh token if access token expired
  const tryRefreshToken = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/refresh-token`,
        {},
        { withCredentials: true }
      );
      if (res.data.status === "Success") {
        return true;
      }
    } catch (err) {
      if (err.response?.data?.error !== "No refresh token") return;
      console.error(
        "❌ Failed to refresh token",
        err.response?.data || err.message
      );
    }
    return false;
  };

  // Check token session
  const checkAuth = async (showAlert = false) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/player`,
        {
          withCredentials: true,
        }
      );
      if (res.status === 200 && res.data?.name) {
        setAuth(true);
        setUser({
          id: res.data.id,
          name: res.data.name,
          email: res.data.email,
          level: res.data.level,
          rank: res.data.rank,
          rank_progress: res.data.rank_progress,
          avatar_url: res.data.avatar_url || null,
          points: res.data.points ?? 0,
          max_play: res.data.max_play ?? 15,
          subscription_plan: res.data.subscription_plan ?? "basic",
        });

        setWasLoggedInBefore(true);
        setLoading(false);
        setAuthCheckedOnce(true);
        lastActivityRef.current = Date.now();
        lastRefreshRef.current  = Date.now();
      }
    } catch (err) {
      if (err.response?.status === 401) {
        if (showAlert) {
          setAuthNotification("You are not authorized. Please log in to continue.");
          navigate("/login");
          setAuth(false);
          setUser(null);
        }
      } else {
        console.warn("⚠️ Token might be expired, trying refresh...");
        const refreshed = await tryRefreshToken();
        if (refreshed) {
          return await checkAuth();
        } else {
          setAuth(false);
          setUser(null);
        }
      }
    } finally {
      setAuthCheckedOnce(true);
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_API_BASE_URL}/logout`, {
        withCredentials: true,
      });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setAuth(false);
      setUser(null);
      setWasLoggedInBefore(false);
      checkinDoneRef.current = false;
    }
  };

  // Run checkAuth on path change
  useEffect(() => {
    const protectedPaths = ["/rank", "/game/rank", "/settings"];
    const isProtected = protectedPaths.some((path) =>
      location.pathname.startsWith(path)
    );
    checkAuth(isProtected); // only alert on protected routes
  }, [location.pathname]);


  // Daily check-in is triggered externally (by playing a rank game)
  // claimDailyCheckin returns true if this is the first claim today
  const claimDailyCheckin = () => {
    if (!user?.id) return false;
    const today = new Date().toDateString();
    const key = `checkin_${user.id}_${today}`;
    if (localStorage.getItem(key)) return false;
    localStorage.setItem(key, "1");
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        user,
        setUser,
        loading,
        authCheckedOnce,
        wasLoggedInBefore,
        setWasLoggedInBefore,
        logout,
        addPoints,
        showPointsToast,
        claimDailyCheckin,
      }}
    >
      {children}
      {authNotification && (
        <AuthToast
          message={authNotification}
          onClose={() => setAuthNotification(null)}
        />
      )}
      {pointsToast && (
        <PointsToast
          amount={pointsToast.amount}
          reason={pointsToast.reason}
          onDone={() => setPointsToast(null)}
        />
      )}
    </AuthContext.Provider>
  );
};
