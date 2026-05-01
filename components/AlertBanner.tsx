import { AlertTriangle, X } from "lucide-react";

interface AlertBannerProps {
  message: string;
  tower: string;
}

export default function AlertBanner({ message, tower }: AlertBannerProps) {
  return (
    <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
      <AlertTriangle size={18} className="text-red-600 shrink-0" />
      <div className="flex-1 min-w-0">
        <span className="text-sm font-semibold text-red-800">[AKTIF] </span>
        <span className="text-sm text-red-700">{message}</span>
        <span className="text-xs font-mono text-red-500 ml-2">{tower}</span>
      </div>
    </div>
  );
}
