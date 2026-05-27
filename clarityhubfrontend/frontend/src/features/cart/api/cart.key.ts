// src/features/cart/api/cart.key.ts
export const cartKeys = {
  all: ["cart"] as const,
  items: () => [...cartKeys.all, "items"] as const,
  coupon: () => [...cartKeys.all, "coupon"] as const,
};
