import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  label: string;
  className?: string;
  blink?: boolean;
}

export default function StatusBadge({ label, className, blink }: StatusBadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium capitalize",
      blink && "badge-blink",
      className
    )}>
      {label}
    </span>
  );
}
