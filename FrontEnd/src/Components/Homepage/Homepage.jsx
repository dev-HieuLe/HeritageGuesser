import { useContext } from "react";
import { Search, User, LogOut, LogIn } from "lucide-react";
import { AuthContext } from "../../Context/authContext";
import { Link } from "react-router-dom";

export default function Homepage() {
  const { auth, user, logout, loading } = useContext(AuthContext);
  console.log("User in Homepage:", auth, user);

  if (loading) {
    // Don’t show login/logout until we know
    return (
      <div className="h-screen flex justify-center items-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-1 flex-col  text-white font-sans">
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
          <div className="flex items-center">
            {auth && user?.name ? (
              <>
                {/* Profile Icon */}
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold cursor-pointer">
                  <User size={20} />
                </div>
                {/* User Info */}
                <div className="bg-[#1D1633] px-4 py-2 rounded-lg text-sm text-white flex flex-col w-48">
                  <span>{user?.name || "User"}</span>
                  <div className="w-full h-2 bg-gray-700 rounded mt-1 overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          ((user?.level || 0) / 900) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>

                  <span className="text-xs text-gray-400 mt-1">
                    {user?.level || 0} / 900
                  </span>
                </div>

                {/* Logout Icon */}
                <div
                  onClick={logout}
                  className="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white cursor-pointer transition"
                  title="Logout"
                >
                  <LogOut size={18} />
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className=" flex gap-2 items-center bg-gradient-to-tr from-blue-500 to-cyan-400 px-5 py-2 rounded-lg text-white font-bold"
              >
                <span>Login</span>
                <LogIn size={20} className="text-white" />
              </Link>
            )}
          </div>
        </div>

        {/* Banner Row */}
        <div className="grid grid-cols-2 gap-6 mb-10 min-h-60">
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
            <h2 className="text-2xl font-semibold mb-2">Today's Heritage</h2>
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
            <div className="relative bg-[url('/Rank.png')] bg-cover bg-center aspect-square rounded-xl overflow-hidden shadow-md hover:scale-105 transition cursor-pointer">
              {/* Blurred overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-20 backdrop-blur-xl bg-transparent flex items-end p-4">
                <span className="text-xl font-semibold text-white">
                  Rank
                </span>
              </div>
            </div>
            <div className="relative bg-[url('/DailyChallenge.png')] bg-cover bg-center aspect-square rounded-xl overflow-hidden shadow-md hover:scale-105 transition cursor-pointer">
              {/* Blurred overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-20 backdrop-blur-xl bg-transparent flex items-end p-4">
                <span className="text-xl font-semibold text-white">
                  The Daily Challenge
                </span>
              </div>
            </div>
            <div className="relative bg-[url('/LeaderBoard.png')] bg-cover bg-center aspect-square rounded-xl overflow-hidden shadow-md hover:scale-105 transition cursor-pointer">
              {/* Blurred overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-20 backdrop-blur-xl bg-gray-800 flex items-end p-4">
                <span className="text-xl font-semibold text-white">
                  LeaderBoard
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Recommended maps */}
        <div className="mb-10">
          <div className="grid grid-cols-3 gap-6">
            <div className="relative bg-[url('/Exploring.png')] bg-cover bg-center aspect-square rounded-xl overflow-hidden shadow-md hover:scale-105 transition cursor-pointer">
              {/* Blurred overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-20 backdrop-blur-xl bg-gray-800 flex items-end p-4">
                <span className="text-xl font-semibold text-white">
                  Explore
                </span>
              </div>
            </div>
            <div className="relative bg-[url('/Study.png')] bg-cover bg-center aspect-square rounded-xl overflow-hidden shadow-md hover:scale-105 transition cursor-pointer">
              {/* Blurred overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-20 backdrop-blur-xl bg-gray-800 flex items-end p-4">
                <span className="text-xl font-semibold text-white">
                  Study
                </span>
              </div>
            </div>
            <div className="relative bg-[url('/images/heritage1.jpg')] bg-cover bg-center aspect-square rounded-xl overflow-hidden shadow-md hover:scale-105 transition cursor-pointer">
              {/* Blurred overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-20 backdrop-blur-xl bg-gray-800 flex items-end p-4">
                <span className="text-xl font-semibold text-white">
                  Donate
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
