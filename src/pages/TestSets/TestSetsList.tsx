import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axiosInstance";
import { Pencil, Trash2, Plus, ListChecks } from "lucide-react";

type TestSet = {
  id: number;
  testNumber: number;
  questionCount: number;
  topic?: { name: string };
};

export default function TestSetsList() {
  const [tests, setTests] = useState<TestSet[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await api.get("/testsets");
      setTests(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Bu test setini silmek istiyor musunuz?")) return;

    await api.delete(`/testsets/${id}`);
    loadData();
  };

  if (loading) return <div className="p-8 text-xl">Yükleniyor...</div>;

  return (
    <div className="p-8">

      <div className="flex justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-xl">
            <ListChecks size={30} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">Test Setleri</h1>
            <p className="text-gray-500">
              Sistemdeki tüm test setlerini görüntüleyin.
            </p>
          </div>
        </div>

        <Link
          to="/admin/testsets/add"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow"
        >
          <Plus size={18} /> Yeni Test Seti
        </Link>
      </div>

      <div className="bg-white/40 p-4 rounded-2xl border shadow-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Test No</th>
              <th className="p-3 text-left">Soru</th>
              <th className="p-3 text-left">Konu</th>
              <th className="p-3 text-left w-32">İşlemler</th>
            </tr>
          </thead>

          <tbody>
            {tests.map((t) => (
              <tr key={t.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{t.id}</td>
                <td className="p-3 font-medium">Test {t.testNumber}</td>
                <td className="p-3">{t.questionCount}</td>
                <td className="p-3">
                  {t.topic ? (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                      {t.topic.name}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>

                <td className="p-3 flex gap-3">
                  <Link
                    to={`/admin/testsets/edit/${t.id}`}
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

        {tests.length === 0 && (
          <div className="p-6 text-center text-gray-500">Test bulunamadı.</div>
        )}
      </div>
    </div>
  );
}
