"use client";

import { useState } from "react";
import { towers } from "@/lib/data";
import { kerawananColor, statusColor } from "@/lib/utils";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { Filter } from "lucide-react";

type Level = "semua" | "rendah" | "sedang" | "tinggi";

export default function KerawananPage() {
  const [filter, setFilter] = useState<Level>("semua");

  const filtered = filter === "semua" ? towers : towers.filter((t) => t.kerawanan === filter);

  const counts = {
    rendah: towers.filter((t) => t.kerawanan === "rendah").length,
    sedang: towers.filter((t) => t.kerawanan === "sedang").length,
    tinggi: towers.filter((t) => t.kerawanan === "tinggi").length,
  };

  return (
    <div className="p-6">
      <PageHeader title="Kerawanan Sosial" subtitle="Level risiko dan kondisi sosial di sekitar tower transmisi" />

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{counts.rendah}</p>
          <p className="text-xs text-green-600 mt-0.5 font-medium">Kerawanan Rendah</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-700">{counts.sedang}</p>
          <p className="text-xs text-amber-600 mt-0.5 font-medium">Kerawanan Sedang</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-700">{counts.tinggi}</p>
          <p className="text-xs text-red-600 mt-0.5 font-medium">Kerawanan Tinggi</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-slate-800">Data Kerawanan Tower</p>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <div className="flex gap-1">
              {(["semua", "rendah", "sedang", "tinggi"] as Level[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setFilter(l)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                    filter === l
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">ID</th>
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">Nama Tower</th>
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">Lokasi</th>
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">Tegangan</th>
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">Status</th>
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">Kerawanan</th>
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">Petir</th>
              <th className="text-left py-2.5 text-xs font-medium text-slate-500 uppercase">Koordinat Midspan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 font-mono text-xs text-blue-600">{t.id}</td>
                <td className="py-3 font-medium text-slate-900">{t.nama}</td>
                <td className="py-3 text-slate-600 text-xs">{t.lokasi}</td>
                <td className="py-3 font-mono text-xs text-slate-600">{t.tegangan}</td>
                <td className="py-3"><StatusBadge label={t.kondisi} className={statusColor(t.kondisi)} blink={t.kondisi === "gangguan"} /></td>
                <td className="py-3"><StatusBadge label={t.kerawanan} className={kerawananColor(t.kerawanan)} /></td>
                <td className="py-3 font-mono text-xs text-slate-600">{t.petir}</td>
                <td className="py-3 font-mono text-xs text-slate-500">{t.midspan}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-10 text-center text-sm text-slate-400">Tidak ada data untuk filter ini.</div>
        )}
      </div>
    </div>
  );
}
