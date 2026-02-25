import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../api/axiosInstance";

export default function TestSolve() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [blank, setBlank] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    const questionCount = correct + incorrect + blank;

    // 🛑 Basit validasyon
    if (questionCount <= 0) {
      alert("Lütfen en az 1 soru girin.");
      return;
    }

    if (duration <= 0) {
      alert("Lütfen süreyi girin.");
      return;
    }

    setLoading(true);

    try {
      await api.patch(`/assignments/${assignmentId}/finish`, {
        questionCount,
        correct,
        incorrect,
        duration,
      });

      alert("Test tamamlandı 🎉");
      navigate("/student/dashboard");
    } catch {
      alert("Test bitirilemedi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">📝 Test Sonuçlarını Gir</h1>

      <Input label="Doğru Sayısı" value={correct} setValue={setCorrect} />
      <Input label="Yanlış Sayısı" value={incorrect} setValue={setIncorrect} />
      <Input label="Boş Sayısı" value={blank} setValue={setBlank} />
      <Input label="Süre (dk)" value={duration} setValue={setDuration} />

      <button
        disabled={loading}
        onClick={handleFinish}
        className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold disabled:bg-green-400"
      >
        {loading ? "Kaydediliyor..." : "Testi Bitir"}
      </button>
    </div>
  );
}

function Input({ label, value, setValue }: any) {
  return (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full border p-2 rounded"
      />
    </div>
  );
}
