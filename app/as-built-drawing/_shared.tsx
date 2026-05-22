'use client'

import { useEffect, useState } from 'react'
import { FileText, X, Download, FolderOpen, Image as ImageIcon, Check, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { asBuiltApi } from '@/lib/api'
import { ActionMenu } from '@/components/ui/ActionMenu'

// ── file helpers ─────────────────────────────────────────────────────────────

export const IMAGE_EXTS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp']
export const fileExt = (name: string) => (name.split('.').pop() ?? '').toLowerCase()
export const isImageName = (name: string) => IMAGE_EXTS.includes(fileExt(name))

export function fmtDate(value: string | Date | undefined) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

// ── thumbnail row used in upload modal ───────────────────────────────────────

export function FilePreviewRow({ file, onRemove }: { file: File; onRemove: () => void }) {
  const [thumb, setThumb] = useState<string | null>(null)
  const isImage = isImageName(file.name)

  useEffect(() => {
    if (!isImage) return
    const url = URL.createObjectURL(file)
    setThumb(url)
    return () => URL.revokeObjectURL(url)
  }, [file, isImage])

  return (
    <div className="flex items-center gap-2.5 px-2.5 py-2 bg-app-bg rounded-lg border border-app-border">
      <div className="w-10 h-10 rounded-md bg-white border border-app-border flex items-center justify-center overflow-hidden shrink-0">
        {isImage && thumb
          ? <img src={thumb} alt={file.name} className="w-full h-full object-cover" />
          : <FileText size={18} className="text-app-muted" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] text-app-text truncate" title={file.name}>{file.name}</p>
        <p className="text-[11px] text-app-muted">{(file.size / 1024).toFixed(0)} KB</p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="p-1 rounded hover:bg-red-50 text-red-500 shrink-0"
        aria-label="Hapus"
      ><X size={14} /></button>
    </div>
  )
}

// ── folder card (grid view) ──────────────────────────────────────────────────

export function FolderCard({
  row, isAdminUser, onClick, onDelete,
  selectable = false, selected = false, onToggleSelect,
}: {
  row: any; isAdminUser: boolean; onClick: () => void; onDelete: () => void
  selectable?: boolean; selected?: boolean; onToggleSelect?: () => void
}) {
  const label = row.nama ?? row.namaFile ?? '—'
  const fileCount = row._count?.dokumen ?? 0
  const childCount = row._count?.children ?? 0
  const totalItems = fileCount + childCount

  const meta = [
    row.tahun ? String(row.tahun) : null,
    row.tower?.nama ? `Tower ${row.tower.nama}` : null,
    totalItems > 0 ? `${totalItems} item` : null,
    row.createdBy?.nama ? `oleh ${row.createdBy.nama}` : null,
  ].filter(Boolean).join(' · ')

  const handleClick = selectable ? onToggleSelect : onClick
  const ringCls = selectable && selected ? 'ring-2 ring-[#076c9e] ring-offset-1' : ''

  return (
    <div className={`sert-folder-card relative ${ringCls}`} onClick={handleClick}>
      {selectable && <SelectCheckbox checked={selected} />}
      <div className="sert-folder-head">
        <FolderOpen size={32} color="#ffffff" strokeWidth={1.5} />
      </div>
      <div className="sert-folder-body">
        <div className="sert-folder-row">
          <p className="sert-folder-name">{label}</p>
          {!selectable && isAdminUser && (
            <div onClick={(e) => e.stopPropagation()}>
              <ActionMenu items={[{
                label: 'Hapus',
                icon: <span className="text-red-400">✕</span>,
                onClick: onDelete,
                danger: true,
              }]} />
            </div>
          )}
        </div>
        {meta && <p className="sert-folder-meta">{meta}</p>}
      </div>
    </div>
  )
}

// ── file card (grid view) ────────────────────────────────────────────────────

export function FileCard({
  doc, showAdmin, onClick, onDelete,
  selectable = false, selected = false, onToggleSelect,
}: {
  doc: any; showAdmin: boolean
  onClick: () => void; onDelete: (id: string) => void
  selectable?: boolean; selected?: boolean; onToggleSelect?: () => void
}) {
  const isImage = isImageName(doc.namaFile ?? '')
  const [thumb, setThumb] = useState<string | null>(null)
  useEffect(() => {
    if (!isImage) return
    let url = ''
    asBuiltApi.previewDokumen(doc.id)
      .then((u) => { url = u; setThumb(u) })
      .catch(() => {})
    return () => { if (url) URL.revokeObjectURL(url) }
  }, [doc.id, isImage])

  const handleClick = selectable ? onToggleSelect : onClick
  const ringCls = selectable && selected ? 'ring-2 ring-[#076c9e] ring-offset-1' : ''

  return (
    <div className={`sert-file-card relative ${ringCls}`} onClick={handleClick}>
      {selectable && <SelectCheckbox checked={selected} />}
      <div className="sert-file-head" style={isImage && thumb ? { padding: 0, overflow: 'hidden' } : undefined}>
        {isImage && thumb
          ? <img src={thumb} alt={doc.namaFile} className="w-full h-full object-cover" />
          : isImage
            ? <ImageIcon size={28} color="#ffffff" strokeWidth={1.5} />
            : <FileText size={28} color="#ffffff" strokeWidth={1.5} />}
      </div>
      <div className="sert-folder-body">
        <div className="sert-folder-row">
          <p className="sert-folder-name" style={{ fontSize: 13 }}>{doc.namaFile}</p>
          {!selectable && showAdmin && (
            <div onClick={(e) => e.stopPropagation()}>
              <ActionMenu items={[{
                label: 'Hapus Dokumen',
                icon: <span className="text-red-400">✕</span>,
                onClick: () => onDelete(doc.id),
                danger: true,
              }]} />
            </div>
          )}
        </div>
        <p className="sert-folder-meta">
          {fmtDate(doc.createdAt)}
          {doc.createdBy?.nama && ` · ${doc.createdBy.nama}`}
        </p>
      </div>
    </div>
  )
}

// ── list row (grid alternate view) ───────────────────────────────────────────

/**
 * Generic row used by the detail/main list view. Click navigates (folder) or
 * previews (file) — caller wires onClick to whichever applies.
 */
export function ListRow({
  kind, label, meta, isAdminUser, onClick, onDelete, fileExtForIcon,
  selectable = false, selected = false, onToggleSelect,
}: {
  kind: 'folder' | 'file'; label: string; meta: string
  isAdminUser: boolean; onClick: () => void; onDelete?: () => void
  fileExtForIcon?: string
  selectable?: boolean; selected?: boolean; onToggleSelect?: () => void
}) {
  const isImage = kind === 'file' && fileExtForIcon && IMAGE_EXTS.includes(fileExtForIcon)
  const handleClick = selectable ? onToggleSelect : onClick
  const selectedCls = selectable && selected ? 'border-[#076c9e] bg-[#F0F9FF]' : 'border-app-border'
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 bg-white border rounded-lg hover:bg-app-bg cursor-pointer transition-colors ${selectedCls}`}
      onClick={handleClick}
    >
      {selectable && (
        <div className="shrink-0">
          <SelectCheckbox checked={selected} inline />
        </div>
      )}
      <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${kind === 'folder' ? 'bg-[#076C9E]' : 'bg-[#5F737F]'}`}>
        {kind === 'folder'
          ? <FolderOpen size={18} color="#fff" strokeWidth={1.7} />
          : isImage
            ? <ImageIcon size={18} color="#fff" strokeWidth={1.7} />
            : <FileText size={18} color="#fff" strokeWidth={1.7} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-app-text truncate" title={label}>{label}</p>
        {meta && <p className="text-[11px] text-app-muted truncate">{meta}</p>}
      </div>
      {!selectable && isAdminUser && onDelete && (
        <div onClick={(e) => e.stopPropagation()} className="shrink-0">
          <ActionMenu items={[{
            label: 'Hapus',
            icon: <span className="text-red-400">✕</span>,
            onClick: onDelete,
            danger: true,
          }]} />
        </div>
      )}
    </div>
  )
}

// ── selection primitives ─────────────────────────────────────────────────────

function SelectCheckbox({ checked, inline = false }: { checked: boolean; inline?: boolean }) {
  const positionCls = inline ? '' : 'absolute top-2 left-2 z-10'
  const bgCls = checked ? 'bg-[#076c9e] border-[#076c9e]' : 'bg-white/95 border-app-border'
  return (
    <div
      className={`${positionCls} w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${bgCls}`}
      aria-checked={checked}
      role="checkbox"
    >
      {checked && <Check size={14} color="#fff" strokeWidth={3} />}
    </div>
  )
}

export function SelectionActionBar({
  folderCount, dokumenCount, totalAvailable, allSelected,
  onToggleAll, onDelete, onCancel,
}: {
  folderCount: number; dokumenCount: number; totalAvailable: number; allSelected: boolean
  onToggleAll: () => void; onDelete: () => void; onCancel: () => void
}) {
  const selectedTotal = folderCount + dokumenCount
  const parts = [
    folderCount > 0 ? `${folderCount} folder` : null,
    dokumenCount > 0 ? `${dokumenCount} file` : null,
  ].filter(Boolean).join(' + ')
  const summary = selectedTotal === 0 ? `Pilih item (0 dari ${totalAvailable})` : `${parts} terpilih`

  return (
    <div className="sticky top-0 z-30 flex flex-wrap items-center gap-3 px-3 py-2.5 mb-3 bg-[#F0F9FF] border border-[#076c9e]/30 rounded-lg shadow-sm">
      <button
        type="button"
        onClick={onToggleAll}
        className="flex items-center gap-2 text-[13px] font-semibold text-app-text hover:opacity-80"
      >
        <SelectCheckbox checked={allSelected && totalAvailable > 0} inline />
        <span>Pilih semua</span>
      </button>
      <span className="text-[12px] text-app-muted flex-1 min-w-0 truncate">{summary}</span>
      <button
        type="button"
        onClick={onDelete}
        disabled={selectedTotal === 0}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white bg-[#D92D20] hover:bg-[#B42318] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Trash2 size={14} />
        <span className="hidden md:inline">Hapus</span>
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-app-text border border-app-border hover:bg-white transition-colors"
      >
        Batal
      </button>
    </div>
  )
}

// ── preview modal ────────────────────────────────────────────────────────────

export function PreviewModal({ doc, onClose }: { doc: any; onClose: () => void }) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(false)

  const ext = fileExt(doc.namaFile ?? '')
  const isPdf = ext === 'pdf'
  const isImage = IMAGE_EXTS.includes(ext)
  const canPreview = isPdf || isImage

  useEffect(() => {
    if (!canPreview) { setLoading(false); return }
    let url = ''
    asBuiltApi.previewDokumen(doc.id)
      .then((u) => { url = u; setBlobUrl(u) })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
    return () => { if (url) URL.revokeObjectURL(url) }
  }, [doc.id, canPreview])

  function handleDownload() {
    if (doc.fileUrl) {
      const a = document.createElement('a')
      const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') ?? ''
      a.href = doc.fileUrl.startsWith('http') ? doc.fileUrl : `${base}${doc.fileUrl}`
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
          ) : canPreview && blobUrl ? (
            isPdf
              ? <iframe src={blobUrl} className="w-full h-full" style={{ height: 540, border: 'none' }} title={doc.namaFile} />
              : <img src={blobUrl} alt={doc.namaFile} className="max-w-full max-h-[540px] object-contain" />
          ) : canPreview && error ? (
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
