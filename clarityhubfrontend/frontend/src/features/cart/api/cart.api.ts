// src/features/cart/api/cart.api.ts
// import axiosInstance from "../../../shared/lib/apiClient";
import axiosInstance from "../../../api/client";
import type {
  CartItem,
  CheckoutSessionResponse,
  Coupon,
  CreateCheckoutSessionPayload,
} from "./cart.types";

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const cartApi = {
  getCart: () => axiosInstance.get<ApiEnvelope<{ cartItems: CartItem[] }>>("/cart"),
  addToCart: (productId: string) => axiosInstance.post("/cart", { productId }),
  removeFromCart: (productId: string) =>
    axiosInstance.delete("/cart", { data: { productId } }),
  updateQuantity: (productId: string, quantity: number) =>
    axiosInstance.put(`/cart/${productId}`, { quantity }),
  getCoupon: () => axiosInstance.get<ApiEnvelope<{ coupon: Coupon | null }>>("/coupons"),
  validateCoupon: (code: string) =>
    axiosInstance.post<ApiEnvelope<Coupon>>("/coupons/validate", { code }),
  createCheckoutSession: (payload: CreateCheckoutSessionPayload) =>
    axiosInstance.post<ApiEnvelope<CheckoutSessionResponse>>(
      "/payments/create-checkout-session",
      payload,
    ),
  checkoutSuccess: (sessionId: string) =>
    axiosInstance.post("/payments/checkout-success", { sessionId }),
};
