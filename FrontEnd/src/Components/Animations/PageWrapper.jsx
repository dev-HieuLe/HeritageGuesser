// src/Components/Animations/PageWrapper.jsx
import { useLocation } from "react-router-dom";
import FullScreenTransition from "./FullScreenTransition";

export default function PageWrapper({ children }) {
  const location = useLocation();

  return (
    <FullScreenTransition key={location.pathname} locationKey={location.key}>
      {children}
    </FullScreenTransition>
  );
}
