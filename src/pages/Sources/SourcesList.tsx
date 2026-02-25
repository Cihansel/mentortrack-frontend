import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, Plus, FileText } from "lucide-react";
import api from "../../api/axiosInstance";

type Source = {
  id: number;
  name: string;
  course?: {
    name: string;
    level: string;
  };
};

export default function SourcesList() {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await api.get("/sources");
      setSources(res.data);
    } catch (err) {
      console.error(err);
      setSources([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Bu kaynağı silmek istediğinizden emin misiniz?")) return;

    try {
      await api.delete(`/sources/${id}`);
      loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Silme sırasında hata oluştu!");
    }
  };

  if (loading) return <div className="p-8">Yükleniyor...</div>;

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-green-600 text-white flex items-center justify-center shadow-xl">
            <FileText size={30} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Kaynaklar</h1>
            <p className="text-gray-500 text-sm mt-1">
              Eklediğiniz tüm yayınlar ve dersler burada listelenir.
            </p>
          </div>
        </div>

        <Link
          to="/admin/sources/add"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow-lg transition"
        >
          <Plus size={18} />
          Yeni Kaynak
        </Link>
      </div>

      <div className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100/70 border-b">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Adı</th>
              <th className="p-3 text-left">Ders</th>
              <th className="p-3 w-32 text-left">İşlemler</th>
            </tr>
          </thead>

          <tbody>
            {sources.map((src) => (
              <tr
                key={src.id}
                className="border-b hover:bg-gray-50/70 transition"
              >
                <td className="p-3">{src.id}</td>

                <td className="p-3 font-medium">{src.name}</td>

                <td className="p-3">
                  {src.course ? (
                    <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                      {src.course.name} - {src.course.level}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>

                <td className="p-3 flex gap-3">
                  <Link
                    to={`/admin/sources/edit/${src.id}`}
                    className="text-yellow-600 hover:text-yellow-700 transition"
                  >
                    <Pencil size={20} />
                  </Link>

                  <button
                    onClick={() => handleDelete(src.id)}
                    className="text-red-600 hover:text-red-700 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sources.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            Kayıtlı kaynak bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
}
