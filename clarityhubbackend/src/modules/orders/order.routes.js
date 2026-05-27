import { Router } from "express";
import * as orderController from "./order.controller.js";
import { protectRoute, adminRoute } from "../../shared/middleware/auth.middleware.js";

const router = Router();

// --- User Routes ---

/**
 * @openapi
 * /orders/my-orders:
 *   get:
 *     summary: Get user orders
 *     tags: [Orders]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of user orders.
 */
router.get("/my-orders", protectRoute, orderController.getMyOrders);

// --- Admin Routes ---
router.use(protectRoute, adminRoute);

/**
 * @openapi
 * /orders:
 *   get:
 *     summary: Get all orders (Admin)
 *     tags: [Orders]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all orders.
 */
router.get("/", orderController.getAllOrdersAdmin);

/**
 * @openapi
 * /orders/export:
 *   get:
 *     summary: Export orders (Admin)
 *     tags: [Orders]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Downloadable CSV/Excel report.
 */
router.get("/export", orderController.exportOrders);

/**
 * @openapi
 * /orders/{id}:
 *   get:
 *     summary: Get order details (Admin)
 *     tags: [Orders]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Order details.
 */
router.get("/:id", orderController.getOrderDetails);

/**
 * @openapi
 * /orders/{id}/status:
 *   patch:
 *     summary: Update order status (Admin)
 *     tags: [Orders]
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
 *               status: { type: string, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] }
 *     responses:
 *       200:
 *         description: Status updated.
 */
router.patch("/:id/status", orderController.updateOrderStatus);

/**
 * @openapi
 * /orders/{id}/shipping:
 *   patch:
 *     summary: Update shipping info (Admin)
 *     tags: [Orders]
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
 *             properties:
 *               trackingNumber: { type: string }
 *               carrier: { type: string }
 *     responses:
 *       200:
 *         description: Shipping info updated.
 */
router.patch("/:id/shipping", orderController.updateShippingInfo);

/**
 * @openapi
 * /orders/{id}/refund:
 *   post:
 *     summary: Process refund (Admin)
 *     tags: [Orders]
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
 *             properties:
 *               amount: { type: number }
 *               reason: { type: string }
 *     responses:
 *       200:
 *         description: Refund processed.
 */
router.post("/:id/refund", orderController.processRefund);

export default router;
