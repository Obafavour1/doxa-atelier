import { Router } from "express";
import AuthRoutes from "../../modules/auth/auth.routes.js";
import ProductRoutes from "../../modules/products/product.routes.js";
import CartRoutes from "../../modules/cart/cart.routes.js";
import PaymentRoutes from "../../modules/payments/payment.routes.js";
import CouponRoutes from "../../modules/coupons/coupon.routes.js";
import OrderRoutes from "../../modules/orders/order.routes.js";
import UserRoutes from "../../modules/users/user.routes.js";
import AnalyticsRoutes from "../../modules/analytics/analytics.routes.js";
import SettingsRoutes from "../../modules/settings/settings.routes.js";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/products", ProductRoutes);
router.use("/cart", CartRoutes);
router.use("/payments", PaymentRoutes);
router.use("/coupons", CouponRoutes);
router.use("/orders", OrderRoutes);
router.use("/users", UserRoutes);
router.use("/analytics", AnalyticsRoutes);
router.use("/settings", SettingsRoutes);

export default router;
