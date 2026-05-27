import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { clearStoredAuth, getStoredToken, setStoredToken } from "./tokenStorage";

const baseURL = import.meta.env.VITE_API_URL || "/api";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let isRefreshing = false;
let refreshSubscribers: Array<(token: string | null) => void> = [];

const notifySubscribers = (token: string | null) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;

    if (status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/auth/refresh-token")) {
      clearStoredAuth();
      return Promise.reject(error);
    }

    if (!getStoredToken()) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshSubscribers.push((token) => {
          if (!token) {
            reject(error);
            return;
          }

          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(axiosInstance(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshResponse = await axiosInstance.post("/auth/refresh-token");
      const refreshedToken =
        (refreshResponse.data as any)?.data?.accessToken ||
        (refreshResponse.data as any)?.accessToken ||
        null;

      if (refreshedToken) {
        setStoredToken(refreshedToken);
      } else {
        clearStoredAuth();
      }

      notifySubscribers(refreshedToken);

      if (refreshedToken) {
        originalRequest.headers.Authorization = `Bearer ${refreshedToken}`;
      }

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      clearStoredAuth();
      notifySubscribers(null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
