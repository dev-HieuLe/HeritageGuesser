import React from "react";
import { Link } from "react-router-dom"; // ✅ import Link
import { Home, Settings, HelpCircle, Zap } from "lucide-react";
import { FaMapMarkerAlt, FaUserFriends, FaLayerGroup } from "react-icons/fa";

export default function Sidebar() {
  return (
    <aside className="w-60 bg-[#171726] backdrop-blur-sm flex flex-col justify-between py-6 ]">
      <div>
        {/* Logo / Title */}
        <div className="px-6 pb-8">
          <h1 className="text-2xl font-bold text-[#A78BFA] tracking-wide">
            HERRITAGE GUESSR
          </h1>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 text-amber-50">
          <Link
            to="/"
            className="flex items-center space-x-3 px-6 py-2 hover:bg-[#1D1633] rounded-lg cursor-pointer transition"
          >
            <Home size={18} />
            <span className="text-md">Home</span>
          </Link>

          <Link
            to="/rank"
            className="flex items-center space-x-3 px-6 py-2 hover:bg-[#1D1633] rounded-lg cursor-pointer transition"
          >
            <FaUserFriends size={18} />
            <span className="text-md">Rank</span>
          </Link>

          <Link
            to="/leaderboard"
            className="flex items-center space-x-3 px-6 py-2 hover:bg-[#1D1633] rounded-lg cursor-pointer transition"
          >
            <FaLayerGroup size={18} />
            <span className="text-md">Leader Board</span>
          </Link>

          <Link
            to="/explore"
            className="flex items-center space-x-3 px-6 py-2 hover:bg-[#1D1633] rounded-lg cursor-pointer transition"
          >
            <FaMapMarkerAlt size={18} />
            <span className="text-md">Explore</span>
          </Link>

          <Link
            to="/study"
            className="flex items-center space-x-3 px-6 py-2 hover:bg-[#1D1633] rounded-lg cursor-pointer transition"
          >
            <FaMapMarkerAlt size={18} />
            <span className="text-md">Study</span>
          </Link>

          {/* 🔥 Standout GUESS NOW button */}
          <div className="mt-6 px-3">
            <Link
              to="/play"
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#3B82F6] via-[#06B6D4] to-[#22D3EE] hover:from-[#60A5FA] hover:via-[#22D3EE] hover:to-[#67E8F9] text-white font-bold py-3 rounded-xl shadow-lg shadow-cyan-900/40 transition transform hover:scale-105"
            >
              <Zap size={18} className="animate-pulse" />
              <span>GUESS NOW</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Bottom Items */}
      <div className="space-y-2 px-3">
        <Link
          to="/settings"
          className="flex items-center space-x-3 px-3 py-2 hover:bg-[#1D1633] rounded-lg cursor-pointer transition"
        >
          <Settings size={18} />
          <span className="text-sm">Settings</span>
        </Link>

        <Link
          to="/support"
          className="flex items-center space-x-3 px-3 py-2 hover:bg-[#1D1633] rounded-lg cursor-pointer transition"
        >
          <HelpCircle size={18} />
          <span className="text-sm">Support</span>
        </Link>
      </div>
    </aside>
  );
}
