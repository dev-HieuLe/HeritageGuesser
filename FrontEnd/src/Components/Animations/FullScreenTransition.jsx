import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function FullScreenTransition({ children, locationKey }) {
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isCovered, setIsCovered] = useState(false);

  useEffect(() => {
    // 🟣 Step 1: start animation immediately
    setIsAnimating(true);
    setIsCovered(true); // instantly darken screen

    // 🟡 Step 2: after panels fully close (~0.28s), swap content
    const swapTimer = setTimeout(() => {
      setDisplayChildren(children);
    }, 280);

    // 🟢 Step 3: after panels open again (~0.75s), remove cover
    const endTimer = setTimeout(() => {
      setIsAnimating(false);
      setIsCovered(false);
    }, 750);

    return () => {
      clearTimeout(swapTimer);
      clearTimeout(endTimer);
    };
  }, [locationKey]);

  return (
    <div>
      {/* === PAGE CONTENT === */}
      <div
        className={`transition-opacity duration-300 ${
          isCovered ? "opacity-0" : "opacity-100"
        }`}
      >
        {displayChildren}
      </div>

      {/* === INSTANT DARK COVER === */}
      {isCovered && (
        <div className="fixed inset-0 bg-black z-[9997]" />
      )}

      {/* === PANEL ANIMATION === */}
      <AnimatePresence>
        {isAnimating && (
          <>
            {/* TOP-RIGHT PANEL */}
            <motion.div
              key="panel1"
              initial={{ scaleY: 0, originY: 0, originX: 1 }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0 }}
              transition={{ duration: 0.28, ease: [0.8, 0, 0.2, 1] }}
              className="fixed top-0 right-0 w-full h-full bg-gradient-to-br from-[#e9c349] to-[#e9c349] z-[9999]"
              style={{
                clipPath: "polygon(100% 0, 0 0, 100% 100%)",
              }}
            />

            {/* BOTTOM-LEFT PANEL */}
            <motion.div
              key="panel2"
              initial={{ scaleY: 0, originY: 1, originX: 0 }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0 }}
              transition={{
                duration: 0.35,
                ease: [0.8, 0, 0.2, 1],
                delay: 0.18,
              }}
              className="fixed bottom-0 left-0 w-full h-full bg-gradient-to-tr from-[#e9c349] to-[#e9c349] z-[9998]"
              style={{
                clipPath: "polygon(0 100%, 100% 100%, 0 0)",
              }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
