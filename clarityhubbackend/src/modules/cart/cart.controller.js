import { asyncHandler } from "../../shared/utils/asyncHandler.util.js";
import { successResponse } from "../../shared/utils/response.util.js";
import { ErrorHandler } from "../../shared/middleware/error.middleware.js";
import User from "../../database/models/user.model.js";
import * as cartService from "./cart.service.js";

export const getCartProducts = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("cartItems.productId");
  return successResponse(res, "Cart products fetched", { cartItems: cartService.formatCartResponse(user) });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  if (!productId) throw new ErrorHandler("Product ID is required", 400);

  const user = await User.findById(req.user._id);
  const existingItem = user.cartItems.find((item) => item.productId && item.productId.toString() === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    user.cartItems.push({ productId, quantity: 1 });
  }

  await user.save();
  await user.populate("cartItems.productId");
  return successResponse(res, "Product added to cart", { cartItems: cartService.formatCartResponse(user) });
});

export const removeAllFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user._id);

  if (!productId) {
    user.cartItems = [];
  } else {
    user.cartItems = user.cartItems.filter((item) => item.productId && item.productId.toString() !== productId);
  }

  await user.save();
  await user.populate("cartItems.productId");
  return successResponse(res, "Product(s) removed from cart", { cartItems: cartService.formatCartResponse(user) });
});

export const updateQuantity = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;
  const { quantity } = req.body;

  const user = await User.findById(req.user._id);
  const existingItem = user.cartItems.find((item) => item.productId && item.productId.toString() === productId);

  if (!existingItem) throw new ErrorHandler("Product not found in cart", 404);

  if (quantity === 0) {
    user.cartItems = user.cartItems.filter((item) => item.productId && item.productId.toString() !== productId);
  } else {
    existingItem.quantity = quantity;
  }

  await user.save();
  await user.populate("cartItems.productId");
  return successResponse(res, "Cart quantity updated", { cartItems: cartService.formatCartResponse(user) });
});
