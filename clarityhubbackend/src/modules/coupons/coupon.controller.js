import { asyncHandler } from "../../shared/utils/asyncHandler.util.js";
import { ErrorHandler } from "../../shared/middleware/error.middleware.js";
import { successResponse } from "../../shared/utils/response.util.js";
import Coupon from "../../database/models/coupon.model.js";
import * as couponService from "./coupon.service.js";

// --- Admin Controllers ---

export const createCoupon = asyncHandler(async (req, res) => {
  const { discountPercentage, expirationDate, maxUses } = req.body;
  const code = couponService.generateCouponCode(10);

  const coupon = await Coupon.create({ code, discountPercentage, expirationDate, isActive: true, maxUses });
  return successResponse(res, "Coupon created successfully", { coupon }, 201);
});

export const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({}).sort("-createdAt");
  return successResponse(res, "Coupons fetched", { coupons, count: coupons.length });
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) throw new ErrorHandler("Coupon not found", 404);
  return successResponse(res, "Coupon deleted successfully");
});

// --- User Controllers ---

export const getCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findOne({ isActive: true, expirationDate: { $gte: new Date() } });
  return successResponse(res, "Coupon fetched", { coupon: coupon || null });
});

export const validateCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const userId = req.user._id;

  const coupon = await Coupon.findOne({ code, isActive: true });
  if (!coupon) throw new ErrorHandler("Coupon not found or inactive", 404);

  if (coupon.expirationDate < new Date()) {
    coupon.isActive = false;
    await coupon.save();
    throw new ErrorHandler("Coupon has expired", 400);
  }

  const currentUsage = coupon.usageByUser.get(userId.toString()) || 0;
  if (currentUsage >= coupon.maxUses) throw new ErrorHandler("Coupon usage limit reached", 400);

  return successResponse(res, "Coupon is valid", {
    code: coupon.code,
    discountPercentage: coupon.discountPercentage,
    remainingUses: coupon.maxUses - currentUsage,
  });
});

export const applyCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const userId = req.user._id;

  const coupon = await Coupon.findOne({ code, isActive: true });
  if (!coupon) throw new ErrorHandler("Invalid coupon code", 404);

  if (new Date(coupon.expirationDate) < new Date()) throw new ErrorHandler("Coupon has expired", 400);

  const currentUsage = coupon.usageByUser.get(userId.toString()) || 0;
  if (currentUsage >= coupon.maxUses) throw new ErrorHandler("Coupon usage limit reached", 400);

  coupon.usageByUser.set(userId.toString(), currentUsage + 1);
  await coupon.save();

  return successResponse(res, "Coupon applied successfully", {
    discountPercentage: coupon.discountPercentage,
    remainingUses: coupon.maxUses - (currentUsage + 1),
  });
});
