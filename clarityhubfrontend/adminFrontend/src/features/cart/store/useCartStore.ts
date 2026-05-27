import { create } from "zustand";
import axiosInstance from "../../../shared/lib/apiClient";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description: string;
}

interface Coupon {
  code: string;
  discountPercentage: number;
}

interface CartStore {
  cart: CartItem[];
  coupon: Coupon | null;
  total: number;
  subtotal: number;
  isCouponApplied: boolean;
  loading: boolean;

  getMyCoupon: () => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;

  getCartItems: () => Promise<void>;
  clearCart: () => void;
  addToCart: (
    productId: string | undefined
  ) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;

  calculateTotals: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  isCouponApplied: false,
  loading: false,

  getMyCoupon: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get("/coupons");
      set({ coupon: response.data });
    } catch (error) {
      console.error("Error fetching coupon:", error);
    } finally {
      set({ loading: false });
    }
  },

  applyCoupon: async (code) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.post("/coupons/validate", { code });
      set({ coupon: response.data, isCouponApplied: true });
      get().calculateTotals();
      toast.success("Coupon applied successfully");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Failed to apply coupon");
    } finally {
      set({ loading: false });
    }
  },

  removeCoupon: () => {
    set({ coupon: null, isCouponApplied: false });
    get().calculateTotals();
    toast.success("Coupon removed");
  },

  getCartItems: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/cart");
      set({ cart: res.data });
      get().calculateTotals();
    } catch (err) {
      const error = err as AxiosError;
      console.error(error);
      set({ cart: [] });
      toast.error("An error occurred while fetching cart");
    } finally {
      set({ loading: false });
    }
  },

  clearCart: () => {
    set({ cart: [], coupon: null, total: 0, subtotal: 0 });
  },

  addToCart: async (productId) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/cart", { productId });
      if (res.data.success === "true") {
        toast.success("Successful, proceed with the Cart button above");
      }
      set({ cart: res.data, loading: false });
    } catch (error) {
      const err = error as AxiosError;
      console.error({
        error: err.response?.data || "Failed to add to cart",
      });
    } finally {
      set({ loading: false });
    }
  },

  removeFromCart: async (productId) => {
    try {
      await axiosInstance.delete(`/cart`, { data: { productId } });
      set((prevState) => ({
        cart: prevState.cart.filter((item) => item._id !== productId),
      }));
      get().calculateTotals();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Failed to remove item");
    }
  },

  updateQuantity: async (productId, quantity) => {
    if (quantity === 0) {
      await get().removeFromCart(productId);
      return;
    }

    try {
      await axiosInstance.put(`/cart/${productId}`, { quantity });
      set((prevState) => ({
        cart: prevState.cart.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        ),
      }));
      get().calculateTotals();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Failed to update quantity");
    }
  },

  calculateTotals: () => {
    const { cart, coupon } = get();
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    let total = subtotal;

    if (coupon) {
      const discount = subtotal * (coupon.discountPercentage / 100);
      total = subtotal - discount;
    }

    set({ subtotal, total });
  },
}));
