import { Router } from "express";
import * as cartController from "./cart.controller.js";
import { protectRoute } from "../../shared/middleware/auth.middleware.js";

const router = Router();

router.use(protectRoute);

/**
 * @openapi
 * /cart:
 *   get:
 *     summary: Get user cart
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user cart.
 */
router.get("/", cartController.getCartProducts);

/**
 * @openapi
 * /cart:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, quantity]
 *             properties:
 *               productId: { type: string }
 *               quantity: { type: number, default: 1 }
 *               color: { type: string }
 *               size: { type: string }
 *     responses:
 *       200:
 *         description: Item added to cart.
 */
router.post("/", cartController.addToCart);

/**
 * @openapi
 * /cart:
 *   delete:
 *     summary: Clear cart
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared.
 */
router.delete("/", cartController.removeAllFromCart);

/**
 * @openapi
 * /cart/{id}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID in cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity: { type: number }
 *     responses:
 *       200:
 *         description: Quantity updated.
 */
router.put("/:id", cartController.updateQuantity);

export default router;
