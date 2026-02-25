import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

/* 🧠 MOTİVASYON METİNLERİ */
const messages = [
  "Bir soru bir soru… Zamanla başarı gelir 📈",
  "Küçük adımlar, büyük sonuçlar 🚀",
  "Bir test daha, bir hedef daha 🎯",
  "Şu an en iyi versiyonunla buradasın 💪",
  "Hadi bakalım, odak zamanı 👀",
  "Bugün kendini şaşırtabilirsin ✨",
  "Ertelemek yok, başlıyoruz 😎",
];

export default function StudentLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  /* ❤️ HEARTBEAT */
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const sendHeartbeat = async () => {
      try {
        await api.post("/students/heartbeat");
      } catch {}
    };

    sendHeartbeat();
    interval = setInterval(sendHeartbeat, 15000);

    return () => clearInterval(interval);
  }, []);

  /* 🚪 LOGOUT */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* ⌨️ DAKTİLO + ROTASYON */
  const [messageIndex, setMessageIndex] = useState(
    Math.floor(Math.random() * messages.length)
  );
  const [displayedText, setDisplayedText] = useState("");

  // Daktilo efekti (BUG FIX’Lİ)
 useEffect(() => {
  const fullText = messages[messageIndex];

  // Emoji ve bazı unicode karakterlerde güvenli bölmek için:
  const chars = Array.from(fullText);

  let i = 0;
  setDisplayedText("");

  const timer = setInterval(() => {
    i += 1;
    setDisplayedText(chars.slice(0, i).join(""));

    if (i >= chars.length) clearInterval(timer);
  }, 45);

  return () => clearInterval(timer);
}, [messageIndex]);


  // 30 dakikada bir mesaj değiştir
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 30 * 60 * 1000);

    return () => clearInterval(rotationInterval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* GLASS HEADER */}
      <header className="sticky top-0 z-40">
        <div className="backdrop-blur-xl bg-white/70 border-b border-white/60 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

            {/* SOL — LOGO */}
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                M
              </div>
            </div>

            {/* ORTA — MOTİVASYON METNİ */}
            <div className="hidden md:flex flex-1 justify-center">
              <div className="text-lg font-semibold text-gray-700 tracking-wide min-h-[26px]">
                {displayedText}
                <span className="ml-1 text-blue-500 animate-pulse">|</span>
              </div>
            </div>

            {/* SAĞ — NAV */}
            <nav className="flex items-center gap-6 text-sm font-medium text-gray-700">
              <Link to="/student" className="hover:text-blue-600 transition">
                Dashboard
              </Link>

              <Link
                to="/student/records"
                className="hover:text-blue-600 transition"
              >
                Çalışmalarım
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                Çıkış
              </button>
            </nav>

          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        <Outlet />
      </main>
    </div>
  );
}
