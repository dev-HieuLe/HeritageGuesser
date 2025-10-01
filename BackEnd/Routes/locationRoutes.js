import express from "express";
import { getLocations } from "../Controllers/locationController.js";

const router = express.Router();

// GET /api/locations
router.get("/locations", getLocations);

export default router;
