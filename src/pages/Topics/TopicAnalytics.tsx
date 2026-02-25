import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

/* TYPES */
type Topic = { id: number; name: string };
type Student = { id: number; name: string };
type StudyRecord = {
  id: number;
  topicId: number;
  studentId: number;
  questionCount: number;
  correct: number;
  incorrect: number;
};
type TopicStat = {
  id: number;
  name: string;
  totalQuestions: number;
  totalCorrect: number;
  totalIncorrect: number;
  successRate: number;
};

export default function TopicAnalytics() {
  const [students, setStudents] = useState<Student[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [records, setRecords] = useState<StudyRecord[]>([]);
  const [stats, setStats] = useState<TopicStat[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedStudent, setSelectedStudent] = useState<number | "all">("all");

  const [totalQuestions, setTotalQuestions] = useState(0);
  const [avgSuccessRate, setAvgSuccessRate] = useState(0);
  const [mostWorkedTopic, setMostWorkedTopic] = useState<string | null>(null);
  const [leastWorkedTopic, setLeastWorkedTopic] = useState<string | null>(null);

  /* LOAD ALL */
  const loadData = async () => {
    try {
      const [tRes, rRes, sRes] = await Promise.all([
        api.get("/topics"),
        api.get("/studyrecords"),
        api.get("/students"),
      ]);

      setTopics(tRes.data);
      setRecords(rRes.data);
      setStudents(sRes.data);

      buildStats(tRes.data, rRes.data, selectedStudent);
    } finally {
      setLoading(false);
    }
  };

  const buildStats = (
    topicsData: Topic[],
    recordsData: StudyRecord[],
    studentFilter: number | "all"
  ) => {
    const filtered =
      studentFilter === "all"
        ? recordsData
        : recordsData.filter((r) => r.studentId === studentFilter);

    const map = new Map<number, TopicStat>();

    topicsData.forEach((t) =>
      map.set(t.id, {
        id: t.id,
        name: t.name,
        totalQuestions: 0,
        totalCorrect: 0,
        totalIncorrect: 0,
        successRate: 0,
      })
    );

    filtered.forEach((r) => {
      const stat = map.get(r.topicId);
      if (stat) {
        stat.totalQuestions += r.questionCount;
        stat.totalCorrect += r.correct;
        stat.totalIncorrect += r.incorrect;
      }
    });

    const arr = [...map.values()].map((stat) => ({
      ...stat,
      successRate:
        stat.totalQuestions > 0
          ? Number(((stat.totalCorrect / stat.totalQuestions) * 100).toFixed(1))
          : 0,
    }));

    setStats(arr);

    const totalQ = arr.reduce((a, t) => a + t.totalQuestions, 0);
    setTotalQuestions(totalQ);

    const worked = arr.filter((t) => t.totalQuestions > 0);

    if (worked.length > 0) {
      const avg =
        worked.reduce((a, t) => a + t.successRate, 0) / worked.length;

      setAvgSuccessRate(Number(avg.toFixed(1)));

      setMostWorkedTopic(
        [...worked].sort((a, b) => b.totalQuestions - a.totalQuestions)[0].name
      );

      setLeastWorkedTopic(
        [...worked].sort((a, b) => a.totalQuestions - b.totalQuestions)[0].name
      );
    } else {
      setAvgSuccessRate(0);
      setMostWorkedTopic(null);
      setLeastWorkedTopic(null);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    buildStats(topics, records, selectedStudent);
  }, [selectedStudent]);

  if (loading) return <div className="p-8 text-lg">Yükleniyor...</div>;

  return (
    <div className="p-6 md:p-8 space-y-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-2">
          <span>📈</span> Konu Bazlı Performans Analizi
        </h1>

        <select
          className="
            px-4 py-2 rounded-xl bg-white/70 backdrop-blur 
            border border-gray-200 shadow-md 
            text-gray-800 font-medium hover:shadow-lg transition
          "
          value={selectedStudent}
          onChange={(e) =>
            setSelectedStudent(
              e.target.value === "all" ? "all" : Number(e.target.value)
            )
          }
        >
          <option value="all">Tüm Öğrenciler</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard emoji="📚" title="Toplam Konu" value={topics.length} />
        <SummaryCard emoji="📝" title="Toplam Soru" value={totalQuestions} />
        <SummaryCard emoji="🎯" title="Ortalama Başarı" value={`%${avgSuccessRate}`} />
        <SummaryCard emoji="🔥" title="En Çok Çalışılan" value={mostWorkedTopic ?? "-"} />
      </div>

      {/* MOST / LEAST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ExtraCard
          gradient="from-orange-400/50 to-yellow-200/50"
          emoji="🔥"
          label="En Çok Çalışılan Konu"
          value={mostWorkedTopic || "-"}
        />
        <ExtraCard
          gradient="from-blue-400/50 to-blue-200/50"
          emoji="❄️"
          label="En Az Çalışılan Konu"
          value={leastWorkedTopic || "-"}
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard title="Konu Bazlı Toplam Soru">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalQuestions" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard title="Başarı Oranı (%)">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="successRate" fill="#16a34a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* TABLE */}
      <GlassCard title="📊 Konu Başarı Detayları">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-2 text-left">Konu</th>
              <th className="p-2 text-left w-40">Başarı %</th>
              <th className="p-2 text-left">İlerleme</th>
            </tr>
          </thead>

          <tbody>
            {stats.map((t) => (
              <tr key={t.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-2">{t.name}</td>
                <td className="p-2 font-semibold">%{t.successRate}</td>
                <td className="p-2">
                  <ProgressBar value={t.successRate} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

    </div>
  );
}

/* COMPONENTS */

function SummaryCard({ emoji, title, value }: any) {
  return (
    <div className="
      bg-white/60 backdrop-blur 
      p-6 rounded-2xl shadow-lg border border-gray-200 
      hover:shadow-xl transition
    ">
      <div className="text-4xl">{emoji}</div>
      <p className="text-gray-600 text-sm">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}

function ExtraCard({ gradient, emoji, label, value }: any) {
  return (
    <div className={`
      p-6 rounded-2xl shadow-lg border border-gray-200 
      bg-gradient-to-br ${gradient} backdrop-blur 
      hover:shadow-xl transition
    `}>
      <div className="text-4xl">{emoji}</div>
      <p className="text-gray-700 mt-2">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function GlassCard({ title, children }: any) {
  return (
    <div className="
      bg-white/60 backdrop-blur 
      p-6 rounded-2xl shadow-lg border border-gray-200
    ">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  let color = "bg-red-500";
  if (value >= 90) color = "bg-green-500";
  else if (value >= 70) color = "bg-blue-500";
  else if (value >= 40) color = "bg-yellow-500";

  return (
    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`${color} h-3 transition-all duration-500`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
