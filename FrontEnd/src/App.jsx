// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Homepage from "./Components/Homepage/Homepage";
import RankDashboard from "./Components/Rank/Rank";
import RankPlay from "./Components/Rank/RankPlay";
import Sidebar from "./Components/Sidebar/Sidebar";
import Login from "./Components/Login";
import Signup from "./Components/Register";
import { AuthProvider } from "./Context/authContext";
import { useLocation } from "react-router-dom";
import Game from "./Components/Game/Game";
import Leaderboard from "./Components/Leaderboard/Leaderboard";
import Discover from "./Components/Discover/Discover";
import StudyPage from "./Components/Study/Studypage";

export default function App() {
  const location = useLocation();
  const isAuthPage = ["/login", "/register", "/forgot-password"].includes(location.pathname);
  if (isAuthPage) {
    return (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
        </Routes>
    );
  }
  return (
    <div className="flex h-full bg-gradient-to-br from-[#000221] via-[#000221] to-[#2B2440]">
        <aside className="w-64"> 
          <Sidebar />
        </aside>
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/rank" element={<RankDashboard/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/game" element={<Game />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/game/rank" element={<RankPlay />} />
            <Route path="/explore" element={<Discover/>} />
            <Route path="/study" element={<StudyPage/>} />
          </Routes>
        </main>
    </div>
  );
}
