import express from "express";
import { sendMessage } from "../Controllers/chatController.js";
import { verifyPlayer } from "../Middleware/verifyPlayer.js";
import { verifyRecaptcha } from "../Middleware/verifyRecaptcha.js";

const router = express.Router();

router.post("/chat", verifyPlayer, verifyRecaptcha, sendMessage);

export default router;
