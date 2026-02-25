import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type TrendPoint = { day: string; accuracy: number; total: number };
type WeakTopic = { topicId: number; topicName: string; accuracy: number; totalQuestions: number };

type Overview = {
  trend: TrendPoint[];
  weakTopics: WeakTopic[];
  activeAssignmentsCount: number;
  last7Days: { total: number; correct: number; incorrect: number };
};

export default function ParentStudentDetail() {
  const { studentId } = useParams();
  const nav = useNavigate();

  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/parent/student/${studentId}/overview`);
        setData(res.data);
      } catch (e) {
        console.error(e);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    if (studentId) load();
  }, [studentId]);

  const last7Accuracy = useMemo(() => {
    if (!data) return null;
    const total = data.last7Days.total;
    if (!total) return null;
    return Math.round((data.last7Days.correct / total) * 100);
  }, [data]);

  const chartData = useMemo(() => {
    if (!data) return [];
    return (data.trend || []).map((p) => ({
      ...p,
      label: formatDayLabel(p.day),
    }));
  }, [data]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">📊 Öğrenci Detayı</h1>
            <p className="text-gray-600 text-sm">
              Son 7 gün trendi, zayıf konular ve aktif test durumunu görebilirsin.
            </p>
          </div>

          <button
            onClick={() => nav("/parent")}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50"
          >
            Geri
          </button>
        </div>

        {loading ? (
          <div className="text-gray-600">Yükleniyor...</div>
        ) : !data ? (
          <div className="text-gray-600">Veri alınamadı.</div>
        ) : (
          <>
            {/* Özet */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="text-sm text-gray-600">Son 7 Gün Başarı</div>
                <div className="text-3xl font-bold">
                  {last7Accuracy === null ? "—" : `%${last7Accuracy}`}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {data.last7Days.total} soru • {data.last7Days.correct} doğru •{" "}
                  {data.last7Days.incorrect} yanlış
                </div>
              </div>

              <span className="px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-sm w-fit">
                Aktif test: <span className="font-semibold">{data.activeAssignmentsCount}</span>
              </span>
            </div>

            {/* KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Kpi title="Son 7 gün soru" value={data.last7Days.total} />
              <Kpi title="Doğru" value={data.last7Days.correct} />
              <Kpi title="Yanlış" value={data.last7Days.incorrect} />
              <Kpi title="Aktif test" value={data.activeAssignmentsCount} />
            </div>

            {/* Trend */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <div className="font-semibold mb-3">📈 Son 7 Gün Başarı Trendi</div>

              {chartData.length === 0 ? (
                <div className="text-gray-600">Son 7 günde kayıt yok.</div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="accuracy" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Weak Topics */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <div className="font-semibold mb-3">⚠️ Zayıf Konular (Son 30 gün)</div>

              {data.weakTopics.length === 0 ? (
                <div className="text-gray-600">Yeterli veri yok.</div>
              ) : (
                <div className="space-y-3">
                  {data.weakTopics.map((t) => (
                    <div key={t.topicId} className="border border-gray-200 rounded-2xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{t.topicName}</div>
                          <div className="text-xs text-gray-500">{t.totalQuestions} soru</div>
                        </div>
                        <div className="font-semibold">%{t.accuracy}</div>
                      </div>

                      <div className="mt-3 h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{ width: `${Math.min(Math.max(t.accuracy, 0), 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Kpi({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
      <div className="text-sm text-gray-600">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

function formatDayLabel(day: string) {
  const parts = day.split("-");
  if (parts.length !== 3) return day;
  return `${parts[2]}.${parts[1]}`;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const p = payload[0]?.payload;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-3 text-sm">
      <div className="font-semibold">{label}</div>
      <div>Başarı: %{p.accuracy}</div>
      <div>Toplam soru: {p.total}</div>
    </div>
  );
}