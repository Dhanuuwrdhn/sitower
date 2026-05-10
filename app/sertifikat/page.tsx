'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FolderOpen, Plus, Search, SlidersHorizontal, MoreHorizontal, X, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { sertifikatApi } from '@/lib/api'
import { isAdmin } from '@/lib/auth'
import { EmptyState } from '@/components/ui/EmptyState'

const KATEGORI_OPTIONS = ['Kelayakan', 'Grounding', 'Konstruksi', 'K3', 'Lingkungan']
const STATUS_OPTIONS    = ['berlaku', 'expired']

// ─── Tambah Folder Modal ───────────────────────────────────────────────────────

function TambahFolderModal({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved: () => void }) {
  const [form, setForm]     = useState({ nama: '', kategori: 'Kelayakan', towerId: '', berlakuHingga: '' })
  const [saving, setSaving] = useState(false)
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nama.trim()) { toast.error('Nama folder wajib diisi'); return }
    setSaving(true)
    try {
      await sertifikatApi.createFolder({
        nama:     form.nama,
        kategori: form.kategori,
        ...(form.towerId       && { towerId: form.towerId }),
        ...(form.berlakuHingga && { berlakuHingga: form.berlakuHingga }),
      })
      toast.success('Folder berhasil dibuat')
      onSaved(); onClose()
      setForm({ nama: '', kategori: 'Kelayakan', towerId: '', berlakuHingga: '' })
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Gagal membuat folder')
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[440px] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-app-border">
          <h2 className="text-[15px] font-bold text-app-text">Tambah Folder Sertifikat</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-app-bg text-app-muted"><X size={18} /></button>
        </div>
        <form id="folder-form" onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Nama Folder <span className="text-red-500">*</span></label>
            <input
              type="text" value={form.nama} onChange={(e) => set('nama', e.target.value)}
              className="form-input" placeholder="cth. Sertifikat Tower PLN No. 123"
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Kategori</label>
            <select value={form.kategori} onChange={(e) => set('kategori', e.target.value)} className="form-input">
              {KATEGORI_OPTIONS.map((k) => <option key={k}>{k}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">ID Tower (opsional)</label>
            <input
              type="text" value={form.towerId} onChange={(e) => set('towerId', e.target.value)}
              className="form-input" placeholder="cth. ST-001"
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-app-text mb-1.5">Berlaku Hingga (opsional)</label>
            <input type="date" value={form.berlakuHingga} onChange={(e) => set('berlakuHingga', e.target.value)} className="form-input" />
          </div>
        </form>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-app-border">
          <button type="button" onClick={onClose} className="btn-outline">Batal</button>
          <button type="submit" form="folder-form" disabled={saving} className="btn-primary">
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Filter Popup ──────────────────────────────────────────────────────────────

function FilterPopup({
  open, onClose, kategori, status,
  onKategori, onStatus, onApply, onReset,
}: {
  open: boolean; onClose: () => void
  kategori: string; status: string
  onKategori: (v: string) => void; onStatus: (v: string) => void
  onApply: () => void; onReset: () => void
}) {
  if (!open) return null
  return (
    <div className="absolute right-0 top-full mt-2 z-30 bg-white rounded-2xl shadow-xl border border-app-border w-72" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-app-border">
        <span className="text-[14px] font-bold text-app-text">Filter</span>
        <button onClick={onClose} className="p-1 rounded hover:bg-app-bg text-app-muted"><X size={16} /></button>
      </div>
      <div className="px-5 py-4 space-y-4">
        <div>
          <p className="text-[12px] font-semibold text-app-text mb-2">Kategori</p>
          <div className="flex flex-wrap gap-2">
            {KATEGORI_OPTIONS.map((k) => (
              <button
                key={k}
                onClick={() => onKategori(kategori === k ? '' : k)}
                className={`px-3 py-1 rounded-full text-[12px] font-medium border transition-colors ${
                  kategori === k
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-app-text border-app-border hover:border-blue-300'
                }`}
              >{k}</button>
            ))}
          </div>
        </div>
        <hr className="border-app-border" />
        <div>
          <p className="text-[12px] font-semibold text-app-text mb-2">Status</p>
          <div className="flex gap-2">
            {[{ v: 'berlaku', l: 'Masih Berlaku' }, { v: 'expired', l: 'Expired' }].map(({ v, l }) => (
              <button
                key={v}
                onClick={() => onStatus(status === v ? '' : v)}
                className={`px-3 py-1 rounded-full text-[12px] font-medium border transition-colors ${
                  status === v
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-app-text border-app-border hover:border-blue-300'
                }`}
              >{l}</button>
            ))}
          </div>
        </div>
      </div>
      <hr className="border-app-border" />
      <div className="flex gap-2 px-5 py-3.5">
        <button onClick={onApply} className="btn-primary flex-1 text-[13px]">Terapkan Filter</button>
        <button onClick={onReset} className="btn-outline flex-1 text-[13px]">Hapus Filter</button>
      </div>
    </div>
  )
}

// ─── Folder Card ───────────────────────────────────────────────────────────────

function FolderCard({
  folder, showAdmin, onClick, onDelete,
}: {
  folder: any; showAdmin: boolean
  onClick: () => void; onDelete: (id: string) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  return (
    <div className="sert-folder-card" onClick={onClick}>
      {/* Head */}
      <div className="sert-folder-head">
        <FolderOpen size={32} color="#ffffff" strokeWidth={1.5} />
      </div>
      {/* Body */}
      <div className="sert-folder-body">
        <div className="sert-folder-row">
          <p className="sert-folder-name">{folder.nama}</p>
          {showAdmin && (
            <div ref={menuRef} className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                className="sert-dots-btn"
                onClick={() => setMenuOpen((v) => !v)}
              >
                <MoreHorizontal size={18} />
              </button>
              {menuOpen && (
                <div className="sert-dots-menu">
                  <button
                    className="sert-dots-item sert-dots-item--danger"
                    onClick={() => { setMenuOpen(false); onDelete(folder.id) }}
                  >
                    Hapus Folder
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {folder.kategori && (
          <p className="sert-folder-meta">{folder.kategori}{folder._count?.dokumen !== undefined ? ` · ${folder._count.dokumen} file` : ''}</p>
        )}
      </div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function SertifikatPage() {
  const router      = useRouter()
  const [folders, setFolders]     = useState<any[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [kategori, setKategori]   = useState('')
  const [status, setStatus]       = useState('')
  const [filterKat, setFilterKat] = useState('')
  const [filterSts, setFilterSts] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [tambahOpen, setTambahOpen] = useState(false)
  const [deleteId, setDeleteId]   = useState<string | null>(null)
  const [deleting, setDeleting]   = useState(false)
  const [adminUser, setAdminUser] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setAdminUser(isAdmin()) }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await sertifikatApi.getFolders({
        ...(search   && { search }),
        ...(kategori && { kategori }),
        ...(status   && { status }),
      })
      setFolders(Array.isArray(res.data) ? res.data : (res.data?.data ?? []))
    } catch {
      setFolders([])
    } finally {
      setLoading(false)
    }
  }, [search, kategori, status])

  useEffect(() => { fetchData() }, [fetchData])

  function applyFilter() {
    setKategori(filterKat)
    setStatus(filterSts)
    setFilterOpen(false)
  }
  function resetFilter() {
    setFilterKat(''); setFilterSts('')
    setKategori(''); setStatus('')
    setFilterOpen(false)
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    try {
      await sertifikatApi.deleteFolder(deleteId)
      toast.success('Folder dihapus')
      fetchData()
    } catch {
      toast.error('Gagal menghapus folder')
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const activeFilter = !!(kategori || status)

  return (
    <>
      <h1 className="text-[20px] font-bold text-app-text mb-5">Sertifikat</h1>

      {/* Top bar */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          {/* Search */}
          <div className="sert-search-wrap flex-1">
            <Search size={15} className="sert-search-icon" />
            <input
              className="sert-search-input"
              placeholder="Cari berdasarkan nama tower"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {/* Filter toggle */}
          <div ref={filterRef} className="relative">
            <button
              className={`sert-filter-btn ${activeFilter ? 'sert-filter-btn--active' : ''}`}
              onClick={() => { setFilterKat(kategori); setFilterSts(status); setFilterOpen((v) => !v) }}
            >
              <SlidersHorizontal size={16} />
            </button>
            <FilterPopup
              open={filterOpen} onClose={() => setFilterOpen(false)}
              kategori={filterKat} status={filterSts}
              onKategori={setFilterKat} onStatus={setFilterSts}
              onApply={applyFilter} onReset={resetFilter}
            />
          </div>
        </div>
        {adminUser && (
          <button className="btn-primary shrink-0" onClick={() => setTambahOpen(true)}>
            <Plus size={16} /> Tambah Sertifikat Baru
          </button>
        )}
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[13px] text-app-muted mb-5">
        <span className="font-medium text-app-text">Beranda</span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="sert-grid">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="sert-folder-card animate-pulse">
              <div className="sert-folder-head" style={{ background: '#e2e8f0' }} />
              <div className="sert-folder-body">
                <div className="h-4 bg-gray-100 rounded w-4/5 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-2/5" />
              </div>
            </div>
          ))}
        </div>
      ) : folders.length === 0 ? (
        <div className="card"><EmptyState title="Belum ada data Sertifikat." /></div>
      ) : (
        <div className="sert-grid">
          {folders.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              showAdmin={adminUser}
              onClick={() => router.push(`/sertifikat/${folder.id}`)}
              onDelete={setDeleteId}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <TambahFolderModal open={tambahOpen} onClose={() => setTambahOpen(false)} onSaved={fetchData} />

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-[380px] p-6 text-center">
            <p className="text-[16px] font-bold text-app-text mb-1.5">Hapus Folder?</p>
            <p className="text-[13px] text-app-muted mb-5">Semua dokumen di dalam folder ini akan ikut terhapus permanen.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-outline flex-1">Batal</button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 btn-primary"
                style={{ background: '#d92c20' }}
              >
                {deleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
