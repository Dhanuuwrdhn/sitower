import { gangguanHistory } from "@/lib/data";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { cn } from "@/lib/utils";

const gangguanStatusColor = {
  resolved: "text-green-700 bg-green-50 border-green-200",
  ongoing: "text-red-700 bg-red-50 border-red-200",
  investigating: "text-amber-700 bg-amber-50 border-amber-200",
};

const gangguanStatusLabel = {
  resolved: "Selesai",
  ongoing: "Berlangsung",
  investigating: "Investigasi",
};

export default function GangguanPage() {
  const active = gangguanHistory.filter((g) => g.status === "ongoing" || g.status === "investigating").length;

  return (
    <div className="p-6">
      <PageHeader title="History Gangguan" subtitle="Riwayat gangguan dan insiden operasional tower transmisi" />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{gangguanHistory.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Total Insiden</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-700">{active}</p>
          <p className="text-xs text-red-600 mt-0.5">Masih Aktif</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{gangguanHistory.filter((g) => g.status === "resolved").length}</p>
          <p className="text-xs text-green-600 mt-0.5">Terselesaikan</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <p className="text-sm font-semibold text-slate-800 mb-4">Riwayat Gangguan</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">ID</th>
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">Tanggal</th>
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">Tower</th>
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">Jenis Gangguan</th>
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">Durasi</th>
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">Petugas</th>
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {gangguanHistory.map((g) => (
              <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 font-mono text-xs text-blue-600">{g.id}</td>
                <td className="py-3 text-xs text-slate-600">{g.tanggal}</td>
                <td className="py-3">
                  <span className="font-mono text-xs text-blue-600">{g.towerId}</span>
                  <p className="text-xs text-slate-500">{g.towerNama}</p>
                </td>
                <td className="py-3 font-medium text-slate-800">{g.jenis}</td>
                <td className="py-3 font-mono text-xs text-slate-600">{g.durasi}</td>
                <td className="py-3 text-xs text-slate-600">{g.petugas}</td>
                <td className="py-3">
                  <StatusBadge
                    label={gangguanStatusLabel[g.status]}
                    className={gangguanStatusColor[g.status]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
