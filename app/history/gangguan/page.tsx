'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import {
  Search, Plus, Trash2, X, Upload,
  ChevronLeft, ChevronRight, ChevronDown,
  MoreHorizontal, Eye, Pencil, ArrowLeft,
  AlertTriangle, Flame, Zap, FileText,
  GitBranch, Calendar, Check,
} from 'lucide-react'
import { laporanApi, towersApi } from '@/lib/api'
import { getUser, isAdmin } from '@/lib/auth'
import { getDistance } from '@/lib/geo'
import { useSidebar } from '@/components/layout/SidebarContext'

// ── Constants ─────────────────────────────────────────────────────────────────

const MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']
const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: CURRENT_YEAR - 2019 }, (_, i) => CURRENT_YEAR - i)

type ReportType = 'ppl' | 'span' | 'gangguan' | 'kebakaran'
type FilterMode = 'date' | 'month' | 'year' | null

const REPORT_CONFIG: Record<ReportType, { label: string; fullLabel: string; jenisGangguan: string; iconColor: string; bgColor: string }> = {
  ppl:       { label: 'PPL',       fullLabel: 'Buat Laporan PPL',          jenisGangguan: 'pekerjaan_pihak_lain', iconColor: 'text-blue-600',   bgColor: 'bg-blue-600' },
  span:      { label: 'Span',      fullLabel: 'Laporan Span',               jenisGangguan: 'span',                 iconColor: 'text-purple-600', bgColor: 'bg-purple-600' },
  gangguan:  { label: 'Gangguan',  fullLabel: 'Tambah Laporan Gangguan',    jenisGangguan: 'gangguan',             iconColor: 'text-amber-600',  bgColor: 'bg-amber-600' },
  kebakaran: { label: 'Kebakaran', fullLabel: 'Laporan Kebakaran',          jenisGangguan: 'kebakaran',            iconColor: 'text-red-600',    bgColor: 'bg-red-600' },
}

const JENIS_LABEL: Record<string, string> = {
  pekerjaan_pihak_lain: 'PPL',
  span:                 'Span',
  gangguan:             'Gangguan',
  kebakaran:            'Kebakaran',
  layangan:             'Layangan',
  pencurian:            'Pencurian',
  pemanfaatan_lahan:    'Pemanfaatan Lahan',
  cui:                  'CUI',
  cleanup:              'Cleanup',
}

const STATUS_LABEL: Record<string, string> = {
  berlangsung:         'Berlangsung',
  selesai:             'Selesai',
  tidak_ada_aktifitas: 'Tdk Ada Aktivitas',
}

const STATUS_CLASS: Record<string, string> = {
  berlangsung:         'badge-berlangsung badge-blink',
  selesai:             'badge-selesai',
  tidak_ada_aktifitas: 'badge-menunggu',
}

const LEVEL_OPTIONS = [
  { value: 'tinggi', label: 'Tinggi', color: 'text-red-600',    bg: 'bg-red-50 border-red-300',       dot: 'bg-red-500' },
  { value: 'sedang', label: 'Sedang', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-300', dot: 'bg-yellow-500' },
  { value: 'rendah', label: 'Rendah', color: 'text-green-600',  bg: 'bg-green-50 border-green-300',   dot: 'bg-green-500' },
]

const STATUS_OPTIONS = [
  { value: 'berlangsung',         label: 'Sedang Berlangsung' },
  { value: 'selesai',             label: 'Selesai' },
  { value: 'tidak_ada_aktifitas', label: 'Tidak Ada Aktifitas' },
]

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

const EMPTY_FORM = {
  towerId:       '',
  towerLabel:    '',
  towerIdEnd:    '',
  towerLabelEnd: '',
  spanTowers:    [] as Array<{ id: string; label: string }>,
  pihakLain:     '',
  penyebab:      '',
  durasi:        '',
  deskripsi:     '',
  keterangan:    '',
  tanggalWaktu:  new Date().toISOString().slice(0, 16),
  levelRisiko:   'sedang',
  status:        'berlangsung',
  lokasiDetail:  '',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTanggal(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

function StatusPill({ status }: { status: string }) {
  const s = status?.toLowerCase() ?? ''
  return <span className={STATUS_CLASS[s] ?? 'badge-menunggu'}>{STATUS_LABEL[s] ?? status}</span>
}

// ── Tower interface ───────────────────────────────────────────────────────────

interface TowerOption {
  id: string
  nomorTower: string
  garduInduk: string
  tipe: string
  lat?: number
  lng?: number
  radius?: number
}

// ── RowActions ────────────────────────────────────────────────────────────────

function RowActions({ row, onDetail, onEdit, onDelete, showDelete }: {
  row: any
  onDetail: (r: any) => void
  onEdit: (r: any) => void
  onDelete: (r: any) => void
  showDelete: boolean
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function h(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div className="relative inline-flex mx-auto" ref={ref}>
      <button onClick={() => setOpen(v => !v)} className="p-1.5 rounded-lg hover:bg-app-bg text-app-muted hover:text-app-text transition-colors" title="Aksi">
        <MoreHorizontal size={16} />
      </button>
      {open && (
        <div style={{ position: 'absolute', right: 0, top: 32, zIndex: 50, background: '#FFF', borderRadius: 4, boxShadow: '0 4px 8px rgba(28,28,28,0.15)', padding: '8px 0', minWidth: 200 }}>
          {[
            { label: 'Lihat Detail', icon: <Eye size={16} />, onClick: () => { setOpen(false); onDetail(row) }, danger: false },
            { label: 'Edit Laporan', icon: <Pencil size={16} />, onClick: () => { setOpen(false); onEdit(row) }, danger: false, divider: true },
            ...(showDelete ? [{ label: 'Hapus Laporan', icon: <Trash2 size={16} />, onClick: () => { setOpen(false); onDelete(row) }, danger: true, divider: true }] : []),
          ].map((item, i) => (
            <div key={i}>
              {item.divider && <div style={{ height: 1, background: '#E1E8EC' }} />}
              <button
                onClick={item.onClick}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, fontFamily: 'Inter,sans-serif', color: item.danger ? '#D92D20' : '#5F737F', textAlign: 'left' }}
                onMouseEnter={e => (e.currentTarget.style.background = item.danger ? '#FEF3F2' : '#F6F9FC')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {item.icon}{item.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── TowerDropdown ─────────────────────────────────────────────────────────────

function TowerDropdown({ options, value, onChange, placeholder = 'Pilih tower...' }: {
  options: TowerOption[]
  value: string
  onChange: (id: string, label: string) => void
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function h(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const groups = ['garduInduk', 'SUTET', 'SUTT', 'SKTT'] as const
  const grouped: Record<string, TowerOption[]> = { garduInduk: [], SUTET: [], SUTT: [], SKTT: [] }
  options.filter(t => !search || t.nomorTower.toLowerCase().includes(search.toLowerCase()) || t.garduInduk.toLowerCase().includes(search.toLowerCase()))
    .forEach(t => { if (grouped[t.tipe]) grouped[t.tipe].push(t) })

  const selectedLabel = value ? (options.find(o => o.id === value)?.nomorTower ?? value) : ''

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen(v => !v)} className="form-input flex items-center justify-between text-left">
        <span className={selectedLabel ? 'text-app-text' : 'text-app-subtle'}>{selectedLabel || placeholder}</span>
        <ChevronDown size={14} className="text-app-muted shrink-0" />
      </button>
      {open && (
        <div className="absolute z-50 left-0 top-[42px] w-full bg-white border border-app-border rounded-xl shadow-dropdown max-h-72 flex flex-col">
          <div className="p-2 border-b border-app-border">
            <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nomor tower..." className="form-input text-[12px]" />
          </div>
          <div className="overflow-y-auto">
            {groups.map(g => grouped[g].length > 0 ? (
              <div key={g}>
                <p className="px-3 py-1.5 text-[10px] font-bold text-app-muted uppercase tracking-wider bg-app-bg">{g === 'garduInduk' ? 'Gardu Induk' : g}</p>
                {grouped[g].map(t => (
                  <button key={t.id} type="button" onClick={() => { onChange(t.id, t.nomorTower); setOpen(false); setSearch('') }}
                    className={`w-full text-left px-3 py-2 text-[13px] hover:bg-app-bg transition-colors ${value === t.id ? 'text-blue-600 font-semibold' : 'text-app-text'}`}>
                    <span className="font-mono">{t.nomorTower}</span>
                    {t.garduInduk && <span className="ml-2 text-[11px] text-app-muted">{t.garduInduk}</span>}
                  </button>
                ))}
              </div>
            ) : null)}
            {groups.every(g => grouped[g].length === 0) && <p className="text-center text-[13px] text-app-muted py-6">Tower tidak ditemukan</p>}
          </div>
        </div>
      )}
    </div>
  )
}

// ── MultiTowerSelect (for Span) ───────────────────────────────────────────────

function MultiTowerSelect({ options, selected, onChange }: {
  options: TowerOption[]
  selected: Array<{ id: string; label: string }>
  onChange: (towers: Array<{ id: string; label: string }>) => void
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function h(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const selectedIds = new Set(selected.map(s => s.id))
  const filtered = options.filter(t =>
    !search || t.nomorTower.toLowerCase().includes(search.toLowerCase()) || t.garduInduk.toLowerCase().includes(search.toLowerCase())
  )

  function toggle(t: TowerOption) {
    if (selectedIds.has(t.id)) onChange(selected.filter(s => s.id !== t.id))
    else onChange([...selected, { id: t.id, label: t.nomorTower }])
  }

  return (
    <div ref={ref}>
      {/* Tags */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selected.map(s => (
            <span key={s.id} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-full text-[12px] font-mono text-blue-700">
              {s.label}
              <button type="button" onClick={() => onChange(selected.filter(x => x.id !== s.id))} className="text-blue-400 hover:text-blue-700">
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}
      {/* Input trigger */}
      <div className="relative">
        <button type="button" onClick={() => setOpen(v => !v)} className="form-input flex items-center justify-between text-left w-full">
          <span className="text-app-subtle">+ Tambah tower...</span>
          <ChevronDown size={14} className="text-app-muted shrink-0" />
        </button>
        {open && (
          <div className="absolute z-50 left-0 top-[42px] w-full bg-white border border-app-border rounded-xl shadow-dropdown max-h-64 flex flex-col">
            <div className="p-2 border-b border-app-border">
              <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nomor tower..." className="form-input text-[12px]" />
            </div>
            <div className="overflow-y-auto">
              {filtered.map(t => (
                <button key={t.id} type="button" onClick={() => toggle(t)}
                  className="w-full text-left px-3 py-2 text-[13px] hover:bg-app-bg transition-colors flex items-center gap-2">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${selectedIds.has(t.id) ? 'bg-blue-600 border-blue-600' : 'border-app-border'}`}>
                    {selectedIds.has(t.id) && <Check size={10} className="text-white" />}
                  </div>
                  <span className="font-mono">{t.nomorTower}</span>
                  {t.garduInduk && <span className="text-[11px] text-app-muted">{t.garduInduk}</span>}
                </button>
              ))}
              {filtered.length === 0 && <p className="text-center text-[13px] text-app-muted py-6">Tower tidak ditemukan</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── FotoUpload ────────────────────────────────────────────────────────────────

function FotoUpload({ fotos, onChange }: { fotos: File[]; onChange: (files: File[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function addFiles(incoming: FileList | null) {
    if (!incoming) return
    const valid = Array.from(incoming).filter(f => f.size <= 5 * 1024 * 1024 && /\.(jpe?g|png|webp)$/i.test(f.name))
    onChange([...fotos, ...valid].slice(0, 10))
  }

  return (
    <div>
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 py-8 cursor-pointer transition-colors ${dragging ? 'border-blue-400 bg-blue-50' : 'border-app-border hover:border-blue-300 hover:bg-app-bg'}`}
      >
        <Upload size={22} className="text-app-muted" />
        <p className="text-[13px] text-app-muted">Drag & drop, atau <span className="text-blue-600 font-medium">klik pilih foto</span></p>
        <p className="text-[11px] text-app-subtle">JPG, PNG, WEBP · Maks 5MB · Maks 10 foto</p>
      </div>
      <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.webp" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
      {fotos.length > 0 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {fotos.map((f, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden bg-app-bg aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-full object-cover" />
              <button type="button" onClick={() => onChange(fotos.filter((_, j) => j !== i))}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── GPS hook ──────────────────────────────────────────────────────────────────

function useGPS(towerOptions: TowerOption[], onDetected: (towerId: string, label: string, msg: string) => void) {
  const [locating, setLocating] = useState(false)
  const [msg, setMsg] = useState('')

  function detect() {
    if (locating) return
    if (!navigator.geolocation) { toast.error('Browser tidak mendukung deteksi lokasi'); return }
    setLocating(true)
    setMsg('Mendeteksi lokasi...')

    function process(pos: GeolocationPosition) {
      const { latitude: lat, longitude: lng } = pos.coords
      let min = Infinity; let nearest: TowerOption | null = null
      for (const t of towerOptions) {
        if (t.lat && t.lng) { const d = getDistance(lat, lng, t.lat, t.lng); if (d < min) { min = d; nearest = t } }
      }
      const radius = nearest?.radius ?? 100
      if (nearest && min <= radius) {
        onDetected(nearest.id, nearest.nomorTower, `📍 Tower ${nearest.nomorTower} (${Math.round(min)}m)`)
        setMsg(`📍 Tower ${nearest.nomorTower} (${Math.round(min)}m)`)
        toast.success('Tower terdekat dipilih!')
      } else if (nearest) {
        setMsg(`⚠️ Tower terdekat (${nearest.nomorTower}) ${Math.round(min)}m — di luar radius`)
      }
      setLocating(false)
    }

    navigator.geolocation.getCurrentPosition(
      process,
      (err) => {
        if (err.code === 1) { setMsg(''); toast.error('Izin lokasi ditolak.'); setLocating(false); return }
        navigator.geolocation.getCurrentPosition(process, () => { setMsg(''); toast.error('Gagal mendapatkan lokasi.'); setLocating(false) }, { enableHighAccuracy: false, timeout: 15000 })
      },
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }

  return { locating, msg, detect, setMsg }
}

// ── ReportDrawer ──────────────────────────────────────────────────────────────

function ReportDrawer({ open, type, initial, readOnly, towerOptions, onClose, onSaved }: {
  open: boolean
  type: ReportType | null
  initial: any | null
  readOnly?: boolean
  towerOptions: TowerOption[]
  onClose: () => void
  onSaved: () => void
}) {
  const { isMobile } = useSidebar()
  const user = getUser()
  const [form, setForm] = useState(EMPTY_FORM)
  const [fotos, setFotos] = useState<File[]>([])
  const [fotoUrls, setFotoUrls] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [alertVisible, setAlertVisible] = useState(true)
  const [gpsActive, setGpsActive] = useState(false)

  const { locating, msg: gpsMsg, detect, setMsg: setGpsMsg } = useGPS(
    towerOptions,
    (id: string, label: string) => setForm(f => ({ ...f, towerId: id, towerLabel: label })),
  )

  useEffect(() => {
    if (!open) return
    setAlertVisible(true)
    setGpsActive(false)
    setGpsMsg('')
    if (initial) {
      setForm({
        ...EMPTY_FORM,
        towerId:      initial.towerId ?? '',
        towerLabel:   initial.tower?.nomorTower ?? initial.tower?.id ?? '',
        deskripsi:    initial.deskripsi ?? '',
        keterangan:   initial.keterangan ?? '',
        tanggalWaktu: initial.tanggal?.slice(0, 16) ?? new Date().toISOString().slice(0, 16),
        levelRisiko:  initial.levelRisiko ?? 'sedang',
        status:       initial.status ?? 'berlangsung',
        lokasiDetail: initial.lokasiDetail ?? '',
        pihakLain:    initial.teknisi ?? '',
        penyebab:     initial.penyebab ?? '',
        durasi:       initial.durasi ?? '',
        spanTowers:   [],
        towerIdEnd:   '',
        towerLabelEnd: '',
      })
      setFotoUrls(initial.foto ?? [])
      setFotos([])
    } else {
      setForm(EMPTY_FORM)
      setFotos([])
      setFotoUrls([])
    }
  }, [open, initial]) // eslint-disable-line react-hooks/exhaustive-deps

  function set(k: string, v: any) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (readOnly) { onClose(); return }

    const cfg = type ? REPORT_CONFIG[type] : null
    if (!cfg) return

    if (type === 'span') {
      if (form.spanTowers.length === 0) { toast.error('Pilih minimal satu tower'); return }
    } else {
      if (!form.towerId) { toast.error('Pilih tower terlebih dahulu'); return }
    }

    setSaving(true)
    try {
      let uploadedUrls: string[] = []
      if (fotos.length > 0) {
        const up = await laporanApi.uploadFoto(fotos)
        uploadedUrls = up.data.urls ?? []
      }

      const primaryTowerId = type === 'span'
        ? (form.spanTowers[0]?.id ?? '')
        : form.towerId

      const lokasiForSpan = type === 'span'
        ? form.spanTowers.map(t => t.label).join(', ')
        : (type === 'ppl' && form.towerIdEnd ? `${form.towerLabel} s/d ${form.towerLabelEnd}` : form.lokasiDetail)

      const payload: any = {
        towerId:      primaryTowerId,
        jenisGangguan: cfg.jenisGangguan,
        tanggal:      form.tanggalWaktu,
        levelRisiko:  form.levelRisiko,
        status:       form.status,
        deskripsi:    form.deskripsi,
        keterangan:   form.keterangan,
        lokasiDetail: lokasiForSpan,
        foto:         [...fotoUrls, ...uploadedUrls],
      }

      if (type === 'ppl' || type === 'span') payload.teknisi = form.pihakLain
      if (type === 'gangguan') { payload.penyebab = form.penyebab; payload.durasi = form.durasi }

      if (initial?.id) {
        await laporanApi.update(initial.id, payload)
        toast.success('Laporan berhasil diperbarui')
      } else {
        await laporanApi.create(payload)
        toast.success('Laporan berhasil dibuat!')
      }
      onSaved(); onClose()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Gagal menyimpan laporan')
    } finally {
      setSaving(false)
    }
  }

  if (!type) return null

  const cfg = REPORT_CONFIG[type]
  const title = readOnly ? 'Detail Laporan' : initial ? `Edit ${cfg.label}` : cfg.fullLabel
  const needsGPS = type !== 'span'
  const needsFoto = type === 'gangguan' || type === 'kebakaran'

  const formBody = (
    <form id="report-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

      {/* GPS alert */}
      {!readOnly && needsGPS && alertVisible && (
        <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[12px] text-amber-700 leading-relaxed flex-1">
            Pastikan akses lokasi diaktifkan di perangkat Anda sebelum menggunakan deteksi otomatis.
          </p>
          <button type="button" onClick={() => setAlertVisible(false)} className="text-amber-400 hover:text-amber-600 shrink-0">
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Foto (gangguan & kebakaran) ── */}
      {needsFoto && (
        <div>
          <label className="block text-[12px] font-semibold text-app-text mb-1.5">Foto Bukti</label>
          {fotoUrls.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mb-2">
              {fotoUrls.map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={url} alt="" className="w-full aspect-square object-cover rounded-lg" />
              ))}
            </div>
          )}
          {!readOnly && <FotoUpload fotos={fotos} onChange={setFotos} />}
        </div>
      )}

      {/* ── Tower selection ── */}
      {type === 'span' ? (
        <div>
          <label className="block text-[12px] font-semibold text-app-text mb-1.5">Tower Terdampak (span)</label>
          {readOnly ? (
            <input readOnly className="form-input bg-app-bg text-app-muted" value={form.lokasiDetail} />
          ) : (
            <MultiTowerSelect
              options={towerOptions}
              selected={form.spanTowers}
              onChange={towers => set('spanTowers', towers)}
            />
          )}
        </div>
      ) : (
        <>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">
              {type === 'ppl' ? 'Tower Terdampak (Start)' : 'Tower Terganggu'}
            </label>
            {readOnly ? (
              <input readOnly className="form-input bg-app-bg text-app-muted" value={form.towerLabel || form.towerId} />
            ) : (
              <TowerDropdown options={towerOptions} value={form.towerId} onChange={(id, label) => setForm(f => ({ ...f, towerId: id, towerLabel: label }))} />
            )}
          </div>

          {/* GPS checkbox */}
          {!readOnly && (
            <div className="flex items-center gap-2.5 -mt-1">
              <div onClick={() => { setGpsActive(v => !v); if (!gpsActive) detect() }}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors shrink-0 ${gpsActive ? 'bg-blue-600 border-blue-600' : 'border-app-border bg-white'}`}>
                {gpsActive && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <button type="button" onClick={() => { setGpsActive(true); detect() }} className="text-[13px] text-app-text">
                Gunakan lokasi saat ini
              </button>
              {locating && <span className="text-[11px] text-blue-500 animate-pulse">Mendeteksi...</span>}
            </div>
          )}
          {gpsMsg && <p className={`text-[12px] font-medium -mt-2 ${gpsMsg.includes('⚠️') ? 'text-orange-600' : 'text-green-600'}`}>{gpsMsg}</p>}

          {/* PPL: Tower End */}
          {type === 'ppl' && !readOnly && (
            <div>
              <label className="block text-[12px] font-semibold text-app-text mb-1.5">Tower Terdampak (End)</label>
              <TowerDropdown options={towerOptions} value={form.towerIdEnd} onChange={(id, label) => setForm(f => ({ ...f, towerIdEnd: id, towerLabelEnd: label }))} placeholder="Pilih tower akhir span..." />
            </div>
          )}
        </>
      )}

      {/* ── Deskripsi / Uraian Pekerjaan ── */}
      <div>
        <label className="block text-[12px] font-semibold text-app-text mb-1.5">
          {type === 'ppl' || type === 'span' ? 'Uraian Pekerjaan' : type === 'kebakaran' ? 'Deskripsi Kebakaran' : 'Deskripsi Gangguan'}
        </label>
        <textarea disabled={readOnly} rows={4} value={form.deskripsi} onChange={e => set('deskripsi', e.target.value)}
          className="form-input resize-none"
          placeholder={type === 'ppl' || type === 'span' ? 'Uraikan pekerjaan pihak lain...' : type === 'kebakaran' ? 'Deskripsi kejadian kebakaran...' : 'Deskripsi gangguan teknis...'} />
      </div>

      {/* ── PPL / Span: Pihak Lain ── */}
      {(type === 'ppl' || type === 'span') && (
        <>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Nama Pihak Lain / Perusahaan</label>
            <input disabled={readOnly} type="text" value={form.pihakLain} onChange={e => set('pihakLain', e.target.value)}
              className="form-input" placeholder="Nama perusahaan / instansi..." />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Upaya Pengendalian</label>
            <textarea disabled={readOnly} rows={3} value={form.keterangan} onChange={e => set('keterangan', e.target.value)}
              className="form-input resize-none" placeholder="Tindakan pengendalian yang dilakukan..." />
          </div>
        </>
      )}

      {/* ── Gangguan: Penyebab + Durasi ── */}
      {type === 'gangguan' && (
        <div className="space-y-4 p-4 bg-app-bg rounded-xl border border-app-border">
          <p className="text-[11px] font-bold text-app-muted uppercase tracking-wider">Detail Gangguan Teknis</p>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Penyebab Gangguan</label>
            <input disabled={readOnly} type="text" value={form.penyebab} onChange={e => set('penyebab', e.target.value)} className="form-input" placeholder="Penyebab gangguan..." />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Durasi (jam)</label>
            <input disabled={readOnly} type="number" value={form.durasi} onChange={e => set('durasi', e.target.value)} className="form-input" placeholder="0" />
          </div>
        </div>
      )}

      {/* ── Kebakaran / Gangguan: Keterangan ── */}
      {(type === 'kebakaran' || type === 'gangguan') && (
        <div>
          <label className="block text-[12px] font-semibold text-app-text mb-1.5">Keterangan</label>
          <textarea disabled={readOnly} rows={3} value={form.keterangan} onChange={e => set('keterangan', e.target.value)} className="form-input resize-none" />
        </div>
      )}

      {/* ── Tanggal & Waktu ── */}
      <div>
        <label className="block text-[12px] font-semibold text-app-text mb-1.5">Tanggal & Waktu</label>
        <input disabled={readOnly} type="datetime-local" value={form.tanggalWaktu} onChange={e => set('tanggalWaktu', e.target.value)} className="form-input" />
      </div>

      {/* ── Level Risiko ── */}
      <div>
        <label className="block text-[12px] font-semibold text-app-text mb-2">Level Risiko</label>
        <div className="grid grid-cols-3 gap-2">
          {LEVEL_OPTIONS.map(l => (
            <button key={l.value} type="button" disabled={readOnly} onClick={() => set('levelRisiko', l.value)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 transition-all text-[13px] font-semibold ${form.levelRisiko === l.value ? `${l.bg} ${l.color} border-current` : 'border-app-border text-app-muted hover:border-gray-300'}`}>
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${l.dot}`} />
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Status ── */}
      <div>
        <label className="block text-[12px] font-semibold text-app-text mb-1.5">Status</label>
        <div className="flex items-center gap-3">
          <select disabled={readOnly} value={form.status} onChange={e => set('status', e.target.value)} className="form-input">
            {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <StatusPill status={form.status} />
        </div>
      </div>

      {/* ── Pelapor ── */}
      <div>
        <label className="block text-[12px] font-semibold text-app-text mb-1.5">Pelapor</label>
        <input readOnly className="form-input bg-app-bg text-app-muted cursor-not-allowed"
          value={initial?.pelapor?.nama ?? user?.nama ?? '—'} />
      </div>
    </form>
  )

  // ── Mobile PWA ───────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        <div className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
        <div className={`fixed inset-0 z-50 flex flex-col bg-white transition-transform duration-300 ease-in-out ${open ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="flex items-center gap-3 px-4 shrink-0" style={{ height: 64, background: '#076c9e' }}>
            <button onClick={onClose} className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors">
              <ArrowLeft size={22} />
            </button>
            <p className="text-white font-bold text-[16px]">{title}</p>
          </div>
          {formBody}
          <div className="px-5 py-4 border-t border-app-border shrink-0 bg-white">
            {readOnly ? (
              <button onClick={onClose} className="btn-outline w-full justify-center">Tutup</button>
            ) : (
              <button type="submit" form="report-form" disabled={saving} className="btn-primary w-full justify-center">
                {saving ? 'Menyimpan...' : initial ? 'Simpan Perubahan' : 'Buat Laporan'}
              </button>
            )}
          </div>
        </div>
      </>
    )
  }

  // ── Desktop: right side drawer ───────────────────────────────────────────────
  return (
    <>
      <div className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed top-0 right-0 bottom-0 z-50 flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out w-full sm:w-[560px] ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-app-border shrink-0">
          <h2 className="text-[15px] font-bold text-app-text">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-app-bg text-app-muted transition-colors"><X size={18} /></button>
        </div>
        {formBody}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-app-border shrink-0 bg-white">
          <button type="button" onClick={onClose} className="btn-outline">{readOnly ? 'Tutup' : 'Batal'}</button>
          {!readOnly && (
            <button type="submit" form="report-form" disabled={saving} className="btn-primary">
              {saving ? 'Menyimpan...' : initial ? 'Simpan Perubahan' : 'Buat Laporan'}
            </button>
          )}
        </div>
      </div>
    </>
  )
}

// ── DeleteConfirm ─────────────────────────────────────────────────────────────

function DeleteConfirm({ row, onClose, onDeleted }: { row: any | null; onClose: () => void; onDeleted: () => void }) {
  const [loading, setLoading] = useState(false)
  async function confirm() {
    if (!row) return
    setLoading(true)
    try {
      await laporanApi.delete(row.id)
      toast.success('Laporan berhasil dihapus')
      onDeleted(); onClose()
    } catch { toast.error('Gagal menghapus laporan') }
    finally { setLoading(false) }
  }
  if (!row) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-[380px]">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={22} className="text-red-500" />
        </div>
        <h3 className="text-[15px] font-bold text-app-text text-center">Hapus Laporan?</h3>
        <p className="text-[13px] text-app-muted text-center mt-2 mb-5">
          Laporan <span className="font-semibold text-app-text">{row.tower?.nomorTower ?? row.towerId}</span> akan dihapus permanen.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-outline flex-1 justify-center">Batal</button>
          <button onClick={confirm} disabled={loading}
            className="flex-1 justify-center inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-full hover:bg-red-600 transition-colors cursor-pointer border-none">
            {loading ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── AddReportDropdown ─────────────────────────────────────────────────────────

const REPORT_TYPE_ITEMS: Array<{ type: ReportType; label: string; icon: React.ReactNode; desc: string }> = [
  { type: 'ppl',       label: 'Laporan PPL',      icon: <FileText size={16} />,  desc: 'Pekerjaan pihak lain di sekitar tower' },
  { type: 'span',      label: 'Laporan Span',      icon: <GitBranch size={16} />, desc: 'Pekerjaan pada span / rentang antar tower' },
  { type: 'gangguan',  label: 'Laporan Gangguan',  icon: <Zap size={16} />,       desc: 'Gangguan teknis pada tower / jaringan' },
  { type: 'kebakaran', label: 'Laporan Kebakaran', icon: <Flame size={16} />,     desc: 'Insiden kebakaran di sekitar tower' },
]

function AddReportDropdown({ onSelect }: { onSelect: (type: ReportType) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function h(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(v => !v)} className="btn-primary flex items-center gap-2">
        <Plus size={16} /> Tambah Laporan
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-[44px] z-50 bg-white border border-app-border rounded-xl shadow-dropdown py-1 w-72">
          {REPORT_TYPE_ITEMS.map(item => (
            <button key={item.type} type="button"
              onClick={() => { setOpen(false); onSelect(item.type) }}
              className="w-full text-left px-4 py-3 hover:bg-app-bg transition-colors flex items-start gap-3"
            >
              <div className={`mt-0.5 shrink-0 ${REPORT_CONFIG[item.type].iconColor}`}>{item.icon}</div>
              <div>
                <p className="text-[13px] font-semibold text-app-text">{item.label}</p>
                <p className="text-[11px] text-app-muted">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── DateFilterPanel ───────────────────────────────────────────────────────────

function DateFilterPanel({ dateFrom, dateTo, onChange, onApply, onClear }: {
  dateFrom: string; dateTo: string
  onChange: (from: string, to: string) => void
  onApply: () => void; onClear: () => void
}) {
  return (
    <div style={{ position: 'absolute', left: 0, top: '100%', marginTop: 8, zIndex: 50, width: 380, background: '#FFF', border: '1px solid #E1E8EC', borderRadius: 8, boxShadow: '0 4px 8px rgba(28,28,28,0.15)', padding: '0' }}>
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E1E8EC' }}>
        <span style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: 14, color: '#1C1C1C' }}>Filter Tanggal</span>
        <div className="flex items-center gap-2">
          <Calendar size={14} style={{ color: '#5F737F' }} />
        </div>
      </div>
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#1C1C1C', marginBottom: 6, fontFamily: 'Inter,sans-serif' }}>Dari Tanggal</p>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E1E8EC', borderRadius: 8, overflow: 'hidden' }}>
              <input type="date" value={dateFrom} onChange={e => onChange(e.target.value, dateTo)}
                style={{ flex: 1, border: 'none', outline: 'none', padding: '8px 12px', fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#5F737F' }} />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#1C1C1C', marginBottom: 6, fontFamily: 'Inter,sans-serif' }}>Sampai Tanggal</p>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E1E8EC', borderRadius: 8, overflow: 'hidden' }}>
              <input type="date" value={dateTo} onChange={e => onChange(dateFrom, e.target.value)}
                style={{ flex: 1, border: 'none', outline: 'none', padding: '8px 12px', fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#5F737F' }} />
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: '8px 16px 16px', display: 'flex', gap: 8 }}>
        <button onClick={onApply} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Terapkan</button>
        <button onClick={onClear} style={{ flex: 1, padding: '12px 20px', borderRadius: 22, border: '1px solid #D92D20', background: '#FFF', color: '#D92D20', fontFamily: 'Inter,sans-serif', fontWeight: 500, fontSize: 14, cursor: 'pointer' }}>Hapus Filter</button>
      </div>
    </div>
  )
}

// ── MonthFilterPanel ──────────────────────────────────────────────────────────

function MonthFilterPanel({ month, year, onChangeMonth, onChangeYear, onApply, onClear }: {
  month: number | null; year: number
  onChangeMonth: (m: number) => void
  onChangeYear: (y: number) => void
  onApply: () => void; onClear: () => void
}) {
  return (
    <div style={{ position: 'absolute', left: 0, top: '100%', marginTop: 8, zIndex: 50, width: 340, background: '#FFF', border: '1px solid #E1E8EC', borderRadius: 8, boxShadow: '0 4px 8px rgba(28,28,28,0.15)' }}>
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E1E8EC' }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: '#1C1C1C', fontFamily: 'Inter,sans-serif' }}>Filter Bulan</span>
        <div className="flex items-center gap-2">
          <button onClick={() => onChangeYear(year - 1)} className="p-1 rounded hover:bg-app-bg"><ChevronLeft size={14} /></button>
          <span style={{ fontWeight: 600, fontSize: 14, color: '#076c9e', minWidth: 44, textAlign: 'center', fontFamily: 'Inter,sans-serif' }}>{year}</span>
          <button onClick={() => onChangeYear(Math.min(CURRENT_YEAR + 1, year + 1))} className="p-1 rounded hover:bg-app-bg"><ChevronRight size={14} /></button>
        </div>
      </div>
      <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {MONTHS_SHORT.map((m, i) => (
          <button key={i} onClick={() => onChangeMonth(i + 1)}
            style={{
              padding: '8px 4px', borderRadius: 8, border: '1px solid', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontWeight: 500, fontSize: 13, transition: 'all 0.15s',
              borderColor: month === i + 1 ? '#076c9e' : '#E1E8EC',
              background: month === i + 1 ? '#076c9e' : 'transparent',
              color: month === i + 1 ? '#FFF' : '#5F737F',
            }}
          >{m}</button>
        ))}
      </div>
      <div style={{ padding: '0 16px 16px', display: 'flex', gap: 8 }}>
        <button onClick={onApply} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Terapkan</button>
        <button onClick={onClear} style={{ flex: 1, padding: '12px 20px', borderRadius: 22, border: '1px solid #D92D20', background: '#FFF', color: '#D92D20', fontFamily: 'Inter,sans-serif', fontWeight: 500, fontSize: 14, cursor: 'pointer' }}>Hapus Filter</button>
      </div>
    </div>
  )
}

// ── YearFilterPanel ───────────────────────────────────────────────────────────

function YearFilterPanel({ selectedYear, onSelect, onApply, onClear }: {
  selectedYear: number | null
  onSelect: (y: number) => void
  onApply: () => void
  onClear: () => void
}) {
  return (
    <div style={{ position: 'absolute', left: 0, top: '100%', marginTop: 8, zIndex: 50, width: 200, background: '#FFF', border: '1px solid #E1E8EC', borderRadius: 8, boxShadow: '0 4px 8px rgba(28,28,28,0.15)' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #E1E8EC' }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: '#1C1C1C', fontFamily: 'Inter,sans-serif' }}>Filter Tahun</span>
      </div>
      <div style={{ padding: '8px 0', maxHeight: 240, overflowY: 'auto' }}>
        {YEARS.map(y => (
          <button key={y} onClick={() => onSelect(y)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '10px 16px', border: 'none', background: selectedYear === y ? '#EBF5FF' : 'transparent', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontWeight: selectedYear === y ? 700 : 500, fontSize: 14, color: selectedYear === y ? '#076c9e' : '#5F737F', transition: 'background 0.15s' }}
            onMouseEnter={e => { if (selectedYear !== y) e.currentTarget.style.background = '#F6F9FC' }}
            onMouseLeave={e => { if (selectedYear !== y) e.currentTarget.style.background = 'transparent' }}
          >
            {selectedYear === y && <Check size={12} />}
            {y}
          </button>
        ))}
      </div>
      <div style={{ padding: '8px 16px 16px', display: 'flex', gap: 8 }}>
        <button onClick={onApply} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Terapkan</button>
        <button onClick={onClear} style={{ padding: '10px', borderRadius: 22, border: '1px solid #D92D20', background: '#FFF', color: '#D92D20', fontFamily: 'Inter,sans-serif', fontWeight: 500, fontSize: 13, cursor: 'pointer', flex: 1 }}>Hapus</button>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function HistoryGangguanPage() {
  const [rows, setRows] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isAdminUser, setIsAdminUser] = useState(false)
  const [towerOptions, setTowerOptions] = useState<TowerOption[]>([])

  // Filters
  const [search, setSearch] = useState('')
  const [filterMode, setFilterMode] = useState<FilterMode>(null)
  const [activeFilter, setActiveFilter] = useState<FilterMode>(null) // applied filter
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [filterMonth, setFilterMonth] = useState<number | null>(null)
  const [filterYear, setFilterYear] = useState<number>(CURRENT_YEAR)
  const [appliedMonth, setAppliedMonth] = useState<number | null>(null)
  const [appliedYear, setAppliedYear] = useState<number | null>(null)
  const [appliedDateFrom, setAppliedDateFrom] = useState('')
  const [appliedDateTo, setAppliedDateTo] = useState('')

  // Pagination
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerType, setDrawerType] = useState<ReportType | null>(null)
  const [editRow, setEditRow] = useState<any | null>(null)
  const [viewMode, setViewMode] = useState<'edit' | 'detail'>('edit')
  const [deleteRow, setDeleteRow] = useState<any | null>(null)

  // Filter popup refs
  const dateRef = useRef<HTMLDivElement>(null)
  const monthRef = useRef<HTMLDivElement>(null)
  const yearRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (filterMode === 'date'  && dateRef.current  && !dateRef.current.contains(e.target as Node))  setFilterMode(null)
      if (filterMode === 'month' && monthRef.current && !monthRef.current.contains(e.target as Node)) setFilterMode(null)
      if (filterMode === 'year'  && yearRef.current  && !yearRef.current.contains(e.target as Node))  setFilterMode(null)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [filterMode])

  const { isMobile } = useSidebar()

  // Compute API date params from applied filter
  const { apiTglMulai, apiTglAkhir } = useMemo(() => {
    if (activeFilter === 'date') return { apiTglMulai: appliedDateFrom, apiTglAkhir: appliedDateTo }
    if (activeFilter === 'month' && appliedMonth !== null && appliedYear !== null) {
      const start = `${appliedYear}-${String(appliedMonth).padStart(2, '0')}-01`
      const lastDay = new Date(appliedYear, appliedMonth, 0).getDate()
      const end = `${appliedYear}-${String(appliedMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
      return { apiTglMulai: start, apiTglAkhir: end }
    }
    if (activeFilter === 'year' && appliedYear !== null) {
      return { apiTglMulai: `${appliedYear}-01-01`, apiTglAkhir: `${appliedYear}-12-31` }
    }
    return { apiTglMulai: '', apiTglAkhir: '' }
  }, [activeFilter, appliedDateFrom, appliedDateTo, appliedMonth, appliedYear])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const hasActiveFilter = Boolean(activeFilter)
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await laporanApi.getAll({
        page,
        limit: pageSize,
        search: search.trim() || undefined,
        tglMulai: apiTglMulai || undefined,
        tglAkhir: apiTglAkhir || undefined,
      })
      const payload = res.data
      if (Array.isArray(payload)) { setRows(payload); setTotal(payload.length) }
      else { setRows(payload.data ?? []); setTotal(payload.total ?? 0) }
    } catch { setRows([]); setTotal(0) }
    finally { setLoading(false) }
  }, [page, pageSize, search, apiTglMulai, apiTglAkhir])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { setIsAdminUser(isAdmin()) }, [])
  useEffect(() => {
    towersApi.getDropdown().then(res => setTowerOptions(res.data ?? [])).catch(() => {})
  }, [])

  function clearAllFilters() {
    setActiveFilter(null)
    setAppliedDateFrom(''); setAppliedDateTo('')
    setAppliedMonth(null); setAppliedYear(null)
    setDateFrom(''); setDateTo('')
    setFilterMonth(null); setFilterYear(CURRENT_YEAR)
    setPage(1)
  }

  function openDrawer(type: ReportType, row: any | null = null, mode: 'edit' | 'detail' = 'edit') {
    setDrawerType(type)
    setEditRow(row)
    setViewMode(mode)
    setDrawerOpen(true)
  }

  function openDetail(row: any) {
    const jenisToType: Record<string, ReportType> = {
      pekerjaan_pihak_lain: 'ppl',
      span: 'span',
      gangguan: 'gangguan',
      kebakaran: 'kebakaran',
    }
    const type = jenisToType[row.jenisGangguan] ?? 'gangguan'
    openDrawer(type, row, 'detail')
  }

  function openEdit(row: any) {
    const jenisToType: Record<string, ReportType> = {
      pekerjaan_pihak_lain: 'ppl',
      span: 'span',
      gangguan: 'gangguan',
      kebakaran: 'kebakaran',
    }
    const type = jenisToType[row.jenisGangguan] ?? 'gangguan'
    openDrawer(type, row, 'edit')
  }

  // Active filter label for display
  const filterLabel = useMemo(() => {
    if (activeFilter === 'date' && appliedDateFrom) {
      const from = new Date(appliedDateFrom).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
      const to = appliedDateTo ? new Date(appliedDateTo).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '—'
      return `${from} – ${to}`
    }
    if (activeFilter === 'month' && appliedMonth) return `${MONTHS[appliedMonth - 1]} ${appliedYear}`
    if (activeFilter === 'year' && appliedYear) return `Tahun ${appliedYear}`
    return null
  }, [activeFilter, appliedDateFrom, appliedDateTo, appliedMonth, appliedYear])

  return (
    <>
      {/* Title */}
      <h1 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: 24, lineHeight: '36px', color: '#1C1C1C', marginBottom: 24 }}>
        Riwayat Gangguan
      </h1>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#FFF', border: '1px solid #E1E8EC', borderRadius: 8, flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ color: '#5F737F', flexShrink: 0 }} />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Cari berdasarkan nama tower..."
            style={{ border: 'none', outline: 'none', fontFamily: 'Inter,sans-serif', fontWeight: 500, fontSize: 14, color: '#1C1C1C', background: 'transparent', width: '100%' }}
          />
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Active filter chip */}
          {filterLabel && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#EBF5FF', border: '1px solid #076c9e', borderRadius: 20 }}>
              <span style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 12, color: '#076c9e' }}>{filterLabel}</span>
              <button onClick={clearAllFilters} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0, color: '#076c9e' }}><X size={12} /></button>
            </div>
          )}

          {/* Date filter */}
          <div style={{ position: 'relative' }} ref={dateRef}>
            <button
              onClick={() => setFilterMode(m => m === 'date' ? null : 'date')}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: activeFilter === 'date' ? '#EBF5FF' : '#FFF', border: `1px solid ${activeFilter === 'date' ? '#076c9e' : '#E1E8EC'}`, borderRadius: 8, cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontWeight: 500, fontSize: 13, color: activeFilter === 'date' ? '#076c9e' : '#5F737F' }}
            >
              <Calendar size={14} /> Tanggal
            </button>
            {filterMode === 'date' && (
              <DateFilterPanel
                dateFrom={dateFrom}
                dateTo={dateTo}
                onChange={(f, t) => { setDateFrom(f); setDateTo(t) }}
                onApply={() => { setAppliedDateFrom(dateFrom); setAppliedDateTo(dateTo); setActiveFilter('date'); setFilterMode(null); setPage(1) }}
                onClear={() => { setDateFrom(''); setDateTo(''); setActiveFilter(null); setFilterMode(null); setPage(1) }}
              />
            )}
          </div>

          {/* Month filter */}
          <div style={{ position: 'relative' }} ref={monthRef}>
            <button
              onClick={() => setFilterMode(m => m === 'month' ? null : 'month')}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: activeFilter === 'month' ? '#EBF5FF' : '#FFF', border: `1px solid ${activeFilter === 'month' ? '#076c9e' : '#E1E8EC'}`, borderRadius: 8, cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontWeight: 500, fontSize: 13, color: activeFilter === 'month' ? '#076c9e' : '#5F737F' }}
            >
              Bulan
            </button>
            {filterMode === 'month' && (
              <MonthFilterPanel
                month={filterMonth}
                year={filterYear}
                onChangeMonth={setFilterMonth}
                onChangeYear={setFilterYear}
                onApply={() => { if (!filterMonth) { toast.error('Pilih bulan terlebih dahulu'); return } setAppliedMonth(filterMonth); setAppliedYear(filterYear); setActiveFilter('month'); setFilterMode(null); setPage(1) }}
                onClear={() => { setFilterMonth(null); setFilterYear(CURRENT_YEAR); setActiveFilter(null); setFilterMode(null); setPage(1) }}
              />
            )}
          </div>

          {/* Year filter */}
          <div style={{ position: 'relative' }} ref={yearRef}>
            <button
              onClick={() => setFilterMode(m => m === 'year' ? null : 'year')}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: activeFilter === 'year' ? '#EBF5FF' : '#FFF', border: `1px solid ${activeFilter === 'year' ? '#076c9e' : '#E1E8EC'}`, borderRadius: 8, cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontWeight: 500, fontSize: 13, color: activeFilter === 'year' ? '#076c9e' : '#5F737F' }}
            >
              Tahun
            </button>
            {filterMode === 'year' && (
              <YearFilterPanel
                selectedYear={appliedYear}
                onSelect={y => { setAppliedYear(y); setFilterYear(y) }}
                onApply={() => { if (!appliedYear) { toast.error('Pilih tahun terlebih dahulu'); return } setActiveFilter('year'); setFilterMode(null); setPage(1) }}
                onClear={() => { setAppliedYear(null); setActiveFilter(null); setFilterMode(null); setPage(1) }}
              />
            )}
          </div>
        </div>

        {/* Add report button */}
        {isMobile ? (
          <button className="btn-primary flex items-center gap-2" onClick={() => openDrawer('gangguan')}>
            <Plus size={16} /> Tambah
          </button>
        ) : (
          <AddReportDropdown onSelect={type => openDrawer(type)} />
        )}
      </div>

      {/* Mobile: show individual type buttons */}
      {isMobile && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {REPORT_TYPE_ITEMS.map(item => (
            <button key={item.type} onClick={() => openDrawer(item.type)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 20, border: '1px solid #E1E8EC', background: '#FFF', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontWeight: 500, fontSize: 12, color: '#5F737F' }}>
              <span className={REPORT_CONFIG[item.type].iconColor}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Table */}
      <div style={{ background: '#FFF', border: '1px solid #E1E8EC', borderRadius: 8, overflow: 'hidden' }}>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Tower</th>
                <th>Jenis Laporan</th>
                <th>Deskripsi</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: pageSize }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j}><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-app-muted py-12 text-[13px]">
                    {hasActiveFilter ? 'Tidak ada data untuk filter yang dipilih' : 'Belum ada riwayat gangguan'}
                  </td>
                </tr>
              ) : (
                rows.map(row => (
                  <tr key={row.id}>
                    <td className="text-[14px] text-[#5f737f]">{formatTanggal(row.tanggal)}</td>
                    <td>
                      <span className="font-mono text-[14px] font-medium text-[#5f737f]">
                        {row.tower?.nomorTower ?? row.towerId ?? '—'}
                      </span>
                      {row.lokasiDetail && (
                        <p className="text-[11px] text-app-subtle mt-0.5">{row.lokasiDetail}</p>
                      )}
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, fontFamily: 'Inter,sans-serif',
                        background: row.jenisGangguan === 'kebakaran' ? '#FEF2F2' : row.jenisGangguan === 'gangguan' ? '#FFFBEB' : row.jenisGangguan === 'span' ? '#F5F3FF' : '#EFF6FF',
                        color: row.jenisGangguan === 'kebakaran' ? '#B91C1C' : row.jenisGangguan === 'gangguan' ? '#92400E' : row.jenisGangguan === 'span' ? '#6D28D9' : '#1D4ED8',
                      }}>
                        {row.jenisGangguan === 'kebakaran' && <Flame size={11} />}
                        {row.jenisGangguan === 'gangguan' && <Zap size={11} />}
                        {row.jenisGangguan === 'span' && <GitBranch size={11} />}
                        {row.jenisGangguan === 'pekerjaan_pihak_lain' && <FileText size={11} />}
                        {JENIS_LABEL[row.jenisGangguan] ?? row.jenisGangguan}
                      </span>
                    </td>
                    <td className="text-[13px] text-[#5f737f] max-w-[200px]">
                      <span className="line-clamp-2">{row.deskripsi ?? '—'}</span>
                    </td>
                    <td><StatusPill status={row.status?.toLowerCase()} /></td>
                    <td className="text-center">
                      <RowActions
                        row={row}
                        onDetail={openDetail}
                        onEdit={openEdit}
                        onDelete={setDeleteRow}
                        showDelete={isAdminUser}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-app-border bg-white px-5 py-3.5">
          <div className="flex items-center gap-2">
            <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }} className="form-input w-auto rounded-md border-[#e1e8ec] py-1.5 pr-8 text-[12px]">
              {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <p className="text-[12px] text-[#97aab3]">baris per halaman</p>
          </div>
          <p className="text-[12px] text-app-text">
            {total === 0 ? 'Tidak ada data' : `Menampilkan ${from} – ${to} dari ${total} data`}
          </p>
          <div className="flex items-center gap-2">
            <select value={page} onChange={e => setPage(Number(e.target.value))} className="form-input w-auto rounded-md border-[#e1e8ec] py-1.5 pr-8 text-[12px]">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <p className="text-[12px] text-[#97aab3]">dari {totalPages} halaman</p>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="rounded-md border border-app-border bg-[#f6f9fc] p-1.5 transition-colors hover:bg-app-bg disabled:opacity-40">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded-md border border-app-border bg-[#f6f9fc] p-1.5 transition-colors hover:bg-app-bg disabled:opacity-40">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Report drawer */}
      <ReportDrawer
        open={drawerOpen}
        type={drawerType}
        initial={editRow}
        readOnly={viewMode === 'detail'}
        towerOptions={towerOptions}
        onClose={() => setDrawerOpen(false)}
        onSaved={fetchData}
      />

      {/* Delete confirm */}
      {deleteRow && (
        <DeleteConfirm
          row={deleteRow}
          onClose={() => setDeleteRow(null)}
          onDeleted={fetchData}
        />
      )}
    </>
  )
}
