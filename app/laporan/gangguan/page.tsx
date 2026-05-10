'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import {
  Search, Plus, Calendar, SlidersHorizontal, RotateCcw,
  Trash2, X, Upload, ChevronLeft, ChevronRight,
  ChevronDown, MoreHorizontal, Eye, Pencil,
  ArrowLeft, AlertTriangle,
} from 'lucide-react'
import { laporanApi, towersApi } from '@/lib/api'
import { getUser, isAdmin } from '@/lib/auth'
import { getDistance } from '@/lib/geo'
import { useSidebar } from '@/components/layout/SidebarContext'
import CalendarPickerSheet from '@/components/ui/CalendarPickerSheet'

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
          style={{
            position: 'absolute',
            right: 0,
            top: 32,
            zIndex: 50,
            background: '#FFFFFF',
            borderRadius: 4,
            boxShadow: '0px 4px 8px 0px rgba(28, 28, 28, 0.15)',
            padding: '8px 0',
            minWidth: 200,
          }}
        >
          <button
            onClick={() => { setOpen(false); onDetail(row) }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '8px 8px',
              width: '100%',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              color: '#5F737F',
              lineHeight: '20px',
              textAlign: 'left' as const,
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#F6F9FC')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <Eye size={16} />
            Lihat Detail Laporan
          </button>

          {/* Divider */}
          <div style={{ height: 1, background: '#E1E8EC', margin: '0' }} />

          <button
            onClick={() => { setOpen(false); onEdit(row) }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '8px 8px',
              width: '100%',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              color: '#5F737F',
              lineHeight: '20px',
              textAlign: 'left' as const,
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#F6F9FC')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <Pencil size={16} />
            Edit Laporan
          </button>

          {showDelete && (
            <>
              <div style={{ height: 1, background: '#E1E8EC', margin: '0' }} />
              <button
                onClick={() => { setOpen(false); onDelete(row) }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '8px 8px',
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 500,
                  fontFamily: 'Inter, sans-serif',
                  color: '#D92D20',
                  lineHeight: '20px',
                  textAlign: 'left' as const,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#FEF3F2')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <Trash2 size={16} />
                Hapus Laporan
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
  radius?: number
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
  towerIdEnd: '',       // span end tower (pekerjaan_pihak_lain)
  towerLabelEnd: '',
  jenisGangguan: '',
  tanggalWaktu: new Date().toISOString().slice(0, 16),
  levelRisiko: 'sedang',
  status: 'berlangsung',
  lokasiDetail: '',     // stores span "T-x s/d T-y" for ppl
  deskripsi: '',        // Uraian Pekerjaan
  keterangan: '',       // Upaya Pengendalian (ppl) / notes
  pihakLain: '',        // company name for pekerjaan_pihak_lain (stored in teknisi)
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
  const { isMobile } = useSidebar()
  const [form, setForm] = useState(EMPTY_FORM)
  const [fotos, setFotos] = useState<File[]>([])
  const [fotoUrls, setFotoUrls] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [locating, setLocating] = useState(false)
  const [useGPS, setUseGPS] = useState(false)
  const [detectedMsg, setDetectedMsg] = useState('')
  const [alertVisible, setAlertVisible] = useState(true)

  useEffect(() => {
    if (open) {
      setAlertVisible(true)
      if (initial) {
        const isPPL = initial.jenisGangguan === 'pekerjaan_pihak_lain'
        setForm({
          ...EMPTY_FORM,
          towerId:      initial.towerId ?? '',
          towerLabel:   initial.tower?.nomorTower ?? initial.tower?.id ?? '',
          jenisGangguan: initial.jenisGangguan ?? '',
          tanggalWaktu: initial.tanggal?.slice(0, 16) ?? new Date().toISOString().slice(0, 16),
          levelRisiko:  initial.levelRisiko ?? 'sedang',
          status:       initial.status ?? 'berlangsung',
          lokasiDetail: isPPL ? '' : (initial.lokasiDetail ?? ''),
          deskripsi:    initial.deskripsi ?? '',
          keterangan:   initial.keterangan ?? '',
          pihakLain:    isPPL ? (initial.teknisi ?? '') : '',
          teknisi:      isPPL ? '' : (initial.teknisi ?? ''),
          noSpk:        initial.noSpk ?? '',
          temuan:       initial.temuan ?? '',
          hasil:        initial.hasil ?? '',
          penyebab:     initial.penyebab ?? '',
          durasi:       initial.durasi ?? '',
          towerIdEnd:   '',
          towerLabelEnd: '',
        })
        setFotoUrls(initial.foto ?? [])
      } else {
        setForm(EMPTY_FORM)
        setFotos(initialFotos || [])
        setFotoUrls([])
        setDetectedMsg('')
        setUseGPS(false)
        if (initialFotos && initialFotos.length > 0) {
          setTimeout(() => { document.getElementById('btn-detect-location')?.click() }, 100)
        }
      }
    }
  }, [open, initial, initialFotos])

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleDetectLocation = () => {
    if (readOnly || locating) return
    if (!navigator.geolocation) { toast.error('Browser tidak mendukung deteksi lokasi'); return }
    setLocating(true)
    setDetectedMsg('Mendeteksi lokasi Anda...')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        let min = Infinity; let nearest: TowerOption | null = null
        for (const t of towerOptions) {
          if (t.lat && t.lng) { const d = getDistance(lat, lng, t.lat, t.lng); if (d < min) { min = d; nearest = t } }
        }
        const towerRadius = nearest?.radius ?? 100
        if (nearest && min <= towerRadius) {
          setForm(f => ({ ...f, towerId: nearest!.id, towerLabel: nearest!.nomorTower }))
          setDetectedMsg(`📍 Tower ${nearest.nomorTower} (${Math.round(min)}m)`)
          toast.success('Tower terdekat dipilih!')
        } else if (nearest) {
          setDetectedMsg(`⚠️ Tower terdekat (${nearest.nomorTower}) ${Math.round(min)}m — di luar radius ${towerRadius}m`)
        }
        setLocating(false)
      },
      (err) => {
        if (err.code === 1) {
          setDetectedMsg('')
          toast.error('Izin lokasi ditolak.')
          setLocating(false)
          return
        }
        // High-accuracy failed (desktop/no GPS) — retry with low accuracy
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude: lat, longitude: lng } = pos.coords
            let min = Infinity; let nearest: TowerOption | null = null
            for (const t of towerOptions) {
              if (t.lat && t.lng) { const d = getDistance(lat, lng, t.lat, t.lng); if (d < min) { min = d; nearest = t } }
            }
            const towerRadius = nearest?.radius ?? 100
            if (nearest && min <= towerRadius) {
              setForm(f => ({ ...f, towerId: nearest!.id, towerLabel: nearest!.nomorTower }))
              setDetectedMsg(`📍 Tower ${nearest.nomorTower} (${Math.round(min)}m)`)
              toast.success('Tower terdekat dipilih!')
            } else if (nearest) {
              setDetectedMsg(`⚠️ Tower terdekat (${nearest.nomorTower}) ${Math.round(min)}m — di luar radius ${towerRadius}m`)
            }
            setLocating(false)
          },
          () => {
            setDetectedMsg('')
            toast.error('Gagal mendapatkan lokasi.')
            setLocating(false)
          },
          { enableHighAccuracy: false, timeout: 15000 },
        )
      },
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }

  useEffect(() => {
    if (useGPS && !readOnly) handleDetectLocation()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useGPS])

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

      const isPPL = form.jenisGangguan === 'pekerjaan_pihak_lain'
      const spanLabel = isPPL && form.towerIdEnd
        ? `${form.towerLabel} s/d ${form.towerLabelEnd}`
        : form.lokasiDetail

      const payload = {
        towerId:      form.towerId,
        jenisGangguan: form.jenisGangguan,
        tanggal:      form.tanggalWaktu,
        levelRisiko:  form.levelRisiko,
        status:       form.status,
        lokasiDetail: spanLabel,
        deskripsi:    form.deskripsi,
        keterangan:   form.keterangan,
        foto:         [...fotoUrls, ...uploadedUrls],
        ...(isPPL && { teknisi: form.pihakLain }),
        ...(!isPPL && ['cui', 'cleanup'].includes(form.jenisGangguan) && {
          teknisi: form.teknisi,
          noSpk:   form.noSpk,
          temuan:  form.jenisGangguan === 'cui' ? form.temuan : undefined,
          hasil:   form.jenisGangguan === 'cui' ? form.hasil  : undefined,
        }),
        ...(form.jenisGangguan === 'gangguan' && { penyebab: form.penyebab, durasi: form.durasi }),
      }

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

  const isPPL     = form.jenisGangguan === 'pekerjaan_pihak_lain'
  const isCUI     = form.jenisGangguan === 'cui'
  const isCleanup = form.jenisGangguan === 'cleanup'
  const isGangg   = form.jenisGangguan === 'gangguan'
  const title     = readOnly ? 'Detail Laporan' : initial ? 'Edit Laporan' : 'Buat Laporan Gangguan'

  // ── Shared form body ─────────────────────────────────────────────────────────
  const formBody = (
    <form id="laporan-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

      {/* GPS alert */}
      {!readOnly && alertVisible && (
        <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[12px] text-amber-700 leading-relaxed flex-1">
            Perhatian: Jika anda memilih opsi "Gunakan lokasi saat ini". Pastikan anda sudah menghidupkan akses lokasi di handphone anda.
          </p>
          <button type="button" onClick={() => setAlertVisible(false)} className="text-amber-400 hover:text-amber-600 shrink-0">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Foto bukti */}
      <div>
        <label className="block text-[12px] font-semibold text-app-text mb-1.5">Foto Bukti Terjadinya Gangguan</label>
        {fotoUrls.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mb-2">
            {fotoUrls.map((url, i) => (
              <img key={i} src={url} alt="" className="w-full aspect-square object-cover rounded-lg" />
            ))}
          </div>
        )}
        {!readOnly && <FotoUpload fotos={fotos} onChange={setFotos} onPhotoAdded={handleDetectLocation} />}
      </div>

      {/* Tower terdampak — start (always) */}
      <div>
        <label className="block text-[12px] font-semibold text-app-text mb-1.5">
          {isPPL ? 'Tower Terdampak (Start)' : 'Tower Terganggu'}
        </label>
        {readOnly ? (
          <input readOnly className="form-input bg-app-bg text-app-muted" value={form.towerLabel || form.towerId} />
        ) : (
          <TowerDropdown
            options={towerOptions}
            value={form.towerId}
            onChange={(id, label) => setForm(f => ({ ...f, towerId: id, towerLabel: label }))}
          />
        )}
      </div>

      {/* GPS checkbox */}
      {!readOnly && (
        <div className="flex items-center gap-2.5">
          <div
            onClick={() => setUseGPS(v => !v)}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors shrink-0 ${useGPS ? 'bg-blue-600 border-blue-600' : 'border-app-border bg-white'}`}
          >
            {useGPS && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
          <button
            id="btn-detect-location"
            type="button"
            onClick={() => { setUseGPS(true); if (!locating) handleDetectLocation() }}
            className="text-[13px] text-app-text"
          >
            Gunakan lokasi anda saat ini.
          </button>
          {locating && <span className="text-[11px] text-blue-500 animate-pulse">Mendeteksi...</span>}
        </div>
      )}
      {detectedMsg && (
        <p className={`text-[12px] font-medium -mt-2 ${detectedMsg.includes('⚠️') ? 'text-orange-600' : 'text-green-600'}`}>{detectedMsg}</p>
      )}

      {/* Tower end (span) — only for pekerjaan_pihak_lain */}
      {isPPL && !readOnly && (
        <div>
          <label className="block text-[12px] font-semibold text-app-text mb-1.5">Tower Terdampak (End)</label>
          <TowerDropdown
            options={towerOptions}
            value={form.towerIdEnd}
            onChange={(id, label) => setForm(f => ({ ...f, towerIdEnd: id, towerLabelEnd: label }))}
          />
        </div>
      )}

      {/* Klasifikasi kerawanan */}
      <div>
        <label className="block text-[12px] font-semibold text-app-text mb-1.5">Klasifikasi Kerawanan</label>
        <select
          disabled={readOnly}
          value={form.jenisGangguan}
          onChange={(e) => set('jenisGangguan', e.target.value)}
          className="form-input"
        >
          <option value="">Pilih kategori...</option>
          {JENIS_OPTIONS.filter(o => o.value).map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Uraian Pekerjaan / Deskripsi */}
      <div>
        <label className="block text-[12px] font-semibold text-app-text mb-1.5">
          {isPPL ? 'Uraian Pekerjaan' : 'Deskripsi'}
        </label>
        <textarea
          disabled={readOnly}
          rows={4}
          value={form.deskripsi}
          onChange={(e) => set('deskripsi', e.target.value)}
          className="form-input resize-none"
          placeholder={isPPL ? 'Uraikan pekerjaan pihak lain...' : 'Deskripsi gangguan...'}
        />
      </div>

      {/* Pekerjaan Pihak Lain section */}
      {isPPL && (
        <>
          <div className="flex items-center gap-3 py-1">
            <hr className="flex-1 border-app-border" />
            <span className="text-[11px] font-bold text-app-muted uppercase tracking-wider">Informasi Pihak Lain</span>
            <hr className="flex-1 border-app-border" />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Pihak Lain</label>
            <input
              disabled={readOnly}
              type="text"
              value={form.pihakLain}
              onChange={(e) => set('pihakLain', e.target.value)}
              className="form-input"
              placeholder="Nama perusahaan / pihak lain..."
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Upaya Pengendalian</label>
            <textarea
              disabled={readOnly}
              rows={4}
              value={form.keterangan}
              onChange={(e) => set('keterangan', e.target.value)}
              className="form-input resize-none"
              placeholder="Tindakan pengendalian yang sudah dilakukan..."
            />
          </div>
        </>
      )}

      {/* CUI / Cleanup extra fields */}
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

      {/* Non-PPL keterangan */}
      {!isPPL && (
        <div>
          <label className="block text-[12px] font-semibold text-app-text mb-1.5">Keterangan</label>
          <textarea disabled={readOnly} rows={3} value={form.keterangan} onChange={(e) => set('keterangan', e.target.value)} className="form-input resize-none" />
        </div>
      )}

      {/* Common fields */}
      <div>
        <label className="block text-[12px] font-semibold text-app-text mb-1.5">Tanggal & Waktu</label>
        <input disabled={readOnly} type="datetime-local" value={form.tanggalWaktu} onChange={(e) => set('tanggalWaktu', e.target.value)} className="form-input" />
      </div>

      <div>
        <label className="block text-[12px] font-semibold text-app-text mb-2">Level Risiko</label>
        <div className="grid grid-cols-3 gap-2">
          {LEVEL_OPTIONS.map((l) => (
            <button
              key={l.value} type="button" disabled={readOnly}
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
            {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <StatusPill status={form.status} />
        </div>
      </div>

      <div>
        <label className="block text-[12px] font-semibold text-app-text mb-1.5">Pelapor</label>
        <input readOnly className="form-input bg-app-bg text-app-muted cursor-not-allowed"
          value={initial?.pelapor?.nama ?? user?.nama ?? '—'} />
      </div>
    </form>
  )

  // ── Mobile PWA: full-screen bottom-to-top ────────────────────────────────────
  if (isMobile) {
    return (
      <>
        <div
          className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={onClose}
        />
        <div
          className={`fixed inset-0 z-50 flex flex-col bg-white transition-transform duration-300 ease-in-out ${open ? 'translate-y-0' : 'translate-y-full'}`}
        >
          {/* PWA Header */}
          <div
            className="flex items-center gap-3 px-4 shrink-0"
            style={{ height: 64, background: '#076c9e' }}
          >
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ArrowLeft size={22} />
            </button>
            <div>
              <p className="text-white font-bold text-[16px] leading-tight">{title}</p>
            </div>
          </div>

          {formBody}

          {/* Bottom CTA */}
          <div className="px-5 py-4 border-t border-app-border shrink-0 bg-white">
            {readOnly ? (
              <button onClick={onClose} className="btn-outline w-full justify-center">Tutup</button>
            ) : (
              <button
                type="submit"
                form="laporan-form"
                disabled={saving}
                className="btn-primary w-full justify-center"
              >
                {saving ? 'Menyimpan...' : 'Buat Laporan'}
              </button>
            )}
          </div>
        </div>
      </>
    )
  }

  // ── Desktop: right-side drawer ───────────────────────────────────────────────
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
          <h2 className="text-[15px] font-bold text-app-text">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-app-bg text-app-muted transition-colors">
            <X size={18} />
          </button>
        </div>

        {formBody}

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-app-border shrink-0 bg-white">
          <button type="button" onClick={onClose} className="btn-outline">
            {readOnly ? 'Tutup' : 'Batal'}
          </button>
          {!readOnly && (
            <button type="submit" form="laporan-form" disabled={saving} className="btn-primary">
              {saving ? 'Menyimpan...' : 'Buat Laporan'}
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
  const [filterOpen, setFilterOpen] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [calendarFor, setCalendarFor] = useState<'from' | 'to'>('from')

  // Close filter popup on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false)
    }
    if (filterOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [filterOpen])

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
      {/* Title */}
      <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 24, lineHeight: '36px', color: '#1C1C1C', marginBottom: 24 }}>Riwayat Gangguan</h1>

      {/* Top bar — mobile: 2 rows; desktop: 1 row */}
      {isMobile ? (
        <div className="flex flex-col gap-3 mb-6">
          {/* Row 1: Search + Filter */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="flex items-center gap-3 px-4 py-[11px] bg-white border border-[#E1E8EC] rounded-lg flex-1 min-w-0">
              <Search size={16} className="text-[#5F737F] shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                placeholder="Cari berdasarkan nama tower"
                className="border-none outline-none font-medium text-[14px] text-[#1C1C1C] bg-transparent w-full min-w-0 placeholder:text-[#97AAB3]"
              />
            </div>
            {/* Filter button */}
            <button
              onClick={() => setFilterOpen(v => !v)}
              className="relative w-11 h-11 bg-white border border-[#E1E8EC] rounded-lg flex items-center justify-center cursor-pointer shrink-0"
            >
              <SlidersHorizontal size={18} className="text-[#5F737F]" />
              {hasActiveFilters && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D92D20]" />}
            </button>
          </div>
          {/* Row 2: Tambah Laporan Baru */}
          <button
            onClick={openAdd}
            className="w-full h-11 rounded-[22px] bg-[#076c9e] text-white font-semibold text-[14px] border-none cursor-pointer flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Tambah Laporan Baru
          </button>
        </div>
      ) : (
        /* Desktop top bar — Figma 11:260: Search+Filter left, Add right */
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 24 }}>
          {/* Left: Search + Filter icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: '#FFFFFF', border: '1px solid #E1E8EC', borderRadius: 8, width: 265 }}>
              <Search size={16} style={{ color: '#5F737F', flexShrink: 0 }} />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                placeholder="Cari berdasarkan nama tower"
                style={{ border: 'none', outline: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 14, color: '#566B75', background: 'transparent', width: '100%' }}
              />
            </div>
            {/* Filter icon button — 48x44 */}
            <div style={{ position: 'relative' }} ref={filterRef}>
              <button
                onClick={() => setFilterOpen(v => !v)}
                style={{ position: 'relative', width: 48, height: 44, background: '#FFFFFF', border: '1px solid #E1E8EC', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <SlidersHorizontal size={16} style={{ color: '#5F737F' }} />
                {hasActiveFilters && <span style={{ position: 'absolute', top: 6, right: 6, width: 6, height: 6, borderRadius: '50%', background: '#D92D20' }} />}
              </button>

              {/* Desktop filter popup — Figma Popup Filter 401x388 */}
              {filterOpen && (
                <div style={{ position: 'absolute', left: 0, top: '100%', marginTop: 8, zIndex: 50, width: 401, background: '#FFFFFF', border: '1px solid #E1E8EC', borderRadius: 8, boxShadow: '0px 4px 8px 0px rgba(28,28,28,0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 16px' }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14, color: '#1C1C1C' }}>Filter</span>
                    <button onClick={() => setFilterOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
                      <X size={16} style={{ color: '#5F737F' }} />
                    </button>
                  </div>
                  <div style={{ height: 1, background: '#E1E8EC' }} />
                  {/* Kategori */}
                  <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14, color: '#1C1C1C' }}>Kategori</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {JENIS_OPTIONS.filter(o => o.value).map(o => (
                        <button key={o.value} onClick={() => { setJenis(jenis === o.value ? '' : o.value); setPage(1) }}
                          style={{ padding: '4px 12px', borderRadius: 18, border: '1px solid', borderColor: jenis === o.value ? '#076C9E' : '#E1E8EC', background: jenis === o.value ? '#076C9E' : 'transparent', color: jenis === o.value ? '#FFFFFF' : '#5F737F', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 12, cursor: 'pointer', transition: 'all 0.15s' }}
                        >{o.label}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ height: 1, background: '#E1E8EC' }} />
                  {/* Rentang Waktu */}
                  <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14, color: '#1C1C1C' }}>Rentang Waktu</span>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14, color: '#1C1C1C', marginBottom: 4 }}>Tanggal Mulai</p>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E1E8EC', borderRadius: 8, overflow: 'hidden' }}>
                          <input type="date" value={tglMulai} onChange={(e) => { setTglMulai(e.target.value); setPage(1) }} style={{ flex: 1, border: 'none', outline: 'none', padding: '10px 12px', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 14, color: '#5F737F' }} />
                          <div style={{ padding: '10px 12px', background: '#F6F9FC', borderLeft: '1px solid #E1E8EC', display: 'flex', alignItems: 'center' }}><Calendar size={16} style={{ color: '#5F737F' }} /></div>
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14, color: '#1C1C1C', marginBottom: 4 }}>Tanggal Berakhir</p>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E1E8EC', borderRadius: 8, overflow: 'hidden' }}>
                          <input type="date" value={tglAkhir} onChange={(e) => { setTglAkhir(e.target.value); setPage(1) }} style={{ flex: 1, border: 'none', outline: 'none', padding: '10px 12px', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 14, color: '#5F737F' }} />
                          <div style={{ padding: '10px 12px', background: '#F6F9FC', borderLeft: '1px solid #E1E8EC', display: 'flex', alignItems: 'center' }}><Calendar size={16} style={{ color: '#5F737F' }} /></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ height: 1, background: '#E1E8EC' }} />
                  {/* CTA */}
                  <div style={{ padding: '12px 16px', display: 'flex', gap: 8 }}>
                    <button onClick={() => setFilterOpen(false)} className="btn-primary" style={{ flex: 1, borderRadius: 22 }}>Terapkan Filter</button>
                    <button onClick={() => { resetFilters(); setFilterOpen(false) }} style={{ padding: '10px 20px', borderRadius: 22, border: 'none', background: 'transparent', color: '#D92D20', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Hapus Filter</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Add button — Figma 212x44 corner=22 */}
          <button
            onClick={openAdd}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', height: 44, borderRadius: 22, background: '#076c9e', border: 'none', color: '#FFFFFF', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            <Plus size={16} /> Tambah Laporan Baru
          </button>
        </div>
      )}

      {/* Table card — Figma 11:260 */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E1E8EC', borderRadius: 8, overflow: 'hidden' }}>

        {/* Inline filter row — desktop only, Figma Div 749x68 */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, padding: '12px 16px', borderBottom: '1px solid #E1E8EC', flexWrap: 'wrap' }}>
            {/* Jenis Gangguan */}
            <div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14, color: '#1C1C1C', marginBottom: 4 }}>Jenis Gangguan</p>
              <select
                value={jenis}
                onChange={(e) => { setJenis(e.target.value); setPage(1) }}
                style={{ width: 200, height: 44, border: '1px solid #E1E8EC', borderRadius: 8, padding: '0 12px', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 14, color: '#5F737F', background: '#FFFFFF', cursor: 'pointer', outline: 'none' }}
              >
                {JENIS_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            {/* Tanggal Mulai */}
            <div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14, color: '#1C1C1C', marginBottom: 4 }}>Tanggal Mulai</p>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E1E8EC', borderRadius: 8, overflow: 'hidden', width: 184, height: 44 }}>
                <input type="date" value={tglMulai} onChange={(e) => { setTglMulai(e.target.value); setPage(1) }}
                  style={{ flex: 1, border: 'none', outline: 'none', padding: '0 12px', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 14, color: '#5F737F', height: '100%' }} />
                <div style={{ width: 44, height: 44, background: '#F6F9FC', borderLeft: '1px solid #E1E8EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Calendar size={16} style={{ color: '#5F737F' }} />
                </div>
              </div>
            </div>
            {/* Tanggal Berakhir */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14, color: '#1C1C1C' }}>Tanggal Berakhir</p>
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 450, fontSize: 14, color: '#97AAB3' }}>(Opsional)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E1E8EC', borderRadius: 8, overflow: 'hidden', width: 184, height: 44 }}>
                <input type="date" value={tglAkhir} onChange={(e) => { setTglAkhir(e.target.value); setPage(1) }}
                  style={{ flex: 1, border: 'none', outline: 'none', padding: '0 12px', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 14, color: '#5F737F', height: '100%' }} />
                <div style={{ width: 44, height: 44, background: '#F6F9FC', borderLeft: '1px solid #E1E8EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Calendar size={16} style={{ color: '#5F737F' }} />
                </div>
              </div>
            </div>
            {/* Hapus Filter — disabled style when no active filters */}
            <button
              onClick={resetFilters}
              disabled={!hasActiveFilters}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, height: 44, padding: '0 16px',
                borderRadius: 8, border: 'none', cursor: hasActiveFilters ? 'pointer' : 'not-allowed',
                background: '#F6F9FC',
                color: hasActiveFilters ? '#5F737F' : '#E1E8EC',
                fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 14,
                transition: 'color 0.15s',
              }}
            >
              <RotateCcw size={18} style={{ color: hasActiveFilters ? '#5F737F' : '#E1E8EC' }} />
              Hapus Filter
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="data-table">
             <thead>
              <tr>
                <th>Tanggal</th>
                <th>Tower</th>
                <th>Jenis Gangguan</th>
                <th>Teknisi</th>
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

      {/* Mobile calendar picker */}
      <CalendarPickerSheet
        open={calendarOpen}
        value={calendarFor === 'from' ? tglMulai : tglAkhir}
        onConfirm={d => { if (calendarFor === 'from') { setTglMulai(d); setPage(1) } else { setTglAkhir(d); setPage(1) } }}
        onClose={() => setCalendarOpen(false)}
      />

      {/* Mobile filter bottom sheet */}
      <>
        <div
          className={`fixed inset-0 bg-black/40 transition-opacity duration-300 ${isMobile && filterOpen ? 'opacity-100 z-[65] pointer-events-auto' : 'opacity-0 z-[-1] pointer-events-none'}`}
          onClick={() => setFilterOpen(false)}
        />
        <div className={`fixed left-0 right-0 bottom-0 z-[70] max-h-[88vh] bg-white rounded-t-2xl transition-transform duration-300 flex flex-col ${isMobile && filterOpen ? 'translate-y-0' : 'translate-y-full'}`}>
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-2 shrink-0">
            <div className="w-10 h-1 rounded-sm bg-[#D1D9E0]" />
          </div>
          {/* Header */}
          <div className="flex items-center justify-between px-4 pb-3.5 border-b border-[#E1E8EC] shrink-0">
            <span className="font-bold text-base text-[#1C1C1C]">Filter</span>
            <button onClick={() => setFilterOpen(false)} className="w-8 h-8 rounded-lg border-none bg-[#F6F9FC] flex items-center justify-center cursor-pointer text-[#5F737F]">
              <X size={16} />
            </button>
          </div>
          {/* Body — Figma 74:2192 */}
          <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">

            {/* Kategori — 16px bold, chips h=36 r=18 */}
            <p className="font-bold text-base text-[#1C1C1C] mb-3">Kategori</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {JENIS_OPTIONS.filter(o => o.value).map(o => (
                <button key={o.value}
                  onClick={() => { setJenis(jenis === o.value ? '' : o.value); setPage(1) }}
                  className={`h-9 px-3 rounded-[18px] border cursor-pointer font-medium text-[12px] transition-all ${
                    jenis === o.value
                      ? 'bg-[#076c9e] border-[#076c9e] text-white'
                      : 'bg-transparent border-[#E1E8EC] text-[#5F737F]'
                  }`}
                >{o.label}</button>
              ))}
            </div>

            {/* Periode — side-by-side date pickers, Figma: 191x44 each */}
            <p className="font-bold text-base text-[#1C1C1C] mb-3">Periode</p>
            <div className="flex gap-3">
              {/* Period From */}
              <div className="flex-1">
                <p className="text-[14px] font-bold text-[#1C1C1C] mb-1.5">Period From</p>
                <button
                  onClick={() => { setCalendarFor('from'); setCalendarOpen(true) }}
                  className="w-full h-11 border border-[#E1E8EC] rounded-lg flex items-center cursor-pointer bg-white overflow-hidden"
                >
                  <span className={`flex-1 text-left px-3 text-[14px] font-medium truncate ${tglMulai ? 'text-[#1C1C1C]' : 'text-[#97AAB3]'}`}>
                    {tglMulai ? new Date(tglMulai + 'T00:00:00').toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'dd/mm/yyyy'}
                  </span>
                  <div className="w-11 h-11 bg-[#F6F9FC] border-l border-[#E1E8EC] flex items-center justify-center shrink-0">
                    <Calendar size={16} className="text-[#5F737F]" />
                  </div>
                </button>
              </div>
              {/* Period To */}
              <div className="flex-1">
                <p className="text-[14px] font-bold text-[#1C1C1C] mb-1.5">Period To</p>
                <button
                  onClick={() => { setCalendarFor('to'); setCalendarOpen(true) }}
                  className="w-full h-11 border border-[#E1E8EC] rounded-lg flex items-center cursor-pointer bg-white overflow-hidden"
                >
                  <span className={`flex-1 text-left px-3 text-[14px] font-medium truncate ${tglAkhir ? 'text-[#1C1C1C]' : 'text-[#97AAB3]'}`}>
                    {tglAkhir ? new Date(tglAkhir + 'T00:00:00').toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'dd/mm/yyyy'}
                  </span>
                  <div className="w-11 h-11 bg-[#F6F9FC] border-l border-[#E1E8EC] flex items-center justify-center shrink-0">
                    <Calendar size={16} className="text-[#5F737F]" />
                  </div>
                </button>
              </div>
            </div>
            <div className="h-2" />
          </div>

          {/* CTA — Figma: Terapkan (338px) + Reset circle (44px) */}
          <div className="px-4 pt-3 pb-6 border-t border-[#E1E8EC] flex items-center gap-3 shrink-0">
            <button
              onClick={() => setFilterOpen(false)}
              className="flex-1 h-11 rounded-[22px] border-none bg-[#076c9e] text-white font-semibold text-[14px] cursor-pointer"
            >
              Terapkan
            </button>
            <button
              onClick={() => { resetFilters(); setFilterOpen(false) }}
              title="Reset filter"
              className="w-11 h-11 rounded-full border border-[#D92D20] bg-white flex items-center justify-center cursor-pointer shrink-0"
            >
              <RotateCcw size={18} className="text-[#D92D20]" />
            </button>
          </div>
        </div>
      </>
    </>
  )
}
