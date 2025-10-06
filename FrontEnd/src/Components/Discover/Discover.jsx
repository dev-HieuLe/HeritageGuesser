import React, { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";

const libraries = ["places"];

export default function Discover() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const streetViewRef = useRef(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // 🔍 Handle Search
  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setMessage("");
    setResult(null);

    try {
      const res = await axios.get(`/api/discover/search`, {
        params: { query },
      });

      if (!res.data || !res.data.place) {
        setMessage("No location found.");
        return;
      }

      setResult(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        setMessage("No location found.");
      } else {
        setMessage(err?.response?.data?.error || "Search failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [query]);

  // 🧭 Initialize Street View manually (stable)
  useEffect(() => {
    if (!isLoaded || !result?.place?.lat || !result?.place?.lng) return;

    try {
      const sv = new window.google.maps.StreetViewPanorama(streetViewRef.current, {
        position: {
          lat: Number(result.place.lat),
          lng: Number(result.place.lng),
        },
        pov: { heading: 120, pitch: 0 },
        visible: true,
      });

      // Fallback for locations without Street View
      window.google.maps.event.addListenerOnce(sv, "status_changed", () => {
        if (sv.getStatus && sv.getStatus() !== "OK") {
          streetViewRef.current.innerHTML =
            '<div class="flex items-center justify-center h-full text-gray-400 bg-[#1A142A]">Street View imagery not available.</div>';
        }
      });
    } catch (e) {
      console.warn("Street View init failed:", e);
      if (streetViewRef.current) {
        streetViewRef.current.innerHTML =
          '<div class="flex items-center justify-center h-full text-gray-400 bg-[#1A142A]">Street View imagery not available.</div>';
      }
    }
  }, [isLoaded, result]);

  return (
    <div className="min-h-screen bg-[#120D1D] text-white p-6">
      <h1 className="text-3xl font-bold mb-4 text-center text-white">🌍 Discover</h1>
      <p className="text-gray-300 text-center mb-8">
        Search for any heritage site or place name to explore it in Street View.
      </p>

      {/* 🔍 Search Box */}
      <div className="flex justify-center mb-8">
        <div className="flex gap-2 w-full max-w-2xl">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search e.g. 'Hoi An Ancient Town'..."
            className="flex-1 px-4 py-3 border border-[#2E2142] bg-[#1A142A] text-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9E6FFB] placeholder-gray-400"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3 bg-[#9E6FFB] text-white font-medium rounded-xl hover:bg-[#7F55DB] transition disabled:opacity-60"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {/* 🧭 Message */}
      {message && (
        <div className="text-center mb-6 font-medium text-red-400">
          {message}
        </div>
      )}

      {/* 🗺️ Result */}
      {result && result.place && (
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {/* 📍 Info */}
          <div className="md:col-span-1 bg-[#1A142A] rounded-2xl p-6 shadow-lg border border-[#2E2142]">
            <h2 className="text-2xl font-semibold mb-2 text-[#E8D9FF]">
              {result.place.name || "Unknown"}
            </h2>

            {result.source === "db" && result.place.description && (
              <p className="text-gray-300 mb-2">{result.place.description}</p>
            )}

            {result.source === "google" && result.place.formatted_address && (
              <p className="text-gray-300 mb-2">
                {result.place.formatted_address}
              </p>
            )}

            <div className="text-sm text-gray-400 space-y-1">
              <p>
                <b className="text-[#C5AFFF]">Source:</b> {result.source}
              </p>
              <p>
                <b className="text-[#C5AFFF]">Lat:</b> {result.place.lat ?? "N/A"}
              </p>
              <p>
                <b className="text-[#C5AFFF]">Lng:</b> {result.place.lng ?? "N/A"}
              </p>
            </div>
          </div>

          {/* 🗺️ Map + Street View */}
          <div className="md:col-span-2 flex flex-col gap-6">
            {!isLoaded ? (
              <div className="text-center text-gray-400">Loading map...</div>
            ) : result.place.lat && result.place.lng ? (
              <>
                {/* 🗺️ Google Map */}
                <div className="h-64 md:h-80 rounded-2xl overflow-hidden shadow-md border border-[#2E2142]">
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={{
                      lat: Number(result.place.lat),
                      lng: Number(result.place.lng),
                    }}
                    zoom={15}
                  />
                </div>

                {/* 🚶 Manual Street View container */}
                <div
                  ref={streetViewRef}
                  className="h-64 md:h-80 rounded-2xl overflow-hidden shadow-md bg-[#1A142A] flex items-center justify-center border border-[#2E2142]"
                >
                  <div className="text-gray-400">Loading Street View...</div>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-400">
                No coordinates available for this place.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
