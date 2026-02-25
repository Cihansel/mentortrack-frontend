import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import {
  Play,
  Clock,
  ArrowRightCircle,
} from "lucide-react";

/* ================= TYPES ================= */

type Topic = {
  id: number;
  name: string;
};

type Source = {
  id: number;
  name: string;
};

type TestSet = {
  id: number;
  testNumber: number;
  questionCount: number;
  topic: Topic;
  source: Source;
};

type Assignment = {
  id: number;
  status: "ASSIGNED" | "STARTED" | "FINISHED";
  assignedAt: string;
  startedAt?: string;
  finishedAt?: string;
  testSet: TestSet;
};

export default function AssignedTests() {
  const [tests, setTests] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/assignments/my");
        setTests(res.data ?? []);
      } catch (err) {
        console.error("Assigned tests load error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const startTest = async (assignmentId: number) => {
    try {
      await api.patch(`/assignments/${assignmentId}/start`);
      navigate(`/student/test/${assignmentId}`);
    } catch {
      alert("Test başlatılamadı");
    }
  };

  const continueTest = (assignmentId: number) => {
    navigate(`/student/test/${assignmentId}`);
  };

  if (loading) {
    return <div className="p-6 text-center">Yükleniyor...</div>;
  }

  /* 🎯 SADECE AKTİF TESTLER + SIRALAMA */
  const activeTests = tests
    .filter((t) => t.status !== "FINISHED")
    .sort((a, b) => {
      if (a.status === "STARTED" && b.status !== "STARTED") return -1;
      if (a.status !== "STARTED" && b.status === "STARTED") return 1;
      return 0;
    });

  if (activeTests.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border text-gray-500 text-center">
        🎉 Harika!
        <br />
        Bugün için çözmen gereken test kalmadı.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {activeTests.map((a) => {
        const isStarted = a.status === "STARTED";

        return (
          <div
            key={a.id}
            className={`rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition
              ${
                isStarted
                  ? "bg-orange-50 border border-orange-200 shadow"
                  : "bg-white shadow"
              }
            `}
          >
            {/* SOL */}
            <div>
              <h2 className="font-semibold text-lg">
                {a.testSet.topic.name}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {a.testSet.source.name} · Test #{a.testSet.testNumber}
              </p>

              <p className="text-sm text-gray-500">
                {a.testSet.questionCount} soru
              </p>
            </div>

            {/* SAĞ */}
            <div className="flex items-center gap-3">
              {isStarted && (
                <>
                  <StatusBadge
                    icon={<Clock size={18} />}
                    text="Devam Ediyor"
                  />
                  <ActionButton
                    onClick={() => continueTest(a.id)}
                    icon={<ArrowRightCircle size={18} />}
                    text="Devam Et"
                    color="orange"
                  />
                </>
              )}

              {a.status === "ASSIGNED" && (
                <ActionButton
                  onClick={() => startTest(a.id)}
                  icon={<Play size={18} />}
                  text="Teste Başla"
                  color="blue"
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatusBadge({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <span className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium bg-orange-100 text-orange-700">
      {icon}
      {text}
    </span>
  );
}

function ActionButton({
  onClick,
  icon,
  text,
  color,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  text: string;
  color: "blue" | "orange";
}) {
  const colors = {
    blue: "bg-blue-600 hover:bg-blue-700",
    orange: "bg-orange-500 hover:bg-orange-600",
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white transition ${colors[color]}`}
    >
      {icon}
      {text}
    </button>
  );
}
