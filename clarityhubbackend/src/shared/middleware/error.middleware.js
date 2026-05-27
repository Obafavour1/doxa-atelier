import { errorResponse } from "../utils/response.util.js";
import { env } from "../../config/env.config.js";

export class ErrorHandler extends Error {
  constructor(message, statusCode, code = "INTERNAL_ERROR", details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorMiddleware = (err, req, res, next) => {
  let { statusCode = 500, message = "Internal Server Error", code = "INTERNAL_ERROR", details = null } = err;

  // Wrong Mongoose Object ID Error
  if (err.name === "CastError") {
    message = `Resource not found. Invalid: ${err.path}`;
    statusCode = 400;
    code = "INVALID_ID";
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    message = Object.values(err.errors).map((value) => value.message).join(", ");
    statusCode = 400;
    code = "VALIDATION_ERROR";
    details = err.errors;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    statusCode = 400;
    code = "DUPLICATE_KEY";
  }

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    message = `Json Web Token is invalid, Try again`;
    statusCode = 401;
    code = "INVALID_TOKEN";
  }

  // JWT EXPIRE error
  if (err.name === "TokenExpiredError") {
    message = `Json Web Token is expired, Try again`;
    statusCode = 401;
    code = "TOKEN_EXPIRED";
  }

  return errorResponse(
    res,
    message,
    code,
    env.NODE_ENV === "development" ? { stack: err.stack, ...details } : details,
    statusCode
  );
};
