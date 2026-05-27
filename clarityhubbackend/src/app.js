import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.config.js";
import { errorMiddleware, ErrorHandler } from "./shared/middleware/error.middleware.js";
import AppRouter from "./shared/routes/index.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.config.js";

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5000",
  "https://claritystore.vercel.app",
  env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked request from: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Clarity Store API is running",
    version: "1.0.0",
  });
});

// Swagger Documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/docs-json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// API Routes
app.use("/api", limiter);
app.use("/api/", AppRouter);

// 404 Handler
app.use((req, res, next) => {
  next(new ErrorHandler(`Route ${req.originalUrl} not found`, 404, "ROUTE_NOT_FOUND"));
});

// Global Error Handler
app.use(errorMiddleware);

export default app;
