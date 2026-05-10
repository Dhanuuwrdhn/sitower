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
  level: 'kritis' | 'sedang' | 'aman'
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

const LEVEL_PRIORITY: Record<string, number> = { kritis: 3, sedang: 2, aman: 1 }
const LEVEL_COLOR: Record<string, string> = {
  kritis: '#ef4444', sedang: '#f59e0b', aman: '#22c55e', normal: '#3b82f6',
}
const KATEGORI_LABEL: Record<string, string> = {
  pekerjaan_pihak_lain: 'Pekerjaan Pihak Lain',
  kebakaran:   'Kebakaran',
  layangan:    'Layangan',
  pencurian:   'Pencurian',
  pemanfaatan_lahan: 'Pemanfaatan Lahan',
}

function getTopLevel(kerawanan: KerawananItem[]): string {
  if (!kerawanan.length) return 'normal'
  return kerawanan.reduce((top, k) =>
    (LEVEL_PRIORITY[k.level] ?? 0) > (LEVEL_PRIORITY[top] ?? 0) ? k.level : top,
    'aman'
  )
}

// ─── SVG icon data URIs sesuai desain Figma ──────────────────────────────────
//
//  Gardu Induk  → lingkaran HITAM + icon bangunan gardu, selalu hitam
//  Tower normal → lingkaran BIRU  + icon tiang/pylon (kecil)
//  Tower gangguan → lingkaran MERAH + icon tiang/pylon + pill badge merah

/** Gardu Induk: lingkaran hitam + building icon, badge merah jika ada gangguan */
function makeGarduSvg(count: number) {
  const hasCount = count > 0
  const W = hasCount ? 72 : 44
  const H = 44
  const cx = 22
  const cy = 22
  const r  = 18

  const badge = hasCount ? `
    <rect x="${cx + r - 3}" y="4" width="24" height="16" rx="8" fill="#D32F2F"/>
    <text x="${cx + r + 9}" y="16" text-anchor="middle"
      font-family="Inter,Arial,sans-serif" font-size="10" font-weight="700" fill="#fff">${count}</text>
  ` : ''

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <filter id="gs${count}" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#000" flood-opacity="0.4"/>
      </filter>
    </defs>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#1A1A1A" filter="url(#gs${count})"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="0.2"/>
    <!-- Gardu (Substation Building) Icon -->
    <path d="M12 28v-11l10-6.5 10 6.5v11h-20zm2-1h16v-9.3l-8-5.2-8 5.2v9.3zm6-5h4v6h-4v-6z" fill="#FFFFFF"/>
    ${badge}
  </svg>`
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg)
}

/** Tower/Tiang: Titik kecil di sepanjang jalur (normal) atau MERAH besar + pill badge (gangguan) */
function makeTowerSvg(hasGangguan: boolean, count: number, tipe: 'SUTET'|'SUTT'|'SKTT'|'gardu') {
  let baseColor = '#0288D1' // SUTT
  if (tipe === 'SUTET') baseColor = '#e65100'
  if (tipe === 'SKTT') baseColor = '#7c3aed'

  if (!hasGangguan) {
    // Titik kecil / simpul di sepanjang jalur (Figma / My Maps style)
    const W = 16, H = 16, cx = 8, cy = 8, r = 3.5
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${baseColor}" stroke="#FFFFFF" stroke-width="1.5" />
    </svg>`
    return {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
      size: [W, H],
      anchor: [cx, cy],
    }
  }

  // Jika ada gangguan, ubah jadi merah besar dengan badge
  baseColor = '#D32F2F'
  const W = 70, H = 36, cx = 18, cy = 18, r = 14

  const badge = `
    <rect x="${cx + r - 3}" y="3" width="20" height="14" rx="7" fill="#D32F2F" stroke="#FFFFFF" stroke-width="1.5"/>
    <text x="${cx + r + 7}" y="13" text-anchor="middle"
      font-family="Inter,Arial,sans-serif" font-size="9" font-weight="700" fill="#fff">${count}</text>
  `

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <filter id="ts${count}${hasGangguan}" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="${baseColor}" flood-opacity="0.5"/>
      </filter>
    </defs>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${baseColor}" filter="url(#ts${count}${hasGangguan})"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="0.25"/>
    <path d="M17.5 9l-2 4h-3v1h2.7l-1.8 9h-2.9v1h11v-1h-2.9l-1.8-9h2.7v-1h-3l-2-4h-1zm-1.4 5h3.7l1.3 6.5h-6.3l1.3-6.5zm-2.2 7.5h8.2l.8 4h-9.8l.8-4z" fill="#FFFFFF"/>
    ${badge}
  </svg>`
  return {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
    size: [W, H],
    anchor: [cx, cy],
  }
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

/**
 * geodata.ts di-generate otomatis dari KML dan semua jalur bertipe "other".
 * Derive tipe sebenarnya dari nama jalur untuk mendapat warna & style yang benar.
 */
function detectJalurType(jalur: { name: string; type: string; color: string }) {
  const n = jalur.name.toUpperCase()
  if (n.includes('SUTET') || n.includes('500KV') || n.includes('JAWA7') || n.includes('GANDUL')) {
    return 'SUTET_500kV' as const
  }
  if (n.includes('SKTT') || n.includes('JOINT SKTT') || n.includes('SPAN SKTT')) {
    return 'SKTT_150kV' as const
  }
  if (n.includes('SUTT') || n.includes('150KV') || n.includes('150 KV') ||
      ['MUARAKARANG', 'DURIKOSAMBI', 'KEMBANGAN', 'JATAKE', 'LONTAR', 'CENGKARENG',
       'GROGOL', 'PANTAI INDAH KAPUK', 'DADAP', 'TANGERANG', 'KEBON JERUK',
       'PETUKANGAN', 'NEW SENAYAN', 'ANGKE', 'GAJAH TUNGGAL', 'PASAR KEMIS'].some(k => n.includes(k))) {
    return 'SUTT_150kV' as const
  }
  return 'other' as const
}

function TransmissionLines() {
  const map = useMap()
  useEffect(() => {
    if (!map || !window.google) return

    const lines = jalurTransmisi
      .flatMap((jalur, index) => {
        // Skip entry pertama jika itu adalah polygon bounding box (area UPT)
        if (index === 0 && jalur.name.includes('UPT Durikosambi')) return []

        const type = detectJalurType(jalur)
        const isSktt  = type === 'SKTT_150kV'
        const isSutet = type === 'SUTET_500kV'
        const isSutt  = type === 'SUTT_150kV'

        // Gunakan warna JALUR_COLORS untuk tipe yang dideteksi, 
        // fallback ke warna asli KML (jalur.color) jika tipe = 'other'
        const color = (type !== 'other' ? JALUR_COLORS[type] : jalur.color) || JALUR_COLORS.other

        // SUTET: solid tebal, SUTT: solid medium, SKTT: dotted, other: solid tipis
        const strokeWeight = isSutet ? 4 : isSutt ? 3 : 2
        const strokeOpacity = isSktt ? 0 : 0.95
        const zIndexBase = isSutet ? 30 : isSktt ? 10 : 20
        const path = jalur.path.map((p) => ({ lat: p.lat, lng: p.lng }))

        // SKTT: pola dash-gap yang lebih rapi seperti kabel bawah tanah
        const icons: google.maps.PolylineOptions['icons'] = isSktt
          ? [{
              icon: {
                path: 'M 0,-1 0,1',
                strokeOpacity: 1,
                scale: 3,
                strokeColor: color,
              },
              offset: '0',
              repeat: '12px',
            }]
          : undefined

        const mainLine = new window.google.maps.Polyline({
          path,
          strokeColor: color,
          strokeOpacity,
          strokeWeight,
          icons,
          zIndex: zIndexBase,
          map,
        })

        if (isSktt) return [mainLine]

        // Efek Glow / Outline putih untuk jalur solid agar kontras dan elegan
        const outlineLine = new window.google.maps.Polyline({
          path,
          strokeColor: '#FFFFFF',
          strokeOpacity: 0.5,
          strokeWeight: strokeWeight + 4,
          zIndex: zIndexBase - 1,
          map,
        })

        return [outlineLine, mainLine]
      })
      .filter(Boolean) as google.maps.Polyline[]

    return () => lines.forEach((l) => l.setMap(null))
  }, [map])
  return null
}


function ZoomWatcher({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
  const map = useMap()

  useEffect(() => {
    if (!map) return

    const syncZoom = () => onZoomChange(map.getZoom() ?? 10)

    syncZoom()
    const listener = map.addListener('zoom_changed', syncZoom)
    return () => listener.remove()
  }, [map, onZoomChange])

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
      const count    = tower.kerawanan?.length ?? 0
      const isGardu  = tower.tipe === 'gardu'
      const hasGangguan = count > 0

      if (isGardu) {
        // Gardu Induk → lingkaran HITAM + building icon (selalu hitam sesuai Figma)
        const iconUrl = makeGarduSvg(count)
        const W = count > 0 ? 72 : 44
        const H = 44
        const marker = new window.google.maps.Marker({
          position: { lat: tower.lat, lng: tower.lng },
          map,
          title: tower.nama,
          icon: {
            url: iconUrl,
            scaledSize: new window.google.maps.Size(W, H),
            anchor: new window.google.maps.Point(22, 22),
          },
          zIndex: hasGangguan ? 40 : 20,
        })
        marker.addListener('click', () => onSelect(tower))
        return marker
      } else {
        // Tower/Tiang → Titik kecil (normal) atau MERAH besar (gangguan)
        const iconData = makeTowerSvg(hasGangguan, count, tower.tipe)
        const marker = new window.google.maps.Marker({
          position: { lat: tower.lat, lng: tower.lng },
          map,
          title: tower.nama,
          icon: {
            url: iconData.url,
            scaledSize: new window.google.maps.Size(iconData.size[0], iconData.size[1]),
            anchor: new window.google.maps.Point(iconData.anchor[0], iconData.anchor[1]),
          },
          zIndex: hasGangguan ? 40 : 10,
        })
        marker.addListener('click', () => onSelect(tower))
        return marker
      }
    }).filter(Boolean) as google.maps.Marker[]

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
      <div style={{ minWidth: 240, fontFamily: 'Inter, sans-serif', fontSize: 12, padding: 4 }}>
        <div style={{ fontWeight: 700, fontSize: 12, color: '#1c1c1c', marginBottom: 8 }}>
          Informasi Tower
        </div>
        <div style={{ color: '#1c1c1c', fontWeight: 600, marginBottom: 3 }}>{tower.nama}</div>
        <div style={{ color: '#97aab3', fontSize: 11, marginBottom: 10 }}>
          {tower.tipe}{tower.tegangan ? ` · ${tower.tegangan}` : ''}
        </div>
        {tower.kerawanan.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ color: '#1c1c1c', fontWeight: 600 }}>Gangguan</div>
            {tower.kerawanan.map((k, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: LEVEL_COLOR[k.level] ?? '#94a3b8', flexShrink: 0 }} />
                <span style={{ color: '#5f737f', fontSize: 11 }}>{KATEGORI_LABEL[k.kategori] ?? k.kategori}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: '#5f737f', fontSize: 11 }}>Tidak ada gangguan aktif</div>
        )}
        <div style={{ marginTop: 10, color: '#97aab3', fontSize: 10 }}>
          Terakhir update: {tower.updatedAt ? new Date(tower.updatedAt).toLocaleString('id-ID') : '—'}
        </div>
        {level !== 'normal' && (
          <div style={{ marginTop: 8, padding: '3px 8px', background: levelColor + '20', borderRadius: 999, display: 'inline-block', fontSize: 10, fontWeight: 700, color: levelColor, textTransform: 'uppercase' }}>
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 24, height: 4, background: JALUR_COLORS.SUTET_500kV, borderRadius: 2 }} />
        <span style={{ color: '#374151' }}>SUTET 500kV</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 24, height: 3, background: JALUR_COLORS.SUTT_150kV, borderRadius: 2 }} />
        <span style={{ color: '#374151' }}>SUTT 150kV</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 24, height: 3, borderTop: `3px dashed ${JALUR_COLORS.SKTT_150kV}` }} />
        <span style={{ color: '#374151' }}>SKTT 150kV</span>
      </div>

      <p style={{ fontWeight: 700, fontSize: 11.5, margin: '8px 0 4px', color: '#0f172a' }}>Marker</p>
      {/* Gardu Induk */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <path d="M3 21h18M6 21V7l6-4 6 4v14"/><rect x="9" y="15" width="6" height="6"/>
          </svg>
        </div>
        <span style={{ color: '#374151' }}>Gardu Induk</span>
      </div>
      {/* Tower Normal */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#0288D1', flexShrink: 0 }} />
        <span style={{ color: '#374151' }}>Tower (Normal)</span>
      </div>
      {/* Tower Gangguan */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#D32F2F', flexShrink: 0 }} />
        <span style={{ color: '#374151' }}>Tower (Gangguan)</span>
      </div>
    </div>
  )
}


// ─── Main component ───────────────────────────────────────────────────────────

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
const CENTER  = { lat: -6.18, lng: 106.50 }

export default function TowerMapGoogle({ towers, onTowerClick }: Props) {
  const [selected, setSelected] = useState<FeaturedTower | null>(null)

  const displayTowers = useMemo<FeaturedTower[]>(() => {
    const baseTowers = buildDefaultTowers()
    if (!towers || towers.length === 0) return baseTowers
    
    // Gabungkan tower default (semua titik jalur) dengan tower dari prop (yang punya gangguan)
    // Di aplikasi nyata, ini di-merge by ID. Di sini kita append agar keduanya tampil.
    return [...baseTowers, ...towers]
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
