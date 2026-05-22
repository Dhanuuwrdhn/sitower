'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Plus, Upload, X, ChevronRight, Search, LayoutGrid, List } from 'lucide-react'
import toast from 'react-hot-toast'
import { asBuiltApi } from '@/lib/api'
import { isAdminOrSuperadmin, isTeknisi } from '@/lib/auth'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { compressFiles, MAX_FILE_SIZE_BYTES } from '@/lib/compressFile'
import {
  FolderCard, FileCard, ListRow, PreviewModal, FilePreviewRow,
  fileExt, fmtDate,
} from '../_shared'

// ─── Upload Modal ──────────────────────────────────────────────────────────────

function UploadModal({ open, folderId, onClose, onSaved }: {
  open: boolean; folderId: string; onClose: () => void; onSaved: () => void
}) {
  const [files, setFiles] = useState<File[]>([])
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
    if (rejected.length) toast.error(`${rejected.length} file melebihi 10MB: ${rejected.join(', ')}`)
    if (accepted.length) setFiles((cur) => [...cur, ...accepted])
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
            onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files) }}
            className={`border-2 border-dashed rounded-xl py-8 flex flex-col items-center gap-2 cursor-pointer transition-colors ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-app-border hover:border-blue-300 hover:bg-app-bg'}`}
          >
            <Upload size={24} className={dragOver ? 'text-blue-500' : 'text-app-muted'} />
            <p className="text-[13px] font-medium text-app-text">
              {dragOver ? 'Lepaskan file di sini' : 'Klik atau drag & drop file (bisa banyak)'}
            </p>
            <p className="text-[11px] text-app-muted">Semua format file — maks 10MB/file (PDF dikompres otomatis)</p>
          </div>
          <input
            ref={fileRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => { addFiles(e.target.files); if (fileRef.current) fileRef.current.value = '' }}
          />
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-[12px] font-semibold text-app-muted">{files.length} file dipilih</p>
              <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
                {files.map((f, i) => (
                  <FilePreviewRow
                    key={`${f.name}-${i}`}
                    file={f}
                    onRemove={() => setFiles((cur) => cur.filter((_, idx) => idx !== i))}
                  />
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

// ─── Subfolder Modal ───────────────────────────────────────────────────────────

function SubfolderModal({ open, parentId, onClose, onSaved }: {
  open: boolean; parentId: string; onClose: () => void; onSaved: () => void
}) {
  const [nama, setNama] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { if (!open) setNama('') }, [open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nama.trim()) { toast.error('Nama folder wajib diisi'); return }
    setSaving(true)
    try {
      await asBuiltApi.create({ nama, parentId, tahun: new Date().getFullYear() })
      toast.success('Subfolder berhasil dibuat')
      onSaved(); onClose()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Gagal menyimpan')
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[400px]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-app-border">
          <h2 className="text-[15px] font-bold text-app-text">Buat Subfolder</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-app-bg text-app-muted"><X size={18} /></button>
        </div>
        <form id="sub-form" onSubmit={handleSubmit} className="px-6 py-5">
          <label className="block text-[12px] font-semibold text-app-text mb-1.5">Nama Folder <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="form-input"
            placeholder="cth. Foto Lapangan"
            autoFocus
          />
        </form>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-app-border">
          <button type="button" onClick={onClose} className="btn-outline">Batal</button>
          <button type="submit" form="sub-form" disabled={saving} className="btn-primary">
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function AsBuiltDrawingFolderPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [folder, setFolder]       = useState<any>(null)
  const [children, setChildren]   = useState<any[]>([])
  const [dokumen, setDokumen]     = useState<any[]>([])
  const [breadcrumb, setBreadcrumb] = useState<Array<{ id: string; nama: string }>>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [viewMode, setViewMode]   = useState<'grid' | 'list'>('grid')

  // Default to list view on mobile; keep grid on desktop. Once the user toggles
  // manually, leave their choice alone for the rest of the session.
  const userTouchedView = useRef(false)
  useEffect(() => {
    if (userTouchedView.current) return
    if (typeof window === 'undefined') return
    setViewMode(window.matchMedia('(max-width: 767px)').matches ? 'list' : 'grid')
  }, [])
  const [uploadOpen, setUploadOpen] = useState(false)
  const [subfolderOpen, setSubfolderOpen] = useState(false)
  const [preview, setPreview]     = useState<any | null>(null)
  const [deleteFolderId, setDeleteFolderId] = useState<string | null>(null)
  const [deleteDokumenId, setDeleteDokumenId] = useState<string | null>(null)
  const [deleting, setDeleting]   = useState(false)

  const [adminUser, setAdminUser] = useState(false)
  const [canUpload, setCanUpload] = useState(false)

  useEffect(() => {
    setAdminUser(isAdminOrSuperadmin())
    setCanUpload(isAdminOrSuperadmin() || isTeknisi())
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [folderRes, crumbRes] = await Promise.all([
        asBuiltApi.getFolder(id),
        asBuiltApi.getBreadcrumb(id),
      ])
      setFolder(folderRes.data)
      setChildren(Array.isArray(folderRes.data.children) ? folderRes.data.children : [])
      setDokumen(Array.isArray(folderRes.data.dokumen) ? folderRes.data.dokumen : [])
      setBreadcrumb(Array.isArray(crumbRes.data) ? crumbRes.data : [])
    } catch {
      toast.error('Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchData() }, [fetchData])

  async function confirmDeleteFolder() {
    if (!deleteFolderId) return
    setDeleting(true)
    try {
      await asBuiltApi.deleteFolder(deleteFolderId)
      toast.success('Folder dihapus')
      setDeleteFolderId(null)
      fetchData()
    } catch {
      toast.error('Gagal menghapus folder')
    } finally {
      setDeleting(false)
    }
  }

  async function confirmDeleteDokumen() {
    if (!deleteDokumenId) return
    setDeleting(true)
    try {
      await asBuiltApi.deleteDokumen(deleteDokumenId)
      toast.success('Dokumen dihapus')
      setDeleteDokumenId(null)
      fetchData()
    } catch {
      toast.error('Gagal menghapus dokumen')
    } finally {
      setDeleting(false)
    }
  }

  const lower = search.trim().toLowerCase()
  const filteredChildren = lower
    ? children.filter((c) => (c.nama ?? '').toLowerCase().includes(lower))
    : children
  const filteredDokumen = lower
    ? dokumen.filter((d) => (d.namaFile ?? '').toLowerCase().includes(lower))
    : dokumen

  const isEmpty = filteredChildren.length === 0 && filteredDokumen.length === 0

  return (
    <>
      <h1 className="text-[20px] font-bold text-app-text mb-5">As Built Drawing</h1>

      {/* Top bar */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-3 px-4 py-[11px] bg-white border border-[#E1E8EC] rounded-lg flex-1 min-w-[200px]">
          <Search size={16} className="text-[#5F737F] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama folder atau file"
            className="border-none outline-none font-medium text-[14px] text-[#1C1C1C] bg-transparent w-full min-w-0 placeholder:text-[#97AAB3]"
          />
        </div>

        <div className="flex items-center bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => { userTouchedView.current = true; setViewMode('grid') }}
            title="Grid view"
            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-app-text' : 'text-app-muted hover:text-app-text'}`}
          ><LayoutGrid size={15} /></button>
          <button
            onClick={() => { userTouchedView.current = true; setViewMode('list') }}
            title="List view"
            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-app-text' : 'text-app-muted hover:text-app-text'}`}
          ><List size={15} /></button>
        </div>

        {adminUser && (
          <button className="btn-outline shrink-0" onClick={() => setSubfolderOpen(true)} title="Buat subfolder">
            <Plus size={16} /> <span className="hidden md:inline">Subfolder</span>
          </button>
        )}
        {canUpload && (
          <button className="btn-primary shrink-0" onClick={() => setUploadOpen(true)} title="Upload dokumen">
            <Plus size={16} /> <span className="hidden md:inline">Upload Dokumen</span>
          </button>
        )}
      </div>

      {/* Breadcrumb — collapses to "Beranda > … > parent > current" once chain is long */}
      <div className="flex items-center gap-1.5 text-[13px] mb-5 flex-wrap">
        <button
          onClick={() => router.push('/as-built-drawing')}
          className="text-app-muted hover:text-blue-600 transition-colors"
        >
          Beranda
        </button>
        {(() => {
          // Show first crumb, then collapse middle into "…", then last 2 (parent + current).
          const COLLAPSE_AFTER = 4
          const showCollapsed = breadcrumb.length > COLLAPSE_AFTER
          const visible = showCollapsed
            ? [
                { ...breadcrumb[0], _kind: 'crumb' as const },
                { id: '__ellipsis__', nama: '…', _kind: 'ellipsis' as const },
                ...breadcrumb.slice(-2).map((c) => ({ ...c, _kind: 'crumb' as const })),
              ]
            : breadcrumb.map((c) => ({ ...c, _kind: 'crumb' as const }))

          return visible.map((c, idx) => {
            const isLast = idx === visible.length - 1
            return (
              <span key={`${c._kind}-${c.id}-${idx}`} className="flex items-center gap-1.5 min-w-0">
                <ChevronRight size={14} className="text-app-muted shrink-0" />
                {c._kind === 'ellipsis' ? (
                  <span className="text-app-muted">…</span>
                ) : isLast ? (
                  <span className="font-medium text-app-text truncate max-w-[180px] md:max-w-none" title={c.nama}>{c.nama}</span>
                ) : (
                  <button
                    onClick={() => router.push(`/as-built-drawing/${c.id}`)}
                    className="text-app-muted hover:text-blue-600 transition-colors truncate max-w-[140px] md:max-w-none"
                    title={c.nama}
                  >{c.nama}</button>
                )}
              </span>
            )
          })
        })()}
      </div>

      {/* Folder meta */}
      {folder && (
        <div className="flex items-center gap-4 mb-5 text-[12px] text-app-muted flex-wrap">
          {folder.tahun && <span className="font-medium">Tahun {folder.tahun}</span>}
          {folder.tower?.nama && <span>Tower {folder.tower.nama}</span>}
          {folder.createdBy?.nama && <span>Dibuat oleh {folder.createdBy.nama}</span>}
          {folder.keterangan && <span className="italic">{folder.keterangan}</span>}
        </div>
      )}

      {/* Body */}
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
      ) : isEmpty ? (
        <div className="card p-10 text-center text-app-muted text-[13px]">
          {search ? 'Tidak ada yang cocok.' : 'Folder ini masih kosong.'}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="sert-grid">
          {filteredChildren.map((c) => (
            <FolderCard
              key={`folder-${c.id}`}
              row={c}
              isAdminUser={adminUser}
              onClick={() => router.push(`/as-built-drawing/${c.id}`)}
              onDelete={() => setDeleteFolderId(c.id)}
            />
          ))}
          {filteredDokumen.map((d) => (
            <FileCard
              key={`file-${d.id}`}
              doc={d}
              showAdmin={adminUser}
              onClick={() => setPreview(d)}
              onDelete={setDeleteDokumenId}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredChildren.map((c) => {
            const fc = c._count?.dokumen ?? 0
            const cc = c._count?.children ?? 0
            const meta = [
              c.tahun ? `Tahun ${c.tahun}` : null,
              (fc + cc) > 0 ? `${fc + cc} item` : null,
              c.createdBy?.nama ? `oleh ${c.createdBy.nama}` : null,
              fmtDate(c.createdAt),
            ].filter(Boolean).join(' · ')
            return (
              <ListRow
                key={`folder-${c.id}`}
                kind="folder"
                label={c.nama ?? '—'}
                meta={meta}
                isAdminUser={adminUser}
                onClick={() => router.push(`/as-built-drawing/${c.id}`)}
                onDelete={adminUser ? () => setDeleteFolderId(c.id) : undefined}
              />
            )
          })}
          {filteredDokumen.map((d) => {
            const meta = [
              d.createdBy?.nama ? `oleh ${d.createdBy.nama}` : null,
              fmtDate(d.createdAt),
            ].filter(Boolean).join(' · ')
            return (
              <ListRow
                key={`file-${d.id}`}
                kind="file"
                label={d.namaFile}
                meta={meta}
                fileExtForIcon={fileExt(d.namaFile ?? '')}
                isAdminUser={adminUser}
                onClick={() => setPreview(d)}
                onDelete={adminUser ? () => setDeleteDokumenId(d.id) : undefined}
              />
            )
          })}
        </div>
      )}

      {/* Modals */}
      <UploadModal open={uploadOpen} folderId={id} onClose={() => setUploadOpen(false)} onSaved={fetchData} />
      <SubfolderModal open={subfolderOpen} parentId={id} onClose={() => setSubfolderOpen(false)} onSaved={fetchData} />
      {preview && <PreviewModal doc={preview} onClose={() => setPreview(null)} />}

      <ConfirmModal
        isOpen={!!deleteFolderId}
        title="Hapus Folder?"
        message="Folder beserta semua isinya akan dihapus permanen."
        onConfirm={confirmDeleteFolder}
        onCancel={() => setDeleteFolderId(null)}
        loading={deleting}
        confirmLabel="Ya, Hapus"
      />
      <ConfirmModal
        isOpen={!!deleteDokumenId}
        title="Hapus Dokumen?"
        message="File akan dihapus permanen dari server."
        onConfirm={confirmDeleteDokumen}
        onCancel={() => setDeleteDokumenId(null)}
        loading={deleting}
        confirmLabel="Ya, Hapus"
      />
    </>
  )
}
