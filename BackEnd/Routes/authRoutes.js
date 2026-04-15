import express from "express";
import { register, login, logout, refreshToken, getPlayer, googleAuth, updateProfile } from "../Controllers/authController.js";
import { verifyPlayer } from "../Middleware/verifyPlayer.js";
import { verifyRecaptcha } from "../Middleware/verifyRecaptcha.js";
import { verifyRecaptchaV2 } from "../Middleware/verifyRecaptchaV2.js";

const router = express.Router();

// 🔑 Auth routes for Heritage Guesser
router.post("/register", verifyRecaptchaV2, register);
router.post("/login", verifyRecaptcha, login);
router.get("/logout", logout);
router.get("/player", verifyPlayer, getPlayer);
router.post("/refresh-token", refreshToken);

// 🔑 Profile update
router.put("/update-profile", verifyPlayer, updateProfile);

// 🔑 Google OAuth (Supabase)
router.post("/auth/google", googleAuth);

export default router;
