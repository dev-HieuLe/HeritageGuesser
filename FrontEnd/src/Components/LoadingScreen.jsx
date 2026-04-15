import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BAR_DURATION = 7;    // seconds for progress bar
const TOTAL_DURATION = 12; // seconds before auto-dismissing

export default function LoadingScreen({ visible, onDone }) {
  const videoRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [canSkip, setCanSkip] = useState(false);
  const timerRef = useRef(null);
  const skipTimerRef = useRef(null);

  const handleEnter = () => {
    setStarted(true);
    const vid = videoRef.current;
    if (vid) {
      vid.muted = false;
      vid.play().catch(() => {
        vid.muted = true;
        vid.play().catch(() => {});
      });
    }
    timerRef.current = setTimeout(onDone, TOTAL_DURATION * 1000);
    skipTimerRef.current = setTimeout(() => setCanSkip(true), BAR_DURATION * 1000);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(skipTimerRef.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-end overflow-hidden"
        >
          {/* Full-screen video — always mounted so it's ready */}
          <video
            ref={videoRef}
            src="/intro.mp4"
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Dark vignette overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(10,15,13,0.3) 0%, rgba(10,15,13,0.75) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, rgba(10,15,13,0.9) 0%, transparent 40%)",
            }}
          />

          {/* Click to enter — shown before interaction */}
          <AnimatePresence>
            {!started && (
              <motion.div
                key="enter-prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 cursor-pointer"
                onClick={handleEnter}
              >
                <motion.div
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="flex flex-col items-center gap-4"
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center border-2"
                    style={{
                      backgroundColor: "rgba(14,21,19,0.6)",
                      borderColor: "rgba(233,195,73,0.6)",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "40px", color: "#e9c349", fontVariationSettings: "'FILL' 1" }}
                    >
                      play_arrow
                    </span>
                  </div>
                  <span
                    className="font-black uppercase tracking-[0.25em]"
                    style={{ color: "#e9c349", fontSize: "13px" }}
                  >
                    Click to Enter
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading bar + skip button — shown after interaction */}
          <AnimatePresence>
            {started && (
              <motion.div
                key="progress"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 w-full px-8 sm:px-16 pb-10 sm:pb-14 flex flex-col gap-4"
              >
                {/* Skip button — appears after bar finishes */}
                <div className="flex justify-end">
                  <AnimatePresence>
                    {canSkip && (
                      <motion.button
                        key="skip-btn"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.4 }}
                        onClick={onDone}
                        className="flex items-center gap-1.5 uppercase tracking-[0.2em] font-semibold"
                        style={{ fontSize: "11px", color: "rgba(233,195,73,0.85)" }}
                      >
                        Skip
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: "16px", fontVariationSettings: "'FILL' 1" }}
                        >
                          skip_next
                        </span>
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                {/* Loading text with animated dots */}
                <div className="flex items-center gap-2">
                  <span
                    className="uppercase tracking-[0.3em] font-semibold"
                    style={{ fontSize: "11px", color: "rgba(162,209,187,0.8)" }}
                  >
                    Loading
                  </span>
                  <div className="flex items-center gap-[3px]" style={{ paddingTop: "1px" }}>
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.2,
                          delay: i * 0.2,
                          ease: "easeInOut",
                        }}
                        style={{
                          display: "inline-block",
                          width: "3px",
                          height: "3px",
                          borderRadius: "50%",
                          backgroundColor: "#e9c349",
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Progress bar */}
                <div
                  className="w-full rounded-full overflow-hidden"
                  style={{ height: "2px", backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: BAR_DURATION, ease: "linear" }}
                    style={{
                      background: "linear-gradient(90deg, #a2d1bb, #e9c349, #a2d1bb)",
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
