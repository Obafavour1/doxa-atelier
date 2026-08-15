// src/features/cart/api/hooks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "./cart.api";
import { cartKeys } from "./cart.key";
import type {
  CartItem,
  Coupon,
  CreateCheckoutSessionPayload,
} from "./cart.types";
import { toast } from "react-hot-toast";
import axios from "axios";

export const useCart = () => {
  return useQuery<CartItem[]>({
    queryKey: cartKeys.items(),
    queryFn: () => cartApi.getCart().then((res) => res.data.data.cartItems),
    staleTime: 1000 * 60 * 5,
  });
};

export const useAddToCart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => cartApi.addToCart(productId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: cartKeys.items() });
    },
  });
};

export const useRemoveFromCart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => cartApi.removeFromCart(productId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: cartKeys.items() });
    },
  });
};

export const useUpdateCartQuantity = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => cartApi.updateQuantity(productId, quantity),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: cartKeys.items() });
    },
  });
};

export const useCoupon = () => {
  return useQuery<Coupon | null>({
    queryKey: cartKeys.coupon(),
    queryFn: () => cartApi.getCoupon().then((res) => res.data.data.coupon),
    staleTime: Infinity,
  });
};

export const useValidateCoupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => cartApi.validateCoupon(code),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: cartKeys.coupon() });
      toast.success("Coupon applied successfully");
    },
    onError: (err: unknown) => {
      const message = axios.isAxiosError(err) && typeof err.response?.data?.message === "string"
        ? err.response.data.message
        : "Failed to apply coupon";
      toast.error(message);
    },
  });
};

export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: (payload: CreateCheckoutSessionPayload) =>
      cartApi.createCheckoutSession(payload).then((res) => res.data.data),
  });
};

export const usePaystackQuote = (
  payload: CreateCheckoutSessionPayload,
  enabled: boolean,
) => {
  return useQuery({
    queryKey: ["paystack-quote", payload],
    queryFn: () => cartApi.getPaystackQuote(payload).then((res) => res.data.data),
    enabled,
    staleTime: 1000 * 60,
    retry: 1,
  });
};

export const useCheckoutSuccess = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payment: { provider: "stripe" | "paystack"; reference: string }) =>
      cartApi.checkoutSuccess(payment).then((res) => res.data.data),
    onSuccess: (result) => {
      if (!result.alreadyProcessed) {
        qc.setQueryData<CartItem[]>(cartKeys.items(), []);
      }
      qc.invalidateQueries({ queryKey: cartKeys.coupon() });
      qc.invalidateQueries({ queryKey: ["orders", "mine"] });
    },
  });
};

// Helper hook to calculate totals from cart data
export const useCartTotals = () => {
  const { data: cart = [] } = useCart();
  const { data: coupon = null } = useCoupon();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discount = coupon ? subtotal * (coupon.discountPercentage / 100) : 0;
  const total = subtotal - discount;

  return { subtotal, total, discount };
};
