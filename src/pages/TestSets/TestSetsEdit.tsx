import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api/axiosInstance";

type Source = {
  id: number;
  name: string;
  courseId: number;
};

type Topic = {
  id: number;
  name: string;
  unitId: number;
  unit?: { courseId: number };
};

type TestSet = {
  id: number;
  sourceId: number;
  topicId: number;
  testNumber: number;
  questionCount: number;
};

export default function TestSetsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [sources, setSources] = useState<Source[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);

  const [form, setForm] = useState({
    sourceId: "",
    topicId: "",
    testNumber: "",
    questionCount: "",
  });

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    const loadAll = async () => {
      try {
        const [srcRes, topicRes, testRes] = await Promise.all([
          api.get("/sources"),
          api.get("/topics"),
          api.get(`/testsets/${id}`),
        ]);

        const tset: TestSet = testRes.data;

        setSources(srcRes.data);
        setTopics(topicRes.data);

        setForm({
          sourceId: String(tset.sourceId),
          topicId: String(tset.topicId),
          testNumber: String(tset.testNumber),
          questionCount: String(tset.questionCount),
        });
      } catch {
        alert("Test seti bulunamadı.");
        navigate("/admin/testsets");
      }

      setLoading(false);
    };

    loadAll();
  }, [id, navigate]);

  /* ---------------- FILTER TOPICS ---------------- */
  useEffect(() => {
    if (!form.sourceId) {
      setFilteredTopics([]);
      return;
    }

    const src = sources.find((s) => s.id === Number(form.sourceId));
    if (!src) return;

    const related = topics.filter(
      (t) => t.unit && t.unit.courseId === src.courseId
    );

    setFilteredTopics(related);
  }, [form.sourceId, sources, topics]);

  /* ---------------- HANDLE CHANGE ---------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put(`/testsets/${id}`, {
        sourceId: Number(form.sourceId),
        topicId: Number(form.topicId),
        testNumber: Number(form.testNumber),
        questionCount: Number(form.questionCount),
      });

      alert("Test seti güncellendi!");
      navigate("/admin/testsets");
    } catch {
      alert("Hata: Güncellenemedi!");
    }

    setSaving(false);
  };

  if (loading) return <div className="p-10 text-xl">Yükleniyor...</div>;

  /* ---------------- UI ---------------- */
  return (
    <div className="p-8 flex justify-center">
      <div className="max-w-2xl w-full">

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">✏️ Test Seti Düzenle</h1>

          <Link to="/admin/testsets" className="text-blue-600 underline">
            ← Geri
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/40 p-8 rounded-2xl border shadow space-y-6"
        >
          {/* Source */}
          <div>
            <label className="block mb-1 font-medium">Kaynak</label>
            <select
              name="sourceId"
              value={form.sourceId}
              onChange={(e) =>
                setForm({ ...form, sourceId: e.target.value, topicId: "" })
              }
              className="w-full p-3 rounded-xl border"
            >
              <option value="">Seçiniz</option>
              {sources.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Topic */}
          <div>
            <label className="block mb-1 font-medium">Konu</label>
            <select
              name="topicId"
              disabled={!form.sourceId}
              value={form.topicId}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border"
            >
              <option value="">
                {!form.sourceId ? "Önce kaynak seçin" : "Konu Seçiniz"}
              </option>

              {filteredTopics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Test Number */}
          <div>
            <label className="block mb-1 font-medium">Test Numarası</label>
            <input
              type="number"
              name="testNumber"
              className="w-full p-3 rounded-xl border"
              value={form.testNumber}
              onChange={handleChange}
            />
          </div>

          {/* Question Count */}
          <div>
            <label className="block mb-1 font-medium">Soru Sayısı</label>
            <input
              type="number"
              name="questionCount"
              className="w-full p-3 rounded-xl border"
              value={form.questionCount}
              onChange={handleChange}
            />
          </div>

          <button
            disabled={saving}
            className="w-full bg-blue-600 text-white py-3 rounded-xl shadow disabled:bg-blue-400"
          >
            {saving ? "Kaydediliyor..." : "Güncelle"}
          </button>
        </form>
      </div>
    </div>
  );
}
