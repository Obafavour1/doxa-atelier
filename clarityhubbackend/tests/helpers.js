import jwt from "jsonwebtoken";
import { env } from "../src/config/env.config.js";
import User from "../src/database/models/user.model.js";
import crypto from "crypto";
import { storeRefreshToken } from "../src/modules/auth/auth.service.js";

export const createTestUser = async (overrides = {}) => {
  const user = await User.create({
    firstName: "Test",
    lastName: "User",
    email: `test_${Math.random()}@example.com`,
    password: "password123",
    phone: "+2348000000000",
    accountVerified: true,
    ...overrides,
  });
  return user;
};

export const getAuthTokens = async (user) => {
  const sessionId = crypto.randomBytes(16).toString("hex");
  const accessToken = jwt.sign(
    { userId: user._id, sessionId },
    env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { userId: user._id, sessionId },
    env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  
  await storeRefreshToken(user._id, refreshToken, sessionId, "Test Device");
  
  return { accessToken, refreshToken, sessionId };
};
