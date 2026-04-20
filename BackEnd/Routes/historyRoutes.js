// BackEnd/Routes/history.js
import express from "express";
import { recordHistory, getTodayCount } from "../Controllers/historyController.js";
import { verifyPlayer } from "../Middleware/verifyPlayer.js";

const router = express.Router();
router.get("/today-count", verifyPlayer, getTodayCount);
router.post("/", verifyPlayer, recordHistory);
export default router;
