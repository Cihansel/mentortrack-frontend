import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, Plus, BookText } from "lucide-react";
import api from "../../api/axiosInstance";

type Topic = {
  id: number;
  name: string;
  unit?: {
    name: string;
    course?: {
      name: string;
      level: string;
    };
  };
};

export default function TopicsList() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await api.get("/topics");
      setTopics(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Bu konuyu silmek istediğinize emin misiniz?")) return;
    await api.delete(`/topics/${id}`);
    loadData();
  };

  if (loading) return <div className="p-8 text-xl">Yükleniyor...</div>;

  return (
    <div className="p-8">

      <div className="flex items-start justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center">
            <BookText size={30} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Konular</h1>
            <p className="text-gray-500">Eklenen tüm konular listelenir.</p>
          </div>
        </div>

        <Link
          to="/admin/topics/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow flex items-center gap-2"
        >
          <Plus size={18} />
          Yeni Konu
        </Link>
      </div>

      <div className="bg-white/40 rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Konu Adı</th>
              <th className="p-3 text-left">Ünite</th>
              <th className="p-3 text-left">İşlemler</th>
            </tr>
          </thead>

          <tbody>
            {topics.map((t) => (
              <tr key={t.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{t.id}</td>
                <td className="p-3 font-medium">{t.name}</td>
                <td className="p-3">
                  {t.unit ? (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                      {t.unit.name}
                      {t.unit.course
                        ? ` – ${t.unit.course.name} (${t.unit.course.level})`
                        : ""}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>

                <td className="p-3 flex gap-3">
                  <Link
                    to={`/admin/topics/edit/${t.id}`}
                    className="text-yellow-600 hover:text-yellow-700"
                  >
                    <Pencil size={20} />
                  </Link>

                  <button
                    onClick={() => handleDelete(t.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {topics.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            Hiç konu eklenmemiş.
          </div>
        )}
      </div>
    </div>
  );
}
