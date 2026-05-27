import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // increased to 10 for better DX
  message: {
    success: false,
    message: "Too many login/signup attempts. Please try again after 15 minutes",
    error: { code: "TOO_MANY_REQUESTS" }
  },
});
