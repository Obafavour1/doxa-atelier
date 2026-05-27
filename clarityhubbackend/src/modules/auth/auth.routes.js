import { Router } from "express";
import * as authController from "./auth.controller.js";
import * as authValidator from "./auth.validator.js";

/**
 * @openapi
 * /auth/sign-up:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, phone, password, verificationMethod]
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               email: { type: string, format: email }
 *               phone: { type: string, example: "+2348000000000" }
 *               password: { type: string, minLength: 8 }
 *               verificationMethod: { type: string, enum: [email, phone] }
 *     responses:
 *       201:
 *         description: User registered successfully. Account verification required.
 *       400:
 *         description: Missing fields or invalid input.
 */

/**
 * @openapi
 * /auth/sign-in:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful. Sets HttpOnly cookies.
 *       401:
 *         description: Invalid email or password.
 *       403:
 *         description: Account locked or unverified.
 */
import { protectRoute } from "../../shared/middleware/auth.middleware.js";
import { authLimiter } from "../../shared/middleware/rateLimit.middleware.js";

const router = Router();

/**
 * @openapi
 * /auth/otp-verification:
 *   post:
 *     summary: Verify User OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully.
 *       400:
 *         description: Invalid or expired OTP.
 */
router.post("/sign-up", authLimiter, authValidator.validateSignup, authController.signup);
router.post("/otp-verification", authLimiter, authValidator.validateOtp, authController.verifyOtp);

/**
 * @openapi
 * /auth/resend-otp:
 *   post:
 *     summary: Resend verification code
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [verificationMethod]
 *             properties:
 *               email: { type: string, format: email }
 *               phone: { type: string, example: "+2348000000000" }
 *               verificationMethod: { type: string, enum: [email, phone] }
 *     responses:
 *       200:
 *         description: Verification code resent successfully.
 *       404:
 *         description: No pending verification found.
 */
router.post("/resend-otp", authLimiter, authValidator.validateResendOtp, authController.resendOtp);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful. Cookies cleared.
 */
router.post("/sign-in", authLimiter, authValidator.validateSignin, authController.signin);
router.post("/logout", authController.logout);
/**
 * @openapi
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     description: Uses the HttpOnly refresh token cookie to checking for a valid session and issue a new access token.
 *     responses:
 *       200:
 *         description: Token refreshed successfully.
 *       401:
 *         description: Invalid or expired refresh token.
 */
router.post("/refresh-token", authController.refreshToken);

/**
 * @openapi
 * /auth/password/forgot:
 *   post:
 *     summary: Request password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password reset email sent.
 *       404:
 *         description: User not found.
 */
router.post("/password/forgot", authController.forgotPassword);
router.post("/password/resend-reset/:token", authController.resendPasswordReset);

/**
 * @openapi
 * /auth/password/reset/{token}:
 *   put:
 *     summary: Reset password with token
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Password reset token received via email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password, confirmPassword]
 *             properties:
 *               password:
 *                 type: string
 *                 minLength: 8
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *       400:
 *         description: Invalid or expired token / Passwords do not match.
 */
router.put("/password/reset/:token", authController.resetPassword);

// Protected routes
router.use(protectRoute);

/**
 * @openapi
 * /auth/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully.
 *       401:
 *         description: Unauthorized.
 */
router.get("/profile", authController.getProfile);

/**
 * @openapi
 * /auth/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               phone: { type: string }
 *               avatar: { type: string, description: "Base64 image or URL" }
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 */
router.put("/profile", authController.updateProfile);

/**
 * @openapi
 * /auth/password/update:
 *   put:
 *     summary: Update password (authenticated)
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword: { type: string }
 *               newPassword: { type: string, minLength: 8 }
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *       401:
 *         description: Incorrect current password.
 */
router.put("/password/update", authController.updatePassword);

export default router;
