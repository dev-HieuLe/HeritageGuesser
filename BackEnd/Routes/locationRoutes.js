import express from "express";
import { getLocations, getRandomLocations, getDailyLocations, rateGameLocation, getGameLocationRating } from "../Controllers/locationController.js";
import { verifyRecaptcha } from "../Middleware/verifyRecaptcha.js";
import { verifyPlayer } from "../Middleware/verifyPlayer.js";
import { optionalPlayer } from "../Middleware/optionalPlayer.js";

const router = express.Router();

// GET /api/locations — optional auth so logged-in users get their my_rating
router.get("/locations", optionalPlayer, getLocations);
router.get("/locations/daily", optionalPlayer, getDailyLocations);
router.get("/locations/random", optionalPlayer, verifyRecaptcha, getRandomLocations);

// Rating endpoints — must be above any :param routes
router.post("/locations/rate/:id", verifyPlayer, rateGameLocation);
router.get("/locations/rating/:id", optionalPlayer, getGameLocationRating);

export default router;
