import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, Plus, BookOpen } from "lucide-react";
import api from "../../api/axiosInstance";

type Course = {
  id: number;
  name: string;
  createdAt: string;
};

export default function CoursesList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await api.get("/courses");
      setCourses(res.data);
    } catch (err) {
      console.error(err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Bu dersi silmek istediğinize emin misiniz?")) return;

    try {
      await api.delete(`/courses/${id}`);
      loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Silinemedi!");
    }
  };

  if (loading) return <div className="p-8 text-xl">Yükleniyor...</div>;

  return (
    <div className="p-8">

      {/* Başlık */}
      <div className="flex items-start justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xl">
            <BookOpen size={30} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dersler</h1>
            <p className="text-gray-500 text-sm mt-1">
              Eklediğiniz tüm dersleri buradan yönetebilirsiniz.
            </p>
          </div>
        </div>

        <Link
          to="/admin/courses/add"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 
          text-white px-4 py-2 rounded-xl shadow-lg transition"
        >
          <Plus size={18} />
          Yeni Ders
        </Link>
      </div>

      {/* Ders Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white/40 backdrop-blur-xl border border-white/50 
            rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-xl 
            transition cursor-pointer"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                {course.name}
              </h2>

              <p className="text-gray-500 text-sm mb-4">
                Oluşturulma: {course.createdAt.split("T")[0]}
              </p>
            </div>

            <div className="flex items-center justify-end gap-4 mt-4">
              <Link
                to={`/admin/courses/edit/${course.id}`}
                className="text-blue-600 hover:text-blue-800 transition"
              >
                <Pencil size={20} />
              </Link>

              <button
                onClick={() => handleDelete(course.id)}
                className="text-red-600 hover:text-red-800 transition"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}

        {courses.length === 0 && (
          <p className="text-gray-500 text-sm col-span-full">
            Kayıtlı ders bulunamadı.
          </p>
        )}
      </div>
    </div>
  );
}
