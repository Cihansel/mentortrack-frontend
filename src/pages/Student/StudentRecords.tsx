import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import {
  CheckCircle2,
  XCircle,
  Clock,
  CalendarDays,
  Target,
} from "lucide-react";

/* ================= TYPES ================= */

type RecordItem = {
  id: number;
  date: string;
  questionCount: number;
  correct: number;
  incorrect: number;
  duration: number;
  topic: {
    name: string;
  };
};

export default function StudentRecords() {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/studyrecords/my");
        setRecords(res.data ?? []);
      } catch (err) {
        console.error("Student records error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Yükleniyor...</div>;
  }

  if (records.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow text-gray-500">
        Henüz tamamlanmış bir çalışman yok.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {records.map((r) => {
        const successRate =
          r.questionCount > 0
            ? Math.round((r.correct / r.questionCount) * 100)
            : 0;

        const successColor =
          successRate >= 70
            ? "from-green-400 to-green-600"
            : successRate >= 50
            ? "from-yellow-400 to-yellow-600"
            : "from-red-400 to-red-600";

        return (
          <div
            key={r.id}
            className="bg-white rounded-[32px] p-5 shadow border flex flex-col gap-4"
          >
            {/* ÜST */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                📘 {r.topic.name}
              </h3>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CalendarDays size={16} />
                {new Date(r.date).toLocaleDateString("tr-TR")}
              </div>
            </div>

            {/* BAŞARI HERO */}
            <div
              className={`rounded-2xl px-5 py-4 text-white bg-gradient-to-r ${successColor} flex items-center justify-between`}
            >
              <div>
                <p className="text-xs opacity-90">Başarı</p>
                <p className="text-3xl font-bold">%{successRate}</p>
              </div>

              <Target size={36} className="opacity-90" />
            </div>

            {/* ALT İSTATİSTİKLER */}
            <div className="grid grid-cols-3 gap-3">
              <MiniStat
                icon={<CheckCircle2 className="text-green-600" size={18} />}
                label="Doğru"
                value={r.correct}
              />
              <MiniStat
                icon={<XCircle className="text-red-600" size={18} />}
                label="Yanlış"
                value={r.incorrect}
              />
              <MiniStat
                icon={<Clock className="text-blue-600" size={18} />}
                label="Süre"
                value={`${r.duration} dk`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ================= COMPONENTS ================= */

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center gap-1 text-center">
      {icon}
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
