'use client'

import { APIProvider, Map, InfoWindow, useMap } from '@vis.gl/react-google-maps'
import { useEffect, useRef, useState, useMemo } from 'react'
import { SlidersHorizontal, X as XIcon } from 'lucide-react'
import { JALUR_COLORS } from '@/lib/geodata'
import { TwIcon } from '@/components/ui/TwIcon'

// ─── Types ────────────────────────────────────────────────────────────────────

interface KerawananItem {
  kategori: string
  level: string
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
  bersertifikat?: boolean
}

export interface JalurKmlItem {
  id: number
  nama: string
  tipe: string   // SUTET | SUTT | SKTT
  warna: string | null
  path: Array<{ lat: number; lng: number; isMarker?: boolean }>
}

interface Props {
  towers?: FeaturedTower[]
  onTowerClick?: (tower: FeaturedTower) => void
  jalurKml?: JalurKmlItem[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LEVEL_PRIORITY: Record<string, number> = {
  kritis_tidak_terpenuhi: 4, kritis_terpenuhi: 3, kritis: 3, sedang: 2, aman: 1,
}
const LEVEL_COLOR: Record<string, string> = {
  kritis_tidak_terpenuhi: '#ef4444', kritis_terpenuhi: '#ef4444',
  kritis: '#ef4444', sedang: '#f59e0b', aman: '#22c55e', normal: '#3b82f6',
}
const KATEGORI_LABEL: Record<string, string> = {
  pekerjaan_pihak_lain: 'Pekerjaan Pihak Lain',
  kebakaran:   'Kebakaran',
  layangan:    'Layangan',
  pencurian:   'Pencurian',
  pemanfaatan_lahan: 'Pemanfaatan Lahan',
}

// DB may store short aliases (e.g. "ppl") — normalize to canonical keys
const KATEGORI_ALIAS: Record<string, string> = {
  ppl: 'pekerjaan_pihak_lain',
}
function normKat(k: string): string { return KATEGORI_ALIAS[k] ?? k }

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

/** Gardu Induk: design dari Figma — lingkaran hitam #1F2937 + vuesax/bold/bank icon, badge merah jika ada gangguan */
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
    <rect width="26" height="26" rx="13" fill="#1F2937" filter="url(#gs${count})"/>
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

// Match Figma token colors exactly (same as LEVEL_COLOR)
const LEVEL_BG: Record<string, string> = {
  kritis_tidak_terpenuhi: '#EF4444',
  kritis_terpenuhi:       '#EF4444',
  kritis:                 '#EF4444',
  sedang:                 '#F59E0B',
  aman:                   '#22C55E',
  normal:                 '#3B82F6',
}

const KATEGORI_EMOJI: Record<string, string> = {
  pekerjaan_pihak_lain: '🚧',
  kebakaran:            '🔥',
  layangan:             '🪁',
  pencurian:            '☠️',
  pemanfaatan_lahan:    '🏡',
}

// Twemoji SVG bodies from @iconify-json/twemoji (36x36 viewBox, no external deps)
const TWEMOJI_BODIES: Record<string, string> = {
  pekerjaan_pihak_lain: `<path fill="#ffcc4d" d="M36 15a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4z"/><path fill="#292f33" d="M6 3H4a4 4 0 0 0-4 4v2zm6 0L0 15c0 1.36.682 2.558 1.72 3.28L17 3zM7 19h5L28 3h-5zm16 0L35.892 6.108A4 4 0 0 0 33.64 3.36L18 19zm13-4v-3l-7 7h3a4 4 0 0 0 4-4"/><path fill="#99aab5" d="M4 19h5v14H4zm23 0h5v14h-5z"/>`,
  kebakaran: `<path fill="#f4900c" d="M35 19a17 17 0 0 0-1.04-5.868c-.46 5.389-3.333 8.157-6.335 6.868c-2.812-1.208-.917-5.917-.777-8.164c.236-3.809-.012-8.169-6.931-11.794c2.875 5.5.333 8.917-2.333 9.125c-2.958.231-5.667-2.542-4.667-7.042c-3.238 2.386-3.332 6.402-2.333 9c1.042 2.708-.042 4.958-2.583 5.208c-2.84.28-4.418-3.041-2.963-8.333A16.94 16.94 0 0 0 1 19c0 9.389 7.611 17 17 17s17-7.611 17-17"/><path fill="#ffcc4d" d="M28.394 23.999c.148 3.084-2.561 4.293-4.019 3.709c-2.106-.843-1.541-2.291-2.083-5.291s-2.625-5.083-5.708-6c2.25 6.333-1.247 8.667-3.08 9.084c-1.872.426-3.753-.001-3.968-4.007A11.96 11.96 0 0 0 6 30c0 .368.023.73.055 1.09C9.125 34.124 13.342 36 18 36s8.875-1.876 11.945-4.91c.032-.36.055-.722.055-1.09c0-2.187-.584-4.236-1.606-6.001"/>`,
  layangan: `<path fill="#55acee" d="M22.45 32.289L.592 18.752L6.55.711l18.042 5.958z"/><path fill="#269" d="M20.543 29.5a1 1 0 0 1-.895-.551L6.929 3.687a1 1 0 1 1 1.786-.9l12.72 25.264a1 1 0 0 1-.892 1.449"/><path fill="#269" d="M3.12 18.48a1 1 0 0 1-.451-1.893l18.947-9.54a1 1 0 1 1 .9 1.786l-18.947 9.54a1 1 0 0 1-.449.107"/><path fill="#3b88c3" d="M27.367 35.339c-2.44 0-4.521-1.268-6.199-3.784a1 1 0 1 1 1.664-1.11c1.564 2.343 3.359 3.228 5.644 2.781c.945-.184 1.793-.98 2.27-2.132c.701-1.693.47-3.668-.62-5.282c-2.006-2.971-2.777-6.787-2.063-10.21c.615-2.956 2.24-5.344 4.698-6.905a1 1 0 0 1 1.072 1.688c-2.516 1.598-3.462 3.941-3.813 5.625c-.604 2.905.055 6.151 1.765 8.683c1.466 2.172 1.769 4.851.811 7.167c-.734 1.772-2.131 3.018-3.736 3.329q-.768.15-1.493.15"/><path fill="#9266cc" d="M31.532 30.992c-.781-2.485-2.807-4.482-4.157-2.075c-1.342 2.392 1.04 3.456 3.717 2.74c.781 2.485 2.807 4.482 4.157 2.075c1.342-2.392-1.039-3.456-3.717-2.74m-1.425-7.039c2.377 1.066 5.215.876 4.311-1.731c-.898-2.592-3.275-1.517-4.517.961c-2.377-1.066-5.215-.876-4.311 1.731c.898 2.592 3.275 1.517 4.517-.961m-1.261-6.597c1.355 2.225 3.802 3.676 4.534 1.015c.727-2.645-1.84-3.105-4.267-1.766c-1.355-2.224-3.802-3.676-4.534-1.015c-.728 2.645 1.84 3.105 4.267 1.766m2.897-6.557c-.132 2.602 1.074 5.178 3.177 3.39c2.089-1.777.226-3.602-2.534-3.861c.132-2.602-1.074-5.178-3.177-3.39c-2.089 1.777-.225 3.602 2.534 3.861"/>`,
  pencurian: `<path fill="#ccd6dd" d="M27.865 16.751c0-6.242-4.411-9.988-9.927-9.988s-9.835 3.746-9.835 9.988c0 3.48-.103 6.485 3.897 7.89v2.722c0 1.034.966 1.872 2 1.872s2-.838 2-1.872v-1.97v1.97c0 1.034.965 1.872 2 1.872s2-.838 2-1.872v-1.97v1.97c0 1.034.966 1.872 2 1.872s2-.838 2-1.872v-2.722c4-1.405 3.865-4.41 3.865-7.89"/><circle cx="13.629" cy="15.503" r="3.121" fill="#292f33"/><path fill="#292f33" d="M25.488 15.503c0 1.724 0 3.121-3.121 3.121s-3.12-1.397-3.12-3.121a3.12 3.12 0 1 1 6.241 0m-6.301 5.656c-.157-.382-.626-.662-1.189-.662c-.561 0-1.031.28-1.188.662a.934.934 0 1 0 1.132 1.206l.056.004l.057-.004a.934.934 0 1 0 1.132-1.206"/><path fill="#aab8c2" d="M11 27c0-.367.075-.713.195-1.038c-.984-.447-1.831-1.082-2.503-1.97a280 280 0 0 1-3.127 2.695A3.47 3.47 0 0 0 3.5 26A3.5 3.5 0 0 0 0 29.5a3.49 3.49 0 0 0 3.046 3.454A3.49 3.49 0 0 0 6.5 36a3.5 3.5 0 0 0 3.5-3.5c0-.775-.26-1.485-.686-2.065c.6-.706 1.246-1.46 1.931-2.25A3 3 0 0 1 11 27m16.872-15.482c.884-.769 1.729-1.495 2.515-2.163A3.47 3.47 0 0 0 32.4 10a3.5 3.5 0 0 0 3.5-3.5a3.49 3.49 0 0 0-2.945-3.444A3.49 3.49 0 0 0 29.5 0A3.5 3.5 0 0 0 26 3.5c0 .775.26 1.485.687 2.065c-.594.7-1.233 1.445-1.911 2.227c1.3.871 2.361 2.095 3.096 3.726M3.5 10a3.47 3.47 0 0 0 2.065-.687c.799.679 1.661 1.419 2.564 2.204c.735-1.631 1.795-2.855 3.096-3.726a279 279 0 0 1-1.912-2.226A3.47 3.47 0 0 0 10 3.5A3.5 3.5 0 0 0 6.5 0a3.49 3.49 0 0 0-3.454 3.046A3.49 3.49 0 0 0 0 6.5A3.5 3.5 0 0 0 3.5 10m28.9 16c-.752 0-1.444.242-2.014.645c-.952-.809-1.99-1.701-3.079-2.653c-.672.889-1.519 1.523-2.503 1.971c.121.324.196.67.196 1.037c0 .421-.088.821-.245 1.185c.685.79 1.331 1.544 1.931 2.25A3.48 3.48 0 0 0 26 32.5c0 1.934 1.566 3.5 3.5 3.5a3.49 3.49 0 0 0 3.455-3.056A3.49 3.49 0 0 0 35.9 29.5c0-1.934-1.566-3.5-3.5-3.5"/>`,
  pemanfaatan_lahan: `<path fill="#5c913b" d="M36 33.5a1.5 1.5 0 0 1-1.5 1.5h-33a1.5 1.5 0 0 1 0-3h33a1.5 1.5 0 0 1 1.5 1.5"/><path fill="#a0041e" d="M12.344 14.702h-2a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5"/><path fill="#ffcc4d" d="M5.942 32c-.137-4.657-.506-8-.942-8s-.804 3.343-.941 8z"/><path fill="#77b255" d="M10 18.731C10 24.306 7.762 26 5 26s-5-1.694-5-7.269C0 13.154 4 5 5 5s5 8.154 5 13.731"/><path fill="#ffe8b6" d="M8 16L21 3l13 13v16H8z"/><path fill="#ffcc4d" d="M21 16h1v16h-1z"/><path fill="#66757f" d="M34 17a1 1 0 0 1-.707-.293L21 4.414L8.707 16.707a.999.999 0 1 1-1.414-1.414l13-13a1 1 0 0 1 1.414 0l13 13A.999.999 0 0 1 34 17"/><path fill="#66757f" d="M21 17a.999.999 0 0 1-.707-1.707l6.5-6.5a.999.999 0 1 1 1.414 1.414l-6.5 6.5A1 1 0 0 1 21 17"/><path fill="#c1694f" d="M13 26h4v6h-4z"/><path fill="#55acee" d="M13 17h4v4h-4zm12.5 0h4v4h-4zm0 9h4v4h-4z"/><path fill="#77b255" d="M10.625 29.991c0 1.613-.858 2.103-1.917 2.103c-1.058 0-1.917-.49-1.917-2.103s1.533-3.973 1.917-3.973s1.917 2.359 1.917 3.973m25.25 0c0 1.613-.858 2.103-1.917 2.103c-1.058 0-1.917-.49-1.917-2.103s1.533-3.973 1.917-3.973s1.917 2.359 1.917 3.973"/>`,
}

/**
 * Tower marker with badge system:
 * - Normal: small colored dot along route line
 * - With kerawanan: colored circle (status) + tower icon + Twemoji badge(s) top-right
 *   - 1 kerawanan  → circle + 1 emoji badge
 *   - 2 kerawanan  → circle + 2 emoji badges side by side
 *   - 3+ kerawanan → circle + count pill (e.g. "3+")
 */
function makeTowerSvg(topLevel: string, tipe: 'SUTET'|'SUTT'|'SKTT'|'gardu', kerawanan: KerawananItem[]) {
  if (topLevel === 'normal') {
    let dotColor = '#0288D1'
    if (tipe === 'SUTET') dotColor = '#e65100'
    if (tipe === 'SKTT') dotColor = '#FF00FF'
    const W = 8, H = 8, cx = 4, cy = 4, r = 3
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${dotColor}" stroke="#FFFFFF" stroke-width="1"/>
    </svg>`
    return {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
      size: [W, H] as [number, number],
      anchor: [cx, cy] as [number, number],
    }
  }

  // Layout constants
  const CIRCLE_D = 32          // main circle diameter
  const PAD_TOP  = 8           // top padding so badges don't clip
  const BADGE_D  = 18          // badge diameter
  const BADGE_OVERLAP = 6      // how many px badge overlaps circle edge
  const CX = CIRCLE_D / 2     // circle center x
  const CY = CIRCLE_D / 2 + PAD_TOP  // circle center y (shifted down for badge room)
  const R  = CIRCLE_D / 2 - 1
  const bgColor = LEVEL_BG[topLevel] ?? '#076C9E'
  const filterId = `f${topLevel}${kerawanan.length}`

  // Main circle + tower icon (nested SVG of CELL_TOWER_PATH in 26x26 viewBox)
  const mainCircle = `
    <defs>
      <filter id="${filterId}" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="${bgColor}" flood-opacity="0.45"/>
      </filter>
    </defs>
    <circle cx="${CX}" cy="${CY}" r="${R}" fill="${bgColor}" filter="url(#${filterId})"/>
    <circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.5"/>
    <svg x="${CX - 13}" y="${CY - 13}" width="26" height="26" viewBox="0 0 26 26">
      <path d="${CELL_TOWER_PATH}" fill="white" opacity="0.9"/>
    </svg>
  `

  const numBadges = kerawanan.length
  const BADGE_X0 = CIRCLE_D - BADGE_OVERLAP  // x where first badge starts
  let badgeContent = ''
  let SVG_W: number

  if (numBadges === 1) {
    SVG_W = CIRCLE_D + BADGE_D - BADGE_OVERLAP + 2
    const bx = BADGE_X0, by = 0
    const bcx = bx + BADGE_D / 2, bcy = by + BADGE_D / 2
    const iconBody = TWEMOJI_BODIES[normKat(kerawanan[0].kategori)] ?? ''
    badgeContent = `
      <circle cx="${bcx}" cy="${bcy}" r="${BADGE_D / 2 + 1.5}" fill="white"/>
      <svg x="${bx}" y="${by}" width="${BADGE_D}" height="${BADGE_D}" viewBox="0 0 36 36">${iconBody}</svg>
    `
  } else if (numBadges === 2) {
    const GAP = BADGE_D - 4  // slight overlap between badges
    SVG_W = CIRCLE_D + GAP + BADGE_D - BADGE_OVERLAP + 2
    for (let i = 0; i < 2; i++) {
      const bx = BADGE_X0 + i * GAP, by = 0
      const bcx = bx + BADGE_D / 2, bcy = by + BADGE_D / 2
      const iconBody = TWEMOJI_BODIES[normKat(kerawanan[i].kategori)] ?? ''
      badgeContent += `
        <circle cx="${bcx}" cy="${bcy}" r="${BADGE_D / 2 + 1.5}" fill="white"/>
        <svg x="${bx}" y="${by}" width="${BADGE_D}" height="${BADGE_D}" viewBox="0 0 36 36">${iconBody}</svg>
      `
    }
  } else {
    // 3+ → count pill
    SVG_W = CIRCLE_D + 26
    const px = BADGE_X0, py = 2
    badgeContent = `
      <rect x="${px}" y="${py}" width="24" height="15" rx="7.5" fill="#D32F2F"/>
      <text x="${px + 12}" y="${py + 10.5}" text-anchor="middle"
        font-family="Inter,Arial,sans-serif" font-size="9" font-weight="700" fill="white">${numBadges}+</text>
    `
  }

  const SVG_H = CIRCLE_D + PAD_TOP  // 40
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SVG_W}" height="${SVG_H}" viewBox="0 0 ${SVG_W} ${SVG_H}">
    ${mainCircle}
    ${badgeContent}
  </svg>`

  return {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
    size: [SVG_W, SVG_H] as [number, number],
    anchor: [CX, CY] as [number, number],
  }
}




// ─── KML Jalur polylines ───────────────────────────────────────────────────────

const KML_JALUR_COLORS: Record<string, string> = {
  SUTET: '#e65100',   // orange
  SUTT:  '#0288D1',   // blue
  SKTT:  '#FF00FF',   // magenta
}

function JalurKmlLines({ jalurKml, visibleTypes }: {
  jalurKml: JalurKmlItem[]
  visibleTypes: Set<string>
}) {
  const map = useMap()
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null)

  useEffect(() => {
    if (!map || !window.google || !jalurKml.length) return

    const lines: google.maps.Polyline[] = []
    const markers: google.maps.Marker[] = []

    // Shared InfoWindow for SKTT popups
    if (!infoWindowRef.current) {
      infoWindowRef.current = new window.google.maps.InfoWindow()
    }
    const infoWindow = infoWindowRef.current

    for (const jalur of jalurKml) {
      if (!jalur.path || jalur.path.length < 1) continue
      if (!visibleTypes.has(jalur.tipe)) continue

      const path = jalur.path.map((p) => ({ lat: p.lat, lng: p.lng }))
      const isSktt  = jalur.tipe === 'SKTT'
      const isSutet = jalur.tipe === 'SUTET'

      const color = jalur.warna ?? KML_JALUR_COLORS[jalur.tipe] ?? '#6B7280'

      if (path.length >= 2) {
        const strokeWeight  = isSutet ? 2 : 1.5
        const strokeOpacity = isSktt ? 0 : 0.85
        const zIndex = isSutet ? 36 : isSktt ? 16 : 26

        const icons: google.maps.PolylineOptions['icons'] = isSktt
          ? [{ icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 2, strokeColor: color }, offset: '0', repeat: '18px' }]
          : undefined

        if (!isSktt) {
          lines.push(new window.google.maps.Polyline({
            path, strokeColor: '#FFFFFF', strokeOpacity: 0.3,
            strokeWeight: strokeWeight + 1, zIndex: zIndex - 1, map,
          }))
        }

        const polyline = new window.google.maps.Polyline({
          path, strokeColor: color, strokeOpacity, strokeWeight, icons, zIndex, map,
        })
        lines.push(polyline)

        // Click on SKTT polyline → show route info
        if (isSktt) {
          polyline.addListener('click', (e: google.maps.PolyMouseEvent) => {
            infoWindow.setContent(`
              <div style="font-family:Inter,sans-serif;font-size:12px;padding:4px;min-width:180px">
                <div style="font-weight:700;font-size:12px;color:#1c1c1c;margin-bottom:4px">Jalur SKTT</div>
                <div style="color:#5f737f;font-size:12px;margin-bottom:4px">${jalur.nama}</div>
                <div style="font-size:11px;color:#97aab3">${jalur.path.length} titik koordinat</div>
              </div>
            `)
            infoWindow.setPosition(e.latLng ?? null)
            infoWindow.open(map)
          })
        }
      }

      // Black circle markers at isMarker points (joints) for SKTT
      if (isSktt) {
        for (const pt of jalur.path) {
          if (!pt.isMarker) continue
          const marker = new window.google.maps.Marker({
            position: { lat: pt.lat, lng: pt.lng },
            map,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 3,
              fillColor: color,
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 1,
            },
            title: jalur.nama,
            zIndex: 20,
          })
          marker.addListener('click', () => {
            infoWindow.setContent(`
              <div style="font-family:Inter,sans-serif;font-size:12px;padding:4px;min-width:180px">
                <div style="font-weight:700;font-size:12px;color:#1c1c1c;margin-bottom:4px">Jalur SKTT</div>
                <div style="color:#5f737f;font-size:12px;margin-bottom:4px">${jalur.nama}</div>
                <div style="font-size:11px;color:#97aab3">${Number(pt.lat).toFixed(6)}, ${Number(pt.lng).toFixed(6)}</div>
              </div>
            `)
            infoWindow.setPosition({ lat: pt.lat, lng: pt.lng })
            infoWindow.open(map)
          })
          markers.push(marker)
        }
      }
    }

    return () => {
      lines.forEach((l) => l.setMap(null))
      markers.forEach((m) => m.setMap(null))
      infoWindowRef.current?.close()
    }
  }, [map, jalurKml, visibleTypes])

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

const RISIKO_LABEL: Record<string, string> = {
  kritis_tidak_terpenuhi: 'Kritis',
  kritis_terpenuhi:       'Kritis',
  kritis:                 'Kritis',
  sedang:                 'Sedang',
  aman:                   'Aman',
}

function TowerPopup({ tower, onClose }: { tower: FeaturedTower; onClose: () => void }) {
  const level = getTopLevel(tower.kerawanan)
  const levelColor = LEVEL_COLOR[level]
  const hasKerawanan = tower.kerawanan.length > 0
  const shown = tower.kerawanan.slice(0, 3)
  const extra = tower.kerawanan.length - shown.length

  return (
    <InfoWindow position={{ lat: tower.lat, lng: tower.lng }} onCloseClick={onClose}>
      <div style={{ minWidth: 240, maxWidth: 280, fontFamily: 'Inter, sans-serif', fontSize: 12, padding: 4 }}>
        <div style={{ fontWeight: 700, fontSize: 12, color: '#1c1c1c', marginBottom: 6 }}>
          Informasi Tower
        </div>
        <div style={{ color: '#1c1c1c', fontWeight: 600, marginBottom: 2, lineHeight: 1.4 }}>{tower.nama}</div>
        <div style={{ color: '#97aab3', fontSize: 11, marginBottom: 6 }}>
          {tower.tipe}{tower.tegangan ? ` · ${tower.tegangan}` : ''}
        </div>
        <div style={{ marginBottom: 10, fontSize: 11, fontWeight: 700, color: tower.bersertifikat ? '#16a34a' : '#dc2626' }}>
          {tower.bersertifikat ? 'Bersertifikat' : 'Tidak Bersertifikat'}
        </div>

        {hasKerawanan ? (
          <div>
            <div style={{ fontWeight: 600, color: '#1c1c1c', marginBottom: 6 }}>
              Kerawanan{tower.kerawanan.length > 1 ? ` (${tower.kerawanan.length})` : ''}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {shown.map((k, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14, lineHeight: 1 }}>{KATEGORI_EMOJI[normKat(k.kategori)] ?? '⚠️'}</span>
                  <span style={{ color: '#374151', fontSize: 11, flex: 1 }}>{KATEGORI_LABEL[normKat(k.kategori)] ?? k.kategori}</span>
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 999,
                    background: (LEVEL_COLOR[k.level] ?? '#94a3b8') + '22',
                    color: LEVEL_COLOR[k.level] ?? '#94a3b8',
                    textTransform: 'uppercase', whiteSpace: 'nowrap',
                  }}>
                    {RISIKO_LABEL[k.level] ?? k.level}
                  </span>
                </div>
              ))}
              {extra > 0 && (
                <div style={{ color: '#97aab3', fontSize: 10, fontStyle: 'italic' }}>
                  +{extra} lainnya — klik tower untuk detail
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ color: '#5f737f', fontSize: 11 }}>Tidak ada kerawanan aktif</div>
        )}

        <div style={{ marginTop: 10, color: '#97aab3', fontSize: 10 }}>
          Terakhir update: {tower.updatedAt ? new Date(tower.updatedAt).toLocaleString('id-ID') : '—'}
        </div>
        {level !== 'normal' && (
          <div style={{ marginTop: 8, padding: '3px 8px', background: levelColor + '20', borderRadius: 999, display: 'inline-block', fontSize: 10, fontWeight: 700, color: levelColor }}>
            {RISIKO_LABEL[level] ?? level}
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
      <p style={{ fontWeight: 700, fontSize: 11.5, marginBottom: 4, color: '#0f172a' }}>Legenda</p>
      {/* Tower Normal per tipe */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#0288D1', border: '1.5px solid #fff', boxShadow: '0 0 0 1px #0288D1', flexShrink: 0 }} />
        <span style={{ color: '#374151' }}>Tower SUTT (Normal)</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#e65100', border: '1.5px solid #fff', boxShadow: '0 0 0 1px #e65100', flexShrink: 0 }} />
        <span style={{ color: '#374151' }}>Tower SUTET (Normal)</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF00FF', border: '1.5px solid #fff', boxShadow: '0 0 0 1px #FF00FF', flexShrink: 0 }} />
        <span style={{ color: '#374151' }}>SKTT (Normal)</span>
      </div>
      {/* Tower with kerawanan — status colors */}
      {([
        { bg: '#22C55E', label: 'Aman' },
        { bg: '#F59E0B', label: 'Sedang' },
        { bg: '#EF4444', label: 'Kritis' },
      ] as { bg: string; label: string }[]).map(({ bg, label }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 26 26" fill="none" style={{ flexShrink: 0 }}>
            <rect width="26" height="26" rx="13" fill={bg}/>
            <path d={CELL_TOWER_PATH} fill="white"/>
          </svg>
          <span style={{ color: '#374151' }}>Kerawanan {label}</span>
        </div>
      ))}

    </div>
  )
}


// ─── Filter config ────────────────────────────────────────────────────────────

const JENIS_FILTER_OPTIONS = [
  { key: 'pekerjaan_pihak_lain', label: 'Pekerjaan Pihak Lain (PPL)' },
  { key: 'kebakaran',            label: 'Kebakaran' },
  { key: 'layangan',             label: 'Layang-layang' },
  { key: 'pemanfaatan_lahan',    label: 'Pemanfaatan Lahan' },
  { key: 'pencurian',            label: 'Pencurian' },
] as const

// ─── Main component ───────────────────────────────────────────────────────────

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
const CENTER  = { lat: -6.18, lng: 106.50 }

const ALL_LAYER_TYPES = ['SUTT', 'SUTET', 'SKTT'] as const
type LayerType = typeof ALL_LAYER_TYPES[number]

export default function TowerMapGoogle({ towers, onTowerClick, jalurKml }: Props) {
  const [selected, setSelected] = useState<FeaturedTower | null>(null)
  const [activeJenis, setActiveJenis] = useState<string[]>([])
  const [visibleLayers, setVisibleLayers] = useState<Set<string>>(new Set(['SUTT', 'SUTET', 'SKTT']))
  const [filterOpen, setFilterOpen] = useState(false)

  function toggleJenis(k: string) {
    setActiveJenis(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k])
  }
  function toggleLayer(k: string) {
    setVisibleLayers(prev => {
      const next = new Set(prev)
      if (next.has(k)) next.delete(k); else next.add(k)
      return next
    })
  }
  function clearFilters() {
    setActiveJenis([])
    setVisibleLayers(new Set(['SUTT', 'SUTET', 'SKTT']))
  }

  const displayTowers = useMemo<FeaturedTower[]>(() => {
    const all = towers ?? []
    const byLayer = all.filter((t) => t.tipe === 'gardu' || visibleLayers.has(t.tipe))
    if (activeJenis.length === 0) return byLayer
    // Filter at the kerawanan level (not just at the tower level), so the
    // marker color, badge count, and popup only reflect the selected jenis.
    return byLayer.flatMap((t) => {
      const matching = t.kerawanan.filter((k) => activeJenis.includes(normKat(k.kategori)))
      if (matching.length === 0) return []
      return [{ ...t, kerawanan: matching }]
    })
  }, [towers, activeJenis, visibleLayers])

  const hasActiveFilter = activeJenis.length > 0 || visibleLayers.size < ALL_LAYER_TYPES.length

  const handleSelect = useMemo(() => (t: FeaturedTower) => {
    setSelected(t)
    onTowerClick?.(t)
  }, [onTowerClick])

  // Only show layer options that have data — from either jalur or towers
  const availableLayerTypes = useMemo(() => {
    const types = new Set<string>()
    for (const j of jalurKml ?? []) types.add(j.tipe)
    for (const t of towers ?? []) if (t.tipe !== 'gardu') types.add(t.tipe)
    return ALL_LAYER_TYPES.filter((t) => types.has(t))
  }, [jalurKml, towers])

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
          {jalurKml && jalurKml.length > 0 && <JalurKmlLines jalurKml={jalurKml} visibleTypes={visibleLayers} />}
          <TowerMarkers towers={displayTowers} onSelect={handleSelect} />
          {selected && <TowerPopup tower={selected} onClose={() => setSelected(null)} />}
        </Map>
      </APIProvider>

      {/* Filter button — top right of map */}
      <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 20 }}>
        <button
          onClick={() => setFilterOpen(v => !v)}
          aria-label="Filter"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '0 12px', height: 36, borderRadius: 8,
            background: filterOpen ? '#076c9e' : '#fff',
            color: filterOpen ? '#fff' : '#374151',
            border: '1px solid #E1E8EC',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
            position: 'relative',
          }}
        >
          <SlidersHorizontal size={15} />
          Filter
          {hasActiveFilter && !filterOpen && (
            <span style={{
              position: 'absolute', top: 4, right: 4,
              width: 7, height: 7, borderRadius: '50%',
              background: '#D92D20',
            }} />
          )}
        </button>

        {filterOpen && (
          <div style={{
            position: 'absolute', top: 42, right: 0,
            background: '#fff', borderRadius: 10,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            border: '1px solid #E1E8EC',
            padding: 12, width: 240, maxWidth: '85vw',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1C1C1C' }}>Filter</h3>
              <button onClick={() => setFilterOpen(false)} style={{ padding: 2, background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <XIcon size={16} />
              </button>
            </div>

            <p style={{ fontSize: 11, fontWeight: 700, color: '#5F737F', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>Jenis Kerawanan</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
              {JENIS_FILTER_OPTIONS.map(({ key, label }) => {
                const active = activeJenis.includes(key)
                return (
                  <button
                    key={key}
                    onClick={() => toggleJenis(key)}
                    style={{
                      padding: '4px 10px', borderRadius: 16, fontSize: 11, fontWeight: 500,
                      cursor: 'pointer',
                      border: active ? '1px solid #076C9E' : '1px solid #E1E8EC',
                      background: active ? '#076C9E' : '#fff',
                      color: active ? '#FFFFFF' : '#5F737F',
                    }}
                  >
                    {label}
                  </button>
                )
              })}
            </div>

            <p style={{ fontSize: 11, fontWeight: 700, color: '#5F737F', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>Jalur</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
              {(['SKTT', 'SUTET', 'SUTT'] as const)
                .filter((t) => availableLayerTypes.length === 0 || availableLayerTypes.includes(t))
                .map((t) => {
                  const active = visibleLayers.has(t)
                  return (
                    <button
                      key={t}
                      onClick={() => toggleLayer(t)}
                      style={{
                        padding: '4px 12px', borderRadius: 16, fontSize: 11, fontWeight: 500,
                        cursor: 'pointer',
                        border: active ? '1px solid #076C9E' : '1px solid #E1E8EC',
                        background: active ? '#076C9E' : '#fff',
                        color: active ? '#FFFFFF' : '#5F737F',
                      }}
                    >
                      {t}
                    </button>
                  )
                })}
            </div>

            {hasActiveFilter && (
              <button
                onClick={clearFilters}
                style={{
                  width: '100%', padding: '7px 0', borderRadius: 16, fontSize: 12, fontWeight: 600,
                  background: '#fff', color: '#dc2626', border: '1px solid #fecaca', cursor: 'pointer',
                }}
              >
                Hapus Filter
              </button>
            )}
          </div>
        )}
      </div>

      <Legend />
    </div>
  )
}
