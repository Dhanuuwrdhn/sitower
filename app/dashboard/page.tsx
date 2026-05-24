'use client'

import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { CloudUpload } from 'lucide-react'
import Swal from 'sweetalert2'
import { laporanApi, towersApi, asetApi, importApi, jalurKmlApi } from '@/lib/api'
import B2WLoader from '@/components/ui/B2WLoader'
import { TwIcon } from '@/components/ui/TwIcon'

// Auto-pilih Google Maps (jika ada API key) atau Leaflet (fallback) — lihat TowerMapView
const TowerMap = dynamic(() => import('@/components/map/TowerMapView'), { ssr: false })

// ── Types ────────────────────────────────────────────────────────────────────
interface Stats {
  ppl: number
  kebakaran: number
  layangan: number
  pencurian: number
  pemanfaatan: number  // API returns "pemanfaatan", not "pemanfaatan_lahan"
}

interface RecentRow {
  id: string
  tanggal: string
  ruas: string
  jenisGangguan: string
  lineWalker: string
  levelRisiko: string
  progresLaporan: string | null
}

const LEVEL_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  kritis_terpenuhi:       { bg: '#FEE4E2', text: '#D92D20', label: 'Kritis'       },
  kritis_tidak_terpenuhi: { bg: '#FEE4E2', text: '#912018', label: 'Kritis'  },
  sedang:                 { bg: '#FFFAEB', text: '#F79009', label: 'Sedang'                  },
  aman:                   { bg: '#ECFDF3', text: '#039855', label: 'Aman'                    },
  kritis:                 { bg: '#FEE4E2', text: '#D92D20', label: 'Kritis'                  },
}

const PROGRESS_BADGE_COLOR: Record<string, { bg: string; text: string }> = {
  laporan_baru:        { bg: '#076C9E', text: '#FFFFFF' },
  berita_acara:        { bg: '#076C9E', text: '#FFFFFF' },
  spanduk:             { bg: '#076C9E', text: '#FFFFFF' },
  brosur:              { bg: '#076C9E', text: '#FFFFFF' },
  sedang_berlangsung:  { bg: '#076C9E', text: '#FFFFFF' },
  selesai:             { bg: '#039855', text: '#FFFFFF' },
  tidak_ada_aktifitas: { bg: '#66757F', text: '#FFFFFF' },
  tidak_ada_aktivitas: { bg: '#66757F', text: '#FFFFFF' },
}

const PROGRESS_TIPE_LABEL: Record<string, string> = {
  spanduk:             'Spanduk',
  brosur:              'Brosur',
  laporan_baru:        'Laporan Baru',
  berita_acara:        'Berita Acara',
  sedang_berlangsung:  'Sedang Berlangsung',
  selesai:             'Selesai',
  tidak_ada_aktifitas: 'Tidak Ada Aktivitas',
  tidak_ada_aktivitas: 'Tidak Ada Aktivitas',
}

// Normalize legacy/typo variants so the badge config always matches.
function normalizeProgresValue(v: string | null | undefined): string {
  if (!v) return ''
  const t = v.toString().toLowerCase().trim().replace(/\s+/g, '_')
  // Treat aktifitas/aktivitas as the same value.
  if (t === 'tidak_ada_aktivitas') return 'tidak_ada_aktifitas'
  return t
}

function LevelBadge({ level }: { level: string }) {
  const cfg = LEVEL_BADGE[level?.toLowerCase()]
  if (!cfg) return <span style={{ color: '#5f737f', fontSize: 12 }}>—</span>
  const blink = level?.toLowerCase() === 'kritis_tidak_terpenuhi'
  return (
    <span className={blink ? 'badge-blink' : undefined} style={{ background: cfg.bg, color: cfg.text, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 10px', borderRadius: 99, fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap' }}>
      {cfg.label}
    </span>
  )
}

function ProgressBadge({ tipe }: { tipe: string | null }) {
  if (!tipe) return <span style={{ color: '#5f737f', fontSize: 12 }}>—</span>
  const key = normalizeProgresValue(tipe)
  const cfg = PROGRESS_BADGE_COLOR[key] ?? PROGRESS_BADGE_COLOR[tipe] ?? { bg: '#5F737F', text: '#FFFFFF' }
  const label = PROGRESS_TIPE_LABEL[key] ?? PROGRESS_TIPE_LABEL[tipe] ?? tipe
  return (
    <span style={{ background: cfg.bg, color: cfg.text, display: 'inline-flex', alignItems: 'center', padding: '2px 10px', borderRadius: 99, fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap' }}>
      {label}
    </span>
  )
}

function formatTanggal(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── Fallback data ─────────────────────────────────────────────────────────────
const MOCK_STATS: Stats = { ppl: 0, kebakaran: 0, layangan: 0, pencurian: 0, pemanfaatan: 0 }

const MOCK_RECENT: RecentRow[] = []

// ── Stat card config ───────────────────────────────────────────────────────────
const STAT_CARDS = [
  { key: 'ppl',         label: 'Pekerjaan Pihak Lain',    emoji: '🚧', numColor: '#005DAA', jenis: 'pekerjaan_pihak_lain', extraParams: '&status=berlangsung,tidak_ada_aktifitas' },
  { key: 'kebakaran',   label: 'Kebakaran',                emoji: '🔥', numColor: '#FD2D03', jenis: 'kebakaran',            extraParams: ''                                      },
  { key: 'layangan',    label: 'Layangan',                 emoji: '🪁', numColor: '#3B84CE', jenis: 'layangan',             extraParams: ''                                      },
  { key: 'pencurian',   label: 'Pencurian',                emoji: '☠️', numColor: '#1B1B1B', jenis: 'pencurian',            extraParams: ''                                      },
  { key: 'pemanfaatan', label: 'Pemanfaatan Lahan',        emoji: '🏡', numColor: '#059669', jenis: 'pemanfaatan_lahan',    extraParams: ''                                      },
] as const

// ── Status config — Figma tokens ──────────────────────────────────────────────
const STATUS_LABEL: Record<string, string> = {
  berlangsung:         'Sedang Berlangsung',
  selesai:             'Sudah Selesai',
  tidak_ada_aktifitas: 'Tidak Ada Aktifitas',
}

const JENIS_LABEL: Record<string, string> = {
  pekerjaan_pihak_lain: 'Pekerjaan Pihak Lain (PPL)',
  kebakaran:            'Kebakaran',
  layangan:             'Layang-layang',
  pencurian:            'Pencurian',
  pemanfaatan_lahan:    'Pemanfaatan Lahan',
}

// ── Donut Chart — 4 segments: Aman / Sedang / Kritis / Kritis ────
function DonutChart({ noActivity, aman, sedang, kritisTerpenuhi, kritisLdakTerpenuhi }: {
  noActivity: number; aman: number; sedang: number; kritisTerpenuhi: number; kritisLdakTerpenuhi: number
}) {
  const total = noActivity + aman + sedang + kritisTerpenuhi + kritisLdakTerpenuhi
  const cx = 80, cy = 80, r = 60, strokeW = 24
  const circumference = 2 * Math.PI * r
  const startOffset = circumference * 0.25

  if (total === 0) {
    return (
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E1E8EC" strokeWidth={strokeW} />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize="28" fontWeight="700" fill="#1C1C1C">0</text>
      </svg>
    )
  }

  const naArc  = circumference * (noActivity          / total)
  const amanArc  = circumference * (aman              / total)
  const sedArc   = circumference * (sedang            / total)
  const ktArc    = circumference * (kritisTerpenuhi   / total)
  const kntArc   = circumference * (kritisLdakTerpenuhi / total)

  return (
    <svg width="160" height="160" viewBox="0 0 160 160">
      {/* Tidak Ada Aktivitas — #CBD5E1 */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#CBD5E1" strokeWidth={strokeW}
        strokeDasharray={`${naArc} ${circumference - naArc}`}
        strokeDashoffset={startOffset}
        strokeLinecap="butt"
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
      {/* Aman — #039855 */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#039855" strokeWidth={strokeW}
        strokeDasharray={`${amanArc} ${circumference - amanArc}`}
        strokeDashoffset={startOffset - naArc}
        strokeLinecap="butt"
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
      {/* Sedang — #F79009 */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F79009" strokeWidth={strokeW}
        strokeDasharray={`${sedArc} ${circumference - sedArc}`}
        strokeDashoffset={startOffset - naArc - amanArc}
        strokeLinecap="butt"
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
      {/* Kritis Terpenuhi — #EF4444 */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EF4444" strokeWidth={strokeW}
        strokeDasharray={`${ktArc} ${circumference - ktArc}`}
        strokeDashoffset={startOffset - naArc - amanArc - sedArc}
        strokeLinecap="butt"
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
      {/* Kritis Tidak Terpenuhi — #991B1B */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#991B1B" strokeWidth={strokeW}
        strokeDasharray={`${kntArc} ${circumference - kntArc}`}
        strokeDashoffset={startOffset - naArc - amanArc - sedArc - ktArc}
        strokeLinecap="butt"
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
      {/* Center total */}
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize="28" fontWeight="700" fill="#1C1C1C">
        {total}
      </text>
    </svg>
  )
}

// ── Status Pill — Figma design ────────────────────────────────────────────────
function StatusPill({ status }: { status: string }) {
  const isBerlangsung = status === 'berlangsung'
  const isSelesai = status === 'selesai'
  return (
    <span className={`dash-status-pill ${isBerlangsung ? 'dash-status-berlangsung' : isSelesai ? 'dash-status-selesai' : 'dash-status-default'}`}>
      {STATUS_LABEL[status] ?? status}
    </span>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats>(MOCK_STATS)
  const [recent, setRecent] = useState<RecentRow[]>(MOCK_RECENT)
  const [alertCount, setAlertCount] = useState(0)
  const [towerKerawanan, setTowerKerawanan] = useState<any[]>([])
  const [totalTower, setTotalTower] = useState(0)
  const [noActivityTower, setNoActivityTower] = useState(0)
  const [amanTower, setAmanTower] = useState(0)
  const [sedangTower, setSedangTower] = useState(0)
  const [kritisTerpenuhiTower, setKritisTerpenuhiTower] = useState(0)
  const [kritisLdakTerpenuhiTower, setKritisLdakTerpenuhiTower] = useState(0)
  const [loading, setLoading] = useState(true)
  const [jalurKmlData, setJalurKmlData] = useState<any[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const res = await importApi.import('laporan', file)
      const total = res.data?.total ?? 0
      
      if (total === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Tidak Ada Data',
          text: 'Tidak ditemukan baris data laporan yang valid untuk diimport.',
          confirmButtonColor: '#3085d6'
        })
      } else {
        await Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: `Berhasil import ${total} riwayat gangguan dari Excel!`,
          confirmButtonColor: '#3085d6'
        })
        window.location.reload()
      }
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Import',
        text: err.response?.data?.message || err.message,
        confirmButtonColor: '#d33'
      })
    }
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  useEffect(() => {
    Promise.allSettled([
      // getStats returns distinct-tower-per-jenis counts among active laporan
      // (berlangsung/tidak_ada_aktifitas only) so jenis cards stay in sync
      // with the markers shown on the map.
      laporanApi.getStats()
        .then((res) => setStats(res.data))
        .catch(() => {}),

      laporanApi.getAll({ limit: 5 })
        .then((res) => {
          const rows = (res.data.data ?? res.data) as any[]
          setRecent(rows.slice(0, 5).map((r: any) => ({
            id: r.id,
            tanggal: r.tanggal ?? '—',
            ruas: r.tower?.nama ?? r.tower?.id ?? r.towerId ?? '—',
            jenisGangguan: JENIS_LABEL[r.jenisGangguan] ?? r.jenisGangguan ?? '—',
            lineWalker: r.pelapor?.nama ?? '—',
            levelRisiko: r.levelRisiko ?? '—',
            progresLaporan: r.progresLaporan ?? r.latestProgressTipe ?? null,
          })))
        })
        .catch(() => {}),

      // Derive both map markers AND card counts from the same overview response
      // so the donut chart always matches what the map shows.
      asetApi.getMapOverview()
        .then((res) => {
          const overview = res.data
          const getTipe = (name: string): 'SUTET' | 'SUTT' | 'SKTT' | 'gardu' => {
            const n = (name ?? '').toUpperCase()
            if (n.includes('SUTET')) return 'SUTET'
            if (n.includes('SKTT') || n.includes('JOINT') || n.startsWith('TRS ')) return 'SKTT'
            return 'SUTT'
          }

          const rawTowers: any[] = overview.towers ?? []

          // Compute status counts using the same overallStatus the map uses.
          // Towers with no laporan (kerawanan array empty) → "Tidak Ada Aktivitas".
          let noActivity = 0, aman = 0, sedang = 0, kritisTerpenuhi = 0, kritisLdak = 0
          for (const t of rawTowers) {
            const hasActivity = Array.isArray(t.kerawanan) && t.kerawanan.length > 0
            if (!hasActivity) { noActivity++; continue }
            const s: string = t.status ?? 'aman'
            if (s === 'sedang') sedang++
            else if (s === 'kritis_tidak_terpenuhi') kritisLdak++
            else if (s === 'kritis_terpenuhi' || s === 'kritis') kritisTerpenuhi++
            else aman++
          }
          setTotalTower(rawTowers.length)
          setNoActivityTower(noActivity)
          setAmanTower(aman)
          setSedangTower(sedang)
          setKritisTerpenuhiTower(kritisTerpenuhi)
          setKritisLdakTerpenuhiTower(kritisLdak)
          setAlertCount(sedang + kritisTerpenuhi + kritisLdak)

          const mapTowers = rawTowers.map((t: any) => {
            const items: { kategori: string; level: string; status: string }[] =
              Array.isArray(t.kerawanan) && t.kerawanan.length > 0
                ? t.kerawanan.map((k: any) => ({
                    kategori:  k.jenis,
                    level:     k.level ?? 'aman',
                    status:    k.level ?? 'aman',
                    progres:   k.progres,
                    laporanId: k.laporan_id,
                  }))
                : (t.kerawanan_types?.length
                  ? t.kerawanan_types.map((jenis: string) => ({
                      kategori: jenis,
                      level:    (t.status ?? 'aman') as string,
                      status:   t.status ?? 'aman',
                    }))
                  : [])
            return {
              id:           t.id,
              nama:         t.name,
              lat:          t.lat,
              lng:          t.lng,
              tipe:         t.tipe ?? getTipe(t.name),
              bersertifikat: t.bersertifikat ?? false,
              hasCctv:      t.hasCctv ?? false,
              updatedAt:    t.updated_at ?? null,
              kerawanan:    items,
            }
          })
          setTowerKerawanan(mapTowers)
        })
        .catch(() => {}),

      // Fetch jalur KML untuk ditampilkan di peta
      jalurKmlApi.getAll()
        .then((res) => setJalurKmlData(res.data?.data ?? []))
        .catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [])

  const statValues: Record<string, number> = {
    ppl: stats.ppl,
    kebakaran: stats.kebakaran,
    layangan: stats.layangan,
    pencurian: stats.pencurian,
    pemanfaatan: stats.pemanfaatan,
  }

  const fmtPct = (n: number, total: number) => {
    if (total <= 0) return '0'
    const pct = (n / total) * 100
    if (pct === 0 || pct === 100) return String(pct)
    return pct.toFixed(2).replace(/\.?0+$/, '')
  }
  const noActivityPct = fmtPct(noActivityTower, totalTower)
  const amanPct       = fmtPct(amanTower, totalTower)
  const sedangPct     = fmtPct(sedangTower, totalTower)
  const ktPct         = fmtPct(kritisTerpenuhiTower, totalTower)
  const kntPct        = fmtPct(kritisLdakTerpenuhiTower, totalTower)
  const kritisPct     = fmtPct(kritisTerpenuhiTower + kritisLdakTerpenuhiTower, totalTower)

  if (loading) return <B2WLoader label="Memuat dashboard..." />

  return (
    <div className="dash-container">
      {/* Alert banner — Removed as requested */}

      {/* Title */}
      <h1 className="dash-title">Dashboard</h1>

      {/* Stat cards — 5 columns (desktop) */}
      <div className="dash-stat-row">
        {STAT_CARDS.map((card) => (
          <div key={card.key} className="dash-stat-card" style={{ cursor: 'pointer' }} onClick={() => router.push('/laporan/gangguan?jenis=' + card.jenis + card.extraParams)}>
            <div className="dash-stat-head">
              <TwIcon emoji={card.emoji} size={32} />
              <span className="dash-stat-label">{card.label}</span>
            </div>
            <span className="dash-stat-number" style={{ color: card.numColor }}>
              {statValues[card.key]}
            </span>
          </div>
        ))}
      </div>

      {/* PWA stat rows — 2+3 layout (Figma node 100:1912, mobile only) */}
      <div className="pwa-stat-rows">
        {/* Row 1: PPL + Pemanfaatan */}
        <div className="pwa-stat-row-2">
          {[STAT_CARDS[0], STAT_CARDS[4]].map((card) => (
            <div key={card.key} className="pwa-stat-card" style={{ cursor: 'pointer' }} onClick={() => router.push('/laporan/gangguan?jenis=' + card.jenis + card.extraParams)}>
              <div className="pwa-stat-head">
                <TwIcon emoji={card.emoji} size={28} />
                <span className="pwa-stat-label">{card.label}</span>
              </div>
              <span className="pwa-stat-number" style={{ color: card.numColor }}>
                {statValues[card.key]}
              </span>
            </div>
          ))}
        </div>
        {/* Row 2: Pencurian + Kebakaran + Layangan */}
        <div className="pwa-stat-row-3">
          {[STAT_CARDS[3], STAT_CARDS[1], STAT_CARDS[2]].map((card) => (
            <div key={card.key} className="pwa-stat-card" style={{ cursor: 'pointer' }} onClick={() => router.push('/laporan/gangguan?jenis=' + card.jenis + card.extraParams)}>
              <div className="pwa-stat-head">
                <TwIcon emoji={card.emoji} size={24} />
                <span className="pwa-stat-label">{card.label}</span>
              </div>
              <span className="pwa-stat-number" style={{ color: card.numColor, fontSize: 20 }}>
                {statValues[card.key]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Middle row: Total Aset + Peta */}
      <div className="dash-mid-row">
        {/* Total Aset Transmisi card — Figma node 229:4349 */}
        <div className="dash-aset-card">

          {/* Section 1 — Title + divider */}
          <div className="dash-aset-section-head">
            <h2 className="dash-section-title">Total Aset Transmisi</h2>
            <div className="dash-aset-divider" />
          </div>

          {/* Section 2 — Chart (kiri) + Total label+num (kanan), Figma: HORIZONTAL gap=24 */}
          <div className="dash-aset-body">
            <DonutChart noActivity={noActivityTower} aman={amanTower} sedang={sedangTower} kritisTerpenuhi={kritisTerpenuhiTower} kritisLdakTerpenuhi={kritisLdakTerpenuhiTower} />
            <div className="dash-aset-total">
              <span className="dash-aset-total-label">Total Aset{'\n'}Transmisi</span>
              <span className="dash-aset-total-num">{totalTower}</span>
            </div>
          </div>

          {/* Section 3 — Legend rows, Figma: VERTICAL gap=16, each row space-between */}
          <div className="dash-aset-legend">
            {[
              { color: '#CBD5E1', label: 'Tidak Ada Aktivitas',   count: noActivityTower,           pct: noActivityPct },
              { color: '#039855', label: 'Aman',                  count: amanTower,                 pct: amanPct       },
              { color: '#F79009', label: 'Sedang',                count: sedangTower,               pct: sedangPct     },
              { color: '#EF4444', label: 'Kritis', count: kritisTerpenuhiTower + kritisLdakTerpenuhiTower, pct: kritisPct },
            ].map((row) => (
              <div key={row.label} className="dash-aset-legend-item">
                <div className="dash-legend-header">
                  <span className="dash-legend-dot" style={{ background: row.color }} />
                  <span className="dash-legend-label">{row.label}</span>
                </div>
                <div className="dash-legend-values">
                  <span className="dash-legend-num">{row.count}</span>
                  <span className="dash-legend-pct">({row.pct}%)</span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Peta Jalur */}
        <div className="dash-map-card">
          <div className="dash-section-head">
            <h2 className="dash-section-title">Peta Jalur</h2>
          </div>
          <div className="dash-aset-divider" />
          <div className="dash-map-container">
            <TowerMap
              towers={towerKerawanan.length > 0 ? towerKerawanan : undefined}
              jalurKml={jalurKmlData}
            />
          </div>
        </div>
      </div>

      {/* Riwayat Gangguan Terbaru */}
      <div className="dash-riwayat-card">
        <div className="dash-riwayat-head">
          <h2 className="dash-section-title">Riwayat Kerawanan Transmisi Terbaru</h2>
          <div className="dash-riwayat-actions">
            <a href="/laporan/gangguan" className="dash-see-all-btn">
              Lihat Semua Riwayat Kerawanan Transmisi
            </a>
          </div>
        </div>
        <div className="dash-aset-divider" />
        
        {/* Desktop Table */}
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
                <tr>
                <th>Tanggal</th>
                <th>Penghantar</th>
                <th>Jenis Kerawanan</th>
                <th>Petugas</th>
                <th>Status Kerawanan</th>
                <th>Progres Laporan</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((row) => (
                <tr key={row.id}>
                  <td className="text-[14px] text-[#5f737f] whitespace-nowrap">{formatTanggal(row.tanggal)}</td>
                  <td className="text-[14px] text-[#5f737f]" style={{ maxWidth: 220 }}>
                    <span className="block truncate" title={row.ruas}>{row.ruas}</span>
                  </td>
                  <td className="text-[14px] text-[#5f737f]">{row.jenisGangguan}</td>
                  <td className="text-[14px] text-[#5f737f]">{row.lineWalker}</td>
                  <td><LevelBadge level={row.levelRisiko} /></td>
                  <td><ProgressBadge tipe={row.progresLaporan} /></td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#5F737F', padding: '32px 16px' }}>
                    Belum ada data riwayat kerawanan transmisi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List */}
        <div className="dash-mobile-cards">
          {recent.map((row) => (
            <div key={row.id} className="dash-mobile-card">
              <div className="dash-mobile-card-top">
                <div>
                  <p className="dash-mobile-tower">{row.ruas}</p>
                  <p className="dash-mobile-date">{formatTanggal(row.tanggal)}</p>
                </div>
                <LevelBadge level={row.levelRisiko} />
              </div>
              <p className="dash-mobile-jenis">{row.jenisGangguan}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                <p className="dash-mobile-pelapor">Petugas: <span>{row.lineWalker}</span></p>
                <ProgressBadge tipe={row.progresLaporan} />
              </div>
            </div>
          ))}
          <a href="/laporan/gangguan" className="dash-mobile-see-all">
            Lihat Semua Riwayat
          </a>
        </div>
      </div>
    </div>
  )
}
