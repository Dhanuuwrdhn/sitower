'use client'

import { APIProvider, Map, InfoWindow, useMap } from '@vis.gl/react-google-maps'
import { useEffect, useRef, useState, useMemo } from 'react'
import { JALUR_COLORS } from '@/lib/geodata'

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
  jalur?: string | null
  nomorUrut?: number | null
}

export interface JalurKmlItem {
  id: number
  nama: string
  tipe: string   // SUTET | SUTT | SKTT
  warna: string | null
  path: Array<{ lat: number; lng: number }>
}

interface Props {
  towers?: FeaturedTower[]
  onTowerClick?: (tower: FeaturedTower) => void
  jalurKml?: JalurKmlItem[]
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

/** Gardu Induk: design dari Figma — lingkaran hitam #1C1C1C + vuesax/bold/bank icon, badge merah jika ada gangguan */
function makeGarduSvg(count: number) {
  const hasCount = count > 0
  // Base icon: 26x26. Badge extends width if needed.
  const BASE = 26
  const W = hasCount ? BASE + 26 : BASE
  const H = BASE

  const badge = hasCount ? `
    <rect x="${BASE - 4}" y="2" width="22" height="14" rx="7" fill="#D32F2F"/>
    <text x="${BASE + 7}" y="13" text-anchor="middle"
      font-family="Inter,Arial,sans-serif" font-size="9" font-weight="700" fill="#fff">${count}</text>
  ` : ''

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <filter id="gs${count}" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.35"/>
      </filter>
    </defs>
    <rect width="26" height="26" rx="13" fill="#1C1C1C" filter="url(#gs${count})"/>
    <path d="M18.8334 17.0833V18.8333H7.16675V17.0833C7.16675 16.7625 7.42925 16.5 7.75008 16.5H18.2501C18.5709 16.5 18.8334 16.7625 18.8334 17.0833Z" fill="white" stroke="white" stroke-width="0.818182" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10.0834 12.4167H8.91675V16.5H10.0834V12.4167Z" fill="white"/>
    <path d="M12.4167 12.4167H11.25V16.5H12.4167V12.4167Z" fill="white"/>
    <path d="M14.7499 12.4167H13.5833V16.5H14.7499V12.4167Z" fill="white"/>
    <path d="M17.0834 12.4167H15.9167V16.5H17.0834V12.4167Z" fill="white"/>
    <path d="M19.4166 19.2708H6.58325C6.34409 19.2708 6.14575 19.0725 6.14575 18.8333C6.14575 18.5941 6.34409 18.3958 6.58325 18.3958H19.4166C19.6558 18.3958 19.8541 18.5941 19.8541 18.8333C19.8541 19.0725 19.6558 19.2708 19.4166 19.2708Z" fill="white"/>
    <path d="M18.4659 9.35418L13.2159 7.25418C13.0992 7.20751 12.9009 7.20751 12.7842 7.25418L7.53425 9.35418C7.33008 9.43584 7.16675 9.67501 7.16675 9.89668V11.8333C7.16675 12.1542 7.42925 12.4167 7.75008 12.4167H18.2501C18.5709 12.4167 18.8334 12.1542 18.8334 11.8333V9.89668C18.8334 9.67501 18.6701 9.43584 18.4659 9.35418ZM13.0001 10.9583C12.5159 10.9583 12.1251 10.5675 12.1251 10.0833C12.1251 9.59918 12.5159 9.20834 13.0001 9.20834C13.4842 9.20834 13.8751 9.59918 13.8751 10.0833C13.8751 10.5675 13.4842 10.9583 13.0001 10.9583Z" fill="white"/>
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




// ─── KML Jalur polylines ───────────────────────────────────────────────────────

const KML_JALUR_COLORS: Record<string, string> = {
  SUTET: '#e65100',   // orange
  SUTT:  '#0288D1',   // blue
  SKTT:  '#7c3aed',   // purple
}

function JalurKmlLines({ jalurKml }: { jalurKml: JalurKmlItem[] }) {
  const map = useMap()

  useEffect(() => {
    if (!map || !window.google || !jalurKml.length) return

    const lines: google.maps.Polyline[] = []

    for (const jalur of jalurKml) {
      if (!jalur.path || jalur.path.length < 2) continue

      const path = jalur.path.map((p) => ({ lat: p.lat, lng: p.lng }))
      const isSktt  = jalur.tipe === 'SKTT'
      const isSutet = jalur.tipe === 'SUTET'

      // Use jalur.warna if provided, otherwise fall back to tipe color
      const color = jalur.warna ?? KML_JALUR_COLORS[jalur.tipe] ?? '#6B7280'
      const strokeWeight  = isSutet ? 4 : 3
      const strokeOpacity = isSktt ? 0 : 0.85
      const zIndex = isSutet ? 36 : isSktt ? 16 : 26

      const icons: google.maps.PolylineOptions['icons'] = isSktt
        ? [{ icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 3, strokeColor: color }, offset: '0', repeat: '12px' }]
        : undefined

      // Glow/outline for solid lines
      if (!isSktt) {
        lines.push(new window.google.maps.Polyline({
          path,
          strokeColor: '#FFFFFF',
          strokeOpacity: 0.45,
          strokeWeight: strokeWeight + 4,
          zIndex: zIndex - 1,
          map,
        }))
      }

      lines.push(new window.google.maps.Polyline({
        path,
        strokeColor: color,
        strokeOpacity,
        strokeWeight,
        icons,
        zIndex,
        map,
      }))
    }

    return () => lines.forEach((l) => l.setMap(null))
  }, [map, jalurKml])

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
        // Gardu Induk → design Figma: lingkaran hitam #1C1C1C + vuesax bank icon
        const iconUrl = makeGarduSvg(count)
        const W = count > 0 ? 52 : 26
        const H = 26
        const marker = new window.google.maps.Marker({
          position: { lat: tower.lat, lng: tower.lng },
          map,
          title: tower.nama,
          icon: {
            url: iconUrl,
            scaledSize: new window.google.maps.Size(W, H),
            anchor: new window.google.maps.Point(13, 13),
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
        <svg width="18" height="18" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
          <rect width="26" height="26" rx="13" fill="#1C1C1C"/>
          <path d="M18.8334 17.0833V18.8333H7.16675V17.0833C7.16675 16.7625 7.42925 16.5 7.75008 16.5H18.2501C18.5709 16.5 18.8334 16.7625 18.8334 17.0833Z" fill="white" stroke="white" strokeWidth="0.818182" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10.0834 12.4167H8.91675V16.5H10.0834V12.4167Z" fill="white"/>
          <path d="M12.4167 12.4167H11.25V16.5H12.4167V12.4167Z" fill="white"/>
          <path d="M14.7499 12.4167H13.5833V16.5H14.7499V12.4167Z" fill="white"/>
          <path d="M17.0834 12.4167H15.9167V16.5H17.0834V12.4167Z" fill="white"/>
          <path d="M19.4166 19.2708H6.58325C6.34409 19.2708 6.14575 19.0725 6.14575 18.8333C6.14575 18.5941 6.34409 18.3958 6.58325 18.3958H19.4166C19.6558 18.3958 19.8541 18.5941 19.8541 18.8333C19.8541 19.0725 19.6558 19.2708 19.4166 19.2708Z" fill="white"/>
          <path d="M18.4659 9.35418L13.2159 7.25418C13.0992 7.20751 12.9009 7.20751 12.7842 7.25418L7.53425 9.35418C7.33008 9.43584 7.16675 9.67501 7.16675 9.89668V11.8333C7.16675 12.1542 7.42925 12.4167 7.75008 12.4167H18.2501C18.5709 12.4167 18.8334 12.1542 18.8334 11.8333V9.89668C18.8334 9.67501 18.6701 9.43584 18.4659 9.35418ZM13.0001 10.9583C12.5159 10.9583 12.1251 10.5675 12.1251 10.0833C12.1251 9.59918 12.5159 9.20834 13.0001 9.20834C13.4842 9.20834 13.8751 9.59918 13.8751 10.0833C13.8751 10.5675 13.4842 10.9583 13.0001 10.9583Z" fill="white"/>
        </svg>
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

export default function TowerMapGoogle({ towers, onTowerClick, jalurKml }: Props) {
  const [selected, setSelected] = useState<FeaturedTower | null>(null)

  const displayTowers = useMemo<FeaturedTower[]>(() => {
    return towers ?? []
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
          {jalurKml && jalurKml.length > 0 && <JalurKmlLines jalurKml={jalurKml} />}
          <TowerMarkers towers={displayTowers} onSelect={handleSelect} />
          {selected && <TowerPopup tower={selected} onClose={() => setSelected(null)} />}
        </Map>
      </APIProvider>
      <Legend />
    </div>
  )
}
