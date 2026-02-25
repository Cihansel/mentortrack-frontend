import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";

export default function CoursesAdd() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return alert("Ders adı boş olamaz!");

    setLoading(true);

    try {
      await api.post("/courses", { name });

      alert("Ders başarıyla eklendi!");
      navigate("/admin/courses");
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.error || "Sunucu hatası!");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📘 Yeni Ders Ekle</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium mb-1">Ders Adı</label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Örn: Matematik"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:bg-gray-400"
        >
          {loading ? "Ekleniyor..." : "Dersi Ekle"}
        </button>
      </form>
    </div>
  );
}
