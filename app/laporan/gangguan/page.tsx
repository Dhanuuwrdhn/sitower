'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import {
  Search, Plus, Calendar, SlidersHorizontal, RotateCcw,
  Trash2, X, Upload, ChevronLeft, ChevronRight,
  ChevronDown, MoreHorizontal, Eye, Pencil,
  ArrowLeft, AlertTriangle, FileText, ImagePlus, Clock,
} from 'lucide-react'
import { laporanApi, towersApi } from '@/lib/api'
import { getUser, isAdmin } from '@/lib/auth'
import { getDistance } from '@/lib/geo'
import { resolveMediaUrl } from '@/lib/utils'
import { useSidebar } from '@/components/layout/SidebarContext'
import CalendarPickerSheet from '@/components/ui/CalendarPickerSheet'
import { EmptyState } from '@/components/ui/EmptyState'

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
  pekerjaan_pihak_lain: 'Pekerjaan Pihak Lain (PPL)',
  kebakaran:            'Kebakaran',
  layangan:             'Layang-layang',
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
  { value: 'kritis_terpenuhi',      label: 'Kritis Terpenuhi',      color: 'text-red-600',    bg: 'bg-red-50 border-red-300',       dot: 'bg-red-500' },
  { value: 'kritis_tidak_terpenuhi', label: 'Kritis Tidak Terpenuhi', color: 'text-red-700',    bg: 'bg-red-100 border-red-400',      dot: 'bg-red-700' },
  { value: 'sedang',                label: 'Sedang',                color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-300', dot: 'bg-yellow-500' },
  { value: 'aman',                  label: 'Aman',                  color: 'text-green-600',  bg: 'bg-green-50 border-green-300',   dot: 'bg-green-500' },
]

const JENIS_ITEMS = [
  { value: 'pekerjaan_pihak_lain', label: 'Pekerjaan Pihak Lain', emoji: '🚜' },
  { value: 'kebakaran',            label: 'Kebakaran',             emoji: '🔥' },
  { value: 'layangan',             label: 'Layangan',              emoji: '🪁' },
  { value: 'pencurian',            label: 'Pencurian',             emoji: '🥷' },
  { value: 'pemanfaatan_lahan',    label: 'Pemanfaatan Lahan',    emoji: '🏡' },
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

// Exact colors from Figma node 229-8374
const LEVEL_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  kritis_terpenuhi:      { bg: '#FEE4E2', text: '#D92D20', label: 'Kritis Terpenuhi'      },
  kritis_tidak_terpenuhi:{ bg: '#FEE4E2', text: '#912018', label: 'Kritis Tidak Terpenuhi' },
  sedang:                { bg: '#FFFAEB', text: '#F79009', label: 'Sedang'                 },
  aman:                  { bg: '#ECFDF3', text: '#039855', label: 'Aman'                   },
  // legacy fallback
  kritis: { bg: '#FEE4E2', text: '#D92D20', label: 'Kritis' },
}

const PROGRESS_TIPE_LABEL: Record<string, string> = {
  spanduk:      'Spanduk',
  brosur:       'Brosur',
  laporan_baru: 'Laporan Baru',
  berita_acara: 'Berita Acara',
}

const PROGRESS_BADGE_COLOR: Record<string, { bg: string; text: string }> = {
  laporan_baru: { bg: '#076C9E', text: '#FFFFFF' },
  berita_acara: { bg: '#F79009', text: '#FFFFFF' },
  spanduk:      { bg: '#9F09F7', text: '#FFFFFF' },
  brosur:       { bg: '#5F737F', text: '#FFFFFF' },
}

const PROGRESS_TIPE_LIST = ['spanduk', 'brosur', 'laporan_baru', 'berita_acara'] as const

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

function LevelBadge({ level }: { level: string }) {
  const cfg = LEVEL_BADGE[level?.toLowerCase()]
  if (!cfg) return <span className="text-app-muted text-[12px]">—</span>
  return (
    <span style={{ background: cfg.bg, color: cfg.text, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 10px', borderRadius: 99, fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap' }}>
      {cfg.label}
    </span>
  )
}

function ProgressBadge({ tipe }: { tipe: string | null | undefined }) {
  if (!tipe) return <span className="text-app-subtle text-[12px]">—</span>
  const label = PROGRESS_TIPE_LABEL[tipe] ?? tipe
  const color = PROGRESS_BADGE_COLOR[tipe] ?? { bg: '#5F737F', text: '#FFFFFF' }
  return (
    <span style={{ background: color.bg, color: color.text, display: 'inline-flex', alignItems: 'center', padding: '2px 10px', borderRadius: 99, fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap' }}>
      {label}
    </span>
  )
}

async function compressImage(file: File, maxPx = 1920, quality = 0.75): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      if (width > maxPx || height > maxPx) {
        if (width > height) { height = Math.round(height * maxPx / width); width = maxPx }
        else { width = Math.round(width * maxPx / height); height = maxPx }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width; canvas.height = height
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
      canvas.toBlob((blob) => {
        if (!blob) { resolve(file); return }
        resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }))
      }, 'image/jpeg', quality)
    }
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file) }
    img.src = url
  })
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

// Extract #XXXX tower number from tower nama (e.g. "TOWER SUTET 500kV GNDUL-KMBNG #0001" → "#0001")
function extractTowerNo(nama?: string | null): string | null {
  if (!nama) return null
  const m = nama.match(/#(\d+)/)
  return m ? `#${m[1]}` : null
}

// ── Tower searchable dropdown ─────────────────────────────────────────────────

interface TowerOption {
  id: string
  nomorTower: string
  garduInduk: string
  tipe: string
  nama?: string
  lat?: number
  lng?: number
  radius?: number
}

// Parse display label and subtitle from tower nama
function parseTowerDisplay(t: TowerOption): { label: string; sub: string } {
  const nama = t.nama ?? t.nomorTower
  // "Tower/Span T6 - T7 (SUTET 500KV DURIKOSAMBI - KEMBANGAN)" → label="T6 - T7", sub="SUTET 500KV · DURIKOSAMBI–KEMBANGAN"
  const spanMatch = nama.match(/Tower\/Span\s+(.+?)\s+\((.+)\)/)
  if (spanMatch) {
    const span = spanMatch[1].trim()
    const detail = spanMatch[2].trim()
    return { label: span, sub: detail }
  }
  // "TOWER SUTET KMBGN-DKSBI 500kV #P1A" → label=id, sub=nama
  if (nama !== t.id) return { label: t.id, sub: nama }
  return { label: t.id, sub: '' }
}

function resolveGroup(t: TowerOption): string {
  if (t.tipe === 'garduInduk' || t.tipe === 'gardu') return 'garduInduk'
  if (t.tipe === 'SUTET' || t.tipe === 'SUTT' || t.tipe === 'SKTT') return t.tipe
  // Auto-detect for 'other' from nama
  const nama = t.nama ?? ''
  if (nama.includes('SUTET')) return 'SUTET'
  if (nama.includes('SUTT')) return 'SUTT'
  if (nama.includes('SKTT')) return 'SKTT'
  return 'other'
}

const GROUP_LABELS: Record<string, string> = {
  garduInduk: 'Gardu Induk',
  SUTET: 'SUTET',
  SUTT: 'SUTT',
  SKTT: 'SKTT',
  other: 'Lainnya',
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

  const groupOrder = ['garduInduk', 'SUTET', 'SUTT', 'SKTT', 'other']
  const grouped: Record<string, TowerOption[]> = { garduInduk: [], SUTET: [], SUTT: [], SKTT: [], other: [] }

  const q = search.toLowerCase()
  const allFiltered = options.filter((t) => {
    if (!q) return true
    return (
      t.id.toLowerCase().includes(q) ||
      (t.nama ?? '').toLowerCase().includes(q)
    )
  })
  const limited = allFiltered
  limited.forEach((t) => {
    const g = resolveGroup(t)
    grouped[g].push(t)
  })

  const selectedTower = value ? options.find((o) => o.id === value) : null
  const selectedLabel = selectedTower ? parseTowerDisplay(selectedTower).label : ''

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
        <div className="absolute z-50 left-0 top-[42px] w-full bg-white border border-app-border rounded-xl shadow-dropdown flex flex-col" style={{ maxHeight: 340 }}>
          <div className="p-2 border-b border-app-border">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nomor tower atau jalur..."
              className="form-input text-[12px]"
            />
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: 280 }}>
            {groupOrder.map((g) =>
              grouped[g].length > 0 ? (
                <div key={g}>
                  <p className="px-3 py-1.5 text-[10px] font-bold text-app-muted uppercase tracking-wider bg-app-bg sticky top-0">
                    {GROUP_LABELS[g]}
                  </p>
                  {grouped[g].map((t) => {
                    const { label, sub } = parseTowerDisplay(t)
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => { onChange(t.id, label); setOpen(false); setSearch('') }}
                        className={`w-full text-left px-3 py-2 hover:bg-app-bg transition-colors ${value === t.id ? 'bg-blue-50' : ''}`}
                      >
                        <p className={`font-mono text-[13px] font-semibold ${value === t.id ? 'text-blue-600' : 'text-app-text'}`}>{label}</p>
                        {sub && <p className="text-[11px] text-app-muted leading-tight mt-0.5">{sub}</p>}
                      </button>
                    )
                  })}
                </div>
              ) : null
            )}
            {groupOrder.every((g) => grouped[g].length === 0) && (
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

// ── Shared bottom-sheet shell ─────────────────────────────────────────────────

function BottomSheet({
  open, onClose, children, height,
}: {
  open: boolean; onClose: () => void; children: React.ReactNode; height?: number
}) {
  return (
    <>
      <div
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          zIndex: 65, transition: 'opacity 0.3s',
          opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 70,
          background: '#FFFFFF', borderRadius: '16px 16px 0 0',
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s ease-in-out',
          ...(height ? { height } : {}),
        }}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 8 }}>
          <div style={{ width: 40, height: 4, borderRadius: 3, background: '#E1E8EC' }} />
        </div>
        {children}
      </div>
    </>
  )
}

// ── Jenis Kerawanan bottom sheet ──────────────────────────────────────────────

function JenisKerawananSheet({
  open, value, onSelect, onClose,
}: {
  open: boolean; value: string; onSelect: (v: string) => void; onClose: () => void
}) {
  return (
    <BottomSheet open={open} onClose={onClose} height={356}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', height: 48, position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', left: 16, background: 'none', border: 'none', padding: 4, cursor: 'pointer', display: 'flex' }}
        >
          <X size={15} style={{ color: '#97AAB3' }} />
        </button>
        <span style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: 16, color: '#1B1B1B' }}>
          Pilih Jenis Kerawanan
        </span>
      </div>
      {/* Items */}
      {JENIS_ITEMS.map((item, idx) => {
        const isSelected = value === item.value
        return (
          <button
            key={item.value}
            onClick={() => { onSelect(item.value); onClose() }}
            style={{
              width: '100%', height: 56, display: 'flex', alignItems: 'center',
              padding: '0 20px', background: isSelected ? '#F6F9FC' : '#FFFFFF',
              border: 'none', borderBottom: idx < JENIS_ITEMS.length - 1 ? '1px solid #F0F4F6' : 'none',
              cursor: 'pointer', textAlign: 'left',
            }}
          >
            <span style={{ fontSize: 20, marginRight: 14 }}>{item.emoji}</span>
            <span style={{ flex: 1, fontWeight: 500, fontSize: 14, color: '#1B1B1B' }}>{item.label}</span>
            {isSelected && (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10L8 14L16 6" stroke="#076C9E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        )
      })}
    </BottomSheet>
  )
}

// ── Status Kerawanan bottom sheet ────────────────────────────────────────────

function StatusKerawananSheet({
  open, value, onSelect, onClose,
}: {
  open: boolean; value: string; onSelect: (v: string) => void; onClose: () => void
}) {
  return (
    <BottomSheet open={open} onClose={onClose} height={316}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', height: 48, position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', left: 16, background: 'none', border: 'none', padding: 4, cursor: 'pointer', display: 'flex' }}
        >
          <X size={15} style={{ color: '#97AAB3' }} />
        </button>
        <span style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: 16, color: '#1B1B1B' }}>
          Pilih Status Kerawanan
        </span>
      </div>
      {LEVEL_OPTIONS.map((item, idx) => {
        const isSelected = value === item.value
        return (
          <button
            key={item.value}
            onClick={() => { onSelect(item.value); onClose() }}
            style={{
              width: '100%', height: 56, display: 'flex', alignItems: 'center',
              padding: '0 20px', background: '#FFFFFF',
              border: 'none', borderBottom: idx < LEVEL_OPTIONS.length - 1 ? '1px solid #F0F4F6' : 'none',
              cursor: 'pointer', textAlign: 'left',
            }}
          >
            <span style={{ flex: 1, fontWeight: 500, fontSize: 14, color: '#1B1B1B' }}>{item.label}</span>
            {isSelected && (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10L8 14L16 6" stroke="#076C9E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        )
      })}
    </BottomSheet>
  )
}

// ── Ambil Foto bottom sheet ───────────────────────────────────────────────────

function AmbilFotoSheet({
  open, onClose, onFile,
}: {
  open: boolean; onClose: () => void; onFile: (files: FileList) => void
}) {
  const cameraRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) { onFile(e.target.files); onClose() }
    e.target.value = ''
  }

  return (
    <BottomSheet open={open} onClose={onClose} height={140}>
      <button
        onClick={() => cameraRef.current?.click()}
        style={{
          width: '100%', height: 56, display: 'flex', alignItems: 'center',
          padding: '0 20px', background: '#FFFFFF',
          border: 'none', borderBottom: '1px solid #F0F4F6', cursor: 'pointer',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ marginRight: 14, flexShrink: 0 }}>
          <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="#076C9E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="13" r="4" stroke="#076C9E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span style={{ fontWeight: 500, fontSize: 14, color: '#1B1B1B' }}>Ambil Foto</span>
      </button>
      <button
        onClick={() => galleryRef.current?.click()}
        style={{
          width: '100%', height: 56, display: 'flex', alignItems: 'center',
          padding: '0 20px', background: '#FFFFFF',
          border: 'none', cursor: 'pointer',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ marginRight: 14, flexShrink: 0 }}>
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="#076C9E" strokeWidth="2"/>
          <circle cx="8.5" cy="8.5" r="1.5" stroke="#076C9E" strokeWidth="2"/>
          <polyline points="21 15 16 10 5 21" stroke="#076C9E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span style={{ fontWeight: 500, fontSize: 14, color: '#1B1B1B' }}>Pilih dari Galeri</span>
      </button>
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleChange} />
      <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden" onChange={handleChange} />
    </BottomSheet>
  )
}

// ── Pilih Tower bottom sheet ──────────────────────────────────────────────────

function PilihTowerSheet({
  open, options, value, onSelect, onClose,
}: {
  open: boolean; options: TowerOption[]; value: string;
  onSelect: (id: string, label: string) => void; onClose: () => void
}) {
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!open) setSearch('')
  }, [open])

  const allFiltered = options.filter((t) => {
    if (!search) return true
    const q = search.toLowerCase()
    return t.id.toLowerCase().includes(q) || (t.nama ?? '').toLowerCase().includes(q)
  })
  const displayed = search ? allFiltered : allFiltered.slice(0, 5)

  return (
    <BottomSheet open={open} onClose={onClose} height={424}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', height: 48, position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', left: 16, background: 'none', border: 'none', padding: 4, cursor: 'pointer', display: 'flex' }}
        >
          <X size={15} style={{ color: '#97AAB3' }} />
        </button>
        <span style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: 16, color: '#1B1B1B' }}>
          Pilih Tower
        </span>
      </div>
      {/* Search bar */}
      <div style={{ padding: '12px 16px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: '#FFFFFF', border: '1px solid #E1E8EC', borderRadius: 8,
          padding: '0 12px', height: 44,
        }}>
          <Search size={16} style={{ color: '#566B75', flexShrink: 0 }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari tower berdasarkan nama"
            style={{
              border: 'none', outline: 'none', width: '100%',
              fontSize: 14, fontWeight: 500, color: '#1B1B1B', background: 'transparent',
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex' }}>
              <X size={14} style={{ color: '#97AAB3' }} />
            </button>
          )}
        </div>
      </div>
      {/* Tower list — fixed 280px, scrollable */}
      <div style={{ height: 280, overflowY: 'auto' }}>
        {displayed.map((t) => {
          const { label, sub } = parseTowerDisplay(t)
          const isSelected = value === t.id
          return (
            <button
              key={t.id}
              onClick={() => { onSelect(t.id, label); onClose() }}
              style={{
                width: '100%', height: 56, display: 'flex', alignItems: 'center',
                padding: '0 16px', background: isSelected ? '#F6F9FC' : '#FFFFFF',
                border: 'none', borderBottom: '1px solid #F0F4F6',
                cursor: 'pointer', textAlign: 'left',
              }}
            >
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <p style={{
                  fontFamily: 'monospace', fontWeight: 600, fontSize: 13,
                  color: isSelected ? '#076C9E' : '#1B1B1B',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{label}</p>
                {sub && (
                  <p style={{
                    fontSize: 11, color: '#5F737F', marginTop: 1,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{sub}</p>
                )}
              </div>
              {isSelected && (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginLeft: 8 }}>
                  <path d="M4 10L8 14L16 6" stroke="#076C9E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          )
        })}
        {displayed.length === 0 && (
          <p style={{ textAlign: 'center', color: '#97AAB3', padding: '32px 16px', fontSize: 13 }}>
            Tower tidak ditemukan
          </p>
        )}
      </div>
    </BottomSheet>
  )
}

// ── Progress Laporan section ──────────────────────────────────────────────────

function ProgressSection({ laporanId }: { laporanId: string }) {
  const [data, setData] = useState<Record<string, any[]>>({
    spanduk: [], brosur: [], laporan_baru: [], berita_acara: [],
  })
  const [uploading, setUploading] = useState<string | null>(null)
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    laporanApi.getProgress(laporanId).then((r) => setData(r.data)).catch(() => {})
  }, [laporanId])

  async function handleUpload(tipe: string, file: File) {
    setUploading(tipe)
    try {
      await laporanApi.uploadProgress(laporanId, tipe, file)
      const r = await laporanApi.getProgress(laporanId)
      setData(r.data)
      toast.success('Dokumen berhasil diunggah')
    } catch {
      toast.error('Gagal mengunggah dokumen')
    } finally {
      setUploading(null)
    }
  }

  async function handleDelete(tipe: string, progressId: string) {
    try {
      await laporanApi.deleteProgress(laporanId, progressId)
      setData((prev) => ({ ...prev, [tipe]: prev[tipe].filter((p) => p.id !== progressId) }))
      toast.success('Dokumen dihapus')
    } catch {
      toast.error('Gagal menghapus dokumen')
    }
  }

  return (
    <div className="space-y-4">
      {PROGRESS_TIPE_LIST.map((tipe) => {
        const items: any[] = data[tipe] ?? []
        const isUploading = uploading === tipe
        return (
          <div key={tipe} className="border border-app-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-app-bg border-b border-app-border">
              <span className="text-[12px] font-bold text-app-text uppercase tracking-wide">
                {PROGRESS_TIPE_LABEL[tipe]}
              </span>
              <button
                type="button"
                onClick={() => inputRefs.current[tipe]?.click()}
                disabled={isUploading}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                <Upload size={12} />
                {isUploading ? 'Mengunggah...' : 'Upload'}
              </button>
              <input
                ref={(el) => { inputRefs.current[tipe] = el }}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleUpload(tipe, f)
                  e.target.value = ''
                }}
              />
            </div>
            {items.length === 0 ? (
              <p className="text-[12px] text-app-subtle text-center py-4">Belum ada dokumen</p>
            ) : (
              <ul className="divide-y divide-app-border">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 px-4 py-2.5">
                    <FileText size={14} className="text-blue-500 shrink-0" />
                    <a href={item.fileUrl} target="_blank" rel="noreferrer"
                      className="flex-1 text-[12px] text-blue-600 hover:underline truncate" title={item.namaFile}>
                      {item.namaFile}
                    </a>
                    <span className="text-[10px] text-app-subtle shrink-0">
                      {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(tipe, item.id)}
                      className="p-1 rounded text-app-muted hover:text-red-500 transition-colors shrink-0"
                      title="Hapus"
                    >
                      <X size={12} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Foto History section ──────────────────────────────────────────────────────

function FotoHistorySection({ laporanId }: { laporanId: string }) {
  const [history, setHistory] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function loadHistory() {
    laporanApi.getFotoHistory(laporanId).then((r) => setHistory(r.data ?? [])).catch(() => {})
  }

  useEffect(() => { loadHistory() }, [laporanId])

  async function handleUpload(files: FileList) {
    const raw = Array.from(files).filter((f) => /\.(jpe?g|png|webp)$/i.test(f.name)).slice(0, 10)
    if (raw.length === 0) { toast.error('Hanya JPG/PNG/WEBP'); return }
    setUploading(true)
    try {
      const compressed = await Promise.all(raw.map((f) => compressImage(f)))
      await laporanApi.uploadFotoUpdate(laporanId, compressed)
      toast.success(`${compressed.length} foto berhasil diunggah`)
      loadHistory()
    } catch {
      toast.error('Gagal mengunggah foto')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload button */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-app-border rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors disabled:opacity-60"
      >
        <ImagePlus size={18} className="text-app-muted" />
        <span className="text-[13px] text-app-muted font-medium">
          {uploading ? 'Mengunggah...' : 'Upload Foto Update (maks 10, auto-compress)'}
        </span>
      </button>
      <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.webp" multiple className="hidden"
        onChange={(e) => { if (e.target.files?.length) { handleUpload(e.target.files); e.target.value = '' } }} />

      {/* History grouped by date */}
      {history.length === 0 ? (
        <p className="text-[12px] text-app-subtle text-center py-4">Belum ada foto update</p>
      ) : (
        history.map((entry) => (
          <div key={entry.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock size={12} className="text-app-muted" />
              <span className="text-[11px] font-bold text-app-muted">
                {new Date(entry.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(entry.urls as string[]).map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={url} alt="" className="w-full aspect-square object-cover rounded-lg border border-app-border" />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

// ── Detail read-only view (Figma 305-4621 desktop · 315-2798 mobile) ────────────

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
      <span style={{ fontSize: 14, fontWeight: 400, color: '#5F737F' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: '#1B1B1B', wordBreak: 'break-word' }}>{value ?? '—'}</span>
    </div>
  )
}

function SectionHeader({ title, size = 18 }: { title: string; size?: number }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <span style={{ fontSize: size, fontWeight: 700, color: '#1B1B1B' }}>{title}</span>
      <div style={{ height: 1, background: '#E1E8EC', marginTop: 8 }} />
    </div>
  )
}

// Mobile file row: thumbnail + label/filename/action + eye icon
function MobileFileRow({
  thumbnailUrl, typeLabel, fileName, fileUrl,
  onUpload, onView,
}: {
  thumbnailUrl?: string; typeLabel: string; fileName?: string; fileUrl?: string;
  onUpload?: () => void; onView?: () => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 12, paddingBottom: 12 }}>
      {/* Thumbnail */}
      <div style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#F6F9FC', border: '1px solid #E1E8EC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {thumbnailUrl && /\.(jpe?g|png|webp)$/i.test(thumbnailUrl) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={resolveMediaUrl(thumbnailUrl)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : thumbnailUrl ? (
          <FileText size={24} style={{ color: '#5F737F' }} />
        ) : (
          <FileText size={24} style={{ color: '#BBC7CD' }} />
        )}
      </div>
      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 400, color: '#5F737F', margin: 0 }}>{typeLabel}</p>
        {fileName ? (
          <p style={{ fontSize: 14, fontWeight: 600, color: '#1B1B1B', margin: '2px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fileName}</p>
        ) : (
          <p style={{ fontSize: 14, fontWeight: 400, color: '#BBC7CD', margin: '2px 0' }}>Belum ada file</p>
        )}
        {onUpload && (
          <button type="button" onClick={onUpload} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <RotateCcw size={14} style={{ color: '#005AA9' }} />
            <span style={{ fontSize: 14, fontWeight: 500, color: '#005AA9' }}>Unggah ulang</span>
          </button>
        )}
      </div>
      {/* Eye icon */}
      {fileUrl && (
        <button type="button" onClick={onView ?? (() => window.open(resolveMediaUrl(fileUrl), '_blank'))} style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', flexShrink: 0 }}>
          <Eye size={20} style={{ color: '#BBC7CD' }} />
        </button>
      )}
    </div>
  )
}

function DetailReadView({ laporan, onSaved, onClose }: { laporan: any; onSaved?: () => void; onClose?: () => void }) {
  const { isMobile } = useSidebar()
  const [progress, setProgress] = useState<Record<string, any[]>>({ spanduk: [], brosur: [], laporan_baru: [], berita_acara: [] })
  const [fotoHistory, setFotoHistory] = useState<any[]>([])
  const [uploading, setUploading] = useState<string | null>(null)
  const [uploadingFoto, setUploadingFoto] = useState(false)
  const [selesaiLoading, setSelesaiLoading] = useState(false)
  const fotoUpdateRef = useRef<HTMLInputElement>(null)
  const progressRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    if (!laporan?.id) return
    laporanApi.getProgress(laporan.id).then(r => setProgress(r.data)).catch(() => {})
    laporanApi.getFotoHistory(laporan.id).then(r => setFotoHistory(r.data ?? [])).catch(() => {})
  }, [laporan?.id])

  async function handleSelesaikan() {
    if (!laporan?.id) return
    setSelesaiLoading(true)
    try {
      await laporanApi.update(laporan.id, { status: 'selesai' })
      toast.success('Laporan berhasil diselesaikan')
      onSaved?.()
      onClose?.()
    } catch { toast.error('Gagal menyelesaikan laporan') } finally { setSelesaiLoading(false) }
  }

  async function handleProgressUpload(tipe: string, file: File) {
    setUploading(tipe)
    try {
      await laporanApi.uploadProgress(laporan.id, tipe, file)
      const r = await laporanApi.getProgress(laporan.id)
      setProgress(r.data)
      toast.success('Dokumen berhasil diunggah')
    } catch { toast.error('Gagal mengunggah') } finally { setUploading(null) }
  }

  async function handleProgressDelete(tipe: string, progressId: string) {
    try {
      await laporanApi.deleteProgress(laporan.id, progressId)
      setProgress(prev => ({ ...prev, [tipe]: prev[tipe].filter(p => p.id !== progressId) }))
      toast.success('Dokumen dihapus')
    } catch { toast.error('Gagal menghapus') }
  }

  async function handleFotoUpdate(files: FileList) {
    const raw = Array.from(files).filter(f => /\.(jpe?g|png|webp)$/i.test(f.name)).slice(0, 10)
    if (!raw.length) { toast.error('Hanya JPG/PNG/WEBP'); return }
    setUploadingFoto(true)
    try {
      const compressed = await Promise.all(raw.map(f => compressImage(f)))
      await laporanApi.uploadFotoUpdate(laporan.id, compressed)
      toast.success(`${compressed.length} foto diunggah`)
      laporanApi.getFotoHistory(laporan.id).then(r => setFotoHistory(r.data ?? [])).catch(() => {})
    } catch { toast.error('Gagal upload foto') } finally { setUploadingFoto(false) }
  }

  const fotoUrls: string[] = laporan?.foto ?? []
  const isPPL = laporan?.jenisGangguan === 'pekerjaan_pihak_lain'

  // ── shared progress hidden inputs
  const progressInputs = PROGRESS_TIPE_LIST.map((tipe) => (
    <input
      key={tipe}
      ref={el => { progressRefs.current[tipe] = el }}
      type="file"
      accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx"
      className="hidden"
      onChange={e => { const f = e.target.files?.[0]; if (f) handleProgressUpload(tipe, f); e.target.value = '' }}
    />
  ))

  // ══════════════════════════════════════════════════
  // MOBILE — Figma 315-2798
  // ══════════════════════════════════════════════════
  if (isMobile) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto" style={{ padding: '0 16px' }}>

          {/* Header: jenis name + progress badge + date */}
          <div style={{ paddingTop: 16, paddingBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#1B1B1B', flex: 1 }}>
                {JENIS_LABEL[laporan?.jenisGangguan] ?? laporan?.jenisGangguan ?? '—'}
              </span>
              <ProgressBadge tipe={laporan?.latestProgressTipe} />
            </div>
            <div style={{ display: 'flex', gap: 4, marginTop: 4, fontSize: 12, color: '#5F737F' }}>
              <span>Tanggal Laporan Dibuat:</span>
              <span style={{ color: '#1B1B1B' }}>{formatTanggal(laporan?.tanggal)}</span>
            </div>
          </div>

          <div style={{ height: 1, background: '#E1E8EC', margin: '0 -16px' }} />

          {/* 2-col info grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px', padding: '16px 0' }}>
            {isPPL && <InfoRow label="Informasi Pihak Lain" value={laporan?.teknisi} />}
            <InfoRow label="Jenis Kerawanan" value={<LevelBadge level={laporan?.levelRisiko} />} />
            <InfoRow label="Tower Terdampak" value={extractTowerNo(laporan?.tower?.nama)} />
            {laporan?.lokasiDetail && <InfoRow label="Span" value={laporan.lokasiDetail} />}
            {!isPPL && laporan?.pelapor?.nama && <InfoRow label="Dilaporkan Oleh" value={laporan.pelapor.nama} />}
          </div>

          {/* Uraian / Deskripsi */}
          {laporan?.deskripsi && (
            <div style={{ paddingBottom: 16 }}>
              <InfoRow label={isPPL ? 'Uraian Pekerjaan' : 'Deskripsi'} value={laporan.deskripsi} />
            </div>
          )}

          {/* Foto bukti as file row */}
          {fotoUrls.length > 0 && (
            <>
              <div style={{ height: 1, background: '#E1E8EC', margin: '0 -16px' }} />
              {fotoUrls.map((url, i) => (
                <MobileFileRow
                  key={i}
                  thumbnailUrl={resolveMediaUrl(url)}
                  typeLabel="Bukti Kerawanan"
                  fileName={`Foto Bukti ${i + 1}`}
                  fileUrl={resolveMediaUrl(url)}
                />
              ))}
            </>
          )}

          {/* Divider before pengendalian */}
          <div style={{ height: 1, background: '#E1E8EC', margin: '4px -16px 16px' }} />

          {/* Informasi Pengendalian heading */}
          <span style={{ fontSize: 16, fontWeight: 700, color: '#1B1B1B', display: 'block', marginBottom: 8 }}>
            Informasi Pengendalian
          </span>

          {/* Upaya pengendalian */}
          {laporan?.keterangan && (
            <div style={{ marginBottom: 12 }}>
              <InfoRow label={isPPL ? 'Deskripsi Pengendalian' : 'Keterangan'} value={laporan.keterangan} />
            </div>
          )}

          {/* Progress file rows — only show types that have files */}
          {PROGRESS_TIPE_LIST.map((tipe) => {
            const items: any[] = progress[tipe] ?? []
            const latest = items[0]
            if (!latest) return null
            return (
              <div key={tipe}>
                <div style={{ height: 1, background: '#E1E8EC', margin: '0 -16px' }} />
                <MobileFileRow
                  thumbnailUrl={latest.fileUrl}
                  typeLabel={PROGRESS_TIPE_LABEL[tipe]}
                  fileName={latest.namaFile}
                  fileUrl={latest.fileUrl}
                />
              </div>
            )
          })}

          <div style={{ height: 24 }} />
        </div>

        {/* Bottom CTA — "Selesaikan Laporan" */}
        {laporan?.status !== 'selesai' && (
          <div style={{ padding: '16px', borderTop: '1px solid #E1E8EC', flexShrink: 0 }}>
            <button
              type="button"
              onClick={handleSelesaikan}
              disabled={selesaiLoading}
              style={{ width: '100%', height: 44, background: '#076C9E', border: 'none', borderRadius: 8, color: '#FFFFFF', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
            >
              {selesaiLoading ? 'Menyimpan...' : 'Selesaikan Laporan'}
            </button>
          </div>
        )}
      </div>
    )
  }

  // ══════════════════════════════════════════════════
  // DESKTOP — Figma 305-4621 (full-page on gray bg)
  // ══════════════════════════════════════════════════
  return (
    <div style={{ minHeight: '100%', padding: '32px 40px 48px' }}>
      {/* Head — outside white card */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 24, fontWeight: 700, color: '#1B1B1B' }}>Detail Kerawanan</span>
          <ProgressBadge tipe={laporan?.latestProgressTipe} />
        </div>
        <div style={{ display: 'flex', gap: 8, fontSize: 14, fontWeight: 500, color: '#566B75' }}>
          <span>Dibuat pada : {formatTanggal(laporan?.tanggal)}</span>
          {laporan?.pelapor?.nama && <><span>·</span><span>Dibuat oleh : {laporan.pelapor.nama}</span></>}
        </div>
      </div>

      {/* White card */}
      <div style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E1E8EC', padding: '32px' }}>

        {/* ── Section 1: Informasi Kerawanan ── */}
        <div style={{ marginBottom: 32 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#1B1B1B', display: 'block', marginBottom: 12 }}>
            Informasi Kerawanan
          </span>
          <div style={{ height: 1, background: '#E1E8EC', marginBottom: 20 }} />

          {/* 4-col info row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0 20px', marginBottom: 20 }}>
            <InfoRow label="Jenis Kerawanan" value={JENIS_LABEL[laporan?.jenisGangguan] ?? laporan?.jenisGangguan} />
            <InfoRow label="Status Kerawanan" value={<LevelBadge level={laporan?.levelRisiko} />} />
            <InfoRow label="Tower Terdampak" value={extractTowerNo(laporan?.tower?.nama)} />
            {laporan?.lokasiDetail
              ? <InfoRow label="Span" value={laporan.lokasiDetail} />
              : <InfoRow label="Tanggal" value={formatTanggal(laporan?.tanggal)} />
            }
          </div>

          {/* Description + Pihak Lain side by side */}
          {(laporan?.deskripsi || (isPPL && laporan?.teknisi)) && (
            <div style={{ display: 'grid', gridTemplateColumns: laporan?.deskripsi && isPPL && laporan?.teknisi ? '1fr 1fr' : '1fr', gap: '0 20px', marginBottom: 20 }}>
              {laporan?.deskripsi && (
                <div>
                  <span style={{ fontSize: 14, fontWeight: 400, color: '#5F737F', display: 'block', marginBottom: 4 }}>
                    {isPPL ? 'Uraian Pekerjaan' : 'Deskripsi'}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#1B1B1B' }}>{laporan.deskripsi}</span>
                </div>
              )}
              {isPPL && laporan?.teknisi && (
                <div>
                  <span style={{ fontSize: 14, fontWeight: 400, color: '#5F737F', display: 'block', marginBottom: 4 }}>Informasi Pihak Lain</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#1B1B1B' }}>{laporan.teknisi}</span>
                </div>
              )}
            </div>
          )}

          {/* Foto Bukti — single image 240px wide */}
          {fotoUrls.length > 0 && (
            <div>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#5F737F', display: 'block', marginBottom: 8 }}>
                Foto Bukti Terjadinya Kerawanan
              </span>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {fotoUrls.map((url, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={resolveMediaUrl(url)} alt=""
                    style={{ width: 240, height: 160, objectFit: 'cover', borderRadius: 8, border: '1px solid #E1E8EC', display: 'block', cursor: 'pointer' }}
                    onClick={() => window.open(resolveMediaUrl(url), '_blank')}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Divider between sections */}
        <div style={{ height: 1, background: '#E1E8EC', marginBottom: 32 }} />

        {/* ── Section 2: Informasi Pengendalian Kerawanan ── */}
        <div>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#1B1B1B', display: 'block', marginBottom: 12 }}>
            Informasi Pengendalian Kerawanan
          </span>
          <div style={{ height: 1, background: '#E1E8EC', marginBottom: 20 }} />

          {/* Upaya Pengendalian */}
          {laporan?.keterangan && (
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: 14, fontWeight: 400, color: '#5F737F', display: 'block', marginBottom: 4 }}>
                {isPPL ? 'Upaya Pengendalian' : 'Keterangan'}
              </span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1B1B1B' }}>{laporan.keterangan}</span>
            </div>
          )}

          {/* Progress docs — only show types with files, 2-col card grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {PROGRESS_TIPE_LIST.map((tipe) => {
              const items: any[] = progress[tipe] ?? []
              const isUp = uploading === tipe
              const latestItem = items[0]
              return (
                <div key={tipe}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#5F737F', display: 'block', marginBottom: 8 }}>
                    {PROGRESS_TIPE_LABEL[tipe]}
                  </span>
                  <div style={{ border: '1px solid #E1E8EC', borderRadius: 8, overflow: 'hidden' }}>
                    {latestItem ? (
                      <>
                        {/* Image/file preview full-width */}
                        <div style={{ position: 'relative', height: 140, background: '#F6F9FC', overflow: 'hidden' }}>
                          {/\.(jpe?g|png|webp)$/i.test(latestItem.fileUrl) ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={resolveMediaUrl(latestItem.fileUrl)} alt=""
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FileText size={36} style={{ color: '#5F737F' }} />
                            </div>
                          )}
                          {/* Upload replace button */}
                          <button type="button" onClick={() => progressRefs.current[tipe]?.click()}
                            style={{ position: 'absolute', top: 8, right: 8, width: 30, height: 30, borderRadius: '50%', background: '#076C9E', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Upload size={13} style={{ color: '#FFF' }} />
                          </button>
                        </div>
                        {/* Filename + size/date */}
                        <div style={{ padding: '10px 12px' }}>
                          <p style={{ fontSize: 14, fontWeight: 600, color: '#1B1B1B', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {latestItem.namaFile}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
                            <p style={{ fontSize: 12, color: '#5F737F', margin: 0 }}>
                              {new Date(latestItem.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                            <button type="button" onClick={() => handleProgressDelete(tipe, latestItem.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: '#D92D20', display: 'flex' }}>
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <button type="button" onClick={() => progressRefs.current[tipe]?.click()} disabled={isUp}
                        style={{ width: '100%', height: 140, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#F6F9FC', border: 'none', cursor: 'pointer' }}>
                        <Upload size={22} style={{ color: '#97AAB3' }} />
                        <span style={{ fontSize: 12, color: '#97AAB3' }}>{isUp ? 'Mengunggah...' : 'Upload file'}</span>
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Section 3: Foto Update ── */}
        <div style={{ marginTop: 32 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#1B1B1B', display: 'block', marginBottom: 12 }}>
            Foto Update
          </span>
          <div style={{ height: 1, background: '#E1E8EC', marginBottom: 16 }} />
          <button type="button" onClick={() => fotoUpdateRef.current?.click()} disabled={uploadingFoto}
            style={{ width: '100%', padding: 12, border: '2px dashed #E1E8EC', borderRadius: 8, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', marginBottom: 16 }}>
            <ImagePlus size={18} style={{ color: '#5F737F' }} />
            <span style={{ fontSize: 13, color: '#5F737F', fontWeight: 500 }}>
              {uploadingFoto ? 'Mengunggah...' : 'Upload Foto Update (maks 10, auto-compress)'}
            </span>
          </button>
          <input ref={fotoUpdateRef} type="file" accept=".jpg,.jpeg,.png,.webp" multiple className="hidden"
            onChange={e => { if (e.target.files?.length) { handleFotoUpdate(e.target.files); e.target.value = '' } }} />
          {fotoHistory.map(entry => (
            <div key={entry.id} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Clock size={12} style={{ color: '#97AAB3' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#97AAB3' }}>
                  {new Date(entry.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {(entry.urls as string[]).map((url, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={url} alt="" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 6, border: '1px solid #E1E8EC', cursor: 'pointer' }}
                    onClick={() => window.open(resolveMediaUrl(url), '_blank')} />
                ))}
              </div>
            </div>
          ))}
          {fotoHistory.length === 0 && (
            <p style={{ fontSize: 12, color: '#97AAB3', textAlign: 'center', padding: '16px 0' }}>Belum ada foto update</p>
          )}
        </div>

      </div>

      {progressInputs}
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
  const { isMobile, sidebarWidth } = useSidebar()
  const [form, setForm] = useState(EMPTY_FORM)
  const [fotos, setFotos] = useState<File[]>([])
  const [fotoUrls, setFotoUrls] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [locating, setLocating] = useState(false)
  const [useGPS, setUseGPS] = useState(false)
  const [detectedMsg, setDetectedMsg] = useState('')
  const [alertVisible, setAlertVisible] = useState(true)

  // Mobile bottom-sheet state
  const [jenisSheetOpen, setJenisSheetOpen] = useState(false)
  const [levelSheetOpen, setLevelSheetOpen] = useState(false)
  const [towerSheetOpen, setTowerSheetOpen] = useState(false)
  const [towerSheetTarget, setTowerSheetTarget] = useState<'start' | 'end'>('start')
  const [fotoSheetOpen, setFotoSheetOpen] = useState(false)

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
        <label className="block text-[14px] font-bold text-app-text mb-2">Foto Bukti Terjadinya Kerawanan</label>
        {/* Desktop: grid preview of existing foto URLs */}
        {!isMobile && fotoUrls.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mb-2">
            {fotoUrls.map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={resolveMediaUrl(url)} alt="" className="w-full aspect-square object-cover rounded-lg" />
            ))}
          </div>
        )}
        {/* Mobile: Figma-style full-width preview */}
        {isMobile && (
          <div style={{ border: '1px solid #E1E8EC', borderRadius: 12, overflow: 'hidden', background: '#FFFFFF' }}>
            <div
              style={{ position: 'relative', width: '100%', height: 128, background: '#F6F9FC', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: readOnly ? 'default' : 'pointer' }}
              onClick={() => !readOnly && setFotoSheetOpen(true)}
            >
              {(fotos.length > 0 || fotoUrls.length > 0) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={fotos.length > 0 ? URL.createObjectURL(fotos[0]) : resolveMediaUrl(fotoUrls[0])}
                  alt="preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
                />
              ) : null}
              {!readOnly && (
                <div style={{ position: 'relative', zIndex: 1, width: 44, height: 44, borderRadius: 22, background: '#076C9E', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                  <ImagePlus size={20} color="#fff" />
                </div>
              )}
            </div>
            {(fotos.length > 0 || fotoUrls.length > 0) && (
              <div style={{ padding: '8px 14px' }}>
                <p style={{ fontSize: 12, fontWeight: 500, color: '#1B1B1B' }}>
                  {fotos.length > 0 ? fotos[0].name : 'Foto tersimpan'}
                  {fotos.length > 1 ? ` (+${fotos.length - 1} foto lainnya)` : ''}
                </p>
                {fotos.length > 0 && (
                  <p style={{ fontSize: 12, fontWeight: 500, color: '#1B1B1B', marginTop: 2 }}>
                    Size: {(fotos.reduce((a, f) => a + f.size, 0) / (1024 * 1024)).toFixed(1)}MB
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        {!readOnly && !isMobile && (
          <FotoUpload fotos={fotos} onChange={setFotos} onPhotoAdded={handleDetectLocation} />
        )}
      </div>

      {/* Tower terdampak — start (always) */}
      <div>
        <label className="block text-[14px] font-bold text-app-text mb-2">
          {isPPL ? 'Tower Terdampak (Start)' : 'Tower Terganggu'}
        </label>
        {readOnly ? (
          <input readOnly className="form-input bg-app-bg text-app-muted" value={form.towerLabel || form.towerId} />
        ) : isMobile ? (
          <button
            type="button"
            onClick={() => { setTowerSheetTarget('start'); setTowerSheetOpen(true) }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', padding: '10px 14px',
              background: form.towerId ? '#E1E8EC' : '#FFFFFF',
              border: '1px solid #E1E8EC', borderRadius: 8, cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 14, color: form.towerId ? '#5F737F' : '#97AAB3', fontWeight: 500 }}>
              {form.towerLabel || 'Pilih tower...'}
            </span>
            <ChevronDown size={14} style={{ color: '#5F737F', flexShrink: 0 }} />
          </button>
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
          <label className="block text-[14px] font-bold text-app-text mb-2">Tower Terdampak (End)</label>
          {isMobile ? (
            <button
              type="button"
              onClick={() => { setTowerSheetTarget('end'); setTowerSheetOpen(true) }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '10px 14px',
                background: form.towerIdEnd ? '#E1E8EC' : '#FFFFFF',
                border: '1px solid #E1E8EC', borderRadius: 8, cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: 14, color: form.towerIdEnd ? '#1B1B1B' : '#97AAB3', fontWeight: 500 }}>
                {form.towerLabelEnd || 'Pilih tower...'}
              </span>
              <ChevronDown size={14} style={{ color: '#5F737F', flexShrink: 0 }} />
            </button>
          ) : (
            <TowerDropdown
              options={towerOptions}
              value={form.towerIdEnd}
              onChange={(id, label) => setForm(f => ({ ...f, towerIdEnd: id, towerLabelEnd: label }))}
            />
          )}
        </div>
      )}

      {/* Jenis kerawanan */}
      <div>
        <label className="block text-[14px] font-bold text-app-text mb-2">Jenis Kerawanan</label>
        {isMobile && !readOnly ? (
          <button
            type="button"
            onClick={() => setJenisSheetOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', padding: '10px 14px', background: '#FFFFFF',
              border: '1px solid #E1E8EC', borderRadius: 8, cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 14, color: form.jenisGangguan ? '#1B1B1B' : '#97AAB3', fontWeight: 500 }}>
              {JENIS_LABEL[form.jenisGangguan] || 'Pilih kategori...'}
            </span>
            <ChevronDown size={14} style={{ color: '#5F737F', flexShrink: 0 }} />
          </button>
        ) : (
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
        )}
      </div>

      {/* Uraian Pekerjaan / Deskripsi */}
      <div>
        <label className="block text-[14px] font-bold text-app-text mb-2">
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
          {/* Figma: gray 8px divider strip + section heading 18px/700 */}
          <div style={{ margin: '8px -20px 0', height: 8, background: '#F6F9FC' }} />
          <div style={{ padding: '12px 0 4px' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1B1B1B' }}>Informasi Pihak Lain</h3>
          </div>
          <div>
            <label className="block text-[14px] font-bold text-app-text mb-2">Pihak Lain</label>
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
            <label className="block text-[14px] font-bold text-app-text mb-2">Upaya Pengendalian</label>
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

      {/* Tanggal & Waktu — hidden on create (auto = now), editable on edit, disabled on detail */}
      {(readOnly || !!initial) && (
        <div>
          <label className="block text-[12px] font-semibold text-app-text mb-1.5">Tanggal & Waktu</label>
          <input
            disabled={readOnly}
            type="datetime-local"
            value={form.tanggalWaktu}
            onChange={(e) => set('tanggalWaktu', e.target.value)}
            className={`form-input ${readOnly ? 'bg-app-bg text-app-muted' : ''}`}
          />
        </div>
      )}

      <div>
        <label className={`block font-semibold text-app-text mb-2 ${isMobile ? 'text-[14px]' : 'text-[12px]'}`}>Status Kerawanan</label>
        {isMobile && !readOnly ? (
          <button
            type="button"
            onClick={() => setLevelSheetOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', padding: '10px 14px', background: '#FFFFFF',
              border: '1px solid #E1E8EC', borderRadius: 8, cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 14, color: form.levelRisiko ? '#1B1B1B' : '#97AAB3', fontWeight: 500 }}>
              {LEVEL_OPTIONS.find(l => l.value === form.levelRisiko)?.label || 'Pilih status...'}
            </span>
            <ChevronDown size={14} style={{ color: '#5F737F', flexShrink: 0 }} />
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-2">
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
        )}
      </div>

      <div>
        <label className="block text-[12px] font-semibold text-app-text mb-1.5">Progress Laporan</label>
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

  return (
    <>
      {/* ── Mobile Bottom Sheets ─────────────────────────────────────────── */}
      <JenisKerawananSheet
        open={jenisSheetOpen}
        value={form.jenisGangguan}
        onSelect={(v) => set('jenisGangguan', v)}
        onClose={() => setJenisSheetOpen(false)}
      />
      <StatusKerawananSheet
        open={levelSheetOpen}
        value={form.levelRisiko}
        onSelect={(v) => set('levelRisiko', v)}
        onClose={() => setLevelSheetOpen(false)}
      />
      <PilihTowerSheet
        open={towerSheetOpen}
        options={towerOptions}
        value={towerSheetTarget === 'end' ? form.towerIdEnd : form.towerId}
        onSelect={(id, label) => {
          if (towerSheetTarget === 'end') setForm(f => ({ ...f, towerIdEnd: id, towerLabelEnd: label }))
          else setForm(f => ({ ...f, towerId: id, towerLabel: label }))
        }}
        onClose={() => setTowerSheetOpen(false)}
      />
      <AmbilFotoSheet
        open={fotoSheetOpen}
        onClose={() => setFotoSheetOpen(false)}
        onFile={(files) => {
          const valid = Array.from(files).filter(
            (f) => f.size <= 5 * 1024 * 1024 && /\.(jpe?g|png|webp)$/i.test(f.name)
          )
          const next = [...fotos, ...valid].slice(0, 10)
          setFotos(next)
          if (valid.length > 0) handleDetectLocation()
        }}
      />

      {/* ── Backdrop ─────────────────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ background: isMobile ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.3)' }}
        onClick={onClose}
      />

      {/* ── Mobile: full-screen ───────────────────────────────────────────── */}
      {isMobile && (
        <div
          className={`fixed inset-0 z-50 flex flex-col bg-white transition-transform duration-300 ease-in-out ${open ? 'translate-y-0' : 'translate-y-full'}`}
        >
          <div className="flex items-center gap-3 px-4 shrink-0" style={{ height: 64, background: '#076c9e' }}>
            <button onClick={onClose} className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors">
              <ArrowLeft size={22} />
            </button>
            <p className="text-white font-bold text-[16px] leading-tight">
              {readOnly ? 'Detail Laporan Kerawanan' : title}
            </p>
          </div>
          {readOnly && initial ? (
            <DetailReadView laporan={initial} onSaved={onSaved} onClose={onClose} />
          ) : (
            <>
              {formBody}
              <div className="px-5 py-4 border-t border-app-border shrink-0 bg-white">
                <button type="submit" form="laporan-form" disabled={saving} className="btn-primary w-full justify-center">
                  {saving ? 'Menyimpan...' : initial ? 'Simpan Perubahan' : 'Buat Laporan'}
                </button>
              </div>
            </>
          )}
          {readOnly && (
            <div className="px-5 py-4 border-t border-app-border shrink-0 bg-white">
              <button onClick={onClose} className="btn-outline w-full justify-center">Tutup</button>
            </div>
          )}
        </div>
      )}

      {/* ── Desktop: full-page detail (readOnly) ─────────────────────────── */}
      {!isMobile && readOnly && initial && (
        <div
          style={{
            position: 'fixed', top: 0, bottom: 0, right: 0, left: sidebarWidth,
            zIndex: 50, background: '#F6F9FC', overflowY: 'auto',
            transition: 'transform 0.3s ease-in-out',
            transform: open ? 'translateX(0)' : 'translateX(100%)',
          }}
        >
          {/* X close button */}
          <button
            onClick={onClose}
            style={{ position: 'fixed', top: 14, right: 16, zIndex: 10, background: '#FFFFFF', border: '1px solid #E1E8EC', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
          >
            <X size={16} style={{ color: '#5F737F' }} />
          </button>
          <DetailReadView laporan={initial} onSaved={onSaved} onClose={onClose} />
        </div>
      )}

      {/* ── Desktop: right-side form drawer (create/edit) ─────────────────── */}
      {!isMobile && !readOnly && (
        <div
          className={`fixed top-0 right-0 bottom-0 z-50 flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out w-full sm:w-[580px] ${open ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-app-border shrink-0">
            <h2 className="text-[15px] font-bold text-app-text">{title}</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-app-bg text-app-muted transition-colors">
              <X size={18} />
            </button>
          </div>
          {formBody}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-app-border shrink-0 bg-white">
            <button type="button" onClick={onClose} className="btn-outline">Batal</button>
            <button type="submit" form="laporan-form" disabled={saving} className="btn-primary">
              {saving ? 'Menyimpan...' : initial ? 'Simpan Perubahan' : 'Buat Laporan'}
            </button>
          </div>
        </div>
      )}
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
      <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 24, lineHeight: '36px', color: '#1C1C1C', marginBottom: 24 }}>Riwayat Kerawanan Transmisi</h1>

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


        <div className="overflow-x-auto">
          <table className="data-table">
             <thead>
              <tr>
                <th>Tanggal</th>
                <th>Ruas</th>
                <th>No. Tower</th>
                <th>Jenis Kerawanan</th>
                <th>Teknisi</th>
                <th>Status Kerawanan</th>
                <th>Progres Laporan</th>
                <th style={{ textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: pageSize }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j}><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={8}><EmptyState title="Belum ada data Riwayat Kerawanan Transmisi." /></td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id}>
                    <td className="text-[14px] text-[#5f737f] whitespace-nowrap">{formatTanggal(row.tanggal)}</td>
                    <td className="text-[14px] text-[#5f737f] max-w-[220px]">
                      <span className="block truncate" title={row.tower?.nama ?? row.towerId}>
                        {row.tower?.nama ?? row.towerId ?? '—'}
                      </span>
                    </td>
                    <td className="text-[14px] text-[#5f737f] whitespace-nowrap">
                      {extractTowerNo(row.tower?.nama) ?? '—'}
                    </td>
                    <td className="text-[14px] text-[#5f737f]">{JENIS_LABEL[row.jenisGangguan] ?? row.jenisGangguan ?? '—'}</td>
                    <td className="text-[14px] text-[#5f737f]">{row.teknisi ?? row.pelapor?.nama ?? '—'}</td>
                    <td><LevelBadge level={row.levelRisiko} /></td>
                    <td><ProgressBadge tipe={row.latestProgressTipe} /></td>
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
