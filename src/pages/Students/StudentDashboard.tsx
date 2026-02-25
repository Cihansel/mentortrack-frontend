export default function StudentDashboard() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-2">
        Hoş geldin! 👋
      </h2>
      <p className="text-gray-600 mb-4">
        Burası senin öğrenci panelin. Buradan:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>Günlük çalışma kayıtlarını görebileceksin</li>
        <li>Test sonuçlarını ve analizlerini inceleyebileceksin</li>
        <li>Ders ve konu planını takip edebileceksin</li>
      </ul>
    </div>
  );
}
