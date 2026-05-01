import PageHeader from "@/components/PageHeader";
import TowerMapDynamic from "@/components/TowerMapDynamic";
import { towers } from "@/lib/data";
import { statusColor } from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";

const legendItems = [
  { color: "#16a34a", label: "Normal" },
  { color: "#d97706", label: "Waspada" },
  { color: "#dc2626", label: "Gangguan" },
  { color: "#2563eb", label: "Maintenance" },
];

export default function PetaPage() {
  return (
    <div className="p-6 flex flex-col h-full">
      <PageHeader title="Peta Tower" subtitle="Sebaran tower transmisi — klik marker untuk detail" />

      <div className="flex gap-5 flex-1 min-h-0">
        {/* Map */}
        <div className="flex-1 bg-white border border-slate-200 rounded-xl overflow-hidden" style={{ minHeight: 500 }}>
          <TowerMapDynamic zoom={11} />
        </div>

        {/* Side panel */}
        <div className="w-64 shrink-0 space-y-4">
          {/* Legend */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">Legenda</p>
            <div className="space-y-2">
              {legendItems.map((l) => (
                <div key={l.label} className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: l.color }} />
                  <span className="text-sm text-slate-700">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tower list */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">Daftar Tower</p>
            <div className="space-y-3">
              {towers.map((t) => (
                <div key={t.id} className="border-b border-slate-50 pb-2.5 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-blue-600">{t.id}</p>
                      <p className="text-xs font-medium text-slate-700 truncate">{t.nama}</p>
                    </div>
                    <StatusBadge label={t.kondisi} className={statusColor(t.kondisi)} blink={t.kondisi === "gangguan"} />
                  </div>
                  <p className="text-[10px] text-slate-400">{t.unit}</p>
                  <p className="text-[10px] text-slate-400 truncate">{t.jalur}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
