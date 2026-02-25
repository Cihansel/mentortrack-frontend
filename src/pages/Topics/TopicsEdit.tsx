import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/axiosInstance";

type Unit = { id: number; name: string };
type Topic = { id: number; name: string; unitId: number };

export default function TopicsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [units, setUnits] = useState<Unit[]>([]);
  const [form, setForm] = useState({ name: "", unitId: "" });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [topicRes, unitRes] = await Promise.all([
          api.get(`/topics/${id}`),
          api.get("/units"),
        ]);

        const topic: Topic = topicRes.data;
        setUnits(unitRes.data);

        setForm({
          name: topic.name,
          unitId: String(topic.unitId),
        });
      } catch {
        alert("Konu bulunamadı!");
        navigate("/admin/topics");
      }

      setLoading(false);
    };

    loadData();
  }, [id]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await api.put(`/topics/${id}`, {
        name: form.name,
        unitId: Number(form.unitId),
      });

      alert("Konu başarıyla güncellendi!");
      navigate("/admin/topics");
    } catch {
      alert("Güncelleme yapılamadı!");
    }
  };

  if (loading) return <div className="p-8 text-xl">Yükleniyor...</div>;

  return (
    <div className="p-8 flex justify-center">
      <div className="w-full max-w-2xl">

        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">Konu Düzenle</h1>
          <Link to="/admin/topics" className="text-blue-600 underline text-sm">
            ← Geri
          </Link>
        </div>

        <div className="bg-white/40 p-8 rounded-2xl shadow border">
          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block mb-1">Konu Adı</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-xl"
              />
            </div>

            <div>
              <label className="block mb-1">Ünite</label>
              <select
                name="unitId"
                value={form.unitId}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-xl"
              >
                <option value="">Seçiniz</option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <button className="w-full bg-blue-600 text-white py-3 rounded-xl">
              Kaydet
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
