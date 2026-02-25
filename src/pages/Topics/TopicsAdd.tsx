import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FilePlus } from "lucide-react";
import api from "../../api/axiosInstance";

type Unit = { id: number; name: string };

export default function TopicsAdd() {
  const navigate = useNavigate();

  const [units, setUnits] = useState<Unit[]>([]);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    unitId: "",
  });

  useEffect(() => {
    api.get("/units").then((res) => setUnits(res.data));
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.post("/topics/create", {
        name: form.name,
        unitId: Number(form.unitId),
      });

      alert("Konu başarıyla eklendi!");
      navigate("/admin/topics");
    } catch {
      alert("Konu eklenemedi!");
    }

    setSaving(false);
  };

  return (
    <div className="p-8 flex justify-center">
      <div className="w-full max-w-2xl">

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Yeni Konu Ekle</h1>
          <Link to="/topics" className="text-blue-600 underline text-sm">
            ← Konu Listesine Dön
          </Link>
        </div>

        <div className="bg-white/40 p-8 shadow rounded-2xl border">
          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block mb-1">Konu Adı</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border"
              />
            </div>

            <div>
              <label className="block mb-1">Ünite</label>
              <select
                name="unitId"
                value={form.unitId}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border"
              >
                <option value="">Seçiniz</option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              disabled={saving}
              className="w-full bg-blue-600 text-white py-3 rounded-xl"
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
