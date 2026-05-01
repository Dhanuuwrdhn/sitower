import { sertifikatStatusColor } from "@/lib/utils";
import { Sertifikat } from "@/lib/data";
import { FileCheck, FileX, FileWarning } from "lucide-react";
import StatusBadge from "./StatusBadge";

const statusIcon = {
  valid: FileCheck,
  expiring: FileWarning,
  expired: FileX,
};

const statusLabel = {
  valid: "Valid",
  expiring: "Hampir Expired",
  expired: "Expired",
};

export default function CertCard({ cert }: { cert: Sertifikat }) {
  const Icon = statusIcon[cert.status];
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-3 hover:border-blue-300 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className={`p-2 rounded-lg ${cert.status === "valid" ? "bg-green-50 text-green-600" : cert.status === "expiring" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"}`}>
          <Icon size={18} />
        </div>
        <StatusBadge
          label={statusLabel[cert.status]}
          className={sertifikatStatusColor(cert.status)}
        />
      </div>
      <div>
        <p className="font-mono text-xs text-blue-600 mb-0.5">{cert.id}</p>
        <p className="text-sm font-semibold text-slate-900">{cert.jenis}</p>
        <p className="text-xs text-slate-500 mt-0.5">{cert.towerNama}</p>
      </div>
      <div className="pt-2 border-t border-slate-100 space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Terbit</span>
          <span className="text-slate-700">{cert.tanggalTerbit}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Berlaku s/d</span>
          <span className={cert.status === "expired" ? "text-red-600 font-medium" : "text-slate-700"}>{cert.tanggalExpiry}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Penerbit</span>
          <span className="text-slate-700">{cert.penerbit}</span>
        </div>
      </div>
    </div>
  );
}
