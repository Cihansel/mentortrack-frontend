import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/axiosInstance";

export default function UnitsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Üniteyi ve dersleri yükle
  useEffect(() => {
    const loadData = async () => {
      try {
        // Dersleri getir
        const cRes = await api.get("/courses");
        setCourses(cRes.data);

        // Ünitenin kendisini getir
        const res = await api.get(`/units/${id}`);
        const data = res.data;

        setName(data.name);
        setCourseId(String(data.courseId));
      } catch (err) {
        console.error(err);
        alert("Ünite yüklenemedi!");
        navigate("/units");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  // Kaydet
  const handleSave = async (e: any) => {
    e.preventDefault();

    if (!name.trim() || !courseId) {
      return alert("Lütfen tüm alanları doldurun!");
    }

    setSaving(true);

    try {
      await api.put(`/units/${id}`, {
        name,
        courseId: Number(courseId),
      });

      alert("Ünite başarıyla güncellendi!");
      navigate("/admin/units");
    } catch (error) {
      console.error(error);
      alert("Güncelleme sırasında hata oluştu!");
    }

    setSaving(false);
  };

  if (loading) return <p className="p-6 text-center">Yükleniyor...</p>;

  return (
    <div className="p-8 max-w-xl mx-auto">
      
      {/* Başlık */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Ünite Düzenle #{id}</h1>

        <Link to="/admin/units" className="text-blue-600 hover:underline text-sm">
          ← Ünite Listesine Dön
        </Link>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-8">
        <form onSubmit={handleSave} className="space-y-6">

          {/* Ünite Adı */}
          <div>
            <label className="block mb-1 font-medium">Ünite Adı</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn: Trigonometri"
            />
          </div>

          {/* Kurs Seçimi */}
          <div>
            <label className="block mb-1 font-medium">Bağlı Olduğu Ders</label>
            <select
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            >
              <option value="">Ders Seçin</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Kaydet */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-yellow-500 text-white py-3 rounded-lg shadow hover:bg-yellow-600 transition disabled:bg-gray-400"
          >
            {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
          </button>

        </form>
      </div>
    </div>
  );
}
