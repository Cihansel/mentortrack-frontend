import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Plus } from "lucide-react";
import api from "../../api/axiosInstance";

type Course = {
  id: number;
  name: string;
  level: string;
};

export default function SourcesAdd() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await api.get("/courses");
        setCourses(res.data);
      } catch (err) {
        console.error("Dersler yüklenemedi:", err);
        setCourses([]);
      }
    };

    loadCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.post("/sources", {
        name,
        courseId: Number(courseId),
      });

      alert("Kaynak başarıyla eklendi!");
      navigate("/admin/sources");
    } catch (err: any) {
      alert(err?.response?.data?.error || "Kaynak eklenirken hata oluştu!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen size={30} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Yeni Kaynak Ekle
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Eklediğiniz kaynaklar derslere atanır ve test setlerinde kullanılır.
              </p>
            </div>
          </div>

          <Link
            to="/admin/sources"
            className="text-blue-600 hover:underline text-sm"
          >
            ← Kaynak Listesine Dön
          </Link>
        </div>

        <div className="bg-white/40 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Kaynak Adı
              </label>
              <input
                className="w-full p-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Örn: Prizma Yayınları"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Ders
              </label>
              <select
                className="w-full p-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                required
              >
                <option value="">Ders Seçiniz</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} - {c.level}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl shadow-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Plus size={20} />
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
