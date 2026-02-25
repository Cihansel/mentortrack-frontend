import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axiosInstance";

export default function CoursesEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setName(res.data.name);
      } catch (err: any) {
        alert(err?.response?.data?.error || "Ders yüklenemedi!");
        navigate("/admin/courses");
      }

      setLoading(false);
    };

    loadCourse();
  }, [id, navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("Ders adı boş olamaz!");

    setSaving(true);

    try {
      await api.put(`/courses/${id}`, { name });

      alert("Ders başarıyla güncellendi!");
      navigate("/admin/courses");
    } catch (error: any) {
      alert(error?.response?.data?.error || "Sunucu hatası!");
    }

    setSaving(false);
  };

  if (loading) {
    return <div className="text-center p-6">Yükleniyor...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📘 Ders Düzenle</h1>

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block font-medium mb-1">Ders Adı</label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Matematik"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:bg-gray-400"
        >
          {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
        </button>
      </form>
    </div>
  );
}
