// src/features/cart/api/cart.types.ts
export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description: string;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
}

export interface CheckoutLineItem {
  productId: string;
  quantity: number;
}

export interface CreateCheckoutSessionPayload {
  products: CheckoutLineItem[];
  couponCode?: string | null;
}

export interface CheckoutSessionResponse {
  id: string;
}

export interface CartResponse {
  cart: CartItem[];
  subtotal: number;
  total: number;
}
