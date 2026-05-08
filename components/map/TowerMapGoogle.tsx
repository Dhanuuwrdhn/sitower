'use client'

import { APIProvider, Map, InfoWindow, useMap } from '@vis.gl/react-google-maps'
import { useEffect, useRef, useState, useMemo } from 'react'
import {
  garduInduk, towerSUTET, towerSUTT, towerSKTT,
  jalurTransmisi, JALUR_COLORS,
} from '@/lib/geodata'

// ─── Types ────────────────────────────────────────────────────────────────────

interface KerawananItem {
  kategori: string
  level: 'tinggi' | 'sedang' | 'rendah'
  status: string
}

export interface FeaturedTower {
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

const LEVEL_PRIORITY: Record<string, number> = { tinggi: 3, sedang: 2, rendah: 1 }
const LEVEL_COLOR: Record<string, string> = {
  tinggi: '#ef4444', sedang: '#f59e0b', rendah: '#22c55e', normal: '#3b82f6',
}
const KATEGORI_LABEL: Record<string, string> = {
  pekerjaan_pihak_lain: 'Pekerjaan Pihak Lain',
  kebakaran:   'Kebakaran',
  layangan:    'Layangan',
  pencurian:   'Pencurian',
  pemanfaatan: 'Pemanfaatan ROW',
  gangguan:    'Gangguan',
  cui:         'Climb Up Inspection',
  cleanup:     'Clean Up Isolator',
}

function getTopLevel(kerawanan: KerawananItem[]): string {
  if (!kerawanan.length) return 'normal'
  return kerawanan.reduce((top, k) =>
    (LEVEL_PRIORITY[k.level] ?? 0) > (LEVEL_PRIORITY[top] ?? 0) ? k.level : top,
    'rendah'
  )
}

// ─── SVG icon data URIs for google.maps.Marker ───────────────────────────────

function makeGarduSvg(color: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="32" viewBox="0 0 28 32">
    <rect x="1" y="1" width="26" height="24" rx="5" fill="${color}" stroke="white" stroke-width="2"/>
    <path d="M14 4L8 13h5l-1 7 7-10h-5l1-7z" fill="white"/>
    <polygon points="14,28 9,24 19,24" fill="${color}"/>
  </svg>`
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg)
}

function makeTowerSvg(color: string, size: number) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 20 20">
    <circle cx="10" cy="10" r="9" fill="${color}" stroke="white" stroke-width="1.5"/>
    <path d="M6 4h8M7 4l3 12M13 4l-3 12M8 8h4M8.5 11h3" stroke="white" stroke-width="1.2" stroke-linecap="round" fill="none"/>
  </svg>`
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg)
}

// ─── Build default towers from geodata ────────────────────────────────────────

function buildDefaultTowers(): FeaturedTower[] {
  return [
    ...garduInduk.map((t, i) => ({ id: `gardu-${i}`, nama: t.name, lat: t.lat, lng: t.lng, tipe: 'gardu' as const, kerawanan: [] })),
    ...towerSUTET.map((t, i) => ({ id: `sutet-${i}`, nama: t.name, lat: t.lat, lng: t.lng, tipe: 'SUTET' as const, tegangan: '500kV', kerawanan: [] })),
    ...towerSUTT.map((t, i)  => ({ id: `sutt-${i}`,  nama: t.name, lat: t.lat, lng: t.lng, tipe: 'SUTT' as const,  tegangan: '150kV', kerawanan: [] })),
    ...towerSKTT.map((t, i)  => ({ id: `sktt-${i}`,  nama: t.name, lat: t.lat, lng: t.lng, tipe: 'SKTT' as const,  tegangan: '150kV', kerawanan: [] })),
  ]
}

// ─── Transmission line polylines ──────────────────────────────────────────────

function TransmissionLines() {
  const map = useMap()
  useEffect(() => {
    if (!map || !window.google) return
    const lines = jalurTransmisi.map((jalur) => {
      const color = JALUR_COLORS[jalur.type] ?? JALUR_COLORS.other
      const isSktt = jalur.type === 'SKTT_150kV'
      return new window.google.maps.Polyline({
        path: jalur.path.map((p) => ({ lat: p.lat, lng: p.lng })),
        strokeColor: color,
        strokeOpacity: isSktt ? 0 : 0.85,
        strokeWeight: jalur.type === 'SUTET_500kV' ? 2.5 : 2,
        icons: isSktt ? [{ icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 3, strokeColor: color }, offset: '0', repeat: '12px' }] : undefined,
        map,
      })
    })
    return () => lines.forEach((l) => l.setMap(null))
  }, [map])
  return null
}

// ─── All markers via legacy google.maps.Marker (no mapId required) ────────────

function TowerMarkers({
  towers,
  onSelect,
}: {
  towers: FeaturedTower[]
  onSelect: (t: FeaturedTower) => void
}) {
  const map = useMap()
  const markersRef = useRef<google.maps.Marker[]>([])

  useEffect(() => {
    if (!map || !window.google) return

    // Clean up old markers
    markersRef.current.forEach((m) => m.setMap(null))
    markersRef.current = []

    const created = towers.map((tower) => {
      const level = getTopLevel(tower.kerawanan)
      const color = LEVEL_COLOR[level]
      const isGardu = tower.tipe === 'gardu'
      const size = isGardu ? 28 : (tower.tipe === 'SUTET' ? 16 : 13)
      const iconUrl = isGardu ? makeGarduSvg(color) : makeTowerSvg(color, size)

      const marker = new window.google.maps.Marker({
        position: { lat: tower.lat, lng: tower.lng },
        map,
        title: tower.nama,
        icon: {
          url: iconUrl,
          scaledSize: new window.google.maps.Size(size, isGardu ? size + 4 : size),
          anchor: new window.google.maps.Point(size / 2, isGardu ? size + 4 : size / 2),
        },
        zIndex: isGardu ? 10 : (tower.tipe === 'SUTET' ? 5 : 3),
      })

      marker.addListener('click', () => onSelect(tower))
      return marker
    })

    markersRef.current = created

    return () => {
      created.forEach((m) => m.setMap(null))
      markersRef.current = []
    }
  }, [map, towers, onSelect])

  return null
}

// ─── Info popup ───────────────────────────────────────────────────────────────

function TowerPopup({ tower, onClose }: { tower: FeaturedTower; onClose: () => void }) {
  const level = getTopLevel(tower.kerawanan)
  const levelColor = LEVEL_COLOR[level]
  return (
    <InfoWindow position={{ lat: tower.lat, lng: tower.lng }} onCloseClick={onClose}>
      <div style={{ minWidth: 210, fontFamily: 'Inter, sans-serif', fontSize: 13, padding: 2 }}>
        <div style={{ fontWeight: 700, fontSize: 13.5, color: '#0f172a', marginBottom: 3, paddingBottom: 6, borderBottom: '1px solid #e2e8f0' }}>
          {tower.nama}
        </div>
        <div style={{ color: '#64748b', fontSize: 11.5, marginBottom: 8 }}>
          {tower.tipe}{tower.tegangan ? ` · ${tower.tegangan}` : ''}
        </div>
        {tower.kerawanan.length > 0 ? (
          <>
            <p style={{ fontWeight: 600, color: '#374151', marginBottom: 4, fontSize: 11.5 }}>Kerawanan Aktif</p>
            {tower.kerawanan.map((k, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 0' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: LEVEL_COLOR[k.level] ?? '#94a3b8', flexShrink: 0 }} />
                <span style={{ color: '#1e293b', fontSize: 12 }}>{KATEGORI_LABEL[k.kategori] ?? k.kategori}</span>
                <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: LEVEL_COLOR[k.level] }}>{k.level}</span>
              </div>
            ))}
          </>
        ) : (
          <p style={{ color: '#22c55e', fontWeight: 600, fontSize: 12 }}>✓ Tidak ada kerawanan aktif</p>
        )}
        {level !== 'normal' && (
          <div style={{ marginTop: 8, padding: '3px 8px', background: levelColor + '20', borderRadius: 4, textAlign: 'center', fontSize: 10, fontWeight: 700, color: levelColor, textTransform: 'uppercase' }}>
            Risiko {level}
          </div>
        )}
      </div>
    </InfoWindow>
  )
}

// ─── Legend ───────────────────────────────────────────────────────────────────

function Legend() {
  return (
    <div style={{
      position: 'absolute', bottom: 28, left: 12, zIndex: 10,
      background: 'rgba(255,255,255,0.96)', borderRadius: 8,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)', padding: '10px 14px', fontSize: 11, lineHeight: 1.9,
    }}>
      <p style={{ fontWeight: 700, fontSize: 11.5, marginBottom: 4, color: '#0f172a' }}>Jalur Transmisi</p>
      {[
        { color: JALUR_COLORS.SUTET_500kV, label: 'SUTET 500kV' },
        { color: JALUR_COLORS.SUTT_150kV,  label: 'SUTT 150kV' },
        { color: JALUR_COLORS.SKTT_150kV,  label: 'SKTT 150kV' },
      ].map(({ color, label }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 22, height: 3, background: color, borderRadius: 2 }} />
          <span style={{ color: '#374151' }}>{label}</span>
        </div>
      ))}
      <p style={{ fontWeight: 700, fontSize: 11.5, margin: '6px 0 4px', color: '#0f172a' }}>Kerawanan</p>
      {[
        { color: LEVEL_COLOR.tinggi, label: 'Risiko Tinggi' },
        { color: LEVEL_COLOR.sedang, label: 'Risiko Sedang' },
        { color: LEVEL_COLOR.rendah, label: 'Risiko Rendah' },
        { color: LEVEL_COLOR.normal, label: 'Normal' },
      ].map(({ color, label }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
          <span style={{ color: '#374151' }}>{label}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
const CENTER  = { lat: -6.18, lng: 106.50 }

export default function TowerMapGoogle({ towers, onTowerClick }: Props) {
  const [selected, setSelected] = useState<FeaturedTower | null>(null)

  const displayTowers = useMemo<FeaturedTower[]>(() => {
    if (towers && towers.length > 0) return towers
    return buildDefaultTowers()
  }, [towers])

  const handleSelect = useMemo(() => (t: FeaturedTower) => {
    setSelected(t)
    onTowerClick?.(t)
  }, [onTowerClick])

  if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', gap: 10 }}>
        <div style={{ fontSize: 32 }}>🗺️</div>
        <p style={{ fontWeight: 700, color: '#0f172a' }}>Google Maps API Key diperlukan</p>
        <code style={{ fontSize: 12, background: '#f1f5f9', padding: '4px 8px', borderRadius: 4 }}>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <APIProvider apiKey={API_KEY}>
        <Map
          defaultCenter={CENTER}
          defaultZoom={10}
          style={{ width: '100%', height: '100%' }}
          gestureHandling="greedy"
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={false}
        >
          <TransmissionLines />
          <TowerMarkers towers={displayTowers} onSelect={handleSelect} />
          {selected && <TowerPopup tower={selected} onClose={() => setSelected(null)} />}
        </Map>
      </APIProvider>
      <Legend />
    </div>
  )
}
