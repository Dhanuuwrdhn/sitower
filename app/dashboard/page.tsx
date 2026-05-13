'use client'

import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { CloudUpload } from 'lucide-react'
import Swal from 'sweetalert2'
import { laporanApi, towersApi, asetApi, importApi, jalurKmlApi } from '@/lib/api'
import B2WLoader from '@/components/ui/B2WLoader'
import { TwIcon } from '@/components/ui/TwIcon'

const TowerMap = dynamic(() => import('@/components/map/TowerMapGoogle'), { ssr: false })

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
  towerNama: string
  towerNo: string
  jenisGangguan: string
  teknisi: string
  levelRisiko: string
  latestProgressTipe: string | null
}

const LEVEL_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  kritis_terpenuhi:       { bg: '#FEE4E2', text: '#D92D20', label: 'Kritis Terpenuhi'       },
  kritis_tidak_terpenuhi: { bg: '#FEE4E2', text: '#912018', label: 'Kritis Tidak Terpenuhi'  },
  sedang:                 { bg: '#FFFAEB', text: '#F79009', label: 'Sedang'                  },
  aman:                   { bg: '#ECFDF3', text: '#039855', label: 'Aman'                    },
  kritis:                 { bg: '#FEE4E2', text: '#D92D20', label: 'Kritis'                  },
}

const PROGRESS_BADGE_COLOR: Record<string, { bg: string; text: string }> = {
  laporan_baru: { bg: '#076C9E', text: '#FFFFFF' },
  berita_acara: { bg: '#076C9E', text: '#FFFFFF' },
  spanduk:      { bg: '#076C9E', text: '#FFFFFF' },
  brosur:       { bg: '#076C9E', text: '#FFFFFF' },
}

const PROGRESS_TIPE_LABEL: Record<string, string> = {
  spanduk:      'Spanduk',
  brosur:       'Brosur',
  laporan_baru: 'Laporan Baru',
  berita_acara: 'Berita Acara',
}

function extractTowerNo(nama?: string | null): string {
  if (!nama) return '—'
  const m = nama.match(/#(\d+)/)
  return m ? `#${m[1]}` : '—'
}

function LevelBadge({ level }: { level: string }) {
  const cfg = LEVEL_BADGE[level]
  if (!cfg) return <span style={{ color: '#5f737f' }}>—</span>
  return (
    <span style={{ backgroundColor: cfg.bg, color: cfg.text, borderRadius: 6, padding: '2px 10px', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' }}>
      {cfg.label}
    </span>
  )
}

function ProgressBadge({ tipe }: { tipe: string | null }) {
  if (!tipe) return <span style={{ color: '#5f737f' }}>—</span>
  const cfg = PROGRESS_BADGE_COLOR[tipe]
  if (!cfg) return <span style={{ color: '#5f737f' }}>{tipe}</span>
  return (
    <span style={{ backgroundColor: cfg.bg, color: cfg.text, borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap' }}>
      {PROGRESS_TIPE_LABEL[tipe] ?? tipe}
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
  { key: 'ppl',         label: 'Pekerjaan Pihak Lain',    emoji: '🚧', numColor: '#005DAA' },
  { key: 'kebakaran',   label: 'Kebakaran',                emoji: '🔥', numColor: '#FD2D03' },
  { key: 'layangan',    label: 'Layangan',                 emoji: '🪁', numColor: '#3B84CE' },
  { key: 'pencurian',   label: 'Pencurian',                emoji: '☠️', numColor: '#1B1B1B' },
  { key: 'pemanfaatan',       label: 'Pemanfaatan Lahan', emoji: '🏡', numColor: '#059669' },
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

// ── Donut Chart — 4 segments: Aman / Sedang / Kritis Terpenuhi / Kritis Tidak Terpenuhi ────
function DonutChart({ aman, sedang, kritisTerpenuhi, kritisLdakTerpenuhi }: {
  aman: number; sedang: number; kritisTerpenuhi: number; kritisLdakTerpenuhi: number
}) {
  const total = aman + sedang + kritisTerpenuhi + kritisLdakTerpenuhi
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

  const amanArc  = circumference * (aman              / total)
  const sedArc   = circumference * (sedang            / total)
  const ktArc    = circumference * (kritisTerpenuhi   / total)
  const kntArc   = circumference * (kritisLdakTerpenuhi / total)

  return (
    <svg width="160" height="160" viewBox="0 0 160 160">
      {/* Aman — #039855 */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#039855" strokeWidth={strokeW}
        strokeDasharray={`${amanArc} ${circumference - amanArc}`}
        strokeDashoffset={startOffset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
      {/* Sedang — #F79009 */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F79009" strokeWidth={strokeW}
        strokeDasharray={`${sedArc} ${circumference - sedArc}`}
        strokeDashoffset={startOffset - amanArc}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
      {/* Kritis Terpenuhi — #EF4444 */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EF4444" strokeWidth={strokeW}
        strokeDasharray={`${ktArc} ${circumference - ktArc}`}
        strokeDashoffset={startOffset - amanArc - sedArc}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
      {/* Kritis Tidak Terpenuhi — #991B1B */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#991B1B" strokeWidth={strokeW}
        strokeDasharray={`${kntArc} ${circumference - kntArc}`}
        strokeDashoffset={startOffset - amanArc - sedArc - ktArc}
        strokeLinecap="round"
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
  const [stats, setStats] = useState<Stats>(MOCK_STATS)
  const [recent, setRecent] = useState<RecentRow[]>(MOCK_RECENT)
  const [alertCount, setAlertCount] = useState(0)
  const [towerKerawanan, setTowerKerawanan] = useState<any[]>([])
  const [totalTower, setTotalTower] = useState(0)
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
      laporanApi.getStats()
        .then((res) => setStats(res.data))
        .catch(() => {}),

      laporanApi.getAll({ limit: 5 })
        .then((res) => {
          const rows = (res.data.data ?? res.data) as any[]
          setRecent(rows.slice(0, 5).map((r: any) => ({
            id: r.id,
            tanggal: r.tanggal ?? '—',
            towerNama: r.tower?.nama ?? r.tower?.id ?? r.towerId ?? '—',
            towerNo: extractTowerNo(r.tower?.nama),
            jenisGangguan: JENIS_LABEL[r.jenisGangguan] ?? r.jenisGangguan ?? '—',
            teknisi: r.teknisi ?? r.pelapor?.nama ?? '—',
            levelRisiko: r.levelRisiko ?? '—',
            latestProgressTipe: r.latestProgressTipe ?? null,
          })))
        })
        .catch(() => {}),

      // Pakai asetApi.getStats() untuk counts + asetApi.getMapOverview() untuk peta
      asetApi.getStats()
        .then((res) => {
          const s = res.data
          const total              = s.total                   ?? 0
          const aman               = s.aman                   ?? 0
          const sedang             = s.sedang                 ?? 0
          const kritisTerpenuhi    = s.kritis_terpenuhi       ?? 0
          const kritisLdak         = s.kritis_tidak_terpenuhi ?? 0
          const kritisLegacy       = s.kritis                 ?? 0
          setTotalTower(total)
          setAmanTower(aman)
          setSedangTower(sedang)
          setKritisTerpenuhiTower(kritisTerpenuhi + kritisLegacy)
          setKritisLdakTerpenuhiTower(kritisLdak)
          setAlertCount(sedang + kritisTerpenuhi + kritisLdak + kritisLegacy)
        })
        .catch(() => {}),

      asetApi.getMapOverview()
        .then((res) => {
          const overview = res.data
          // Transform aset towers to FeaturedTower format expected by TowerMapGoogle
          const mapTowers = (overview.towers ?? []).map((t: any) => {
            const types: string[] = t.kerawanan_types?.length
              ? t.kerawanan_types
              : (t.kerawanan_type ? [t.kerawanan_type] : [])
            return {
              id:         t.id,
              nama:       t.name,
              lat:        t.lat,
              lng:        t.lng,
              tipe:       'SUTT' as const,
              jalur:      null,
              nomorUrut:  null,
              updatedAt:  t.updated_at ?? null,
              kerawanan:  t.status !== 'aman'
                ? types.map((jenis: string) => ({
                    kategori: jenis,
                    level:    t.status as string,
                    status:   t.status,
                  }))
                : [],
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

  const amanPct   = totalTower > 0 ? Math.round((amanTower                / totalTower) * 100) : 0
  const sedangPct = totalTower > 0 ? Math.round((sedangTower             / totalTower) * 100) : 0
  const ktPct     = totalTower > 0 ? Math.round((kritisTerpenuhiTower    / totalTower) * 100) : 0
  const kntPct    = totalTower > 0 ? Math.round((kritisLdakTerpenuhiTower / totalTower) * 100) : 0

  if (loading) return <B2WLoader label="Memuat dashboard..." />

  return (
    <div className="dash-container">
      {/* Alert banner — Figma: #FEF3F2 bg, #D92D20 text/border */}
      {alertCount > 0 && (
        <div className="dash-alert">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 1.5C4.86 1.5 1.5 4.86 1.5 9C1.5 13.14 4.86 16.5 9 16.5C13.14 16.5 16.5 13.14 16.5 9C16.5 4.86 13.14 1.5 9 1.5ZM8.25 5.25H9.75V9.75H8.25V5.25ZM9 13.5C8.5875 13.5 8.25 13.1625 8.25 12.75C8.25 12.3375 8.5875 12 9 12C9.4125 12 9.75 12.3375 9.75 12.75C9.75 13.1625 9.4125 13.5 9 13.5Z" fill="#D92D20"/>
          </svg>
          <span>{alertCount} tower dalam kondisi gangguan aktif — segera tindaklanjuti</span>
        </div>
      )}

      {/* Title */}
      <h1 className="dash-title">Dashboard</h1>

      {/* Stat cards — 5 columns (desktop) */}
      <div className="dash-stat-row">
        {STAT_CARDS.map((card) => (
          <div key={card.key} className="dash-stat-card">
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
            <div key={card.key} className="pwa-stat-card">
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
            <div key={card.key} className="pwa-stat-card">
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
            <DonutChart aman={amanTower} sedang={sedangTower} kritisTerpenuhi={kritisTerpenuhiTower} kritisLdakTerpenuhi={kritisLdakTerpenuhiTower} />
            <div className="dash-aset-total">
              <span className="dash-aset-total-label">Total Aset{'\n'}Transmisi</span>
              <span className="dash-aset-total-num">{totalTower}</span>
            </div>
          </div>

          {/* Section 3 — Legend rows, Figma: VERTICAL gap=16, each row space-between */}
          <div className="dash-aset-legend">
            {[
              { color: '#039855', label: 'Aman',                  count: amanTower,                 pct: amanPct   },
              { color: '#F79009', label: 'Sedang',                count: sedangTower,               pct: sedangPct },
              { color: '#EF4444', label: 'Kritis Terpenuhi',      count: kritisTerpenuhiTower,      pct: ktPct     },
              { color: '#991B1B', label: 'Kritis Tidak Terpenuhi', count: kritisLdakTerpenuhiTower, pct: kntPct    },
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
            />
          </div>
        </div>
      </div>

      {/* Riwayat Gangguan Terbaru */}
      <div className="dash-riwayat-card">
        <div className="dash-riwayat-head">
          <h2 className="dash-section-title">Riwayat Kerawanan Transmisi Terbaru</h2>
          <div className="dash-riwayat-actions">
            {/* Import Button */}
            <input 
              type="file" 
              accept=".xlsx, .xls" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImport} 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="dash-import-btn"
            >
              <CloudUpload size={14} />
              Import Data Excel
            </button>
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
                <th>Ruas</th>
                <th>No. Tower</th>
                <th>Jenis Kerawanan</th>
                <th>Teknisi</th>
                <th>Status Kerawanan</th>
                <th>Progres Laporan</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((row) => (
                <tr key={row.id}>
                  <td className="text-[14px] text-[#5f737f] whitespace-nowrap">{formatTanggal(row.tanggal)}</td>
                  <td className="text-[14px] text-[#5f737f]" style={{ maxWidth: 220 }}>
                    <span className="block truncate" title={row.towerNama}>{row.towerNama}</span>
                  </td>
                  <td className="text-[14px] text-[#5f737f] whitespace-nowrap">{row.towerNo}</td>
                  <td className="text-[14px] text-[#5f737f]">{row.jenisGangguan}</td>
                  <td className="text-[14px] text-[#5f737f]">{row.teknisi}</td>
                  <td><LevelBadge level={row.levelRisiko} /></td>
                  <td><ProgressBadge tipe={row.latestProgressTipe} /></td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#5F737F', padding: '32px 16px' }}>
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
                  <p className="dash-mobile-tower">{row.towerNama}</p>
                  <p className="dash-mobile-date">{formatTanggal(row.tanggal)} · {row.towerNo}</p>
                </div>
                <LevelBadge level={row.levelRisiko} />
              </div>
              <p className="dash-mobile-jenis">{row.jenisGangguan}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                <p className="dash-mobile-pelapor">Teknisi: <span>{row.teknisi}</span></p>
                <ProgressBadge tipe={row.latestProgressTipe} />
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
