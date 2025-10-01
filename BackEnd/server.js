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
app.use(helmet());

// Routes
app.use("/api", authRoutes);
app.use("/api", chatRoutes);
app.use("/api", locationRoutes);
app.use("/api/heritage", heritageRoutes);


console.log("NODE_ENV:", process.env.NODE_ENV);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log(`Heritage Guesser server running on port ${PORT}`));
