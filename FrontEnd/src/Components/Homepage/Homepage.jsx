import React from "react";
import { Search } from "lucide-react";

export default function Homepage() {
  return (
    <div className="h-screen w-screen flex bg-gradient-to-br from-[#141021] via-[#1C1530] to-[#2B2440] text-white font-sans">
      {/* Main Content */}
      <main className="flex-1 px-8 py-6 overflow-y-auto">
        {/* Top Search + Profile */}
        <div className="flex justify-between items-center mb-8">
          {/* Search Bar */}
          <div className="relative w-96">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-[#1D1633] text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-[#7A5FFF]"
            />
          </div>

          {/* Profile */}
          <div className="flex items-center space-x-4">
            <div className="bg-[#1D1633] px-4 py-2 rounded-lg text-sm">
              level 51
              <div className="w-24 h-1 bg-gray-700 rounded mt-1">
                <div className="w-3/4 h-full bg-yellow-400 rounded"></div>
              </div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold">
              👤
            </div>
          </div>
        </div>

        {/* Banner Row */}
        <div className="grid grid-cols-2 gap-6 mb-10">
          {/* Left Banner */}
          <div className="bg-gradient-to-r from-[#6C4AB6] via-[#5940A9] to-[#43358F] rounded-xl p-6 flex flex-col justify-between shadow-lg">
            <h2 className="text-xl font-bold mb-2">New season is here</h2>
            <p className="text-gray-200 text-sm mb-4">
              Play competitively against thousands of players
            </p>
            <button className="self-start flex items-center justify-center space-x-2 bg-gradient-to-r from-[#3B82F6] via-[#06B6D4] to-[#22D3EE] hover:from-[#60A5FA] hover:via-[#22D3EE] hover:to-[#67E8F9] text-white font-bold px-6 py-2.5 rounded-lg shadow-md shadow-cyan-900/40 transition transform hover:scale-105">
              <span>Let’s Play</span>
            </button>
          </div>

          {/* Right Banner */}
          <div className="bg-[#1D1633] rounded-xl p-6 flex flex-col justify-between shadow-md">
            <h2 className="text-lg font-semibold mb-2">Continue playing</h2>
            <p className="text-sm text-gray-300">World</p>
            <p className="text-xs text-gray-500 mt-2">2 days ago</p>
          </div>
        </div>

        {/* Section: Recent modes */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent modes</h2>
            <button className="text-sm text-[#A78BFA] hover:underline">
              see all
            </button>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-[#1D1633] aspect-square rounded-xl p-4 flex items-end shadow-md hover:scale-105 transition cursor-pointer">
              <span className="text-base font-semibold">Duels</span>
            </div>
            <div className="bg-[#1D1633] aspect-square rounded-xl p-4 flex items-end shadow-md hover:scale-105 transition cursor-pointer">
              <span className="text-base font-semibold">
                The Daily Challenge
              </span>
            </div>
            <div className="bg-[#1D1633] aspect-square rounded-xl p-4 flex items-end shadow-md hover:scale-105 transition cursor-pointer">
              <span className="text-base font-semibold">Streaks</span>
            </div>
          </div>
        </div>

        {/* Section: Recommended maps */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recommended maps</h2>
            <button className="text-sm text-[#A78BFA] hover:underline">
              see all
            </button>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-[#1D1633] aspect-square rounded-xl p-4 flex items-end shadow-md hover:scale-105 transition cursor-pointer">
              <span className="text-base font-semibold">I Saw The Sign</span>
            </div>
            <div className="bg-[#1D1633] aspect-square rounded-xl p-4 flex items-end shadow-md hover:scale-105 transition cursor-pointer">
              <span className="text-base font-semibold">US Cities</span>
            </div>
            <div className="bg-[#1D1633] aspect-square rounded-xl p-4 flex items-end shadow-md hover:scale-105 transition cursor-pointer">
              <span className="text-base font-semibold">GeoDetective</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
