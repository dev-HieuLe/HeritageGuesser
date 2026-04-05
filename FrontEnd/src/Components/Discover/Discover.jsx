import React, { useRef, useState, useEffect } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import axios from "axios";

export default function FullStreetView() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [center, setCenter] = useState({ lat: 21.0278, lng: 105.8342 });
  const [query, setQuery] = useState("");
  const [remaining, setRemaining] = useState(4);
  const [limitReached, setLimitReached] = useState(false);

  const mapRef = useRef(null);

  // 🔁 Load from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("discoverUsage"));
    const today = new Date().toISOString().split("T")[0];

    if (stored && stored.date === today) {
      setRemaining(4 - stored.count);
      if (stored.count >= 4) setLimitReached(true);
    }
  }, []);

  const handleSearch = async () => {
    if (!query.trim() || limitReached) return;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/discover/search`,
        {
          params: { query },
          withCredentials: true,
        },
      );

      const { lat, lng } = res.data.place;

      setCenter({ lat, lng });

      mapRef.current.panTo({ lat, lng });

      const streetView = mapRef.current.getStreetView();
      streetView.setPosition({ lat, lng });
      streetView.setVisible(true);

      // 🔥 update usage locally
      const today = new Date().toISOString().split("T")[0];
      const stored = JSON.parse(localStorage.getItem("discoverUsage")) || {
        date: today,
        count: 0,
      };

      stored.count++;
      stored.date = today;

      localStorage.setItem("discoverUsage", JSON.stringify(stored));

      setRemaining(4 - stored.count);

      if (stored.count >= 4) {
        setLimitReached(true);
      }
    } catch (err) {
      if (err.response?.status === 429) {
        setLimitReached(true);
      } else {
        alert("Error fetching location");
      }
    }
  };

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="min-h-screen bg-[#120D1D] text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Explore Street View</h1>

      <div className="mb-2 text-sm text-gray-400">
        Remaining today: {remaining}
      </div>

      {limitReached && (
        <div className="text-red-400 mb-4">🚫 Limit reached (4 per day)</div>
      )}

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={limitReached}
        placeholder="Search place..."
        className="w-full max-w-lg px-4 py-2 mb-3 bg-[#1A142A] rounded"
      />

      <button
        onClick={handleSearch}
        disabled={limitReached}
        className="mb-6 px-6 py-2 bg-purple-600 rounded disabled:opacity-50"
      >
        Search
      </button>

      <div className="h-[500px] w-full max-w-6xl">
        <GoogleMap
          onLoad={(map) => (mapRef.current = map)}
          center={center}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
}
