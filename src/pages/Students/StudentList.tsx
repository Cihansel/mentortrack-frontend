import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, Plus, Eye, Users } from "lucide-react";
import api from "../../api/axiosInstance";

type Student = {
  id: number;
  name: string;
  grade: number;
};

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await api.get("/students");
      setStudents(res.data);
    } catch (err: any) {
      console.error("Öğrenci listesi yüklenemedi:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Bu öğrenciyi silmek istediğine emin misiniz?")) return;

    try {
      await api.delete(`/students/${id}`);
      loadData();
    } catch (err) {
      alert("Silme işlemi başarısız!");
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Öğrenciler yükleniyor...</div>;
  }

  return (
    <div className="p-8">
      {/* Başlık */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xl">
            <Users size={30} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-800">Öğrenci Listesi</h1>
            <p className="text-gray-500 text-sm mt-1">
              Kayıtlı öğrencileri görüntüleyebilir ve yönetebilirsiniz.
            </p>
          </div>
        </div>

        <Link
          to="/admin/students/add"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-lg transition"
        >
          <Plus size={18} />
          Yeni Öğrenci
        </Link>
      </div>

      {/* Tablo */}
      <div className="bg-white/40 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100/60 border-b border-gray-300/60">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">İsim</th>
              <th className="p-3 text-left">Sınıf</th>
              <th className="p-3 text-left">İşlemler</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr
                key={s.id}
                className="border-b hover:bg-gray-50/70 transition"
              >
                <td className="p-3">{s.id}</td>
                <td className="p-3">{s.name}</td>

                <td className="p-3">
                  {s.grade === 0 ? "Mezun" : `${s.grade}. Sınıf`}
                </td>

                <td className="p-3 flex gap-4">
                  <Link
                    to={`/admin/students/${s.id}`}
                    className="text-gray-600 hover:text-indigo-600"
                    title="Görüntüle"
                  >
                    <Eye size={20} />
                  </Link>

                  <Link
                    to={`/admin/students/edit/${s.id}`}
                    className="text-blue-600 hover:text-blue-800"
                    title="Düzenle"
                  >
                    <Pencil size={20} />
                  </Link>

                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Sil"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}

            {students.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  Henüz öğrenci eklenmemiş.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
