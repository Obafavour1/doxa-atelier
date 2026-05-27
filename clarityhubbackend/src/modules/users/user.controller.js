import crypto from "crypto";
import { asyncHandler } from "../../shared/utils/asyncHandler.util.js";
import { successResponse } from "../../shared/utils/response.util.js";
import { ErrorHandler } from "../../shared/middleware/error.middleware.js";
import User from "../../database/models/user.model.js";
import Order from "../../database/models/order.model.js";
import AuditLog from "../../database/models/auditLog.model.js";
import { redis } from "../../database/redis.config.js";
import cloudinary from "../../config/cloudinary.config.js";
import * as userService from "./user.service.js";

// --- Admin: Customer Management ---

export const getAllCustomers = asyncHandler(async (req, res) => {
  const { status, search, role, segment } = req.query;
  let query = { role: role || "customer" };

  if (status) query.status = status;
  if (search) {
    query.$or = [{ firstName: { $regex: search, $options: "i" } }, { lastName: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }];
  }

  if (segment === "new") {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    query.createdAt = { $gte: thirtyDaysAgo };
  } else if (segment === "repeat") {
    query._id = { $in: await userService.getRepeatCustomerIds() };
  } else if (segment === "high-value") {
    query._id = { $in: await userService.getHighValueCustomerIds() };
  }

  const customers = await User.find(query).sort("-createdAt");
  return successResponse(res, "Customers fetched", { customers, count: customers.length });
});

export const getCustomerDetails = asyncHandler(async (req, res) => {
  const customer = await User.findById(req.params.id);
  if (!customer) throw new ErrorHandler("Customer not found", 404);

  const orders = await Order.find({ user: customer._id }).sort("-createdAt");
  const ltv = userService.calculateLTV(orders);

  return successResponse(res, "Customer details fetched", {
    profile: customer,
    orderHistory: orders,
    stats: { totalOrders: orders.length, totalSpent: ltv / 100 },
  });
});

export const updateCustomerStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const customer = await User.findById(req.params.id);
  if (!customer) throw new ErrorHandler("Customer not found", 404);

  customer.status = status;
  await customer.save();

  await AuditLog.create({ user: req.user._id, action: `Changed customer status (${customer.email}) to ${status}`, module: "Customers", ipAddress: req.ip });

  return successResponse(res, `Customer status updated to ${status}`, { customer });
});

// --- Admin: Profile & Sessions ---

export const getAdminProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("+twoFactorEnabled +apiKeys");
  if (!user) throw new ErrorHandler("Admin not found", 404);
  return successResponse(res, "Admin profile overview", { user });
});

export const updateAdminProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone, preferredLanguage, theme, avatar } = req.body;
  const user = await User.findById(req.user._id);

  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (phone) user.phone = phone;
  if (preferredLanguage) user.preferredLanguage = preferredLanguage;
  if (theme) user.theme = theme;

  if (avatar && avatar.startsWith("data:image")) {
    const uploadResult = await cloudinary.uploader.upload(avatar, { folder: "admin_avatars" });
    user.avatar = uploadResult.secure_url;
  } else if (avatar) {
    user.avatar = avatar;
  }

  await user.save();
  await AuditLog.create({ user: user._id, action: "Updated profile information", module: "Profile", ipAddress: req.ip, deviceInfo: req.headers["user-agent"] });

  return successResponse(res, "Profile updated successfully", { user });
});

export const getAuditLogs = asyncHandler(async (req, res) => {
  const logs = await AuditLog.find({ user: req.user._id }).sort("-createdAt").limit(10);
  return successResponse(res, "Audit logs fetched", { logs });
});

export const updateNotificationPreferences = asyncHandler(async (req, res) => {
  const { emailNotifications, orderAlerts, refundAlerts, weeklySummary } = req.body;
  const user = await User.findById(req.user._id);

  if (emailNotifications !== undefined) user.notificationPreferences.emailNotifications = emailNotifications;
  if (orderAlerts !== undefined) user.notificationPreferences.orderAlerts = orderAlerts;
  if (refundAlerts !== undefined) user.notificationPreferences.refundAlerts = refundAlerts;
  if (weeklySummary !== undefined) user.notificationPreferences.weeklySummary = weeklySummary;

  await user.save();
  return successResponse(res, "Notification preferences updated", { preferences: user.notificationPreferences });
});

export const generateApiKey = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) throw new ErrorHandler("API Key name is required", 400);

  const user = await User.findById(req.user._id).select("+apiKeys");
  const apiKey = crypto.randomBytes(32).toString("hex");

  user.apiKeys.push({ key: apiKey, name });
  await user.save();

  await AuditLog.create({ user: user._id, action: `Generated API key: ${name}`, module: "API Keys", ipAddress: req.ip, deviceInfo: req.headers["user-agent"] });

  return successResponse(res, "API Key generated", { key: apiKey, name }, 201);
});

export const revokeApiKey = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("+apiKeys");
  user.apiKeys = user.apiKeys.filter((ak) => ak._id.toString() !== req.params.id);
  await user.save();
  return successResponse(res, "API Key revoked");
});

export const toggleTwoFactor = asyncHandler(async (req, res) => {
  const { enable } = req.body;
  const user = await User.findById(req.user._id);

  user.twoFactorEnabled = enable;
  if (enable) {
    user.recoveryCodes = Array.from({ length: 5 }, () => crypto.randomBytes(4).toString("hex").toUpperCase());
  } else {
    user.twoFactorSecret = undefined;
    user.recoveryCodes = undefined;
  }

  await user.save();
  return successResponse(res, enable ? "2FA enabled" : "2FA disabled", { recoveryCodes: user.recoveryCodes });
});

export const getAdminSessions = asyncHandler(async (req, res) => {
  const sessionIds = await redis.smembers(`user_sessions:${req.user._id}`);
  const sessions = [];

  for (const sid of sessionIds) {
    const data = await redis.get(`session:${req.user._id}:${sid}`);
    if (data) {
      const parsed = JSON.parse(data);
      sessions.push({ sessionId: sid, userAgent: parsed.userAgent, createdAt: parsed.createdAt, isCurrent: sid === req.user.sessionId });
    } else {
      await redis.srem(`user_sessions:${req.user._id}`, sid);
    }
  }

  return successResponse(res, "Active sessions fetched", { sessions });
});

export const revokeSession = asyncHandler(async (req, res) => {
  const sessionId = req.params.id;
  await redis.del(`session:${req.user._id}:${sessionId}`);
  await redis.srem(`user_sessions:${req.user._id}`, sessionId);
  return successResponse(res, "Session revoked");
});
