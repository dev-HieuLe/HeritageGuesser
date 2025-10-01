// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Homepage from "./Components/Homepage/Homepage";
import RankPlay from "./Components/Rank/Rank";
import Sidebar from "./Components/Sidebar/Sidebar";
import Login from "./Components/Login";
import Signup from "./Components/Register";
import { AuthProvider } from "./Context/authContext";
import { useLocation } from "react-router-dom";
import Game from "./Components/Game/Game";

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
    <div className="flex h-screen bg-gradient-to-br from-[#141021] via-[#1C1530] to-[#2B2440]">
        <aside className="w-64 h-screen"> 
          <Sidebar />
        </aside>
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/rank" element={<RankPlay />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/game" element={<Game />} />
          </Routes>
        </main>
    </div>
  );
}
