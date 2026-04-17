import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useGeminiTTS — Google Gemini 2.5 Flash TTS
 * ─────────────────────────────────────────────────────────────────────────────
 * Calls the backend proxy POST /api/tts → Gemini 2.5 Flash TTS → audio/wav.
 * Falls back to browser SpeechSynthesis automatically on any server error.
 *
 * Voice: Despina — handles both Vietnamese and English natively.
 * No separate API key needed — reuses the existing GEMINI_TTS_API_KEY from .env.
 *
 * Returns { speak, stop, isSpeaking }
 * ─────────────────────────────────────────────────────────────────────────────
 */

const TTS_ENDPOINT = `${import.meta.env.VITE_API_BASE_URL}/tts`;

// ─── Browser TTS fallback ─────────────────────────────────────────────────────
const VI_REGEX = /[àáảãạăắặằẳẵâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/i;

function browserSpeak(text, onStart, onEnd) {
  const synth = window.speechSynthesis;
  if (!synth) { onEnd(); return; }
  synth.cancel();

  setTimeout(() => {
    const utterance  = new SpeechSynthesisUtterance(text.trim());
    const isVi       = VI_REGEX.test(text);
    utterance.lang   = isVi ? "vi-VN" : "en-US";
    utterance.rate   = 1.0;
    utterance.pitch  = 1.05;
    utterance.volume = 1.0;

    const voices = synth.getVoices();
    const match  = isVi
      ? voices.find(v => v.lang.toLowerCase().startsWith("vi"))
      : voices.find(v => v.lang.toLowerCase().startsWith("en"));
    if (match) utterance.voice = match;

    utterance.onstart = onStart;
    utterance.onend   = onEnd;
    utterance.onerror = (e) => { if (e.error !== "interrupted") onEnd(); };
    synth.speak(utterance);
  }, 60);
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useGeminiTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioCtxRef = useRef(null);
  const sourceRef   = useRef(null);
  const abortRef    = useRef(null);

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    try { sourceRef.current?.stop(); } catch (_) {}
    sourceRef.current = null;
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(async (text) => {
    if (!text?.trim()) return;
    stop();

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch(TTS_ENDPOINT, {
        method:      "POST",
        headers:     { "Content-Type": "application/json" },
        body:        JSON.stringify({ text: text.trim() }),
        signal:      controller.signal,
        credentials: "include",
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        const isFallback = response.status === 503 || response.status === 500;
        if (isFallback) {
          console.info("[Gemini TTS] Service unavailable, using browser TTS fallback");
        } else {
          console.warn("[Gemini TTS] Server error:", response.status, errBody.error ?? "");
        }
        setIsSpeaking(true);
        browserSpeak(text, () => setIsSpeaking(true), () => setIsSpeaking(false));
        return;
      }

      const arrayBuffer = await response.arrayBuffer();
      if (controller.signal.aborted) return;

      const ctx         = getCtx();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      const source      = ctx.createBufferSource();
      source.buffer     = audioBuffer;
      source.connect(ctx.destination);
      sourceRef.current = source;

      source.onended = () => {
        if (sourceRef.current === source) {
          sourceRef.current = null;
          setIsSpeaking(false);
        }
      };

      setIsSpeaking(true);
      source.start(0);

    } catch (err) {
      if (err.name === "AbortError") return;
      console.warn("[Gemini TTS] Fetch failed, falling back to browser TTS:", err.message);
      setIsSpeaking(true);
      browserSpeak(text, () => setIsSpeaking(true), () => setIsSpeaking(false));
    }
  }, [stop, getCtx]);

  useEffect(() => () => {
    stop();
    audioCtxRef.current?.close().catch(() => {});
  }, [stop]);

  return { speak, stop, isSpeaking };
}
