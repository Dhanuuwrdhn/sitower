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

// CellTower icon path dari Figma (26x26 viewBox) — sama untuk normal & gangguan
const CELL_TOWER_PATH = `M13.3916 10.6167C13.3553 10.5439 13.2995 10.4827 13.2303 10.4399C13.1611 10.3971 13.0814 10.3744 13.0001 10.3744C12.9187 10.3744 12.839 10.3971 12.7698 10.4399C12.7007 10.4827 12.6448 10.5439 12.6085 10.6167L8.671 18.4917C8.61908 18.5955 8.61051 18.7157 8.64717 18.8258C8.68384 18.9359 8.76273 19.0269 8.86651 19.0788C8.97029 19.1307 9.09044 19.1393 9.20054 19.1026C9.31063 19.066 9.40166 18.9871 9.45358 18.8833L10.211 17.375H15.7946L16.5487 18.8833C16.5849 18.9556 16.6404 19.0164 16.709 19.0591C16.7776 19.1018 16.8568 19.1246 16.9376 19.125C17.0121 19.125 17.0855 19.1059 17.1506 19.0695C17.2157 19.0332 17.2704 18.9808 17.3096 18.9174C17.3488 18.8539 17.3711 18.7815 17.3744 18.707C17.3777 18.6325 17.3619 18.5584 17.3286 18.4917L13.3916 10.6167ZM13.0001 11.7909L14.4799 14.75H11.5202L13.0001 11.7909ZM14.7222 11.1264C14.7672 10.8745 14.7565 10.6158 14.6907 10.3685C14.625 10.1212 14.5057 9.89131 14.3415 9.69507C14.1772 9.49883 13.9719 9.341 13.7401 9.2327C13.5082 9.12441 13.2554 9.06829 12.9995 9.06829C12.7436 9.06829 12.4908 9.12441 12.259 9.2327C12.0271 9.341 11.8218 9.49883 11.6575 9.69507C11.4933 9.89131 11.3741 10.1212 11.3083 10.3685C11.2425 10.6158 11.2318 10.8745 11.2769 11.1264C11.2885 11.1835 11.2887 11.2424 11.2773 11.2996C11.2659 11.3567 11.2432 11.411 11.2105 11.4593C11.1779 11.5076 11.1359 11.5488 11.0871 11.5806C11.0382 11.6124 10.9835 11.6342 10.9262 11.6446C10.8688 11.6549 10.81 11.6538 10.7531 11.6411C10.6962 11.6284 10.6424 11.6045 10.5949 11.5708C10.5474 11.537 10.5071 11.4941 10.4764 11.4446C10.4457 11.395 10.4252 11.3399 10.4161 11.2823C10.3475 10.9041 10.3628 10.5154 10.461 10.1438C10.5591 9.77214 10.7377 9.42658 10.984 9.13154C11.2304 8.83649 11.5386 8.59915 11.8867 8.43628C12.2349 8.27341 12.6146 8.189 12.999 8.189C13.3834 8.189 13.763 8.27341 14.1112 8.43628C14.4594 8.59915 14.7675 8.83649 15.0139 9.13154C15.2603 9.42658 15.4388 9.77214 15.537 10.1438C15.6351 10.5154 15.6504 10.9041 15.5819 11.2823C15.5637 11.3831 15.5107 11.4743 15.4321 11.5401C15.3536 11.6059 15.2545 11.642 15.152 11.6421C15.1258 11.6419 15.0996 11.6395 15.0738 11.635C14.9598 11.6141 14.8587 11.5489 14.7928 11.4535C14.7268 11.3581 14.7014 11.2405 14.7222 11.1264ZM9.50827 13.449C9.01805 12.7996 8.71864 12.0264 8.64367 11.2162C8.56871 10.406 8.72116 9.59097 9.0839 8.86265C9.44664 8.13434 10.0053 7.52161 10.6971 7.09331C11.3889 6.66501 12.1864 6.43811 13.0001 6.43811C13.8137 6.43811 14.6112 6.66501 15.303 7.09331C15.9948 7.52161 16.5535 8.13434 16.9162 8.86265C17.279 9.59097 17.4314 10.406 17.3565 11.2162C17.2815 12.0264 16.9821 12.7996 16.4919 13.449C16.4212 13.5396 16.3177 13.5987 16.2038 13.6136C16.0899 13.6285 15.9747 13.598 15.8831 13.5288C15.7915 13.4595 15.7308 13.3569 15.7141 13.2433C15.6975 13.1296 15.7262 13.0139 15.794 12.9213C16.186 12.4017 16.4254 11.7832 16.4852 11.1351C16.5451 10.487 16.423 9.83506 16.1328 9.25251C15.8426 8.66996 15.3956 8.17988 14.8423 7.83732C14.2889 7.49476 13.6509 7.31328 13.0001 7.31328C12.3492 7.31328 11.7113 7.49476 11.1579 7.83732C10.6045 8.17988 10.1576 8.66996 9.86734 9.25251C9.5771 9.83506 9.45505 10.487 9.51489 11.1351C9.57473 11.7832 9.81409 12.4017 10.2061 12.9213C10.274 13.0139 10.3027 13.1296 10.286 13.2433C10.2694 13.3569 10.2087 13.4595 10.117 13.5288C10.0254 13.598 9.91022 13.6285 9.79632 13.6136C9.68242 13.5987 9.57895 13.5396 9.50827 13.449Z`

const LEVEL_BG: Record<string, string> = {
  kritis: '#D92D20',
  sedang: '#F59E0B',
  aman:   '#16A34A',
  normal: '#076C9E',
}

const KATEGORI_EMOJI: Record<string, string> = {
  pekerjaan_pihak_lain: '🚜',
  kebakaran:            '🔥',
  layangan:             '🪁',
  pencurian:            '🥷',
  pemanfaatan_lahan:    '🏡',
}

/** Tower/Tiang:
 *  - Normal (no kerawanan): titik kecil berwarna tipe jalur
 *  - 1 kerawanan: lingkaran berwarna level + emoji jenis
 *  - 2+ kerawanan: lingkaran berwarna level + angka jumlah
 */
function makeTowerSvg(topLevel: string, tipe: 'SUTET'|'SUTT'|'SKTT'|'gardu', kerawanan: KerawananItem[]) {
  if (topLevel === 'normal') {
    // Titik kecil di sepanjang jalur
    let dotColor = '#076C9E'
    if (tipe === 'SUTET') dotColor = '#e65100'
    if (tipe === 'SKTT') dotColor = '#7c3aed'
    const W = 12, H = 12, cx = 6, cy = 6, r = 4
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${dotColor}" stroke="#FFFFFF" stroke-width="1.5"/>
    </svg>`
    return {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
      size: [W, H] as [number, number],
      anchor: [cx, cy] as [number, number],
    }
  }

  const BASE = 32
  const bgColor = LEVEL_BG[topLevel] ?? '#076C9E'
  const cx = BASE / 2, cy = BASE / 2, r = BASE / 2 - 1

  let innerContent: string
  if (kerawanan.length === 1) {
    // Satu jenis kerawanan — tampilkan emoji
    const emoji = KATEGORI_EMOJI[kerawanan[0].kategori] ?? '⚠️'
    innerContent = `<text x="${cx}" y="${cy + 7}" text-anchor="middle" font-size="16">${emoji}</text>`
  } else {
    // Lebih dari 1 — tampilkan jumlah
    innerContent = `<text x="${cx}" y="${cy + 5}" text-anchor="middle" font-family="Inter,Arial,sans-serif"
      font-size="13" font-weight="700" fill="#fff">${kerawanan.length}</text>`
  }

  const filterId = `te${topLevel}${kerawanan.length}`
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${BASE}" height="${BASE}" viewBox="0 0 ${BASE} ${BASE}">
    <defs>
      <filter id="${filterId}" x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="${bgColor}" flood-opacity="0.5"/>
      </filter>
    </defs>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${bgColor}" filter="url(#${filterId})"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="0.3"/>
    ${innerContent}
  </svg>`
  return {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
    size: [BASE, BASE] as [number, number],
    anchor: [BASE / 2, BASE / 2] as [number, number],
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

    markersRef.current.forEach((m) => m.setMap(null))
    markersRef.current = []

    const created = towers.map((tower) => {
      const isGardu = tower.tipe === 'gardu' || (tower.tipe as string) === 'garduInduk'
      const topLevel = getTopLevel(tower.kerawanan)
      const hasGangguan = tower.kerawanan?.length > 0

      if (isGardu) {
        const count = tower.kerawanan?.length ?? 0
        const iconUrl = makeGarduSvg(count)
        const W = count > 0 ? 52 : 26
        const marker = new window.google.maps.Marker({
          position: { lat: tower.lat, lng: tower.lng },
          map,
          title: tower.nama,
          icon: {
            url: iconUrl,
            scaledSize: new window.google.maps.Size(W, 26),
            anchor: new window.google.maps.Point(13, 13),
          },
          zIndex: hasGangguan ? 50 : 30,
        })
        marker.addListener('click', () => onSelect(tower))
        return marker
      } else {
        const iconData = makeTowerSvg(topLevel, tower.tipe as 'SUTET'|'SUTT'|'SKTT'|'gardu', tower.kerawanan)
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
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#076C9E', border: '1.5px solid #fff', boxShadow: '0 0 0 1px #076C9E', flexShrink: 0 }} />
        <span style={{ color: '#374151' }}>Tower (Normal)</span>
      </div>
      {/* Tower Kerawanan Aman */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="14" height="14" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
          <rect width="26" height="26" rx="13" fill="#16A34A"/>
          <path d={CELL_TOWER_PATH} fill="white"/>
        </svg>
        <span style={{ color: '#374151' }}>Kerawanan Aman</span>
      </div>
      {/* Tower Kerawanan Sedang */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="14" height="14" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
          <rect width="26" height="26" rx="13" fill="#F59E0B"/>
          <path d={CELL_TOWER_PATH} fill="white"/>
        </svg>
        <span style={{ color: '#374151' }}>Kerawanan Sedang</span>
      </div>
      {/* Tower Kerawanan Kritis */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="14" height="14" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
          <rect width="26" height="26" rx="13" fill="#D92D20"/>
          <path d={CELL_TOWER_PATH} fill="white"/>
        </svg>
        <span style={{ color: '#374151' }}>Kerawanan Kritis</span>
      </div>
    </div>
  )
}


// ─── Filter config ────────────────────────────────────────────────────────────

const FILTER_OPTIONS = [
  { key: null,                    label: 'Semua',            icon: null },
  { key: 'pekerjaan_pihak_lain',  label: 'PPL',              icon: 'https://api.iconify.design/twemoji/tractor.svg' },
  { key: 'kebakaran',             label: 'Kebakaran',        icon: 'https://api.iconify.design/twemoji/fire.svg' },
  { key: 'layangan',              label: 'Layangan',         icon: 'https://api.iconify.design/twemoji/kite.svg' },
  { key: 'pencurian',             label: 'Pencurian',        icon: 'https://api.iconify.design/twemoji/ninja-medium-dark-skin-tone.svg' },
  { key: 'pemanfaatan_lahan',     label: 'Pemanfaatan',      icon: 'https://api.iconify.design/twemoji/house-with-garden.svg' },
] as const

// ─── Main component ───────────────────────────────────────────────────────────

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
const CENTER  = { lat: -6.18, lng: 106.50 }

export default function TowerMapGoogle({ towers, onTowerClick, jalurKml }: Props) {
  const [selected, setSelected] = useState<FeaturedTower | null>(null)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  const displayTowers = useMemo<FeaturedTower[]>(() => {
    const all = towers ?? []
    if (!activeFilter) return all
    // Hanya tampilkan tower yang punya kerawanan sesuai filter
    return all.filter((t) =>
      t.kerawanan.some((k) => k.kategori === activeFilter)
    )
  }, [towers, activeFilter])

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

      {/* Filter floating — top center inside map */}
      <div style={{
        position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
        zIndex: 10, display: 'flex', gap: 6, alignItems: 'center',
        background: 'rgba(255,255,255,0.96)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        borderRadius: 999, padding: '6px 10px',
        backdropFilter: 'blur(6px)',
        flexWrap: 'nowrap', whiteSpace: 'nowrap',
      }}>
        {FILTER_OPTIONS.map((opt) => {
          const isActive = activeFilter === opt.key
          return (
            <button
              key={String(opt.key)}
              onClick={() => setActiveFilter(opt.key ?? null)}
              style={{
                padding: '4px 12px', borderRadius: 999,
                fontSize: 11, fontWeight: 600, cursor: 'pointer', lineHeight: 1.5,
                border: 'none', outline: 'none',
                background: isActive ? '#005DAA' : 'transparent',
                color: isActive ? '#fff' : '#374151',
                transition: 'background 0.15s, color 0.15s',
                display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              {opt.icon && (
                <img src={opt.icon} alt="" width={14} height={14} style={{ display: 'inline-block', flexShrink: 0 }} />
              )}
              {opt.label}
            </button>
          )
        })}
      </div>

      <Legend />
    </div>
  )
}
