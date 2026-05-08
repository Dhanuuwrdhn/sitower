'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Eye, Pencil, Trash2, X } from 'lucide-react'
import { laporanApi, towersApi } from '@/lib/api'
import { getUser, isAdmin } from '@/lib/auth'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ActionMenu } from '@/components/ui/ActionMenu'
import { Pagination } from '@/components/ui/Pagination'
import { SearchInput } from '@/components/ui/SearchInput'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonRow } from '@/components/ui/SkeletonRow'

const JENIS_CLEANUP = ['Semua', 'Isolator Suspensi', 'Isolator Tumpu', 'Jumper', 'Konduktor', 'Fitting']
const STATUS_OPTIONS = ['berlangsung', 'ditangani', 'pemantauan', 'eskalasi', 'menunggu', 'selesai']

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
              {JENIS_CLEANUP.filter((j) => j !== 'Semua').map((j) => <option key={j}>{j}</option>)}
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
  const [rows, setRows]       = useState<any[]>([])
  const [total, setTotal]     = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [jenis, setJenis]     = useState('')
  const [page, setPage]       = useState(1)
  const [limit, setLimit]     = useState(10)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editRow, setEditRow]       = useState<any | null>(null)
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
      const res = await laporanApi.getAll({
        jenisGangguan: 'cleanup', page, limit,
        search: q || undefined,
        jenisCleanup: jenis || undefined,
      })
      const p = res.data
      if (Array.isArray(p)) { setRows(p); setTotal(p.length) }
      else { setRows(p.data ?? []); setTotal(p.total ?? 0) }
    } catch {
      setRows([]); setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [page, limit, q, jenis])

  useEffect(() => { fetchData() }, [fetchData])

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

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-app-text">Clean Up Isolator</h1>
        <button onClick={() => { setEditRow(null); setDrawerOpen(true) }} className="btn-primary">
          <Plus size={16} /> Tambah Laporan
        </button>
      </div>

      <div className="card card-body mb-4 flex items-center gap-3 flex-wrap">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Cari tower atau teknisi" />
        <select value={jenis} onChange={(e) => { setJenis(e.target.value === 'Semua' ? '' : e.target.value); setPage(1) }} className="form-input w-auto pr-8" style={{ height: 40 }}>
          {JENIS_CLEANUP.map((j) => <option key={j} value={j === 'Semua' ? '' : j}>{j}</option>)}
        </select>
      </div>

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
              {loading ? <SkeletonRow cols={7} rows={limit} />
              : rows.length === 0 ? <tr><td colSpan={7}><EmptyState title="Belum ada laporan cleanup" /></td></tr>
              : rows.map((row) => (
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
              ))}
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
