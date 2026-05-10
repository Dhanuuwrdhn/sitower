'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Plus, Upload, FolderOpen, X, SlidersHorizontal, LayoutGrid, List, Search } from 'lucide-react'
import { asBuiltApi } from '@/lib/api'
import { isAdmin } from '@/lib/auth'
import { ActionMenu } from '@/components/ui/ActionMenu'
import { Pagination } from '@/components/ui/Pagination'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonRow } from '@/components/ui/SkeletonRow'

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

// ── Filter popup ──────────────────────────────────────────────────────────────

function FilterPopup({
  open, onClose,
  pendingTipe, setPendingTipe,
  pendingTahun, setPendingTahun,
  pendingTowerId, setPendingTowerId,
  onApply, onClear,
}: {
  open: boolean; onClose: () => void
  pendingTipe: string[]; setPendingTipe: (v: string[]) => void
  pendingTahun: string; setPendingTahun: (v: string) => void
  pendingTowerId: string; setPendingTowerId: (v: string) => void
  onApply: () => void; onClear: () => void
}) {
  if (!open) return null

  const toggleTipe = (t: string) =>
    setPendingTipe(pendingTipe.includes(t) ? pendingTipe.filter(x => x !== t) : [...pendingTipe, t])

  return (
    <div className="absolute right-0 top-full mt-2 z-30 bg-white rounded-2xl shadow-xl border border-app-border w-72" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-app-border">
        <span className="text-[14px] font-bold text-app-text">Filter</span>
        <button onClick={onClose} className="p-1 rounded hover:bg-app-bg text-app-muted"><X size={16} /></button>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Tipe */}
        <div>
          <p className="text-[12px] font-semibold text-app-text mb-2">Tipe</p>
          <div className="flex flex-wrap gap-1.5">
            {TIPE_OPTIONS.map(t => (
              <button
                key={t}
                onClick={() => toggleTipe(t)}
                className={`px-3 py-1 rounded-full text-[12px] font-medium border transition-colors ${pendingTipe.includes(t)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-app-text border-app-border hover:border-blue-300'
                  }`}
              >{t}</button>
            ))}
          </div>
        </div>

        <hr className="border-app-border" />

        {/* Tahun */}
        <div>
          <p className="text-[12px] font-semibold text-app-text mb-2">Tahun</p>
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
            {YEAR_OPTIONS.map((y) => (
              <button
                key={y}
                onClick={() => setPendingTahun(pendingTahun === y ? '' : y)}
                className={`px-3 py-1 rounded-full text-[12px] font-medium border transition-colors ${pendingTahun === y
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-app-text border-app-border hover:border-blue-300'
                  }`}
              >{y}</button>
            ))}
          </div>
        </div>

        <hr className="border-app-border" />

        {/* Tower ID */}
        <div>
          <p className="text-[12px] font-semibold text-app-text mb-2">ID Tower</p>
          <input
            type="text"
            placeholder="cth. T-001"
            value={pendingTowerId}
            onChange={(e) => setPendingTowerId(e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      <hr className="border-app-border" />
      <div className="flex gap-2 px-5 py-3.5">
        <button onClick={onApply} className="btn-primary flex-1 text-[13px]">Terapkan Filter</button>
        <button onClick={onClear} className="btn-outline flex-1 text-[13px]">Hapus Filter</button>
      </div>
    </div>
  )
}

// ── Tambah modal ──────────────────────────────────────────────────────────────

const BLANK_FORM = {
  nama: '', towerId: '', tipe: 'Electrical',
  tahun: String(new Date().getFullYear()), keterangan: '',
}

function TambahModal({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState(BLANK_FORM)
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

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
      if (file) await asBuiltApi.uploadFile(res.data.id, file)
      toast.success('Folder berhasil dibuat')
      onSaved(); onClose()
      setForm(BLANK_FORM); setFile(null)
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
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">ID Tower (opsional)</label>
            <input type="text" value={form.towerId} onChange={(e) => set('towerId', e.target.value)} className="form-input" placeholder="cth. ST-001" />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Upload Dokumen (opsional)</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-app-border rounded-xl py-6 flex flex-col items-center gap-1.5 cursor-pointer hover:border-blue-300 hover:bg-app-bg transition-colors"
            >
              <Upload size={20} className="text-app-muted" />
              <p className="text-[13px] text-app-muted">{file ? file.name : 'Klik untuk upload PDF/DWG/DXF'}</p>
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
  const [pendingTipe, setPendingTipe] = useState<string[]>([])
  const [pendingTahun, setPendingTahun] = useState('')
  const [pendingTowerId, setPendingTowerId] = useState('')
  const [appliedTipe, setAppliedTipe] = useState<string[]>([])
  const [appliedTahun, setAppliedTahun] = useState('')
  const [appliedTowerId, setAppliedTowerId] = useState('')

  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setIsAdminUser(isAdmin()) }, [])

  useEffect(() => { setPage(1) }, [search, appliedTipe, appliedTahun, appliedTowerId])

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
      if (appliedTipe.length === 1) params.tipe = appliedTipe[0]
      if (appliedTahun) params.tahun = appliedTahun
      if (appliedTowerId) params.towerId = appliedTowerId
      const res = await asBuiltApi.getAll(params)
      const p = res.data
      setAllRows(Array.isArray(p) ? p : (p.data ?? []))
    } catch {
      setAllRows([])
    } finally {
      setLoading(false)
    }
  }, [appliedTipe, appliedTahun, appliedTowerId])

  useEffect(() => { fetchData() }, [fetchData])

  const filteredRows = useMemo(() => {
    let result = allRows

    if (search.trim()) {
      const lower = search.toLowerCase()
      result = result.filter((row) =>
        (row.namaFile ?? '').toLowerCase().includes(lower) ||
        (row.tower?.nomorTower ?? '').toLowerCase().includes(lower) ||
        (row.towerId ?? '').toLowerCase().includes(lower) ||
        (row.tipe ?? '').toLowerCase().includes(lower)
      )
    }

    // Client-side tipe for multi-select (API only accepts one at a time)
    if (appliedTipe.length > 1) {
      result = result.filter((row) => appliedTipe.includes(row.tipe))
    }

    return result
  }, [allRows, search, appliedTipe])

  const total = filteredRows.length
  const displayRows = filteredRows.slice((page - 1) * limit, page * limit)

  function applyFilter() {
    setAppliedTipe(pendingTipe)
    setAppliedTahun(pendingTahun)
    setAppliedTowerId(pendingTowerId)
    setFilterOpen(false)
  }

  function clearFilter() {
    setPendingTipe([]); setPendingTahun(''); setPendingTowerId('')
    setAppliedTipe([]); setAppliedTahun(''); setAppliedTowerId('')
    setFilterOpen(false)
  }

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

  const hasActiveFilter = appliedTipe.length > 0 || !!appliedTahun || !!appliedTowerId

  return (
    <>
      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          {/* Search */}
          <div className="sert-search-wrap flex-1">
            <Search size={15} className="sert-search-icon" />
            <input
              className="sert-search-input"
              placeholder="Cari nama file atau tower…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter button + popup */}
          <div ref={filterRef} className="relative">
            <button
              className={`sert-filter-btn ${hasActiveFilter ? 'sert-filter-btn--active' : ''}`}
              onClick={() => {
                if (!filterOpen) {
                  setPendingTipe(appliedTipe)
                  setPendingTahun(appliedTahun)
                  setPendingTowerId(appliedTowerId)
                }
                setFilterOpen((v) => !v)
              }}
            >
              <SlidersHorizontal size={16} />
            </button>
            <FilterPopup
              open={filterOpen}
              onClose={() => setFilterOpen(false)}
              pendingTipe={pendingTipe}
              setPendingTipe={setPendingTipe}
              pendingTahun={pendingTahun}
              setPendingTahun={setPendingTahun}
              pendingTowerId={pendingTowerId}
              setPendingTowerId={setPendingTowerId}
              onApply={applyFilter}
              onClear={clearFilter}
            />
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
                      <td><span className="font-mono text-[12px] text-blue-600 font-semibold">{row.tower?.nomorTower ?? row.towerId ?? '—'}</span></td>
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

      <TambahModal open={tambahOpen} onClose={() => setTambahOpen(false)} onSaved={fetchData} />
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
