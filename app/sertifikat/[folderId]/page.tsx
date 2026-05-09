'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { FileText, Plus, Upload, X, MoreHorizontal, ChevronRight, ZoomIn, ZoomOut, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { sertifikatApi } from '@/lib/api'
import { isAdmin } from '@/lib/auth'

// ─── Upload Dokumen Modal ──────────────────────────────────────────────────────

function UploadModal({ open, folderId, onClose, onSaved }: {
  open: boolean; folderId: string; onClose: () => void; onSaved: () => void
}) {
  const [file, setFile]     = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) { toast.error('Pilih file terlebih dahulu'); return }
    setSaving(true)
    try {
      await sertifikatApi.uploadDokumen(folderId, file)
      toast.success('Dokumen berhasil diupload')
      onSaved(); onClose(); setFile(null)
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Gagal upload')
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[420px] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-app-border">
          <h2 className="text-[15px] font-bold text-app-text">Upload Dokumen Sertifikat</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-app-bg text-app-muted"><X size={18} /></button>
        </div>
        <form id="upload-form" onSubmit={handleSubmit} className="px-6 py-5">
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-app-border rounded-xl py-10 flex flex-col items-center gap-2 cursor-pointer hover:border-blue-300 hover:bg-app-bg transition-colors"
          >
            <Upload size={24} className="text-app-muted" />
            <p className="text-[13px] font-medium text-app-text">{file ? file.name : 'Klik untuk pilih file PDF'}</p>
            <p className="text-[11px] text-app-muted">Format: PDF, maks 20MB</p>
          </div>
          <input ref={fileRef} type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </form>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-app-border">
          <button type="button" onClick={onClose} className="btn-outline">Batal</button>
          <button type="submit" form="upload-form" disabled={saving || !file} className="btn-primary">
            {saving ? 'Mengupload...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Preview Popup ─────────────────────────────────────────────────────────────

function PreviewPopup({ doc, onClose }: { doc: any; onClose: () => void }) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [zoom, setZoom]       = useState(1)

  useEffect(() => {
    let url = ''
    sertifikatApi.previewDokumen(doc.id)
      .then((u) => { url = u; setBlobUrl(u) })
      .catch(() => toast.error('Gagal memuat file'))
      .finally(() => setLoading(false))
    return () => { if (url) URL.revokeObjectURL(url) }
  }, [doc.id])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl flex flex-col" style={{ width: 680, maxHeight: '90vh' }}>
        {/* Title */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-app-border shrink-0">
          <span className="text-[15px] font-bold text-app-text">Preview Sertifikat</span>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-app-bg text-app-muted"><X size={18} /></button>
        </div>
        <hr className="border-app-border" />

        {/* Preview area */}
        <div className="flex-1 overflow-auto bg-gray-50 relative" style={{ minHeight: 400 }}>
          {loading ? (
            <div className="flex items-center justify-center h-full min-h-[400px] text-app-muted text-[13px]">
              Memuat file...
            </div>
          ) : blobUrl ? (
            <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.2s' }}>
              <iframe
                src={blobUrl}
                className="w-full"
                style={{ height: 540, border: 'none' }}
                title={doc.namaFile}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[400px] text-app-muted text-[13px]">
              Gagal memuat file preview.
            </div>
          )}
        </div>

        {/* Zoom controls */}
        <div className="flex items-center justify-center gap-3 py-3 border-t border-app-border shrink-0">
          <button
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
            className="p-2 rounded-lg hover:bg-app-bg text-app-muted transition-colors"
          >
            <ZoomOut size={18} />
          </button>
          <span className="text-[12px] font-mono text-app-muted w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
            className="p-2 rounded-lg hover:bg-app-bg text-app-muted transition-colors"
          >
            <ZoomIn size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── File Card ─────────────────────────────────────────────────────────────────

function FileCard({ doc, showAdmin, onClick, onDelete }: {
  doc: any; showAdmin: boolean
  onClick: () => void; onDelete: (id: string) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  return (
    <div className="sert-file-card" onClick={onClick}>
      <div className="sert-file-head">
        <FileText size={28} color="#ffffff" strokeWidth={1.5} />
      </div>
      <div className="sert-folder-body">
        <div className="sert-folder-row">
          <p className="sert-folder-name" style={{ fontSize: 13 }}>{doc.namaFile}</p>
          {showAdmin && (
            <div ref={menuRef} className="relative" onClick={(e) => e.stopPropagation()}>
              <button className="sert-dots-btn" onClick={() => setMenuOpen((v) => !v)}>
                <MoreHorizontal size={18} />
              </button>
              {menuOpen && (
                <div className="sert-dots-menu">
                  <button
                    className="sert-dots-item sert-dots-item--danger"
                    onClick={() => { setMenuOpen(false); onDelete(doc.id) }}
                  >
                    Hapus Dokumen
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <p className="sert-folder-meta">
          {new Date(doc.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      </div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function FolderPage() {
  const { folderId } = useParams<{ folderId: string }>()
  const router = useRouter()
  const [folder, setFolder]       = useState<any>(null)
  const [dokumen, setDokumen]     = useState<any[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [preview, setPreview]     = useState<any | null>(null)
  const [deleteId, setDeleteId]   = useState<string | null>(null)
  const [deleting, setDeleting]   = useState(false)
  const [adminUser, setAdminUser] = useState(false)

  useEffect(() => { setAdminUser(isAdmin()) }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [folderRes, docsRes] = await Promise.all([
        sertifikatApi.getFolder(folderId),
        sertifikatApi.getDokumen(folderId),
      ])
      setFolder(folderRes.data)
      setDokumen(Array.isArray(docsRes.data) ? docsRes.data : (docsRes.data?.data ?? []))
    } catch {
      toast.error('Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }, [folderId])

  useEffect(() => { fetchData() }, [fetchData])

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    try {
      await sertifikatApi.deleteDokumen(deleteId)
      toast.success('Dokumen dihapus')
      fetchData()
    } catch {
      toast.error('Gagal menghapus dokumen')
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const filtered = dokumen.filter((d) =>
    !search || d.namaFile.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <h1 className="text-[20px] font-bold text-app-text mb-5">Sertifikat</h1>

      {/* Top bar */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="sert-search-wrap flex-1 min-w-[200px]">
          <Search size={15} className="sert-search-icon" />
          <input
            className="sert-search-input"
            placeholder="Cari berdasarkan nama file"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {adminUser && (
          <button className="btn-primary shrink-0" onClick={() => setUploadOpen(true)}>
            <Plus size={16} /> Tambah Sertifikat Baru
          </button>
        )}
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[13px] mb-5">
        <button onClick={() => router.push('/sertifikat')} className="text-app-muted hover:text-blue-600 transition-colors">
          Beranda
        </button>
        <ChevronRight size={14} className="text-app-muted" />
        <span className="font-medium text-app-text">{folder?.nama ?? '...'}</span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="sert-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="sert-file-card animate-pulse">
              <div className="sert-file-head" style={{ background: '#e2e8f0' }} />
              <div className="sert-folder-body">
                <div className="h-4 bg-gray-100 rounded w-4/5 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-2/5" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-10 text-center text-app-muted text-[13px]">
          {search ? 'Tidak ada dokumen yang cocok.' : 'Belum ada dokumen di folder ini.'}
        </div>
      ) : (
        <div className="sert-grid">
          {filtered.map((doc) => (
            <FileCard
              key={doc.id}
              doc={doc}
              showAdmin={adminUser}
              onClick={() => setPreview(doc)}
              onDelete={setDeleteId}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <UploadModal
        open={uploadOpen}
        folderId={folderId}
        onClose={() => setUploadOpen(false)}
        onSaved={fetchData}
      />

      {preview && (
        <PreviewPopup doc={preview} onClose={() => setPreview(null)} />
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-[360px] p-6 text-center">
            <p className="text-[16px] font-bold text-app-text mb-1.5">Hapus Dokumen?</p>
            <p className="text-[13px] text-app-muted mb-5">File ini akan dihapus permanen dari server.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-outline flex-1">Batal</button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 btn-primary"
                style={{ background: '#d92c20' }}
              >
                {deleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
