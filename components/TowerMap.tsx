"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { towers, Tower, TowerStatus } from "@/lib/data";
import { cn } from "@/lib/utils";

const markerColor: Record<TowerStatus, string> = {
  normal: "#16a34a",
  waspada: "#d97706",
  gangguan: "#dc2626",
  maintenance: "#2563eb",
};

const statusLabel: Record<TowerStatus, string> = {
  normal: "Normal",
  waspada: "Waspada",
  gangguan: "Gangguan",
  maintenance: "Maintenance",
};

interface TowerMapProps {
  center?: [number, number];
  zoom?: number;
  filteredIds?: string[];
}

export default function TowerMap({
  center = [-6.2700, 106.5200],
  zoom = 11,
  filteredIds,
}: TowerMapProps) {
  const display = filteredIds
    ? towers.filter((t) => filteredIds.includes(t.id))
    : towers;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ width: "100%", height: "100%", borderRadius: "12px" }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {display.map((tower) => (
        <CircleMarker
          key={tower.id}
          center={[tower.lat, tower.lng]}
          radius={9}
          pathOptions={{
            color: markerColor[tower.kondisi],
            fillColor: markerColor[tower.kondisi],
            fillOpacity: 0.9,
            weight: 2,
            className: tower.kondisi === "gangguan" ? "marker-gangguan" : "",
          }}
        >
          <Popup>
            <div className="text-sm min-w-[220px]">
              <p className="font-mono font-semibold text-blue-700 mb-0.5">{tower.id}</p>
              <p className="font-semibold text-slate-900 mb-2">{tower.nama}</p>
              <div className="space-y-1.5 text-slate-600">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">Status</span>
                  <span className="font-medium" style={{ color: markerColor[tower.kondisi] }}>
                    {statusLabel[tower.kondisi]}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">Tegangan</span>
                  <span>{tower.tegangan}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">Lokasi</span>
                  <span className="text-right">{tower.lokasi}</span>
                </div>
                <div className="pt-1.5 border-t border-slate-100">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Kepemilikan</p>
                  <div className="space-y-1">
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-400">Pemilik</span>
                      <span className="text-right">{tower.pemilik}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-400">Unit</span>
                      <span>{tower.unit}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-400">Jalur</span>
                      <span className="text-right text-xs">{tower.jalur}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-400">GI Asal</span>
                      <span>{tower.giAsal}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-400">GI Tujuan</span>
                      <span>{tower.giTujuan}</span>
                    </div>
                  </div>
                </div>
                <div className="pt-1.5 border-t border-slate-100">
                  <span className="text-slate-400 block text-xs mb-0.5">Koordinat Midspan</span>
                  <span className="font-mono text-xs text-slate-700">{tower.midspan}</span>
                </div>
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
