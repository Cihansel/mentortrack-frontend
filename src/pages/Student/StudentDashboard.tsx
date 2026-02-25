import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axiosInstance"; // sende farklıysa düzelt
import AssignedTests from "./AssignedTests";
import StudentRecords from "./StudentRecords";
import { Flame, Target, BookOpen } from "lucide-react";

// ✅ atama tipi (minimum alanlar)
type MyAssignment = {
  id: number;
  status: "ASSIGNED" | "STARTED" | "FINISHED";
  // backend response'una göre gerekirse genişletirsin
};

type Student = {
  id: number;
  name: string;
  grade: number;
};

export default function StudentDashboard() {
  const [student, setStudent] = useState<Student | null>(null);

  // ✅ yeni state'ler
  const [myAssignments, setMyAssignments] = useState<MyAssignment[]>([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(true);

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const res = await api.get("/students/me");
        setStudent(res.data);
      } catch (err) {
        console.error("Student load error:", err);
      }
    };
    loadStudent();
  }, []);

  // ✅ /assignments/my çek
  useEffect(() => {
    const loadMyAssignments = async () => {
      setAssignmentsLoading(true);
      try {
        const res = await api.get("/assignments/my");
        // backend {assignments:[...]} döndürüyorsa aşağıyı res.data.assignments yap
        const data = Array.isArray(res.data) ? res.data : res.data?.assignments;
        setMyAssignments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Assignments load error:", err);
        setMyAssignments([]);
      } finally {
        setAssignmentsLoading(false);
      }
    };
    loadMyAssignments();
  }, []);

  // ✅ sadece bitmemişleri “atanmış” sayalım (ASSIGNED + STARTED)
  const activeAssignmentsCount = useMemo(() => {
    return myAssignments.filter((a) => a.status !== "FINISHED").length;
  }, [myAssignments]);

  const assignedTestText = useMemo(() => {
    if (assignmentsLoading) return "Yükleniyor...";
    if (activeAssignmentsCount > 0) return `${activeAssignmentsCount} test atanmış 🚀`;
    return "Atanmış test yok 🎉";
  }, [assignmentsLoading, activeAssignmentsCount]);

  return (
    <div className="p-6 space-y-12 max-w-6xl mx-auto">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl">
        <div className="p-8 md:p-10 flex flex-col gap-4 relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold">
            👋 Merhaba {student?.name}
          </h1>

          <p className="text-blue-100 max-w-xl">
            Bugün hedeflerine bir adım daha yaklaşmaya hazır mısın?
            Küçük adımlar, büyük başarılar getirir 🚀
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MiniHeroCard
              icon={<BookOpen className="w-7 h-7 text-cyan-300 drop-shadow-sm" />}
              title="Atanmış Testler"
              value={assignedTestText}  // ✅ artık dinamik
            />
            <MiniHeroCard
              icon={<Target className="w-7 h-7 text-lime-300 drop-shadow-sm" />}
              title="Hedef"
              value="En iyisini yap"
            />
            <MiniHeroCard
              icon={<Flame className="w-7 h-7 text-orange-400 drop-shadow-sm" />}
              title="Motivasyon"
              value="Devam et!"
            />
          </div>
        </div>

        <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      </section>

      {/* BUGÜNKÜ HEDEF */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          🎯 Bugünkü Hedefin
        </h2>
        <AssignedTests />
      </section>

      {/* SON ÇALIŞMALAR */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          📈 Son Çalışmaların
        </h2>
        <StudentRecords />
      </section>
    </div>
  );
}

function MiniHeroCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl p-5 flex items-center gap-4 bg-white/10">
      <div className="flex items-center justify-center">{icon}</div>
      <div>
        <p className="text-white/80 text-sm">{title}</p>
        <p className="text-white font-semibold text-lg">{value}</p>
      </div>
    </div>
  );
}