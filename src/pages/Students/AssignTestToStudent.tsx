import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

type Student = {
  id: number;
  name: string;
};


type TestSet = {
  id: number;
  testNumber: number;
  questionCount: number;
  topic: {
    name: string;
  };
  source: {
    name: string;
  };
};

export default function AssignTestToStudent() {
  const [students, setStudents] = useState<Student[]>([]);
  const [testSets, setTestSets] = useState<TestSet[]>([]);

  const [studentId, setStudentId] = useState("");
  const [testSetId, setTestSetId] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [studentsRes, testSetsRes] = await Promise.all([
        api.get("/students"),
        api.get("/testsets"),
      ]);

      setStudents(studentsRes.data);
      setTestSets(testSetsRes.data);
    };

    load();
  }, []);

  const assign = async () => {
    if (!studentId || !testSetId) {
      alert("Öğrenci ve test seçmelisin");
      return;
    }

    try {
      setLoading(true);

      await api.post("/assignments", {
        studentId: Number(studentId),
        testSetId: Number(testSetId),
      });

      alert("Test öğrenciye atandı 🎉");
      setStudentId("");
      setTestSetId("");
    } catch (err: any) {
      alert(err?.response?.data?.error || "Atama başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">🎯 Öğrenciye Test Ata</h1>

      {/* STUDENT */}
      <div>
        <label className="block text-sm font-medium mb-1">Öğrenci</label>
        <select
          className="w-full border p-2 rounded"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        >
          <option value="">Seçiniz</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* TEST SET */}
      <div>
        <label className="block text-sm font-medium mb-1">Test Seti</label>
        <select
          className="w-full border p-2 rounded"
          value={testSetId}
          onChange={(e) => setTestSetId(e.target.value)}
        >
          <option value="">Seçiniz</option>
          {testSets.map((t) => (
            <option key={t.id} value={t.id}>
              {t.topic.name} · {t.source.name} · Test #{t.testNumber} (
              {t.questionCount} soru)
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={assign}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Atanıyor..." : "Testi Ata"}
      </button>
    </div>
  );
}
