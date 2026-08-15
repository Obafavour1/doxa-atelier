import crypto from "crypto";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../../shared/utils/asyncHandler.util.js";
import { ErrorHandler } from "../../shared/middleware/error.middleware.js";
import { successResponse } from "../../shared/utils/response.util.js";
import User from "../../database/models/user.model.js";
import AuditLog from "../../database/models/auditLog.model.js";
import { redis } from "../../database/redis.config.js";
import { env } from "../../config/env.config.js";
import { sendEmail } from "../../shared/utils/sendEmail.util.js";
import * as authService from "./auth.service.js";

export const signup = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, phone, password, verificationMethod, role } = req.body;

  if (!authService.validatePhoneNumber(phone)) {
    throw new ErrorHandler("Invalid phone number format. Use +234XXXXXXXXX", 400);
  }

  const existingUser = await User.findOne({ $or: [{ email }, { phone }] });

  if (existingUser) {
    const duplicateField = existingUser.email === email ? "email" : "phone";
    const duplicateMessage = existingUser.accountVerified
      ? `This ${duplicateField} is already attached to an existing account.`
      : `A pending account already exists with this ${duplicateField}. Please verify that account instead.`;

    throw new ErrorHandler(duplicateMessage, 409, "DUPLICATE_SIGNUP_FIELD", {
      field: duplicateField,
    });
  }

  const user = await User.create({ firstName, lastName, email, password, phone, role });
  const verificationCode = user.generateVerificationCode();
  await user.save();

  await authService.sendVerificationCode(
    verificationMethod,
    verificationCode,
    `${firstName} ${lastName}`,
    email,
    phone
  );

  return successResponse(res, "User registered. Please verify your account.", {
    user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role }
  }, 201);
});

export const verifyOtp = asyncHandler(async (req, res, next) => {
  const { email, otp, phone } = req.body;

  const query = email ? { email, accountVerified: false } : { phone, accountVerified: false };
  const users = await User.find(query).sort({ createdAt: -1 });

  if (!users || users.length === 0) {
    throw new ErrorHandler("No pending verification found.", 404);
  }

  const user = users[0];

  if (users.length > 1) {
    await User.deleteMany({ _id: { $ne: user._id }, ...query });
  }

  if (user.verificationCode !== Number(otp)) {
    throw new ErrorHandler("Invalid OTP.", 400);
  }

  if (Date.now() > user.verificationCodeExpire) {
    throw new ErrorHandler("OTP has expired.", 400);
  }

  user.accountVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpire = undefined;
  await user.save({ validateModifiedOnly: true });

  const sessionId = crypto.randomBytes(16).toString("hex");
  const userAgent = req.headers["user-agent"] || "Unknown Device";
  const { accessToken, refreshToken } = authService.generateToken(user._id, sessionId);
  await authService.storeRefreshToken(user._id, refreshToken, sessionId, userAgent);
  authService.setCookies(res, accessToken, refreshToken);

  return successResponse(res, "Account verified successfully.", {
    user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role },
    accessToken
  });
});

export const resendOtp = asyncHandler(async (req, res, next) => {
  const { email, phone, verificationMethod } = req.body;

  const query = email ? { email, accountVerified: false } : { phone, accountVerified: false };
  const user = await User.findOne(query);

  if (!user) {
    throw new ErrorHandler("No pending verification found for this user.", 404);
  }

  const verificationCode = user.generateVerificationCode();
  await user.save({ validateBeforeSave: false });

  await authService.sendVerificationCode(
    verificationMethod,
    verificationCode,
    `${user.firstName} ${user.lastName}`,
    user.email,
    user.phone
  );

  return successResponse(res, "Verification code resent successfully.");
});

export const signin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password +loginAttempts +lockUntil");
  if (!user) throw new ErrorHandler("Invalid email or password", 401);

  // Check if account is locked
  if (user.lockUntil && user.lockUntil > Date.now()) {
    throw new ErrorHandler("Account is locked due to multiple failed attempts. Please try again later.", 403);
  }

  if (!user.accountVerified) throw new ErrorHandler("Please verify your account first", 403);

  const isMatched = await user.comparePassword(password);
  
  if (!isMatched) {
    user.loginAttempts += 1;
    if (user.loginAttempts >= 5) {
      user.lockUntil = Date.now() + 15 * 60 * 1000; // Lock for 15 mins
    }
    await user.save({ validateBeforeSave: false });
    throw new ErrorHandler("Invalid email or password", 401);
  }

  // Reset failed attempts on successful login
  user.loginAttempts = 0;
  user.lockUntil = undefined;
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const sessionId = crypto.randomBytes(16).toString("hex");
  const userAgent = req.headers["user-agent"] || "Unknown Device";

  await AuditLog.create({
    user: user._id,
    action: "User Login",
    module: "Auth",
    ipAddress: req.ip,
    deviceInfo: userAgent,
  });

  const { accessToken, refreshToken } = authService.generateToken(user._id, sessionId);
  await authService.storeRefreshToken(user._id, refreshToken, sessionId, userAgent);
  authService.setCookies(res, accessToken, refreshToken);

  return successResponse(res, "Login successful", {
    user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role },
    accessToken,
  });
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email, accountVerified: true });
  if (!user) throw new ErrorHandler("User not found", 404);

  const resetToken = user.generateResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${env.CLIENT_URL}/password/reset/${resetToken}`;
  
  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message: authService.generateResetEmailTemplate(resetPasswordUrl),
    });
    return successResponse(res, `Reset link sent to ${user.email}`);
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ErrorHandler("Email could not be sent", 500);
  }
});

export const resendPasswordReset = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
  
  // Find user by the old token, even if it's expired
  const user = await User.findOne({ resetPasswordToken });
  
  if (!user) {
    throw new ErrorHandler("Invalid token. Please request a new link from the forgot password page.", 400);
  }

  const newResetToken = user.generateResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${env.CLIENT_URL}/password/reset/${newResetToken}`;
  
  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message: authService.generateResetEmailTemplate(resetPasswordUrl),
    });
    return successResponse(res, `New reset link sent to ${user.email}`);
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ErrorHandler("Email could not be sent", 500);
  }
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) throw new ErrorHandler("Passwords do not match", 400);

  const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } }).select("+password");

  if (!user) throw new ErrorHandler("Invalid or expired reset token", 400);

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  return successResponse(res, "Password reset successfully. You can now login.");
});

export const logout = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);
      await redis.del(`session:${decoded.userId}:${decoded.sessionId}`);
      await redis.srem(`user_sessions:${decoded.userId}`, decoded.sessionId);
    } catch (err) {}
  }

  const cookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  };

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  return successResponse(res, "Logged out successfully");
});

export const refreshToken = asyncHandler(async (req, res, next) => {
  const oldRefreshToken = req.cookies.refreshToken;
  if (!oldRefreshToken) throw new ErrorHandler("No refresh token provided", 401);

  let decoded;
  try {
    decoded = jwt.verify(oldRefreshToken, env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw new ErrorHandler("Invalid or expired refresh token", 401);
  }

  const sessionData = await redis.get(`session:${decoded.userId}:${decoded.sessionId}`);
  if (!sessionData) throw new ErrorHandler("Session revoked or invalid", 401);

  const parsedSession = JSON.parse(sessionData);
  if (parsedSession.refreshToken !== oldRefreshToken) {
    // SECURITY: If token is valid but doesn't match current session, it might be a reused/stolen token
    await authService.revokeSession(decoded.userId, decoded.sessionId);
    throw new ErrorHandler("Token reuse detected. Session revoked.", 401);
  }

  // Rotate tokens
  const userAgent = req.headers["user-agent"] || parsedSession.userAgent;
  const { accessToken, refreshToken } = authService.generateToken(decoded.userId, decoded.sessionId);
  await authService.storeRefreshToken(decoded.userId, refreshToken, decoded.sessionId, userAgent);
  authService.setCookies(res, accessToken, refreshToken);

  return successResponse(res, "Token refreshed successfully", { accessToken });
});

export const getProfile = asyncHandler(async (req, res, next) => {
  return successResponse(res, "Profile fetched", { user: req.user });
});

export const updateProfile = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, phone } = req.body;
  const user = await User.findById(req.user._id);

  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (email) user.email = email;
  if (phone) {
    if (!authService.validatePhoneNumber(phone)) throw new ErrorHandler("Invalid phone number format", 400);
    user.phone = phone;
  }

  await user.save();
  return successResponse(res, "Profile updated successfully", { user });
});

export const updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, currentPassword, newPassword, confirmPassword } = req.body;
  const existingPassword = oldPassword || currentPassword;

  if (!existingPassword || !newPassword) {
    throw new ErrorHandler("Current password and new password are required", 400);
  }

  if (confirmPassword && newPassword !== confirmPassword) {
    throw new ErrorHandler("Passwords do not match", 400);
  }

  const user = await User.findById(req.user._id).select("+password");
  const isMatched = await user.comparePassword(existingPassword);
  if (!isMatched) throw new ErrorHandler("Incorrect old password", 401);

  user.password = newPassword;
  await user.save();

  return successResponse(res, "Password updated successfully");
});
