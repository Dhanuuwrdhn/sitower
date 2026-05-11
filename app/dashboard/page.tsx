'use client'

import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { CloudUpload } from 'lucide-react'
import Swal from 'sweetalert2'
import { laporanApi, towersApi, importApi, jalurKmlApi } from '@/lib/api'
import B2WLoader from '@/components/ui/B2WLoader'

const TowerMap = dynamic(() => import('@/components/map/TowerMapGoogle'), { ssr: false })

// ── Types ────────────────────────────────────────────────────────────────────
interface Stats {
  ppl: number
  kebakaran: number
  layangan: number
  pencurian: number
  pemanfaatan_lahan: number
}

interface RecentRow {
  id: number
  tanggal: string
  tower: string
  jenisGangguan: string
  pelapor: string
  status: string
}

// ── Fallback data ─────────────────────────────────────────────────────────────
const MOCK_STATS: Stats = { ppl: 0, kebakaran: 0, layangan: 0, pencurian: 0, pemanfaatan_lahan: 0 }

const MOCK_RECENT: RecentRow[] = []

// ── Stat card config ───────────────────────────────────────────────────────────
const STAT_CARDS = [
  { key: 'ppl',         label: 'Pekerjaan Pihak Lain',    emoji: '🚜', numColor: '#005DAA' },
  { key: 'kebakaran',   label: 'Kebakaran',                emoji: '🔥', numColor: '#FD2D03' },
  { key: 'layangan',    label: 'Layangan',                 emoji: '🪁', numColor: '#3B84CE' },
  { key: 'pencurian',   label: 'Pencurian',                emoji: '🥷', numColor: '#1B1B1B' },
  { key: 'pemanfaatan_lahan', label: 'Pemanfaatan Lahan', emoji: '🏡', numColor: '#059669' },
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

// ── Donut Chart — 3 segment: Aman / Sedang / Kritis (Figma node 229-4312) ────
function DonutChart({ aman, sedang, kritis }: { aman: number; sedang: number; kritis: number }) {
  const total = aman + sedang + kritis
  const cx = 80, cy = 80, r = 60, strokeW = 24
  const circumference = 2 * Math.PI * r
  const startOffset = circumference * 0.25 // start from top

  if (total === 0) {
    return (
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E1E8EC" strokeWidth={strokeW} />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize="28" fontWeight="700" fill="#1C1C1C">0</text>
      </svg>
    )
  }

  const amanArc   = circumference * (aman   / total)
  const sedangArc = circumference * (sedang / total)
  const kritisArc = circumference * (kritis / total)

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
        strokeDasharray={`${sedangArc} ${circumference - sedangArc}`}
        strokeDashoffset={startOffset - amanArc}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
      {/* Kritis — #FD2D03 */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#FD2D03" strokeWidth={strokeW}
        strokeDasharray={`${kritisArc} ${circumference - kritisArc}`}
        strokeDashoffset={startOffset - amanArc - sedangArc}
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
  const [kritisTower, setKritisTower] = useState(0)
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
            tanggal: r.tanggal?.slice(0, 10) ?? '—',
            tower: r.tower?.id ?? r.tower?.nama ?? '—',
            jenisGangguan: JENIS_LABEL[r.jenisGangguan] ?? r.jenisGangguan ?? '—',
            pelapor: r.pelapor?.nama ?? r.pegawai?.nama ?? '—',
            status: r.status?.toLowerCase() ?? '—',
          })))
        })
        .catch(() => {}),

      // Pakai endpoint /towers/map untuk data kerawanan di peta
      towersApi.getMap()
        .then((res) => {
          const data = Array.isArray(res.data) ? res.data : []

          const getTopLevel = (kerawanan: any[]) => {
            if (!kerawanan.length) return 'normal'
            const priority: Record<string, number> = { kritis: 3, sedang: 2, aman: 1 }
            return kerawanan.reduce((top: string, k: any) =>
              (priority[k.level] ?? 0) > (priority[top] ?? 0) ? k.level : top, 'aman')
          }

          let aman = 0, sedang = 0, kritis = 0, gangguanCount = 0
          for (const t of data) {
            const level = getTopLevel(t.kerawanan ?? [])
            if (level === 'kritis') { kritis++; gangguanCount++ }
            else if (level === 'sedang') { sedang++; gangguanCount++ }
            else if (level === 'aman') { aman++; gangguanCount++ }
            else { aman++ } // normal tower → masuk aman
          }

          setAlertCount(gangguanCount)
          setTowerKerawanan(data)
          setTotalTower(data.length)
          setAmanTower(aman)
          setSedangTower(sedang)
          setKritisTower(kritis)
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
    pemanfaatan_lahan: stats.pemanfaatan_lahan,
  }

  const amanPct   = totalTower > 0 ? Math.round((amanTower   / totalTower) * 100) : 0
  const sedangPct = totalTower > 0 ? Math.round((sedangTower / totalTower) * 100) : 0
  const kritisPct = totalTower > 0 ? Math.round((kritisTower / totalTower) * 100) : 0

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

      {/* Stat cards — 5 columns */}
      <div className="dash-stat-row">
        {STAT_CARDS.map((card) => (
          <div key={card.key} className="dash-stat-card">
            <div className="dash-stat-head">
              <span className="dash-stat-emoji">{card.emoji}</span>
              <span className="dash-stat-label">{card.label}</span>
            </div>
            <span className="dash-stat-number" style={{ color: card.numColor }}>
              {statValues[card.key]}
            </span>
          </div>
        ))}
      </div>

      {/* Middle row: Total Aset + Peta */}
      <div className="dash-mid-row">
        {/* Total Aset Transmisi card */}
        <div className="dash-aset-card">
          <div className="dash-section-head">
            <h2 className="dash-section-title">Total Aset Transmisi</h2>
          </div>
          <div className="dash-aset-divider" />

          <div className="dash-aset-body">
            {/* Donut chart — 3 segment sesuai Figma */}
            <DonutChart aman={amanTower} sedang={sedangTower} kritis={kritisTower} />

            {/* Total Aset Transmisi */}
            <div className="dash-aset-total">
              <span className="dash-aset-total-label">Total Aset Transmisi</span>
              <span className="dash-aset-total-num">{totalTower}</span>
            </div>

            {/* Legend — Aman / Sedang / Kritis */}
            <div className="dash-aset-legend">
              <div className="dash-aset-legend-item">
                <div className="dash-legend-header">
                  <span className="dash-legend-dot" style={{ background: '#039855' }} />
                  <span className="dash-legend-label">Aman</span>
                </div>
                <div className="dash-legend-values">
                  <span className="dash-legend-num">{amanTower}</span>
                  <span className="dash-legend-pct">({amanPct}%)</span>
                </div>
              </div>
              <div className="dash-aset-legend-item">
                <div className="dash-legend-header">
                  <span className="dash-legend-dot" style={{ background: '#F79009' }} />
                  <span className="dash-legend-label">Sedang</span>
                </div>
                <div className="dash-legend-values">
                  <span className="dash-legend-num">{sedangTower}</span>
                  <span className="dash-legend-pct">({sedangPct}%)</span>
                </div>
              </div>
              <div className="dash-aset-legend-item">
                <div className="dash-legend-header">
                  <span className="dash-legend-dot" style={{ background: '#FD2D03' }} />
                  <span className="dash-legend-label">Kritis</span>
                </div>
                <div className="dash-legend-values">
                  <span className="dash-legend-num">{kritisTower}</span>
                  <span className="dash-legend-pct">({kritisPct}%)</span>
                </div>
              </div>
            </div>
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
              jalurKml={jalurKmlData.length > 0 ? jalurKmlData : undefined}
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
                <th>Tower</th>
                <th>Jenis Gangguan</th>
                <th>Teknisi</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((row) => (
                <tr key={row.id}>
                  <td>{row.tanggal}</td>
                  <td>{row.tower}</td>
                  <td>{row.jenisGangguan}</td>
                  <td>{row.pelapor}</td>
                  <td><StatusPill status={row.status} /></td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: '#5F737F', padding: '32px 16px' }}>
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
                  <p className="dash-mobile-tower">{row.tower}</p>
                  <p className="dash-mobile-date">{row.tanggal}</p>
                </div>
                <StatusPill status={row.status} />
              </div>
              <p className="dash-mobile-jenis">{row.jenisGangguan}</p>
              <p className="dash-mobile-pelapor">Dilaporkan oleh: <span>{row.pelapor}</span></p>
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
