import React, { useState } from "react";
import {
  GoogleMap,
  StreetViewPanorama,
  LoadScript,
} from "@react-google-maps/api";

// full screen container
const containerStyle = {
  width: "100%",
  height: "100vh",
};

// 👇 preset locations (you can add more)
const LOCATIONS = [
  { lat: 48.8584, lng: 2.2945, name: "Eiffel Tower" }, // Paris
  { lat: 40.6892, lng: -74.0445, name: "Statue of Liberty" }, // NYC
  { lat: 35.6586, lng: 139.7454, name: "Tokyo Tower" }, // Tokyo
];

export default function RankPlay() {
  const [index, setIndex] = useState(0);

  const handleNext = () =>
    setIndex((prev) => (prev + 1) % LOCATIONS.length);
  const handlePrev = () =>
    setIndex((prev) => (prev - 1 + LOCATIONS.length) % LOCATIONS.length);

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div className="relative w-full h-screen">
        {/* Google Map + Street View */}
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={LOCATIONS[index]}
          zoom={14}
        >
          <StreetViewPanorama
            position={LOCATIONS[index]}
            visible={true}
            options={{
              pov: { heading: 100, pitch: 0 },
              zoom: 1,
              disableDefaultUI: true,
            }}
          />
        </GoogleMap>

        {/* Overlay UI */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg">
          {LOCATIONS[index].name}
        </div>

        {/* Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-4">
          <button
            onClick={handlePrev}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-6 py-2 rounded-xl shadow-lg font-bold"
          >
            ⬅ Prev
          </button>
          <button
            onClick={handleNext}
            className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-400 hover:to-red-400 text-white px-6 py-2 rounded-xl shadow-lg font-bold"
          >
            Next ➡
          </button>
        </div>
      </div>
    </LoadScript>
  );
}
