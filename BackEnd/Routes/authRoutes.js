import express from "express";
import { register, login, logout, refreshToken, getPlayer } from "../Controllers/authController.js";
import { verifyPlayer } from "../Middleware/verifyPlayer.js";

const router = express.Router();

// 🔑 Auth routes for Heritage Guesser
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/player", verifyPlayer, getPlayer);
router.post("/refresh-token", refreshToken);

export default router;
