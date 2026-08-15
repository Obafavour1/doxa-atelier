import { asyncHandler } from "../../shared/utils/asyncHandler.util.js";
import { successResponse } from "../../shared/utils/response.util.js";
import { ErrorHandler } from "../../shared/middleware/error.middleware.js";
import { stripe } from "../../config/stripe.config.js";
import { paystack } from "../../config/paystack.config.js";
import { env } from "../../config/env.config.js";
import Coupon from "../../database/models/coupon.model.js";
import Order from "../../database/models/order.model.js";
import Product from "../../database/models/product.model.js";
import * as paymentService from "./payment.service.js";

const resolveCheckoutProducts = async (products) => {
  const requestedProducts = products.map((product) => ({
    id: (product._id || product.productId)?.toString(),
    qty: Number(product.quantity) || 1,
  }));
  if (requestedProducts.some((product) => !product.id || !Number.isInteger(product.qty) || product.qty < 1)) {
    throw new ErrorHandler("Invalid product data", 400);
  }

  const databaseProducts = await Product.find({ _id: { $in: requestedProducts.map((product) => product.id) } });
  const productsById = new Map(databaseProducts.map((product) => [product._id.toString(), product]));
  return requestedProducts.map((requestedProduct) => {
    const product = productsById.get(requestedProduct.id);
    if (!product || product.status !== "active" || product.stock < requestedProduct.qty) {
      throw new ErrorHandler("A product is unavailable or has insufficient stock", 400);
    }
    return {
      id: requestedProduct.id,
      qty: requestedProduct.qty,
      price: product.price,
      name: product.name,
      image: product.image,
    };
  });
};

const resolveCouponDiscount = async (couponCode, userId) => {
  if (!couponCode) return 0;

  const coupon = await Coupon.findOne({
    code: couponCode.toUpperCase(),
    isActive: true,
    $or: [{ user: userId }, { user: null }],
  });

  if (!coupon || new Date(coupon.expirationDate) < new Date()) return 0;
  return coupon.discountPercentage;
};

const createPaystackQuote = async ({ products, couponCode, userId }) => {
  if (!Array.isArray(products) || products.length === 0) {
    throw new ErrorHandler("Invalid or empty products array", 400);
  }

  const exchangeRate = env.PAYSTACK.NGN_PER_USD;
  if (!Number.isFinite(exchangeRate) || exchangeRate <= 0) {
    throw new ErrorHandler("Paystack exchange rate is not configured", 503);
  }

  const normalizedProducts = await resolveCheckoutProducts(products);
  const discountPercentage = await resolveCouponDiscount(couponCode, userId);
  const subtotal = normalizedProducts.reduce((sum, product) => sum + product.price * product.qty, 0);
  const baseAmountCents = Math.round(subtotal * (1 - discountPercentage / 100) * 100);
  const paystackAmountKobo = Math.round((baseAmountCents / 100) * exchangeRate * 100);

  if (baseAmountCents <= 0 || paystackAmountKobo <= 0) {
    throw new ErrorHandler("Payment amount must be greater than zero", 400);
  }

  return {
    normalizedProducts,
    discountPercentage,
    subtotal,
    baseAmountCents,
    paystackAmountKobo,
    exchangeRate,
  };
};

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const { products, couponCode } = req.body;
  if (!Array.isArray(products) || products.length === 0) throw new ErrorHandler("Invalid or empty products array", 400);

  const normalizedProducts = await resolveCheckoutProducts(products);
  const lineItems = normalizedProducts.map((product) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: product.name,
        images: product.image?.startsWith("http") ? [product.image] : [],
      },
      unit_amount: Math.round(product.price * 100),
    },
    quantity: product.qty,
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
      products: JSON.stringify(normalizedProducts.map((product) => ({ id: product.id, qty: product.qty, price: product.price }))),
    },
  });

  const totalAmount = normalizedProducts.reduce((sum, product) => sum + product.price * product.qty, 0);
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
    paymentMethod: "stripe",
    paymentStatus: "paid",
    status: "processing",
  });

  return successResponse(res, "Payment successful, order created", { orderId: newOrder._id });
});

export const getPaystackQuote = asyncHandler(async (req, res) => {
  const quote = await createPaystackQuote({
    products: req.body.products,
    couponCode: req.body.couponCode,
    userId: req.user._id,
  });

  return successResponse(res, "Paystack NGN quote created", {
    baseAmount: quote.baseAmountCents / 100,
    baseCurrency: "USD",
    convertedAmount: quote.paystackAmountKobo / 100,
    currency: "NGN",
    exchangeRate: quote.exchangeRate,
  });
});

export const initializePaystackTransaction = asyncHandler(async (req, res) => {
  const { products, couponCode } = req.body;
  if (!env.PAYSTACK.SECRET_KEY) {
    throw new ErrorHandler("Paystack is not configured", 503);
  }
  if (env.PAYSTACK.CURRENCY !== "NGN") {
    throw new ErrorHandler("Paystack currency must be configured as NGN", 503);
  }

  const quote = await createPaystackQuote({ products, couponCode, userId: req.user._id });

  const response = await paystack.post("/transaction/initialize", {
    email: req.user.email,
    amount: quote.paystackAmountKobo,
    currency: "NGN",
    callback_url: `${env.CLIENT_URL}/purchase-success?provider=paystack`,
    metadata: {
      userId: req.user._id.toString(),
      couponCode: couponCode || "",
      discountPercentage: quote.discountPercentage,
      products: quote.normalizedProducts,
      baseCurrency: "USD",
      baseAmountCents: quote.baseAmountCents,
      settlementCurrency: "NGN",
      exchangeRate: quote.exchangeRate,
    },
  });

  return successResponse(res, "Paystack transaction initialized", {
    authorizationUrl: response.data.data.authorization_url,
    reference: response.data.data.reference,
    baseAmount: quote.baseAmountCents / 100,
    baseCurrency: "USD",
    convertedAmount: quote.paystackAmountKobo / 100,
    currency: "NGN",
    exchangeRate: quote.exchangeRate,
  });
});

export const verifyPaystackTransaction = asyncHandler(async (req, res) => {
  const { reference } = req.body;
  if (!reference) throw new ErrorHandler("Paystack reference is required", 400);
  if (!env.PAYSTACK.SECRET_KEY) throw new ErrorHandler("Paystack is not configured", 503);

  const response = await paystack.get(`/transaction/verify/${encodeURIComponent(reference)}`);
  const transaction = response.data.data;
  if (transaction.status !== "success") throw new ErrorHandler("Payment not completed", 400);
  if (transaction.currency !== "NGN") throw new ErrorHandler("Payment currency mismatch", 400);

  const metadata = typeof transaction.metadata === "string"
    ? JSON.parse(transaction.metadata || "{}")
    : transaction.metadata || {};
  if (metadata.userId !== req.user._id.toString()) throw new ErrorHandler("Payment does not belong to this user", 403);

  const existingOrder = await Order.findOne({ paystackReference: reference, user: req.user._id });
  if (existingOrder) {
    return successResponse(res, "Order already processed", {
      orderId: existingOrder._id,
      alreadyProcessed: true,
    });
  }

  const products = Array.isArray(metadata.products) ? metadata.products : [];
  const expectedSubtotal = products.reduce((sum, product) => sum + Number(product.price) * Number(product.qty), 0);
  const discountPercentage = Number(metadata.discountPercentage) || 0;
  const baseAmountCents = Number(metadata.baseAmountCents);
  const exchangeRate = Number(metadata.exchangeRate);
  let coupon = null;
  if (metadata.couponCode) {
    coupon = await Coupon.findOne({ code: metadata.couponCode.toUpperCase(), isActive: true });
  }
  const recalculatedBaseAmountCents = Math.round(expectedSubtotal * (1 - discountPercentage / 100) * 100);
  const expectedAmount = Math.round((baseAmountCents / 100) * exchangeRate * 100);
  if (
    !products.length ||
    !Number.isFinite(baseAmountCents) ||
    !Number.isFinite(exchangeRate) ||
    baseAmountCents !== recalculatedBaseAmountCents ||
    transaction.amount !== expectedAmount
  ) {
    throw new ErrorHandler("Payment amount mismatch", 400);
  }

  let newOrder;
  try {
    newOrder = await Order.create({
      user: req.user._id,
      products: products.map((product) => ({
        product: product.id,
        quantity: product.qty,
        price: Math.round(product.price * 100),
      })),
      totalAmount: baseAmountCents,
      paymentAmount: transaction.amount,
      paymentCurrency: "NGN",
      exchangeRate,
      paystackReference: reference,
      paymentMethod: "paystack",
      paymentStatus: "paid",
      status: "processing",
    });
  } catch (error) {
    if (error?.code === 11000) {
      const racedOrder = await Order.findOne({ paystackReference: reference, user: req.user._id });
      if (racedOrder) {
        return successResponse(res, "Order already processed", {
          orderId: racedOrder._id,
          alreadyProcessed: true,
        });
      }
    }
    throw error;
  }

  if (coupon && coupon.maxUses <= 1) {
    coupon.isActive = false;
    await coupon.save();
  }

  if (expectedSubtotal >= 200) await paymentService.createNewRewardCoupon(req.user._id);
  return successResponse(res, "Payment successful, order created", { orderId: newOrder._id });
});
