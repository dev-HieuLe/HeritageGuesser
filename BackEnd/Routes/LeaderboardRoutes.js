// Routes/leaderboardRoutes.js
import express from "express";
import { getLeaderboard } from "../Controllers/LeaderboardController.js";

const router = express.Router();

router.get("/leaderboard", getLeaderboard);

export default router;
