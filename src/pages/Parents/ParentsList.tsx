import { useEffect, useMemo, useState } from "react";
import api from "../../api/axiosInstance";

type Parent = {
  id: number;
  email: string;
  createdAt?: string;
};

export default function ParentsList() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [customPassword, setCustomPassword] = useState(""); // opsiyonel
  const [creating, setCreating] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [createdEmail, setCreatedEmail] = useState<string | null>(null);

  const loadParents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Parent[]>("/admin/parents");
      setParents(res.data ?? []);
    } catch (err: any) {
      console.error("Parents load error:", err);
      setError(err?.response?.data?.error || "Veliler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParents();
  }, []);

  const canCreate = useMemo(() => {
    return email.trim().length > 4 && email.includes("@");
  }, [email]);

  const handleCreate = async () => {
    if (!canCreate) return;

    setCreating(true);
    setError(null);
    setSuccess(null);
    setTempPassword(null);
    setCreatedEmail(null);

    try {
      const payload: any = { email: email.trim() };
      if (customPassword.trim()) payload.password = customPassword.trim();

      const res = await api.post("/admin/parents", payload);

      // backend: { parent, tempPassword }
      setTempPassword(res.data?.tempPassword || null);
      setCreatedEmail(res.data?.parent?.email || email.trim());

      setSuccess("Veli oluşturuldu.");
      setEmail("");
      setCustomPassword("");

      await loadParents();
    } catch (err: any) {
      console.error("Create parent error:", err);
      setError(err?.response?.data?.error || "Veli oluşturulamadı.");
    } finally {
      setCreating(false);
    }
  };

  const copyPassword = async () => {
    if (!tempPassword) return;
    try {
      await navigator.clipboard.writeText(tempPassword);
      setSuccess("Şifre kopyalandı ✅");
    } catch {
      setSuccess("Kopyalama başarısız. Manuel kopyalayın.");
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Veliler</h1>
        <p className="text-gray-600">
          Veli hesabı oluştur, şifreyi ver, sonra öğrencilerle bağla.
        </p>
      </div>

      {/* Create Card */}
      <div className="bg-white/60 rounded-2xl shadow border p-6 backdrop-blur-xl">
        <h2 className="text-xl font-semibold mb-4">Yeni Veli Oluştur</h2>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
            {success}
          </div>
        )}

        {/* Temp password display */}
        {tempPassword && (
          <div className="mb-4 p-4 rounded-2xl border bg-white">
            <p className="text-sm text-gray-600 mb-1">
              Oluşturulan veli: <span className="font-semibold">{createdEmail}</span>
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1">
                <p className="text-xs text-gray-500">Geçici Şifre</p>
                <p className="text-lg font-bold tracking-wider">{tempPassword}</p>
              </div>
              <button
                onClick={copyPassword}
                className="px-4 py-2 rounded-xl border hover:bg-gray-50 transition"
              >
                Kopyala
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Not: İlk girişte şifre değiştirilmesi önerilir.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">Veli Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border rounded-xl px-3 py-2 bg-white"
              placeholder="veli@email.com"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Şifre (opsiyonel)
            </label>
            <input
              value={customPassword}
              onChange={(e) => setCustomPassword(e.target.value)}
              className="mt-1 w-full border rounded-xl px-3 py-2 bg-white"
              placeholder="Boş bırak → otomatik"
            />
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={handleCreate}
            disabled={!canCreate || creating}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
          >
            {creating ? "Oluşturuluyor..." : "Veli Oluştur"}
          </button>
        </div>
      </div>

      {/* List Card */}
      <div className="bg-white/60 rounded-2xl shadow border p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Veli Listesi</h2>
          <button
            onClick={loadParents}
            className="px-4 py-2 rounded-xl border hover:bg-gray-50 transition"
          >
            Yenile
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Yükleniyor...</p>
        ) : parents.length === 0 ? (
          <p className="text-gray-500">Henüz veli yok.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Oluşturulma</th>
              </tr>
            </thead>
            <tbody>
              {parents.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="p-2 font-medium">{p.email}</td>
                  <td className="p-2 text-gray-600">
                    {p.createdAt ? String(p.createdAt).split("T")[0] : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}