'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Eye, Pencil, Trash2, X, Search, SlidersHorizontal } from 'lucide-react'
import { laporanApi, towersApi } from '@/lib/api'
import { getUser, isAdmin } from '@/lib/auth'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ActionMenu } from '@/components/ui/ActionMenu'
import { Pagination } from '@/components/ui/Pagination'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonRow } from '@/components/ui/SkeletonRow'

const JENIS_OPTIONS  = ['Isolator Suspensi', 'Isolator Tumpu', 'Jumper', 'Konduktor', 'Fitting']
const STATUS_OPTIONS = ['berlangsung', 'ditangani', 'pemantauan', 'eskalasi', 'menunggu', 'selesai']

// ── Filter popup ──────────────────────────────────────────────────────────────

function FilterPopup({
  open, onClose,
  pendingJenis, setPendingJenis,
  pendingStatus, setPendingStatus,
  onApply, onClear,
}: {
  open: boolean; onClose: () => void
  pendingJenis: string[]; setPendingJenis: (v: string[]) => void
  pendingStatus: string[]; setPendingStatus: (v: string[]) => void
  onApply: () => void; onClear: () => void
}) {
  if (!open) return null

  const toggleJenis  = (j: string) =>
    setPendingJenis(pendingJenis.includes(j) ? pendingJenis.filter(x => x !== j) : [...pendingJenis, j])
  const toggleStatus = (s: string) =>
    setPendingStatus(pendingStatus.includes(s) ? pendingStatus.filter(x => x !== s) : [...pendingStatus, s])

  return (
    <div className="absolute left-0 top-full mt-2 w-[320px] bg-white rounded-2xl shadow-xl border border-gray-100 z-50 p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[15px] font-bold text-app-text">Filter</span>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-50 text-app-muted">
          <X size={16} />
        </button>
      </div>

      <div className="mb-4">
        <p className="text-[11px] font-bold text-app-text uppercase tracking-wider mb-2.5">Jenis Cleanup</p>
        <div className="flex flex-wrap gap-1.5">
          {JENIS_OPTIONS.map(j => (
            <button
              key={j}
              onClick={() => toggleJenis(j)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
                pendingJenis.includes(j)
                  ? 'bg-[#0891b2] text-white border-[#0891b2]'
                  : 'bg-white text-app-text border-gray-200 hover:border-gray-300'
              }`}
            >
              {j}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <p className="text-[11px] font-bold text-app-text uppercase tracking-wider mb-2.5">Status</p>
        <div className="flex flex-wrap gap-1.5">
          {STATUS_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => toggleStatus(s)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
                pendingStatus.includes(s)
                  ? 'bg-[#0891b2] text-white border-[#0891b2]'
                  : 'bg-white text-app-text border-gray-200 hover:border-gray-300'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onApply}
          className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white hover:opacity-90 transition"
          style={{ background: '#0891b2' }}
        >
          Terapkan Filter
        </button>
        <button
          onClick={onClear}
          className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-red-500 border border-red-400 hover:bg-red-50 transition"
        >
          Hapus Filter
        </button>
      </div>
    </div>
  )
}

// ── Drawer ────────────────────────────────────────────────────────────────────

function CleanupDrawer({ open, initial, onClose, onSaved }: { open: boolean; initial: any | null; onClose: () => void; onSaved: () => void }) {
  const user = getUser()
  const [towers, setTowers] = useState<any[]>([])
  const [form, setForm] = useState({
    towerId: '', tanggalWaktu: new Date().toISOString().slice(0, 16),
    teknisi: '', noSpk: '', jenisCleanup: 'Isolator Suspensi',
    status: 'berlangsung', deskripsi: '',
  })
  const [saving, setSaving] = useState(false)
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  useEffect(() => {
    towersApi.getDropdown().then((r) => setTowers(r.data ?? [])).catch(() => {})
  }, [])

  useEffect(() => {
    if (open) {
      setForm(initial ? {
        towerId: initial.towerId ?? '', tanggalWaktu: initial.tanggal?.slice(0, 16) ?? new Date().toISOString().slice(0, 16),
        teknisi: initial.teknisi ?? '', noSpk: initial.noSpk ?? '',
        jenisCleanup: initial.jenisCleanup ?? 'Isolator Suspensi',
        status: initial.status ?? 'berlangsung', deskripsi: initial.deskripsi ?? '',
      } : {
        towerId: '', tanggalWaktu: new Date().toISOString().slice(0, 16),
        teknisi: '', noSpk: '', jenisCleanup: 'Isolator Suspensi',
        status: 'berlangsung', deskripsi: '',
      })
    }
  }, [open, initial])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.towerId) { toast.error('Pilih tower'); return }
    setSaving(true)
    try {
      const payload = { ...form, jenisGangguan: 'cleanup', tanggal: form.tanggalWaktu }
      if (initial?.id) await laporanApi.update(initial.id, payload)
      else await laporanApi.create(payload)
      toast.success(initial ? 'Laporan diperbarui' : 'Laporan ditambahkan')
      onSaved(); onClose()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Gagal menyimpan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed top-0 right-0 bottom-0 z-50 flex flex-col bg-white shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`} style={{ width: 520 }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-app-border shrink-0">
          <h2 className="text-[15px] font-bold text-app-text">{initial ? 'Edit Laporan Cleanup' : 'Tambah Laporan Cleanup'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-app-bg text-app-muted"><X size={18} /></button>
        </div>
        <form id="cleanup-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Tower <span className="text-red-500">*</span></label>
            <select value={form.towerId} onChange={(e) => set('towerId', e.target.value)} className="form-input">
              <option value="">Pilih tower...</option>
              {towers.map((t: any) => <option key={t.id} value={t.id}>{t.nomorTower}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Tanggal & Waktu</label>
            <input type="datetime-local" value={form.tanggalWaktu} onChange={(e) => set('tanggalWaktu', e.target.value)} className="form-input" />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Teknisi</label>
            <input type="text" value={form.teknisi} onChange={(e) => set('teknisi', e.target.value)} className="form-input" placeholder="Nama teknisi pelaksana" />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Jenis Cleanup</label>
            <select value={form.jenisCleanup} onChange={(e) => set('jenisCleanup', e.target.value)} className="form-input">
              {JENIS_OPTIONS.map((j) => <option key={j}>{j}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">No. SPK</label>
            <input type="text" value={form.noSpk} onChange={(e) => set('noSpk', e.target.value)} className="form-input" placeholder="Nomor surat perintah kerja" />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Status</label>
            <select value={form.status} onChange={(e) => set('status', e.target.value)} className="form-input">
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Deskripsi</label>
            <textarea rows={3} value={form.deskripsi} onChange={(e) => set('deskripsi', e.target.value)} className="form-input resize-none" />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Pelapor</label>
            <input type="text" value={user?.nama ?? '—'} readOnly className="form-input bg-app-bg text-app-muted cursor-not-allowed" />
          </div>
        </form>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-app-border shrink-0">
          <button type="button" onClick={onClose} className="btn-outline">Batal</button>
          <button type="submit" form="cleanup-form" disabled={saving} className="btn-primary">
            {saving ? 'Menyimpan...' : 'Simpan Laporan'}
          </button>
        </div>
      </div>
    </>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CleanupPage() {
  const [allRows, setAllRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [page, setPage]       = useState(1)
  const [limit, setLimit]     = useState(10)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editRow, setEditRow]       = useState<any | null>(null)
  const [deleteId, setDeleteId]     = useState<string | null>(null)
  const [deleting, setDeleting]     = useState(false)

  const [filterOpen, setFilterOpen]       = useState(false)
  const [pendingJenis, setPendingJenis]   = useState<string[]>([])
  const [pendingStatus, setPendingStatus] = useState<string[]>([])
  const [appliedJenis, setAppliedJenis]   = useState<string[]>([])
  const [appliedStatus, setAppliedStatus] = useState<string[]>([])
  const filterRef = useRef<HTMLDivElement>(null)

  // Reset page on search or filter change
  useEffect(() => { setPage(1) }, [search, appliedJenis, appliedStatus])

  // Close filter popup on outside click
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

  // Fetch all data once; search + filter handled client-side
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await laporanApi.getAll({ jenisGangguan: 'cleanup', limit: 9999 })
      const p = res.data
      setAllRows(Array.isArray(p) ? p : (p.data ?? []))
    } catch {
      setAllRows([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  // Client-side filtering
  const filteredRows = useMemo(() => {
    let result = allRows

    if (search.trim()) {
      const lower = search.toLowerCase()
      result = result.filter((row) =>
        (row.tower?.nomorTower ?? '').toLowerCase().includes(lower) ||
        (row.teknisi ?? '').toLowerCase().includes(lower) ||
        (row.noSpk ?? '').toLowerCase().includes(lower) ||
        (row.jenisCleanup ?? '').toLowerCase().includes(lower)
      )
    }

    if (appliedJenis.length > 0) {
      result = result.filter((row) => appliedJenis.includes(row.jenisCleanup))
    }

    if (appliedStatus.length > 0) {
      result = result.filter((row) => appliedStatus.includes(row.status?.toLowerCase()))
    }

    return result
  }, [allRows, search, appliedJenis, appliedStatus])

  const total       = filteredRows.length
  const displayRows = filteredRows.slice((page - 1) * limit, page * limit)

  function applyFilter() {
    setAppliedJenis(pendingJenis)
    setAppliedStatus(pendingStatus)
    setFilterOpen(false)
  }

  function clearFilter() {
    setPendingJenis([]); setPendingStatus([])
    setAppliedJenis([]); setAppliedStatus([])
    setFilterOpen(false)
  }

  async function confirmDelete() {
    if (!deleteId) return
    setDeleting(true)
    try {
      await laporanApi.delete(deleteId)
      toast.success('Laporan dihapus')
      setDeleteId(null); fetchData()
    } catch { toast.error('Gagal menghapus') }
    finally { setDeleting(false) }
  }

  function fmt(iso: string) {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const hasActiveFilter   = appliedJenis.length > 0 || appliedStatus.length > 0
  const activeFilterCount = appliedJenis.length + appliedStatus.length

  return (
    <>
      {/* ── Toolbar ── */}
      <div className="flex items-center gap-2.5 mb-5 flex-wrap">

        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari tower, teknisi, atau SPK…"
            className="w-full pl-9 pr-3 h-10 text-[13px] rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] transition"
          />
        </div>

        {/* Filter button + popup */}
        <div ref={filterRef} className="relative">
          <button
            onClick={() => {
              if (!filterOpen) { setPendingJenis(appliedJenis); setPendingStatus(appliedStatus) }
              setFilterOpen((v) => !v)
            }}
            className={`relative flex items-center justify-center w-10 h-10 rounded-xl border transition ${
              hasActiveFilter
                ? 'border-[#0891b2] bg-[#0891b2]/10 text-[#0891b2]'
                : 'border-gray-200 bg-white text-app-muted hover:border-gray-300'
            }`}
          >
            <SlidersHorizontal size={16} />
            {hasActiveFilter && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#0891b2] text-white text-[9px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          <FilterPopup
            open={filterOpen}
            onClose={() => setFilterOpen(false)}
            pendingJenis={pendingJenis}
            setPendingJenis={setPendingJenis}
            pendingStatus={pendingStatus}
            setPendingStatus={setPendingStatus}
            onApply={applyFilter}
            onClear={clearFilter}
          />
        </div>

        <div className="flex-1" />

        <button onClick={() => { setEditRow(null); setDrawerOpen(true) }} className="btn-primary">
          <Plus size={16} /> Tambah Laporan
        </button>
      </div>

      {/* ── Table ── */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Tower</th>
                <th>Teknisi</th>
                <th>Jenis</th>
                <th>No SPK</th>
                <th>Status</th>
                <th className="text-right pr-5">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRow cols={7} rows={limit} />
              ) : displayRows.length === 0 ? (
                <tr><td colSpan={7}><EmptyState title="Belum ada laporan cleanup" /></td></tr>
              ) : (
                displayRows.map((row) => (
                  <tr key={row.id}>
                    <td className="text-[12px] text-app-muted">{fmt(row.tanggal)}</td>
                    <td><span className="font-mono text-[12px] text-blue-600 font-semibold">{row.tower?.nomorTower ?? '—'}</span></td>
                    <td>{row.teknisi ?? '—'}</td>
                    <td className="text-[12px] text-app-muted">{row.jenisCleanup ?? '—'}</td>
                    <td className="font-mono text-[12px]">{row.noSpk ?? '—'}</td>
                    <td><StatusBadge status={row.status?.toLowerCase()} /></td>
                    <td className="text-right pr-4">
                      <ActionMenu items={[
                        { label: 'Lihat Detail', icon: <Eye size={14} />, onClick: () => toast(`Detail: ${row.id}`, { icon: '👁' }) },
                        { label: 'Edit', icon: <Pencil size={14} />, onClick: () => { setEditRow(row); setDrawerOpen(true) } },
                        ...(isAdmin() ? [{ label: 'Hapus', icon: <Trash2 size={14} />, onClick: () => setDeleteId(row.id), danger: true, dividerBefore: true }] : []),
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

      <CleanupDrawer open={drawerOpen} initial={editRow} onClose={() => setDrawerOpen(false)} onSaved={fetchData} />
      <ConfirmModal isOpen={!!deleteId} title="Hapus Laporan Cleanup?" message="Laporan ini akan dihapus permanen." onConfirm={confirmDelete} onCancel={() => setDeleteId(null)} loading={deleting} confirmLabel="Ya, Hapus" />
    </>
  )
}
