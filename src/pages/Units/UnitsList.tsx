import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, Plus, Boxes } from "lucide-react";
import api from "../../api/axiosInstance";

type Unit = {
  id: number;
  name: string;
  course?: {
    name: string;
    level?: string;
  };
};

export default function UnitsList() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await api.get("/units");
      setUnits(res.data);
    } catch (err) {
      console.error("Units yüklerken hata:", err);
      setUnits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Bu üniteyi silmek istediğinize emin misiniz?")) return;

    try {
      await api.delete(`/units/${id}`);
      loadData();
    } catch (err) {
      alert("Silme işleminde hata oluştu.");
      console.error(err);
    }
  };

  if (loading) return <div className="p-4 sm:p-6 lg:p-8 text-xl">Yükleniyor...</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 sm:mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-xl">
            <Boxes size={28} />
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Üniteler</h1>
            <p className="text-gray-500 text-sm mt-1">
              Eklediğiniz tüm üniteleri buradan yönetebilirsiniz.
            </p>
          </div>
        </div>

        <Link
          to="/admin/units/add"
          className="
            w-full sm:w-auto
            flex items-center justify-center gap-2
            bg-purple-600 hover:bg-purple-700
            text-white px-4 py-2 rounded-xl shadow-lg transition
          "
        >
          <Plus size={18} />
          Yeni Ünite
        </Link>
      </div>

      {/* Tablo */}
      <div className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl overflow-hidden">
        {/* ✅ mobilde tablo taşmasın */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-gray-100/70 border-b">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Ünite Adı</th>
                <th className="p-3 text-left">Ders</th>
                <th className="p-3 text-left w-32">İşlemler</th>
              </tr>
            </thead>

            <tbody>
              {units.map((u) => (
                <tr
                  key={u.id}
                  className="border-b hover:bg-gray-50/70 transition"
                >
                  <td className="p-3">{u.id}</td>
                  <td className="p-3 font-medium">{u.name}</td>

                  <td className="p-3">
                    {u.course ? (
                      <span className="inline-flex px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
                        {u.course.name}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="p-3">
                    <div className="flex gap-3 whitespace-nowrap">
                      <Link
                        to={`/admin/units/edit/${u.id}`}
                        className="text-yellow-600 hover:text-yellow-700 transition"
                        aria-label="Düzenle"
                      >
                        <Pencil size={20} />
                      </Link>

                      <button
                        onClick={() => handleDelete(u.id)}
                        className="text-red-600 hover:text-red-700 transition"
                        aria-label="Sil"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {units.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            Kayıtlı ünite bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
}