// BackEnd/Routes/history.js
import express from "express";
import { recordHistory, getTodayCount, analyzeProgress, getWrongLocations, getLocationPracticeTip } from "../Controllers/historyController.js";
import { verifyPlayer } from "../Middleware/verifyPlayer.js";

const router = express.Router();
router.get("/today-count", verifyPlayer, getTodayCount);
router.get("/analyze", verifyPlayer, analyzeProgress);
router.get("/wrong-locations", verifyPlayer, getWrongLocations);
router.get("/wrong-locations/:id/tip", verifyPlayer, getLocationPracticeTip);
router.post("/", verifyPlayer, recordHistory);
export default router;
