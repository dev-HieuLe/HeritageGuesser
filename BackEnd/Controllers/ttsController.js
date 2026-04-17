import { GoogleGenAI } from "@google/genai";

/**
 * ttsController — Google Gemini TTS proxy
 * ─────────────────────────────────────────────────────────────────────────────
 * Uses gemini-2.5-flash-preview-tts to synthesize speech.
 * Returns audio/wav binary to the frontend.
 *
 * Voice: Despina — used for both Vietnamese and English.
 * Gemini TTS natively handles multilingual text with the same voice.
 *
 * POST /api/tts
 *   Body    { text: string }
 *   Returns audio/wav binary
 * ─────────────────────────────────────────────────────────────────────────────
 */

const GEMINI_TTS_MODEL = "gemini-2.5-flash-preview-tts";
const VOICE_NAME       = "Despina"; // prebuilt Gemini TTS voice

// Singleton client
let _ai = null;
function getAI() {
  if (!_ai) {
    _ai = new GoogleGenAI({ apiKey: process.env.GEMINI_TTS_API_KEY });
  }
  return _ai;
}

/**
 * Build a valid WAV file in memory from raw LINEAR16 PCM data.
 * Gemini TTS returns 24000 Hz, 16-bit, mono PCM.
 */
function buildWav(pcmBuffer, sampleRate = 24000, channels = 1, bitDepth = 16) {
  const byteRate   = sampleRate * channels * (bitDepth / 8);
  const blockAlign = channels * (bitDepth / 8);
  const dataSize   = pcmBuffer.length;
  const header     = Buffer.alloc(44);

  // RIFF chunk
  header.write("RIFF",                  0, "ascii");
  header.writeUInt32LE(36 + dataSize,   4);
  header.write("WAVE",                  8, "ascii");

  // fmt sub-chunk
  header.write("fmt ",                  12, "ascii");
  header.writeUInt32LE(16,              16); // sub-chunk size
  header.writeUInt16LE(1,               20); // PCM = 1
  header.writeUInt16LE(channels,        22);
  header.writeUInt32LE(sampleRate,      24);
  header.writeUInt32LE(byteRate,        28);
  header.writeUInt16LE(blockAlign,      32);
  header.writeUInt16LE(bitDepth,        34); // 2 bytes: 34-35

  // data sub-chunk                          // correct offsets:
  header.write("data",                  36, "ascii"); // 36-39
  header.writeUInt32LE(dataSize,        40);          // 40-43

  return Buffer.concat([header, pcmBuffer]);
}

// ─── Retry helper ─────────────────────────────────────────────────────────────
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 600; // base delay; doubles each attempt

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function generateWithRetry(ai, text) {
  let lastErr;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model:    GEMINI_TTS_MODEL,
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: VOICE_NAME },
            },
          },
        },
      });

      const b64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!b64) throw new Error("No audio data in Gemini response");
      return b64;

    } catch (err) {
      lastErr = err;
      const status = err.status ?? err.statusCode ?? 500;

      // Don't retry on permanent errors — they won't resolve
      if (status === 400 || status === 401 || status === 403 || status === 429) throw err;

      // 500 from Gemini preview = transient — retry with backoff
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
        console.warn(`[TTS] Gemini attempt ${attempt} failed (${status}), retrying in ${delay}ms…`);
        await sleep(delay);
      }
    }
  }
  throw lastErr;
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function synthesizeSpeech(req, res) {
  const { text } = req.body;

  if (!text || typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ error: "text is required" });
  }
  if (text.length > 2000) {
    return res.status(400).json({ error: "text too long (max 2000 chars)" });
  }
  if (!process.env.GEMINI_TTS_API_KEY) {
    return res.status(503).json({ error: "TTS service not configured — missing GEMINI_TTS_API_KEY" });
  }

  console.info(`[TTS] Gemini voice=${VOICE_NAME} chars=${text.length}`);

  try {
    const ttsStart  = Date.now();
    const b64data   = await generateWithRetry(getAI(), text.trim());
    const pcmBuffer = Buffer.from(b64data, "base64");
    const wavBuffer = buildWav(pcmBuffer);
    console.info(`[TTS] Gemini response time: ${Date.now() - ttsStart}ms | wav=${wavBuffer.length}bytes`);

    res.set({
      "Content-Type":   "audio/wav",
      "Content-Length": String(wavBuffer.length),
      "Cache-Control":  "no-store",
      "X-TTS-Provider": "gemini",
      "X-TTS-Voice":    VOICE_NAME,
    });
    res.send(wavBuffer);

  } catch (err) {
    const status = err.status ?? err.statusCode ?? 500;
    console.error(`[TTS] Gemini failed after ${MAX_RETRIES} attempts:`, status, err.message);

    if (status === 401 || status === 403) {
      return res.status(503).json({ error: "TTS auth failed — check GEMINI_TTS_API_KEY" });
    }
    if (status === 429) {
      return res.status(429).json({ error: "TTS rate limit exceeded" });
    }
    // Return 503 so the frontend knows to fall back to browser TTS
    res.status(503).json({ error: "TTS temporarily unavailable — falling back to browser voice" });
  }
}
