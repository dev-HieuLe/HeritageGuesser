import express from "express";
import { updateLevel, updateRank } from "../Controllers/playerController.js";
import { verifyPlayer } from "../Middleware/verifyPlayer.js"; // make sure you have this middleware
const router = express.Router();

// POST /player/update-level
router.post("/update-level", verifyPlayer, updateLevel);
router.post("/update-rank", (req, res, next) => {
  console.log("✅ /update-rank hit");
  next();
}, verifyPlayer, updateRank);

export default router;
