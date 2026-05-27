import { ErrorHandler } from "../../shared/middleware/error.middleware.js";

export const validateSignup = (req, res, next) => {
  const { firstName, lastName, email, phone, password, verificationMethod, role } = req.body;
  if (!firstName || !lastName || !email || !phone || !password || !verificationMethod) {
    throw new ErrorHandler("All fields are required.", 400, "MISSING_FIELDS");
  }
  if (password.length < 8) {
    throw new ErrorHandler("Password must be at least 8 characters long.", 400, "INVALID_INPUT");
  }
  if (role && !["customer", "admin", "manager", "support"].includes(role)) {
    throw new ErrorHandler("Invalid role specified.", 400, "INVALID_INPUT");
  }
  next();
};

export const validateSignin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ErrorHandler("Email and password are required.", 400, "MISSING_FIELDS");
  }
  next();
};

export const validateOtp = (req, res, next) => {
  const { otp, email, phone } = req.body;
  if (!otp || (!email && !phone)) {
    throw new ErrorHandler("OTP and (Email or Phone) are required.", 400, "MISSING_FIELDS");
  }
  next();
};

export const validateResendOtp = (req, res, next) => {
  const { email, phone, verificationMethod } = req.body;
  if ((!email && !phone) || !verificationMethod) {
    throw new ErrorHandler("(Email or Phone) and verificationMethod are required.", 400, "MISSING_FIELDS");
  }
  next();
};
