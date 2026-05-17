'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  Plus, Pencil, Trash2, X, Power, Check, CircleX,
  KeyRound, RefreshCw, SlidersHorizontal, ChevronLeft, ChevronRight,
  Eye, EyeOff, Shield, Wrench, Crown, Search, Building2, Save, Users,
} from 'lucide-react'
import { pegawaiApi, authApi, unitsApi } from '@/lib/api'
import { isSuperadmin, isAdminOrSuperadmin } from '@/lib/auth'
import { ActionMenu } from '@/components/ui/ActionMenu'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonRow } from '@/components/ui/SkeletonRow'

const UNIT_FALLBACK = ['UPT Durikosambi', 'ULTG Durikosambi']
const JABATAN_OPTIONS = [
  'Teknisi Senior', 'Petugas Lapangan', 'Teknisi Lapangan',
  'Supervisor Transmisi', 'Manager',
]
const PAGE_SIZE_OPTIONS = [10, 25, 50]

// ── Role Badge — solid blue pill per Figma ────────────────────────────────────

function RoleBadge({ role }: { role: string }) {
  const r = (role ?? '').toLowerCase()
  const bg =
    r === 'superadmin' ? '#7C3AED' :
    r === 'admin'      ? '#076C9E' :
    r === 'teknisi'    ? '#076C9E' :
                         '#64748b'
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        minWidth: 70, padding: '4px 12px',
        background: bg, color: '#fff',
        borderRadius: 999, fontSize: 11, fontWeight: 700,
        letterSpacing: '0.04em', textTransform: 'uppercase',
      }}
    >
      {role}
    </span>
  )
}

// ── Status text — colored text per Figma ──────────────────────────────────────

function StatusText({ aktif }: { aktif: boolean }) {
  return (
    <span style={{
      fontSize: 13, fontWeight: 600,
      color: aktif ? '#15803d' : '#dc2626',
    }}>
      {aktif ? 'Aktif' : 'Tidak Aktif'}
    </span>
  )
}

// ── Chip toggle ──────────────────────────────────────────────────────────────

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 500,
        cursor: 'pointer',
        border: active ? '1.5px solid #076C9E' : '1.5px solid #e2e8f0',
        background: active ? '#EFF8FF' : '#f8fafc',
        color: active ? '#076C9E' : '#64748b',
        transition: 'all 0.12s', minHeight: 32,
      }}
    >
      {children}
    </button>
  )
}

// ── Filter content (shared by dropdown + bottom sheet) ────────────────────────

function FilterBody({
  jabatan, setJabatan, roleFilter, setRoleFilter,
  statusFilter, setStatusFilter, onApply, onClear,
}: {
  jabatan: string[]
  setJabatan: (v: string[]) => void
  roleFilter: string[]
  setRoleFilter: (v: string[]) => void
  statusFilter: string
  setStatusFilter: (v: string) => void
  onApply: () => void
  onClear: () => void
}) {
  const showSuper = isSuperadmin()
  const ROLES = showSuper ? ['superadmin', 'admin', 'teknisi'] : ['admin', 'teknisi']

  function toggleJabatan(j: string) {
    setJabatan(jabatan.includes(j) ? jabatan.filter((x) => x !== j) : [...jabatan, j])
  }
  function toggleRole(r: string) {
    setRoleFilter(roleFilter.includes(r) ? roleFilter.filter((x) => x !== r) : [...roleFilter, r])
  }

  return (
    <>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#5F737F', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
        Jabatan
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
        {JABATAN_OPTIONS.map((j) => (
          <Chip key={j} active={jabatan.includes(j)} onClick={() => toggleJabatan(j)}>{j}</Chip>
        ))}
      </div>

      <p style={{ fontSize: 11, fontWeight: 700, color: '#5F737F', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
        Role
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
        {ROLES.map((r) => (
          <Chip key={r} active={roleFilter.includes(r)} onClick={() => toggleRole(r)}>
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </Chip>
        ))}
      </div>

      <p style={{ fontSize: 11, fontWeight: 700, color: '#5F737F', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
        Status
      </p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
        <Chip active={statusFilter === 'aktif'} onClick={() => setStatusFilter(statusFilter === 'aktif' ? '' : 'aktif')}>Aktif</Chip>
        <Chip active={statusFilter === 'nonaktif'} onClick={() => setStatusFilter(statusFilter === 'nonaktif' ? '' : 'nonaktif')}>Tidak Aktif</Chip>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={onApply}
          style={{
            flex: 1, padding: '12px 0', borderRadius: 22, fontSize: 14, fontWeight: 600,
            background: '#076C9E', color: '#fff', border: 'none', cursor: 'pointer',
            minHeight: 44,
          }}
        >
          Terapkan Filter
        </button>
        <button
          onClick={onClear}
          style={{
            flex: 1, padding: '12px 0', borderRadius: 22, fontSize: 14, fontWeight: 600,
            background: '#fff', color: '#dc2626', border: '1.5px solid #fecaca', cursor: 'pointer',
            minHeight: 44,
          }}
        >
          Hapus Filter
        </button>
      </div>
    </>
  )
}

// ── Filter Dropdown (desktop) ─────────────────────────────────────────────────

function FilterDropdown(props: React.ComponentProps<typeof FilterBody> & { open: boolean; onClose: () => void }) {
  const { open, onClose, ...rest } = props
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open, onClose])

  if (!open) return null
  return (
    <div
      ref={ref}
      style={{
        position: 'absolute', top: '100%', right: 0, zIndex: 100,
        marginTop: 6, background: '#fff',
        border: '1px solid #e2e8f0', borderRadius: 12,
        boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
        padding: 16, width: 320,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1C1C1C' }}>Filter</h3>
        <button onClick={onClose} style={{ padding: 4, background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
          <X size={18} />
        </button>
      </div>
      <FilterBody {...rest} />
    </div>
  )
}

// ── Bottom sheet (mobile filter / modal) ──────────────────────────────────────

function BottomSheet({
  open, onClose, title, children, footer,
}: {
  open: boolean; onClose: () => void; title: string;
  children: React.ReactNode; footer?: React.ReactNode;
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full md:w-[480px] rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col max-h-[92vh] md:max-h-[90vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-app-border">
          <h2 className="text-[15px] font-bold text-app-text">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-app-bg text-app-muted" style={{ minWidth: 44, minHeight: 44 }}>
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="px-5 py-4 border-t border-app-border">{footer}</div>}
      </div>
    </div>
  )
}

// ── Role Toggle Button (form) ─────────────────────────────────────────────────

function RoleToggle({ value, onChange }: { value: string; onChange: (r: string) => void }) {
  const showSuper = isSuperadmin()
  const opts: { v: string; label: string; icon: React.ReactNode }[] = [
    { v: 'admin', label: 'Admin', icon: <Shield size={16} /> },
    { v: 'teknisi', label: 'Teknisi', icon: <Wrench size={16} /> },
  ]
  if (showSuper) opts.unshift({ v: 'superadmin', label: 'Superadmin', icon: <Crown size={16} /> })

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${opts.length}, 1fr)`, gap: 8 }}>
      {opts.map(({ v, label, icon }) => {
        const active = value === v
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '10px 12px', borderRadius: 10, minHeight: 44,
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              border: active ? '1.5px solid #076C9E' : '1.5px solid #e2e8f0',
              background: active ? '#076C9E' : '#fff',
              color: active ? '#fff' : '#374151',
              transition: 'all 0.12s',
            }}
          >
            {icon}{label}
          </button>
        )
      })}
    </div>
  )
}

// ── User Form (Tambah / Edit) — shared component ──────────────────────────────

const EMPTY_USER = { nik: '', nama: '', jabatan: '', unit: '', role: 'teknisi', password: '', expiredAt: '' }

function UserModal({ open, initial, onClose, onSaved, unitOptions }: { open: boolean; initial: any | null; onClose: () => void; onSaved: () => void; unitOptions: string[] }) {
  const [form, setForm] = useState(EMPTY_USER)
  const [saving, setSaving] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const superadmin = isSuperadmin()
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  useEffect(() => {
    if (open) {
      setShowPass(false)
      const defaultUnit = unitOptions[0] ?? UNIT_FALLBACK[0]
      setForm(initial ? {
        nik: initial.nik ?? '', nama: initial.nama ?? '',
        jabatan: initial.jabatan ?? '', unit: initial.unit ?? defaultUnit,
        role: initial.role ?? 'teknisi', password: '',
        expiredAt: initial.expiredAt ? new Date(initial.expiredAt).toISOString().slice(0, 10) : '',
      } : { ...EMPTY_USER, unit: defaultUnit })
    }
  }, [open, initial])

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!form.nik || !form.nama) { toast.error('NIP dan Nama wajib diisi'); return }
    if (!initial && !form.password) { toast.error('Password wajib diisi untuk user baru'); return }
    if (form.password) {
      const p = form.password
      if (p.length < 8) { toast.error('Password minimal 8 karakter'); return }
      if (!/[A-Z]/.test(p)) { toast.error('Password harus mengandung 1 huruf kapital'); return }
      if (!/[^A-Za-z0-9]/.test(p)) { toast.error('Password harus mengandung 1 karakter spesial'); return }
    }
    setSaving(true)
    try {
      const payload: any = { nik: form.nik, nama: form.nama, jabatan: form.jabatan, unit: form.unit, role: form.role }
      if (form.password) payload.password = form.password
      if (superadmin && form.role === 'superadmin') {
        payload.expiredAt = form.expiredAt ? new Date(form.expiredAt).toISOString() : null
      }
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

  const showExpiry = superadmin && form.role === 'superadmin'
  const submitLabel = saving ? 'Menyimpan...' : initial ? 'Perbarui User' : 'Tambah User'

  const formFields = (
    <form id="user-form" onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[13px] font-semibold text-app-text mb-1.5">NIP <span className="text-red-500">*</span></label>
        <input
          type="text" inputMode="numeric"
          value={form.nik}
          onChange={(e) => set('nik', e.target.value)}
          className="form-input font-mono"
          placeholder="Masukkan NIP"
          style={{ minHeight: 44 }}
        />
      </div>
      <div>
        <label className="block text-[13px] font-semibold text-app-text mb-1.5">Nama Lengkap <span className="text-red-500">*</span></label>
        <input type="text" value={form.nama} onChange={(e) => set('nama', e.target.value)} className="form-input" placeholder="Masukkan Nama Lengkap" style={{ minHeight: 44 }} />
      </div>
      <div>
        <label className="block text-[13px] font-semibold text-app-text mb-1.5">Jabatan</label>
        <input type="text" value={form.jabatan} onChange={(e) => set('jabatan', e.target.value)} className="form-input" placeholder="Masukkan Jabatan/Posisi" list="jabatan-options" style={{ minHeight: 44 }} />
        <datalist id="jabatan-options">
          {JABATAN_OPTIONS.map((j) => <option key={j} value={j} />)}
        </datalist>
      </div>
      <div>
        <label className="block text-[13px] font-semibold text-app-text mb-1.5">Unit</label>
        <select value={form.unit} onChange={(e) => set('unit', e.target.value)} className="form-input" style={{ minHeight: 44 }}>
          {(unitOptions.length > 0 ? unitOptions : UNIT_FALLBACK).map((u) => <option key={u}>{u}</option>)}
          {form.unit && !(unitOptions.length > 0 ? unitOptions : UNIT_FALLBACK).includes(form.unit) && (
            <option key={form.unit} value={form.unit}>{form.unit}</option>
          )}
        </select>
      </div>
      <div>
        <label className="block text-[13px] font-semibold text-app-text mb-1.5">Role</label>
        <RoleToggle value={form.role} onChange={(r) => set('role', r)} />
      </div>
      {showExpiry && (
        <div>
          <label className="block text-[13px] font-semibold text-app-text mb-1.5">
            Tanggal Kadaluwarsa Akun
            <span className="text-app-muted font-normal ml-1">(kosongkan = tidak ada batas)</span>
          </label>
          <input
            type="date"
            value={form.expiredAt}
            onChange={(e) => set('expiredAt', e.target.value)}
            className="form-input"
            min={new Date().toISOString().slice(0, 10)}
            style={{ minHeight: 44 }}
          />
        </div>
      )}
      <div>
        <label className="block text-[13px] font-semibold text-app-text mb-1.5">
          Password {initial && <span className="text-app-muted font-normal">(kosongkan jika tidak diubah)</span>}
          {!initial && <span className="text-red-500"> *</span>}
        </label>
        <div className="relative">
          <input
            type={showPass ? 'text' : 'password'}
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
            className="form-input pr-12"
            placeholder="Min. 8 karakter, 1 kapital, 1 spesial"
            style={{ minHeight: 44 }}
          />
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-app-muted hover:text-app-text"
            style={{ minWidth: 40, minHeight: 40 }}
            aria-label={showPass ? 'Sembunyikan password' : 'Tampilkan password'}
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <p className="text-[11px] text-app-muted mt-1">Min. 8 karakter, 1 huruf kapital dan 1 karakter spesial.</p>
      </div>
    </form>
  )

  const submitBtn = (
    <button
      type="submit" form="user-form"
      disabled={saving}
      onClick={() => handleSubmit()}
      style={{
        width: '100%', padding: '12px 20px', borderRadius: 22,
        background: '#076C9E', color: '#fff', border: 'none',
        fontSize: 14, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
        opacity: saving ? 0.7 : 1, minHeight: 44,
      }}
    >
      {submitLabel}
    </button>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full md:w-[480px] rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-app-border">
          <h2 className="text-[16px] font-bold text-app-text">{initial ? 'Edit User' : 'Tambah User'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-app-bg text-app-muted" style={{ minWidth: 44, minHeight: 44 }}>
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{formFields}</div>
        <div className="px-6 py-4 border-t border-app-border">{submitBtn}</div>
      </div>
    </div>
  )
}

// ── User Card (mobile) ────────────────────────────────────────────────────────

function UserCard({ row, onEdit, onToggle, onDelete, canDelete, showExpired }: {
  row: any
  onEdit: () => void
  onToggle: () => void
  onDelete: () => void
  canDelete: boolean
  showExpired: boolean
}) {
  const isExpired = row.expiredAt && new Date(row.expiredAt) < new Date()
  return (
    <div className="bg-white border border-app-border rounded-xl p-4 mb-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-app-text text-[14px] truncate">{row.nama}</p>
          <p className="font-mono text-[11px] text-blue-600 mt-0.5">{row.nik}</p>
          {row.jabatan && <p className="text-[12px] text-app-muted mt-1">{row.jabatan}</p>}
        </div>
        <ActionMenu items={[
          { label: 'Edit User', icon: <Pencil size={14} />, onClick: onEdit },
          { label: row.aktif ? 'Nonaktifkan' : 'Aktifkan', icon: <Power size={14} />, onClick: onToggle },
          ...(canDelete ? [{
            label: 'Hapus User', icon: <Trash2 size={14} />, onClick: onDelete,
            danger: true, dividerBefore: true,
          }] : []),
        ]} />
      </div>
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <RoleBadge role={row.role} />
        <StatusText aktif={row.aktif ?? true} />
        {showExpired && row.expiredAt && (
          <span style={{
            fontSize: 11, fontWeight: 600,
            padding: '2px 8px', borderRadius: 999,
            background: isExpired ? '#fef2f2' : '#f0fdf4',
            color: isExpired ? '#dc2626' : '#15803d',
            border: isExpired ? '1px solid #fecaca' : '1px solid #bbf7d0',
          }}>
            {isExpired ? 'Kedaluwarsa' : new Date(row.expiredAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        )}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

// ── Manajemen Unit ───────────────────────────────────────────────────────────

function UnitManagement({ units, onChanged }: { units: { id: string; nama: string }[]; onChanged: () => void }) {
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [busy, setBusy] = useState<string | null>(null)

  async function handleAdd() {
    const nama = newName.trim()
    if (!nama) { toast.error('Nama unit wajib diisi'); return }
    setAdding(true)
    try {
      await unitsApi.create(nama)
      toast.success('Unit ditambahkan')
      setNewName('')
      onChanged()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Gagal menambah unit')
    } finally { setAdding(false) }
  }

  async function handleSaveEdit(id: string) {
    const nama = editName.trim()
    if (!nama) { toast.error('Nama unit wajib diisi'); return }
    setBusy(id)
    try {
      await unitsApi.update(id, nama)
      toast.success('Unit diperbarui')
      setEditingId(null)
      onChanged()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Gagal memperbarui unit')
    } finally { setBusy(null) }
  }

  async function handleDelete(id: string, nama: string) {
    if (!confirm(`Hapus unit "${nama}"?`)) return
    setBusy(id)
    try {
      await unitsApi.delete(id)
      toast.success('Unit dihapus')
      onChanged()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Gagal menghapus unit')
    } finally { setBusy(null) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Building2 size={18} className="text-[#076c9e]" />
          <h2 className="text-lg font-bold text-app-text">Manajemen Unit</h2>
          <span className="text-app-muted text-[13px]">({units.length})</span>
        </div>
      </div>

      <div className="bg-white border border-app-border rounded-xl p-4">
        {/* Add new */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd() } }}
            placeholder="Nama unit baru (mis. ULTG Cilegon)"
            className="form-input flex-1"
            style={{ minHeight: 44 }}
          />
          <button
            onClick={handleAdd}
            disabled={adding}
            className="flex items-center gap-1.5 px-4 rounded-lg bg-[#076C9E] text-white font-semibold text-[14px] disabled:opacity-50"
            style={{ minHeight: 44 }}
          >
            <Plus size={16} /> Tambah
          </button>
        </div>

        {/* List */}
        {units.length === 0 ? (
          <EmptyState title="Belum ada unit" />
        ) : (
          <div className="divide-y divide-app-border">
            {units.map((u) => {
              const isEditing = editingId === u.id
              const isBusy = busy === u.id
              return (
                <div key={u.id} className="flex items-center gap-2 py-2">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSaveEdit(u.id) } }}
                        className="form-input flex-1"
                        style={{ minHeight: 40 }}
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEdit(u.id)} disabled={isBusy}
                        title="Simpan"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 text-green-700 text-[12px] font-semibold hover:bg-green-100 transition disabled:opacity-50"
                      >
                        <Save size={13} /> Simpan
                      </button>
                      <button
                        onClick={() => setEditingId(null)} disabled={isBusy}
                        title="Batal"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-app-bg border border-app-border text-app-muted text-[12px] font-semibold hover:bg-app-border transition disabled:opacity-50"
                      >
                        <X size={13} /> Batal
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-app-text text-[14px]">{u.nama}</span>
                      <button
                        onClick={() => { setEditingId(u.id); setEditName(u.nama) }}
                        title="Edit"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-app-bg border border-app-border text-app-muted text-[12px] font-semibold hover:bg-app-border transition"
                      >
                        <Pencil size={13} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(u.id, u.nama)} disabled={isBusy}
                        title="Hapus"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-[12px] font-semibold hover:bg-red-100 transition disabled:opacity-50"
                      >
                        <Trash2 size={13} /> Hapus
                      </button>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default function UsersPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const superadmin = isSuperadmin()
  const canDeleteUser = isAdminOrSuperadmin()

  useEffect(() => {
    if (!isAdminOrSuperadmin()) {
      router.replace('/dashboard')
    } else {
      setReady(true)
    }
  }, [router])

  const [rows, setRows]       = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [units, setUnits]     = useState<{ id: string; nama: string }[]>([])
  const [search, setSearch]   = useState('')
  const [modalOpen, setModalOpen]   = useState(false)
  const [editRow, setEditRow]       = useState<any | null>(null)
  const [deleteId, setDeleteId]     = useState<string | null>(null)
  const [deleting, setDeleting]     = useState(false)
  const [, setToggling]             = useState<string | null>(null)

  const [filterOpen, setFilterOpen]         = useState(false)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [jabatanFilter, setJabatanFilter]   = useState<string[]>([])
  const [roleFilter, setRoleFilter]         = useState<string[]>([])
  const [statusFilter, setStatusFilter]     = useState('')
  const [appliedJabatan, setAppliedJabatan] = useState<string[]>([])
  const [appliedRole, setAppliedRole]       = useState<string[]>([])
  const [appliedStatus, setAppliedStatus]   = useState('')

  const [page, setPage]           = useState(1)
  const [pageSize, setPageSize]   = useState(10)

  const [pwRequests, setPwRequests]   = useState<any[]>([])
  const [pwLoading, setPwLoading]     = useState(true)
  const [pwProcessing, setPwProcessing] = useState<string | null>(null)

  const [activeTab, setActiveTab] = useState<'users' | 'password' | 'units'>('users')

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

  const fetchUnits = useCallback(async () => {
    try {
      const res = await unitsApi.list()
      setUnits(Array.isArray(res.data) ? res.data : [])
    } catch { setUnits([]) }
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
      fetchUnits()
    }
  }, [ready, fetchData, fetchPwRequests, fetchUnits])

  useEffect(() => { setPage(1) }, [search, appliedJabatan, appliedRole, appliedStatus, pageSize])

  const filtered = rows.filter((r) => {
    if (!superadmin && r.role === 'superadmin') return false
    if (search) {
      const q = search.toLowerCase()
      const match = (
        r.nik?.toLowerCase().includes(q) ||
        r.nama?.toLowerCase().includes(q) ||
        r.jabatan?.toLowerCase().includes(q) ||
        r.unit?.toLowerCase().includes(q) ||
        r.role?.toLowerCase().includes(q)
      )
      if (!match) return false
    }
    if (appliedJabatan.length > 0 && !appliedJabatan.includes(r.jabatan)) return false
    if (appliedRole.length > 0 && !appliedRole.includes((r.role ?? '').toLowerCase())) return false
    if (appliedStatus === 'aktif' && !(r.aktif ?? true)) return false
    if (appliedStatus === 'nonaktif' && (r.aktif ?? true)) return false
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)
  const activeFilterCount = appliedJabatan.length + appliedRole.length + (appliedStatus ? 1 : 0)

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
      toast.success('Password disetujui')
      fetchPwRequests()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Gagal menyetujui')
    } finally { setPwProcessing(null) }
  }

  async function handleReject(id: string) {
    setPwProcessing(id)
    try {
      await authApi.rejectPasswordChangeRequest(id)
      toast.success('Permintaan ditolak')
      fetchPwRequests()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Gagal menolak')
    } finally { setPwProcessing(null) }
  }

  async function handleDeletePwRequest(id: string) {
    if (!confirm('Hapus permintaan ganti password ini?')) return
    setPwProcessing(id)
    try {
      await authApi.deletePasswordChangeRequest(id)
      toast.success('Permintaan dihapus')
      fetchPwRequests()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Gagal menghapus permintaan')
    } finally { setPwProcessing(null) }
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

  function applyFilter() {
    setAppliedJabatan(jabatanFilter)
    setAppliedRole(roleFilter)
    setAppliedStatus(statusFilter)
    setFilterOpen(false)
    setMobileFilterOpen(false)
  }

  function clearFilter() {
    setJabatanFilter([]); setRoleFilter([]); setStatusFilter('')
    setAppliedJabatan([]); setAppliedRole([]); setAppliedStatus('')
    setFilterOpen(false); setMobileFilterOpen(false)
  }

  if (!ready) return null

  const startRow = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1
  const endRow = Math.min(page * pageSize, filtered.length)
  const showExpiredCol = superadmin
  const pendingCount = pwRequests.filter(r => r.status === 'pending').length

  const TABS = [
    { id: 'users',    label: 'Daftar User' },
    { id: 'password', label: 'Permintaan Ganti Password' },
    { id: 'units',    label: 'Manajemen Unit' },
  ] as const

  return (
    <>
      {/* Header */}
      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-app-text)', marginBottom: 20 }}>Manajemen User</h1>

      {/* Tab Bar */}
      <div style={{ display: 'flex', borderBottom: '2px solid #f1f5f9', marginBottom: 24 }}>
        {TABS.map(({ id, label }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                position: 'relative',
                padding: '10px 20px 12px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: active ? 700 : 500,
                color: active ? '#076C9E' : '#5F737F',
                transition: 'color 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                whiteSpace: 'nowrap',
              }}
            >
              {label}
              {id === 'password' && pendingCount > 0 && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 18, height: 18, borderRadius: 999,
                  background: '#D92D20', color: '#fff',
                  fontSize: 10, fontWeight: 700,
                }}>
                  {pendingCount}
                </span>
              )}
              {active && (
                <span style={{
                  position: 'absolute', bottom: -2, left: 0, right: 0,
                  height: 2, background: '#076C9E', borderRadius: 2,
                }} />
              )}
            </button>
          )
        })}
      </div>

      {/* Tab content — key triggers remount + animate-in on switch */}
      <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-2 duration-200">

      {/* ── Daftar User ─────────────────────────────────────────────── */}
      {activeTab === 'users' && (<>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-[#076c9e]" />
          <h2 className="text-lg font-bold text-app-text">Daftar User</h2>
          <span className="text-app-muted text-[13px]">({filtered.length})</span>
        </div>
      </div>

      {/* Toolbar: Search + Filter + Tambah User in one row */}
      <div className="mb-4" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: '0 1 480px', minWidth: 220 }}>
          <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari berdasarkan NIP, Jabatan, atau Role"
              className="form-input pl-10"
              style={{ height: 44, width: '100%' }}
            />
          </div>
        </div>
        <div style={{ position: 'relative', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && window.innerWidth < 768) setMobileFilterOpen(true)
              else setFilterOpen((v) => !v)
            }}
            aria-label="Filter"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 44, height: 44, borderRadius: 8,
              background: activeFilterCount > 0 ? '#EFF8FF' : '#fff',
              color: activeFilterCount > 0 ? '#076C9E' : '#374151',
              border: activeFilterCount > 0 ? '1.5px solid #076C9E' : '1.5px solid #e2e8f0',
              cursor: 'pointer', position: 'relative',
            }}
          >
            <SlidersHorizontal size={18} />
            {activeFilterCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
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
            jabatan={jabatanFilter} setJabatan={setJabatanFilter}
            roleFilter={roleFilter} setRoleFilter={setRoleFilter}
            statusFilter={statusFilter} setStatusFilter={setStatusFilter}
            onApply={applyFilter} onClear={clearFilter}
          />
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={() => { setEditRow(null); setModalOpen(true) }}
            className="btn-primary"
            style={{ minHeight: 44 }}
          >
            <Plus size={16} /> Tambah User
          </button>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden">
        {loading ? (
          <div className="text-center py-12 text-app-muted text-sm">Memuat data...</div>
        ) : paginated.length === 0 ? (
          <div className="bg-white border border-app-border rounded-xl"><EmptyState title="Tidak ada user" /></div>
        ) : (
          paginated.map((row) => (
            <UserCard
              key={row.id} row={row}
              onEdit={() => { setEditRow(row); setModalOpen(true) }}
              onToggle={() => handleToggle(row.id)}
              onDelete={() => setDeleteId(row.id)}
              canDelete={canDeleteUser}
              showExpired={showExpiredCol}
            />
          ))
        )}
      </div>

      {/* Desktop table */}
      <div className="card overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>NIP</th>
                <th>Nama</th>
                <th>Jabatan</th>
                <th>Role</th>
                <th>Status</th>
                {showExpiredCol && <th>Kadaluwarsa</th>}
                <th className="text-right pr-5">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <SkeletonRow cols={showExpiredCol ? 7 : 6} rows={8} />
              : paginated.length === 0 ? <tr><td colSpan={showExpiredCol ? 7 : 6}><EmptyState title="Tidak ada user" /></td></tr>
              : paginated.map((row) => {
                const isExpired = row.expiredAt && new Date(row.expiredAt) < new Date()
                return (
                <tr key={row.id}>
                  <td><span className="font-mono text-[12px] text-blue-600 font-semibold">{row.nik}</span></td>
                  <td className="font-semibold text-app-text">{row.nama}</td>
                  <td className="text-app-muted text-[13px]">{row.jabatan ?? '—'}</td>
                  <td><RoleBadge role={row.role} /></td>
                  <td><StatusText aktif={row.aktif ?? true} /></td>
                  {showExpiredCol && (
                    <td className="text-[12px]">
                      {row.expiredAt ? (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center',
                          padding: '2px 8px', borderRadius: 999,
                          fontSize: 11, fontWeight: 600,
                          background: isExpired ? '#fef2f2' : '#f0fdf4',
                          color: isExpired ? '#dc2626' : '#15803d',
                          border: isExpired ? '1px solid #fecaca' : '1px solid #bbf7d0',
                        }}>
                          {isExpired ? 'Kedaluwarsa' : new Date(row.expiredAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      ) : <span className="text-app-muted">—</span>}
                    </td>
                  )}
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
                      ...(canDeleteUser ? [{
                        label: 'Hapus User',
                        icon: <Trash2 size={14} />,
                        onClick: () => setDeleteId(row.id),
                        danger: true, dividerBefore: true,
                      }] : []),
                    ]} />
                  </td>
                </tr>
              )
              })}
            </tbody>
          </table>
        </div>

        {/* Desktop pagination footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 20px', borderTop: '1px solid var(--color-app-border)',
          background: '#fff', flexWrap: 'wrap', gap: 8,
        }}>
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

          <span style={{ fontSize: 12, color: '#5F737F' }}>
            {filtered.length === 0
              ? 'Tidak ada data'
              : `Menampilkan ${startRow}–${endRow} dari ${filtered.length} data`}
          </span>

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
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...')
                acc.push(p)
                return acc
              }, [])
              .map((p, idx) =>
                p === '...' ? (
                  <span key={`e-${idx}`} style={{ fontSize: 12, color: '#94a3b8', padding: '0 2px' }}>…</span>
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

      {/* Mobile pagination */}
      <div className="md:hidden flex items-center justify-between mt-3 px-1">
        <span style={{ fontSize: 12, color: '#5F737F' }}>
          {filtered.length === 0 ? '0 data' : `${startRow}–${endRow} dari ${filtered.length}`}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              width: 44, height: 44, borderRadius: 8, border: '1px solid #e2e8f0',
              background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: page === 1 ? '#cbd5e1' : '#374151',
            }}
          >
            <ChevronLeft size={18} />
          </button>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#374151', minWidth: 60, textAlign: 'center' }}>
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              width: 44, height: 44, borderRadius: 8, border: '1px solid #e2e8f0',
              background: '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: page === totalPages ? '#cbd5e1' : '#374151',
            }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      </>)}

      {/* ── Permintaan Ganti Password ────────────────────────────────── */}
      {activeTab === 'password' && (<>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <KeyRound size={18} className="text-[#076c9e]" />
            <h2 className="text-lg font-bold text-app-text">Permintaan Ganti Password</h2>
            {pendingCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#D92D20] text-white text-[11px] font-bold">
                {pendingCount}
              </span>
            )}
          </div>
          <button onClick={fetchPwRequests} className="p-2 rounded-lg hover:bg-app-bg text-app-muted transition-colors" style={{ minWidth: 44, minHeight: 44 }} title="Refresh">
            <RefreshCw size={15} />
          </button>
        </div>

        <div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {pwLoading ? (
            <div className="text-center py-8 text-app-muted text-sm">Memuat...</div>
          ) : pwRequests.length === 0 ? (
            <div className="bg-white border border-app-border rounded-xl"><EmptyState title="Tidak ada permintaan" /></div>
          ) : pwRequests.map((req) => {
            const isPending = req.status === 'pending'
            const processing = pwProcessing === req.id
            return (
              <div key={req.id} className="bg-white border border-app-border rounded-xl p-4">
                <p className="font-semibold text-app-text text-[14px]">{req.pegawai?.nama ?? '—'}</p>
                <p className="font-mono text-[11px] text-blue-600 mt-0.5">{req.pegawai?.nik ?? '—'}</p>
                <p className="text-[12px] text-app-muted mt-1">{req.pegawai?.jabatan ?? '—'} · {req.pegawai?.unit ?? '—'}</p>
                <p className="text-[12px] text-app-muted mt-2">
                  {req.requestedAt && new Date(req.requestedAt).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
                <div className="mt-2">
                  {req.status === 'pending'  && <span className="badge-berlangsung">Menunggu</span>}
                  {req.status === 'approved' && <span className="badge-selesai">Disetujui</span>}
                  {req.status === 'rejected' && <span className="badge-menunggu">Ditolak</span>}
                  {req.status === 'expired'  && <span className="badge-menunggu opacity-60">Kedaluwarsa</span>}
                </div>
                {isPending ? (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleApprove(req.id)} disabled={processing}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-green-50 border border-green-200 text-green-700 text-[13px] font-semibold disabled:opacity-50"
                      style={{ minHeight: 44 }}
                    >
                      <Check size={14} /> Setujui
                    </button>
                    <button
                      onClick={() => handleReject(req.id)} disabled={processing}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-[13px] font-semibold disabled:opacity-50"
                      style={{ minHeight: 44 }}
                    >
                      <CircleX size={14} /> Tolak
                    </button>
                  </div>
                ) : (
                  <div className="mt-3">
                    <button
                      onClick={() => handleDeletePwRequest(req.id)} disabled={processing}
                      className="w-full flex items-center justify-center gap-1 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-[13px] font-semibold disabled:opacity-50"
                      style={{ minHeight: 44 }}
                    >
                      <Trash2 size={14} /> Hapus
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Desktop table */}
        <div className="card overflow-hidden hidden md:block">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Jabatan / Unit</th>
                  <th>Waktu Request</th>
                  <th>Kadaluwarsa</th>
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
                    const isExpiredReq = req.status === 'expired'
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
                          {req.reviewedBy?.nama ?? (isPending || isExpiredReq ? '—' : '—')}
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
                                onClick={() => handleApprove(req.id)} disabled={processing}
                                title="Setujui"
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 text-green-700 text-[12px] font-semibold hover:bg-green-100 transition disabled:opacity-50 cursor-pointer"
                              >
                                <Check size={13} /> Setujui
                              </button>
                              <button
                                onClick={() => handleReject(req.id)} disabled={processing}
                                title="Tolak"
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-[12px] font-semibold hover:bg-red-100 transition disabled:opacity-50 cursor-pointer"
                              >
                                <CircleX size={13} /> Tolak
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleDeletePwRequest(req.id)}
                              disabled={processing}
                              title="Hapus"
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-[12px] font-semibold hover:bg-red-100 transition disabled:opacity-50 cursor-pointer"
                            >
                              <Trash2 size={13} /> Hapus
                            </button>
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

      </>)}

      {/* ── Manajemen Unit ──────────────────────────────────────────── */}
      {activeTab === 'units' && (
        <UnitManagement units={units} onChanged={fetchUnits} />
      )}

      </div>{/* end tab content */}

      {/* Mobile filter bottom sheet */}
      <BottomSheet open={mobileFilterOpen} onClose={() => setMobileFilterOpen(false)} title="Filter">
        <FilterBody
          jabatan={jabatanFilter} setJabatan={setJabatanFilter}
          roleFilter={roleFilter} setRoleFilter={setRoleFilter}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          onApply={applyFilter} onClear={clearFilter}
        />
      </BottomSheet>

      <UserModal
        open={modalOpen}
        initial={editRow}
        onClose={() => setModalOpen(false)}
        onSaved={fetchData}
        unitOptions={units.map(u => u.nama)}
      />
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
