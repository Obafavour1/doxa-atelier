import { asyncHandler } from "../../shared/utils/asyncHandler.util.js";
import { ErrorHandler } from "../../shared/middleware/error.middleware.js";
import { successResponse } from "../../shared/utils/response.util.js";
import Order from "../../database/models/order.model.js";
import * as orderService from "./order.service.js";

// --- Admin Controllers ---

export const getAllOrdersAdmin = asyncHandler(async (req, res) => {
  const { status, startDate, endDate, search } = req.query;
  const query = {};

  if (status) query.status = status;
  if (startDate && endDate) {
    query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }
  if (search) {
    query.stripeSessionId = { $regex: search, $options: "i" };
  }

  const orders = await Order.find(query)
    .populate("user", "firstName lastName email")
    .populate("products.product", "name image price")
    .sort("-createdAt");

  return successResponse(res, "Orders fetched", { orders, count: orders.length });
});

export const getOrderDetails = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "firstName lastName email phone avatar joinedAt lastLogin")
    .populate("products.product");

  if (!order) throw new ErrorHandler("Order not found", 404);
  return successResponse(res, "Order details fetched", { order });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, message } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) throw new ErrorHandler("Order not found", 404);

  order.status = status;
  if (message) order.timeline.push({ status, message });

  await order.save();
  return successResponse(res, `Order status updated to ${status}`, { order });
});

export const updateShippingInfo = asyncHandler(async (req, res) => {
  const { trackingNumber, carrier } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) throw new ErrorHandler("Order not found", 404);

  order.shippingDetails.trackingNumber = trackingNumber;
  order.shippingDetails.carrier = carrier;

  if (order.status === "processing" || order.status === "pending") {
    order.status = "shipped";
  }

  order.timeline.push({
    status: order.status,
    message: `Added tracking number: ${trackingNumber} (${carrier})`,
  });

  await order.save();
  return successResponse(res, "Shipping information updated", { order });
});

export const processRefund = asyncHandler(async (req, res) => {
  const { amount, reason, type } = req.body; // type: partial, full
  const order = await Order.findById(req.params.id);
  if (!order) throw new ErrorHandler("Order not found", 404);

  const refundAmount = type === "full" ? order.totalAmount : amount;

  order.refundDetails = {
    status: type,
    amount: refundAmount,
    reason,
    processedAt: new Date(),
  };

  order.paymentStatus = "refunded";
  order.status = "cancelled";
  order.timeline.push({
    status: "refunded",
    message: `Refund processed for ${refundAmount / 100}. Reason: ${reason}`,
  });

  await order.save();
  return successResponse(res, "Refund processed successfully", { order });
});

export const exportOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "firstName lastName email").sort("-createdAt");
  const csv = orderService.generateOrdersCSV(orders);

  res.setHeader("Content-Type", "text/csv");
  res.attachment("orders.csv");
  return res.status(200).send(csv);
});

// --- User Controllers ---

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate("products.product", "name image price");
  return successResponse(res, "My orders fetched", { orders, count: orders.length });
});
