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
    <div className="min-h-dvh bg-gray-100">
      {/* ✅ Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
          aria-label="Menüyü kapat"
        />
      )}

      {/* ✅ Sidebar */}
      <Sidebar
        open={open}
        setOpen={setOpen}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogout={handleLogout}
        onNavigate={() => setMobileOpen(false)}
      />

      {/* ✅ Main */}
      <main
        className={[
          "min-h-dvh w-full p-4 md:p-6 transition-all duration-300",
          open ? "md:ml-64" : "md:ml-20",
        ].join(" ")}
      >
        <Outlet />
      </main>
    </div>
  );
}