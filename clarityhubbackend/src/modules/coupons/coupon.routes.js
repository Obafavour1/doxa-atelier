import { Router } from "express";
import * as couponController from "./coupon.controller.js";
import { protectRoute, adminRoute } from "../../shared/middleware/auth.middleware.js";

const router = Router();

// --- User Routes ---
router.use(protectRoute);

/**
 * @openapi
 * /coupons:
 *   get:
 *     summary: Get available coupons
 *     tags: [Coupons]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of available coupons.
 */
router.get("/", couponController.getCoupon);

/**
 * @openapi
 * /coupons/validate:
 *   post:
 *     summary: Validate a coupon code
 *     tags: [Coupons]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code]
 *             properties:
 *               code: { type: string }
 *     responses:
 *       200:
 *         description: Coupon is valid.
 */
router.post("/validate", couponController.validateCoupon);

/**
 * @openapi
 * /coupons/apply:
 *   post:
 *     summary: Apply coupon to cart
 *     tags: [Coupons]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code]
 *             properties:
 *               code: { type: string }
 *     responses:
 *       200:
 *         description: Coupon applied successfully.
 */
router.post("/apply", couponController.applyCoupon);

// --- Admin Routes ---
router.use(adminRoute);

/**
 * @openapi
 * /coupons/admin:
 *   get:
 *     summary: Get all coupons (Admin)
 *     tags: [Coupons]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all coupons.
 */
router.get("/admin", couponController.getAllCoupons);

/**
 * @openapi
 * /coupons/admin:
 *   post:
 *     summary: Create new coupon (Admin)
 *     tags: [Coupons]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, discount]
 *             properties:
 *               code: { type: string }
 *               discount: { type: number, description: "Percentage discount" }
 *               expiryDate: { type: string, format: date }
 *     responses:
 *       201:
 *         description: Coupon created.
 */
router.post("/admin", couponController.createCoupon);

/**
 * @openapi
 * /coupons/admin/{id}:
 *   delete:
 *     summary: Delete coupon (Admin)
 *     tags: [Coupons]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Coupon deleted.
 */
router.delete("/admin/:id", couponController.deleteCoupon);

export default router;
