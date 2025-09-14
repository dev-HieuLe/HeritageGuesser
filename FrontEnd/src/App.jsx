// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Homepage from "./Components/Homepage/Homepage";
import Sidebar from "./Components/Sidebar/Sidebar";
export default function App() {
  return (
    <div className="flex">
      <Sidebar />
      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
    </div>
  );
}
