'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Eye, Pencil, X, MapPin, Zap, Activity, ExternalLink, Plus, Trash2, FileText, Upload, MoreHorizontal, ZoomIn, ZoomOut, Maximize2, SlidersHorizontal, Check, RotateCcw } from 'lucide-react'
import { towersApi, asetApi, jalurKmlApi, sertifikatApi } from '@/lib/api'
import { isAdminOrSuperadmin } from '@/lib/auth'
import { useSidebar } from '@/components/layout/SidebarContext'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ActionMenu } from '@/components/ui/ActionMenu'
import { Pagination } from '@/components/ui/Pagination'
import { SearchInput } from '@/components/ui/SearchInput'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonRow } from '@/components/ui/SkeletonRow'
import { CustomSelect } from '@/components/ui/CustomSelect'

const TIPE_CHIPS = ['SUTET', 'SUTT', 'SKTT', 'Gardu Induk']
const STATUS_CHIPS = ['Aman', 'Sedang', 'Kritis']
const JENIS_CHIPS = [
  { id: 'pekerjaan_pihak_lain', label: 'Pekerjaan Pihak Lain (PPL)' },
  { id: 'layangan', label: 'Layangan' },
  { id: 'kebakaran', label: 'Kebakaran' },
  { id: 'pencurian', label: 'Pencurian' },
  { id: 'pemanfaatan_lahan', label: 'Pemanfaatan Lahan' }
]
const SERTIFIKAT_CHIPS = [
  { id: 'true', label: 'Bersertifikat' },
  { id: 'false', label: 'Belum Bersertifikat' }
]

const JENIS_LABEL_MAP: Record<string, string> = Object.fromEntries(JENIS_CHIPS.map(c => [c.id, c.label]))
const formatJenis = (j?: string | null) => j ? (JENIS_LABEL_MAP[j] ?? j) : '—'

const LEVEL_COLOR: Record<string, { bg: string; text: string; label: string }> = {
  aman:                    { bg: 'bg-green-50',  text: 'text-green-700', label: 'Aman' },
  sedang:                  { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Sedang' },
  kritis_terpenuhi:        { bg: 'bg-red-50',    text: 'text-red-700',   label: 'Kritis Terpenuhi' },
  kritis_tidak_terpenuhi:  { bg: 'bg-red-100',   text: 'text-red-800',   label: 'Kritis Tidak Terpenuhi' },
}
const PROGRES_LABEL: Record<string, string> = {
  sedang_berlangsung: 'Sedang Berlangsung',
  selesai: 'Selesai',
  tidak_ada_aktifitas: 'Tidak Ada Aktivitas',
  tidak_ada_aktivitas: 'Tidak Ada Aktivitas',
}

function LevelChip({ level }: { level?: string }) {
  if (!level) return null
  const cfg = LEVEL_COLOR[level] ?? { bg: 'bg-gray-50', text: 'text-gray-600', label: level }
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
}
function ProgresChip({ progres }: { progres?: string }) {
  if (!progres) return null
  return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-blue-50 text-blue-700">{PROGRES_LABEL[progres] ?? progres}</span>
}

const TIPE_OPTIONS = ['Semua', 'SUTET', 'SUTT', 'SKTT', 'Gardu Induk']
const KATEGORI_OPTIONS = ['Kelayakan', 'Grounding', 'Konstruksi', 'K3', 'Lingkungan']
const STATUS_OPTIONS    = ['berlaku', 'expired']

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTanggal(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

function LabelValue({ label, value, weight = 'medium' }: { label: string; value?: any; weight?: 'medium' | 'bold' }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{label}</span>
      <span className={`text-[13px] ${weight === 'bold' ? 'font-bold text-gray-900' : 'font-semibold text-gray-800'} leading-tight`}>
        {value ?? '—'}
      </span>
    </div>
  )
}

// ── Detail Drawer ─────────────────────────────────────────────────────────────

function CertificatePreviewModal({ doc, onClose }: { doc: any; onClose: () => void }) {
  const [scale, setScale] = useState(1)
  const [loading, setLoading] = useState(true)
  const [url, setUrl] = useState<string>('')

  useEffect(() => {
    if (doc) {
      setLoading(true)
      sertifikatApi.previewDokumen(doc.id)
        .then(setUrl)
        .catch(() => toast.error('Gagal memuat preview'))
        .finally(() => setLoading(false))
    } else {
      setUrl('')
      setScale(1)
    }
  }, [doc])

  if (!doc) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
           <h3 className="text-[16px] font-bold text-gray-900">Preview Sertifikat</h3>
           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
             <X size={20} className="text-gray-500" />
           </button>
        </div>

        <div className="flex-1 overflow-auto bg-gray-100 flex items-center justify-center relative p-8 min-h-[400px]">
           {loading ? (
             <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
           ) : (
             <div className="relative transition-transform duration-200 ease-out w-full flex items-center justify-center" style={{ transform: `scale(${scale})` }}>
                {doc.namaFile?.toLowerCase().endsWith('.pdf') ? (
                  <iframe src={url} className="w-full h-[75vh] border-0 rounded-lg shadow-2xl bg-white" title={doc.namaFile} />
                ) : (
                  <img src={url} alt={doc.namaFile} className="max-w-full h-auto shadow-2xl rounded-sm" />
                )}
             </div>
           )}

           {!doc.namaFile?.toLowerCase().endsWith('.pdf') && (
             <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-xl border border-white/50">
                <button onClick={() => setScale(s => Math.min(3, s + 0.25))} className="p-2.5 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600 transition-colors">
                  <ZoomIn size={22} />
                </button>
                <button onClick={() => setScale(s => Math.max(0.5, s - 0.25))} className="p-2.5 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600 transition-colors">
                  <ZoomOut size={22} />
                </button>
                <div className="h-px bg-gray-200 mx-1 my-0.5" />
                <button onClick={() => setScale(1)} className="p-2.5 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600 transition-colors">
                  <Maximize2 size={20} />
                </button>
             </div>
           )}
        </div>
      </div>
    </div>
  )
}

function ConfirmModal({ 
  open, 
  title, 
  message, 
  onConfirm, 
  onClose,
  isLoading = false 
}: { 
  open: boolean; 
  title: string; 
  message: string; 
  onConfirm: () => void; 
  onClose: () => void;
  isLoading?: boolean;
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[340px] overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 text-center">
           <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="text-red-500" size={28} />
           </div>
           <h3 className="text-[17px] font-bold text-gray-900 mb-2">{title}</h3>
           <p className="text-[13px] text-gray-500 leading-relaxed px-2">{message}</p>
        </div>
        <div className="flex border-t border-gray-100 bg-gray-50/50">
           <button 
             onClick={onClose}
             className="flex-1 px-4 py-4 text-[13px] font-bold text-gray-400 hover:bg-white transition-colors border-r border-gray-100 uppercase tracking-wider"
           >
             Batal
           </button>
           <button 
             onClick={onConfirm}
             disabled={isLoading}
             className="flex-1 px-4 py-4 text-[13px] font-bold text-red-600 hover:bg-white transition-colors disabled:opacity-50 uppercase tracking-wider"
           >
             {isLoading ? 'Hapus...' : 'Ya, Hapus'}
           </button>
        </div>
      </div>
    </div>
  )
}

function FilterPopover({
  open, onClose, filters, onApply, onReset, isMobile,
}: {
  open: boolean; onClose: () => void
  filters: any; onApply: (f: any) => void; onReset: () => void
  isMobile?: boolean
}) {
  const toggle = (key: string, value: any) => {
    const current = filters[key] || []
    const next = current.includes(value)
      ? current.filter((v: any) => v !== value)
      : [...current, value]
    onApply({ ...filters, [key]: next })
  }

  const chip = (active: boolean) => ({
    padding: '4px 12px', borderRadius: 18, border: '1px solid',
    borderColor: active ? '#076C9E' : '#E1E8EC',
    background: active ? '#076C9E' : 'transparent',
    color: active ? '#FFFFFF' : '#5F737F',
    fontWeight: 500, fontSize: 12, cursor: 'pointer', transition: 'all 0.15s',
  })

  const sections = (
    <>
      <div className="p-4 flex flex-col gap-3">
        <span className="font-bold text-[14px] text-[#1C1C1C]">Tipe Aset</span>
        <div className="flex flex-wrap gap-2">
          {TIPE_CHIPS.map(t => (
            <button key={t} onClick={() => toggle('tipe', t)} style={chip(!!filters.tipe?.includes(t))}>{t}</button>
          ))}
        </div>
      </div>
      <div className="h-px bg-[#E1E8EC]" />
      <div className="p-4 flex flex-col gap-3">
        <span className="font-bold text-[14px] text-[#1C1C1C]">Status Kerawanan</span>
        <div className="flex flex-wrap gap-2">
          {STATUS_CHIPS.map(s => (
            <button key={s} onClick={() => toggle('status', s.toLowerCase())} style={chip(!!filters.status?.includes(s.toLowerCase()))}>{s}</button>
          ))}
        </div>
      </div>
      <div className="h-px bg-[#E1E8EC]" />
      <div className="p-4 flex flex-col gap-3">
        <span className="font-bold text-[14px] text-[#1C1C1C]">Jenis Kerawanan</span>
        <div className="flex flex-wrap gap-2">
          {JENIS_CHIPS.map(j => (
            <button key={j.id} onClick={() => toggle('jenis', j.id)} style={chip(!!filters.jenis?.includes(j.id))}>{j.label}</button>
          ))}
        </div>
      </div>
      <div className="h-px bg-[#E1E8EC]" />
      <div className="p-4 flex flex-col gap-3">
        <span className="font-bold text-[14px] text-[#1C1C1C]">Status Sertifikat</span>
        <div className="flex flex-wrap gap-2">
          {SERTIFIKAT_CHIPS.map(s => (
            <button key={s.id} onClick={() => toggle('certified', s.id)} style={chip(!!filters.certified?.includes(s.id))}>{s.label}</button>
          ))}
        </div>
      </div>
    </>
  )

  /* ── Mobile: bottom sheet ── */
  if (isMobile) {
    return (
      <>
        <div
          className={`fixed inset-0 bg-black/40 transition-opacity duration-300 ${open ? 'opacity-100 z-[65] pointer-events-auto' : 'opacity-0 z-[-1] pointer-events-none'}`}
          onClick={onClose}
        />
        <div className={`fixed left-0 right-0 bottom-0 z-[70] max-h-[88vh] bg-white rounded-t-2xl transition-transform duration-300 flex flex-col ${open ? 'translate-y-0' : 'translate-y-full'}`}>
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-2 shrink-0">
            <div className="w-10 h-1 rounded-sm bg-[#D1D9E0]" />
          </div>
          {/* Header */}
          <div className="flex items-center justify-between px-4 pb-3.5 border-b border-[#E1E8EC] shrink-0">
            <span className="font-bold text-base text-[#1C1C1C]">Filter</span>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-[#F6F9FC] flex items-center justify-center text-[#5F737F]">
              <X size={16} />
            </button>
          </div>
          {/* Body */}
          <div className="flex-1 overflow-y-auto">{sections}</div>
          {/* Footer */}
          <div className="px-4 pt-3 pb-6 border-t border-[#E1E8EC] shrink-0 flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 h-11 rounded-[22px] border-none bg-[#076c9e] text-white font-semibold text-[14px] cursor-pointer"
            >
              Terapkan
            </button>
            <button
              onClick={onReset}
              title="Reset filter"
              className="w-11 h-11 rounded-full border border-[#D92D20] bg-white flex items-center justify-center cursor-pointer shrink-0"
            >
              <RotateCcw size={18} className="text-[#D92D20]" />
            </button>
          </div>
        </div>
      </>
    )
  }

  /* ── Desktop: dropdown popover ── */
  if (!open) return null
  return (
    <>
      <div className="fixed inset-0 z-[60]" onClick={onClose} />
      <div className="absolute top-full right-0 mt-2 w-[400px] z-[70] bg-white rounded-lg shadow-[0px_4px_8px_0px_rgba(28,28,28,0.15)] border border-[#E1E8EC] flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#E1E8EC]">
          <span className="font-bold text-[14px] text-[#1C1C1C]">Filter</span>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors"><X size={16} className="text-[#5F737F]" /></button>
        </div>
        <div className="max-h-[500px] overflow-y-auto">{sections}</div>
        <div className="px-4 pt-3 pb-4 border-t border-[#E1E8EC] flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-[22px] border-none bg-[#076c9e] text-white font-semibold text-[14px] cursor-pointer hover:bg-[#065a84] transition-colors"
          >
            Terapkan
          </button>
          <button
            onClick={onReset}
            title="Reset filter"
            className="w-11 h-11 rounded-full border border-[#D92D20] bg-white flex items-center justify-center cursor-pointer shrink-0 hover:bg-red-50 transition-colors"
          >
            <RotateCcw size={18} className="text-[#D92D20]" />
          </button>
        </div>
      </div>
    </>
  )
}

function AsetDetailDrawer({
  towerId,
  open,
  onClose,
  onEdit,
  canEdit,
}: {
  towerId: string | null
  open: boolean
  onClose: () => void
  onEdit: (tower: any) => void
  canEdit: boolean
}) {
  const [tower, setTower] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<any>(null)
  const [confirm, setConfirm] = useState<{ open: boolean; docId: string | null; loading: boolean }>({
    open: false,
    docId: null,
    loading: false
  })

  const loadTower = useCallback(() => {
    if (!towerId) return
    setLoading(true)
    asetApi.getTowerById(towerId)
      .then((res) => setTower(res.data))
      .catch(() => toast.error('Gagal memuat detail aset'))
      .finally(() => setLoading(false))
  }, [towerId])

  useEffect(() => {
    if (!open || !towerId) { setTower(null); return }
    loadTower()
  }, [open, towerId, loadTower])

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-[2px] transition-opacity duration-300" onClick={onClose} />
      <div className={`fixed top-0 right-0 bottom-0 w-full max-w-[460px] z-50 bg-white shadow-2xl flex flex-col overflow-hidden transition-transform duration-300 transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
           <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">Detail Aset Transmisi</h2>
           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors group">
             <X size={20} className="text-gray-500 group-hover:text-gray-700" />
           </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-gray-50/40">
           {loading ? (
             <div className="flex-1 flex items-center justify-center py-20">
               <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
             </div>
           ) : !tower ? (
             <p className="text-gray-400 text-center mt-10">Data tidak ditemukan</p>
           ) : (
             <>
               {/* INFORMASI TOWER */}
               <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                 <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Informasi Aset Transmisi</h3>
                 <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                    <LabelValue label="Nama Aset" value={tower.nama} weight="bold" />
                    <LabelValue label="Tipe" value={tower.tipe} weight="bold" />
                    <LabelValue label="Tegangan" value={tower.tegangan} weight="bold" />
                    <LabelValue label="Radius Deteksi (m)" value={tower.radius} weight="bold" />
                    <div className="flex flex-col gap-0.5">
                       <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Status Sertifikat</span>
                       <div className="mt-1">
                          <StatusBadge status={tower.hasCertificate ? 'Bersertifikat' : 'Tidak Bersertifikat'} text={tower.hasCertificate ? 'Bersertifikat' : 'Tidak Bersertifikat'} />
                       </div>
                    </div>
                 </div>
               </div>

               <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                 <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Informasi Kerawanan</h3>
                 <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                    <LabelValue label="Jenis Kerawanan" value={tower.jenisKerawanan ? formatJenis(tower.jenisKerawanan) : 'Tidak Ada'} weight="bold" />
                    <div>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Status Kerawanan</p>
                       <StatusBadge status={tower.statusKerawanan} />
                    </div>
                 </div>
               </div>

               {/* LOKASI */}
               <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                 <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Lokasi</h3>
                 <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                    <LabelValue label="Latitude" value={tower.lat} weight="bold" />
                    <LabelValue label="Longitude" value={tower.lng} weight="bold" />
                    <div className="col-span-2">
                       <LabelValue label="Lokasi" value={tower.lokasi} weight="bold" />
                    </div>
                 </div>
               </div>

               {/* INFORMASI JALUR */}
               <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                 <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Informasi Jalur</h3>
                 <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                    <LabelValue label="Nomor Urut Dalam Jalur" value={tower.nomorUrut} weight="bold" />
                    <LabelValue label="Jalur Transmisi" value={tower.route?.nama ?? tower.jalur} weight="bold" />
                 </div>
               </div>
               
               {/* Sertifikat Section */}
               <div className="flex flex-col gap-3">
                  <h3 className="text-[14px] font-bold text-gray-800">Sertifikat</h3>
                  {(tower.sertifikat ?? []).length === 0 ? (
                    <div className="bg-white rounded-xl border border-dashed border-gray-200 p-8 text-center">
                       <FileText className="mx-auto text-gray-300 mb-2" size={32} />
                       <p className="text-[13px] text-gray-400 font-medium">Tidak ada sertifikat tersedia</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {(tower.sertifikat ?? []).map((cert: any) => (
                          (cert.dokumen ?? []).map((doc: any) => (
                            <div 
                              key={doc.id} 
                              onClick={() => setSelectedDoc(doc)}
                              className="group bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                            >
                                <div className="aspect-[4/3] bg-blue-50/30 flex items-center justify-center p-6 group-hover:bg-blue-50 transition-colors relative">
                                   <FileText className="text-blue-500 w-12 h-12 transition-transform duration-300 group-hover:scale-110" />
                                   <div className="absolute inset-0 flex items-center justify-center bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors" />
                                </div>
                                 <div className="p-3.5 border-t border-gray-50 flex items-center justify-between gap-2">
                                    <p className="text-[11.5px] font-bold text-gray-700 truncate" title={doc.namaFile}>{doc.namaFile}</p>
                                    {canEdit && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setConfirm({ open: true, docId: doc.id, loading: false })
                                        }}
                                        className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors shrink-0"
                                      >
                                         <Trash2 size={14} />
                                      </button>
                                    )}
                                 </div>
                            </div>
                          ))
                      ))}
                    </div>
                  )}
               </div>

               {/* Riwayat Kerawanan Section */}
               <div className="flex flex-col gap-3">
                  <h3 className="text-[14px] font-bold text-gray-800">Riwayat Kerawanan</h3>
                  {(tower.laporan ?? []).length === 0 ? (
                    <div className="bg-white rounded-xl border border-dashed border-gray-200 p-6 text-center">
                       <p className="text-[13px] text-gray-400">Belum ada riwayat kerawanan</p>
                    </div>
                  ) : (
                    <>
                      {/* Summary chips per jenis */}
                      <div className="flex flex-wrap gap-2 mb-1">
                         {Object.entries(
                           (tower.laporan as any[]).reduce((acc: Record<string, number>, l: any) => {
                             acc[l.jenisGangguan] = (acc[l.jenisGangguan] ?? 0) + 1
                             return acc
                           }, {})
                         ).map(([jenis, count]) => (
                           <span key={jenis} className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold">
                             {formatJenis(jenis)} · {count as number}
                           </span>
                         ))}
                      </div>
                      {/* Top-5 entry terbaru */}
                      <div className="flex flex-col gap-2">
                         {(tower.laporan as any[]).slice(0, 5).map((l: any) => (
                           <div key={l.id} className="bg-white border border-gray-100 rounded-lg p-3">
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                 <span className="text-[12px] font-bold text-gray-800">{formatJenis(l.jenisGangguan)}</span>
                                 <span className="text-[11px] text-gray-400">{formatTanggal(l.tanggal)}</span>
                              </div>
                              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                 <LevelChip level={l.levelRisiko} />
                                 <ProgresChip progres={l.progresLaporan} />
                              </div>
                              {l.deskripsi && (
                                <p className="text-[12px] text-gray-600 line-clamp-2">{l.deskripsi}</p>
                              )}
                           </div>
                         ))}
                      </div>
                      {(tower.laporan as any[]).length > 5 && (
                         <p className="text-[11px] text-gray-400 text-center">+{(tower.laporan as any[]).length - 5} riwayat lainnya</p>
                      )}
                    </>
                  )}
               </div>
             </>
           )}
        </div>

        <ConfirmModal 
          open={confirm.open}
          title="Hapus File"
          message="Apakah Anda yakin ingin menghapus file sertifikat ini? Tindakan ini tidak dapat dibatalkan."
          isLoading={confirm.loading}
          onClose={() => setConfirm({ ...confirm, open: false })}
          onConfirm={async () => {
            if (!confirm.docId) return
            setConfirm({ ...confirm, loading: true })
            try {
              await sertifikatApi.deleteDokumen(confirm.docId)
              toast.success('File dihapus')
              loadTower()
              setConfirm({ open: false, docId: null, loading: false })
            } catch {
              toast.error('Gagal menghapus file')
              setConfirm({ ...confirm, loading: false })
            }
          }}
        />

        {/* Footer */}
        {canEdit && (
          <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
             <button
               onClick={() => onEdit(tower)}
               className="w-full py-3.5 rounded-xl border-2 border-blue-600 text-blue-600 font-bold text-[14px] hover:bg-blue-50 transition-colors"
             >
               Edit Detail Aset
             </button>
          </div>
        )}
      </div>

      <CertificatePreviewModal doc={selectedDoc} onClose={() => setSelectedDoc(null)} />
    </>
  )
}

// ── Edit Drawer ───────────────────────────────────────────────────────────────

const TIPE_EDIT_OPTIONS    = ['SUTET', 'SUTT', 'SKTT', 'garduInduk']

function AsetEditDrawer({
  tower,
  open,
  onClose,
  onSaved,
}: {
  tower: any | null
  open: boolean
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState<any>({})
  const [saving, setSaving] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  
  // Certificate list from backend
  const [certs, setCerts] = useState<any[]>([])

  const fetchCerts = useCallback(async () => {
    if (!tower?.id) return
    try {
      const res = await sertifikatApi.getByTower(tower.id)
      setCerts(res.data)
    } catch {}
  }, [tower?.id])

  useEffect(() => {
    if (open && tower) {
      setForm({
        nama:      tower.nama     ?? '',
        tegangan:  tower.tegangan ?? '',
        tipe:      tower.tipe     ?? '',
        lokasi:    tower.lokasi   ?? '',
        lat:       tower.lat      ?? '',
        lng:       tower.lng      ?? '',
        radius:    tower.radius   ?? 100,
        jalur:     tower.jalur    ?? '',
        nomorUrut: tower.nomorUrut ?? '',
        hasCertificate:  tower.hasCertificate  ?? false,
      })
      setFiles([])
      fetchCerts()
    }
  }, [open, tower, fetchCerts])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!tower?.id) return
    setSaving(true)
    try {
      const fd = new FormData()
      Object.keys(form).forEach(key => {
        if (form[key] !== undefined && form[key] !== null) fd.append(key, form[key])
      })
      files.forEach(f => fd.append('files', f))

      await towersApi.update(tower.id, fd)
      toast.success('Data aset berhasil diperbarui')
      onSaved()
      onClose()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Gagal menyimpan perubahan')
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }))

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-[460px] z-50 bg-white shadow-2xl flex flex-col overflow-hidden transition-transform duration-300 transform translate-x-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
           <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">Edit Detail Aset Transmisi</h2>
           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors group">
             <X size={20} className="text-gray-500 group-hover:text-gray-700" />
           </button>
        </div>

        {/* Body */}
        <form id="edit-tower-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-gray-50/40">
           {/* INFORMASI TOWER */}
           <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
             <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Informasi Aset Transmisi</h3>
             
             <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-gray-700">Nama Aset</label>
                <input className="form-input rounded-xl" value={form.nama} onChange={e => set('nama', e.target.value)} placeholder="Nama tower" required />
             </div>

             <div className="grid grid-cols-2 gap-4">
                <CustomSelect label="Tipe" value={form.tipe} onChange={v => set('tipe', v)} options={TIPE_EDIT_OPTIONS} />
                <div className="flex flex-col gap-1.5">
                   <label className="text-[12px] font-bold text-gray-700">Tegangan</label>
                   <input className="form-input rounded-xl" value={form.tegangan} onChange={e => set('tegangan', e.target.value)} placeholder="150kV" />
                </div>
             </div>

             <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-1.5">
                   <label className="text-[12px] font-bold text-gray-700">Radius Deteksi (m)</label>
                   <input className="form-input rounded-xl" type="number" value={form.radius} onChange={e => set('radius', Number(e.target.value))} />
                </div>
             </div>
           </div>

           {/* LOKASI */}
           <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
             <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Lokasi</h3>
             <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                   <label className="text-[12px] font-bold text-gray-700">Latitude</label>
                   <input className="form-input rounded-xl" type="number" step="any" value={form.lat} onChange={e => set('lat', e.target.value)} placeholder="-6.16597" required />
                </div>
                <div className="flex flex-col gap-1.5">
                   <label className="text-[12px] font-bold text-gray-700">Longitude</label>
                   <input className="form-input rounded-xl" type="number" step="any" value={form.lng} onChange={e => set('lng', e.target.value)} placeholder="106.54899" required />
                </div>
             </div>
             <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-gray-700">Lokasi</label>
                <textarea className="form-input rounded-xl min-h-[80px]" value={form.lokasi} onChange={e => set('lokasi', e.target.value)} placeholder="Alamat lengkap lokasi aset..." />
             </div>
           </div>

           {/* JALUR */}
           <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
             <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Informasi Jalur</h3>
             <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                   <label className="text-[12px] font-bold text-gray-700">Nomor Urut</label>
                   <input className="form-input rounded-xl" type="number" value={form.nomorUrut} onChange={e => set('nomorUrut', Number(e.target.value))} placeholder="1" />
                </div>
                <div className="flex flex-col gap-1.5">
                   <label className="text-[12px] font-bold text-gray-700">Jalur Transmisi</label>
                   <input className="form-input rounded-xl" value={form.jalur} onChange={e => set('jalur', e.target.value)} placeholder="KMBG - DKSMI" />
                </div>
             </div>
           </div>

           {/* STATUS SERTIFIKAT */}
           <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-center justify-between">
              <div>
                 <p className="text-[13px] font-bold text-gray-800">Status Sertifikat</p>
                 <p className="text-[11px] text-gray-400 font-medium">Aktifkan jika tower memiliki sertifikat</p>
              </div>
              <button 
                type="button"
                onClick={() => set('hasCertificate', !form.hasCertificate)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${form.hasCertificate ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.hasCertificate ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
           </div>

           {/* SERTIFIKAT FILES */}
           <div className="flex flex-col gap-3 pb-4">
              <div className="flex items-center justify-between">
                 <h3 className="text-[14px] font-bold text-gray-800">Sertifikat</h3>
                 <label className="cursor-pointer text-[12px] font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1.5">
                    <Plus size={14} />
                    Tambah Sertifikat
                    <input type="file" multiple className="hidden" onChange={e => setFiles(prev => [...prev, ...Array.from(e.target.files || [])])} />
                 </label>
              </div>

              {/* Selected Files Grid */}
              <div className="grid grid-cols-2 gap-3">
                 {files.map((f, i) => (
                    <div key={i} className="bg-white border border-blue-100 rounded-xl overflow-hidden shadow-sm relative group">
                        <div className="aspect-[4/3] bg-blue-50/50 flex items-center justify-center p-4">
                           <FileText className="text-blue-500 w-10 h-10" />
                        </div>
                        <div className="p-2.5 border-t border-blue-50 bg-white">
                           <p className="text-[10px] font-bold text-gray-700 truncate pr-4">{f.name}</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))}
                          className="absolute top-2 right-2 p-1 bg-white/80 backdrop-blur-sm rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                           <X size={12} />
                        </button>
                    </div>
                 ))}
                 
                 {/* Existing Files */}
                 {certs.map(cert => cert.dokumen.map((doc: any) => (
                    <div key={doc.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm opacity-60">
                        <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center p-4">
                           <FileText className="text-gray-400 w-10 h-10" />
                        </div>
                        <div className="p-2.5 border-t border-gray-50">
                           <p className="text-[10px] font-bold text-gray-500 truncate">{doc.namaFile}</p>
                        </div>
                    </div>
                 )))}
              </div>
           </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
           <button 
             form="edit-tower-form"
             type="submit"
             disabled={saving}
             className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-[14px] hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50"
           >
             {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
           </button>
        </div>
      </div>
    </>
  )
}

// ── Add Drawer ────────────────────────────────────────────────────────────────


function AsetAddDrawer({
  open,
  onClose,
  onSaved,
}: {
  open: boolean
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState<any>({
    nama: '',
    tipe: 'SUTT',
    tegangan: '150kV',
    lat: '',
    lng: '',
    lokasi: '',
    radius: 100,
    jalur: '',
    nomorUrut: '',
    hasCertificate: false,
  })
  const [saving, setSaving] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nama || !form.lat || !form.lng) {
      return toast.error('Harap isi field yang wajib')
    }
    setSaving(true)
    try {
      const fd = new FormData()
      Object.keys(form).forEach(key => {
        if (form[key] !== undefined && form[key] !== null) fd.append(key, form[key])
      })
      files.forEach(f => fd.append('files', f))

      await towersApi.create(fd)
      toast.success('Aset Transmisi berhasil ditambahkan')
      onSaved()
      onClose()
      setForm({
        nama: '', tipe: 'SUTT', tegangan: '150kV',
        lat: '', lng: '', lokasi: '', radius: 100, jalur: '', nomorUrut: '',
        hasCertificate: false
      })
      setFiles([])
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Gagal menambahkan aset')
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }))

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-[460px] z-50 bg-white shadow-2xl flex flex-col overflow-hidden transition-transform duration-300 transform translate-x-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
           <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">Tambah Aset Transmisi Baru</h2>
           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><X size={20} className="text-gray-500" /></button>
        </div>

        {/* Body */}
        <form id="add-tower-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-gray-50/40">
           {/* INFORMASI TOWER */}
           <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
             <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Informasi Aset Transmisi</h3>

             <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-gray-700">Nama Aset</label>
                <input className="form-input rounded-xl" value={form.nama} onChange={e => set('nama', e.target.value)} placeholder="cth: SUTT KEMBANGAN TX9" required />
             </div>

             <div className="grid grid-cols-2 gap-4">
                <CustomSelect label="Tipe" value={form.tipe} onChange={v => set('tipe', v)} options={TIPE_EDIT_OPTIONS} />
                <div className="flex flex-col gap-1.5">
                   <label className="text-[12px] font-bold text-gray-700">Tegangan</label>
                   <input className="form-input rounded-xl" value={form.tegangan} onChange={e => set('tegangan', e.target.value)} placeholder="150kV" />
                </div>
             </div>

             <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-1.5">
                   <label className="text-[12px] font-bold text-gray-700">Radius Deteksi (m)</label>
                   <input className="form-input rounded-xl" type="number" value={form.radius} onChange={e => set('radius', Number(e.target.value))} />
                </div>
             </div>
           </div>

           {/* LOKASI */}
           <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
             <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Lokasi</h3>
             <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                   <label className="text-[12px] font-bold text-gray-700">Latitude</label>
                   <input className="form-input rounded-xl" type="number" step="any" value={form.lat} onChange={e => set('lat', e.target.value)} placeholder="-6.16597" required />
                </div>
                <div className="flex flex-col gap-1.5">
                   <label className="text-[12px] font-bold text-gray-700">Longitude</label>
                   <input className="form-input rounded-xl" type="number" step="any" value={form.lng} onChange={e => set('lng', e.target.value)} placeholder="106.54899" required />
                </div>
             </div>
             <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-gray-700">Lokasi</label>
                <textarea className="form-input rounded-xl min-h-[80px]" value={form.lokasi} onChange={e => set('lokasi', e.target.value)} placeholder="Alamat lengkap lokasi aset..." />
             </div>
           </div>

           {/* JALUR */}
           <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
             <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Informasi Jalur</h3>
             <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                   <label className="text-[12px] font-bold text-gray-700">Nomor Urut</label>
                   <input className="form-input rounded-xl" type="number" value={form.nomorUrut} onChange={e => set('nomorUrut', Number(e.target.value))} placeholder="1" />
                </div>
                <div className="flex flex-col gap-1.5">
                   <label className="text-[12px] font-bold text-gray-700">Jalur Transmisi</label>
                   <input className="form-input rounded-xl" value={form.jalur} onChange={e => set('jalur', e.target.value)} placeholder="KMBG - DKSMI" />
                </div>
             </div>
           </div>

           {/* STATUS SERTIFIKAT */}
           <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-center justify-between">
              <div>
                 <p className="text-[13px] font-bold text-gray-800">Status Sertifikat</p>
                 <p className="text-[11px] text-gray-400 font-medium">Aktifkan jika tower memiliki sertifikat</p>
              </div>
              <button 
                type="button"
                onClick={() => set('hasCertificate', !form.hasCertificate)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${form.hasCertificate ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.hasCertificate ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
           </div>

           {/* SERTIFIKAT FILES */}
           <div className="flex flex-col gap-3 pb-4">
              <div className="flex items-center justify-between">
                 <h3 className="text-[14px] font-bold text-gray-800">Sertifikat</h3>
                 <label className="cursor-pointer text-[12px] font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1.5">
                    <Plus size={14} />
                    Tambah Sertifikat
                    <input type="file" multiple className="hidden" onChange={e => setFiles(prev => [...prev, ...Array.from(e.target.files || [])])} />
                 </label>
              </div>

              {/* Selected Files Grid */}
              <div className="grid grid-cols-2 gap-3">
                 {files.map((f, i) => (
                    <div key={i} className="bg-white border border-blue-100 rounded-xl overflow-hidden shadow-sm relative group">
                        <div className="aspect-[4/3] bg-blue-50/50 flex items-center justify-center p-4">
                           <FileText className="text-blue-500 w-10 h-10" />
                        </div>
                        <div className="p-2.5 border-t border-blue-50 bg-white">
                           <p className="text-[10px] font-bold text-gray-700 truncate pr-4">{f.name}</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))}
                          className="absolute top-2 right-2 p-1 bg-white/80 backdrop-blur-sm rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                           <X size={12} />
                        </button>
                    </div>
                 ))}
                 
                 {files.length === 0 && (
                   <div className="col-span-2 py-8 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center bg-white">
                      <Upload className="text-gray-200 mb-2" size={32} />
                      <p className="text-[12px] text-gray-400 font-medium text-center px-6">Upload file sertifikat (.jpg, .png, .pdf)</p>
                   </div>
                 )}
              </div>
           </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
           <button 
             form="add-tower-form"
             type="submit"
             disabled={saving}
             className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-[14px] hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50"
           >
             {saving ? 'Menambahkan...' : 'Tambah Tower'}
           </button>
        </div>
      </div>
    </>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AsetPage() {
  const { isMobile } = useSidebar()
  const [rows, setRows]       = useState<any[]>([])
  const [total, setTotal]     = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [tipe, setTipe]     = useState('')
  const [page, setPage]     = useState(1)
  const [limit, setLimit]   = useState(10)

  const [filterOpen, setFilterOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<any>({
    tipe: [],
    status: [],
    jenis: [],
    certified: []
  })

  const [isAdminUser, setIsAdminUser] = useState(false)
  useEffect(() => { setIsAdminUser(isAdminOrSuperadmin()) }, [])

  const [skttRoutes, setSkttRoutes] = useState<any[]>([])
  useEffect(() => {
    jalurKmlApi.getAll().then((r) => {
      const all = r.data?.data ?? []
      setSkttRoutes(all.filter((j: any) => j.tipe === 'SKTT'))
    }).catch(() => {})
  }, [])

  // Detail drawer
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailRow, setDetailRow]   = useState<any>(null)

  // Add drawer
  const [addOpen, setAddOpen]     = useState(false)

  // Edit drawer
  const [editOpen, setEditOpen]   = useState(false)
  const [editRow, setEditRow]     = useState<any>(null)

  const [confirm, setConfirm] = useState<{ open: boolean; route: any | null; loading: boolean }>({
    open: false,
    route: null,
    loading: false
  })

  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; tower: any | null; loading: boolean }>({
    open: false,
    tower: null,
    loading: false
  })

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [q, setQ] = useState('')
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setQ(search), 350)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [search])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await towersApi.getAll({
        page, limit,
        search: q || undefined,
        tipe: activeFilters.tipe.length ? activeFilters.tipe.join(',') : undefined,
        status: activeFilters.status.length ? activeFilters.status.join(',') : undefined,
        kerawanan_type: activeFilters.jenis.length ? activeFilters.jenis.join(',') : undefined,
        hasCertificate: activeFilters.certified.length === 1 ? activeFilters.certified[0] : undefined
      })
      const p = res.data
      if (Array.isArray(p)) { setRows(p); setTotal(p.length) }
      else { setRows(p.data ?? []); setTotal(p.total ?? 0) }
    } catch {
      setRows([]); setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [page, limit, q, activeFilters])

  useEffect(() => { fetchData() }, [fetchData])

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-app-text tracking-tight">Data Aset Transmisi</h1>
        {isAdminUser && (
          <button onClick={() => setAddOpen(true)} className="btn-primary flex items-center gap-2 rounded-xl px-5 py-2.5">
            <Plus size={18} /> Tambah Aset Transmisi
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 shadow-sm flex items-center gap-4">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Cari nama aset..." />
     
         <div className="relative">
            <button 
              onClick={() => setFilterOpen(!filterOpen)}
              className={`h-11 px-3 rounded-xl border-2 flex items-center gap-2.5 transition-all font-bold text-[13px] ${
                Object.values(activeFilters).flat().length > 0 
                  ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-md shadow-blue-600/5' 
                  : 'border-gray-100 hover:border-gray-200 text-gray-500 bg-gray-50/30'
              }`}
            >
               <SlidersHorizontal size={18} />
               {Object.values(activeFilters).flat().length > 0 && (
                 <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                   {Object.values(activeFilters).flat().length}
                 </span>
               )}
            </button>

            <FilterPopover
              open={filterOpen}
              onClose={() => setFilterOpen(false)}
              filters={activeFilters}
              onApply={(newFilters) => { setActiveFilters(newFilters); setPage(1); }}
              onReset={() => { setActiveFilters({ tipe: [], status: [], jenis: [], certified: [] }); setPage(1); }}
              isMobile={isMobile}
            />
         </div>
      </div>

      {/* Unified Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest w-12">No</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Nama</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Tipe</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Tegangan</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Jalur Transmisi</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Sertifikat</th>
                <th className="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <SkeletonRow cols={7} rows={limit} />
              ) : rows.length === 0 ? (
                <tr><td colSpan={7}><EmptyState title="Belum ada data aset." /></td></tr>
              ) : (
                rows.map((row, i) => (
                  <tr 
                    key={`tower-${row.id}`} 
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4 text-gray-400 text-[12px]">{(page - 1) * limit + i + 1}</td>
                    <td className="px-6 py-4 font-bold text-gray-800">{row.nama ?? '—'}</td>
                    <td className="px-6 py-4 text-gray-600 text-[13px]">{row.tipe ?? '—'}</td>
                    <td className="px-6 py-4 font-mono text-[12px] text-gray-500">{row.tegangan ?? '—'}</td>
                    <td className="px-6 py-4 text-gray-500 text-[12px] max-w-[160px] truncate" title={row.jalur ?? ''}>{row.jalur ?? '—'}</td>
                    <td className="px-6 py-4">
                       {row.hasCertificate ? (
                         <div className="flex items-center gap-1.5 text-emerald-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[11px] font-bold uppercase tracking-wide">Bersertifikat</span>
                         </div>
                       ) : (
                         <div className="flex items-center gap-1.5 text-gray-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                            <span className="text-[11px] font-bold uppercase tracking-wide">Belum Bersertifikat</span>
                         </div>
                       )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ActionMenu items={[
                        { label: 'Lihat Detail', icon: <Eye size={14} />, onClick: () => { setDetailRow(row); setDetailOpen(true) } },
                        ...(isAdminUser ? [
                          { label: 'Edit', icon: <Pencil size={14} />, onClick: () => { setEditRow(row); setEditOpen(true) } },
                          { label: 'Hapus', icon: <Trash2 size={14} />, onClick: () => setDeleteConfirm({ open: true, tower: row, loading: false }), danger: true, dividerBefore: true },
                        ] : []),
                      ]} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination total={total} page={page} limit={limit} onChange={setPage} onLimitChange={setLimit} />
      </div>

      {/* SKTT Routes Section */}
      {/* {skttRoutes.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4 px-2">
             <h2 className="text-[16px] font-bold text-gray-800 flex items-center gap-2">
               Data Jalur SKTT
               <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md text-[11px]">{skttRoutes.length} Rute</span>
             </h2>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest w-12">No</th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Nama Rute</th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Titik Koordinat</th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Tanggal Import</th>
                    {isAdminUser && <th className="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {skttRoutes.map((route: any, i: number) => (
                    <tr key={route.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-gray-400 text-[12px]">{i + 1}</td>
                      <td className="px-6 py-4 font-bold text-gray-800">{route.nama}</td>
                      <td className="px-6 py-4 text-gray-500 text-[12px]">{Array.isArray(route.path) ? route.path.length : 0} Titik</td>
                      <td className="px-6 py-4 text-gray-500 text-[12px]">{route.createdAt ? new Date(route.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                      {isAdminUser && (
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setConfirm({ open: true, route, loading: false })}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide"
                          >
                            <Trash2 size={14} /> Hapus
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )} */}

      <AsetAddDrawer open={addOpen} onClose={() => setAddOpen(false)} onSaved={fetchData} />
      <AsetDetailDrawer
        towerId={detailRow?.id ?? null}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onEdit={(row) => { setDetailOpen(false); setEditRow(row); setEditOpen(true); }}
        canEdit={isAdminUser}
      />
      <AsetEditDrawer tower={editRow} open={editOpen} onClose={() => setEditOpen(false)} onSaved={fetchData} />

      <ConfirmModal 
        open={confirm.open}
        title="Hapus Rute SKTT"
        message={`Apakah Anda yakin ingin menghapus rute "${confirm.route?.nama}"? Seluruh data terkait rute ini akan hilang.`}
        isLoading={confirm.loading}
        onClose={() => setConfirm({ ...confirm, open: false })}
        onConfirm={async () => {
          if (!confirm.route) return
          setConfirm({ ...confirm, loading: true })
          try {
            await jalurKmlApi.remove(confirm.route.id)
            setSkttRoutes((prev) => prev.filter((r) => r.id !== confirm.route.id))
            toast.success('Rute SKTT dihapus')
            setConfirm({ open: false, route: null, loading: false })
          } catch {
            toast.error('Gagal menghapus rute')
            setConfirm({ ...confirm, loading: false })
          }
        }}
      />

      <ConfirmModal 
        open={deleteConfirm.open}
        title="Hapus Aset Transmisi"
        message={`Apakah Anda yakin ingin menghapus aset "${deleteConfirm.tower?.nama}"? Seluruh data terkait aset ini akan hilang.`}
        isLoading={deleteConfirm.loading}
        onClose={() => setDeleteConfirm({ ...deleteConfirm, open: false })}
        onConfirm={async () => {
          if (!deleteConfirm.tower) return
          setDeleteConfirm({ ...deleteConfirm, loading: true })
          try {
            await towersApi.delete(deleteConfirm.tower.id)
            toast.success('Aset berhasil dihapus')
            setDeleteConfirm({ open: false, tower: null, loading: false })
            fetchData()
          } catch {
            toast.error('Gagal menghapus aset')
            setDeleteConfirm({ ...deleteConfirm, loading: false })
          }
        }}
      />
    </>
  )
}
