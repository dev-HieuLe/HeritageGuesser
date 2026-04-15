import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Homepage from "./Components/Homepage/Homepage";
import RankDashboard from "./Components/Rank/Rank";
import RankPlay from "./Components/Rank/RankPlay";
import Sidebar from "./Components/Sidebar/Sidebar";
import Login from "./Components/Login";
import Signup from "./Components/Register";
import Game from "./Components/Game/Game";
import Leaderboard from "./Components/Leaderboard/Leaderboard";
import Discover from "./Components/Discover/Discover";
import StudyPage from "./Components/Study/Studypage";
import LessonDetail from "./Components/Study/LessonDetail";
import Tutorial from "./Components/Tutorial/Tutorial";
import ContributeHeritage from "./Components/Contribute/ContributeHeritage";
import Settings from "./Components/Settings/Settings";
import AuthCallback from "./Components/AuthCallback";
import PageWrapper from "./Components/Animations/PageWrapper";
import Navbar from "./Components/Navbar";

import "leaflet/dist/leaflet.css";

export default function App() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(location.pathname === "/study");
  const ease = "all 0.3s cubic-bezier(0.4,0,0.2,1)";

  // Auto-open sidebar when navigating to /study, leave it alone on other pages
  useEffect(() => {
    if (location.pathname === "/study") {
      setSidebarOpen(true);
    }
  }, [location.pathname]);

  // OAuth callback — no navbar, no sidebar
  if (location.pathname === "/auth/callback") {
    return (
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    );
  }

  // Full-screen game pages — no navbar or sidebar
  const isGamePage = ["/game", "/game/rank"].includes(location.pathname);
  if (isGamePage) {
    return (
      <Routes location={location} key={location.pathname}>
        <Route path="/game" element={<Game />} />
        <Route path="/game/rank" element={<RankPlay />} />
      </Routes>
    );
  }

  // Homepage manages its own navbar and sidebar
  if (location.pathname === "/") {
    return (
      <Routes>
        <Route path="/" element={<PageWrapper><Homepage /></PageWrapper>} />
      </Routes>
    );
  }

  // All other pages: shared navbar + sidebar + content offset
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#12140e" }}>
      {/* Navbar fixed at top */}
      <Navbar onMenuClick={() => setSidebarOpen((v) => !v)} />

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — starts below navbar via CSS */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content — slides right when sidebar is open */}
      <div
        className="pt-16 sm:pt-[73px] min-h-screen overflow-y-auto"
        style={{ marginLeft: sidebarOpen ? "256px" : "0px", transition: ease, scrollPaddingTop: "128px" }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/login"       element={<PageWrapper><Login /></PageWrapper>} />
            <Route path="/register"    element={<PageWrapper><Signup /></PageWrapper>} />
            <Route path="/rank"        element={<PageWrapper><RankDashboard /></PageWrapper>} />
            <Route path="/leaderboard" element={<PageWrapper><Leaderboard /></PageWrapper>} />
            <Route path="/explore"     element={<PageWrapper><Discover /></PageWrapper>} />
            <Route path="/study"       element={<PageWrapper><StudyPage /></PageWrapper>} />
            <Route path="/study/:id"   element={<PageWrapper><LessonDetail /></PageWrapper>} />
            <Route path="/tutorial"    element={<PageWrapper><Tutorial /></PageWrapper>} />
            <Route path="/contribute"  element={<PageWrapper><ContributeHeritage /></PageWrapper>} />
            <Route path="/settings"   element={<PageWrapper><Settings /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
}
