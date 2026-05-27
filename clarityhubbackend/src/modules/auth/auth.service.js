import jwt from "jsonwebtoken";
import twilio from "twilio";
import crypto from "crypto";
import { redis } from "../../database/redis.config.js";
import { env } from "../../config/env.config.js";
// import User from "../../database/models/user.model.js";
import { sendEmail } from "../../shared/utils/sendEmail.util.js";
import { ErrorHandler } from "../../shared/middleware/error.middleware.js";

const twilioClient = twilio(env.TWILIO.SID, env.TWILIO.AUTH_TOKEN);

export const generateToken = (userId, sessionId) => {
  const accessToken = jwt.sign({ userId, sessionId }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId, sessionId }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

export const storeRefreshToken = async (userId, refreshToken, sessionId, userAgent) => {
  const sessionData = JSON.stringify({
    refreshToken,
    userAgent,
    createdAt: new Date(),
  });
  // Store session in Redis
  await redis.set(`session:${userId}:${sessionId}`, sessionData, "EX", 7 * 24 * 60 * 60);
  await redis.sadd(`user_sessions:${userId}`, sessionId);
};

export const revokeSession = async (userId, sessionId) => {
  await redis.del(`session:${userId}:${sessionId}`);
  await redis.srem(`user_sessions:${userId}`, sessionId);
};

export const setCookies = (res, accessToken, refreshToken) => {
  const isProd = env.NODE_ENV === "production";
  const commonOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  };

  res.cookie("accessToken", accessToken, {
    ...commonOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    ...commonOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^\+234\d{9,10}$/;
  return phoneRegex.test(phone);
};

export const sendVerificationCode = async (method, code, name, email, phone) => {
  if (method === "email") {
    const html = generateEmailTemplate(code);
    await sendEmail({ email, subject: "Your Verification Code", message: html });
  } else if (method === "phone") {
    const codeWithSpaces = code.toString().split("").join(" ");
    await twilioClient.calls.create({
      twiml: `<Response><Say>Your verification code is ${codeWithSpaces}. I repeat, ${codeWithSpaces}.</Say></Response>`,
      from: env.TWILIO.PHONE_NUMBER,
      to: phone,
    });
  } else {
    throw new ErrorHandler("Invalid verification method", 400);
  }
};

const generateEmailTemplate = (code) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #4CAF50; text-align: center;">Verification Code</h2>
      <p style="font-size: 16px; color: #333;">Your verification code is:</p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #4CAF50; padding: 10px 20px; border: 1px solid #4CAF50; border-radius: 5px; background-color: #e8f5e9;">
          ${code}
        </span>
      </div>
      <p style="font-size: 14px; color: #666;">This code will expire in 10 minutes.</p>
    </div>
`;

export const generateResetEmailTemplate = (url) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #4CAF50; text-align: center;">Password Reset Request</h2>
      <p style="font-size: 16px; color: #333;">Click the button below to reset your password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
      </div>
      <p style="font-size: 12px; color: #999;">If the button doesn't work, copy and paste this link: ${url}</p>
    </div>
`;
