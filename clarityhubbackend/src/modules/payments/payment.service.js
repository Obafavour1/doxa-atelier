import { stripe } from "../../config/stripe.config.js";
import Coupon from "../../database/models/coupon.model.js";

export const createStripeCoupon = async (discountPercentage) => {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });
  return coupon.id;
};

export const createNewRewardCoupon = async (userId) => {
  const code = "REWARD" + Math.random().toString(36).substring(2, 8).toUpperCase();
  const newCoupon = await Coupon.create({
    user: userId,
    code,
    discountPercentage: 15,
    isActive: true,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    maxUses: 1,
  });
  return newCoupon;
};
