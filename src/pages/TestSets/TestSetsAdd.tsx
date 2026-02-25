import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axiosInstance";

/* ---------------- TYPES ---------------- */
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

export default function TestSetsAdd() {
  const navigate = useNavigate();

  const [sources, setSources] = useState<Source[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔧 name alanı eklendi
  const [form, setForm] = useState({
    name: "",
    sourceId: "",
    topicId: "",
    testNumber: "",
    questionCount: "",
  });

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [srcRes, topicRes] = await Promise.all([
          api.get("/sources"),
          api.get("/topics"),
        ]);

        setSources(srcRes.data);
        setTopics(topicRes.data);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* ---------------- FILTER TOPICS ---------------- */
  useEffect(() => {
    if (!form.sourceId) {
      setFilteredTopics([]);
      return;
    }

    const source = sources.find((s) => s.id === Number(form.sourceId));
    if (!source) return;

    const related = topics.filter(
      (t) => t.unit && t.unit.courseId === source.courseId
    );

    setFilteredTopics(related);
  }, [form.sourceId, sources, topics]);

  /* ---------------- HANDLE CHANGE ---------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.sourceId ||
      !form.topicId ||
      !form.testNumber ||
      !form.questionCount
    ) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    setSaving(true);

    try {
      await api.post("/testsets/create", {
        name: form.name, // 🔧 name gönderiliyor
        sourceId: Number(form.sourceId),
        topicId: Number(form.topicId),
        testNumber: Number(form.testNumber),
        questionCount: Number(form.questionCount),
      });

      alert("Test başarıyla eklendi!");
      navigate("/admin/testsets");
    } catch {
      alert("Hata: Test eklenemedi!");
    }

    setSaving(false);
  };

  if (loading) return <div className="p-8 text-xl">Yükleniyor...</div>;

  /* ---------------- UI ---------------- */
  return (
    <div className="p-8 flex justify-center">
      <div className="max-w-xl w-full">
        <Link to="/admin/testsets" className="text-blue-600 underline text-sm">
          ← Test Setlerine Dön
        </Link>

        <h1 className="text-3xl font-bold mt-4 mb-8">📝 Yeni Test Seti</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white/40 backdrop-blur-xl p-6 rounded-2xl border shadow space-y-5"
        >
          {/* 🔧 Test Set Name */}
          <div>
            <label className="block font-medium mb-1">Test Set Adı</label>
            <input
              type="text"
              name="name"
              placeholder="TYT Türkçe – Sözcükte Anlamlar"
              className="w-full p-3 border rounded-xl"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          {/* Source */}
          <div>
            <label className="block font-medium mb-1">Kaynak</label>
            <select
              name="sourceId"
              value={form.sourceId}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
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
            <label className="block font-medium mb-1">Konu</label>
            <select
              name="topicId"
              disabled={!form.sourceId}
              value={form.topicId}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
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
            <label className="block font-medium mb-1">Test Numarası</label>
            <input
              type="number"
              name="testNumber"
              className="w-full p-3 border rounded-xl"
              value={form.testNumber}
              onChange={handleChange}
            />
          </div>

          {/* Question Count */}
          <div>
            <label className="block font-medium mb-1">Soru Sayısı</label>
            <input
              type="number"
              name="questionCount"
              className="w-full p-3 border rounded-xl"
              value={form.questionCount}
              onChange={handleChange}
            />
          </div>

          <button
            disabled={saving}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold shadow disabled:bg-blue-400"
          >
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </form>
      </div>
    </div>
  );
}
