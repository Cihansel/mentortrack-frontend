import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireParent({ children }: { children: React.ReactNode }) {
  const { token, role } = useAuth();
  const location = useLocation();

  if (!token) return <Navigate to="/login" state={{ from: location }} replace />;
  if (role !== "PARENT") return <Navigate to="/login" replace />;

  return <>{children}</>;
}