import { towers, petirPerZona, gangguanHistory } from "@/lib/data";
import { Radio, AlertTriangle, Zap, Wrench, CheckCircle } from "lucide-react";
import StatCard from "@/components/StatCard";
import AlertBanner from "@/components/AlertBanner";
import ActivityTimeline from "@/components/ActivityTimeline";
import BarChart from "@/components/BarChart";
import PageHeader from "@/components/PageHeader";
import TowerMapDynamic from "@/components/TowerMapDynamic";
import StatusBadge from "@/components/StatusBadge";
import { statusColor, kerawananColor } from "@/lib/utils";

export default function DashboardPage() {
  const total = towers.length;
  const normal = towers.filter((t) => t.kondisi === "normal").length;
  const gangguan = towers.filter((t) => t.kondisi === "gangguan").length;
  const waspada = towers.filter((t) => t.kondisi === "waspada").length;
  const maintenance = towers.filter((t) => t.kondisi === "maintenance").length;

  const activeGangguan = gangguanHistory.filter((g) => g.status === "ongoing")[0];

  const topKerawanan = [...towers]
    .sort((a, b) => {
      const rank = { tinggi: 3, sedang: 2, rendah: 1 };
      return rank[b.kerawanan] - rank[a.kerawanan];
    })
    .slice(0, 5);

  const barData = petirPerZona.map((z) => ({ label: z.zona.replace("Zona ", ""), value: z.count }));

  return (
    <div className="p-6">
      <PageHeader title="Dashboard" subtitle="Rekap kondisi tower transmisi — 1 Mei 2025" />

      {activeGangguan && (
        <AlertBanner
          message={`Gangguan aktif: ${activeGangguan.jenis} di ${activeGangguan.towerNama}`}
          tower={activeGangguan.towerId}
        />
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Tower" value={total} sub="Seluruh zona" icon={<Radio size={18} />} />
        <StatCard label="Gangguan Aktif" value={gangguan} sub="Perlu penanganan" icon={<AlertTriangle size={18} />} variant="danger" />
        <StatCard label="Waspada" value={waspada} sub="Pemantauan intensif" icon={<Zap size={18} />} variant="warning" />
        <StatCard label="Maintenance" value={maintenance} sub="Dalam perbaikan" icon={<Wrench size={18} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Peta mini */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-slate-800 mb-3">Peta Sebaran Tower</p>
          <div style={{ height: 300 }}>
            <TowerMapDynamic />
          </div>
        </div>

        {/* Activity timeline */}
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-slate-800 mb-3">Aktivitas Terkini</p>
          <ActivityTimeline />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Bar chart petir */}
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-slate-800 mb-4">Sambaran Petir per Zona</p>
          <BarChart data={barData} />
        </div>

        {/* Tabel kerawanan */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-slate-800 mb-3">Top Kerawanan Tower</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-2 text-xs font-medium text-slate-500">ID</th>
                <th className="text-left py-2 text-xs font-medium text-slate-500">Nama</th>
                <th className="text-left py-2 text-xs font-medium text-slate-500">Status</th>
                <th className="text-left py-2 text-xs font-medium text-slate-500">Kerawanan</th>
                <th className="text-left py-2 text-xs font-medium text-slate-500">Petir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {topKerawanan.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="py-2.5 font-mono text-xs text-blue-600">{t.id}</td>
                  <td className="py-2.5 text-slate-800 font-medium">{t.nama}</td>
                  <td className="py-2.5">
                    <StatusBadge label={t.kondisi} className={statusColor(t.kondisi)} blink={t.kondisi === "gangguan"} />
                  </td>
                  <td className="py-2.5">
                    <StatusBadge label={t.kerawanan} className={kerawananColor(t.kerawanan)} />
                  </td>
                  <td className="py-2.5 font-mono text-xs text-slate-600">{t.petir}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
