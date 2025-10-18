// BackEnd/Routes/history.js
import express from "express";
import { recordHistory } from "../Controllers/historyController.js";
import { verifyPlayer } from "../Middleware/verifyPlayer.js";

const router = express.Router();
router.post("/", verifyPlayer, recordHistory);
export default router;
