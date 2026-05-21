'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { FileText, Plus, Upload, X, ChevronRight, Search, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import { asBuiltApi } from '@/lib/api'
import { isAdminOrSuperadmin } from '@/lib/auth'
import { compressFiles, MAX_FILE_SIZE_BYTES } from '@/lib/compressFile'
import { ActionMenu } from '@/components/ui/ActionMenu'

// ─── Upload Modal ──────────────────────────────────────────────────────────────

function UploadModal({ open, folderId, onClose, onSaved }: {
  open: boolean; folderId: string; onClose: () => void; onSaved: () => void
}) {
  const [files, setFiles]   = useState<File[]>([])
  const [saving, setSaving] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { if (!open) { setFiles([]); setDragOver(false) } }, [open])

  function addFiles(list: FileList | null) {
    if (!list) return
    const accepted: File[] = []
    const rejected: string[] = []
    for (const f of Array.from(list)) {
      if (f.size > MAX_FILE_SIZE_BYTES) rejected.push(f.name)
      else accepted.push(f)
    }
    if (rejected.length) {
      toast.error(`${rejected.length} file melebihi 10MB: ${rejected.join(', ')}`)
    }
    if (accepted.length) setFiles((cur) => [...cur, ...accepted])
  }

  function filterByAccept(list: File[]) {
    const allowed = ['pdf', 'dwg', 'dxf']
    return list.filter((f) => allowed.includes((f.name.split('.').pop() ?? '').toLowerCase()))
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const dropped = Array.from(e.dataTransfer.files ?? [])
    if (!dropped.length) return
    const filtered = filterByAccept(dropped)
    const skipped = dropped.length - filtered.length
    if (skipped > 0) toast.error(`${skipped} file dilewati (format tidak didukung)`)
    if (filtered.length) {
      const dt = new DataTransfer()
      filtered.forEach((f) => dt.items.add(f))
      addFiles(dt.files)
    }
  }

  function removeAt(i: number) {
    setFiles((cur) => cur.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!files.length) { toast.error('Pilih minimal 1 file'); return }
    setSaving(true)
    try {
      const compressed = await compressFiles(files)
      await asBuiltApi.uploadFiles(folderId, compressed)
      toast.success(`${compressed.length} dokumen berhasil diupload`)
      onSaved(); onClose(); setFiles([])
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Gagal upload')
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[460px] flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-app-border shrink-0">
          <h2 className="text-[15px] font-bold text-app-text">Upload Dokumen</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-app-bg text-app-muted"><X size={18} /></button>
        </div>
        <form id="upload-form" onSubmit={handleSubmit} className="px-6 py-5 overflow-y-auto">
          <div
            onClick={() => fileRef.current?.click()}
            onDragEnter={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={(e) => {
              if (e.currentTarget.contains(e.relatedTarget as Node)) return
              setDragOver(false)
            }}
            onDrop={onDrop}
            className={`border-2 border-dashed rounded-xl py-8 flex flex-col items-center gap-2 cursor-pointer transition-colors ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-app-border hover:border-blue-300 hover:bg-app-bg'}`}
          >
            <Upload size={24} className={dragOver ? 'text-blue-500' : 'text-app-muted'} />
            <p className="text-[13px] font-medium text-app-text">
              {dragOver ? 'Lepaskan file di sini' : 'Klik atau drag & drop file (bisa banyak)'}
            </p>
            <p className="text-[11px] text-app-muted">Format: PDF, DWG, DXF — maks 10MB/file (PDF dikompres otomatis)</p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.dwg,.dxf"
            multiple
            className="hidden"
            onChange={(e) => { addFiles(e.target.files); if (fileRef.current) fileRef.current.value = '' }}
          />

          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-[12px] font-semibold text-app-muted">{files.length} file dipilih</p>
              <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 bg-app-bg rounded-lg border border-app-border">
                    <span className="text-[12px] text-app-text flex-1 truncate" title={f.name}>{f.name}</span>
                    <span className="text-[11px] text-app-muted shrink-0">{(f.size / 1024).toFixed(0)} KB</span>
                    <button
                      type="button"
                      onClick={() => removeAt(i)}
                      className="p-0.5 rounded hover:bg-red-50 text-red-500"
                      aria-label="Hapus"
                    ><X size={14} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-app-border shrink-0">
          <button type="button" onClick={onClose} className="btn-outline">Batal</button>
          <button type="submit" form="upload-form" disabled={saving || !files.length} className="btn-primary">
            {saving ? 'Mengupload...' : `Upload${files.length > 0 ? ` (${files.length})` : ''}`}
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

  useEffect(() => { setAdminUser(isAdminOrSuperadmin()) }, [])

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
