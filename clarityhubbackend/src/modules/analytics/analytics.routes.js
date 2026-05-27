import { Router } from "express";
import * as analyticsController from "./analytics.controller.js";
import { protectRoute, adminRoute } from "../../shared/middleware/auth.middleware.js";

const router = Router();

/**
 * @openapi
 * /analytics:
 *   get:
 *     summary: Get dashboard analytics (Admin)
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: range
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 90d, 12m]
 *           default: 7d
 *     responses:
 *       200:
 *         description: Dashboard statistics.
 */
router.get("/", protectRoute, adminRoute, analyticsController.getDashboardAnalytics);

export default router;
