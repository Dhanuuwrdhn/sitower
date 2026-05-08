'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Eye, Download, Upload, X } from 'lucide-react'
import { asBuiltApi } from '@/lib/api'
import { isAdmin } from '@/lib/auth'
import { ActionMenu } from '@/components/ui/ActionMenu'
import { Pagination } from '@/components/ui/Pagination'
import { SearchInput } from '@/components/ui/SearchInput'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonRow } from '@/components/ui/SkeletonRow'

const TIPE_OPTIONS = ['Semua', 'Sipil', 'Mekanikal', 'Elektrikal', 'Grounding', 'Lainnya']

// ── Form modal ────────────────────────────────────────────────────────────────

function TambahModal({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ towerId: '', namaFile: '', tipe: 'Sipil', tahun: String(new Date().getFullYear()), versi: '1.0', keterangan: '' })
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.towerId || !form.namaFile) { toast.error('Tower dan nama file wajib diisi'); return }
    setSaving(true)
    try {
      const res = await asBuiltApi.create(form)
      if (file) await asBuiltApi.uploadFile(res.data.id, file)
      toast.success('As Built Drawing berhasil ditambahkan')
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
          <h2 className="text-[15px] font-bold text-app-text">Tambah As Built Drawing</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-app-bg text-app-muted"><X size={18} /></button>
        </div>
        <form id="abd-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">ID Tower <span className="text-red-500">*</span></label>
            <input type="text" value={form.towerId} onChange={(e) => set('towerId', e.target.value)} className="form-input" placeholder="Nomor tower" />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Nama File <span className="text-red-500">*</span></label>
            <input type="text" value={form.namaFile} onChange={(e) => set('namaFile', e.target.value)} className="form-input" placeholder="Nama dokumen" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-app-text mb-1.5">Tipe</label>
              <select value={form.tipe} onChange={(e) => set('tipe', e.target.value)} className="form-input">
                {TIPE_OPTIONS.filter((t) => t !== 'Semua').map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-app-text mb-1.5">Tahun</label>
              <input type="number" value={form.tahun} onChange={(e) => set('tahun', e.target.value)} className="form-input" />
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Versi</label>
            <input type="text" value={form.versi} onChange={(e) => set('versi', e.target.value)} className="form-input" placeholder="1.0" />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Upload File</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-app-border rounded-xl py-6 flex flex-col items-center gap-1.5 cursor-pointer hover:border-blue-300 hover:bg-app-bg transition-colors"
            >
              <Upload size={20} className="text-app-muted" />
              <p className="text-[13px] text-app-muted">{file ? file.name : 'Klik untuk upload PDF/DWG'}</p>
            </div>
            <input ref={fileRef} type="file" accept=".pdf,.dwg,.dxf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Keterangan</label>
            <textarea rows={3} value={form.keterangan} onChange={(e) => set('keterangan', e.target.value)} className="form-input resize-none" />
          </div>
        </form>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-app-border">
          <button type="button" onClick={onClose} className="btn-outline">Batal</button>
          <button type="submit" form="abd-form" disabled={saving} className="btn-primary">
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AsBuiltDrawingPage() {
  const [rows, setRows]       = useState<any[]>([])
  const [total, setTotal]     = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [tipe, setTipe]       = useState('')
  const [page, setPage]       = useState(1)
  const [limit, setLimit]     = useState(10)
  const [tambahOpen, setTambahOpen] = useState(false)
  const [deleteId, setDeleteId]     = useState<string | null>(null)
  const [deleting, setDeleting]     = useState(false)

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
      const res = await asBuiltApi.getAll({ page, limit, search: q || undefined, tipe: tipe || undefined })
      const p = res.data
      if (Array.isArray(p)) { setRows(p); setTotal(p.length) }
      else { setRows(p.data ?? []); setTotal(p.total ?? 0) }
    } catch {
      setRows([]); setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [page, limit, q, tipe])

  useEffect(() => { fetchData() }, [fetchData])

  async function confirmDelete() {
    setDeleting(true)
    try {
      toast.success('Dokumen dihapus')
      setDeleteId(null)
      fetchData()
    } catch {
      toast.error('Gagal menghapus')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-app-text">As Built Drawing</h1>
        {isAdmin() && (
          <button onClick={() => setTambahOpen(true)} className="btn-primary">
            <Plus size={16} /> Tambah Dokumen
          </button>
        )}
      </div>

      <div className="card card-body mb-4 flex items-center gap-3 flex-wrap">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Cari nama file atau tower" />
        <select value={tipe} onChange={(e) => { setTipe(e.target.value === 'Semua' ? '' : e.target.value); setPage(1) }} className="form-input w-auto pr-8" style={{ height: 40 }}>
          {TIPE_OPTIONS.map((t) => <option key={t} value={t === 'Semua' ? '' : t}>{t}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tower</th>
                <th>Nama File</th>
                <th>Tipe</th>
                <th>Tahun</th>
                <th>Versi</th>
                <th className="text-right pr-5">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRow cols={6} rows={limit} />
              ) : rows.length === 0 ? (
                <tr><td colSpan={6}><EmptyState /></td></tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id}>
                    <td><span className="font-mono text-[12px] text-blue-600 font-semibold">{row.tower?.nomorTower ?? row.towerId ?? '—'}</span></td>
                    <td className="font-semibold text-app-text">{row.namaFile ?? '—'}</td>
                    <td className="text-app-muted">{row.tipe ?? '—'}</td>
                    <td className="font-mono text-[12px]">{row.tahun ?? '—'}</td>
                    <td className="font-mono text-[12px]">{row.versi ?? '—'}</td>
                    <td className="text-right pr-4">
                      <ActionMenu items={[
                        {
                          label: 'Preview',
                          icon: <Eye size={14} />,
                          onClick: () => row.fileUrl ? window.open(row.fileUrl, '_blank') : toast.error('File tidak tersedia'),
                        },
                        {
                          label: 'Download',
                          icon: <Download size={14} />,
                          onClick: () => {
                            if (row.fileUrl) {
                              const a = document.createElement('a')
                              a.href = row.fileUrl
                              a.download = row.namaFile ?? 'drawing'
                              a.click()
                            } else {
                              toast.error('File tidak tersedia')
                            }
                          },
                        },
                        ...(isAdmin() ? [{
                          label: 'Hapus',
                          icon: <span className="text-red-400">✕</span>,
                          onClick: () => setDeleteId(row.id),
                          danger: true,
                          dividerBefore: true,
                        }] : []),
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

      <TambahModal open={tambahOpen} onClose={() => setTambahOpen(false)} onSaved={fetchData} />
      <ConfirmModal
        isOpen={!!deleteId}
        title="Hapus Dokumen?"
        message="Dokumen ini akan dihapus permanen beserta file-nya."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
        confirmLabel="Ya, Hapus"
      />
    </>
  )
}
