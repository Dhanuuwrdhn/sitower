'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Plus, Upload, X, SlidersHorizontal, Search } from 'lucide-react'
import { asBuiltApi, towersApi } from '@/lib/api'
import { isAdminOrSuperadmin, isTeknisi } from '@/lib/auth'
import { Pagination } from '@/components/ui/Pagination'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import { compressFiles, MAX_FILE_SIZE_BYTES } from '@/lib/compressFile'
import {
  FolderCard, FileCard, PreviewModal, FilePreviewRow,
} from './_shared'

const _cy = new Date().getFullYear()
const YEAR_OPTIONS = Array.from({ length: _cy - 2009 }, (_, i) => String(_cy - i))

// ── Folder skeleton ──────────────────────────────────────────────────────────

function GridSkeleton({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="sert-folder-card animate-pulse">
          <div className="sert-folder-head" style={{ background: '#e2e8f0' }} />
          <div className="sert-folder-body">
            <div className="h-4 bg-gray-100 rounded w-4/5 mb-2" />
            <div className="h-3 bg-gray-100 rounded w-2/5" />
          </div>
        </div>
      ))}
    </>
  )
}

// ── Tambah Folder modal ──────────────────────────────────────────────────────

const BLANK_FORM = {
  nama: '', towerId: '',
  tahun: String(new Date().getFullYear()), keterangan: '',
}

function TambahFolderModal({ open, onClose, onSaved, towerOptions }: {
  open: boolean; onClose: () => void; onSaved: () => void;
  towerOptions: { value: string; label: string }[]
}) {
  const [form, setForm] = useState(BLANK_FORM)
  const [saving, setSaving] = useState(false)
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nama.trim()) { toast.error('Nama folder wajib diisi'); return }
    setSaving(true)
    try {
      await asBuiltApi.create({
        nama: form.nama,
        tahun: form.tahun,
        ...(form.towerId && { towerId: form.towerId }),
        ...(form.keterangan && { keterangan: form.keterangan }),
      })
      toast.success('Folder berhasil dibuat')
      onSaved(); onClose()
      setForm(BLANK_FORM)
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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[460px] flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-app-border">
          <h2 className="text-[15px] font-bold text-app-text">Tambah Folder</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-app-bg text-app-muted"><X size={18} /></button>
        </div>
        <form id="abd-folder-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Nama Folder <span className="text-red-500">*</span></label>
            <input type="text" value={form.nama} onChange={(e) => set('nama', e.target.value)} className="form-input" placeholder="cth. Tower ST-001" />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Tahun</label>
            <select value={form.tahun} onChange={(e) => set('tahun', e.target.value)} className="form-input">
              {YEAR_OPTIONS.map((y) => <option key={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <SearchableSelect
              label="Tower (opsional)"
              placeholder="Pilih tower..."
              options={towerOptions}
              values={form.towerId ? [form.towerId] : []}
              onChange={(vals) => set('towerId', vals[vals.length - 1] ?? '')}
              onClear={() => set('towerId', '')}
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Keterangan</label>
            <textarea rows={3} value={form.keterangan} onChange={(e) => set('keterangan', e.target.value)} className="form-input resize-none" />
          </div>
        </form>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-app-border">
          <button type="button" onClick={onClose} className="btn-outline">Batal</button>
          <button type="submit" form="abd-folder-form" disabled={saving} className="btn-primary">
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Upload Dokumen modal (root) ──────────────────────────────────────────────

function UploadRootModal({ open, onClose, onSaved }: {
  open: boolean; onClose: () => void; onSaved: () => void
}) {
  const [files, setFiles] = useState<File[]>([])
  const [saving, setSaving] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { if (!open) { setFiles([]); setDragOver(false) } }, [open])

  function ingestFiles(list: File[]) {
    const accepted: File[] = []
    const rejected: string[] = []
    for (const f of list) {
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
      await asBuiltApi.uploadRootFiles(compressed)
      toast.success(`${compressed.length} dokumen berhasil diupload`)
      onSaved(); onClose()
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
        <form id="abd-root-upload" onSubmit={handleSubmit} className="px-6 py-5 overflow-y-auto">
          <div
            onClick={() => fileRef.current?.click()}
            onDragEnter={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={(e) => {
              if (e.currentTarget.contains(e.relatedTarget as Node)) return
              setDragOver(false)
            }}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); ingestFiles(Array.from(e.dataTransfer.files ?? [])) }}
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
            onChange={(e) => { ingestFiles(Array.from(e.target.files ?? [])); if (fileRef.current) fileRef.current.value = '' }}
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
          <button type="submit" form="abd-root-upload" disabled={saving || !files.length} className="btn-primary">
            {saving ? 'Mengupload...' : `Upload${files.length ? ` (${files.length})` : ''}`}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AsBuiltDrawingPage() {
  const router = useRouter()
  const [folders, setFolders] = useState<any[]>([])
  const [rootDokumen, setRootDokumen] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [tambahOpen, setTambahOpen] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [deleteFolderId, setDeleteFolderId] = useState<string | null>(null)
  const [deleteDokumenId, setDeleteDokumenId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [preview, setPreview] = useState<any | null>(null)

  const [isAdminUser, setIsAdminUser] = useState(false)
  const [canUpload, setCanUpload] = useState(false)

  const [filterOpen, setFilterOpen] = useState(false)
  const [tahunFilter, setTahunFilter] = useState<string[]>([])
  const [towerFilter, setTowerFilter] = useState<string[]>([])
  const [towers, setTowers] = useState<any[]>([])

  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsAdminUser(isAdminOrSuperadmin())
    setCanUpload(isAdminOrSuperadmin() || isTeknisi())
  }, [])

  useEffect(() => {
    towersApi.getDropdown().then((r) => {
      const data = r.data
      setTowers(Array.isArray(data) ? data : (data?.data ?? []))
    }).catch(() => {})
  }, [])

  const towerOptions = useMemo(
    () => towers.map((t: any) => ({ value: t.id, label: t.nama ?? t.nomorTower ?? t.id })),
    [towers],
  )

  useEffect(() => { setPage(1) }, [search, tahunFilter, towerFilter])

  useEffect(() => {
    if (!filterOpen) return
    function handleClick(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [filterOpen])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params: any = { parentId: 'root' }
      if (tahunFilter.length === 1) params.tahun = tahunFilter[0]
      if (towerFilter.length === 1) params.towerId = towerFilter[0]
      const res = await asBuiltApi.getAll(params)
      const p = res.data
      setFolders(p?.folders ?? [])
      setRootDokumen(p?.rootDokumen ?? [])
    } catch {
      setFolders([]); setRootDokumen([])
    } finally {
      setLoading(false)
    }
  }, [tahunFilter, towerFilter])

  useEffect(() => { fetchData() }, [fetchData])

  const filteredFolders = useMemo(() => {
    let result = folders
    if (search.trim()) {
      const lower = search.toLowerCase()
      result = result.filter((row) =>
        (row.nama ?? '').toLowerCase().includes(lower) ||
        (row.tower?.nama ?? '').toLowerCase().includes(lower)
      )
    }
    if (tahunFilter.length > 1) {
      result = result.filter((row) => tahunFilter.includes(String(row.tahun)))
    }
    if (towerFilter.length > 1) {
      result = result.filter((row) => towerFilter.includes(row.towerId))
    }
    return result
  }, [folders, search, tahunFilter, towerFilter])

  const filteredDokumen = useMemo(() => {
    if (!search.trim()) return rootDokumen
    const lower = search.toLowerCase()
    return rootDokumen.filter((d) => (d.namaFile ?? '').toLowerCase().includes(lower))
  }, [rootDokumen, search])

  const combinedItems = useMemo(
    () => [
      ...filteredFolders.map((f) => ({ ...f, _kind: 'folder' as const })),
      ...filteredDokumen.map((d) => ({ ...d, _kind: 'file' as const })),
    ],
    [filteredFolders, filteredDokumen],
  )

  const total = combinedItems.length
  const displayItems = combinedItems.slice((page - 1) * limit, page * limit)

  const hasActiveFilter = tahunFilter.length > 0 || towerFilter.length > 0

  function resetFilters() {
    setTahunFilter([])
    setTowerFilter([])
  }

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

  return (
    <>
      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <div className="flex items-center gap-3 px-4 py-[11px] bg-white border border-[#E1E8EC] rounded-lg flex-1 min-w-0">
            <Search size={16} className="text-[#5F737F] shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama folder atau file"
              className="border-none outline-none font-medium text-[14px] text-[#1C1C1C] bg-transparent w-full min-w-0 placeholder:text-[#97AAB3]"
            />
          </div>

          <div ref={filterRef} className="relative">
            <button
              onClick={() => setFilterOpen((v) => !v)}
              className="relative w-11 h-11 bg-white border border-[#E1E8EC] rounded-lg flex items-center justify-center cursor-pointer shrink-0"
              aria-label="Filter"
            >
              <SlidersHorizontal size={18} className="text-[#5F737F]" />
              {hasActiveFilter && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D92D20]" />}
            </button>

            {filterOpen && (
              <div className="absolute right-0 top-full mt-2 z-50 w-[min(420px,calc(100vw-2rem))] bg-white border border-[#E1E8EC] rounded-lg shadow-[0px_4px_8px_0px_rgba(28,28,28,0.15)]">
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="font-bold text-[14px] text-[#1C1C1C]">Filter</span>
                  <div className="flex items-center gap-3">
                    {hasActiveFilter && (
                      <button onClick={resetFilters} className="text-[12px] text-[#D92D20] font-semibold hover:underline">Reset</button>
                    )}
                    <button onClick={() => setFilterOpen(false)} className="p-1 hover:bg-app-bg rounded">
                      <X size={16} className="text-[#5F737F]" />
                    </button>
                  </div>
                </div>
                <div className="h-px bg-[#E1E8EC]" />

                <div className="max-h-[450px] overflow-y-auto">
                  <div className="px-4 py-3 flex flex-col gap-2.5">
                    <span className="font-bold text-[14px] text-[#1C1C1C]">Tahun</span>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {YEAR_OPTIONS.map((y) => {
                        const active = tahunFilter.includes(y)
                        return (
                          <button
                            key={y}
                            onClick={() => setTahunFilter(active ? tahunFilter.filter((v) => v !== y) : [...tahunFilter, y])}
                            className={`px-3 py-1 rounded-full border text-[12px] font-medium transition-all ${active ? 'bg-[#076C9E] border-[#076C9E] text-white' : 'border-[#E1E8EC] text-[#5F737F] hover:border-[#076C9E]'}`}
                          >{y}</button>
                        )
                      })}
                    </div>
                  </div>
                  <div className="h-px bg-[#E1E8EC]" />
                  <div className="px-4 py-3">
                    <SearchableSelect
                      label="Tower"
                      placeholder="Pilih tower..."
                      options={towerOptions}
                      values={towerFilter}
                      onChange={(vals) => setTowerFilter(vals)}
                      onClear={() => setTowerFilter([])}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {canUpload && (
          <button onClick={() => setUploadOpen(true)} className="btn-outline shrink-0" title="Upload dokumen">
            <Upload size={16} /> <span className="hidden md:inline">Upload Dokumen</span>
          </button>
        )}
        {isAdminUser && (
          <button onClick={() => setTambahOpen(true)} className="btn-primary shrink-0" title="Tambah folder">
            <Plus size={16} /> <span className="hidden md:inline">Tambah Folder</span>
          </button>
        )}
      </div>

      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-1.5 text-[13px] text-app-muted mb-5">
        <span className="font-medium text-app-text">Beranda</span>
      </div>

      {/* ── Grid view ── */}
      {loading ? (
        <div className="sert-grid">
          <GridSkeleton count={Math.min(limit, 20)} />
        </div>
      ) : displayItems.length === 0 ? (
        <div className="card p-10 text-center text-app-muted text-[13px]">
          Belum ada folder atau dokumen{hasActiveFilter || search ? ' yang sesuai' : ''}.
        </div>
      ) : (
        <div className="sert-grid">
          {displayItems.map((item) => item._kind === 'folder' ? (
            <FolderCard
              key={`folder-${item.id}`}
              row={item}
              isAdminUser={isAdminUser}
              onClick={() => router.push(`/as-built-drawing/${item.id}`)}
              onDelete={() => setDeleteFolderId(item.id)}
            />
          ) : (
            <FileCard
              key={`file-${item.id}`}
              doc={item}
              showAdmin={isAdminUser}
              onClick={() => setPreview(item)}
              onDelete={setDeleteDokumenId}
            />
          ))}
        </div>
      )}

      <div className="mt-5">
        <Pagination
          total={total} page={page} limit={limit}
          onChange={setPage}
          onLimitChange={(l) => { setLimit(l); setPage(1) }}
        />
      </div>

      <TambahFolderModal
        open={tambahOpen}
        onClose={() => setTambahOpen(false)}
        onSaved={fetchData}
        towerOptions={towerOptions}
      />
      <UploadRootModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSaved={fetchData}
      />
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
