import { towers } from "@/lib/data";
import { statusColor, kerawananColor } from "@/lib/utils";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";

export default function AsetPage() {
  return (
    <div className="p-6">
      <PageHeader title="Data Aset Tower" subtitle="Inventaris lengkap aset tower transmisi beserta spesifikasi teknis" />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{towers.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Total Aset Tower</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-700">{towers.filter((t) => t.tegangan === "500 kV").length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Tower 500 kV</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-slate-700">{towers.filter((t) => t.tegangan === "150 kV").length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Tower 150 kV</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-slate-700">{Math.round(towers.reduce((acc, t) => acc + t.tahun, 0) / towers.length)}</p>
          <p className="text-xs text-slate-500 mt-0.5">Rata-rata Tahun Bangun</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 overflow-x-auto">
        <p className="text-sm font-semibold text-slate-800 mb-4">Inventaris Aset</p>
        <table className="w-full text-sm min-w-[1200px]">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">ID</th>
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">Nama Tower</th>
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">Pemilik</th>
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">Unit</th>
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">Jalur</th>
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">GI Asal</th>
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">GI Tujuan</th>
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">Lokasi</th>
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">Tegangan</th>
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">Tahun</th>
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">Status</th>
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">Kerawanan</th>
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">Petir</th>
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">Last Maint.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {towers.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 font-mono text-xs text-blue-600">{t.id}</td>
                <td className="py-3 font-medium text-slate-900">{t.nama}</td>
                <td className="py-3 text-xs text-slate-600">{t.pemilik}</td>
                <td className="py-3 text-xs text-slate-600">{t.unit}</td>
                <td className="py-3 text-xs text-slate-600">{t.jalur}</td>
                <td className="py-3 text-xs text-slate-600">{t.giAsal}</td>
                <td className="py-3 text-xs text-slate-600">{t.giTujuan}</td>
                <td className="py-3 text-xs text-slate-600">{t.lokasi}</td>
                <td className="py-3 font-mono text-xs font-medium text-slate-700">{t.tegangan}</td>
                <td className="py-3 font-mono text-xs text-slate-600">{t.tahun}</td>
                <td className="py-3"><StatusBadge label={t.kondisi} className={statusColor(t.kondisi)} blink={t.kondisi === "gangguan"} /></td>
                <td className="py-3"><StatusBadge label={t.kerawanan} className={kerawananColor(t.kerawanan)} /></td>
                <td className="py-3 font-mono text-xs text-slate-600">{t.petir}</td>
                <td className="py-3 text-xs text-slate-600">{t.lastMaint}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
