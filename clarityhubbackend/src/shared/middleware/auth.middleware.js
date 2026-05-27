import jwt from "jsonwebtoken";
import { env } from "../../config/env.config.js";
import User from "../../database/models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ErrorHandler } from "./error.middleware.js";

/**
 * @desc Middleware to protect routes - ensures user is logged in
 */
export const protectRoute = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    throw new ErrorHandler("Unauthorized - No access token provided", 401, "NO_TOKEN");
  }

  try {
    const decoded = jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.userId).select("-password -apiKeys");

    if (!user) {
      throw new ErrorHandler("User not found", 401, "USER_NOT_FOUND");
    }

    if (!user.accountVerified) {
      throw new ErrorHandler("Please verify your account to access this resource", 403, "ACCOUNT_NOT_VERIFIED");
    }

    user.sessionId = decoded.sessionId;
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ErrorHandler("Unauthorized - Access token expired", 401, "TOKEN_EXPIRED");
    }
    throw new ErrorHandler("Unauthorized - Invalid access token", 401, "INVALID_TOKEN");
  }
});

/**
 * @desc Middleware to restrict routes by roles
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ErrorHandler("Access denied - Insufficient permissions", 403, "FORBIDDEN");
    }
    next();
  };
};

/**
 * @desc Convenience middleware for admin-only routes
 */
export const adminRoute = restrictTo("admin", "manager", "support");
