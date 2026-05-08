'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, Power } from 'lucide-react'
import { pegawaiApi } from '@/lib/api'
import { isAdmin } from '@/lib/auth'
import { ActionMenu } from '@/components/ui/ActionMenu'
import { SearchInput } from '@/components/ui/SearchInput'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonRow } from '@/components/ui/SkeletonRow'

const ROLE_OPTIONS = ['admin', 'teknisi', 'viewer']
const UNIT_OPTIONS = ['UPT Banten', 'UPT Tangerang', 'UPT Cilegon', 'UPT Serang']

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

function AktifBadge({ aktif }: { aktif: boolean }) {
  return aktif
    ? <span className="badge-selesai">Aktif</span>
    : <span className="badge-menunggu">Nonaktif</span>
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

  useEffect(() => { if (ready) fetchData() }, [ready, fetchData])

  const filtered = rows.filter((r) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      r.nik?.toLowerCase().includes(q) ||
      r.nama?.toLowerCase().includes(q) ||
      r.jabatan?.toLowerCase().includes(q) ||
      r.unit?.toLowerCase().includes(q)
    )
  })

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

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-app-text">User Management</h1>
        <button onClick={() => { setEditRow(null); setModalOpen(true) }} className="btn-primary">
          <Plus size={16} /> Tambah User
        </button>
      </div>

      <div className="card card-body mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Cari NIK, nama, jabatan, atau unit" />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>NIK</th>
                <th>Nama</th>
                <th>Jabatan</th>
                <th>Unit</th>
                <th>Role</th>
                <th>Status</th>
                <th className="text-right pr-5">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <SkeletonRow cols={7} rows={8} />
              : filtered.length === 0 ? <tr><td colSpan={7}><EmptyState title="Tidak ada user" /></td></tr>
              : filtered.map((row) => (
                <tr key={row.id}>
                  <td><span className="font-mono text-[12px] text-blue-600 font-semibold">{row.nik}</span></td>
                  <td className="font-semibold text-app-text">{row.nama}</td>
                  <td className="text-app-muted">{row.jabatan ?? '—'}</td>
                  <td className="text-app-muted text-[12px]">{row.unit ?? '—'}</td>
                  <td><RoleBadge role={row.role} /></td>
                  <td><AktifBadge aktif={row.aktif ?? true} /></td>
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

        {/* Simple footer count */}
        <div className="px-5 py-3.5 border-t border-app-border text-[12px] text-app-muted bg-white">
          {filtered.length} dari {rows.length} user
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
