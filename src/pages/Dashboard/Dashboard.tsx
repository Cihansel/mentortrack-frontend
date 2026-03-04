import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Users,
  NotebookPen,
  Library,
  BarChart3,
  Flame,
  Timer,
  Target,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import api from "../../api/axiosInstance";

/* ================= TYPES ================= */

type LiveStudent = {
  id: number;
  name: string;
  status: "OFFLINE" | "IDLE" | "ASSIGNED" | "STARTED" | "FINISHED";
  lastActivityAt: string | null;
};

type StudyRecord = {
  id: number;
  studentId: number;
  topicId: number;
  date: string;
  questionCount: number;
  correct: number;
  incorrect: number;
  duration: number;
  student?: { name: string };
  topic?: { name: string };
};

type Stats = {
  students: number;
  courses: number;
  testSets: number;
  sources: number;
};

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    students: 0,
    courses: 0,
    testSets: 0,
    sources: 0,
  });

  const [chartData, setChartData] = useState<{ date: string; count: number }[]>(
    []
  );
  const [records, setRecords] = useState<StudyRecord[]>([]);
  const [liveStudents, setLiveStudents] = useState<LiveStudent[]>([]);
  const [loading, setLoading] = useState(true);

  // UI yardımcı durumlar
  const [errors, setErrors] = useState<string[]>([]);

  const loadData = async () => {
    setLoading(true);
    setErrors([]);

    const safeGet = async <T,>(path: string): Promise<T | null> => {
      try {
        const res = await api.get(path);
        return (res.data ?? null) as T | null;
      } catch (err: any) {
        const status = err?.response?.status;
        const msg =
          err?.response?.data?.error ||
          err?.message ||
          "Bilinmeyen hata oluştu";
        setErrors((prev) => [
          ...prev,
          `${path} → ${status ?? "?"} (${msg})`,
        ]);
        return null;
      }
    };

    const [students, courses, testSets, sources, rec, live] = await Promise.all([
      safeGet<any[]>("/students"),
      safeGet<any[]>("/courses"),
      safeGet<any[]>("/testsets"),
      safeGet<any[]>("/sources"),
      safeGet<StudyRecord[]>("/studyrecords"),
      safeGet<LiveStudent[]>("/admin/live-students"),
    ]);

    const studentsArr = students ?? [];
    const coursesArr = courses ?? [];
    const testSetsArr = testSets ?? [];
    const sourcesArr = sources ?? [];
    const recArr = rec ?? [];
    const liveArr = live ?? [];

    setStats({
      students: studentsArr.length,
      courses: coursesArr.length,
      testSets: testSetsArr.length,
      sources: sourcesArr.length,
    });

    setRecords(recArr);
    setLiveStudents(liveArr);

    const last7 = recArr
      .slice()
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7)
      .map((r) => ({
        date: new Date(r.date).toLocaleDateString("tr-TR", {
          month: "2-digit",
          day: "2-digit",
        }),
        count: Number(r.questionCount) || 0,
      }));

    setChartData(last7);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ---------------- STATS (SAFE) ---------------- */

  const totalQuestions = useMemo(
    () => records.reduce((s, r) => s + (Number(r.questionCount) || 0), 0),
    [records]
  );

  const totalDuration = useMemo(
    () => records.reduce((s, r) => s + (Number(r.duration) || 0), 0),
    [records]
  );

  const mostActiveStudentName = useMemo(() => {
    if (records.length === 0) return "-";

    const groupedByStudent = records.reduce((acc: Record<number, number>, r) => {
      const id = Number(r.studentId);
      acc[id] = (acc[id] || 0) + (Number(r.questionCount) || 0);
      return acc;
    }, {});

    const topId =
      Object.keys(groupedByStudent).length > 0
        ? Number(Object.entries(groupedByStudent).sort((a, b) => b[1] - a[1])[0][0])
        : null;

    if (!topId) return "-";

    return records.find((r) => Number(r.studentId) === topId)?.student?.name ?? "-";
  }, [records]);

  const mostWorkedTopicName = useMemo(() => {
    if (records.length === 0) return "-";

    const groupedByTopic = records.reduce((acc: Record<number, number>, r) => {
      const id = Number(r.topicId);
      acc[id] = (acc[id] || 0) + (Number(r.questionCount) || 0);
      return acc;
    }, {});

    const topId =
      Object.keys(groupedByTopic).length > 0
        ? Number(Object.entries(groupedByTopic).sort((a, b) => b[1] - a[1])[0][0])
        : null;

    if (!topId) return "-";

    return records.find((r) => Number(r.topicId) === topId)?.topic?.name ?? "-";
  }, [records]);

  if (loading) {
    return <div className="p-4 sm:p-6 lg:p-8 text-xl">Yükleniyor...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">👋 Hoş Geldin!</h1>

      {/* HATA PANELİ */}
      {errors.length > 0 && (
        <div className="mb-6 sm:mb-8 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
          <div className="font-semibold mb-2">Bazı istekler başarısız:</div>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
          <div className="text-xs mt-2 opacity-80">
            Not: 403 alıyorsan Admin token’ı yok/yanlış role ile giriş yapılmış olabilir.
          </div>
        </div>
      )}

      {/* TOP STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
        <InfoCard
          icon={<Users size={28} />}
          title="Öğrenci"
          value={stats.students}
          color="from-blue-500 to-blue-700"
        />
        <InfoCard
          icon={<BookOpen size={28} />}
          title="Ders"
          value={stats.courses}
          color="from-green-500 to-green-700"
        />
        <InfoCard
          icon={<NotebookPen size={28} />}
          title="Test Seti"
          value={stats.testSets}
          color="from-purple-500 to-purple-700"
        />
        <InfoCard
          icon={<Library size={28} />}
          title="Kaynak"
          value={stats.sources}
          color="from-yellow-400 to-yellow-600"
        />
      </div>

      {/* CHART */}
      <GlassCard title="Son 7 Gün – Çözülen Soru Sayısı">
        {chartData.length === 0 ? (
          <div className="p-4 sm:p-6 text-gray-600">
            Henüz çalışma kaydı yok. Öğrenciler test bitirdikçe burada görünecek.
          </div>
        ) : (
          <div className="h-[220px] sm:h-[280px] lg:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </GlassCard>

      {/* QUICK INSIGHTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-10">
        <QuickInsightCard
          icon={<Timer className="text-blue-600" size={26} />}
          title="Toplam Süre"
          value={`${totalDuration} dk`}
        />
        <QuickInsightCard
          icon={<Flame className="text-orange-500" size={26} />}
          title="En Aktif Öğrenci"
          value={mostActiveStudentName}
        />
        <QuickInsightCard
          icon={<Target className="text-green-600" size={26} />}
          title="En Çok Çalışılan Konu"
          value={mostWorkedTopicName}
        />
      </div>

      {/* LIVE STUDENTS */}
      <div className="mt-8 sm:mt-10 bg-white/60 backdrop-blur-xl p-4 sm:p-6 rounded-2xl shadow border">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold">🟢 Canlı Öğrenci Durumu</h2>
          <button
            onClick={loadData}
            className="text-sm px-3 py-2 rounded-lg border bg-white hover:bg-gray-50"
          >
            Yenile
          </button>
        </div>

        {liveStudents.length === 0 ? (
          <p className="text-gray-500">Aktif öğrenci yok.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[520px]">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">Öğrenci</th>
                  <th className="p-2 text-center">Durum</th>
                  <th className="p-2 text-center">Son Aktivite</th>
                </tr>
              </thead>
              <tbody>
                {liveStudents.map((s) => (
                  <tr key={s.id} className="border-b">
                    <td className="p-2 font-medium">{s.name}</td>
                    <td className="p-2 text-center">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="p-2 text-center text-gray-500">
                      {s.lastActivityAt
                        ? new Date(s.lastActivityAt).toLocaleString("tr-TR")
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MOTIVATION */}
      <div className="mt-8 sm:mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white shadow-xl">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Harika Gidiyorsun! 🚀</h2>
        <p className="opacity-90 text-base sm:text-lg">
          Bu hafta toplam <strong>{totalQuestions} soru</strong> çözüldü.
          Öğrencilerin performansı yükselmeye devam ediyor!
        </p>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function InfoCard({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className="bg-white/40 p-4 sm:p-6 rounded-2xl shadow border flex items-center gap-4">
      <div
        className={`w-14 h-14 rounded-xl text-white flex items-center justify-center bg-gradient-to-br ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <p className="text-2xl sm:text-3xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function GlassCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white/40 p-4 sm:p-6 rounded-2xl shadow border">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
        <BarChart3 className="shrink-0" /> {title}
      </h2>
      {children}
    </div>
  );
}

function QuickInsightCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="bg-white/60 p-4 sm:p-6 rounded-2xl shadow border flex items-center gap-4">
      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-gray-600 text-sm">{title}</p>
        <p className="text-lg sm:text-xl font-bold truncate">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: LiveStudent["status"] }) {
  const colors: Record<LiveStudent["status"], string> = {
    OFFLINE: "bg-gray-300 text-gray-600",
    IDLE: "bg-gray-200 text-gray-700",
    ASSIGNED: "bg-blue-100 text-blue-700",
    STARTED: "bg-orange-100 text-orange-700",
    FINISHED: "bg-green-100 text-green-700",
  };

  const labels: Record<LiveStudent["status"], string> = {
    OFFLINE: "OFFLINE",
    IDLE: "IDLE",
    ASSIGNED: "ASSIGNED",
    STARTED: "STARTED",
    FINISHED: "FINISHED",
  };

  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold ${colors[status]}`}
    >
      {labels[status]}
    </span>
  );
}