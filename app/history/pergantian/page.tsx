import { pergantianKomponen } from "@/lib/data";
import PageHeader from "@/components/PageHeader";

export default function PergantianPage() {
  const totalBiaya = pergantianKomponen
    .map((p) => parseInt(p.biaya.replace(/[^0-9]/g, "")))
    .reduce((a, b) => a + b, 0);

  return (
    <div className="p-6">
      <PageHeader title="History Pergantian Komponen" subtitle="Riwayat penggantian dan pembaruan komponen tower" />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{pergantianKomponen.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Total Pergantian</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{new Set(pergantianKomponen.map((p) => p.towerId)).size}</p>
          <p className="text-xs text-slate-500 mt-0.5">Tower Terlibat</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-xl font-bold text-slate-900">Rp {totalBiaya.toLocaleString("id-ID")}</p>
          <p className="text-xs text-slate-500 mt-0.5">Estimasi Total Biaya</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <p className="text-sm font-semibold text-slate-800 mb-4">Riwayat Pergantian</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">ID</th>
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">Tanggal</th>
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">Tower</th>
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">Komponen</th>
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">Alasan</th>
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">Petugas</th>
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">Biaya</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {pergantianKomponen.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 font-mono text-xs text-blue-600">{p.id}</td>
                <td className="py-3 text-xs text-slate-600">{p.tanggal}</td>
                <td className="py-3">
                  <span className="font-mono text-xs text-blue-600">{p.towerId}</span>
                  <p className="text-xs text-slate-500">{p.towerNama}</p>
                </td>
                <td className="py-3 font-medium text-slate-800">{p.komponen}</td>
                <td className="py-3 text-xs text-slate-600">{p.alasan}</td>
                <td className="py-3 text-xs text-slate-600">{p.petugas}</td>
                <td className="py-3 font-mono text-xs font-medium text-slate-800">{p.biaya}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
