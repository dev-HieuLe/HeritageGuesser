import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useBrowserTTS — Vietnamese-first browser TTS hook
 * ─────────────────────────────────────────────────────────────────────────────
 * Uses the Web Speech API with `vi-VN` locale and selects the best available
 * Vietnamese voice automatically. Falls back gracefully if no vi-VN voice is
 * installed on the user's device.
 *
 * Returns { speak, stop, isSpeaking }  — same interface as useElevenLabsTTS
 * so the two are drop-in swappable by changing a single import line.
 *
 * UPGRADE PATH
 * ─────────────────────────────────────────────────────────────────────────────
 * To switch to ElevenLabs or Azure TTS, replace this import in RankPlay.jsx:
 *
 *   // Browser TTS (current)
 *   import { useBrowserTTS as useTTS } from "../../hooks/useBrowserTTS";
 *
 *   // ElevenLabs (better quality, works offline once cached)
 *   import { useElevenLabsTTS as useTTS } from "../../hooks/useElevenLabsTTS";
 *
 * Then in RankPlay.jsx, rename the destructured const:
 *   const { speak, stop: stopSpeech, isSpeaking } = useTTS();
 *
 * Nothing else needs to change.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const LANG = "vi-VN";

/**
 * Resolve the best Vietnamese voice from the browser voice list.
 * Priority: exact vi-VN match → any vi- prefix → null (let browser decide).
 */
function pickVietnameseVoice(voices) {
  if (!voices?.length) return null;

  // 1. Prefer an explicit vi-VN voice
  const exact = voices.find(
    (v) => v.lang.toLowerCase() === "vi-vn" && !v.localService
  ) ?? voices.find((v) => v.lang.toLowerCase() === "vi-vn");

  if (exact) return exact;

  // 2. Accept any Vietnamese voice (vi-VN, vi_VN, vi, …)
  const loose = voices.find((v) => v.lang.toLowerCase().startsWith("vi"));
  return loose ?? null;
}

export function useBrowserTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef     = useRef(typeof window !== "undefined" ? window.speechSynthesis : null);
  const utteranceRef = useRef(null);
  const voiceRef     = useRef(null);   // cached Vietnamese voice

  // Voices load asynchronously — wait for them and cache the best match
  useEffect(() => {
    const synth = synthRef.current;
    if (!synth) return;

    const resolve = () => {
      voiceRef.current = pickVietnameseVoice(synth.getVoices());
      if (voiceRef.current) {
        console.info("[TTS] Selected Vietnamese voice:", voiceRef.current.name, voiceRef.current.lang);
      } else {
        console.warn("[TTS] No vi-VN voice found — using browser default for vi-VN locale.");
      }
    };

    // Voices may already be loaded (Firefox) or arrive via the event (Chrome/Safari)
    if (synth.getVoices().length > 0) {
      resolve();
    }
    synth.addEventListener("voiceschanged", resolve);
    return () => synth.removeEventListener("voiceschanged", resolve);
  }, []);

  const stop = useCallback(() => {
    synthRef.current?.cancel();
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(
    (text) => {
      if (!synthRef.current || !text?.trim()) return;

      stop(); // cancel any in-flight speech

      // Short delay so Chrome flushes the cancel() before the new utterance
      const timer = setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text.trim());

        utterance.lang   = LANG;
        utterance.rate   = 1.0;
        utterance.pitch  = 1.05;
        utterance.volume = 1.0;

        // Attach the cached Vietnamese voice if found
        if (voiceRef.current) utterance.voice = voiceRef.current;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend   = () => setIsSpeaking(false);
        utterance.onerror = (e) => {
          if (e.error !== "interrupted") {
            console.warn("[TTS] Speech error:", e.error);
          }
          setIsSpeaking(false);
        };

        utteranceRef.current = utterance;
        synthRef.current.speak(utterance);
      }, 60);

      return () => clearTimeout(timer);
    },
    [stop]
  );

  useEffect(() => () => synthRef.current?.cancel(), []);

  return { speak, stop, isSpeaking };
}
