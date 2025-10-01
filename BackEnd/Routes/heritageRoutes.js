import express from "express";
import { checkAnswer } from "../Controllers/heritageCheck.js";

const router = express.Router();

// POST /api/heritage/check
router.post("/check", checkAnswer);

export default router;
