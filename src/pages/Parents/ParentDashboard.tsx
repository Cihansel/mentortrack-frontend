import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";

type ParentStudent = {
  id: number;
  name: string;
  grade: number;
  lastSeenAt: string | null;
  createdAt: string;
  totalQuestions: number;
  accuracy: number | null;
};

export default function ParentDashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<ParentStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/parent/students");
        setStudents(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error(e);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = useMemo(() => {
    const count = students.length;
    const totalQuestions = students.reduce((acc, s) => acc + (s.totalQuestions ?? 0), 0);

    const accVals = students
      .map((s) => s.accuracy)
      .filter((x): x is number => typeof x === "number");

    const avgAccuracy =
      accVals.length ? Math.round(accVals.reduce((a, b) => a + b, 0) / accVals.length) : null;

    return { count, totalQuestions, avgAccuracy };
  }, [students]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">👨‍👩‍👧 Veli Paneli</h1>
          <p className="text-gray-600">
            Bağlı öğrencilerinin genel durumunu buradan takip edebilirsin.
          </p>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Kpi title="Bağlı Öğrenci" value={stats.count} />
          <Kpi
            title="Ortalama Başarı"
            value={stats.avgAccuracy === null ? "—" : `%${stats.avgAccuracy}`}
          />
          <Kpi title="Toplam Soru" value={stats.totalQuestions} />
        </div>

        {/* List */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          {loading ? (
            <div className="text-gray-600">Yükleniyor...</div>
          ) : students.length === 0 ? (
            <div className="text-gray-600">
              Bu veli hesabına bağlı öğrenci bulunamadı.
              <br />
              (Admin tarafında “öğrenci → veli bağlama” yapıldığından emin ol.)
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {students.map((s) => (
                <div
                  key={s.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div>
                    <div className="font-semibold">
                      {s.name}{" "}
                      <span className="text-gray-500 font-normal">
                        ({s.grade}. sınıf)
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Son görünme:{" "}
                      {s.lastSeenAt ? new Date(s.lastSeenAt).toLocaleString() : "—"}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <div className="font-semibold">
                        {s.accuracy === null ? "Veri yok" : `%${s.accuracy}`}
                      </div>
                      <div className="text-xs text-gray-500">{s.totalQuestions} soru</div>
                    </div>

                    <button
                      onClick={() => navigate(`/parent/student/${s.id}`)}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                      Detay
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Kpi({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
      <div className="text-sm text-gray-600">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}