'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { cuiApi, towersApi } from '@/lib/api'
import { isAdminOrSuperadmin } from '@/lib/auth'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ActionMenu } from '@/components/ui/ActionMenu'
import { Pagination } from '@/components/ui/Pagination'
import { SearchInput } from '@/components/ui/SearchInput'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonRow } from '@/components/ui/SkeletonRow'

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'selesai',             label: 'Selesai' },
  { value: 'sedang_berlangsung',  label: 'Sedang Berlangsung' },
  { value: 'tidak_ada_aktifitas', label: 'Tidak Ada Aktifitas' },
]

const STATUS_LABEL = Object.fromEntries(STATUS_OPTIONS.map((s) => [s.value, s.label]))

function toDateInput(iso: string | undefined) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

function fmtDate(iso: string | undefined) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

// ── Form drawer ───────────────────────────────────────────────────────────────

function CUIDrawer({
  open, initial, onClose, onSaved,
}: {
  open: boolean
  initial: any | null
  onClose: () => void
  onSaved: () => void
}) {
  const [towers, setTowers] = useState<any[]>([])
  const [form, setForm] = useState({
    towerId: '',
    tanggal: new Date().toISOString().slice(0, 10),
    keterangan: '',
    status: 'sedang_berlangsung',
  })
  const [saving, setSaving] = useState(false)
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  useEffect(() => {
    towersApi.getDropdown().then((r) => setTowers(r.data ?? [])).catch(() => {})
  }, [])

  useEffect(() => {
    if (!open) return
    if (initial) {
      setForm({
        towerId:    initial.towerId ?? initial.tower?.id ?? '',
        tanggal:    toDateInput(initial.tanggal),
        keterangan: initial.keterangan ?? '',
        status:     initial.status ?? 'sedang_berlangsung',
      })
    } else {
      setForm({
        towerId: '',
        tanggal: new Date().toISOString().slice(0, 10),
        keterangan: '',
        status: 'sedang_berlangsung',
      })
    }
  }, [open, initial])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.towerId)  { toast.error('Pilih penghantar'); return }
    if (!form.tanggal)  { toast.error('Tanggal wajib diisi'); return }
    setSaving(true)
    try {
      const payload = {
        towerId: form.towerId,
        tanggal: new Date(form.tanggal).toISOString(),
        keterangan: form.keterangan || undefined,
        status: form.status,
      }
      if (initial?.id) await cuiApi.update(initial.id, payload)
      else             await cuiApi.create(payload)
      toast.success(initial ? 'CUI diperbarui' : 'CUI ditambahkan')
      onSaved()
      onClose()
    } catch (err: any) {
      const msg = err?.response?.data?.message
      toast.error(Array.isArray(msg) ? msg.join(', ') : (msg || 'Gagal menyimpan'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 flex flex-col bg-white shadow-2xl transition-transform duration-300 w-full sm:w-[420px] md:w-[480px] ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-app-border shrink-0">
          <h2 className="text-[15px] font-bold text-app-text">
            {initial ? 'Edit CUI' : 'Tambah CUI'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-app-bg text-app-muted">
            <X size={18} />
          </button>
        </div>
        <form id="cui-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">
              Penghantar <span className="text-red-500">*</span>
            </label>
            <select
              value={form.towerId}
              onChange={(e) => set('towerId', e.target.value)}
              className="form-input"
            >
              <option value="">Pilih penghantar...</option>
              {towers.map((t: any) => (
                <option key={t.id} value={t.id}>{t.nama ?? t.nomorTower ?? t.id}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">
              Tanggal <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.tanggal}
              onChange={(e) => set('tanggal', e.target.value)}
              className="form-input"
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">
              Keterangan
            </label>
            <textarea
              rows={4}
              value={form.keterangan}
              onChange={(e) => set('keterangan', e.target.value)}
              className="form-input resize-none"
              placeholder="Opsional"
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => set('status', e.target.value)}
              className="form-input"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </form>
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-app-border shrink-0">
          <button type="button" onClick={onClose} className="btn-outline">Batal</button>
          <button type="submit" form="cui-form" disabled={saving} className="btn-primary">
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CUIPage() {
  const [rows, setRows]       = useState<any[]>([])
  const [total, setTotal]     = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
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
      const res = await cuiApi.getAll({ page, limit, search: q || undefined })
      const p = res.data
      setRows(p?.data ?? [])
      setTotal(p?.total ?? 0)
    } catch {
      setRows([]); setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [page, limit, q])

  useEffect(() => { fetchData() }, [fetchData])

  async function confirmDelete() {
    if (!deleteId) return
    setDeleting(true)
    try {
      await cuiApi.delete(deleteId)
      toast.success('CUI dihapus')
      setDeleteId(null)
      fetchData()
    } catch (err: any) {
      const msg = err?.response?.data?.message
      toast.error(Array.isArray(msg) ? msg.join(', ') : (msg || 'Gagal menghapus'))
    } finally {
      setDeleting(false)
    }
  }

  const userIsAdmin = isAdminOrSuperadmin()

  return (
    <>
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <h1 className="text-xl md:text-2xl font-bold text-app-text">Climb Up Inspection</h1>
        <button onClick={() => { setEditRow(null); setDrawerOpen(true) }} className="btn-primary">
          <Plus size={16} /> Tambah CUI
        </button>
      </div>

      <div className="card card-body mb-4">
        <SearchInput
          value={search}
          onChange={(v) => { setSearch(v); setPage(1) }}
          placeholder="Cari penghantar atau keterangan"
        />
      </div>

      {/* Desktop/tablet table */}
      <div className="card overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Penghantar</th>
                <th>Tanggal</th>
                <th>Keterangan</th>
                <th>Status</th>
                <th className="text-right pr-5">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? <SkeletonRow cols={5} rows={limit} />
                : rows.length === 0
                  ? <tr><td colSpan={5}><EmptyState title="Belum ada CUI" /></td></tr>
                  : rows.map((row) => (
                    <tr key={row.id}>
                      <td className="font-semibold text-[13px] text-app-text">
                        {row.tower?.nama ?? '—'}
                      </td>
                      <td className="text-[12px] text-app-muted whitespace-nowrap">
                        {fmtDate(row.tanggal)}
                      </td>
                      <td className="max-w-[280px] truncate text-[12px] text-app-muted">
                        {row.keterangan ?? '—'}
                      </td>
                      <td><StatusBadge status={row.status?.toLowerCase()} /></td>
                      <td className="text-right pr-4">
                        <ActionMenu items={[
                          { label: 'Edit', icon: <Pencil size={14} />, onClick: () => { setEditRow(row); setDrawerOpen(true) } },
                          ...(userIsAdmin ? [{ label: 'Hapus', icon: <Trash2 size={14} />, onClick: () => setDeleteId(row.id), danger: true, dividerBefore: true }] : []),
                        ]} />
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
        <Pagination total={total} page={page} limit={limit} onChange={setPage} onLimitChange={setLimit} />
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="card card-body text-center text-app-muted text-sm">Memuat…</div>
        ) : rows.length === 0 ? (
          <div className="card"><EmptyState title="Belum ada CUI" /></div>
        ) : rows.map((row) => (
          <div key={row.id} className="card card-body">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0">
                <div className="font-semibold text-[14px] text-app-text truncate">{row.tower?.nama ?? '—'}</div>
                <div className="text-[12px] text-app-muted">{fmtDate(row.tanggal)}</div>
              </div>
              <ActionMenu items={[
                { label: 'Edit', icon: <Pencil size={14} />, onClick: () => { setEditRow(row); setDrawerOpen(true) } },
                ...(userIsAdmin ? [{ label: 'Hapus', icon: <Trash2 size={14} />, onClick: () => setDeleteId(row.id), danger: true, dividerBefore: true }] : []),
              ]} />
            </div>
            {row.keterangan && (
              <p className="text-[12px] text-app-muted mb-2 line-clamp-3">{row.keterangan}</p>
            )}
            <StatusBadge status={row.status?.toLowerCase()} />
          </div>
        ))}
        <div className="card card-body">
          <Pagination total={total} page={page} limit={limit} onChange={setPage} onLimitChange={setLimit} />
        </div>
      </div>

      <CUIDrawer open={drawerOpen} initial={editRow} onClose={() => setDrawerOpen(false)} onSaved={fetchData} />
      <ConfirmModal
        isOpen={!!deleteId}
        title="Hapus CUI?"
        message="Data CUI ini akan dihapus permanen."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
        confirmLabel="Ya, Hapus"
      />
    </>
  )
}
