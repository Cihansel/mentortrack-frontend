import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  UserCircleIcon,
  BookOpenIcon,
  RectangleGroupIcon,
  QueueListIcon,
  ArchiveBoxIcon,
  ClipboardDocumentListIcon,
  Bars3Icon,
  ChevronLeftIcon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

type Props = {
  open: boolean; // desktop collapse
  setOpen: (v: boolean) => void;

  mobileOpen: boolean; // ✅ mobile drawer state
  setMobileOpen: (v: boolean) => void;

  onLogout: () => void;
  onNavigate?: () => void; // ✅ mobilde drawer kapatmak için
};

export default function Sidebar({
  open,
  setOpen,
  mobileOpen,
  setMobileOpen,
  onLogout,
  onNavigate,
}: Props) {
  const menu = [
    { name: "Dashboard", to: "/admin", icon: HomeIcon },
    { name: "Öğrenciler", to: "/admin/students", icon: UserGroupIcon },
    { name: "Veliler", to: "/admin/parents", icon: UserCircleIcon },
    { name: "Dersler", to: "/admin/courses", icon: BookOpenIcon },
    { name: "Üniteler", to: "/admin/units", icon: RectangleGroupIcon },
    { name: "Konular", to: "/admin/topics", icon: QueueListIcon },
    { name: "Kaynaklar", to: "/admin/sources", icon: ArchiveBoxIcon },
    { name: "Test Setleri", to: "/admin/testsets", icon: ClipboardDocumentListIcon },
    { name: "Konu Analizi", to: "/admin/topics/analytics", icon: QueueListIcon },
    { name: "Çalışma Kayıtları", to: "/admin/studyrecords", icon: ClipboardDocumentListIcon },
  ];

  return (
    <>
      {/* ✅ MOBILE: hamburger (drawer kapalıyken görünür) */}
      {!mobileOpen && (
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-black/60 text-white"
          aria-label="Menüyü aç"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      )}

      {/* ✅ SIDEBAR CONTAINER */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r transition-all duration-300",
          "h-dvh", // ✅ daha doğru viewport height (mobilde)
          open ? "w-64 bg-white/30 backdrop-blur-lg" : "w-20 bg-gray-900/70 backdrop-blur-lg",

          // ✅ mobile drawer behaviour
          "md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
        style={{
          boxShadow: open
            ? "0 8px 32px rgba(0,0,0,0.15)"
            : "0 4px 20px rgba(0,0,0,0.25)",
        }}
      >
        {/* ÜST */}
        <div className="flex items-center justify-between p-4">
          <h1
            className={[
              "text-2xl font-bold transition-all",
              open ? "opacity-100 text-gray-900" : "opacity-0 w-0 overflow-hidden",
            ].join(" ")}
          >
            MentorTrack
          </h1>

          {/* ✅ MOBILE: drawer close (X) */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-2 rounded hover:bg-black/10 transition"
            aria-label="Menüyü kapat"
          >
            <XMarkIcon className="w-6 h-6 text-gray-800" />
          </button>

          {/* ✅ DESKTOP: collapse */}
          {open && (
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="hidden md:inline-flex p-2 rounded hover:bg-black/10 transition"
              aria-label="Sidebar daralt"
            >
              <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
            </button>
          )}
        </div>

        {/* MENU */}
        <nav className="mt-2 space-y-2 flex-1 overflow-y-auto pb-4">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin" || item.to === "/admin/topics"}
              title={!open ? item.name : ""}
              onClick={() => {
                onNavigate?.();
                setMobileOpen(false); // ✅ mobilde tıklayınca kapat
              }}
              className={({ isActive }) => `
                flex items-center gap-3 mx-2 px-4 py-3 rounded-lg
                transition-all duration-200 group
                ${
                  open
                    ? isActive
                      ? "bg-blue-600 text-white shadow"
                      : "text-gray-800 hover:bg-black/5"
                    : isActive
                    ? "bg-blue-600 text-white shadow"
                    : "text-white hover:bg-white/10"
                }
              `}
            >
              <item.icon
                className={`w-6 h-6 ${
                  open ? "text-gray-800" : "text-white"
                } group-hover:text-white`}
              />

              <span
                className={`transition-all duration-300 ${
                  open ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                }`}
              >
                {item.name}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="p-3 border-t">
          <button
            type="button"
            onClick={() => {
              onLogout();
              onNavigate?.();
              setMobileOpen(false);
            }}
            className={`
              flex items-center gap-3 w-full px-4 py-3 rounded-lg transition
              ${open ? "text-red-600 hover:bg-red-50" : "text-red-400 hover:bg-white/10 justify-center"}
            `}
          >
            <ArrowRightOnRectangleIcon className="w-6 h-6" />
            <span className={`transition-all ${open ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
              Çıkış Yap
            </span>
          </button>
        </div>
      </aside>

      {/* ✅ DESKTOP: collapse açma butonu */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="
            hidden md:block
            fixed top-4 left-4 z-50
            p-2 rounded-lg backdrop-blur-lg
            bg-gray-900/40 hover:bg-gray-900/60
            transition border border-white/20
          "
          aria-label="Sidebar genişlet"
        >
          <Bars3Icon className="w-6 h-6 text-white" />
        </button>
      )}
    </>
  );
}