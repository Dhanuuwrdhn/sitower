import { petirHistory, petirPerZona } from "@/lib/data";
import { intensitasColor } from "@/lib/utils";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import BarChart from "@/components/BarChart";

const intensitasLabel = { aman: "Aman", sedang: "Sedang", kritis: "Kritis" };

export default function PetirPage() {
  const barData = petirPerZona.map((z) => ({ label: z.zona.replace("Zona ", ""), value: z.count }));
  const totalKA = petirHistory.map((p) => parseInt(p.amplitudo)).reduce((a, b) => a + b, 0);

  return (
    <div className="p-6">
      <PageHeader title="History Petir" subtitle="Riwayat sambaran petir dan data amplitudo pada tower transmisi" />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{petirHistory.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Total Sambaran</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-700">{petirHistory.filter((p) => p.intensitas === "kritis").length}</p>
          <p className="text-xs text-amber-600 mt-0.5">Intensitas Kritis</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-700">{totalKA}</p>
          <p className="text-xs text-blue-600 mt-0.5">Total Amplitudo (kA)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-slate-800 mb-4">Sambaran per Zona</p>
          <BarChart data={barData} color="#d97706" />
        </div>

        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-slate-800 mb-4">Riwayat Sambaran Petir</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">ID</th>
                <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">Tanggal</th>
                <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">Tower</th>
                <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">Zona</th>
                <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">Amplitudo</th>
                <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">Intensitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {petirHistory.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 font-mono text-xs text-blue-600">{p.id}</td>
                  <td className="py-2.5 text-xs text-slate-600">{p.tanggal}</td>
                  <td className="py-2.5">
                    <span className="font-mono text-xs text-blue-600">{p.towerId}</span>
                    <p className="text-xs text-slate-500">{p.towerNama}</p>
                  </td>
                  <td className="py-2.5 text-xs text-slate-600">{p.zona}</td>
                  <td className="py-2.5 font-mono text-xs font-medium text-slate-800">{p.amplitudo}</td>
                  <td className="py-2.5">
                    <StatusBadge label={intensitasLabel[p.intensitas]} className={intensitasColor(p.intensitas)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
