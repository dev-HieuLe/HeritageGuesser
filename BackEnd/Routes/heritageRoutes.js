import express from "express";
import { checkAnswer } from "../Controllers/heritageCheck.js";
import { verifyRecaptcha } from "../Middleware/verifyRecaptcha.js";

const router = express.Router();

// POST /api/heritage/check
router.post("/check", verifyRecaptcha, checkAnswer);

export default router;
