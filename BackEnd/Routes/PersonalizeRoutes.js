// BackEnd/Routes/personalize.js
import express from "express";
import { getPersonalizedNextSet } from "../Controllers/personalizeController.js";
import { verifyPlayer } from "../Middleware/verifyPlayer.js";
const router = express.Router();

router.get("/next-set", verifyPlayer, getPersonalizedNextSet);
export default router;
