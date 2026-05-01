"use client";

interface BarChartProps {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
}

export default function BarChart({ data, color = "#2563eb", height = 120 }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="w-full">
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((d) => (
          <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[11px] font-medium text-slate-700">{d.value}</span>
            <div
              className="w-full rounded-t transition-all"
              style={{
                height: `${Math.max((d.value / max) * (height - 24), 4)}px`,
                backgroundColor: color,
                opacity: 0.85,
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-1.5">
        {data.map((d) => (
          <div key={d.label} className="flex-1 text-center">
            <span className="text-[10px] text-slate-500 leading-tight block">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
