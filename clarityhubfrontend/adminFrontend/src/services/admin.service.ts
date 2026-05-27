import axiosInstance from "../api/client";
import type { Coupon, AnalyticsData, User, StoreSettings, ShippingZone } from "../types/api";

export const couponService = {
  getAvailable: async (): Promise<Coupon[]> => {
    const response = await axiosInstance.get("/coupons");
    return response.data.data || response.data;
  },
  validate: async (code: string) => {
    const response = await axiosInstance.post("/coupons/validate", { code });
    return response.data;
  },
  apply: async (code: string) => {
    const response = await axiosInstance.post("/coupons/apply", { code });
    return response.data;
  },
  adminGetAll: async (): Promise<Coupon[]> => {
    const response = await axiosInstance.get("/coupons/admin");
    return response.data.data?.coupons || response.data.coupons || response.data.data || response.data || [];
  },
  adminCreate: async (data: any) => {
    const response = await axiosInstance.post("/coupons/admin", data);
    return response.data;
  },
  adminDelete: async (id: string) => {
    const response = await axiosInstance.delete(`/coupons/admin/${id}`);
    return response.data;
  },
};

export const adminService = {
  getAnalytics: async (range: string = '7d'): Promise<AnalyticsData> => {
    const response = await axiosInstance.get("/analytics", { params: { range } });
    return response.data.data || response.data;
  },
  getStoreSettings: async (): Promise<StoreSettings> => {
    const response = await axiosInstance.get("/settings/store");
    return response.data.data || response.data;
  },
  updateStoreSettings: async (data: StoreSettings) => {
    const response = await axiosInstance.put("/settings/store", data);
    return response.data;
  },
  getShippingZones: async (): Promise<ShippingZone[]> => {
    const response = await axiosInstance.get("/settings/shipping");
    return response.data.data?.shippingZones || response.data.data?.zones || response.data.shippingZones || response.data.zones || response.data.data || response.data || [];
  },
  createShippingZone: async (data: { name: string; regions: string[] }) => {
    const response = await axiosInstance.post("/settings/shipping", data);
    return response.data;
  },
  updateShippingZone: async (id: string, data: { name: string }) => {
    const response = await axiosInstance.put(`/settings/shipping/${id}`, data);
    return response.data;
  },
  deleteShippingZone: async (id: string) => {
    const response = await axiosInstance.delete(`/settings/shipping/${id}`);
    return response.data;
  },
  getCustomers: async (): Promise<User[]> => {
    const response = await axiosInstance.get("/users/customers");
    return response.data.data?.users || response.data.data?.customers || response.data.users || response.data.data || response.data || [];
  },
  getCustomerDetails: async (id: string): Promise<User> => {
    const response = await axiosInstance.get(`/users/customers/${id}`);
    return response.data.data || response.data;
  },
  updateCustomerStatus: async (id: string, status: 'active' | 'blocked') => {
    const response = await axiosInstance.patch(`/users/customers/${id}/status`, { status });
    return response.data;
  },
  getProfileOverview: async () => {
    const response = await axiosInstance.get("/users/profile/overview");
    return response.data.data?.user || response.data.user || response.data.data || response.data;
  },
  updateAdminProfile: async (data: any) => {
    const response = await axiosInstance.put("/users/profile/update", data);
    return response.data;
  },
  getAuditLogs: async () => {
    const response = await axiosInstance.get("/users/profile/audit-logs");
    return response.data.data?.logs || response.data.logs || response.data.data || response.data || [];
  },
  updateNotifications: async (data: any) => {
    const response = await axiosInstance.put("/users/profile/notifications", data);
    return response.data;
  },
  toggleTwoFactor: async (enable: boolean) => {
    const response = await axiosInstance.put("/users/profile/2fa", { enable });
    return response.data;
  },
  createApiKey: async (name: string) => {
    const response = await axiosInstance.post("/users/profile/api-keys", { name });
    return response.data;
  },
  revokeApiKey: async (id: string) => {
    const response = await axiosInstance.delete(`/users/profile/api-keys/${id}`);
    return response.data;
  },
  getSessions: async () => {
    const response = await axiosInstance.get("/users/profile/sessions");
    return response.data.data?.sessions || response.data.sessions || response.data.data || response.data || [];
  },
  revokeSession: async (id: string) => {
    const response = await axiosInstance.delete(`/users/profile/sessions/${id}`);
    return response.data;
  },
};
