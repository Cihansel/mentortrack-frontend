// src/components/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type UserRole = "ADMIN" | "STUDENT" | "PARENT";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { token, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Yükleniyor...
      </div>
    );
  }

  // Token yok → login
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Rol uyumsuzluğu kontrolü
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    switch (role) {
      case "STUDENT":
        return <Navigate to="/student" replace />;
      case "PARENT":
        return <Navigate to="/parent" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  // Erişim başarı → sayfayı aç
  return <Outlet />;
};

export default ProtectedRoute;
