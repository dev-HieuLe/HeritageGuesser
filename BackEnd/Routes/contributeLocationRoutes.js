import express from "express";
import {
  submitContribution,
  getUserContributions,
  getAllLocations,
  rateLocation,
} from "../Controllers/contributeLocationController.js";
import { verifyPlayer } from "../Middleware/verifyPlayer.js";
import { verifyRecaptchaV2 } from "../Middleware/verifyRecaptchaV2.js";
import { optionalPlayer } from "../Middleware/optionalPlayer.js";

const router = express.Router();

// POST /api/contribute        — submit a new heritage site
router.post("/", verifyPlayer, verifyRecaptchaV2, submitContribution);

// GET  /api/contribute        — get current user's contributions
router.get("/", verifyPlayer, getUserContributions);

// GET  /api/contribute/all    — get all contributed locations (public, optional auth for my_rating)
router.get("/all", optionalPlayer, getAllLocations);

// POST /api/contribute/rate/:id — rate a location
router.post("/rate/:id", verifyPlayer, rateLocation);

export default router;
