import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BookOpen } from "lucide-react";
import api from "../../api/axiosInstance";

type Course = {
  id: number;
  name: string;
};

export default function SourcesEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState({
    name: "",
    courseId: "",
  });

  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [sourceRes, courseRes] = await Promise.all([
        api.get(`/sources/${id}`),
        api.get("/courses"),
      ]);

      setForm({
        name: sourceRes.data.name,
        courseId: String(sourceRes.data.courseId),
      });

      setCourses(courseRes.data);
    } catch (err) {
      alert("Veriler yüklenirken hata oluştu!");
      navigate("/admin/sources");
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.name || !form.courseId)
      return alert("Lütfen tüm alanları doldurun!");

    try {
      await api.put(`/sources/${id}`, {
        name: form.name,
        courseId: Number(form.courseId),
      });

      alert("Kaynak başarıyla güncellendi!");
      navigate("/admin/sources");
    } catch (err: any) {
      alert(err?.response?.data?.error || "Kaydedilirken hata oluştu!");
    }
  };

  if (loading) return <div className="p-8 text-xl">Yükleniyor...</div>;

  return (
    <div className="p-8">
      <Link to="/admin/sources" className="text-blue-600 hover:text-blue-800 underline text-sm">
        ← Kaynak Listesine Dön
      </Link>

      <div className="flex items-center gap-3 mt-4 mb-8">
        <BookOpen className="w-10 h-10 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">Kaynağı Düzenle</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white/40 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/60 max-w-xl"
      >
        <div className="mb-6">
          <label className="block mb-1 text-gray-700 font-medium">Kaynak Adı</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-gray-700 font-medium">Ders</label>
          <select
            className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            value={form.courseId}
            onChange={(e) => setForm({ ...form, courseId: e.target.value })}
            required
          >
            <option value="">Ders Seçiniz</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow transition">
          Kaydet
        </button>
      </form>
    </div>
  );
}
