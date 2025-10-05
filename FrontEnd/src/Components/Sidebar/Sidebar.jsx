import React from "react";
import { Link } from "react-router-dom";
import { Home, Settings, HelpCircle, Zap } from "lucide-react";
import { FaMapMarkerAlt, FaUserFriends, FaLayerGroup, FaBookOpen } from "react-icons/fa";

export default function Sidebar() {
  return (
    <aside className="w-60 backdrop-blur-sm flex flex-col justify-between py-6 h-full">
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
            className="group flex items-center space-x-3 px-6 py-2 hover:bg-[#1D1633] rounded-lg cursor-pointer transition transform hover:scale-105"
          >
            <Home
              size={25}
              className="group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_#A78BFA] transition-transform"
            />
            <span className="text-md group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_#A78BFA] transition-transform">
              Home
            </span>
          </Link>

          <Link
            to="/rank"
            className="group flex items-center space-x-3 px-6 py-2 hover:bg-[#1D1633] rounded-lg cursor-pointer transition transform hover:scale-105"
          >
            <FaUserFriends
              size={22}
              className="group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_#A78BFA] transition-transform"
            />
            <span className="text-md group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_#A78BFA] transition-transform">
              Rank
            </span>
          </Link>

          <Link
            to="/leaderboard"
            className="group flex items-center space-x-3 px-6 py-2 hover:bg-[#1D1633] rounded-lg cursor-pointer transition transform hover:scale-105"
          >
            <FaLayerGroup
              size={20}
              className="group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_#A78BFA] transition-transform"
            />
            <span className="text-md group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_#A78BFA] transition-transform">
              Leader Board
            </span>
          </Link>

          <Link
            to="/explore"
            className="group flex items-center space-x-3 px-6 py-2 hover:bg-[#1D1633] rounded-lg cursor-pointer transition transform hover:scale-105"
          >
            <FaMapMarkerAlt
              size={21}
              className="group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_#A78BFA] transition-transform"
            />
            <span className="text-md group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_#A78BFA] transition-transform">
              Explore
            </span>
          </Link>

          <Link
            to="/study"
            className="group flex items-center space-x-3 px-6 py-2 hover:bg-[#1D1633] rounded-lg cursor-pointer transition transform hover:scale-105"
          >
            <FaBookOpen
              size={21}
              className="group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_#A78BFA] transition-transform"
            />
            <span className="text-md group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_#A78BFA] transition-transform">
              Study
            </span>
          </Link>

          {/* 🔥 GUESS NOW button */}
          <div className="mt-6 px-3">
            <Link
              to="/game"
              className="group w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#3B82F6] via-[#06B6D4] to-[#22D3EE] hover:from-[#60A5FA] hover:via-[#22D3EE] hover:to-[#67E8F9] text-white font-bold py-3 rounded-xl shadow-lg shadow-cyan-900/40 transition transform hover:scale-110 hover:shadow-cyan-500/50"
            >
              <Zap
                size={18}
                className="animate-pulse group-hover:scale-125 group-hover:drop-shadow-[0_0_8px_#67E8F9] transition-transform"
              />
              <span className="group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_#67E8F9] transition-transform">
                GUESS NOW
              </span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Bottom Items */}
      <div className="space-y-2 px-3 text-white">
        <Link
          to="/settings"
          className="group flex items-center space-x-3 px-3 py-2 hover:bg-[#1D1633] rounded-lg cursor-pointer transition transform hover:scale-105"
        >
          <Settings
            size={25}
            className="group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_#A78BFA] transition-transform"
          />
          <span className="text-sm group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_#A78BFA] transition-transform">
            Settings
          </span>
        </Link>

        <Link
          to="/support"
          className="group flex items-center space-x-3 px-3 py-2 hover:bg-[#1D1633] rounded-lg cursor-pointer transition transform hover:scale-105"
        >
          <HelpCircle
            size={25}
            className="group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_#A78BFA] transition-transform"
          />
          <span className="text-sm group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_#A78BFA] transition-transform">
            Support
          </span>
        </Link>
      </div>
    </aside>
  );
}
