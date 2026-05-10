'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  Plus, Pencil, Trash2, X, Power, Check, CircleX,
  KeyRound, RefreshCw, SlidersHorizontal, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { pegawaiApi, authApi } from '@/lib/api'
import { isAdmin } from '@/lib/auth'
import { ActionMenu } from '@/components/ui/ActionMenu'
import { SearchInput } from '@/components/ui/SearchInput'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonRow } from '@/components/ui/SkeletonRow'

const ROLE_OPTIONS = ['admin', 'teknisi', 'viewer']
const UNIT_OPTIONS = ['UPT Banten', 'UPT Tangerang', 'UPT Cilegon', 'UPT Serang']

const JABATAN_OPTIONS = [
  'Teknisi Senior', 'Petugas Lapangan', 'Teknisi Lapangan',
  'Supervisor Transmisi', 'Manager',
]

const PAGE_SIZE_OPTIONS = [10, 25, 50]

// ── Role badge ────────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    admin:   'bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe]',
    teknisi: 'bg-[#f0fdf4] text-[#15803d] border border-[#bbf7d0]',
    viewer:  'bg-[#f8fafc] text-[#64748b] border border-[#e2e8f0]',
  }
  const cls = styles[role?.toLowerCase()] ?? styles.viewer
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${cls}`}>
      {role}
    </span>
  )
}

function StatusBadge({ aktif }: { aktif: boolean }) {
  return aktif
    ? (
      <span style={{
        display: 'inline-flex', alignItems: 'center',
        padding: '2px 10px', borderRadius: 999,
        fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
        textTransform: 'uppercase',
        background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0',
      }}>AKTIF</span>
    ) : (
      <span style={{
        display: 'inline-flex', alignItems: 'center',
        padding: '2px 10px', borderRadius: 999,
        fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
        textTransform: 'uppercase',
        background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0',
      }}>TIDAK AKTIF</span>
    )
}

// ── Filter Dropdown ───────────────────────────────────────────────────────────

function FilterDropdown({
  open, onClose,
  jabatan, setJabatan,
  statusFilter, setStatusFilter,
  onApply, onClear,
}: {
  open: boolean
  onClose: () => void
  jabatan: string[]
  setJabatan: (v: string[]) => void
  statusFilter: string
  setStatusFilter: (v: string) => void
  onApply: () => void
  onClear: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open, onClose])

  if (!open) return null

  function toggleJabatan(j: string) {
    setJabatan(jabatan.includes(j) ? jabatan.filter((x) => x !== j) : [...jabatan, j])
  }

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute', top: '100%', left: 0, zIndex: 100,
        marginTop: 6, background: '#fff',
        border: '1px solid #e2e8f0', borderRadius: 12,
        boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
        padding: '16px', width: 280,
      }}
    >
      {/* Jabatan */}
      <p style={{ fontSize: 11, fontWeight: 700, color: '#5F737F', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
        Jabatan
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        {JABATAN_OPTIONS.map((j) => {
          const active = jabatan.includes(j)
          return (
            <button
              key={j}
              onClick={() => toggleJabatan(j)}
              style={{
                padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 500,
                cursor: 'pointer', border: active ? '1.5px solid #076C9E' : '1.5px solid #e2e8f0',
                background: active ? '#EFF8FF' : '#f8fafc',
                color: active ? '#076C9E' : '#64748b',
                transition: 'all 0.12s',
              }}
            >
              {j}
            </button>
          )
        })}
      </div>

      {/* Status */}
      <p style={{ fontSize: 11, fontWeight: 700, color: '#5F737F', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
        Status
      </p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {[{ label: 'Aktif', value: 'aktif' }, { label: 'Tidak Aktif', value: 'nonaktif' }].map(({ label, value }) => {
          const active = statusFilter === value
          return (
            <button
              key={value}
              onClick={() => setStatusFilter(active ? '' : value)}
              style={{
                padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 500,
                cursor: 'pointer', border: active ? '1.5px solid #076C9E' : '1.5px solid #e2e8f0',
                background: active ? '#EFF8FF' : '#f8fafc',
                color: active ? '#076C9E' : '#64748b',
                transition: 'all 0.12s',
              }}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={onApply}
          style={{
            flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 13, fontWeight: 600,
            background: '#076C9E', color: '#fff', border: 'none', cursor: 'pointer',
          }}
        >
          Terapkan Filter
        </button>
        <button
          onClick={onClear}
          style={{
            flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 13, fontWeight: 600,
            background: '#fff', color: '#374151', border: '1.5px solid #e2e8f0', cursor: 'pointer',
          }}
        >
          Hapus Filter
        </button>
      </div>
    </div>
  )
}

// ── User modal ────────────────────────────────────────────────────────────────

const EMPTY_USER = { nik: '', nama: '', jabatan: '', unit: 'UPT Banten', role: 'teknisi', password: '' }

function UserModal({ open, initial, onClose, onSaved }: { open: boolean; initial: any | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState(EMPTY_USER)
  const [saving, setSaving] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  useEffect(() => {
    if (open) {
      setForm(initial ? {
        nik: initial.nik ?? '', nama: initial.nama ?? '',
        jabatan: initial.jabatan ?? '', unit: initial.unit ?? 'UPT Banten',
        role: initial.role ?? 'teknisi', password: '',
      } : EMPTY_USER)
    }
  }, [open, initial])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nik || !form.nama) { toast.error('NIK dan Nama wajib diisi'); return }
    if (!initial && !form.password) { toast.error('Password wajib diisi untuk user baru'); return }
    setSaving(true)
    try {
      const payload: any = { nik: form.nik, nama: form.nama, jabatan: form.jabatan, unit: form.unit, role: form.role }
      if (form.password) payload.password = form.password
      if (initial?.id) await pegawaiApi.update(initial.id, payload)
      else await pegawaiApi.create(payload)
      toast.success(initial ? 'User diperbarui' : 'User ditambahkan')
      onSaved(); onClose()
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
          <h2 className="text-[15px] font-bold text-app-text">{initial ? 'Edit User' : 'Tambah User Baru'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-app-bg text-app-muted"><X size={18} /></button>
        </div>
        <form id="user-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">NIK <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.nik}
              onChange={(e) => set('nik', e.target.value)}
              className="form-input font-mono"
              placeholder="Nomor Induk Karyawan"
              readOnly={!!initial}
              style={initial ? { background: 'var(--color-app-bg)', cursor: 'not-allowed' } : {}}
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Nama Lengkap <span className="text-red-500">*</span></label>
            <input type="text" value={form.nama} onChange={(e) => set('nama', e.target.value)} className="form-input" placeholder="Nama lengkap pegawai" />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Jabatan</label>
            <input type="text" value={form.jabatan} onChange={(e) => set('jabatan', e.target.value)} className="form-input" placeholder="Jabatan / posisi" />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Unit</label>
            <select value={form.unit} onChange={(e) => set('unit', e.target.value)} className="form-input">
              {UNIT_OPTIONS.map((u) => <option key={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Role</label>
            <select value={form.role} onChange={(e) => set('role', e.target.value)} className="form-input">
              {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">
              Password {initial && <span className="text-app-muted font-normal">(kosongkan jika tidak diubah)</span>}
              {!initial && <span className="text-red-500"> *</span>}
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
                className="form-input pr-16"
                placeholder="Min. 8 karakter"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-blue-600 font-medium"
              >
                {showPass ? 'Sembunyikan' : 'Tampilkan'}
              </button>
            </div>
          </div>
        </form>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-app-border">
          <button type="button" onClick={onClose} className="btn-outline">Batal</button>
          <button type="submit" form="user-form" disabled={saving} className="btn-primary">
            {saving ? 'Menyimpan...' : initial ? 'Perbarui User' : 'Tambah User'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!isAdmin()) {
      router.replace('/dashboard')
    } else {
      setReady(true)
    }
  }, [router])

  const [rows, setRows]       = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [modalOpen, setModalOpen]   = useState(false)
  const [editRow, setEditRow]       = useState<any | null>(null)
  const [deleteId, setDeleteId]     = useState<string | null>(null)
  const [deleting, setDeleting]     = useState(false)
  const [toggling, setToggling]     = useState<string | null>(null)

  // Filter state
  const [filterOpen, setFilterOpen]       = useState(false)
  const [jabatanFilter, setJabatanFilter] = useState<string[]>([])
  const [statusFilter, setStatusFilter]   = useState('')
  const [appliedJabatan, setAppliedJabatan] = useState<string[]>([])
  const [appliedStatus, setAppliedStatus]   = useState('')

  // Pagination state
  const [page, setPage]           = useState(1)
  const [pageSize, setPageSize]   = useState(10)

  // Password change requests
  const [pwRequests, setPwRequests]   = useState<any[]>([])
  const [pwLoading, setPwLoading]     = useState(true)
  const [pwProcessing, setPwProcessing] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await pegawaiApi.getAll()
      setRows(Array.isArray(res.data) ? res.data : (res.data.data ?? []))
    } catch {
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchPwRequests = useCallback(async () => {
    setPwLoading(true)
    try {
      const res = await authApi.listPasswordChangeRequests()
      setPwRequests(Array.isArray(res.data) ? res.data : [])
    } catch {
      setPwRequests([])
    } finally {
      setPwLoading(false)
    }
  }, [])

  useEffect(() => {
    if (ready) {
      fetchData()
      fetchPwRequests()
    }
  }, [ready, fetchData, fetchPwRequests])

  // Reset to page 1 when filters/search change
  useEffect(() => { setPage(1) }, [search, appliedJabatan, appliedStatus, pageSize])

  const filtered = rows.filter((r) => {
    if (search) {
      const q = search.toLowerCase()
      const match = (
        r.nik?.toLowerCase().includes(q) ||
        r.nama?.toLowerCase().includes(q) ||
        r.jabatan?.toLowerCase().includes(q) ||
        r.unit?.toLowerCase().includes(q)
      )
      if (!match) return false
    }
    if (appliedJabatan.length > 0 && !appliedJabatan.includes(r.jabatan)) return false
    if (appliedStatus === 'aktif' && !(r.aktif ?? true)) return false
    if (appliedStatus === 'nonaktif' && (r.aktif ?? true)) return false
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  const activeFilterCount = appliedJabatan.length + (appliedStatus ? 1 : 0)

  async function handleToggle(id: string) {
    setToggling(id)
    try {
      await pegawaiApi.toggleAktif(id)
      toast.success('Status berhasil diperbarui')
      fetchData()
    } catch {
      toast.error('Gagal mengubah status')
    } finally {
      setToggling(null)
    }
  }

  async function handleApprove(id: string) {
    setPwProcessing(id)
    try {
      await authApi.approvePasswordChangeRequest(id)
      toast.success('Password berhasil disetujui dan diperbarui')
      fetchPwRequests()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Gagal menyetujui')
    } finally {
      setPwProcessing(null)
    }
  }

  async function handleReject(id: string) {
    setPwProcessing(id)
    try {
      await authApi.rejectPasswordChangeRequest(id)
      toast.success('Permintaan ditolak')
      fetchPwRequests()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Gagal menolak')
    } finally {
      setPwProcessing(null)
    }
  }

  async function confirmDelete() {
    if (!deleteId) return
    setDeleting(true)
    try {
      await pegawaiApi.delete(deleteId)
      toast.success('User dihapus')
      setDeleteId(null); fetchData()
    } catch { toast.error('Gagal menghapus user') }
    finally { setDeleting(false) }
  }

  if (!ready) return null

  const startRow = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1
  const endRow = Math.min(page * pageSize, filtered.length)

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-app-text)' }}>Manajemen User</h1>
        <button onClick={() => { setEditRow(null); setModalOpen(true) }} className="btn-primary">
          <Plus size={16} /> Tambah User
        </button>
      </div>

      {/* Search + Filter toolbar */}
      <div className="card card-body mb-4" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <SearchInput value={search} onChange={(v) => { setSearch(v) }} placeholder="Cari NIK, nama, jabatan, atau unit" />
        </div>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button
            onClick={() => setFilterOpen((v) => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: activeFilterCount > 0 ? '#EFF8FF' : '#fff',
              color: activeFilterCount > 0 ? '#076C9E' : '#374151',
              border: activeFilterCount > 0 ? '1.5px solid #076C9E' : '1.5px solid #e2e8f0',
              cursor: 'pointer', transition: 'all 0.12s',
            }}
          >
            <SlidersHorizontal size={15} />
            Filter
            {activeFilterCount > 0 && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 18, height: 18, borderRadius: 999,
                background: '#076C9E', color: '#fff',
                fontSize: 10, fontWeight: 700,
              }}>
                {activeFilterCount}
              </span>
            )}
          </button>
          <FilterDropdown
            open={filterOpen}
            onClose={() => setFilterOpen(false)}
            jabatan={jabatanFilter}
            setJabatan={setJabatanFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onApply={() => {
              setAppliedJabatan(jabatanFilter)
              setAppliedStatus(statusFilter)
              setFilterOpen(false)
            }}
            onClear={() => {
              setJabatanFilter([]); setStatusFilter('')
              setAppliedJabatan([]); setAppliedStatus('')
              setFilterOpen(false)
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>NIK</th>
                <th>Nama</th>
                <th>Jabatan</th>
                <th>Role</th>
                <th>Status</th>
                <th className="text-right pr-5">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <SkeletonRow cols={6} rows={8} />
              : paginated.length === 0 ? <tr><td colSpan={6}><EmptyState title="Tidak ada user" /></td></tr>
              : paginated.map((row) => (
                <tr key={row.id}>
                  <td><span className="font-mono text-[12px] text-blue-600 font-semibold">{row.nik}</span></td>
                  <td className="font-semibold text-app-text">{row.nama}</td>
                  <td className="text-app-muted text-[13px]">{row.jabatan ?? '—'}</td>
                  <td><RoleBadge role={row.role} /></td>
                  <td><StatusBadge aktif={row.aktif ?? true} /></td>
                  <td className="text-right pr-4">
                    <ActionMenu items={[
                      {
                        label: 'Edit User',
                        icon: <Pencil size={14} />,
                        onClick: () => { setEditRow(row); setModalOpen(true) },
                      },
                      {
                        label: row.aktif ? 'Nonaktifkan' : 'Aktifkan',
                        icon: <Power size={14} />,
                        onClick: () => handleToggle(row.id),
                      },
                      {
                        label: 'Hapus User',
                        icon: <Trash2 size={14} />,
                        onClick: () => setDeleteId(row.id),
                        danger: true,
                        dividerBefore: true,
                      },
                    ]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 20px', borderTop: '1px solid var(--color-app-border)',
          background: '#fff', flexWrap: 'wrap', gap: 8,
        }}>
          {/* Left: rows per page */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              style={{
                padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                border: '1px solid #e2e8f0', color: '#374151', background: '#fff',
                cursor: 'pointer',
              }}
            >
              {PAGE_SIZE_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <span style={{ fontSize: 12, color: '#5F737F' }}>baris per halaman</span>
          </div>

          {/* Center: count */}
          <span style={{ fontSize: 12, color: '#5F737F' }}>
            {filtered.length === 0
              ? 'Tidak ada data'
              : `Menampilkan ${startRow}–${endRow} dari ${filtered.length} data`}
          </span>

          {/* Right: page nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                width: 30, height: 30, borderRadius: 6, border: '1px solid #e2e8f0',
                background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: page === 1 ? '#cbd5e1' : '#374151',
              }}
            >
              <ChevronLeft size={15} />
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...')
                acc.push(p)
                return acc
              }, [])
              .map((p, idx) =>
                p === '...' ? (
                  <span key={`ellipsis-${idx}`} style={{ fontSize: 12, color: '#94a3b8', padding: '0 2px' }}>…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    style={{
                      width: 30, height: 30, borderRadius: 6,
                      border: page === p ? '1.5px solid #076C9E' : '1px solid #e2e8f0',
                      background: page === p ? '#076C9E' : '#fff',
                      color: page === p ? '#fff' : '#374151',
                      fontSize: 12, fontWeight: page === p ? 700 : 400,
                      cursor: 'pointer',
                    }}
                  >
                    {p}
                  </button>
                )
              )}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                width: 30, height: 30, borderRadius: 6, border: '1px solid #e2e8f0',
                background: '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: page === totalPages ? '#cbd5e1' : '#374151',
              }}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Password Change Requests ─────────────────────────────────────── */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <KeyRound size={18} className="text-[#076c9e]" />
            <h2 className="text-lg font-bold text-app-text">Permintaan Ganti Password</h2>
            {pwRequests.filter(r => r.status === 'pending').length > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#D92D20] text-white text-[11px] font-bold">
                {pwRequests.filter(r => r.status === 'pending').length}
              </span>
            )}
          </div>
          <button onClick={fetchPwRequests} className="p-1.5 rounded-lg hover:bg-app-bg text-app-muted transition-colors" title="Refresh">
            <RefreshCw size={15} />
          </button>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Jabatan / Unit</th>
                  <th>Waktu Request</th>
                  <th>Kedaluwarsa</th>
                  <th>Status</th>
                  <th>Direview oleh</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pwLoading ? (
                  <SkeletonRow cols={7} rows={3} />
                ) : pwRequests.length === 0 ? (
                  <tr><td colSpan={7}><EmptyState title="Tidak ada permintaan ganti password" /></td></tr>
                ) : (
                  pwRequests.map((req) => {
                    const isPending = req.status === 'pending'
                    const isExpired = req.status === 'expired'
                    const processing = pwProcessing === req.id
                    return (
                      <tr key={req.id}>
                        <td>
                          <p className="font-semibold text-app-text text-[13px]">{req.pegawai?.nama ?? '—'}</p>
                          <p className="font-mono text-[11px] text-blue-600">{req.pegawai?.nik ?? '—'}</p>
                        </td>
                        <td className="text-app-muted text-[12px]">
                          <p>{req.pegawai?.jabatan ?? '—'}</p>
                          <p>{req.pegawai?.unit ?? '—'}</p>
                        </td>
                        <td className="text-[13px] text-app-muted">
                          {req.requestedAt ? new Date(req.requestedAt).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                        </td>
                        <td className="text-[13px] text-app-muted">
                          {req.expiredAt ? new Date(req.expiredAt).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                        </td>
                        <td>
                          {req.status === 'pending'  && <span className="badge-berlangsung">Menunggu</span>}
                          {req.status === 'approved' && <span className="badge-selesai">Disetujui</span>}
                          {req.status === 'rejected' && <span className="badge-menunggu">Ditolak</span>}
                          {req.status === 'expired'  && <span className="badge-menunggu opacity-60">Kedaluwarsa</span>}
                        </td>
                        <td className="text-[12px] text-app-muted">
                          {req.reviewedBy?.nama ?? (isPending || isExpired ? '—' : '—')}
                          {req.reviewedAt && (
                            <p className="text-[11px]">
                              {new Date(req.reviewedAt).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          )}
                        </td>
                        <td className="text-center">
                          {isPending ? (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleApprove(req.id)}
                                disabled={processing}
                                title="Setujui"
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 text-green-700 text-[12px] font-semibold hover:bg-green-100 transition disabled:opacity-50 cursor-pointer"
                              >
                                <Check size={13} /> Setujui
                              </button>
                              <button
                                onClick={() => handleReject(req.id)}
                                disabled={processing}
                                title="Tolak"
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-[12px] font-semibold hover:bg-red-100 transition disabled:opacity-50 cursor-pointer"
                              >
                                <CircleX size={13} /> Tolak
                              </button>
                            </div>
                          ) : (
                            <span className="text-[12px] text-app-subtle">—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <UserModal open={modalOpen} initial={editRow} onClose={() => setModalOpen(false)} onSaved={fetchData} />
      <ConfirmModal
        isOpen={!!deleteId}
        title="Hapus User?"
        message="User ini akan dihapus permanen dari sistem. Tindakan ini tidak dapat dibatalkan."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
        confirmLabel="Ya, Hapus User"
      />
    </>
  )
}
