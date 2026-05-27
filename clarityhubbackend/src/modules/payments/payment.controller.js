import { asyncHandler } from "../../shared/utils/asyncHandler.util.js";
import { successResponse } from "../../shared/utils/response.util.js";
import { ErrorHandler } from "../../shared/middleware/error.middleware.js";
import { stripe } from "../../config/stripe.config.js";
import { env } from "../../config/env.config.js";
import Coupon from "../../database/models/coupon.model.js";
import Order from "../../database/models/order.model.js";
import * as paymentService from "./payment.service.js";

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const { products, couponCode } = req.body;
  if (!Array.isArray(products) || products.length === 0) throw new ErrorHandler("Invalid or empty products array", 400);

  const lineItems = products.map((product) => ({
    price_data: {
      currency: "usd",
      product_data: { name: product.name, images: product.image ? [product.image] : [] },
      unit_amount: Math.round(product.price * 100),
    },
    quantity: product.quantity || 1,
  }));

  let stripeCouponId = null;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true, $or: [{ user: req.user._id }, { user: null }] });
    if (coupon) {
      if (new Date(coupon.expirationDate) < new Date()) {
        coupon.isActive = false;
        await coupon.save();
      } else {
        stripeCouponId = await paymentService.createStripeCoupon(coupon.discountPercentage);
      }
    }
  }

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: `${env.CLIENT_URL}/purchase-success?session_id={{CHECKOUT_SESSION_ID}}`,
    cancel_url: `${env.CLIENT_URL}/purchase-cancel`,
    discounts: stripeCouponId ? [{ coupon: stripeCouponId }] : [],
    metadata: {
      userId: req.user._id.toString(),
      couponCode: couponCode || "",
      products: JSON.stringify(products.map((p) => ({ id: p._id.toString(), qty: p.quantity, price: p.price }))),
    },
  });

  const totalAmount = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  if (totalAmount >= 200) await paymentService.createNewRewardCoupon(req.user._id);

  return successResponse(res, "Checkout session created", { id: session.id, totalAmount });
});

export const checkoutSuccess = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) throw new ErrorHandler("Session ID is required", 400);

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") throw new ErrorHandler("Payment not completed", 400);

  const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
  if (existingOrder) return successResponse(res, "Order already processed", { orderId: existingOrder._id });

  if (session.metadata?.couponCode) {
    const coupon = await Coupon.findOne({ code: session.metadata.couponCode.toUpperCase(), isActive: true });
    if (coupon && coupon.maxUses <= 1) {
      coupon.isActive = false;
      await coupon.save();
    }
  }

  const products = JSON.parse(session.metadata.products || "[]");
  const newOrder = await Order.create({
    user: session.metadata.userId,
    products: products.map((p) => ({ product: p.id, quantity: p.qty, price: Math.round(p.price * 100) })),
    totalAmount: session.amount_total,
    stripeSessionId: sessionId,
    status: "paid",
  });

  return successResponse(res, "Payment successful, order created", { orderId: newOrder._id });
});
