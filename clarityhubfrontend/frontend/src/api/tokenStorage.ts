const ACCESS_TOKEN_KEY = "claritystore_access_token";
const USER_KEY = "claritystore_user";

export const getStoredToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const setStoredToken = (token: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const removeStoredToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const getStoredUser = <T = unknown>() => {
  const value = localStorage.getItem(USER_KEY);
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

export const setStoredUser = (user: unknown) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearStoredAuth = () => {
  removeStoredToken();
  localStorage.removeItem(USER_KEY);
};
