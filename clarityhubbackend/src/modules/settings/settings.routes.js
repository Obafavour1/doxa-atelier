import { Router } from "express";
import * as settingsController from "./settings.controller.js";
import { protectRoute, adminRoute } from "../../shared/middleware/auth.middleware.js";

const router = Router();

router.use(protectRoute, adminRoute);

// --- General Store Settings ---
/**
 * @openapi
 * /settings/store:
 *   get:
 *     summary: Get store settings (Admin)
 *     tags: [Settings]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Store settings.
 */
router.get("/store", settingsController.getStoreSettings);

/**
 * @openapi
 * /settings/store:
 *   put:
 *     summary: Update store settings (Admin)
 *     tags: [Settings]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               storeName: { type: string }
 *               currency: { type: string }
 *     responses:
 *       200:
 *         description: Settings updated.
 */
router.put("/store", settingsController.updateStoreSettings);

// --- Shipping Management ---

/**
 * @openapi
 * /settings/shipping:
 *   get:
 *     summary: Get shipping zones (Admin)
 *     tags: [Settings]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of shipping zones.
 */
router.get("/shipping", settingsController.getShippingZones);

/**
 * @openapi
 * /settings/shipping:
 *   post:
 *     summary: Create shipping zone (Admin)
 *     tags: [Settings]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, regions]
 *             properties:
 *               name: { type: string }
 *               regions: { type: array, items: { type: string } }
 *     responses:
 *       201:
 *         description: Shipping zone created.
 */
router.post("/shipping", settingsController.createShippingZone);

/**
 * @openapi
 * /settings/shipping/{id}:
 *   put:
 *     summary: Update shipping zone (Admin)
 *     tags: [Settings]
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
 *               name: { type: string }
 *     responses:
 *       200:
 *         description: Shipping zone updated.
 */
router.put("/shipping/:id", settingsController.updateShippingZone);

/**
 * @openapi
 * /settings/shipping/{id}:
 *   delete:
 *     summary: Delete shipping zone (Admin)
 *     tags: [Settings]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Shipping zone deleted.
 */
router.delete("/shipping/:id", settingsController.deleteShippingZone);

export default router;
