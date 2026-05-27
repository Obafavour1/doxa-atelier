import axiosInstance from "../api/client";
import type { Cart, CartItem } from "../types/api";

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const response = await axiosInstance.get("/cart");
    return response.data.data || response.data;
  },
  addItem: async (data: { productId: string; quantity: number; color?: string; size?: string }) => {
    const response = await axiosInstance.post("/cart", data);
    return response.data;
  },
  updateQuantity: async (id: string, quantity: number) => {
    const response = await axiosInstance.put(`/cart/${id}`, { quantity });
    return response.data;
  },
  clearCart: async () => {
    const response = await axiosInstance.delete("/cart");
    return response.data;
  },
};
