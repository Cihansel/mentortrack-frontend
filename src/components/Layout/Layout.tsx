import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";

export default function Layout() {
  const [open, setOpen] = useState(true);       // desktop collapse
  const [mobileOpen, setMobileOpen] = useState(false); // mobile drawer
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ✅ Mobil drawer açıkken scroll kilidi
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden">
      {/* ✅ Mobile hamburger */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 rounded-lg bg-black/60 text-white px-3 py-2"
        aria-label="Menüyü aç"
      >
        ☰
      </button>

      {/* ✅ Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar (fixed) */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          transform transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <Sidebar
          open={open}
          setOpen={setOpen}
          onLogout={handleLogout}
          onNavigate={() => setMobileOpen(false)}
        />
      </aside>

      {/* Main */}
      <main
        className={`
          min-h-screen transition-[padding-left] duration-300
          p-4 md:p-6
          pl-0
          ${open ? "md:pl-64" : "md:pl-20"}
        `}
      >
        <Outlet />
      </main>
    </div>
  );
}