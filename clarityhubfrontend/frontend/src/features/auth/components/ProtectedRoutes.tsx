import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useMe } from "../api/hooks/hooks";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { data: user, isLoading } = useMe();

  if (isLoading) return <LoadingSpinner />;

  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

interface RoleRouteProps {
  role: string;
  children: ReactNode;
}

export const RoleRoute = ({ role, children }: RoleRouteProps) => {
  const { data: user, isLoading } = useMe();

  if (isLoading) return <LoadingSpinner />;

  if (!user || user.role !== role) return <Navigate to="/" replace />;

  return <>{children}</>;
};
