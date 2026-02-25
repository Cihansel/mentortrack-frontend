import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuth(); // 🔑 ÖNEMLİ DEĞİŞİKLİK

  const [activeTab, setActiveTab] = useState<"student" | "parent">("student");

  const [studentName, setStudentName] = useState("");
  const [studentPassword, setStudentPassword] = useState("");

  const [parentEmail, setParentEmail] = useState("");
  const [parentPassword, setParentPassword] = useState("");

  const [error, setError] = useState("");

  /* ------------------------------------------------------
     🎓 STUDENT LOGIN
  ------------------------------------------------------ */
  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:4000/student/login", {
        name: studentName,
        password: studentPassword,
      });

      const { token, role, userId } = res.data;

      if (role !== "STUDENT") {
        setError("Bu giriş öğrenci hesabına ait değil.");
        return;
      }

      // ✅ STUDENT AUTH SET
      setAuth({
  token,
  role,
  userId,
});

localStorage.setItem(
  "mentortrack_auth",
  JSON.stringify({ token, role, userId })
);

navigate("/student");
    } catch (err: any) {
      setError(err.response?.data?.error || "Giriş başarısız.");
    }
  };

  /* ------------------------------------------------------
     👨‍👩‍👧 PARENT LOGIN
  ------------------------------------------------------ */
  const handleParentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:4000/parent/login", {
        email: parentEmail,
        password: parentPassword,
      });

      const { token, role, userId, email } = res.data;

      if (role !== "PARENT") {
        setError("Bu giriş veli hesabına ait değil.");
        return;
      }

      // ✅ PARENT AUTH SET
      setAuth({
        token,
        role,
        userId: userId ?? null,
        email: email ?? null,
      });

      navigate("/parent");
    } catch (err: any) {
      setError(err.response?.data?.error || "Giriş başarısız.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">

        {/* Üst Tab Menü */}
        <div className="flex mb-6 border-b">
          <button
            onClick={() => setActiveTab("student")}
            className={`flex-1 py-2 text-center font-semibold ${
              activeTab === "student"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            Öğrenci Girişi
          </button>

          <button
            onClick={() => setActiveTab("parent")}
            className={`flex-1 py-2 text-center font-semibold ${
              activeTab === "parent"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            Veli Girişi
          </button>
        </div>

        {/* Hata mesajı */}
        {error && (
          <div className="text-red-600 text-center mb-4 font-medium">
            {error}
          </div>
        )}

        {/* ÖĞRENCİ FORMU */}
        {activeTab === "student" && (
          <form onSubmit={handleStudentLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Ad Soyad
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Şifre
              </label>
              <input
                type="password"
                value={studentPassword}
                onChange={(e) => setStudentPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200"
                required
              />
            </div>

            <button className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700">
              Giriş Yap
            </button>
          </form>
        )}

        {/* VELİ FORMU */}
        {activeTab === "parent" && (
          <form onSubmit={handleParentLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Şifre
              </label>
              <input
                type="password"
                value={parentPassword}
                onChange={(e) => setParentPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200"
                required
              />
            </div>

            <button className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700">
              Giriş Yap
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
