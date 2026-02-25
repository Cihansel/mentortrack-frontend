import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

type Topic = { id: number; name: string };
type Student = { id: number; name: string };

type StudyRecord = {
  id: number;
  date: string;
  questionCount: number;
  correct: number;
  incorrect: number;
  duration: number;
  topic?: Topic;
  student?: Student; // ✅ admin listesinde lazım
};

export default function StudyRecordList() {
  const { role } = useAuth();

  const [records, setRecords] = useState<StudyRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | "all">(
    "all"
  );
  const [loading, setLoading] = useState(true);

  // Kayıtları çek
  useEffect(() => {
    const load = async () => {
      try {
        const endpoint = role === "ADMIN" ? "/studyrecords" : "/studyrecords/my";
        const res = await api.get(endpoint);
        setRecords(res.data ?? []);
      } catch (err) {
        console.error("Study records load error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [role]);

  // Öğrencileri çek (sadece ADMIN için)
  useEffect(() => {
    if (role !== "ADMIN") return;

    const loadStudents = async () => {
      try {
        const res = await api.get("/students");
        setStudents(res.data ?? []);
      } catch (err) {
        console.error("Students load error:", err);
      }
    };

    loadStudents();
  }, [role]);

  const filteredRecords = useMemo(() => {
    if (role !== "ADMIN") return records;
    if (selectedStudentId === "all") return records;
    return records.filter((r) => r.student?.id === selectedStudentId);
  }, [records, role, selectedStudentId]);

  if (loading) return <div className="p-6">Yükleniyor...</div>;

  return (
    <div className="bg-white/60 p-6 rounded-2xl shadow border">
      <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold">Çalışma Kayıtları</h2>

        <div className="flex items-center gap-3">
          {role === "ADMIN" && (
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Öğrenci:</label>
              <select
                value={selectedStudentId}
                onChange={(e) =>
                  setSelectedStudentId(
                    e.target.value === "all" ? "all" : Number(e.target.value)
                  )
                }
                className="border rounded-xl px-3 py-2 bg-white"
              >
                <option value="all">Tümü</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {role === "ADMIN" && (
            <Link
              to="/admin/studyrecords/add"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              + Yeni Kayıt
            </Link>
          )}
        </div>
      </div>

      {filteredRecords.length === 0 ? (
        <p className="text-gray-500">
          {role === "ADMIN" && selectedStudentId !== "all"
            ? "Seçilen öğrenci için çalışma kaydı yok."
            : "Henüz çalışma kaydı yok."}
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              {role === "ADMIN" && (
                <th className="p-2 text-left">Öğrenci</th>
              )}
              <th className="p-2 text-left">Tarih</th>
              <th className="p-2 text-left">Konu</th>
              <th className="p-2">Soru</th>
              <th className="p-2">Doğru</th>
              <th className="p-2">Yanlış</th>
              <th className="p-2">Süre</th>
              {role === "ADMIN" && <th className="p-2">İşlem</th>}
            </tr>
          </thead>

          <tbody>
            {filteredRecords.map((r) => (
              <tr key={r.id} className="border-b">
                {role === "ADMIN" && (
                  <td className="p-2">{r.student?.name ?? "-"}</td>
                )}
                <td className="p-2">
                  {new Date(r.date).toLocaleDateString("tr-TR")}
                </td>
                <td className="p-2">{r.topic?.name ?? "-"}</td>
                <td className="p-2 text-center">{r.questionCount}</td>
                <td className="p-2 text-center text-green-600">{r.correct}</td>
                <td className="p-2 text-center text-red-600">{r.incorrect}</td>
                <td className="p-2 text-center">{r.duration} dk</td>

                {role === "ADMIN" && (
                  <td className="p-2 text-center">
                    <Link
                      to={`/admin/studyrecords/edit/${r.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Düzenle
                    </Link>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
