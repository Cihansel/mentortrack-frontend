import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../api/axiosInstance";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
  Cell,
} from "recharts";
import { ArrowLeft } from "lucide-react";

export default function StudentProfile() {
  const { id } = useParams();
  const studentId = Number(id);

  const [student, setStudent] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [weekly, setWeekly] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);

  const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#3b82f6"];

  const loadData = async () => {
    try {
      const sRes = await api.get(`/students/${studentId}`);
      const rRes = await api.get(`/studyrecords/byStudent/${studentId}`);

      setStudent(sRes.data);
      setRecords(rRes.data);

      buildWeekly(rRes.data);
      buildPie(rRes.data);
    } catch (err) {
      console.error("Profil yüklenemedi:", err);
    }
  };

  // Haftalık grafik verisi
  const buildWeekly = (data: any[]) => {
    const today = new Date();
    const arr = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);

      const day = d.toISOString().split("T")[0];

      const total = data
        .filter((r) => r.date.split("T")[0] === day)
        .reduce((sum, r) => sum + r.questionCount, 0);

      arr.push({
        day: day.substring(5),
        count: total,
      });
    }

    setWeekly(arr);
  };

  // Pie Chart
  const buildPie = (data: any[]) => {
    const map: any = {};

    data.forEach((r) => {
      const name = r.topic?.name || "Bilinmeyen";
      map[name] = (map[name] || 0) + r.questionCount;
    });

    setPieData(Object.keys(map).map((k) => ({ name: k, value: map[k] })));
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!student)
    return <div className="p-8 text-xl">Yükleniyor...</div>;

  return (
    <div className="p-8">

      <Link to="/admin/students" className="text-blue-600 flex items-center gap-2 mb-4">
        <ArrowLeft size={20} />
        Öğrenci Listesine Dön
      </Link>

      <h1 className="text-4xl font-bold mb-6">{student.name}</h1>

      <div className="bg-white shadow rounded-xl p-6 mb-8">
        <p><strong>Sınıf:</strong> {student.grade === 0 ? "Mezun" : student.grade}</p>
        <p><strong>Kayıt Tarihi:</strong> {student.createdAt.split("T")[0]}</p>
        <p><strong>Toplam Çalışma:</strong> {records.length}</p>
      </div>

      {/* Haftalık Çözülen Soru Grafiği */}
      <div className="bg-white shadow rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Haftalık Grafik</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weekly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="bg-white shadow rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">En Çok Çalışılan Konular</h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie dataKey="value" data={pieData} cx="50%" cy="50%" outerRadius={110}>
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Kayıt Tablosu */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-4">Çalışma Kayıtları</h2>

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
      </div>

    </div>
  );
}
