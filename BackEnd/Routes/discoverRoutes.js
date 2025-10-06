
import express from "express";
import { searchDiscover } from "../Controllers/DiscoverController.js";

const router = express.Router();

router.get("/search", (req, res, next) => {
  console.log("📡 /api/discover/search route triggered");
  next();
}, searchDiscover);

export default router;
