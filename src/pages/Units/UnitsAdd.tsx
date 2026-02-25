import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";

export default function UnitsAdd() {
  const [name, setName] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const loadCourses = async () => {
      const res = await api.get("/courses");
      setCourses(res.data);
    };
    loadCourses();
  }, []);

  const handleSave = async (e: any) => {
    e.preventDefault();

    if (!name.trim() || !courseId)
      return alert("Tüm alanları doldurmalısın!");

    const res = await api.post("/units", {
      name,
      courseId: Number(courseId),
    });

    if (res.status === 200) {
      alert("Ünite eklendi!");
      navigate("/admin/units");
    } else {
      alert("Hata oluştu!");
    }
  };

  return (
    <div className="p-8 flex justify-center">
      <div className="w-full max-w-2xl">

        {/* Geri Link */}
        <Link to="/units" className="text-blue-600 hover:underline text-sm">
          ← Ünite Listesine Dön
        </Link>

        {/* Başlık */}
        <h1 className="text-3xl font-bold mt-4 mb-8 text-gray-800">
          📘 Yeni Ünite Ekle
        </h1>

        {/* Form Kartı */}
        <div className="bg-white/40 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/50">
          <form onSubmit={handleSave} className="space-y-6">

            {/* Ünite Adı */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Ünite Adı
              </label>
              <input
                className="w-full p-3 rounded-xl bg-white border shadow-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Trigonometri"
              />
            </div>

            {/* Ders Seçimi */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Ders Seç
              </label>
              <select
                className="w-full p-3 rounded-xl bg-white border shadow-sm"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
              >
                <option value="">Ders seçiniz</option>
                {courses.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Kaydet */}
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl shadow-lg transition"
            >
              Kaydet
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
