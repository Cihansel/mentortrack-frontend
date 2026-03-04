import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";

export default function Layout() {
  const [open, setOpen] = useState(true); // desktop collapse
  const [mobileOpen, setMobileOpen] = useState(false); // mobile drawer
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ✅ Drawer açıkken scroll kilitle (mobil UX)
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ✅ Mobile: hamburger */}
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

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50
          transform transition-transform duration-300
          md:static md:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <Sidebar
          open={open}
          setOpen={setOpen}
          onLogout={handleLogout}
          // ✅ Sidebar içinden menüye tıklayınca mobilde kapatabilmek için
          onNavigate={() => setMobileOpen(false)}
        />
      </div>

      {/* Main */}
      <main
        className={`
          p-4 md:p-6 w-full min-h-screen
          transition-all duration-300
          ml-0
          md:${open ? "ml-64" : "ml-20"}
        `}
      >
        <Outlet />
      </main>
    </div>
  );
}