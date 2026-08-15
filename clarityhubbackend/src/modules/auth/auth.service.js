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
    const html = generateEmailTemplate(code, name);
    await sendEmail({ email, subject: "Verify your DOXA Atelier account", message: html });
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

const generateEmailTemplate = (code, name) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; border: 1px solid rgba(148,26,69,.16); border-radius: 12px; background-color: #fff8f2;">
      <p style="font-size: 12px; font-weight: 700; letter-spacing: .08em; color: #941a45; text-align: center;">DOXA ATELIER</p>
      <h2 style="color: #160812; text-align: center;">Verify your email</h2>
      <p style="font-size: 16px; color: #6f5864;">Hello ${name || "there"}, your verification code is:</p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="display: inline-block; font-size: 28px; font-weight: bold; letter-spacing: .28em; color: #941a45; padding: 14px 20px; border: 1px solid rgba(148,26,69,.24); border-radius: 8px; background-color: #fff1f6;">
          ${code}
        </span>
      </div>
      <p style="font-size: 14px; color: #6f5864;">This code expires in 10 minutes. If you did not create a DOXA Atelier account, you can ignore this email.</p>
    </div>
`;

export const generateResetEmailTemplate = (url) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; border: 1px solid rgba(148,26,69,.16); border-radius: 12px; background-color: #fff8f2;">
      <p style="font-size: 12px; font-weight: 700; letter-spacing: .08em; color: #941a45; text-align: center;">DOXA ATELIER</p>
      <h2 style="color: #160812; text-align: center;">Reset your password</h2>
      <p style="font-size: 16px; color: #6f5864;">Use the button below to choose a new password for your DOXA Atelier account.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" target="_blank" rel="noopener noreferrer" style="background-color: #941a45; color: white; padding: 12px 24px; text-decoration: none; border-radius: 100px; font-weight: bold;">Reset password</a>
      </div>
      <p style="font-size: 12px; color: #9b7b8b;">If the button does not work, copy and paste this link: ${url}</p>
    </div>
`;
