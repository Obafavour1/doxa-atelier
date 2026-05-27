import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { authStore } from "../../store/auth.store";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = authStore((s) => s.accessToken);
  const hydrated = authStore((s) => s._hasHydrated);

  if (!hydrated) return null; // Or a loading spinner

  if (!token) return <Navigate to="/login-admin" replace />;

  return <>{children}</>;
};

interface RoleRouteProps {
  role: "DEV" | "SUPER_ADMIN";
  children: ReactNode;
}

export const RoleRoute = ({ role, children }: RoleRouteProps) => {
  const user = authStore((s) => s.user);
  const hydrated = authStore((s) => s._hasHydrated);

  if (!hydrated) return null;

  if (user?.role !== role) return <Navigate to="/" replace />;

  return <>{children}</>;
};
