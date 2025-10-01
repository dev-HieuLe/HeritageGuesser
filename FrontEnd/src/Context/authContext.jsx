import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { User } from "lucide-react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authCheckedOnce, setAuthCheckedOnce] = useState(false);
  const [wasLoggedInBefore, setWasLoggedInBefore] = useState(false);
  const location = useLocation();

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
        });

        setWasLoggedInBefore(true);
        setLoading(false);
        setAuthCheckedOnce(true);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        if (showAlert) {
          alert(
            "⚠️ You are not authorized. Please refresh the page or login again."
          );
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
    }
  };

  // Run checkAuth on path change
  useEffect(() => {
    const protectedPaths = ["/rank"];
    const isProtected = protectedPaths.some((path) =>
      location.pathname.startsWith(path)
    );
    checkAuth(isProtected); // only alert on protected routes
  }, [location.pathname]);

  // Interval check for protected paths
  useEffect(() => {
    const protectedPaths = ["/rank"];
    const isProtected = protectedPaths.some((path) =>
      location.pathname.startsWith(path)
    );
    if (!isProtected || !wasLoggedInBefore) return;

    const interval = setInterval(() => {
      checkAuth(true); // only alert if in protected route
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [wasLoggedInBefore, location.pathname]);

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
        logout, // ✅ added
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
