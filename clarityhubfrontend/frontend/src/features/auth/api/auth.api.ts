import axiosInstance from "../../../api/client";
import type {
  ApiEnvelope,
  AuthSessionResponse,
  ForgotPasswordData,
  OTPVerificationData,
  ResendOTPData,
  ResetPasswordData,
  SignInData,
  SignUpData,
  UpdatePasswordData,
  UpdateProfileData,
  UserProfile,
} from "./auth.types";

type AuthPayload = { user: UserProfile; accessToken?: string; token?: string };
type MessagePayload = { message?: string };

export const authApi = {
  signUp: (data: SignUpData) =>
    axiosInstance.post<ApiEnvelope<AuthPayload>>("/auth/sign-up", data),

  signIn: (data: SignInData) =>
    axiosInstance.post<ApiEnvelope<AuthPayload>>("/auth/sign-in", data),

  verifyOTP: (data: OTPVerificationData) =>
    axiosInstance.post<ApiEnvelope<AuthPayload>>("/auth/otp-verification", data),

  resendOTP: (data: ResendOTPData) =>
    axiosInstance.post<ApiEnvelope<MessagePayload>>("/auth/resend-otp", data),

  logout: () => axiosInstance.post<ApiEnvelope<MessagePayload>>("/auth/logout"),

  refreshToken: () =>
    axiosInstance.post<ApiEnvelope<AuthSessionResponse>>("/auth/refresh-token"),

  forgotPassword: (data: ForgotPasswordData) =>
    axiosInstance.post<ApiEnvelope<MessagePayload>>("/auth/password/forgot", data),

  resetPassword: (token: string, data: ResetPasswordData) =>
    axiosInstance.put<ApiEnvelope<MessagePayload>>(`/auth/password/reset/${token}`, data),

  getProfile: () =>
    axiosInstance.get<ApiEnvelope<{ user: UserProfile }>>("/auth/profile"),

  updateProfile: (data: UpdateProfileData) =>
    axiosInstance.put<ApiEnvelope<{ user: UserProfile }>>("/auth/profile", data),

  updatePassword: (data: UpdatePasswordData) =>
    axiosInstance.put<ApiEnvelope<MessagePayload>>("/auth/password/update", data),
};
