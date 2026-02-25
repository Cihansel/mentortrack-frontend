import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

export default function RequireAdmin({ children }: { children: ReactNode }) {
  const { token, role, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
