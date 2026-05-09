'use client'

import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { AlertTriangle, UploadCloud } from 'lucide-react'
import Swal from 'sweetalert2'
import { laporanApi, towersApi, importApi } from '@/lib/api'

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
  { key: 'pemanfaatan_lahan', label: 'Pemanfaatan Lahan',  emoji: '🏡', numColor: '#059669' },
] as const

// ── Status pill ───────────────────────────────────────────────────────────────
const STATUS_CLASS: Record<string, string> = {
  berlangsung:         'badge-berlangsung badge-blink',
  selesai:             'badge-selesai',
  tidak_ada_aktifitas: 'badge-menunggu',
}

const STATUS_LABEL: Record<string, string> = {
  berlangsung:         'Sedang Berlangsung',
  selesai:             'Selesai',
  tidak_ada_aktifitas: 'Tidak Ada Aktifitas',
}

const JENIS_LABEL: Record<string, string> = {
  pekerjaan_pihak_lain: 'Pekerjaan Pihak Lain',
  kebakaran:            'Kebakaran',
  layangan:             'Layangan',
  pencurian:            'Pencurian',
  pemanfaatan_lahan:    'Pemanfaatan Lahan',
}

function StatusPill({ status }: { status: string }) {
  const cls = STATUS_CLASS[status] ?? 'badge-menunggu'
  return <span className={cls}>{STATUS_LABEL[status] ?? status}</span>
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
  label, emoji, value, numColor,
}: {
  label: string
  emoji: string
  value: number | string
  numColor: string
}) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 8,
        border: '1px solid #E8EDF2',
        padding: '16px',
        minHeight: 120,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        width: '100%',
      }}
    >
      {/* Emoji icon */}
      <div style={{ fontSize: 32, lineHeight: 1 }}>{emoji}</div>

      {/* Label */}
      <p style={{ fontSize: 11, color: '#5F737F', lineHeight: 1.3, marginTop: 4 }}>{label}</p>

      {/* Number */}
      <p style={{ fontSize: 32, fontWeight: 700, color: numColor, lineHeight: 1, marginTop: 'auto' }}>{value}</p>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>(MOCK_STATS)
  const [recent, setRecent] = useState<RecentRow[]>(MOCK_RECENT)
  const [alertCount, setAlertCount] = useState(0)
  const [towerKerawanan, setTowerKerawanan] = useState<any[]>([])

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
    laporanApi.getStats()
      .then((res) => setStats(res.data))
      .catch(() => {})

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
      .catch(() => {})

    // Pakai endpoint /towers/map untuk data kerawanan di peta
    towersApi.getMap()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : []
        setAlertCount(data.filter((t: any) => t.kerawanan?.length > 0).length)
        setTowerKerawanan(data)
      })
      .catch(() => {})
  }, [])

  const statValues: Record<string, number> = {
    ppl: stats.ppl,
    kebakaran: stats.kebakaran,
    layangan: stats.layangan,
    pencurian: stats.pencurian,
    pemanfaatan_lahan: stats.pemanfaatan_lahan,
  }

  return (
    <div className="space-y-4">
      {/* Alert banner */}
      {alertCount > 0 && (
        <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#fffbeb] border border-[#fde68a] text-[#b45309]">
          <AlertTriangle size={18} className="shrink-0" />
          <p className="text-[13px] font-semibold">
            {alertCount} tower dalam kondisi gangguan aktif — segera tindaklanjuti
          </p>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {STAT_CARDS.map((card) => (
          <StatCard
            key={card.key}
            label={card.label}
            emoji={card.emoji}
            value={statValues[card.key]}
            numColor={card.numColor}
          />
        ))}
      </div>

      {/* Map */}
      <div style={{ background: '#FFFFFF', borderRadius: 8 }}>
        <div
          className="flex items-center justify-between px-6 py-3"
          style={{ borderBottom: '1px solid #E8EDF2' }}
        >
          <h2 className="text-[14px] font-semibold text-app-text">Peta Jalur</h2>
        </div>
        <div className="h-[50vh] md:h-[480px] w-full rounded-b-lg overflow-hidden">
          <TowerMap towers={towerKerawanan.length > 0 ? towerKerawanan : undefined} />
        </div>
      </div>

      {/* Recent gangguan */}
      <div
        className="overflow-hidden"
        style={{ background: '#FFFFFF', borderRadius: 8 }}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid #E8EDF2' }}
        >
          <div className="flex items-center gap-3">
            <h2 className="text-[14px] font-semibold text-app-text">Riwayat Gangguan Terbaru</h2>
            
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
              className="flex items-center gap-2 px-3 py-1.5 text-[12px] font-medium bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#334155] rounded-md transition-colors"
            >
              <UploadCloud size={14} />
              Import Data Excel
            </button>
          </div>

          <a href="/laporan/gangguan" className="hidden sm:block text-[12px] font-medium text-[#076C9E]">
            Lihat Semua →
          </a>
        </div>
        
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Tower</th>
                <th>Jenis Gangguan</th>
                <th>Pelapor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((row) => (
                <tr key={row.id}>
                  <td className="font-mono text-[12px] text-app-muted">{row.tanggal}</td>
                  <td className="font-semibold text-app-text">{row.tower}</td>
                  <td className="text-app-text">{row.jenisGangguan}</td>
                  <td className="text-app-muted">{row.pelapor}</td>
                  <td><StatusPill status={row.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List */}
        <div className="block md:hidden p-4 space-y-3 bg-[#f8fafc]">
          {recent.map((row) => (
            <div key={row.id} className="p-3.5 bg-white border border-[#e1e8ec] rounded-xl shadow-sm">
              <div className="flex justify-between items-start mb-2.5 gap-2">
                <div>
                  <p className="font-bold text-[13px] text-app-text">{row.tower}</p>
                  <p className="font-mono text-[11px] text-app-muted mt-0.5">{row.tanggal}</p>
                </div>
                <StatusPill status={row.status} />
              </div>
              <p className="text-[12.5px] font-medium text-app-text mb-1">{row.jenisGangguan}</p>
              <p className="text-[11px] text-app-subtle">Dilaporkan oleh: <span className="text-app-muted">{row.pelapor}</span></p>
            </div>
          ))}
          <a href="/laporan/gangguan" className="block w-full text-center py-2 text-[13px] font-semibold text-[#076C9E] mt-2">
            Lihat Semua Riwayat
          </a>
        </div>
      </div>
    </div>
  )
}
