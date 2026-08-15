import axiosInstance from "../api/client";
import type { Order } from "../types/api";

export const orderService = {
  getMyOrders: async (): Promise<Order[]> => {
    const response = await axiosInstance.get("/orders/my-orders");
    const orders = response.data?.data?.orders ?? response.data?.orders;
    return Array.isArray(orders) ? orders : [];
  },
  getAll: async (): Promise<Order[]> => {
    const response = await axiosInstance.get("/orders");
    const orders = response.data?.data?.orders ?? response.data?.orders;
    return Array.isArray(orders) ? orders : [];
  },
  getById: async (id: string): Promise<Order> => {
    const response = await axiosInstance.get(`/orders/${id}`);
    return response.data.data?.order || response.data.order || response.data.data || response.data;
  },
  updateStatus: async (id: string, status: string) => {
    const response = await axiosInstance.patch(`/orders/${id}/status`, { status });
    return response.data;
  },
  updateShipping: async (id: string, data: { trackingNumber?: string; carrier?: string }) => {
    const response = await axiosInstance.patch(`/orders/${id}/shipping`, data);
    return response.data;
  },
  processRefund: async (id: string, data: { amount: number; reason: string }) => {
    const response = await axiosInstance.post(`/orders/${id}/refund`, data);
    return response.data;
  },
  exportOrders: async () => {
    const response = await axiosInstance.get("/orders/export", { responseType: 'blob' });
    return response.data;
  },
};

export const paymentService = {
  createCheckoutSession: async (data: {
    products: Array<{ productId: string; quantity: number }>;
    couponCode?: string;
  }) => {
    const response = await axiosInstance.post("/payments/create-checkout-session", data);
    return response.data;
  },
  handleCheckoutSuccess: async (sessionId: string) => {
    const response = await axiosInstance.post("/payments/checkout-success", { sessionId });
    return response.data;
  },
};
