'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { FileText, Plus, Upload, X, ChevronRight, Search, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import { asBuiltApi } from '@/lib/api'
import { isAdmin } from '@/lib/auth'
import { ActionMenu } from '@/components/ui/ActionMenu'

// ─── Upload Modal ──────────────────────────────────────────────────────────────

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
      await asBuiltApi.uploadFile(folderId, file)
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
          <h2 className="text-[15px] font-bold text-app-text">Upload Dokumen</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-app-bg text-app-muted"><X size={18} /></button>
        </div>
        <form id="upload-form" onSubmit={handleSubmit} className="px-6 py-5">
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-app-border rounded-xl py-10 flex flex-col items-center gap-2 cursor-pointer hover:border-blue-300 hover:bg-app-bg transition-colors"
          >
            <Upload size={24} className="text-app-muted" />
            <p className="text-[13px] font-medium text-app-text">{file ? file.name : 'Klik untuk pilih file'}</p>
            <p className="text-[11px] text-app-muted">Format: PDF, DWG, DXF — maks 50MB</p>
          </div>
          <input ref={fileRef} type="file" accept=".pdf,.dwg,.dxf" className="hidden"
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

// ─── Preview Modal ─────────────────────────────────────────────────────────────

function PreviewModal({ doc, onClose }: { doc: any; onClose: () => void }) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(false)

  const isPdf = (doc.namaFile ?? '').toLowerCase().endsWith('.pdf')

  useEffect(() => {
    if (!isPdf) { setLoading(false); return }
    let url = ''
    asBuiltApi.previewDokumen(doc.id)
      .then((u) => { url = u; setBlobUrl(u) })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
    return () => { if (url) URL.revokeObjectURL(url) }
  }, [doc.id, isPdf])

  function handleDownload() {
    if (doc.fileUrl) {
      const a = document.createElement('a')
      a.href = doc.fileUrl
      a.download = doc.namaFile ?? 'dokumen'
      a.click()
    } else {
      toast.error('File tidak tersedia')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl flex flex-col" style={{ width: 700, maxHeight: '90vh' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-app-border shrink-0">
          <span className="text-[15px] font-bold text-app-text truncate pr-4">{doc.namaFile}</span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-app-border text-[12px] font-medium text-app-text hover:bg-app-bg transition-colors"
            >
              <Download size={14} /> Download
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-app-bg text-app-muted"><X size={18} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-gray-50 flex items-center justify-center" style={{ minHeight: 420 }}>
          {loading ? (
            <p className="text-app-muted text-[13px]">Memuat file...</p>
          ) : isPdf && blobUrl ? (
            <iframe
              src={blobUrl}
              className="w-full h-full"
              style={{ height: 540, border: 'none' }}
              title={doc.namaFile}
            />
          ) : isPdf && error ? (
            <div className="text-center">
              <p className="text-app-muted text-[13px] mb-3">Preview tidak tersedia.</p>
              <button onClick={handleDownload} className="btn-primary text-[13px]">
                <Download size={14} /> Download File
              </button>
            </div>
          ) : (
            <div className="text-center p-8">
              <FileText size={48} className="text-app-muted mx-auto mb-3" strokeWidth={1.5} />
              <p className="text-[13px] text-app-muted mb-1">Format file tidak dapat dipratinjau di browser.</p>
              <p className="text-[12px] text-app-muted mb-4">{doc.namaFile}</p>
              <button onClick={handleDownload} className="btn-primary text-[13px]">
                <Download size={14} /> Download File
              </button>
            </div>
          )}
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
  return (
    <div className="sert-file-card" onClick={onClick}>
      <div className="sert-file-head">
        <FileText size={28} color="#ffffff" strokeWidth={1.5} />
      </div>
      <div className="sert-folder-body">
        <div className="sert-folder-row">
          <p className="sert-folder-name" style={{ fontSize: 13 }}>{doc.namaFile}</p>
          {showAdmin && (
            <div onClick={(e) => e.stopPropagation()}>
              <ActionMenu
                items={[{
                  label: 'Hapus Dokumen',
                  icon: <span className="text-red-400">✕</span>,
                  onClick: () => onDelete(doc.id),
                  danger: true,
                }]}
              />
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

export default function AsBuiltDrawingFolderPage() {
  const { id } = useParams<{ id: string }>()
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
      const res = await asBuiltApi.getFolder(id)
      setFolder(res.data)
      setDokumen(Array.isArray(res.data.dokumen) ? res.data.dokumen : [])
    } catch {
      toast.error('Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchData() }, [fetchData])

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    try {
      await asBuiltApi.deleteDokumen(deleteId)
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
    !search || (d.namaFile ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <h1 className="text-[20px] font-bold text-app-text mb-5">As Built Drawing</h1>

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
            <Plus size={16} /> Upload Dokumen
          </button>
        )}
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[13px] mb-5">
        <button
          onClick={() => router.push('/as-built-drawing')}
          className="text-app-muted hover:text-blue-600 transition-colors"
        >
          Beranda
        </button>
        <ChevronRight size={14} className="text-app-muted" />
        <span className="font-medium text-app-text">{folder?.nama ?? '...'}</span>
        {folder?.tipe && (
          <>
            <ChevronRight size={14} className="text-app-muted" />
            <span className="text-app-muted">{folder.tipe}</span>
          </>
        )}
      </div>

      {/* Folder meta */}
      {folder && (
        <div className="flex items-center gap-4 mb-5 text-[12px] text-app-muted">
          {folder.tahun && <span className="font-medium">Tahun {folder.tahun}</span>}
          {folder.tower && <span>Tower {folder.tower.nomorTower}</span>}
          {folder.keterangan && <span className="italic">{folder.keterangan}</span>}
        </div>
      )}

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
        <div className="card p-10 text-center">
          <FileText size={36} className="text-app-muted mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-[13px] text-app-muted mb-1">
            {search ? 'Tidak ada dokumen yang cocok.' : 'Belum ada dokumen di folder ini.'}
          </p>
          {!search && adminUser && (
            <button className="btn-primary mt-3 text-[13px]" onClick={() => setUploadOpen(true)}>
              <Plus size={14} /> Upload Dokumen Pertama
            </button>
          )}
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
        folderId={id}
        onClose={() => setUploadOpen(false)}
        onSaved={fetchData}
      />

      {preview && (
        <PreviewModal doc={preview} onClose={() => setPreview(null)} />
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
