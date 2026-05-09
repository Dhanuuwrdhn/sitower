'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import {
  Search, Plus, Calendar, RefreshCw,
  Trash2, X, Upload, ChevronLeft, ChevronRight,
  ChevronDown, MoreHorizontal, Eye, Pencil, MapPin,
} from 'lucide-react'
import { laporanApi, towersApi } from '@/lib/api'
import { getUser, isAdmin } from '@/lib/auth'
import { getDistance } from '@/lib/geo'
import { useSidebar } from '@/components/layout/SidebarContext'

// ── Constants ────────────────────────────────────────────────────────────────

const JENIS_OPTIONS = [
  { value: '', label: 'Semua' },
  { value: 'pekerjaan_pihak_lain', label: 'Pekerjaan Pihak Lain' },
  { value: 'kebakaran',            label: 'Kebakaran' },
  { value: 'layangan',             label: 'Layangan' },
  { value: 'pencurian',            label: 'Pencurian' },
  { value: 'pemanfaatan_lahan',    label: 'Pemanfaatan Lahan' },
]

const JENIS_LABEL: Record<string, string> = {
  pekerjaan_pihak_lain: 'Pekerjaan Pihak Lain',
  kebakaran:            'Kebakaran',
  layangan:             'Layangan',
  pencurian:            'Pencurian',
  pemanfaatan_lahan:    'Pemanfaatan Lahan',
}

const STATUS_OPTIONS = [
  { value: 'berlangsung',         label: 'Sedang Berlangsung' },
  { value: 'selesai',             label: 'Selesai' },
  { value: 'tidak_ada_aktifitas', label: 'Tidak Ada Aktifitas' },
]

const STATUS_LABEL: Record<string, string> = {
  berlangsung:         'Sedang Berlangsung',
  selesai:             'Selesai',
  tidak_ada_aktifitas: 'Tidak Ada Aktifitas',
}

const LEVEL_OPTIONS = [
  { value: 'tinggi',  label: 'Tinggi',  color: 'text-red-600',    bg: 'bg-red-50 border-red-300',   dot: 'bg-red-500' },
  { value: 'sedang',  label: 'Sedang',  color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-300', dot: 'bg-yellow-500' },
  { value: 'rendah',  label: 'Rendah',  color: 'text-green-600',  bg: 'bg-green-50 border-green-300',  dot: 'bg-green-500' },
]

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'Semua' },
  { value: 'berlangsung',         label: 'Sedang Berlangsung' },
  { value: 'selesai',             label: 'Selesai' },
  { value: 'tidak_ada_aktifitas', label: 'Tidak Ada Aktifitas' },
]

const STATUS_CLASS: Record<string, string> = {
  berlangsung:         'badge-berlangsung badge-blink',
  selesai:             'badge-selesai',
  tidak_ada_aktifitas: 'badge-menunggu',
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatTanggal(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function StatusPill({ status }: { status: string }) {
  const label = STATUS_LABEL[status] ?? status
  return <span className={STATUS_CLASS[status] ?? 'badge-menunggu'}>{label}</span>
}

// ── Row action 3-dot menu ─────────────────────────────────────────────────────

function RowActions({
  row,
  onDetail,
  onEdit,
  onDelete,
  showDelete,
}: {
  row: any
  onDetail: (row: any) => void
  onEdit: (row: any) => void
  onDelete: (row: any) => void
  showDelete: boolean
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative inline-flex mx-auto" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1.5 rounded-lg hover:bg-app-bg text-app-muted hover:text-app-text transition-colors"
        title="Aksi"
      >
        <MoreHorizontal size={16} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-8 z-50 bg-white border border-app-border rounded-xl shadow-dropdown w-48 py-1 overflow-hidden"
        >
          <button
            onClick={() => { setOpen(false); onDetail(row) }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-app-text hover:bg-app-bg transition-colors text-left"
          >
            <Eye size={14} className="text-blue-500" />
            Lihat Detail Laporan
          </button>
          <button
            onClick={() => { setOpen(false); onEdit(row) }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-app-text hover:bg-app-bg transition-colors text-left"
          >
            <Pencil size={14} className="text-app-muted" />
            Edit Laporan
          </button>
          {showDelete && (
            <>
              <div className="mx-3 my-1 border-t border-app-border" />
              <button
                onClick={() => { setOpen(false); onDelete(row) }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 transition-colors text-left"
              >
                <Trash2 size={14} />
                Hapus
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ── Tower searchable dropdown ─────────────────────────────────────────────────

interface TowerOption {
  id: string
  nomorTower: string
  garduInduk: string
  tipe: string
  lat?: number
  lng?: number
}

function TowerDropdown({
  options,
  value,
  onChange,
}: {
  options: TowerOption[]
  value: string
  onChange: (id: string, label: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const groups = ['garduInduk', 'SUTET', 'SUTT', 'SKTT'] as const
  const grouped: Record<string, TowerOption[]> = { garduInduk: [], SUTET: [], SUTT: [], SKTT: [] }
  options
    .filter((t) =>
      !search || t.nomorTower.toLowerCase().includes(search.toLowerCase()) ||
      t.garduInduk.toLowerCase().includes(search.toLowerCase())
    )
    .forEach((t) => {
      if (grouped[t.tipe]) grouped[t.tipe].push(t)
    })

  const selectedLabel = value
    ? options.find((o) => o.id === value)?.nomorTower ?? value
    : ''

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="form-input flex items-center justify-between text-left"
      >
        <span className={selectedLabel ? 'text-app-text' : 'text-app-subtle'}>
          {selectedLabel || 'Pilih tower...'}
        </span>
        <ChevronDown size={14} className="text-app-muted shrink-0" />
      </button>

      {open && (
        <div className="absolute z-50 left-0 top-[42px] w-full bg-white border border-app-border rounded-xl shadow-dropdown max-h-72 flex flex-col">
          <div className="p-2 border-b border-app-border">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nomor tower..."
              className="form-input text-[12px]"
            />
          </div>
          <div className="overflow-y-auto">
            {groups.map((g) =>
              grouped[g].length > 0 ? (
                <div key={g}>
                  <p className="px-3 py-1.5 text-[10px] font-bold text-app-muted uppercase tracking-wider bg-app-bg">
                    {g === 'garduInduk' ? 'Gardu Induk' : g}
                  </p>
                  {grouped[g].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => { onChange(t.id, t.nomorTower); setOpen(false); setSearch('') }}
                      className={`w-full text-left px-3 py-2 text-[13px] hover:bg-app-bg transition-colors ${value === t.id ? 'text-blue-600 font-semibold' : 'text-app-text'}`}
                    >
                      <span className="font-mono">{t.nomorTower}</span>
                      {t.garduInduk && (
                        <span className="ml-2 text-[11px] text-app-muted">{t.garduInduk}</span>
                      )}
                    </button>
                  ))}
                </div>
              ) : null
            )}
            {groups.every((g) => grouped[g].length === 0) && (
              <p className="text-center text-[13px] text-app-muted py-6">Tower tidak ditemukan</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Upload zone ───────────────────────────────────────────────────────────────

function FotoUpload({
  fotos,
  onChange,
  onPhotoAdded,
}: {
  fotos: File[]
  onChange: (files: File[]) => void
  onPhotoAdded?: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function addFiles(incoming: FileList | null) {
    if (!incoming) return
    const valid = Array.from(incoming).filter(
      (f) => f.size <= 5 * 1024 * 1024 && /\.(jpe?g|png|webp)$/i.test(f.name)
    )
    const next = [...fotos, ...valid].slice(0, 10)
    onChange(next)
    if (valid.length > 0 && onPhotoAdded) onPhotoAdded()
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 py-8 cursor-pointer transition-colors ${
          dragging ? 'border-blue-400 bg-blue-50' : 'border-app-border hover:border-blue-300 hover:bg-app-bg'
        }`}
      >
        <Upload size={22} className="text-app-muted" />
        <p className="text-[13px] text-app-muted">
          Drag & drop foto, atau <span className="text-blue-600 font-medium">klik untuk pilih</span>
        </p>
        <p className="text-[11px] text-app-subtle">JPG, PNG, WEBP · Maks 5MB per file · Maks 10 foto</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        multiple
        className="hidden"
        onChange={(e) => addFiles(e.target.files)}
      />
      {fotos.length > 0 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {fotos.map((f, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden bg-app-bg aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(f)}
                alt={f.name}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => onChange(fotos.filter((_, j) => j !== i))}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Form drawer ───────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  towerId: '',
  towerLabel: '',
  jenisGangguan: '',
  tanggalWaktu: new Date().toISOString().slice(0, 16),
  levelRisiko: 'sedang',
  status: 'berlangsung',
  lokasiDetail: '',
  deskripsi: '',
  keterangan: '',
  // CUI / Cleanup
  teknisi: '',
  noSpk: '',
  temuan: '',
  hasil: '',
  // Gangguan
  penyebab: '',
  durasi: '',
}

function LaporanDrawer({
  open,
  initial,
  readOnly = false,
  towerOptions,
  initialFotos,
  onClose,
  onSaved,
}: {
  open: boolean
  initial: any | null
  initialFotos?: File[]
  readOnly?: boolean
  towerOptions: TowerOption[]
  onClose: () => void
  onSaved: () => void
}) {
  const user = getUser()
  const [form, setForm] = useState(EMPTY_FORM)
  const [fotos, setFotos] = useState<File[]>([])
  const [fotoUrls, setFotoUrls] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [locating, setLocating] = useState(false)
  const [detectedMsg, setDetectedMsg] = useState('')

  useEffect(() => {
    if (open) {
      if (initial) {
        setForm({
          ...EMPTY_FORM,
          towerId: initial.towerId ?? '',
          towerLabel: initial.tower?.nomorTower ?? '',
          jenisGangguan: initial.jenisGangguan ?? '',
          tanggalWaktu: initial.tanggal?.slice(0, 16) ?? new Date().toISOString().slice(0, 16),
          levelRisiko: initial.levelRisiko ?? 'sedang',
          status: initial.status ?? 'berlangsung',
          lokasiDetail: initial.lokasiDetail ?? '',
          deskripsi: initial.deskripsi ?? '',
          keterangan: initial.keterangan ?? '',
          teknisi: initial.teknisi ?? '',
          noSpk: initial.noSpk ?? '',
          temuan: initial.temuan ?? '',
          hasil: initial.hasil ?? '',
          penyebab: initial.penyebab ?? '',
          durasi: initial.durasi ?? '',
        })
        setFotoUrls(initial.foto ?? [])
      } else {
        setForm(EMPTY_FORM)
        setFotos(initialFotos || [])
        setFotoUrls([])
        setDetectedMsg('')
        if (initialFotos && initialFotos.length > 0) {
          setTimeout(() => {
            document.getElementById('btn-detect-location')?.click()
          }, 100)
        }
      }
    }
  }, [open, initial, initialFotos])

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleDetectLocation = () => {
    if (readOnly || locating) return
    if (!navigator.geolocation) {
      toast.error('Browser tidak mendukung deteksi lokasi')
      return
    }
    setLocating(true)
    setDetectedMsg('Mendeteksi lokasi Anda...')
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude
        const userLng = pos.coords.longitude
        let minDistance = Infinity
        let nearest: TowerOption | null = null

        for (const t of towerOptions) {
          if (t.lat && t.lng) {
            const d = getDistance(userLat, userLng, t.lat, t.lng)
            if (d < minDistance) {
              minDistance = d
              nearest = t
            }
          }
        }

        if (nearest && minDistance <= 500) {
          setForm(f => ({ ...f, towerId: nearest!.id, towerLabel: nearest!.nomorTower }))
          setDetectedMsg(`📍 Berada di dekat Tower ${nearest.nomorTower} (${Math.round(minDistance)}m)`)
          toast.success('Tower terdekat otomatis dipilih!')
        } else if (nearest) {
          setDetectedMsg(`⚠️ Tower terdekat (${nearest.nomorTower}) berjarak ${Math.round(minDistance)}m (di atas 500m)`)
          toast.error('Lokasi Anda terlalu jauh dari tower terdekat.')
        } else {
          setDetectedMsg('')
        }
        setLocating(false)
      },
      (err) => {
        setDetectedMsg('')
        if (err.code === 1) {
          // Permission denied — likely HTTP or user denied
          toast.error('Izin lokasi ditolak. Silakan pilih tower secara manual.')
        } else {
          toast.error('Gagal mendapatkan lokasi. Silakan pilih tower manual.')
        }
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (readOnly) { onClose(); return }
    if (!form.towerId) { toast.error('Pilih tower terlebih dahulu'); return }
    if (!form.jenisGangguan) { toast.error('Pilih kategori gangguan'); return }

    setSaving(true)
    try {
      let uploadedUrls: string[] = []
      if (fotos.length > 0) {
        const up = await laporanApi.uploadFoto(fotos)
        uploadedUrls = up.data.urls ?? []
      }

      const payload = {
        towerId: form.towerId,
        jenisGangguan: form.jenisGangguan,
        tanggal: form.tanggalWaktu,
        levelRisiko: form.levelRisiko,
        status: form.status,
        lokasiDetail: form.lokasiDetail,
        deskripsi: form.deskripsi,
        keterangan: form.keterangan,
        foto: [...fotoUrls, ...uploadedUrls],
        ...((['cui', 'cleanup'].includes(form.jenisGangguan)) && {
          teknisi: form.teknisi,
          noSpk: form.noSpk,
          temuan: form.jenisGangguan === 'cui' ? form.temuan : undefined,
          hasil: form.jenisGangguan === 'cui' ? form.hasil : undefined,
        }),
        ...(form.jenisGangguan === 'gangguan' && {
          penyebab: form.penyebab,
          durasi: form.durasi,
        }),
      }

      if (initial?.id) {
        await laporanApi.update(initial.id, payload)
        toast.success('Laporan berhasil diperbarui')
      } else {
        await laporanApi.create(payload)
        toast.success('Laporan berhasil ditambahkan')
      }
      onSaved()
      onClose()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Gagal menyimpan laporan')
    } finally {
      setSaving(false)
    }
  }

  const isCUI     = form.jenisGangguan === 'cui'
  const isCleanup = form.jenisGangguan === 'cleanup'
  const isGangg   = form.jenisGangguan === 'gangguan'

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 bottom-0 z-50 flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out w-full sm:w-[560px] ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-app-border shrink-0">
          <h2 className="text-[15px] font-bold text-app-text">
            {readOnly ? 'Detail Laporan' : initial ? 'Edit Laporan' : 'Tambah Laporan Baru'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-app-bg text-app-muted transition-colors">
            <X size={18} />
          </button>
        </div>

        <form id="laporan-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Tower</label>
            {readOnly ? (
              <input type="text" readOnly className="form-input bg-app-bg text-app-muted" value={form.towerId} />
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <TowerDropdown
                      options={towerOptions}
                      value={form.towerId}
                      onChange={(id, label) => setForm((f) => ({ ...f, towerId: id, towerLabel: label }))}
                    />
                  </div>
                  <button
                    id="btn-detect-location"
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={locating}
                    className="p-3 bg-app-bg border border-app-border rounded-xl text-app-muted hover:text-blue-600 hover:bg-blue-50 transition-colors shrink-0 disabled:opacity-50"
                    title="Deteksi Tower Terdekat via GPS"
                  >
                    <MapPin size={18} className={locating ? 'animate-pulse text-blue-500' : ''} />
                  </button>
                </div>
                {detectedMsg && (
                  <p className={`text-[12px] font-medium ${detectedMsg.includes('⚠️') ? 'text-orange-600' : 'text-green-600'}`}>
                    {detectedMsg}
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Kategori Gangguan</label>
            <select disabled={readOnly} value={form.jenisGangguan} onChange={(e) => set('jenisGangguan', e.target.value)} className="form-input">
              <option value="">Pilih kategori...</option>
              {JENIS_OPTIONS.filter((o) => o.value).map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Tanggal & Waktu</label>
            <input disabled={readOnly} type="datetime-local" value={form.tanggalWaktu} onChange={(e) => set('tanggalWaktu', e.target.value)} className="form-input" />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-2">Level Risiko</label>
            <div className="grid grid-cols-3 gap-2">
              {LEVEL_OPTIONS.map((l) => (
                <button
                  key={l.value}
                  type="button"
                  disabled={readOnly}
                  onClick={() => set('levelRisiko', l.value)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 transition-all text-[13px] font-semibold ${
                    form.levelRisiko === l.value ? `${l.bg} ${l.color} border-current` : 'border-app-border text-app-muted hover:border-gray-300'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${l.dot}`} />
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Status</label>
            <div className="flex items-center gap-3">
              <select disabled={readOnly} value={form.status} onChange={(e) => set('status', e.target.value)} className="form-input">
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <StatusPill status={form.status} />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Lokasi Detail</label>
            <input disabled={readOnly} type="text" value={form.lokasiDetail} onChange={(e) => set('lokasiDetail', e.target.value)} className="form-input" />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Deskripsi</label>
            <textarea disabled={readOnly} rows={4} value={form.deskripsi} onChange={(e) => set('deskripsi', e.target.value)} className="form-input resize-none" />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Foto Dokumentasi</label>
            {fotoUrls.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mb-3">
                {fotoUrls.map((url, i) => (
                  <img key={i} src={url} alt="Foto Gangguan" className="w-full aspect-square object-cover rounded-lg" />
                ))}
              </div>
            )}
            {!readOnly && <FotoUpload fotos={fotos} onChange={setFotos} onPhotoAdded={handleDetectLocation} />}
          </div>

          {(isCUI || isCleanup) && (
            <div className="space-y-4 p-4 bg-app-bg rounded-xl border border-app-border">
              <p className="text-[11px] font-bold text-app-muted uppercase tracking-wider">{isCUI ? 'Detail CUI' : 'Detail Cleanup'}</p>
              <div><label className="block text-[12px] font-semibold text-app-text mb-1.5">Teknisi</label><input disabled={readOnly} type="text" value={form.teknisi} onChange={(e) => set('teknisi', e.target.value)} className="form-input" /></div>
              <div><label className="block text-[12px] font-semibold text-app-text mb-1.5">No. SPK</label><input disabled={readOnly} type="text" value={form.noSpk} onChange={(e) => set('noSpk', e.target.value)} className="form-input" /></div>
              {isCUI && (
                <>
                  <div><label className="block text-[12px] font-semibold text-app-text mb-1.5">Temuan</label><textarea disabled={readOnly} rows={3} value={form.temuan} onChange={(e) => set('temuan', e.target.value)} className="form-input resize-none" /></div>
                  <div><label className="block text-[12px] font-semibold text-app-text mb-1.5">Hasil Inspeksi</label><textarea disabled={readOnly} rows={3} value={form.hasil} onChange={(e) => set('hasil', e.target.value)} className="form-input resize-none" /></div>
                </>
              )}
            </div>
          )}

          {isGangg && (
            <div className="space-y-4 p-4 bg-app-bg rounded-xl border border-app-border">
              <p className="text-[11px] font-bold text-app-muted uppercase tracking-wider">Detail Gangguan Teknis</p>
              <div><label className="block text-[12px] font-semibold text-app-text mb-1.5">Penyebab</label><input disabled={readOnly} type="text" value={form.penyebab} onChange={(e) => set('penyebab', e.target.value)} className="form-input" /></div>
              <div><label className="block text-[12px] font-semibold text-app-text mb-1.5">Durasi (jam)</label><input disabled={readOnly} type="number" value={form.durasi} onChange={(e) => set('durasi', e.target.value)} className="form-input" /></div>
            </div>
          )}

          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Keterangan</label>
            <textarea disabled={readOnly} rows={3} value={form.keterangan} onChange={(e) => set('keterangan', e.target.value)} className="form-input resize-none" />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Pelapor</label>
            <input type="text" value={initial?.pelapor?.nama ?? user?.nama ?? '—'} readOnly className="form-input bg-app-bg text-app-muted cursor-not-allowed" />
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-app-border shrink-0 bg-white">
          <button type="button" onClick={onClose} className="btn-outline">
            {readOnly ? 'Tutup' : 'Batal'}
          </button>
          {!readOnly && (
            <button type="submit" form="laporan-form" disabled={saving} className="btn-primary">
              {saving ? 'Menyimpan...' : 'Simpan Laporan'}
            </button>
          )}
        </div>
      </div>
    </>
  )
}

// ── Delete confirm ────────────────────────────────────────────────────────────

function DeleteConfirm({
  row,
  onClose,
  onDeleted,
}: {
  row: any | null
  onClose: () => void
  onDeleted: () => void
}) {
  const [loading, setLoading] = useState(false)

  async function confirm() {
    if (!row) return
    setLoading(true)
    try {
      await laporanApi.delete(row.id)
      toast.success('Laporan berhasil dihapus')
      onDeleted()
      onClose()
    } catch {
      toast.error('Gagal menghapus laporan')
    } finally {
      setLoading(false)
    }
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
          Laporan gangguan tower <span className="font-semibold text-app-text">{row.tower?.nomorTower ?? row.tower}</span> akan dihapus permanen.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-outline flex-1 justify-center">Batal</button>
          <button onClick={confirm} disabled={loading} className="flex-1 justify-center inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-full hover:bg-red-600 transition-colors cursor-pointer border-none">
            {loading ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function GangguanPage() {
  const [rows, setRows] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isAdminUser, setIsAdminUser] = useState(false)

  // Filters
  const [search, setSearch] = useState('')
  const [jenis, setJenis] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [tglMulai, setTglMulai] = useState('')
  const [tglAkhir, setTglAkhir] = useState('')

  // Pagination
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Tower dropdown options
  const [towerOptions, setTowerOptions] = useState<TowerOption[]>([])

  // Drawer / modal state
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [pendingFotos, setPendingFotos] = useState<File[]>([])
  const [editRow, setEditRow] = useState<any | null>(null)
  const [deleteRow, setDeleteRow] = useState<any | null>(null)
  const [viewMode, setViewMode] = useState<'edit' | 'detail' | null>(null)

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const hasActiveFilters = Boolean(search.trim() || jenis || statusFilter || tglMulai || tglAkhir)
  const { isMobile } = useSidebar()

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await laporanApi.getAll({
        page,
        limit: pageSize,
        search: search.trim() || undefined,
        jenisGangguan: jenis || undefined,
        status: statusFilter || undefined,
        tglMulai: tglMulai || undefined,
        tglAkhir: tglAkhir || undefined,
      })
      const payload = res.data
      if (Array.isArray(payload)) {
        setRows(payload)
        setTotal(payload.length)
      } else {
        setRows(payload.data ?? [])
        setTotal(payload.total ?? 0)
      }
    } catch {
      setRows([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, search, jenis, statusFilter, tglMulai, tglAkhir])

  useEffect(() => { fetchData() }, [fetchData])

  // Set role setelah mount agar tidak mismatch SSR/CSR
  useEffect(() => { setIsAdminUser(isAdmin()) }, [])

  useEffect(() => {
    towersApi.getDropdown()
      .then((res) => setTowerOptions(res.data ?? []))
      .catch(() => {})
  }, [])

  function resetFilters() {
    setSearch('')
    setJenis('')
    setStatusFilter('')
    setTglMulai('')
    setTglAkhir('')
    setPage(1)
  }

  function openAdd() { setEditRow(null); setViewMode('edit'); setPendingFotos([]); setDrawerOpen(true) }
  function openEdit(row: any) { setEditRow(row); setViewMode('edit'); setDrawerOpen(true) }
  function openDetail(row: any) { setEditRow(row); setViewMode('detail'); setDrawerOpen(true) }

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to   = Math.min(page * pageSize, total)

  return (
    <>
      {/* Header + action */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-app-text">Riwayat Gangguan</h1>
        {isMobile ? (
          <label className="btn-primary cursor-pointer flex items-center gap-2 m-0">
            <Plus size={16} /> Tambah Laporan Baru
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              className="hidden" 
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  const valid = Array.from(e.target.files).filter(f => f.size <= 5 * 1024 * 1024 && /\.(jpe?g|png|webp)$/i.test(f.name))
                  setPendingFotos(valid)
                  setEditRow(null)
                  setViewMode('edit')
                  setDrawerOpen(true)
                }
                e.target.value = ''
              }}
            />
          </label>
        ) : (
          <button className="btn-primary flex items-center gap-2" onClick={openAdd}>
            <Plus size={16} /> Tambah Laporan Baru
          </button>
        )}
      </div>

      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="relative w-full max-w-[352px]">
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-app-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Cari berdasarkan nama tower"
            className="form-input h-11 rounded-lg border-[#e1e8ec] pl-11 pr-4 text-[14px] placeholder:text-[#566b75]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden border-[#e1e8ec]">
        <div className="border-b border-app-border px-6 pb-6 pt-5">
          <div className="flex flex-wrap items-end gap-4">
            <div className="w-full max-w-[200px]">
              <label className="mb-1 block text-[14px] font-bold text-app-text">
                Jenis Gangguan
              </label>
              <select
                value={jenis}
                onChange={(e) => { setJenis(e.target.value); setPage(1) }}
                className="form-input h-11 rounded-lg border-[#e1e8ec] pr-8 text-[14px]"
              >
                {JENIS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="w-full max-w-[200px]">
              <label className="mb-1 block text-[14px] font-bold text-app-text">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
                className="form-input h-11 rounded-lg border-[#e1e8ec] pr-8 text-[14px]"
              >
                {STATUS_FILTER_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="w-full max-w-[184px]">
              <label className="mb-1 block text-[14px] font-bold text-app-text">
                Tanggal Mulai
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={tglMulai}
                  onChange={(e) => { setTglMulai(e.target.value); setPage(1) }}
                  className="form-input h-11 rounded-lg border-[#e1e8ec] pl-4 pr-12 text-[14px]"
                />
                <div className="pointer-events-none absolute inset-y-px right-px flex w-11 items-center justify-center rounded-r-lg border-l border-[#e1e8ec] bg-[#f6f9fc] text-app-muted">
                  <Calendar size={16} />
                </div>
              </div>
            </div>

            <div className="w-full max-w-[184px]">
              <label className="mb-1 block text-[14px] font-bold text-app-text">
                Tanggal Berakhir
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={tglAkhir}
                  onChange={(e) => { setTglAkhir(e.target.value); setPage(1) }}
                  className="form-input h-11 rounded-lg border-[#e1e8ec] pl-4 pr-12 text-[14px]"
                />
                <div className="pointer-events-none absolute inset-y-px right-px flex w-11 items-center justify-center rounded-r-lg border-l border-[#e1e8ec] bg-[#f6f9fc] text-app-muted">
                  <Calendar size={16} />
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <button onClick={resetFilters} className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#d92d20] bg-white px-4 text-[14px] font-medium text-[#d92d20] transition-colors hover:bg-red-50">
                <RefreshCw size={16} />
                Hapus Filter
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="bg-[#f6f9fc]">Tanggal</th>
                <th className="bg-[#f6f9fc]">Tower</th>
                <th className="bg-[#f6f9fc]">Jenis Gangguan</th>
                <th className="bg-[#f6f9fc]">Teknisi</th>
                <th className="bg-[#f6f9fc]">Status</th>
                <th className="bg-[#f6f9fc] text-right pr-5">Aksi</th>
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
                    Tidak ada data laporan yang sesuai filter
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id}>
                    <td className="text-[14px] text-[#5f737f]">{formatTanggal(row.tanggal)}</td>
                    <td>
                      <span className="font-mono text-[14px] font-medium text-[#5f737f]">
                        {row.tower?.nomorTower ?? row.towerId ?? '—'}
                      </span>
                    </td>
                    <td className="text-[14px] text-[#5f737f]">{JENIS_LABEL[row.jenisGangguan] ?? row.jenisGangguan ?? '—'}</td>
                    <td className="text-[14px] text-[#5f737f]">{row.teknisi ?? row.pelapor?.nama ?? row.pegawai?.nama ?? '—'}</td>
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
          {/* Page size */}
          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}
              className="form-input w-auto rounded-md border-[#e1e8ec] py-1.5 pr-8 text-[12px]"
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <p className="text-[12px] text-[#97aab3]">baris per halaman</p>
          </div>

          {/* Info */}
          <p className="text-[12px] text-app-text">
            {total === 0 ? 'Tidak ada data' : `Menampilkan ${from} - ${to} dari ${total} data`}
          </p>

          {/* Page nav */}
          <div className="flex items-center gap-2">
            <select
              value={page}
              onChange={(e) => setPage(Number(e.target.value))}
              className="form-input w-auto rounded-md border-[#e1e8ec] py-1.5 pr-8 text-[12px]"
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <p className="text-[12px] text-[#97aab3]">dari {totalPages} halaman</p>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-md border border-app-border bg-[#f6f9fc] p-1.5 transition-colors hover:bg-app-bg disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-md border border-app-border bg-[#f6f9fc] p-1.5 transition-colors hover:bg-app-bg disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Drawer */}
      <LaporanDrawer
        open={drawerOpen}
        initial={editRow}
        initialFotos={pendingFotos}
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
