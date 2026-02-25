import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
  children: React.ReactNode;
}

export default function RequireStudent({ children }: Props) {
  const { token, role } = useAuth();
  const location = useLocation();

  if (!token) {
    // Login yoksa → login'e
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role !== "STUDENT") {
    // Token var ama role öğrenci değilse
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
