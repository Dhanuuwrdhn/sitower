'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import {
  Search, Plus, Calendar, RefreshCw,
  Trash2, X, Upload, ChevronLeft, ChevronRight,
  ChevronDown, MoreHorizontal, Eye, Pencil,
} from 'lucide-react'
import { laporanApi, towersApi } from '@/lib/api'
import { getUser, isAdmin } from '@/lib/auth'

// ── Constants ────────────────────────────────────────────────────────────────

const JENIS_OPTIONS = [
  { value: '', label: 'Semua' },
  { value: 'pekerjaan_pihak_lain', label: 'Pekerjaan Pihak Lain (PPL)' },
  { value: 'kebakaran',            label: 'Kebakaran' },
  { value: 'layangan',             label: 'Layang-layang' },
  { value: 'pencurian',            label: 'Pencurian' },
  { value: 'pemanfaatan',          label: 'Pemanfaatan Pihak Lain' },
  { value: 'gangguan',             label: 'Gangguan Teknis' },
  { value: 'cui',                  label: 'Climb Up Inspection' },
  { value: 'cleanup',              label: 'Clean Up Isolator' },
]

const JENIS_LABEL: Record<string, string> = {
  pekerjaan_pihak_lain: 'Pekerjaan Pihak Lain (PPL)',
  kebakaran:            'Kebakaran',
  layangan:             'Layang-layang',
  pencurian:            'Pencurian',
  pemanfaatan:          'Pemanfaatan Pihak Lain',
  gangguan:             'Gangguan Teknis',
  cui:                  'Climb Up Inspection',
  cleanup:              'Clean Up Isolator',
}

const STATUS_OPTIONS = [
  { value: 'berlangsung', label: 'Berlangsung' },
  { value: 'ditangani',   label: 'Ditangani' },
  { value: 'pemantauan',  label: 'Pemantauan' },
  { value: 'eskalasi',    label: 'Eskalasi' },
  { value: 'menunggu',    label: 'Menunggu' },
  { value: 'selesai',     label: 'Sudah Selesai' },
]

const STATUS_LABEL: Record<string, string> = {
  berlangsung: 'Berlangsung',
  ditangani:   'Ditangani',
  pemantauan:  'Pemantauan',
  eskalasi:    'Eskalasi',
  menunggu:    'Menunggu',
  selesai:     'Sudah Selesai',
}

const LEVEL_OPTIONS = [
  { value: 'tinggi',  label: 'Tinggi',  color: 'text-red-600',    bg: 'bg-red-50 border-red-300',   dot: 'bg-red-500' },
  { value: 'sedang',  label: 'Sedang',  color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-300', dot: 'bg-yellow-500' },
  { value: 'rendah',  label: 'Rendah',  color: 'text-green-600',  bg: 'bg-green-50 border-green-300',  dot: 'bg-green-500' },
]

const STATUS_CLASS: Record<string, string> = {
  berlangsung: 'badge-berlangsung badge-blink',
  ditangani:   'badge-ditangani',
  selesai:     'badge-selesai',
  pemantauan:  'badge-pemantauan',
  eskalasi:    'badge-eskalasi',
  menunggu:    'badge-menunggu',
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
  onEdit,
  onDelete,
  showDelete,
}: {
  row: any
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
    <div className="relative" ref={ref}>
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
            onClick={() => { setOpen(false); toast(`Detail: ${row.id}`, { icon: '👁' }) }}
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
}: {
  fotos: File[]
  onChange: (files: File[]) => void
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
  towerOptions,
  onClose,
  onSaved,
}: {
  open: boolean
  initial: any | null
  towerOptions: TowerOption[]
  onClose: () => void
  onSaved: () => void
}) {
  const user = getUser()
  const [form, setForm] = useState(EMPTY_FORM)
  const [fotos, setFotos] = useState<File[]>([])
  const [saving, setSaving] = useState(false)

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
      } else {
        setForm(EMPTY_FORM)
        setFotos([])
      }
    }
  }, [open, initial])

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.towerId) { toast.error('Pilih tower terlebih dahulu'); return }
    if (!form.jenisGangguan) { toast.error('Pilih kategori gangguan'); return }

    setSaving(true)
    try {
      let fotoUrls: string[] = []
      if (fotos.length > 0) {
        const up = await laporanApi.uploadFoto(fotos)
        fotoUrls = up.data.urls ?? []
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
        foto: fotoUrls,
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
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ width: 560 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-app-border shrink-0">
          <h2 className="text-[15px] font-bold text-app-text">
            {initial ? 'Edit Laporan' : 'Tambah Laporan Baru'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-app-bg text-app-muted transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form id="laporan-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* 1. Tower */}
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">
              Pilih Tower <span className="text-red-500">*</span>
            </label>
            <TowerDropdown
              options={towerOptions}
              value={form.towerId}
              onChange={(id, label) => setForm((f) => ({ ...f, towerId: id, towerLabel: label }))}
            />
          </div>

          {/* 2. Kategori */}
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">
              Kategori Gangguan <span className="text-red-500">*</span>
            </label>
            <select
              value={form.jenisGangguan}
              onChange={(e) => set('jenisGangguan', e.target.value)}
              className="form-input"
            >
              <option value="">Pilih kategori...</option>
              {JENIS_OPTIONS.filter((o) => o.value).map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* 3. Tanggal & Waktu */}
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Tanggal & Waktu</label>
            <input
              type="datetime-local"
              value={form.tanggalWaktu}
              onChange={(e) => set('tanggalWaktu', e.target.value)}
              className="form-input"
            />
          </div>

          {/* 4. Level Risiko */}
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-2">Level Risiko</label>
            <div className="grid grid-cols-3 gap-2">
              {LEVEL_OPTIONS.map((l) => (
                <button
                  key={l.value}
                  type="button"
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

          {/* 5. Status */}
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Status</label>
            <div className="flex items-center gap-3">
              <select
                value={form.status}
                onChange={(e) => set('status', e.target.value)}
                className="form-input"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <StatusPill status={form.status} />
            </div>
          </div>

          {/* 6. Lokasi Detail */}
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Lokasi Detail</label>
            <input
              type="text"
              value={form.lokasiDetail}
              onChange={(e) => set('lokasiDetail', e.target.value)}
              placeholder="Contoh: Km 12 Jalan Raya Serang"
              className="form-input"
            />
          </div>

          {/* 7. Deskripsi */}
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Deskripsi</label>
            <textarea
              rows={4}
              value={form.deskripsi}
              onChange={(e) => set('deskripsi', e.target.value)}
              placeholder="Jelaskan kondisi gangguan secara rinci..."
              className="form-input resize-none"
            />
          </div>

          {/* 8. Upload Foto */}
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">
              Foto Dokumentasi
            </label>
            <FotoUpload fotos={fotos} onChange={setFotos} />
          </div>

          {/* 9. Conditional fields */}
          {(isCUI || isCleanup) && (
            <div className="space-y-4 p-4 bg-app-bg rounded-xl border border-app-border">
              <p className="text-[11px] font-bold text-app-muted uppercase tracking-wider">
                {isCUI ? 'Detail CUI' : 'Detail Cleanup'}
              </p>
              <div>
                <label className="block text-[12px] font-semibold text-app-text mb-1.5">Teknisi</label>
                <input type="text" value={form.teknisi} onChange={(e) => set('teknisi', e.target.value)} className="form-input" placeholder="Nama teknisi pelaksana" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-app-text mb-1.5">No. SPK</label>
                <input type="text" value={form.noSpk} onChange={(e) => set('noSpk', e.target.value)} className="form-input" placeholder="Nomor surat perintah kerja" />
              </div>
              {isCUI && (
                <>
                  <div>
                    <label className="block text-[12px] font-semibold text-app-text mb-1.5">Temuan</label>
                    <textarea rows={3} value={form.temuan} onChange={(e) => set('temuan', e.target.value)} className="form-input resize-none" placeholder="Temuan selama inspeksi" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-app-text mb-1.5">Hasil Inspeksi</label>
                    <textarea rows={3} value={form.hasil} onChange={(e) => set('hasil', e.target.value)} className="form-input resize-none" placeholder="Kesimpulan dan rekomendasi" />
                  </div>
                </>
              )}
            </div>
          )}

          {isGangg && (
            <div className="space-y-4 p-4 bg-app-bg rounded-xl border border-app-border">
              <p className="text-[11px] font-bold text-app-muted uppercase tracking-wider">Detail Gangguan Teknis</p>
              <div>
                <label className="block text-[12px] font-semibold text-app-text mb-1.5">Penyebab</label>
                <input type="text" value={form.penyebab} onChange={(e) => set('penyebab', e.target.value)} className="form-input" placeholder="Penyebab gangguan teknis" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-app-text mb-1.5">Durasi (jam)</label>
                <input type="number" min="0" step="0.5" value={form.durasi} onChange={(e) => set('durasi', e.target.value)} className="form-input" placeholder="Durasi gangguan dalam jam" />
              </div>
            </div>
          )}

          {/* 10. Keterangan */}
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">
              Keterangan <span className="text-app-muted font-normal">(opsional)</span>
            </label>
            <textarea
              rows={3}
              value={form.keterangan}
              onChange={(e) => set('keterangan', e.target.value)}
              className="form-input resize-none"
            />
          </div>

          {/* 11. Pelapor */}
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Pelapor</label>
            <input
              type="text"
              value={user?.nama ?? '—'}
              readOnly
              className="form-input bg-app-bg text-app-muted cursor-not-allowed"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-app-border shrink-0 bg-white">
          <button type="button" onClick={onClose} className="btn-outline">
            Batal
          </button>
          <button type="submit" form="laporan-form" disabled={saving} className="btn-primary">
            {saving ? 'Menyimpan...' : 'Simpan Laporan'}
          </button>
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

  // Filters
  const [search, setSearch] = useState('')
  const [jenis, setJenis] = useState('')
  const [tglMulai, setTglMulai] = useState('')
  const [tglAkhir, setTglAkhir] = useState('')

  // Pagination
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Tower dropdown options
  const [towerOptions, setTowerOptions] = useState<TowerOption[]>([])

  // Drawer / modal state
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editRow, setEditRow] = useState<any | null>(null)
  const [deleteRow, setDeleteRow] = useState<any | null>(null)

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  // Debounced search
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [debouncedSearch, setDebouncedSearch] = useState('')
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => setDebouncedSearch(search), 350)
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current) }
  }, [search])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await laporanApi.getAll({
        page,
        limit: pageSize,
        search: debouncedSearch || undefined,
        jenisGangguan: jenis || undefined,
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
  }, [page, pageSize, debouncedSearch, jenis, tglMulai, tglAkhir])

  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => {
    towersApi.getDropdown()
      .then((res) => setTowerOptions(res.data ?? []))
      .catch(() => {})
  }, [])

  function resetFilters() {
    setSearch('')
    setJenis('')
    setTglMulai('')
    setTglAkhir('')
    setPage(1)
  }

  function openAdd() { setEditRow(null); setDrawerOpen(true) }
  function openEdit(row: any) { setEditRow(row); setDrawerOpen(true) }

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to   = Math.min(page * pageSize, total)

  return (
    <>
      {/* Header + action */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-app-text">Riwayat Gangguan</h1>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Tambah Laporan Baru
        </button>
      </div>

      {/* Filter bar */}
      <div className="card card-body mb-4 space-y-3">
        {/* Row 1: search */}
        <div className="flex items-center gap-3">
          <div className="relative" style={{ width: 300 }}>
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Cari berdasarkan nama tower"
              className="form-input pl-9"
              style={{ height: 40 }}
            />
          </div>
        </div>

        {/* Row 2: filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={jenis}
            onChange={(e) => { setJenis(e.target.value); setPage(1) }}
            className="form-input w-auto pr-8"
            style={{ height: 40 }}
          >
            {JENIS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <div className="relative">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted" />
            <input
              type="date"
              value={tglMulai}
              onChange={(e) => { setTglMulai(e.target.value); setPage(1) }}
              className="form-input pl-9 w-44"
              style={{ height: 40 }}
              placeholder="Tanggal Mulai"
            />
          </div>

          <div className="relative">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted" />
            <input
              type="date"
              value={tglAkhir}
              onChange={(e) => { setTglAkhir(e.target.value); setPage(1) }}
              className="form-input pl-9 w-44"
              style={{ height: 40 }}
              placeholder="Tanggal Berakhir"
            />
          </div>

          <button onClick={resetFilters} className="btn-outline-red">
            <RefreshCw size={14} /> Hapus Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Tower</th>
                <th>Jenis Gangguan</th>
                <th>Teknisi</th>
                <th>Status</th>
                <th className="text-right pr-5">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
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
                    <td className="text-app-muted text-[12px]">{formatTanggal(row.tanggal)}</td>
                    <td>
                      <span className="font-mono text-[12px] text-blue-600 font-semibold">
                        {row.tower?.nomorTower ?? row.towerId ?? '—'}
                      </span>
                    </td>
                    <td>{JENIS_LABEL[row.jenisGangguan] ?? row.jenisGangguan ?? '—'}</td>
                    <td className="text-app-muted">{row.pelapor?.nama ?? row.pegawai?.nama ?? '—'}</td>
                    <td><StatusPill status={row.status?.toLowerCase()} /></td>
                    <td className="text-right pr-4">
                      <RowActions
                        row={row}
                        onEdit={openEdit}
                        onDelete={setDeleteRow}
                        showDelete={isAdmin()}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-app-border bg-white">
          {/* Page size */}
          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}
              className="form-input w-auto pr-8 py-1.5 text-[12px]"
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>{n} baris per halaman</option>
              ))}
            </select>
          </div>

          {/* Info */}
          <p className="text-[12px] text-app-muted">
            {total === 0 ? 'Tidak ada data' : `Menampilkan ${from}–${to} dari ${total} data`}
          </p>

          {/* Page nav */}
          <div className="flex items-center gap-2">
            <select
              value={page}
              onChange={(e) => setPage(Number(e.target.value))}
              className="form-input w-auto pr-8 py-1.5 text-[12px]"
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <option key={p} value={p}>{p} dari {totalPages} halaman</option>
              ))}
            </select>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-app-border hover:bg-app-bg disabled:opacity-40 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-app-border hover:bg-app-bg disabled:opacity-40 transition-colors"
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
