const DEFAULT_API_BASE_URL = "/api";

export const resolveApiBaseUrl = (configuredUrl?: string): string => {
  const baseUrl = configuredUrl?.trim().replace(/\/+$/, "");

  if (!baseUrl || baseUrl === "/") {
    return DEFAULT_API_BASE_URL;
  }

  if (baseUrl === "/api" || baseUrl.endsWith("/api")) {
    return baseUrl;
  }

  return `${baseUrl}/api`;
};

export const apiBaseUrl = resolveApiBaseUrl(import.meta.env.VITE_API_URL);
