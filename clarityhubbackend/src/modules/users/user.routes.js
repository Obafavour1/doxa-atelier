import { Router } from "express";
import * as userController from "./user.controller.js";
import { protectRoute, adminRoute } from "../../shared/middleware/auth.middleware.js";

const router = Router();

router.use(protectRoute, adminRoute);

// --- Customer Management ---

/**
 * @openapi
 * /users/customers:
 *   get:
 *     summary: Get all customers (Admin)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of customers.
 */
router.get("/customers", userController.getAllCustomers);

/**
 * @openapi
 * /users/customers/{id}:
 *   get:
 *     summary: Get customer details (Admin)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Customer details.
 */
router.get("/customers/:id", userController.getCustomerDetails);

/**
 * @openapi
 * /users/customers/{id}/status:
 *   patch:
 *     summary: Update customer status (Admin)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: ['active', 'blocked'] }
 *     responses:
 *       200:
 *         description: Status updated.
 */
router.patch("/customers/:id/status", userController.updateCustomerStatus);

// --- Admin Profile & Account ---

/**
 * @openapi
 * /users/profile/overview:
 *   get:
 *     summary: Get admin profile (Admin)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Admin profile.
 */
router.get("/profile/overview", userController.getAdminProfile);

/**
 * @openapi
 * /users/profile/update:
 *   put:
 *     summary: Update admin profile (Admin)
 *     tags: [Users]
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
 *     responses:
 *       200:
 *         description: Profile updated.
 */
router.put("/profile/update", userController.updateAdminProfile);

/**
 * @openapi
 * /users/profile/audit-logs:
 *   get:
 *     summary: Get audit logs (Admin)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Audit logs.
 */
router.get("/profile/audit-logs", userController.getAuditLogs);

/**
 * @openapi
 * /users/profile/notifications:
 *   put:
 *     summary: Update notification settings (Admin)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailNotifications: { type: boolean }
 *     responses:
 *       200:
 *         description: Settings updated.
 */
router.put("/profile/notifications", userController.updateNotificationPreferences);

/**
 * @openapi
 * /users/profile/2fa:
 *   put:
 *     summary: Toggle 2FA (Admin)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               enable: { type: boolean }
 *     responses:
 *       200:
 *         description: 2FA updated.
 */
router.put("/profile/2fa", userController.toggleTwoFactor);

// --- API Keys ---

/**
 * @openapi
 * /users/profile/api-keys:
 *   post:
 *     summary: Generate API Key (Admin)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *     responses:
 *       201:
 *         description: API Key generated.
 */
router.post("/profile/api-keys", userController.generateApiKey);

/**
 * @openapi
 * /users/profile/api-keys/{id}:
 *   delete:
 *     summary: Revoke API Key (Admin)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: API Key revoked.
 */
router.delete("/profile/api-keys/:id", userController.revokeApiKey);

// --- Sessions ---

/**
 * @openapi
 * /users/profile/sessions:
 *   get:
 *     summary: Get active sessions (Admin)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Active sessions.
 */
router.get("/profile/sessions", userController.getAdminSessions);

/**
 * @openapi
 * /users/profile/sessions/{id}:
 *   delete:
 *     summary: Revoke session (Admin)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Session revoked.
 */
router.delete("/profile/sessions/:id", userController.revokeSession);

export default router;
