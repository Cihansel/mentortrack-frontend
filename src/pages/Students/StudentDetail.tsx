import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axiosInstance";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import AssignedTests from "./AssignedTests";

/* -------------------- TYPES -------------------- */

type Topic = {
  id: number;
  name: string;
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
  topic?: Topic;
};

type Student = {
  id: number;
  name: string;
  grade: number;
};

type Parent = {
  id: number;
  email: string;
  createdAt?: string;
};

type ParentLink = {
  id: number;
  parentId: number;
  studentId: number;
  createdAt?: string;
  parent: Parent;
};

/* -------------------- MAIN -------------------- */

export default function StudentDetail() {
  const { id } = useParams();
  const studentId = Number(id);

  const [student, setStudent] = useState<Student | null>(null);
  const [records, setRecords] = useState<StudyRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [totals, setTotals] = useState({
    questions: 0,
    correct: 0,
    incorrect: 0,
    avgSuccess: 0,
  });

  const [topicStats, setTopicStats] = useState<
    { topicName: string; successRate: number }[]
  >([]);

  // ✅ Parent management state
  const [allParents, setAllParents] = useState<Parent[]>([]);
  const [linkedParents, setLinkedParents] = useState<ParentLink[]>([]);
  const [parentLoading, setParentLoading] = useState(true);
  const [selectedParentId, setSelectedParentId] = useState<number | "">("");
  const [parentActionLoading, setParentActionLoading] = useState(false);
  const [parentError, setParentError] = useState<string | null>(null);

  /* -------------------- LOAD DATA -------------------- */

  const loadData = async () => {
    try {
      const sRes = await api.get(`/students/${studentId}`);
      const rRes = await api.get(`/studyrecords`);

      const all: StudyRecord[] = rRes.data;
      const filtered = all.filter((r) => r.studentId === studentId);

      setStudent(sRes.data);
      setRecords(filtered);

      /* ---- TOPLAM ---- */
      const totalQ = filtered.reduce((t, r) => t + r.questionCount, 0);
      const totalC = filtered.reduce((t, r) => t + r.correct, 0);
      const totalI = filtered.reduce((t, r) => t + r.incorrect, 0);

      setTotals({
        questions: totalQ,
        correct: totalC,
        incorrect: totalI,
        avgSuccess: totalQ ? Number(((totalC / totalQ) * 100).toFixed(1)) : 0,
      });

      /* ---- KONU BAZLI BAŞARI ---- */
      const map = new Map<number, { name: string; correct: number; total: number }>();

      filtered.forEach((r: StudyRecord) => {
        const name = r.topic?.name || `Konu #${r.topicId}`;
        const item = map.get(r.topicId) || { name, correct: 0, total: 0 };

        item.correct += r.correct;
        item.total += r.questionCount;

        map.set(r.topicId, item);
      });

      const topicArray = [...map.values()].map((t) => ({
        topicName: t.name,
        successRate: t.total ? Number(((t.correct / t.total) * 100).toFixed(1)) : 0,
      }));

      setTopicStats(topicArray);
    } finally {
      setLoading(false);
    }
  };

  const loadParentsBlock = async () => {
    setParentLoading(true);
    setParentError(null);

    try {
      const [parentsRes, linkedRes] = await Promise.all([
        api.get<Parent[]>("/admin/parents"),
        api.get<ParentLink[]>(`/admin/students/${studentId}/parents`),
      ]);

      setAllParents(parentsRes.data ?? []);
      setLinkedParents(linkedRes.data ?? []);
    } catch (err: any) {
      console.error("Parent management load error:", err);
      setParentError("Veliler yüklenemedi. (Yetki veya endpoint kontrol et)");
    } finally {
      setParentLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    loadParentsBlock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const linkedParentIds = useMemo(() => {
    return new Set(linkedParents.map((l) => l.parentId));
  }, [linkedParents]);

  const availableParents = useMemo(() => {
    // dropdown'da zaten bağlı olanları göstermeyelim
    return allParents.filter((p) => !linkedParentIds.has(p.id));
  }, [allParents, linkedParentIds]);

  const handleLinkParent = async () => {
    if (selectedParentId === "") return;

    setParentActionLoading(true);
    setParentError(null);

    try {
      await api.post(
        `/admin/students/${studentId}/parents/${selectedParentId}/link`
      );
      setSelectedParentId("");
      await loadParentsBlock();
    } catch (err: any) {
      console.error("Link parent error:", err);
      const msg =
        err?.response?.data?.error ||
        "Veli bağlanamadı. (Endpoint/Yetki kontrol et)";
      setParentError(msg);
    } finally {
      setParentActionLoading(false);
    }
  };

  const handleUnlinkParent = async (parentId: number) => {
    setParentActionLoading(true);
    setParentError(null);

    try {
      await api.delete(
        `/admin/students/${studentId}/parents/${parentId}/unlink`
      );
      await loadParentsBlock();
    } catch (err: any) {
      console.error("Unlink parent error:", err);
      const msg =
        err?.response?.data?.error ||
        "Bağlantı kaldırılamadı. (Endpoint/Yetki kontrol et)";
      setParentError(msg);
    } finally {
      setParentActionLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-xl">Yükleniyor...</div>;
  if (!student) return <div className="p-10">Öğrenci bulunamadı.</div>;

  return (
    <div className="p-8">
      {/* Back */}
      <Link to="/admin/students" className="text-blue-600 underline text-sm">
        ← Geri
      </Link>

      {/* Student Header */}
      <div className="flex items-center mt-4 mb-10 gap-5">
        <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl shadow-xl">
          {student.name
            .split(" ")
            .map((p) => p[0])
            .join("")}
        </div>

        <div>
          <h1 className="text-4xl font-bold">{student.name}</h1>
          <p className="text-gray-600">
            {student.grade === 0 ? "Mezun" : `${student.grade}. Sınıf`}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <InfoCard title="Toplam Soru" value={totals.questions} emoji="📝" />
        <InfoCard title="Doğru" value={totals.correct} emoji="✔️" />
        <InfoCard title="Yanlış" value={totals.incorrect} emoji="❌" />
        <InfoCard title="Başarı" value={`%${totals.avgSuccess}`} emoji="🎯" />
      </div>

      {/* ✅ VELİ YÖNETİMİ */}
      <GlassCard title="Veli Yönetimi">
        {parentLoading ? (
          <p className="text-gray-500">Veliler yükleniyor...</p>
        ) : (
          <div className="space-y-5">
            {parentError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {parentError}
              </div>
            )}

            {/* Bağlı veliler */}
            <div>
              <h3 className="font-semibold mb-2">Bağlı Veliler</h3>

              {linkedParents.length === 0 ? (
                <p className="text-gray-500 text-sm">Bu öğrenciye bağlı veli yok.</p>
              ) : (
                <div className="space-y-2">
                  {linkedParents.map((l) => (
                    <div
                      key={l.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/70 border"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{l.parent.email}</span>
                        {l.createdAt && (
                          <span className="text-xs text-gray-500">
                            Bağlandı: {String(l.createdAt).split("T")[0]}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleUnlinkParent(l.parentId)}
                        disabled={parentActionLoading}
                        className="px-3 py-2 rounded-lg border text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                      >
                        Bağlantıyı Kaldır
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Veli bağla */}
            <div>
              <h3 className="font-semibold mb-2">Veli Bağla</h3>

              {availableParents.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  Bağlanabilecek veli yok. (Önce admin’den veli oluştur)
                </p>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    className="border rounded-xl px-3 py-2 w-full sm:max-w-md"
                    value={selectedParentId}
                    onChange={(e) => {
                      const v = e.target.value;
                      setSelectedParentId(v === "" ? "" : Number(v));
                    }}
                  >
                    <option value="">Veli seç...</option>
                    {availableParents.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.email}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleLinkParent}
                    disabled={selectedParentId === "" || parentActionLoading}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    Bağla
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </GlassCard>

      {/* Topic Success Chart */}
      <GlassCard title="Konu Bazlı Başarı Oranı (%)">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topicStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="topicName" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="successRate" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* Study Records Table */}
      <GlassCard title="Çalışma Kayıtları">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Tarih</th>
              <th className="p-2 text-left">Konu</th>
              <th className="p-2 text-left">Soru</th>
              <th className="p-2 text-left">Doğru</th>
              <th className="p-2 text-left">Yanlış</th>
              <th className="p-2 text-left">Süre</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{r.date.split("T")[0]}</td>
                <td className="p-2">{r.topic?.name}</td>
                <td className="p-2">{r.questionCount}</td>
                <td className="p-2">{r.correct}</td>
                <td className="p-2">{r.incorrect}</td>
                <td className="p-2">{r.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      {/* ================= TEST ATAMA ================= */}
      <GlassCard title="Test Atama">
        <AssignedTests studentId={studentId} />
      </GlassCard>
    </div>
  );
}

/* ------------------ COMPONENTS ------------------ */

function InfoCard({ title, value, emoji }: any) {
  return (
    <div className="bg-white/40 p-6 rounded-2xl shadow border backdrop-blur-xl">
      <div className="text-3xl">{emoji}</div>
      <p className="text-gray-500">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function GlassCard({ title, children }: any) {
  return (
    <div className="bg-white/40 p-6 rounded-2xl shadow border backdrop-blur-xl mb-10">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}