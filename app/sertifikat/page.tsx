'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Download, Upload, X, FileText } from 'lucide-react'
import { sertifikatApi } from '@/lib/api'
import { isAdmin } from '@/lib/auth'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { EmptyState } from '@/components/ui/EmptyState'

const TIPE_TABS = ['Semua', 'Kelayakan', 'Grounding', 'Konstruksi', 'K3', 'Lingkungan']
const STATUS_FILTER = ['Semua', 'Valid', 'Expired']

// ── Tambah modal ──────────────────────────────────────────────────────────────

function TambahModal({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ towerId: '', tipe: 'Kelayakan', nomor: '', berlakuHingga: '', keterangan: '' })
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.towerId) { toast.error('ID Tower wajib diisi'); return }
    setSaving(true)
    try {
      const res = await sertifikatApi.create(form)
      if (file) await sertifikatApi.uploadFile(res.data.id, file)
      toast.success('Sertifikat berhasil ditambahkan')
      onSaved(); onClose()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Gagal menyimpan')
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[480px] flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-app-border">
          <h2 className="text-[15px] font-bold text-app-text">Tambah Sertifikat</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-app-bg text-app-muted"><X size={18} /></button>
        </div>
        <form id="sert-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">ID Tower <span className="text-red-500">*</span></label>
            <input type="text" value={form.towerId} onChange={(e) => set('towerId', e.target.value)} className="form-input" placeholder="Nomor tower" />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Tipe Sertifikat</label>
            <select value={form.tipe} onChange={(e) => set('tipe', e.target.value)} className="form-input">
              {TIPE_TABS.filter((t) => t !== 'Semua').map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Nomor Sertifikat</label>
            <input type="text" value={form.nomor} onChange={(e) => set('nomor', e.target.value)} className="form-input" />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Berlaku Hingga</label>
            <input type="date" value={form.berlakuHingga} onChange={(e) => set('berlakuHingga', e.target.value)} className="form-input" />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Upload PDF</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-app-border rounded-xl py-6 flex flex-col items-center gap-1.5 cursor-pointer hover:border-blue-300 hover:bg-app-bg transition-colors"
            >
              <Upload size={20} className="text-app-muted" />
              <p className="text-[13px] text-app-muted">{file ? file.name : 'Klik untuk upload PDF'}</p>
            </div>
            <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Keterangan</label>
            <textarea rows={3} value={form.keterangan} onChange={(e) => set('keterangan', e.target.value)} className="form-input resize-none" />
          </div>
        </form>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-app-border">
          <button type="button" onClick={onClose} className="btn-outline">Batal</button>
          <button type="submit" form="sert-form" disabled={saving} className="btn-primary">
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Sertifikat card ───────────────────────────────────────────────────────────

function SertifikatCard({ item, onDelete }: { item: any; onDelete: (id: string) => void }) {
  const expired = item.status?.toLowerCase() === 'expired' ||
    (item.berlakuHingga && new Date(item.berlakuHingga) < new Date())
  const berlakuFmt = item.berlakuHingga
    ? new Date(item.berlakuHingga).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—'

  return (
    <div className="card overflow-hidden">
      <div className={`h-1.5 w-full ${expired ? 'bg-red-400' : 'bg-blue-500'}`} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-[11px] font-bold text-app-muted uppercase tracking-wider mb-0.5">{item.tipe ?? '—'}</p>
            <p className="text-[14px] font-bold text-app-text">{item.nomor ?? 'Tanpa Nomor'}</p>
          </div>
          <span className={expired ? 'badge-berlangsung' : 'badge-selesai'}>
            {expired ? 'Expired' : 'Valid'}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-1">
          <FileText size={13} className="text-app-muted shrink-0" />
          <span className="font-mono text-[12px] text-blue-600">{item.tower?.nomorTower ?? item.towerId ?? '—'}</span>
        </div>
        <p className="text-[12px] text-app-muted">Berlaku hingga: <span className="text-app-text font-medium">{berlakuFmt}</span></p>

        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-app-border">
          {item.fileUrl ? (
            <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="btn-outline text-[12px] py-1.5 px-3 gap-1.5">
              <Download size={13} /> Download
            </a>
          ) : (
            <span className="text-[12px] text-app-subtle">Tidak ada file</span>
          )}
          {isAdmin() && (
            <button onClick={() => onDelete(item.id)} className="ml-auto text-[12px] text-red-500 hover:underline">
              Hapus
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SertifikatPage() {
  const [items, setItems]           = useState<any[]>([])
  const [loading, setLoading]       = useState(true)
  const [activeTab, setActiveTab]   = useState('Semua')
  const [statusFil, setStatusFil]   = useState('Semua')
  const [tambahOpen, setTambahOpen] = useState(false)
  const [deleteId, setDeleteId]     = useState<string | null>(null)
  const [deleting, setDeleting]     = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await sertifikatApi.getAll({
        tipe: activeTab === 'Semua' ? undefined : activeTab,
        status: statusFil === 'Semua' ? undefined : statusFil.toLowerCase(),
      })
      setItems(Array.isArray(res.data) ? res.data : (res.data.data ?? []))
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [activeTab, statusFil])

  useEffect(() => { fetchData() }, [fetchData])

  async function confirmDelete() {
    toast.success('Sertifikat dihapus')
    setDeleteId(null)
    fetchData()
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-app-text">Sertifikat</h1>
        {isAdmin() && (
          <button onClick={() => setTambahOpen(true)} className="btn-primary">
            <Plus size={16} /> Tambah Sertifikat
          </button>
        )}
      </div>

      {/* Tabs + filter */}
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <div className="flex gap-1 p-1 bg-app-bg rounded-xl border border-app-border">
          {TIPE_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-white shadow text-blue-600 border border-app-border'
                  : 'text-app-muted hover:text-app-text'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <select
          value={statusFil}
          onChange={(e) => setStatusFil(e.target.value)}
          className="form-input w-auto pr-8"
          style={{ height: 40 }}
        >
          {STATUS_FILTER.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="h-1.5 bg-gray-100 animate-pulse" />
              <div className="p-5 space-y-3">
                {[60, 80, 50, 40].map((w, j) => (
                  <div key={j} className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${w}%` }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="card">
          <EmptyState title="Tidak ada sertifikat" description="Belum ada sertifikat yang sesuai filter." />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {items.map((item) => (
            <SertifikatCard key={item.id} item={item} onDelete={setDeleteId} />
          ))}
        </div>
      )}

      <TambahModal open={tambahOpen} onClose={() => setTambahOpen(false)} onSaved={fetchData} />
      <ConfirmModal
        isOpen={!!deleteId}
        title="Hapus Sertifikat?"
        message="Sertifikat ini akan dihapus permanen beserta file PDF-nya."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
        confirmLabel="Ya, Hapus"
      />
    </>
  )
}
