import { ErrorHandler } from "../../shared/middleware/error.middleware.js";

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

export const validateSignup = (req, res, next) => {
  const { firstName, lastName, email, phone, password, verificationMethod, role } = req.body;

  if (
    !isNonEmptyString(firstName) ||
    !isNonEmptyString(lastName) ||
    !isNonEmptyString(email) ||
    !isNonEmptyString(phone) ||
    !isNonEmptyString(password) ||
    !isNonEmptyString(verificationMethod)
  ) {
    throw new ErrorHandler("All fields are required.", 400, "MISSING_FIELDS");
  }

  if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
    throw new ErrorHandler("A valid email address is required.", 400, "INVALID_INPUT");
  }

  if (password.trim().length < 8) {
    throw new ErrorHandler("Password must be at least 8 characters long.", 400, "INVALID_INPUT");
  }

  if (!["email", "phone"].includes(verificationMethod.trim())) {
    throw new ErrorHandler("Invalid verification method.", 400, "INVALID_INPUT");
  }

  if (role && !["customer", "admin", "manager", "support"].includes(role)) {
    throw new ErrorHandler("Invalid role specified.", 400, "INVALID_INPUT");
  }

  req.body.firstName = firstName.trim();
  req.body.lastName = lastName.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.phone = phone.trim();
  req.body.password = password.trim();
  req.body.verificationMethod = verificationMethod.trim();

  next();
};

export const validateSignin = (req, res, next) => {
  const { email, password } = req.body;

  if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
    throw new ErrorHandler("Email and password are required.", 400, "MISSING_FIELDS");
  }

  req.body.email = email.trim().toLowerCase();
  req.body.password = password.trim();

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
