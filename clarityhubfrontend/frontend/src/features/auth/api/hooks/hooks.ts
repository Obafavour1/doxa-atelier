import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../auth.api";
import { authKeys } from "../auth.key";
import type {
  ForgotPasswordData,
  OTPVerificationData,
  ResendOTPData,
  ResetPasswordData,
  SignInData,
  SignUpData,
  UpdatePasswordData,
  UpdateProfileData,
  UserProfile,
} from "../auth.types";
import {
  clearStoredAuth,
  getStoredToken,
  setStoredToken,
  setStoredUser,
} from "../../../../api/tokenStorage";

type AuthSuccessPayload = {
  user?: UserProfile;
  accessToken?: string;
  token?: string;
};

const extractPayload = (response: { data: { data?: AuthSuccessPayload } }) =>
  response.data?.data || {};

const extractAccessToken = (payload: AuthSuccessPayload): string | null =>
  payload.accessToken ?? payload.token ?? null;

const applySessionPayload = (payload: AuthSuccessPayload) => {
  const token = extractAccessToken(payload);
  if (token) {
    setStoredToken(token);
  }

  if (payload.user) {
    setStoredUser(payload.user);
  }
};

export const useSignUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignUpData) => authApi.signUp(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
};

export const useSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignInData) => authApi.signIn(data),
    onSuccess: async (response) => {
      applySessionPayload(extractPayload(response));
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      await queryClient.invalidateQueries({ queryKey: authKeys.me() });
    },
  });
};

export const useVerifyOTP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OTPVerificationData) => authApi.verifyOTP(data),
    onSuccess: async (response) => {
      applySessionPayload(extractPayload(response));
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      await queryClient.invalidateQueries({ queryKey: authKeys.me() });
    },
  });
};

export const useResendOTP = () => {
  return useMutation({
    mutationFn: (data: ResendOTPData) => authApi.resendOTP(data),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearStoredAuth();
      queryClient.setQueryData(authKeys.me(), null);
      queryClient.clear();
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordData) => authApi.forgotPassword(data),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, data }: { token: string; data: ResetPasswordData }) =>
      authApi.resetPassword(token, data),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileData) => authApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      queryClient.invalidateQueries({ queryKey: authKeys.me() });
    },
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: (data: UpdatePasswordData) => authApi.updatePassword(data),
  });
};

export const useProfile = () => {
  return useQuery<UserProfile>({
    queryKey: authKeys.profile(),
    queryFn: () => authApi.getProfile().then((res) => res.data.data.user),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

export const useMe = () => {
  return useQuery<UserProfile | null>({
    queryKey: authKeys.me(),
    queryFn: async () => {
      if (!getStoredToken()) return null;

      try {
        const response = await authApi.getProfile();
        return response.data.data.user;
      } catch {
        clearStoredAuth();
        return null;
      }
    },
    staleTime: Infinity,
    retry: false,
  });
};
