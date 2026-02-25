import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  UserCircleIcon, // ✅ EKLENDİ
  BookOpenIcon,
  RectangleGroupIcon,
  QueueListIcon,
  ArchiveBoxIcon,
  ClipboardDocumentListIcon,
  Bars3Icon,
  ChevronLeftIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  onLogout: () => void;
};

export default function Sidebar({ open, setOpen, onLogout }: Props) {
  const menu = [
    { name: "Dashboard", to: "/admin", icon: HomeIcon },
    { name: "Öğrenciler", to: "/admin/students", icon: UserGroupIcon },

    // ✅ YENİ: VELİLER
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
      {/* SIDEBAR */}
      <div
        className={`
          h-screen fixed top-0 left-0 border-r
          transition-all duration-300 flex flex-col z-40
          ${open ? "bg-white/30 backdrop-blur-lg w-64" : "bg-gray-900/70 backdrop-blur-lg w-20"}
        `}
        style={{
          boxShadow: open
            ? "0 8px 32px rgba(0,0,0,0.15)"
            : "0 4px 20px rgba(0,0,0,0.25)",
        }}
      >
        {/* ÜST */}
        <div className="flex items-center justify-between p-4">
          <h1
            className={`text-2xl font-bold transition-all ${
              open ? "opacity-100 text-gray-900" : "opacity-0 w-0 overflow-hidden"
            }`}
          >
            MentorTrack
          </h1>

          {open && (
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded hover:bg-black/10 transition"
            >
              <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
            </button>
          )}
        </div>

        {/* MENU */}
        <nav className="mt-4 space-y-2 flex-1">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin" || item.to === "/admin/topics"}
              title={!open ? item.name : ""}
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

        {/* 🔴 LOGOUT */}
        <div className="p-3 border-t">
          <button
            onClick={onLogout}
            className={`
              flex items-center gap-3 w-full px-4 py-3 rounded-lg
              transition
              ${
                open
                  ? "text-red-600 hover:bg-red-50"
                  : "text-red-400 hover:bg-white/10 justify-center"
              }
            `}
          >
            <ArrowRightOnRectangleIcon className="w-6 h-6" />
            <span
              className={`transition-all ${
                open ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
              }`}
            >
              Çıkış Yap
            </span>
          </button>
        </div>
      </div>

      {/* AÇMA BUTONU */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="
            fixed top-4 left-4 z-50
            p-2 rounded-lg backdrop-blur-lg
            bg-gray-900/40 hover:bg-gray-900/60
            transition border border-white/20
          "
        >
          <Bars3Icon className="w-6 h-6 text-white" />
        </button>
      )}
    </>
  );
}