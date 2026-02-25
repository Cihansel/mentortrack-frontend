import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";

export default function Layout() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();           // 🔐 token + role temizlenir
    navigate("/login"); // 🔁 login ekranı
  };

  return (
    <div className="flex">
      <Sidebar
        open={open}
        setOpen={setOpen}
        onLogout={handleLogout} // 🔥 EKLENDİ
      />

      <main
        className={`
          p-6 w-full min-h-screen bg-gray-100
          transition-all duration-300
          ${open ? "ml-64" : "ml-20"}
        `}
      >
        <Outlet />
      </main>
    </div>
  );
}
