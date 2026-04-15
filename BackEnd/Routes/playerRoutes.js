import express from "express";
import { updateLevel, updateRank, addPoints } from "../Controllers/playerController.js";
import { verifyPlayer } from "../Middleware/verifyPlayer.js";
const router = express.Router();

// POST /player/update-level
router.post("/update-level", verifyPlayer, updateLevel);
router.post("/update-rank", (req, res, next) => {
  console.log("✅ /update-rank hit");
  next();
}, verifyPlayer, updateRank);

// POST /player/add-points
router.post("/add-points", verifyPlayer, addPoints);

export default router;
