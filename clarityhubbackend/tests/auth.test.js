import request from "supertest";
import app from "../src/app.js";
import User from "../src/database/models/user.model.js";
import { redis } from "../src/database/redis.config.js";
import { createTestUser, getAuthTokens } from "./helpers.js";

describe("Auth Module Integration Tests", () => {
  describe("POST /api/auth/sign-up", () => {
    it("should register a new user successfully", async () => {
      const res = await request(app).post("/api/auth/sign-up").send({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "+2348012345678",
        password: "password123",
        verificationMethod: "email",
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain("verify your account");

      const user = await User.findOne({ email: "john@example.com" });
      expect(user).toBeDefined();
      expect(user.accountVerified).toBe(false);
    });

    it("should fail validation if fields are missing", async () => {
      const res = await request(app).post("/api/auth/sign-up").send({
        firstName: "John",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should reject sign up when email already exists on a pending account", async () => {
      await User.create({
        firstName: "Pending",
        lastName: "User",
        email: "pending@example.com",
        password: "password123",
        phone: "+2348000000099",
        accountVerified: false,
      });

      const res = await request(app).post("/api/auth/sign-up").send({
        firstName: "John",
        lastName: "Doe",
        email: "pending@example.com",
        phone: "+2348012345678",
        password: "password123",
        verificationMethod: "email",
      });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("pending account");
      expect(res.body.error.code).toBe("DUPLICATE_SIGNUP_FIELD");
    });

    it("should reject sign up when fields contain only spaces", async () => {
      const res = await request(app).post("/api/auth/sign-up").send({
        firstName: "   ",
        lastName: "Doe",
        email: "john@example.com",
        phone: "+2348012345678",
        password: "password123",
        verificationMethod: "email",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("MISSING_FIELDS");
    });
  });

  describe("POST /api/auth/otp-verification", () => {
    it("should verify account with correct OTP", async () => {
      const user = await User.create({
        firstName: "Verify",
        lastName: "Me",
        email: "verify@example.com",
        password: "password123",
        phone: "+2348000000001",
        accountVerified: false,
        verificationCode: 123456,
        verificationCodeExpire: Date.now() + 10000,
      });

      const res = await request(app).post("/api/auth/otp-verification").send({
        email: "verify@example.com",
        otp: "123456",
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.accountVerified).toBe(true);
    });
  });

  describe("POST /api/auth/sign-in", () => {
    it("should login successfully and return tokens", async () => {
      await createTestUser({ email: "login@example.com", password: "password123" });

      const res = await request(app).post("/api/auth/sign-in").send({
        email: "login@example.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should lock account after 5 failed attempts", async () => {
      await createTestUser({ email: "lock@example.com", password: "password123" });

      for (let i = 0; i < 5; i++) {
        await request(app).post("/api/auth/sign-in").send({
          email: "lock@example.com",
          password: "wrongpassword",
        });
      }

      const res = await request(app).post("/api/auth/sign-in").send({
        email: "lock@example.com",
        password: "password123",
      });

      expect(res.status).toBe(403);
      expect(res.body.message).toContain("locked");
    });

    it("should reject login when email or password is blank after trimming", async () => {
      const res = await request(app).post("/api/auth/sign-in").send({
        email: "   ",
        password: "   ",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("MISSING_FIELDS");
    });
  });

  describe("POST /api/auth/refresh-token", () => {
    it("should rotate refresh tokens successfully", async () => {
      const user = await createTestUser();
      const { refreshToken } = await getAuthTokens(user);

      const res = await request(app)
        .post("/api/auth/refresh-token")
        .set("Cookie", [`refreshToken=${refreshToken}`]);

      expect(res.status).toBe(200);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.headers["set-cookie"]).toBeDefined(); // New refresh token cookie
    });
  });

  describe("POST /api/auth/password/forgot", () => {
    it("should send a reset email for existing verified user", async () => {
      await createTestUser({ email: "forgot@example.com" });

      const res = await request(app)
        .post("/api/auth/password/forgot")
        .send({ email: "forgot@example.com" });

      expect(res.status).toBe(200);
      expect(res.body.message).toContain("Reset link sent");
    });
  });
});
