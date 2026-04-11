import express from "express";
import {
  submitContribution,
  getUserContributions,
} from "../Controllers/contributeLocationController.js";
import { verifyPlayer } from "../Middleware/verifyPlayer.js";

const router = express.Router();

// POST /api/contribute  — submit a new heritage site
router.post("/", verifyPlayer, submitContribution);

// GET  /api/contribute  — get current user's contributions
router.get("/", verifyPlayer, getUserContributions);

export default router;
