'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Plus, Upload, FolderOpen, X, SlidersHorizontal, LayoutGrid, List, Search } from 'lucide-react'
import { asBuiltApi, towersApi } from '@/lib/api'
import { isAdminOrSuperadmin } from '@/lib/auth'
import { ActionMenu } from '@/components/ui/ActionMenu'
import { Pagination } from '@/components/ui/Pagination'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonRow } from '@/components/ui/SkeletonRow'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import { compressFiles, MAX_FILE_SIZE_BYTES } from '@/lib/compressFile'

const TIPE_OPTIONS = ['Electrical', 'Mechanical', 'Civil', 'Grounding', 'Lainnya']

const _cy = new Date().getFullYear()
const YEAR_OPTIONS = Array.from({ length: _cy - 2009 }, (_, i) => String(_cy - i))

// ── Folder card (grid view) ───────────────────────────────────────────────────

function FolderCard({ row, isAdminUser, onClick, onDelete }: {
  row: any; isAdminUser: boolean; onClick: () => void; onDelete: () => void
}) {
  const label = row.nama ?? row.namaFile ?? row.tower?.nomorTower ?? '—'
  const meta = [
    row.tipe,
    row.tahun ? String(row.tahun) : null,
    row.tower?.nomorTower ? `Tower ${row.tower.nomorTower}` : null,
    row._count?.dokumen !== undefined ? `${row._count.dokumen} file` : null,
  ].filter(Boolean).join(' · ')

  return (
    <div className="sert-folder-card" onClick={onClick}>
      <div className="sert-folder-head">
        <FolderOpen size={32} color="#ffffff" strokeWidth={1.5} />
      </div>
      <div className="sert-folder-body">
        <div className="sert-folder-row">
          <p className="sert-folder-name">{label}</p>
          {isAdminUser && (
            <div onClick={(e) => e.stopPropagation()}>
              <ActionMenu
                items={[{
                  label: 'Hapus',
                  icon: <span className="text-red-400">✕</span>,
                  onClick: onDelete,
                  danger: true,
                }]}
              />
            </div>
          )}
        </div>
        {meta && <p className="sert-folder-meta">{meta}</p>}
      </div>
    </div>
  )
}

// ── Grid skeleton ─────────────────────────────────────────────────────────────

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

// ── Tambah modal ──────────────────────────────────────────────────────────────

const BLANK_FORM = {
  nama: '', towerId: '', tipe: 'Electrical',
  tahun: String(new Date().getFullYear()), keterangan: '',
}

function TambahModal({
  open, onClose, onSaved, towerOptions,
}: {
  open: boolean; onClose: () => void; onSaved: () => void;
  towerOptions: { value: string; label: string }[]
}) {
  const [form, setForm] = useState(BLANK_FORM)
  const [files, setFiles] = useState<File[]>([])
  const [saving, setSaving] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  function ingestFiles(list: File[]) {
    const allowed = ['pdf', 'dwg', 'dxf']
    const validFmt = list.filter((f) => allowed.includes((f.name.split('.').pop() ?? '').toLowerCase()))
    const skipped = list.length - validFmt.length
    if (skipped > 0) toast.error(`${skipped} file dilewati (format tidak didukung)`)
    const accepted: File[] = []
    const rejected: string[] = []
    for (const f of validFmt) {
      if (f.size > MAX_FILE_SIZE_BYTES) rejected.push(f.name)
      else accepted.push(f)
    }
    if (rejected.length) toast.error(`${rejected.length} file melebihi 10MB: ${rejected.join(', ')}`)
    if (accepted.length) setFiles((prev) => [...prev, ...accepted])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nama.trim()) { toast.error('Nama folder wajib diisi'); return }
    setSaving(true)
    try {
      const res = await asBuiltApi.create({
        nama: form.nama,
        tipe: form.tipe,
        tahun: form.tahun,
        ...(form.towerId && { towerId: form.towerId }),
        ...(form.keterangan && { keterangan: form.keterangan }),
      })
      if (files.length) {
        const compressed = await compressFiles(files)
        await asBuiltApi.uploadFiles(res.data.id, compressed)
      }
      toast.success('Folder berhasil dibuat')
      onSaved(); onClose()
      setForm(BLANK_FORM); setFiles([])
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
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Nama Folder <span className="text-red-500">*</span></label>
            <input type="text" value={form.nama} onChange={(e) => set('nama', e.target.value)} className="form-input" placeholder="cth. ABD Tower ST-001 Electrical" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-app-text mb-1.5">Tipe</label>
              <select value={form.tipe} onChange={(e) => set('tipe', e.target.value)} className="form-input">
                {TIPE_OPTIONS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-app-text mb-1.5">Tahun</label>
              <select value={form.tahun} onChange={(e) => set('tahun', e.target.value)} className="form-input">
                {YEAR_OPTIONS.map((y) => <option key={y}>{y}</option>)}
              </select>
            </div>
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
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">
              Upload Dokumen (opsional)
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              onDragEnter={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={(e) => {
                if (e.currentTarget.contains(e.relatedTarget as Node)) return
                setDragOver(false)
              }}
              onDrop={(e) => {
                e.preventDefault()
                setDragOver(false)
                ingestFiles(Array.from(e.dataTransfer.files ?? []))
              }}
              className={`border-2 border-dashed rounded-xl py-6 flex flex-col items-center gap-1.5 cursor-pointer transition-colors ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-app-border hover:border-blue-300 hover:bg-app-bg'}`}
            >
              <Upload size={20} className={dragOver ? 'text-blue-500' : 'text-app-muted'} />
              <p className="text-[13px] text-app-muted">
                {dragOver
                  ? 'Lepaskan file di sini'
                  : files.length ? `${files.length} file dipilih` : 'Klik atau drag & drop PDF/DWG/DXF (bisa banyak)'}
              </p>
              {!files.length && !dragOver && (
                <p className="text-[11px] text-app-muted">Maks 10MB/file — PDF dikompres otomatis</p>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept=".pdf,.dwg,.dxf"
              className="hidden"
              onChange={(e) => {
                ingestFiles(Array.from(e.target.files ?? []))
                if (fileRef.current) fileRef.current.value = ''
              }}
            />
            {files.length > 0 && (
              <ul className="mt-2 space-y-1">
                {files.map((f, i) => (
                  <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-2 px-3 py-1.5 bg-app-bg rounded-lg text-[12px]">
                    <span className="truncate text-app-text">{f.name}</span>
                    <button
                      type="button"
                      onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                      className="p-0.5 rounded hover:bg-white text-app-muted shrink-0"
                    >
                      <X size={12} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
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
  const router = useRouter()
  const [allRows, setAllRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [tambahOpen, setTambahOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [isAdminUser, setIsAdminUser] = useState(false)

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [filterOpen, setFilterOpen] = useState(false)
  const [tipeFilter, setTipeFilter] = useState<string[]>([])
  const [tahunFilter, setTahunFilter] = useState<string[]>([])
  const [towerFilter, setTowerFilter] = useState<string[]>([])
  const [towers, setTowers] = useState<any[]>([])

  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setIsAdminUser(isAdminOrSuperadmin()) }, [])

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

  useEffect(() => { setPage(1) }, [search, tipeFilter, tahunFilter, towerFilter])

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
      const params: any = { limit: 9999 }
      if (tipeFilter.length === 1) params.tipe = tipeFilter[0]
      if (tahunFilter.length === 1) params.tahun = tahunFilter[0]
      if (towerFilter.length === 1) params.towerId = towerFilter[0]
      const res = await asBuiltApi.getAll(params)
      const p = res.data
      setAllRows(Array.isArray(p) ? p : (p.data ?? []))
    } catch {
      setAllRows([])
    } finally {
      setLoading(false)
    }
  }, [tipeFilter, tahunFilter, towerFilter])

  useEffect(() => { fetchData() }, [fetchData])

  const filteredRows = useMemo(() => {
    let result = allRows

    if (search.trim()) {
      const lower = search.toLowerCase()
      result = result.filter((row) =>
        (row.nama ?? '').toLowerCase().includes(lower) ||
        (row.namaFile ?? '').toLowerCase().includes(lower) ||
        (row.tower?.nomorTower ?? '').toLowerCase().includes(lower) ||
        (row.tower?.nama ?? '').toLowerCase().includes(lower) ||
        (row.towerId ?? '').toLowerCase().includes(lower) ||
        (row.tipe ?? '').toLowerCase().includes(lower)
      )
    }

    if (tipeFilter.length > 1) {
      result = result.filter((row) => tipeFilter.includes(row.tipe))
    }
    if (tahunFilter.length > 1) {
      result = result.filter((row) => tahunFilter.includes(String(row.tahun)))
    }
    if (towerFilter.length > 1) {
      result = result.filter((row) => towerFilter.includes(row.towerId))
    }

    return result
  }, [allRows, search, tipeFilter, tahunFilter, towerFilter])

  const total = filteredRows.length
  const displayRows = filteredRows.slice((page - 1) * limit, page * limit)

  async function confirmDelete() {
    if (!deleteId) return
    setDeleting(true)
    try {
      await asBuiltApi.deleteFolder(deleteId)
      toast.success('Folder dihapus')
      setDeleteId(null)
      fetchData()
    } catch {
      toast.error('Gagal menghapus folder')
    } finally {
      setDeleting(false)
    }
  }

  const hasActiveFilter = tipeFilter.length > 0 || tahunFilter.length > 0 || towerFilter.length > 0

  function resetFilters() {
    setTipeFilter([])
    setTahunFilter([])
    setTowerFilter([])
  }

  return (
    <>
      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          {/* Search */}
          <div className="flex items-center gap-3 px-4 py-[11px] bg-white border border-[#E1E8EC] rounded-lg flex-1 min-w-0">
            <Search size={16} className="text-[#5F737F] shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama folder atau tower"
              className="border-none outline-none font-medium text-[14px] text-[#1C1C1C] bg-transparent w-full min-w-0 placeholder:text-[#97AAB3]"
            />
          </div>

          {/* Filter button + popup */}
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
                  {/* Tipe */}
                  <div className="px-4 py-3 flex flex-col gap-2.5">
                    <span className="font-bold text-[14px] text-[#1C1C1C]">Tipe</span>
                    <div className="flex flex-wrap gap-2">
                      {TIPE_OPTIONS.map((t) => {
                        const active = tipeFilter.includes(t)
                        return (
                          <button
                            key={t}
                            onClick={() => setTipeFilter(active ? tipeFilter.filter((v) => v !== t) : [...tipeFilter, t])}
                            className={`px-3 py-1 rounded-full border text-[12px] font-medium transition-all ${active ? 'bg-[#076C9E] border-[#076C9E] text-white' : 'border-[#E1E8EC] text-[#5F737F] hover:border-[#076C9E]'}`}
                          >{t}</button>
                        )
                      })}
                    </div>
                  </div>
                  <div className="h-px bg-[#E1E8EC]" />

                  {/* Tahun */}
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

                  {/* Tower */}
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

        {/* View toggle */}
        <div className="flex items-center bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setViewMode('grid')}
            title="Grid view"
            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-app-text' : 'text-app-muted hover:text-app-text'}`}
          >
            <LayoutGrid size={15} />
          </button>
          <button
            onClick={() => setViewMode('table')}
            title="Table view"
            className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white shadow-sm text-app-text' : 'text-app-muted hover:text-app-text'}`}
          >
            <List size={15} />
          </button>
        </div>

        {isAdminUser && (
          <button onClick={() => setTambahOpen(true)} className="btn-primary shrink-0">
            <Plus size={16} /> Tambah Dokumen
          </button>
        )}
      </div>

      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-1.5 text-[13px] text-app-muted mb-5">
        <span className="font-medium text-app-text">Beranda</span>
      </div>

      {/* ── Grid view ── */}
      {viewMode === 'grid' ? (
        <>
          {loading ? (
            <div className="sert-grid">
              <GridSkeleton count={Math.min(limit, 20)} />
            </div>
          ) : displayRows.length === 0 ? (
            <div className="card p-10 text-center text-app-muted text-[13px]">
              Belum ada dokumen{hasActiveFilter ? ' yang sesuai filter' : ''}.
            </div>
          ) : (
            <div className="sert-grid">
              {displayRows.map((row) => (
                <FolderCard
                  key={row.id}
                  row={row}
                  isAdminUser={isAdminUser}
                  onClick={() => router.push(`/as-built-drawing/${row.id}`)}
                  onDelete={() => setDeleteId(row.id)}
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
        </>
      ) : (
        /* ── Table view ── */
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tower</th>
                  <th>Nama</th>
                  <th>Tipe</th>
                  <th>Tahun</th>
                  <th>File</th>
                  <th className="text-right pr-5">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <SkeletonRow cols={6} rows={limit} />
                ) : displayRows.length === 0 ? (
                  <tr><td colSpan={6}><EmptyState title="Belum ada data As Built Drawing." /></td></tr>
                ) : (
                  displayRows.map((row) => (
                    <tr key={row.id}>
                      <td><span className="font-mono text-[12px] text-blue-600 font-semibold">{row.tower?.nomorTower ?? row.tower?.nama ?? row.towerId ?? '—'}</span></td>
                      <td className="font-semibold text-app-text">{row.nama ?? row.namaFile ?? '—'}</td>
                      <td className="text-app-muted">{row.tipe ?? '—'}</td>
                      <td className="font-mono text-[12px]">{row.tahun ?? '—'}</td>
                      <td className="text-[12px] text-app-muted">{row._count?.dokumen ?? 0} file</td>
                      <td className="text-right pr-4">
                        <ActionMenu items={[
                          {
                            label: 'Buka Folder',
                            icon: <FolderOpen size={14} />,
                            onClick: () => router.push(`/as-built-drawing/${row.id}`),
                          },
                          ...(isAdminUser ? [{
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
          <Pagination
            total={total} page={page} limit={limit}
            onChange={setPage}
            onLimitChange={(l) => { setLimit(l); setPage(1) }}
          />
        </div>
      )}

      <TambahModal
        open={tambahOpen}
        onClose={() => setTambahOpen(false)}
        onSaved={fetchData}
        towerOptions={towerOptions}
      />
      <ConfirmModal
        isOpen={!!deleteId}
        title="Hapus Folder?"
        message="Folder beserta semua dokumen di dalamnya akan dihapus permanen."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
        confirmLabel="Ya, Hapus"
      />
    </>
  )
}
