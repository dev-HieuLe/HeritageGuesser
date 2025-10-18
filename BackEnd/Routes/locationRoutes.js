import express from "express";
import { getLocations, getRandomLocations } from "../Controllers/locationController.js";

const router = express.Router();

// GET /api/locations
router.get("/locations", getLocations);
router.get("/locations/random", getRandomLocations);

export default router;
