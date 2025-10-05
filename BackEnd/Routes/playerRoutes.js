import express from "express";
import { updateLevel } from "../Controllers/playerController.js";
import { verifyPlayer } from "../Middleware/verifyPlayer.js"; // make sure you have this middleware

const router = express.Router();

// POST /player/update-level
router.post("/update-level", verifyPlayer, updateLevel);

export default router;
