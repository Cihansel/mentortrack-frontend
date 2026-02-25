import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";

export default function AddStudent() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    grade: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.grade) {
      alert("Lütfen tüm alanları doldurun!");
      return;
    }

    setSaving(true);

    try {
      const res = await api.post("/students", {
        name: form.name,
        email: form.email,
        grade: Number(form.grade),
      });

      const generatedPassword = res.data.password;

      alert(
        `Öğrenci başarıyla eklendi!\n\n` +
          `Ad Soyad: ${form.name}\n` +
          `Giriş Şifresi: ${generatedPassword}\n\n` +
          `⚠️ Bu bilgileri öğrenciye iletmeyi unutmayın.`
      );

      navigate("/admin/students");
    } catch (err: any) {
      alert(err?.response?.data?.error || "Öğrenci eklenemedi!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 flex justify-center">
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Yeni Öğrenci Ekle
          </h1>

          <Link
            to="/admin/students"
            className="text-blue-600 hover:underline text-sm"
          >
            ← Öğrenci Listesine Dön
          </Link>
        </div>

        <div className="bg-white/40 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-medium">Ad Soyad</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border"
                placeholder="Örn: Ahmet Yılmaz"
              />
            </div>

            <div>
              <label className="block font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border"
                placeholder="Örn: ahmet@gmail.com"
              />
            </div>

            <div>
              <label className="block font-medium">Sınıf</label>
              <select
                name="grade"
                value={form.grade}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border"
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
              className="w-full bg-blue-600 text-white py-3 rounded-xl disabled:opacity-60"
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
