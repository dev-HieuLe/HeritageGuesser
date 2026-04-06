import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { MapPin, Compass } from "lucide-react";

// 📍 Location-style pin
const locationIcon = new L.DivIcon({
  className: "",
  html: `
    <div style="display:flex; justify-content:center; align-items:center;">
      <div style="
        width:18px;
        height:18px;
        background:#E63946;
        border-radius:50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow:0 2px 6px rgba(0,0,0,0.3);
        position: relative;
      ">
        <div style="
          width:8px;
          height:8px;
          background:white;
          border-radius:50%;
          position:absolute;
          top:50%;
          left:50%;
          transform: translate(-50%, -50%) rotate(45deg);
        "></div>
      </div>
    </div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 18],
});

// 📍 Locations with region
const locations = [
  // NORTH
  {
    name: "Ha Long Bay",
    position: [20.9101, 107.1839],
    description: "Limestone islands rising from emerald waters.",
    region: "North",
  },
  {
    name: "Sapa",
    position: [22.3364, 103.8438],
    description: "Mountain terraces and ethnic culture.",
    region: "North",
  },
  {
    name: "Hanoi Old Quarter",
    position: [21.0285, 105.8542],
    description: "Historic streets and local life.",
    region: "North",
  },
  {
    name: "Ninh Binh",
    position: [20.2506, 105.9745],
    description: "Halong Bay on land with rivers and caves.",
    region: "North",
  },

  // CENTRAL
  {
    name: "Phong Nha - Ke Bang",
    position: [17.5453, 106.1527],
    description: "World-famous caves and underground rivers.",
    region: "Central",
  },
  {
    name: "Hue Imperial City",
    position: [16.4637, 107.5909],
    description: "Historic royal capital of Vietnam.",
    region: "Central",
  },
  {
    name: "Hoi An Ancient Town",
    position: [15.8801, 108.338],
    description: "Lantern-lit streets and rich heritage.",
    region: "Central",
  },
  {
    name: "Da Nang",
    position: [16.0544, 108.2022],
    description: "Modern coastal city with beaches.",
    region: "Central",
  },
  {
    name: "My Son Sanctuary",
    position: [15.7731, 108.123],
    description: "Ancient Cham temple complex.",
    region: "Central",
  },
  {
    name: "Nha Trang",
    position: [12.2388, 109.1967],
    description: "Famous beach destination.",
    region: "Central",
  },

  // SOUTH
  {
    name: "Ho Chi Minh City",
    position: [10.8231, 106.6297],
    description: "Vibrant economic hub of Vietnam.",
    region: "South",
  },
  {
    name: "Mekong Delta",
    position: [10.0333, 105.7833],
    description: "Floating markets and river life.",
    region: "South",
  },
  {
    name: "Phu Quoc Island",
    position: [10.2899, 103.984],
    description: "Tropical island paradise.",
    region: "South",
  },
  {
    name: "Con Dao Islands",
    position: [8.6864, 106.608],
    description: "Remote islands with history and nature.",
    region: "South",
  },
];

const Discovery = () => {
  const [region, setRegion] = useState("All");

  // 🎯 Filter logic
  const filteredLocations =
    region === "All"
      ? locations
      : locations.filter((loc) => loc.region === region);

  return (
    <div className="min-h-screen bg-[#120D1D] text-white px-6 py-10 flex flex-col items-center">
      {/* 🧭 Title */}
      <div className="flex items-center gap-2 mb-6">
        <Compass className="text-blue-400" size={26} />
        <h1 className="text-3xl md:text-4xl font-semibold tracking-wide">
          Explore Vietnam Heritage
        </h1>
      </div>

      {/* 🔽 FILTER */}
      <div className="flex gap-3 mb-6">
        {["All", "North", "Central", "South"].map((item) => (
          <button
            key={item}
            onClick={() => setRegion(item)}
            className={`px-4 py-2 rounded-full text-sm transition 
              ${
                region === item
                  ? "bg-blue-500 text-white"
                  : "bg-white/10 hover:bg-white/20"
              }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* 🗺️ Map */}
      <div className="w-full max-w-6xl h-[600px] rounded-2xl overflow-hidden shadow-lg border border-gray-700">
        <MapContainer
          center={[16.0471, 108.2062]}
          zoom={6}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          {/* 🌍 Apple/Google-like map */}
          <TileLayer
            attribution="&copy; OpenStreetMap & Carto"
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* 📍 Markers */}
          {filteredLocations.map((loc, index) => (
            <Marker key={index} position={loc.position} icon={locationIcon}>
              <Tooltip
                direction="top"
                offset={[0, -10]}
                opacity={1}
                className="!bg-white !text-black !rounded-md !px-2 !py-1 shadow"
              >
                <div className="flex items-center gap-1 text-xs">
                  <MapPin size={12} />
                  {loc.name}
                </div>
              </Tooltip>

              <Popup>
                <div className="text-black">
                  <h2 className="font-semibold text-sm">{loc.name}</h2>
                  <p className="text-xs text-gray-600">{loc.description}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Discovery;
