import express from "express";
import { synthesizeSpeech } from "../Controllers/ttsController.js";

const router = express.Router();

// POST /api/tts  — secure ElevenLabs proxy
// No auth required (avatar should speak even for guests)
router.post("/tts", synthesizeSpeech);

export default router;
