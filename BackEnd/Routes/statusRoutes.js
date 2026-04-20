import express from "express";
import { getSiteStatus, recordStreetViewLoad } from "../Controllers/statusController.js";

const router = express.Router();

router.get("/status", getSiteStatus);
router.post("/status/sv-load", recordStreetViewLoad);

export default router;
