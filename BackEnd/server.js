import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet";
dotenv.config();

// Import only auth routes
import authRoutes from "./Routes/authRoutes.js";
import chatRoutes from "./Routes/chatRoutes.js";
import locationRoutes from "./Routes/locationRoutes.js";
import heritageRoutes from "./Routes/heritageRoutes.js";
import leaderboardRoutes from "./Routes/LeaderboardRoutes.js";
import playerRoutes from "./Routes/playerRoutes.js";
import DiscoverRoutes from "./Routes/discoverRoutes.js";
import historyRoutes from "./Routes/historyRoutes.js";
import personalizeRoutes from "./Routes/PersonalizeRoutes.js";
import contributeLocationRoutes from "./Routes/contributeLocationRoutes.js";
import ttsRoutes from "./Routes/ttsRoutes.js";
import statusRoutes from "./Routes/statusRoutes.js";

const app = express();

// Allowed origins for CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_WWW,
  "http://localhost:5173",
].filter(Boolean); // remove undefined values

console.log("CORS allowed origins:", allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without origin (Postman, curl, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
  })
);

// Global middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc:  ["'self'"],
        scriptSrc:   ["'self'", "'unsafe-inline'", "https://maps.googleapis.com", "https://maps.gstatic.com", "https://www.google.com", "https://www.gstatic.com", "https://www.recaptcha.net"],
        frameSrc:    ["'self'", "https://*.google.com", "https://*.googleapis.com", "https://*.gstatic.com", "https://www.recaptcha.net", "https://recaptcha.google.com"],
        imgSrc:      ["'self'", "data:", "blob:", "https://*.googleapis.com", "https://*.gstatic.com", "https://*.google.com", "https://streetviewpixels-pa.googleapis.com", "https://lh3.googleusercontent.com"],
        connectSrc:  ["'self'", "https://*.googleapis.com", "https://*.google.com", "https://www.google.com", "https://www.recaptcha.net"],
        styleSrc:    ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc:     ["'self'", "https://fonts.gstatic.com", "data:"],
        workerSrc:   ["blob:"],
        objectSrc:   ["'none'"],
        mediaSrc:    ["'self'", "blob:", "data:"],
      },
    },
    // Google Maps uses cross-origin resources; this must be disabled
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Routes
app.use("/api", authRoutes);
app.use("/api", chatRoutes);
app.use("/api", locationRoutes);
app.use("/api/heritage", heritageRoutes);
app.use("/api", leaderboardRoutes);
app.use("/api/player", playerRoutes);
app.use("/api/discover", DiscoverRoutes);
app.use("/api/player/history", historyRoutes);
app.use("/api/personalize", personalizeRoutes);
app.use("/api/contribute", contributeLocationRoutes);
app.use("/api", ttsRoutes);
app.use("/api", statusRoutes);

console.log("NODE_ENV:", process.env.NODE_ENV);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log(`Heritage Guesser server running on port ${PORT}`));
