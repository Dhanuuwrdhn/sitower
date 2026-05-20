'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, Search, SlidersHorizontal } from 'lucide-react'
import { cuiApi, towersApi } from '@/lib/api'
import { isAdminOrSuperadmin } from '@/lib/auth'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ActionMenu } from '@/components/ui/ActionMenu'
import { Pagination } from '@/components/ui/Pagination'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonRow } from '@/components/ui/SkeletonRow'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import { DatePicker } from '@/components/ui/DatePicker'

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'selesai',             label: 'Selesai' },
  { value: 'sedang_berlangsung',  label: 'Sedang Berlangsung' },
  { value: 'tidak_ada_aktifitas', label: 'Tidak Ada Aktifitas' },
]

function fmtDate(iso: string | undefined) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return `${dd}/${mm}/${yyyy} ${hh}:${mi}`
}

// ── Form drawer ───────────────────────────────────────────────────────────────

function CUIDrawer({
  open, initial, towers, onClose, onSaved,
}: {
  open: boolean
  initial: any | null
  towers: any[]
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState({
    towerId: '',
    tanggal: new Date().toISOString(),
    keterangan: '',
    status: 'sedang_berlangsung',
  })
  const [saving, setSaving] = useState(false)
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  useEffect(() => {
    if (!open) return
    if (initial) {
      setForm({
        towerId:    initial.towerId ?? initial.tower?.id ?? '',
        tanggal:    initial.tanggal ? new Date(initial.tanggal).toISOString() : new Date().toISOString(),
        keterangan: initial.keterangan ?? '',
        status:     initial.status ?? 'sedang_berlangsung',
      })
    } else {
      setForm({
        towerId: '',
        tanggal: new Date().toISOString(),
        keterangan: '',
        status: 'sedang_berlangsung',
      })
    }
  }, [open, initial])

  const towerOptions = useMemo(
    () => towers.map((t: any) => ({
      value: t.id as string,
      label: (t.nama ?? t.nomorTower ?? t.id) as string,
      sub: t.jalur ? `Jalur: ${t.jalur}` : undefined,
    })),
    [towers],
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.towerId)  { toast.error('Pilih penghantar'); return }
    if (!form.tanggal)  { toast.error('Tanggal wajib diisi'); return }
    setSaving(true)
    try {
      const payload = {
        towerId: form.towerId,
        tanggal: form.tanggal,
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
            <SearchableSelect
              label="Penghantar *"
              placeholder="Pilih penghantar..."
              options={towerOptions}
              values={form.towerId ? [form.towerId] : []}
              onChange={(vals) => set('towerId', vals[vals.length - 1] ?? '')}
              onClear={() => set('towerId', '')}
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">
              Tanggal & Jam <span className="text-red-500">*</span>
            </label>
            <DatePicker
              value={form.tanggal}
              onChange={(v) => set('tanggal', v)}
              placeholder="Pilih tanggal & jam"
              withTime
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
            <SearchableSelect
              label="Status"
              placeholder="Pilih status..."
              options={STATUS_OPTIONS}
              values={form.status ? [form.status] : []}
              onChange={(vals) => set('status', vals[vals.length - 1] ?? '')}
              onClear={() => set('status', '')}
            />
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
  const [towers, setTowers]         = useState<any[]>([])

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [jalurFilter, setJalurFilter]   = useState<string[]>([])
  const [tglMulai, setTglMulai] = useState('')
  const [tglAkhir, setTglAkhir] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)

  // Debounced search
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [q, setQ] = useState('')
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setQ(search), 350)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [search])

  // Outside click to close filter popup
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false)
    }
    if (filterOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [filterOpen])

  useEffect(() => {
    towersApi.getDropdown().then((r) => {
      const data = r.data
      setTowers(Array.isArray(data) ? data : (data?.data ?? []))
    }).catch(() => {})
  }, [])

  const jalurOptions = useMemo(() => {
    const seen = new Set<string>()
    const out: { value: string; label: string }[] = []
    for (const t of towers) {
      const j = (t.jalur ?? '').trim()
      if (!j || seen.has(j)) continue
      seen.add(j)
      out.push({ value: j, label: j })
    }
    return out.sort((a, b) => a.label.localeCompare(b.label))
  }, [towers])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await cuiApi.getAll({
        page,
        limit,
        search: q || undefined,
        status: statusFilter.length ? statusFilter.join(',') : undefined,
        jalur: jalurFilter.length ? jalurFilter.join(',') : undefined,
        tglMulai: tglMulai || undefined,
        tglAkhir: tglAkhir || undefined,
      })
      const p = res.data
      setRows(p?.data ?? [])
      setTotal(p?.total ?? 0)
    } catch {
      setRows([]); setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [page, limit, q, statusFilter, jalurFilter, tglMulai, tglAkhir])

  useEffect(() => { fetchData() }, [fetchData])

  const hasActiveFilters = Boolean(statusFilter.length || jalurFilter.length || tglMulai || tglAkhir)

  function resetFilters() {
    setStatusFilter([])
    setJalurFilter([])
    setTglMulai('')
    setTglAkhir('')
    setPage(1)
  }

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

      {/* Search + Filter row */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-3 px-4 py-[11px] bg-white border border-[#E1E8EC] rounded-lg flex-1 min-w-0">
          <Search size={16} className="text-[#5F737F] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Cari penghantar atau keterangan"
            className="border-none outline-none font-medium text-[14px] text-[#1C1C1C] bg-transparent w-full min-w-0 placeholder:text-[#97AAB3]"
          />
        </div>
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setFilterOpen(v => !v)}
            className="relative w-11 h-11 bg-white border border-[#E1E8EC] rounded-lg flex items-center justify-center cursor-pointer shrink-0"
            aria-label="Filter"
          >
            <SlidersHorizontal size={18} className="text-[#5F737F]" />
            {hasActiveFilters && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D92D20]" />}
          </button>

          {filterOpen && (
            <div className="absolute right-0 top-full mt-2 z-50 w-[min(420px,calc(100vw-2rem))] bg-white border border-[#E1E8EC] rounded-lg shadow-[0px_4px_8px_0px_rgba(28,28,28,0.15)]">
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="font-bold text-[14px] text-[#1C1C1C]">Filter</span>
                <div className="flex items-center gap-3">
                  {hasActiveFilters && (
                    <button onClick={resetFilters} className="text-[12px] text-[#D92D20] font-semibold hover:underline">Reset</button>
                  )}
                  <button onClick={() => setFilterOpen(false)} className="p-1 hover:bg-app-bg rounded">
                    <X size={16} className="text-[#5F737F]" />
                  </button>
                </div>
              </div>
              <div className="h-px bg-[#E1E8EC]" />

              <div className="max-h-[450px] overflow-y-auto">
                {/* Status */}
                <div className="px-4 py-3 flex flex-col gap-2.5">
                  <span className="font-bold text-[14px] text-[#1C1C1C]">Status</span>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map(o => {
                      const active = statusFilter.includes(o.value)
                      return (
                        <button
                          key={o.value}
                          onClick={() => { setStatusFilter(active ? statusFilter.filter(v => v !== o.value) : [...statusFilter, o.value]); setPage(1) }}
                          className={`px-3 py-1 rounded-full border text-[12px] font-medium transition-all ${active ? 'bg-[#076C9E] border-[#076C9E] text-white' : 'border-[#E1E8EC] text-[#5F737F] hover:border-[#076C9E]'}`}
                        >{o.label}</button>
                      )
                    })}
                  </div>
                </div>
                <div className="h-px bg-[#E1E8EC]" />

                {/* Penghantar (jalur) */}
                <div className="px-4 py-3">
                  <SearchableSelect
                    label="Penghantar"
                    placeholder="Pilih penghantar..."
                    options={jalurOptions}
                    values={jalurFilter}
                    onChange={(vals) => { setJalurFilter(vals); setPage(1) }}
                    onClear={() => { setJalurFilter([]); setPage(1) }}
                  />
                </div>
                <div className="h-px bg-[#E1E8EC]" />

                {/* Date range */}
                <div className="px-4 py-3 flex flex-col gap-2.5">
                  <span className="font-bold text-[14px] text-[#1C1C1C]">Rentang Waktu</span>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <p className="font-bold text-[13px] text-[#1C1C1C] mb-1">Tanggal Mulai</p>
                      <DatePicker
                        value={tglMulai}
                        onChange={(v) => { setTglMulai(v); setPage(1) }}
                        placeholder="Pilih tanggal"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-[13px] text-[#1C1C1C] mb-1">Tanggal Berakhir</p>
                      <DatePicker
                        value={tglAkhir}
                        onChange={(v) => { setTglAkhir(v); setPage(1) }}
                        placeholder="Pilih tanggal"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
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
        <div className="card overflow-hidden">
          <Pagination total={total} page={page} limit={limit} onChange={setPage} onLimitChange={setLimit} />
        </div>
      </div>

      <CUIDrawer
        open={drawerOpen}
        initial={editRow}
        towers={towers}
        onClose={() => setDrawerOpen(false)}
        onSaved={fetchData}
      />
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
