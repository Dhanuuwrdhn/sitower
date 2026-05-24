'use client'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import {
  MapContainer, TileLayer, Marker, Popup,
  Polyline, CircleMarker, useMapEvents,
} from 'react-leaflet'
import { useMemo, useState } from 'react'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import {
  garduInduk, towerSUTET, towerSUTT, towerSKTT,
  jalurTransmisi, JALUR_COLORS,
} from '@/lib/geodata'

// ─── Detect jalur type dari nama (geodata.ts auto-gen semua sebagai "other") ──
function detectJalurType(jalur: { name: string; type: string }) {
  const n = jalur.name.toUpperCase()
  if (n.includes('SUTET') || n.includes('500KV') || n.includes('JAWA7') || n.includes('GANDUL')) {
    return 'SUTET_500kV' as const
  }
  if (n.includes('SKTT') || n.includes('JOINT SKTT') || n.includes('SPAN SKTT')) {
    return 'SKTT_150kV' as const
  }
  if (n.includes('SUTT') || n.includes('150KV') || n.includes('150 KV') ||
      ['MUARAKARANG','DURIKOSAMBI','KEMBANGAN','JATAKE','LONTAR','CENGKARENG',
       'GROGOL','PANTAI INDAH KAPUK','DADAP','TANGERANG','KEBON JERUK',
       'PETUKANGAN','NEW SENAYAN','ANGKE','GAJAH TUNGGAL','PASAR KEMIS'].some(k => n.includes(k))) {
    return 'SUTT_150kV' as const
  }
  return 'other' as const
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface KerawananItem {
  kategori: string
  level: 'kritis' | 'sedang' | 'aman'
  status: string
}

interface FeaturedTower {
  id: string
  nama: string
  lat: number
  lng: number
  tipe: 'gardu' | 'SUTET' | 'SUTT' | 'SKTT'
  tegangan?: string
  kerawanan: KerawananItem[]
  updatedAt?: string
}

interface Props {
  towers?: FeaturedTower[]
  onTowerClick?: (tower: FeaturedTower) => void
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LEVEL_PRIORITY: Record<string, number> = { kritis: 3, sedang: 2, aman: 1 }
const RING_COLOR: Record<string, string> = {
  kritis: '#ef4444',
  sedang: '#d97706',
  aman: '#16a34a',
}

const KATEGORI_LABEL: Record<string, string> = {
  pekerjaan_pihak_lain: 'Pekerjaan Pihak Lain',
  kebakaran: 'Kebakaran',
  layangan: 'Layangan',
  pencurian: 'Pencurian',
  pemanfaatan_lahan: 'Pemanfaatan Lahan',
}

// Mirror Dashboard / TowerMapGoogle KATEGORI_EMOJI for consistency.
const KATEGORI_EMOJI: Record<string, string> = {
  pekerjaan_pihak_lain: '🚧',
  kebakaran: '🔥',
  layangan: '🪁',
  pencurian: '☠️',
  pemanfaatan_lahan: '🏡',
}

// Mock seed data – replaced by props when API data is available
const MOCK_TOWERS: FeaturedTower[] = [
  {
    id: 'ST-003', nama: 'TOWER SUTET BLRJA-JAWA7 500kV #001',
    lat: -6.1823, lng: 106.5102, tipe: 'SUTET', tegangan: '500 kV',
    kerawanan: [
      { kategori: 'pekerjaan_pihak_lain', level: 'kritis', status: 'berlangsung' },
      { kategori: 'pencurian',            level: 'kritis', status: 'eskalasi' },
      { kategori: 'gangguan',             level: 'kritis', status: 'berlangsung' },
    ],
    updatedAt: '2025-05-01T09:00:00',
  },
  {
    id: 'ST-002', nama: 'TOWER SUTET KMBGN-DKSBI 500kV #P3',
    lat: -6.1908, lng: 106.7311, tipe: 'SUTET', tegangan: '500 kV',
    kerawanan: [
      { kategori: 'kebakaran', level: 'kritis', status: 'berlangsung' },
      { kategori: 'gangguan',  level: 'sedang', status: 'selesai' },
    ],
    updatedAt: '2025-05-01T14:30:00',
  },
  {
    id: 'TT-002', nama: 'TOWER SUTT 150kV DKSBI-KMBNG #001',
    lat: -6.1721, lng: 106.7268, tipe: 'SUTT', tegangan: '150 kV',
    kerawanan: [
      { kategori: 'pekerjaan_pihak_lain', level: 'sedang', status: 'ditangani' },
      { kategori: 'pencurian',            level: 'sedang', status: 'pemantauan' },
    ],
    updatedAt: '2025-04-28T10:00:00',
  },
  {
    id: 'TT-001', nama: 'TOWER SUTT 150kV LNTAR-TLKGA #EA1',
    lat: -6.0605, lng: 106.464, tipe: 'SUTT', tegangan: '150 kV',
    kerawanan: [{ kategori: 'layangan', level: 'sedang', status: 'ditangani' }],
    updatedAt: '2025-04-30T16:00:00',
  },
  {
    id: 'TT-003', nama: 'TOWER SUTT 150kV GMKRU-PINKA #EA1A',
    lat: -6.1123, lng: 106.7789, tipe: 'SUTT', tegangan: '150 kV',
    kerawanan: [{ kategori: 'cleanup', level: 'aman', status: 'selesai' }],
    updatedAt: '2025-04-20T09:00:00',
  },
  {
    id: 'GI-004', nama: 'GI Durikosambi',
    lat: -6.17097, lng: 106.72594, tipe: 'gardu', tegangan: '150 kV',
    kerawanan: [{ kategori: 'pemanfaatan', level: 'aman', status: 'pemantauan' }],
    updatedAt: '2025-04-24T10:00:00',
  },
  {
    id: 'SK-001', nama: 'SKTT METLAND - KEMBANGAN #1',
    lat: -6.1885, lng: 106.7402, tipe: 'SKTT', tegangan: '150 kV',
    kerawanan: [{ kategori: 'pemanfaatan_lahan', level: 'sedang', status: 'menunggu' }],
    updatedAt: '2025-04-22T09:00:00',
  },
]

// ─── Icon creators ────────────────────────────────────────────────────────────

function topLevel(kerawanan: KerawananItem[]) {
  return kerawanan.reduce((best, k) =>
    LEVEL_PRIORITY[k.level] > LEVEL_PRIORITY[best] ? k.level : best,
    'aman' as string,
  )
}

function createGarduIcon(hasKerawanan: boolean, level: string, count: number): L.DivIcon {
  const bgColor = hasKerawanan ? (RING_COLOR[level] ?? '#ef4444') : '#076c9e'
  const badge = hasKerawanan
    ? `<div style="position:absolute;top:-5px;right:-5px;background:#d92d20;color:white;border-radius:50%;width:18px;height:18px;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;border:2px solid white;">${count}</div>`
    : ''

  // Antenna / gardu icon sesuai Figma
  return L.divIcon({
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -24],
    html: `<div style="width:40px;height:40px;background:${bgColor};border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px ${bgColor}66;position:relative;border:2px solid rgba(255,255,255,0.3);">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round">
        <line x1="12" y1="12" x2="12" y2="22"/>
        <path d="M8.5 15 Q12 7 15.5 15" fill="none"/>
        <path d="M5.5 18 Q12 3 18.5 18" fill="none" stroke-opacity="0.6"/>
        <circle cx="12" cy="22" r="1.5" fill="white"/>
      </svg>
      ${badge}
    </div>`,
  })
}

function createTowerIcon(
  _tipe: string,
  hasKerawanan: boolean,
  level: string,
  count: number,
): L.DivIcon {
  const ring = hasKerawanan ? RING_COLOR[level] ?? '#ef4444' : '#1a1a1a'
  const pulse = hasKerawanan && level === 'kritis'
    ? 'animation:pulse-ring 2s infinite;'
    : ''
  const badge = hasKerawanan
    ? `<div style="position:absolute;top:-5px;right:-5px;background:white;color:${ring};border:2px solid ${ring};border-radius:50%;width:18px;height:18px;font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;">${count}</div>`
    : ''

  return L.divIcon({
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -22],
    html: `<div style="width:36px;height:36px;background:${ring};border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.4);position:relative;${pulse}">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round">
        <path d="M12 2L8 22M12 2L16 22M8 8h8M9 14h6"/>
        <path d="M7 22h10"/>
      </svg>
      ${badge}
    </div>`,
  })
}

function createBgGarduIcon(): L.DivIcon {
  return L.divIcon({
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
    html: `<div style="width:32px;height:32px;background:#076c9e;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(7,108,158,0.4);border:2px solid rgba(255,255,255,0.25);">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round">
        <line x1="12" y1="12" x2="12" y2="22"/>
        <path d="M8.5 15 Q12 7 15.5 15" fill="none"/>
        <path d="M5.5 18 Q12 3 18.5 18" fill="none" stroke-opacity="0.5"/>
        <circle cx="12" cy="22" r="1.5" fill="white"/>
      </svg>
    </div>`,
  })
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso?: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ZoomTracker({ onZoom }: { onZoom: (z: number) => void }) {
  useMapEvents({ zoomend: (e) => onZoom(e.target.getZoom()) })
  return null
}

function TowerPopup({ tower }: { tower: FeaturedTower }) {
  return (
    <div style={{ minWidth: 220, fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderBottom: '1px solid #f1f5f9' }}>
        <span style={{ fontWeight: 700, fontSize: 13 }}>Informasi Tower</span>
        <span style={{ fontSize: 10, color: '#94a3b8', background: '#f8fafc', padding: '2px 8px', borderRadius: 20 }}>
          {tower.tegangan ?? tower.tipe}
        </span>
      </div>
      <div style={{ padding: '12px 14px' }}>
        <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{tower.nama}</p>
        <p style={{ color: '#94a3b8', fontSize: 11, marginBottom: 10 }}>
          {tower.lat.toFixed(6)}, {tower.lng.toFixed(6)}
        </p>

        {tower.kerawanan.length > 0 && (
          <>
            <p style={{ fontWeight: 600, fontSize: 12, marginBottom: 6 }}>Kerawanan Aktif</p>
            {tower.kerawanan.map((k, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 13 }}>{KATEGORI_EMOJI[k.kategori] ?? '•'}</span>
                <span style={{ fontSize: 12, flex: 1 }}>{KATEGORI_LABEL[k.kategori] ?? k.kategori}</span>
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: '1px 7px', borderRadius: 20,
                  background: k.level === 'kritis' ? '#fef2f2' : k.level === 'sedang' ? '#fffbeb' : '#f0fdf4',
                  color: k.level === 'kritis' ? '#ef4444' : k.level === 'sedang' ? '#d97706' : '#16a34a',
                }}>
                  {k.level}
                </span>
              </div>
            ))}
          </>
        )}

        <p style={{ color: '#94a3b8', fontSize: 11, marginTop: 10 }}>
          Diperbarui: {formatDate(tower.updatedAt)}
        </p>
      </div>
    </div>
  )
}

// ─── Filters ──────────────────────────────────────────────────────────────────

interface Filters {
  kategori: string
  level: string
  tipe: string
}

function FilterPanel({
  filters, onChange, onClose,
}: {
  filters: Filters
  onChange: (f: Filters) => void
  onClose: () => void
}) {
  const set = (k: keyof Filters, v: string) => onChange({ ...filters, [k]: v })

  const select = (label: string, key: keyof Filters, opts: string[]) => (
    <div className="mb-3">
      <p className="text-[11px] font-semibold text-app-muted uppercase tracking-wide mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-1">
        {['Semua', ...opts].map((o) => {
          const val = o === 'Semua' ? '' : o
          const active = filters[key] === val
          return (
            <button
              key={o}
              onClick={() => set(key, val)}
              className="text-[11px] px-2.5 py-1 rounded-full border transition-colors"
              style={{
                background: active ? '#2563eb' : '#fff',
                color: active ? '#fff' : '#4a5568',
                borderColor: active ? '#2563eb' : '#e8edf2',
                fontWeight: active ? 600 : 400,
              }}
            >
              {o === 'pekerjaan_pihak_lain' ? 'PPL' : o.charAt(0).toUpperCase() + o.slice(1)}
            </button>
          )
        })}
      </div>
    </div>
  )

  return (
    <div
      className="absolute top-4 left-4 z-[1000] bg-white rounded-xl shadow-popup border border-app-border"
      style={{ width: 220, padding: '14px 14px 10px' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-app-muted" />
          <span className="text-[13px] font-semibold text-app-text">Filter Peta</span>
        </div>
        <button onClick={onClose} className="text-app-subtle hover:text-app-muted">
          <X size={14} />
        </button>
      </div>

      {select('Kategori', 'kategori', [
        'pekerjaan_pihak_lain', 'kebakaran', 'layangan',
        'pencurian', 'pemanfaatan_lahan',
      ])}
      {select('Level', 'level', ['kritis', 'sedang', 'aman'])}
      {select('Tipe Tower', 'tipe', ['gardu', 'SUTET', 'SUTT', 'SKTT'])}

      {/* Legend */}
      <div className="border-t border-app-border pt-3 mt-1">
        <p className="text-[11px] font-semibold text-app-muted uppercase tracking-wide mb-2">Jalur</p>
        {[
          { label: 'SUTET 500kV', color: JALUR_COLORS.SUTET_500kV },
          { label: 'SUTT 150kV',  color: JALUR_COLORS.SUTT_150kV },
          { label: 'SKTT 150kV',  color: JALUR_COLORS.SKTT_150kV },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-2 mb-1.5">
            <div className="flex-1" style={{ height: 2, background: `repeating-linear-gradient(90deg, ${color} 0, ${color} 4px, transparent 4px, transparent 8px)` }} />
            <span className="text-[10px] text-app-muted">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TowerMap({ towers, onTowerClick }: Props) {
  const [zoom, setZoom] = useState(11)
  const [filterOpen, setFilterOpen] = useState(true)
  const [filters, setFilters] = useState<Filters>({ kategori: '', level: '', tipe: '' })

  const featured = towers ?? MOCK_TOWERS

  const filtered = useMemo(() => {
    return featured.filter((t) => {
      if (filters.tipe && t.tipe !== filters.tipe) return false
      if (filters.kategori || filters.level) {
        const match = t.kerawanan.some(
          (k) =>
            (!filters.kategori || k.kategori === filters.kategori) &&
            (!filters.level || k.level === filters.level),
        )
        if (!match && t.kerawanan.length > 0) return false
      }
      return true
    })
  }, [featured, filters])

  // Gardu Induk background (not in featured list)
  const featuredCoords = new Set(filtered.map((t) => `${t.lat},${t.lng}`))
  const bgGardu = useMemo(
    () => garduInduk.filter((g) => !featuredCoords.has(`${g.lat},${g.lng}`)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filtered],
  )

  const bgGarduIcon = useMemo(() => createBgGarduIcon(), [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <MapContainer
        center={[-6.17, 106.65]}
        zoom={11}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />
        <ZoomTracker onZoom={setZoom} />

        {/* ── Jalur transmisi — type dideteksi dari nama ── */}
        {jalurTransmisi
          .filter((jalur) => detectJalurType(jalur) !== 'other')
          .map((jalur, i) => {
            const type = detectJalurType(jalur)
            const isSutet = type === 'SUTET_500kV'
            const isSktt  = type === 'SKTT_150kV'
            const positions = jalur.path.map((p) => [p.lat, p.lng] as [number, number])
            const style = isSutet
              ? { color: JALUR_COLORS.SUTET_500kV, weight: 3.5, opacity: 0.9 }
              : isSktt
              ? { color: JALUR_COLORS.SKTT_150kV, weight: 2.5, opacity: 0.85, dashArray: '6 6' }
              : { color: JALUR_COLORS.SUTT_150kV, weight: 2.5, opacity: 0.85 }
            return (
              <Polyline key={i} positions={positions} pathOptions={style} />
            )
          })
        }

        {/* ── Background tower dots (titik kecil per tiang/tower) ── */}
        {zoom >= 10 && towerSUTET.map((t, i) => (
          <CircleMarker
            key={`sutet-${i}`}
            center={[t.lat, t.lng]}
            radius={3}
            pathOptions={{ color: '#fff', fillColor: JALUR_COLORS.SUTET_500kV, fillOpacity: 0.85, weight: 1 }}
          />
        ))}
        {zoom >= 11 && towerSUTT.map((t, i) => (
          <CircleMarker
            key={`sutt-${i}`}
            center={[t.lat, t.lng]}
            radius={2.5}
            pathOptions={{ color: '#fff', fillColor: JALUR_COLORS.SUTT_150kV, fillOpacity: 0.85, weight: 1 }}
          />
        ))}
        {zoom >= 12 && towerSKTT.map((t, i) => (
          <CircleMarker
            key={`sktt-${i}`}
            center={[t.lat, t.lng]}
            radius={2}
            pathOptions={{ color: '#fff', fillColor: JALUR_COLORS.SKTT_150kV, fillOpacity: 0.8, weight: 1 }}
          />
        ))}

        {/* ── Background Gardu Induk ── */}
        {bgGardu.map((g, i) => (
          <Marker key={`bg-gi-${i}`} position={[g.lat, g.lng]} icon={bgGarduIcon}>
            <Popup>
              <div style={{ fontFamily: 'Inter,sans-serif', padding: '8px 10px', minWidth: 160 }}>
                <p style={{ fontWeight: 700, fontSize: 13 }}>{g.name}</p>
                <p style={{ color: '#94a3b8', fontSize: 11, marginTop: 2 }}>Gardu Induk</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* ── Featured towers ── */}
        {filtered.map((tower) => {
          const hasK = (tower.kerawanan?.length ?? 0) > 0
          const level = hasK ? topLevel(tower.kerawanan) : 'aman'
          const count = tower.kerawanan?.length ?? 0
          const icon =
            tower.tipe === 'gardu'
              ? createGarduIcon(hasK, level, count)
              : createTowerIcon(tower.tipe, hasK, level, count)

          return (
            <Marker
              key={tower.id}
              position={[tower.lat, tower.lng]}
              icon={icon}
              eventHandlers={{ click: () => onTowerClick?.(tower) }}
            >
              <Popup>
                <TowerPopup tower={tower} />
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* ── Filter toggle button ── */}
      {!filterOpen && (
        <button
          onClick={() => setFilterOpen(true)}
          className="absolute top-4 left-4 z-[1000] flex items-center gap-2 bg-white rounded-xl shadow-dropdown border border-app-border px-3 py-2 text-sm font-semibold text-app-text hover:bg-app-bg transition-colors"
        >
          <SlidersHorizontal size={14} />
          Filter
          <ChevronDown size={12} />
        </button>
      )}

      {filterOpen && (
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          onClose={() => setFilterOpen(false)}
        />
      )}

      {/* ── Zoom hint ── */}
      {zoom < 10 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-xs text-app-muted shadow-dropdown border border-app-border">
          Zoom in untuk melihat tower
        </div>
      )}
    </div>
  )
}
