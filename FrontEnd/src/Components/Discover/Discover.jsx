import React, { useRef, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  StandaloneSearchBox,
} from "@react-google-maps/api";

const libraries = ["places"];

export default function FullStreetView() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [center, setCenter] = useState({ lat: 21.0278, lng: 105.8342 }); // Default: Hanoi
  const [showStreetView, setShowStreetView] = useState(false);
  const searchBoxRef = useRef(null);
  const mapRef = useRef(null);

  const onPlacesChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    if (!places || places.length === 0) return;

    const place = places[0];
    const location = place.geometry?.location;
    if (!location) return;

    const lat = location.lat();
    const lng = location.lng();
    setCenter({ lat, lng });
    setShowStreetView(true);

    // 🔥 Move map center
    mapRef.current.panTo({ lat, lng });

    // 🧭 Open Street View in same map
    const streetView = mapRef.current.getStreetView();
    streetView.setPosition({ lat, lng });
    streetView.setPov({ heading: 100, pitch: 0 });
    streetView.setVisible(true);
  };

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="min-h-screen bg-[#120D1D] text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4 text-center">Explore in Street View</h1>

      {/* 🔍 Google Search Box */}
      <StandaloneSearchBox
        onLoad={(ref) => (searchBoxRef.current = ref)}
        onPlacesChanged={onPlacesChanged}
      >
        <input
          type="text"
          placeholder="Search a place (e.g. Eiffel Tower)..."
          className="w-full max-w-lg px-4 py-3 mb-6 border border-[#2E2142] bg-[#1A142A] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9E6FFB]"
        />
      </StandaloneSearchBox>

      {/* 🗺️ Map (with Street View built-in) */}
      <div className="h-[500px] w-full max-w-6xl rounded-2xl overflow-hidden border border-[#2E2142] shadow-md">
        <GoogleMap
          onLoad={(map) => (mapRef.current = map)}
          center={center}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            streetViewControl: true, // ✅ allow pegman icon
            fullscreenControl: false,
            mapTypeControl: false,
          }}
        />
      </div>
    </div>
  );
}
