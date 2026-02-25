import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";

/* ---------------- TYPES ---------------- */
type Student = { id: number; name: string };
type Topic = { id: number; name: string };
type TestSet = { id: number; testNumber: number; questionCount: number };

export default function StudyRecordAdd() {
  const navigate = useNavigate();

  const [students, setStudents] = useState<Student[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [tests, setTests] = useState<TestSet[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingTests, setLoadingTests] = useState(false);

  const [form, setForm] = useState({
    studentId: "",
    topicId: "",
    testSetId: "",
    questionCount: "",
    correct: "",
    incorrect: "",
    duration: "",
  });

  /* ---------------- LOAD STUDENTS + TOPICS ---------------- */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [sRes, tRes] = await Promise.all([
          api.get("/students"),
          api.get("/topics"),
        ]);

        setStudents(sRes.data);
        setTopics(tRes.data);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* ---------------- LOAD TESTS WHEN TOPIC SELECTED ---------------- */
  useEffect(() => {
    if (!form.topicId) {
      setTests([]);
      setForm((f) => ({ ...f, testSetId: "", questionCount: "" }));
      return;
    }

    const loadTests = async () => {
      setLoadingTests(true);
      try {
        const res = await api.get(`/testsets/byTopic/${form.topicId}`);
        setTests(res.data);
      } finally {
        setLoadingTests(false);
      }
    };

    loadTests();
  }, [form.topicId]);

  /* ---------------- SELECT TEST → AUTO SET QUESTION COUNT ---------------- */
  const handleSelectTest = (testId: string) => {
    const selected = tests.find((t) => t.id === Number(testId));

    setForm((prev) => ({
      ...prev,
      testSetId: testId,
      questionCount: selected ? String(selected.questionCount) : "",
    }));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.studentId ||
      !form.topicId ||
      !form.testSetId ||
      !form.questionCount ||
      !form.correct ||
      !form.incorrect ||
      !form.duration
    ) {
      alert("Lütfen tüm alanları doldurun!");
      return;
    }

    await api.post("/studyrecords/create", {
      studentId: Number(form.studentId),
      topicId: Number(form.topicId),
      testSetId: Number(form.testSetId),
      questionCount: Number(form.questionCount),
      correct: Number(form.correct),
      incorrect: Number(form.incorrect),
      duration: Number(form.duration),
    });

    alert("Kayıt başarıyla eklendi!");
    navigate("/admin/studyrecords");
  };

  if (loading) return <div className="p-8 text-xl">Yükleniyor...</div>;

  /* ---------------- UI ---------------- */
  return (
    <div className="p-8 flex justify-center">
      <div className="w-full max-w-3xl">

        <Link to="/admin/studyrecords" className="text-blue-600 underline text-sm">
          ← Çalışma Kayıtlarına Dön
        </Link>

        <h1 className="text-3xl font-bold mt-4 mb-8 text-gray-800">
          📝 Yeni Çalışma Kaydı
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white/40 backdrop-blur-xl p-8 rounded-2xl shadow-lg border"
        >
          {/* Öğrenci */}
          <div className="mb-5">
            <label className="block font-medium">Öğrenci</label>
            <select
              className="w-full p-3 rounded-xl border"
              value={form.studentId}
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}
            >
              <option value="">Seçiniz</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Konu */}
          <div className="mb-5">
            <label className="block font-medium">Konu</label>
            <select
              className="w-full p-3 rounded-xl border"
              value={form.topicId}
              onChange={(e) => setForm({ ...form, topicId: e.target.value })}
            >
              <option value="">Seçiniz</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Test */}
          <div className="mb-5">
            <label className="block font-medium">Test Seç</label>
            <select
              disabled={!form.topicId}
              className="w-full p-3 rounded-xl border"
              value={form.testSetId}
              onChange={(e) => handleSelectTest(e.target.value)}
            >
              <option value="">
                {!form.topicId
                  ? "Önce konu seçiniz"
                  : loadingTests
                  ? "Yükleniyor..."
                  : "Test Seçiniz"}
              </option>

              {tests.map((t) => (
                <option key={t.id} value={t.id}>
                  Test {t.testNumber} – {t.questionCount} soru
                </option>
              ))}
            </select>
          </div>

          {/* Soru Sayısı */}
          <div className="mb-5">
            <label className="block font-medium">Soru Sayısı</label>
            <input
              className="w-full p-3 rounded-xl bg-gray-100 border"
              value={form.questionCount}
              readOnly
            />
          </div>

          {/* Doğru & Yanlış */}
          <div className="grid grid-cols-2 gap-6 mb-5">
            <div>
              <label className="block font-medium">Doğru</label>
              <input
                type="number"
                className="w-full p-3 rounded-xl border"
                value={form.correct}
                onChange={(e) =>
                  setForm({ ...form, correct: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block font-medium">Yanlış</label>
              <input
                type="number"
                className="w-full p-3 rounded-xl border"
                value={form.incorrect}
                onChange={(e) =>
                  setForm({ ...form, incorrect: e.target.value })
                }
              />
            </div>
          </div>

          {/* Süre */}
          <div className="mb-6">
            <label className="block font-medium">Süre (dk)</label>
            <input
              type="number"
              className="w-full p-3 rounded-xl border"
              value={form.duration}
              onChange={(e) =>
                setForm({ ...form, duration: e.target.value })
              }
            />
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl shadow">
            Kaydet
          </button>
        </form>
      </div>
    </div>
  );
}
