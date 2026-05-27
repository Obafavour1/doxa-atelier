import { Router } from "express";
import * as paymentController from "./payment.controller.js";
import { protectRoute } from "../../shared/middleware/auth.middleware.js";

const router = Router();

router.use(protectRoute);

/**
 * @openapi
 * /payments/create-checkout-session:
 *   post:
 *     summary: Create Stripe checkout session
 *     tags: [Payments]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [products]
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId: { type: string }
 *                     quantity: { type: number }
 *               couponCode: { type: string }
 *     responses:
 *       200:
 *         description: Checkout session created.
 */
router.post("/create-checkout-session", paymentController.createCheckoutSession);

/**
 * @openapi
 * /payments/checkout-success:
 *   post:
 *     summary: Handle successful checkout
 *     tags: [Payments]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sessionId]
 *             properties:
 *               sessionId: { type: string }
 *     responses:
 *       200:
 *         description: Order created successfully.
 */
router.post("/checkout-success", paymentController.checkoutSuccess);

export default router;
