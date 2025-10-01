import express from "express";
import { sendMessage } from "../Controllers/chatController.js";
import { verifyPlayer } from "../Middleware/verifyPlayer.js";

const router = express.Router();

router.post("/chat",verifyPlayer, sendMessage);

export default router;
