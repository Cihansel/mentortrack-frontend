import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/axiosInstance";
import { UserCog } from "lucide-react";

export default function StudentsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    grade: "",
  });

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const res = await api.get(`/students/${id}`);
        setForm({
          name: res.data.name,
          email: res.data.email,
          grade: String(res.data.grade),
        });
      } catch {
        alert("Öğrenci bulunamadı!");
        navigate("/admin/students");
      }
      setLoading(false);
    };

    loadStudent();
  }, [id]);

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put(`/students/${id}`, {
        ...form,
        grade: Number(form.grade),
      });

      alert("Öğrenci güncellendi!");
      navigate("/admin/students");
    } catch (err: any) {
      alert(err?.response?.data?.error || "Güncelleme yapılamadı!");
    }

    setSaving(false);
  };

  if (loading) return <div className="p-8 text-xl">Yükleniyor...</div>;

  return (
    <div className="p-8 flex justify-center">
      <div className="w-full max-w-2xl">

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-xl">
            <UserCog size={30} />
          </div>

          <h1 className="text-3xl font-bold">Öğrenci Düzenle</h1>

          <Link to="/admin/students" className="ml-auto text-blue-600 underline">
            ← Geri
          </Link>
        </div>

        <div className="bg-white/40 backdrop-blur-xl p-8 rounded-2xl shadow-xl">
          <form onSubmit={handleUpdate} className="space-y-6">

            <div>
              <label className="font-medium">Ad Soyad</label>
              <input
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-3 rounded-xl border"
                required
              />
            </div>

            <div>
              <label className="font-medium">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full p-3 rounded-xl border"
                required
              />
            </div>

            <div>
              <label className="font-medium">Sınıf</label>
              <select
                name="grade"
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
                className="w-full p-3 rounded-xl border"
                required
              >
                <option value="">Seçiniz</option>
                <option value="9">9. Sınıf</option>
                <option value="10">10. Sınıf</option>
                <option value="11">11. Sınıf</option>
                <option value="12">12. Sınıf</option>
                <option value="0">Mezun</option>
              </select>
            </div>

            <button
              disabled={saving}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl"
            >
              {saving ? "Güncelleniyor..." : "Güncelle"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
