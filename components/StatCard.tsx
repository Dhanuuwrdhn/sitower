import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  variant?: "default" | "danger" | "warning" | "success";
}

export default function StatCard({ label, value, sub, icon, variant = "default" }: StatCardProps) {
  const variantStyles = {
    default: "border-slate-200 bg-white",
    danger: "border-red-200 bg-red-50",
    warning: "border-amber-200 bg-amber-50",
    success: "border-green-200 bg-green-50",
  };

  const iconStyles = {
    default: "text-blue-600 bg-blue-50",
    danger: "text-red-600 bg-red-100",
    warning: "text-amber-600 bg-amber-100",
    success: "text-green-600 bg-green-100",
  };

  return (
    <div className={cn("rounded-xl border p-4", variantStyles[variant])}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
        </div>
        <div className={cn("p-2.5 rounded-lg", iconStyles[variant])}>
          {icon}
        </div>
      </div>
    </div>
  );
}
