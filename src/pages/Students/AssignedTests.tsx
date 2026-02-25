import { useEffect, useState } from "react";
import { assignTest, getStudentAssignments } from "../../api/assignments";
import api from "../../api/axiosInstance";

interface Props {
  studentId: number;
}

export default function AssignedTests({ studentId }: Props) {
  const [testSets, setTestSets] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedTestSet, setSelectedTestSet] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTestSets();
    fetchAssignments();
  }, [studentId]);

  const fetchTestSets = async () => {
    const res = await api.get("/testsets");
    setTestSets(res.data);
  };

  const fetchAssignments = async () => {
    const res = await getStudentAssignments(studentId);
    setAssignments(res.data);
  };

  const handleAssign = async () => {
    if (!selectedTestSet) return;

    try {
      setLoading(true);
      await assignTest(studentId, selectedTestSet);
      setSelectedTestSet(null);
      fetchAssignments();
      alert("Test başarıyla atandı");
    } catch (err) {
      alert("Atama başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* TEST ATAMA */}
      <div className="border rounded p-4">
        <h3 className="font-semibold mb-2">Teste Ata</h3>

        <div className="flex gap-2">
          <select
            className="border p-2 rounded w-full"
            value={selectedTestSet ?? ""}
            onChange={(e) => setSelectedTestSet(Number(e.target.value))}
          >
            <option value="">Test Set Seç</option>
            {testSets.map((ts) => (
              <option key={ts.id} value={ts.id}>
                {ts.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleAssign}
            disabled={loading}
            className="bg-blue-600 text-white px-4 rounded"
          >
            Ata
          </button>
        </div>
      </div>

      {/* MEVCUT ATAMALAR */}
      <div className="border rounded p-4">
        <h3 className="font-semibold mb-2">Atanmış Testler</h3>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Test</th>
              <th>Status</th>
              <th>Atanma Tarihi</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a: any) => (
              <tr key={a.id} className="border-b">
                <td className="p-2">{a.testSet?.name}</td>
                <td>{a.status}</td>
                <td>{new Date(a.assignedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {assignments.length === 0 && (
          <p className="text-gray-500 mt-2">Henüz test atanmadı</p>
        )}
      </div>
    </div>
  );
}
