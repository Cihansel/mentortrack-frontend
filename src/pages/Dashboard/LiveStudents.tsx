import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

type LiveStudent = {
  id: number;
  name: string;
  status: string;
  lastActivityAt: string | null;
};

export default function LiveStudents() {
  const [students, setStudents] = useState<LiveStudent[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/admin/live-students");
      setStudents(res.data);
    };

    load();
    const interval = setInterval(load, 10000); // 🔄 10 sn
    return () => clearInterval(interval);
  }, []);

  const isOnline = (date: string | null) => {
    if (!date) return false;
    const diff =
      Date.now() - new Date(date).getTime();
    return diff < 2 * 60 * 1000; // 2 dk
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        🟢 Canlı Öğrenci Takibi
      </h1>

      <table className="w-full bg-white rounded-xl shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Öğrenci</th>
            <th>Durum</th>
            <th>Online</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id} className="border-t">
              <td className="p-3">{s.name}</td>
              <td className="text-center">{s.status}</td>
              <td className="text-center">
                {isOnline(s.lastActivityAt) ? "🟢" : "⚪"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
