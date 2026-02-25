import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/axiosInstance";

type Student = { id: number; name: string };
type Topic = { id: number; name: string };
type StudyRecord = {
  studentId: number;
  topicId: number;
  questionCount: number;
  correct: number;
  incorrect: number;
  duration: number;
};

export default function StudyRecordEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [students, setStudents] = useState<Student[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [record, setRecord] = useState<StudyRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, tRes, rRes] = await Promise.all([
          api.get("/students"),
          api.get("/topics"),
          api.get(`/studyrecords/${id}`),
        ]);

        setStudents(sRes.data);
        setTopics(tRes.data);
        setRecord(rRes.data);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!record) return;

    await api.put(`/studyrecords/${id}`, record);

    alert("Kayıt güncellendi!");
    navigate("/admin/studyrecords");
  };

  if (loading || !record) return <div className="p-8 text-xl">Yükleniyor...</div>;

  return (
    <div className="p-8 flex justify-center">
      <div className="w-full max-w-2xl">

        <Link to="/admin/studyrecords" className="text-blue-600 underline">
          ← Kayıtlara Dön
        </Link>

        <h1 className="text-3xl font-bold my-6">Çalışma Kaydı Düzenle</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white/40 backdrop-blur-xl p-8 rounded-2xl shadow-xl border"
        >
          {/* Student */}
          <label className="block font-medium mb-1">Öğrenci</label>
          <select
            className="w-full p-3 rounded-xl border mb-5"
            value={record.studentId}
            onChange={(e) =>
              setRecord({ ...record, studentId: Number(e.target.value) })
            }
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Topic */}
          <label className="block font-medium mb-1">Konu</label>
          <select
            className="w-full p-3 rounded-xl border mb-5"
            value={record.topicId}
            onChange={(e) =>
              setRecord({ ...record, topicId: Number(e.target.value) })
            }
          >
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          {/* Numbers */}
          <label className="block font-medium mb-1">Soru Sayısı</label>
          <input
            type="number"
            className="w-full p-3 rounded-xl border mb-5"
            value={record.questionCount}
            onChange={(e) =>
              setRecord({ ...record, questionCount: Number(e.target.value) })
            }
          />

          <div className="grid grid-cols-2 gap-6 mb-5">
            <div>
              <label className="block font-medium mb-1">Doğru</label>
              <input
                type="number"
                className="w-full p-3 rounded-xl border"
                value={record.correct}
                onChange={(e) =>
                  setRecord({ ...record, correct: Number(e.target.value) })
                }
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Yanlış</label>
              <input
                type="number"
                className="w-full p-3 rounded-xl border"
                value={record.incorrect}
                onChange={(e) =>
                  setRecord({ ...record, incorrect: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <label className="block font-medium mb-1">Süre (dk)</label>
          <input
            type="number"
            className="w-full p-3 rounded-xl border mb-6"
            value={record.duration}
            onChange={(e) =>
              setRecord({ ...record, duration: Number(e.target.value) })
            }
          />

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl">
            Kaydet
          </button>
        </form>
      </div>
    </div>
  );
}
