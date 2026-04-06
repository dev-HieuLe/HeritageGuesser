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
import Tutorial from "./Components/Tutorial/Tutorial";
import PageWrapper from "./Components/Animations/PageWrapper";

import "leaflet/dist/leaflet.css";

export default function App() {
  const location = useLocation();

  const isAuthPage = ["/login", "/register", "/forgot-password"].includes(
    location.pathname,
  );

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
      </Routes>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-[#000221] via-[#000221] to-[#2B2440]">
      {/* Sidebar (fixed width) */}
      <aside className="w-64 shrink-0 border-r border-[#2B2B44]/40 z-20 h-full">
        <Sidebar />
      </aside>

      {/* Main content area */}
      <div className="relative flex-1 h-full overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageWrapper>
                  <Homepage />
                </PageWrapper>
              }
            />
            <Route
              path="/rank"
              element={
                <PageWrapper>
                  <RankDashboard />
                </PageWrapper>
              }
            />
            <Route
              path="/game"
              element={
                <PageWrapper>
                  <Game />
                </PageWrapper>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <PageWrapper>
                  <Leaderboard />
                </PageWrapper>
              }
            />
            <Route
              path="/game/rank"
              element={
                <PageWrapper>
                  <RankPlay />
                </PageWrapper>
              }
            />
            <Route
              path="/explore"
              element={
                <PageWrapper>
                  <Discover />
                </PageWrapper>
              }
            />
            <Route
              path="/study"
              element={
                <PageWrapper>
                  <StudyPage />
                </PageWrapper>
              }
            />
            <Route
              path="/tutorial"
              element={
                <PageWrapper>
                  <Tutorial />
                </PageWrapper>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
}
