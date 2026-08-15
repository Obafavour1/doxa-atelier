// src/features/auth/api/auth.types.ts
export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  verificationMethod: "email" | "phone";
  role?: "customer" | "admin" | "manager" | "support";
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthSessionResponse {
  accessToken?: string;
  token?: string;
  user?: UserProfile;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface OTPVerificationData {
  email: string;
  otp: string;
}

export interface ResendOTPData {
  email: string;
  verificationMethod: "email" | "phone";
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  password: string;
  confirmPassword: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  role: string;
}
