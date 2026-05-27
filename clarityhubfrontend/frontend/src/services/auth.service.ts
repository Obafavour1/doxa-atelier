import axiosInstance from "../api/client";
import type { User } from "../types/api";

export const authService = {
  signUp: async (data: any) => {
    const response = await axiosInstance.post("/auth/sign-up", data);
    return response.data;
  },
  signIn: async (data: any) => {
    const response = await axiosInstance.post("/auth/sign-in", data);
    return response.data;
  },
  verifyOtp: async (data: { email: string; otp: string }) => {
    const response = await axiosInstance.post("/auth/otp-verification", data);
    return response.data;
  },
  resendOtp: async (data: { email?: string; phone?: string; verificationMethod: "email" | "phone" }) => {
    const response = await axiosInstance.post("/auth/resend-otp", data);
    return response.data;
  },
  logout: async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  },
  getProfile: async (): Promise<User> => {
    const response = await axiosInstance.get("/auth/profile");
    return response.data.data || response.data;
  },
  updateProfile: async (data: Partial<User>) => {
    const response = await axiosInstance.put("/auth/profile", data);
    return response.data;
  },
  forgotPassword: async (email: string) => {
    const response = await axiosInstance.post("/auth/password/forgot", { email });
    return response.data;
  },
  resendResetEmail: async (token: string) => {
    const response = await axiosInstance.post(`/auth/password/resend-reset/${token}`);
    return response.data;
  },
  resetPassword: async (token: string, data: any) => {
    const response = await axiosInstance.put(`/auth/password/reset/${token}`, data);
    return response.data;
  },
  updatePassword: async (data: any) => {
    const response = await axiosInstance.put("/auth/password/update", data);
    return response.data;
  },
};
