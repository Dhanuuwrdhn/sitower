import { recentActivity } from "@/lib/data";
import { Zap, ShieldAlert, Wrench, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const typeConfig = {
  gangguan: { icon: ShieldAlert, color: "text-red-600 bg-red-50 border-red-100" },
  petir: { icon: Zap, color: "text-amber-600 bg-amber-50 border-amber-100" },
  maintenance: { icon: Wrench, color: "text-blue-600 bg-blue-50 border-blue-100" },
  update: { icon: RefreshCw, color: "text-slate-500 bg-slate-50 border-slate-100" },
};

export default function ActivityTimeline() {
  return (
    <div className="space-y-3">
      {recentActivity.map((item, i) => {
        const { icon: Icon, color } = typeConfig[item.tipe];
        return (
          <div key={item.id} className="flex items-start gap-3">
            <div className={cn("mt-0.5 p-1.5 rounded-lg border shrink-0", color)}>
              <Icon size={13} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700">{item.deskripsi}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-[11px] text-blue-600">{item.tower}</span>
                <span className="text-[11px] text-slate-400">{item.waktu}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
