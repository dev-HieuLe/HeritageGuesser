import express from "express";
import { getLocations, getRandomLocations, getDailyLocations } from "../Controllers/locationController.js";
import { verifyRecaptcha } from "../Middleware/verifyRecaptcha.js";

const router = express.Router();

// GET /api/locations
router.get("/locations", getLocations);
router.get("/locations/daily", getDailyLocations);
router.get("/locations/random", verifyRecaptcha, getRandomLocations);

export default router;
