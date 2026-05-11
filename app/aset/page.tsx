'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FileUp, Eye, Pencil, Download, X, MapPin, Zap, Activity, Map, Trash2, HelpCircle, ExternalLink } from 'lucide-react'
import { towersApi, importApi, api, jalurKmlApi } from '@/lib/api'
import B2WLoader from '@/components/ui/B2WLoader'
import { isAdmin } from '@/lib/auth'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ActionMenu } from '@/components/ui/ActionMenu'
import { Pagination } from '@/components/ui/Pagination'
import { SearchInput } from '@/components/ui/SearchInput'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonRow } from '@/components/ui/SkeletonRow'

const TIPE_OPTIONS = ['Semua', 'SUTET', 'SUTT', 'SKTT', 'Gardu Induk']
const KONDISI_OPTIONS = ['Semua', 'normal', 'waspada', 'gangguan', 'maintenance']

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTanggal(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

function LabelValue({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] text-app-muted font-medium uppercase tracking-wide">{label}</span>
      <span className="text-[13px] text-app-text font-semibold">{value ?? '—'}</span>
    </div>
  )
}

// ── Detail Drawer ─────────────────────────────────────────────────────────────

function AsetDetailDrawer({
  towerId,
  open,
  onClose,
}: {
  towerId: string | null
  open: boolean
  onClose: () => void
}) {
  const [tower, setTower] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open || !towerId) { setTower(null); return }
    setLoading(true)
    towersApi.getById(towerId)
      .then((res) => setTower(res.data))
      .catch(() => toast.error('Gagal memuat detail tower'))
      .finally(() => setLoading(false))
  }, [open, towerId])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />
      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: 480,
          zIndex: 50,
          background: '#FFFFFF',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #E1E8EC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: 15, color: '#1c1c1c', margin: 0 }}>Detail Aset Transmisi</h2>
            {tower && (
              <p style={{ fontSize: 12, color: '#97AAB3', margin: '2px 0 0' }}>
                {tower.id}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{ padding: 6, borderRadius: 6, border: 'none', background: '#F6F9FC', cursor: 'pointer', color: '#5F737F', display: 'flex', alignItems: 'center' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ height: 40, background: '#F6F9FC', borderRadius: 6, animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          ) : !tower ? (
            <p style={{ color: '#97AAB3', textAlign: 'center', marginTop: 40 }}>Data tidak tersedia</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Info Utama */}
              <div style={{ background: '#F6F9FC', borderRadius: 10, padding: '16px' }}>
                <p style={{ fontWeight: 700, fontSize: 12, color: '#0F172A', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Informasi Tower</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
                  <LabelValue label="ID Tower" value={tower.id} />
                  <LabelValue label="Nama" value={tower.nama} />
                  <LabelValue label="Tipe" value={tower.tipe} />
                  <LabelValue label="Tegangan" value={tower.tegangan} />
                  <LabelValue label="Kondisi" value={tower.kondisi} />
                  <LabelValue label="Radius" value={tower.radius ? `${tower.radius} m` : undefined} />
                </div>
              </div>

              {/* Lokasi */}
              <div style={{ background: '#F6F9FC', borderRadius: 10, padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  <MapPin size={13} color="#5F737F" />
                  <p style={{ fontWeight: 700, fontSize: 12, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Lokasi & Koordinat</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
                  <LabelValue label="Latitude" value={tower.lat} />
                  <LabelValue label="Longitude" value={tower.lng} />
                  <div style={{ gridColumn: '1 / -1' }}>
                    <LabelValue label="Lokasi" value={tower.lokasi} />
                  </div>
                </div>
              </div>

              {/* Jalur */}
              {(tower.jalur || tower.nomorUrut) && (
                <div style={{ background: '#F6F9FC', borderRadius: 10, padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                    <Zap size={13} color="#5F737F" />
                    <p style={{ fontWeight: 700, fontSize: 12, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Jalur Transmisi</p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <LabelValue label="Nama Jalur" value={tower.jalur} />
                    </div>
                    <LabelValue label="Nomor Urut" value={tower.nomorUrut} />
                  </div>
                </div>
              )}

              {/* Laporan Recent */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <Activity size={13} color="#5F737F" />
                  <p style={{ fontWeight: 700, fontSize: 12, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                    Laporan Terkini ({(tower.laporan ?? []).length})
                  </p>
                </div>
                {(tower.laporan ?? []).length === 0 ? (
                  <div style={{ background: '#F6F9FC', borderRadius: 10, padding: '24px 16px', textAlign: 'center', color: '#97AAB3', fontSize: 13 }}>
                    Tidak ada laporan
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {(tower.laporan ?? []).slice(0, 5).map((lap: any) => (
                      <div
                        key={lap.id}
                        style={{
                          background: '#F6F9FC',
                          borderRadius: 10,
                          padding: '12px 14px',
                          borderLeft: `3px solid ${lap.levelRisiko === 'kritis' ? '#ef4444' : lap.levelRisiko === 'sedang' ? '#f59e0b' : '#22c55e'}`,
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                          <span style={{ fontWeight: 600, fontSize: 12, color: '#1c1c1c', textTransform: 'capitalize' }}>
                            {lap.jenisGangguan?.replace(/_/g, ' ') ?? '—'}
                          </span>
                          <span style={{
                            fontSize: 10, fontWeight: 600,
                            padding: '2px 8px', borderRadius: 999,
                            background: lap.status === 'berlangsung' ? '#FEE2E2' : lap.status === 'selesai' ? '#DCFCE7' : '#F1F5F9',
                            color: lap.status === 'berlangsung' ? '#DC2626' : lap.status === 'selesai' ? '#16A34A' : '#64748B',
                          }}>
                            {lap.status?.replace(/_/g, ' ') ?? '—'}
                          </span>
                        </div>
                        <p style={{ fontSize: 11, color: '#5F737F', margin: '0 0 4px' }}>{lap.deskripsi ?? '—'}</p>
                        <span style={{ fontSize: 10, color: '#97AAB3' }}>{formatTanggal(lap.tanggal)}</span>
                        {lap.pelapor && (
                          <span style={{ fontSize: 10, color: '#97AAB3', marginLeft: 8 }}>· {lap.pelapor.nama}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ── Edit Drawer ───────────────────────────────────────────────────────────────

const KONDISI_EDIT_OPTIONS = ['normal', 'waspada', 'gangguan', 'maintenance']
const TIPE_EDIT_OPTIONS    = ['SUTET', 'SUTT', 'SKTT', 'garduInduk']

function AsetEditDrawer({
  tower,
  open,
  onClose,
  onSaved,
}: {
  tower: any | null
  open: boolean
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState<any>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open && tower) {
      setForm({
        nama:      tower.nama     ?? '',
        tegangan:  tower.tegangan ?? '',
        tipe:      tower.tipe     ?? '',
        kondisi:   tower.kondisi  ?? 'normal',
        lokasi:    tower.lokasi   ?? '',
        lat:       tower.lat      ?? '',
        lng:       tower.lng      ?? '',
        radius:    tower.radius   ?? 100,
        jalur:     tower.jalur    ?? '',
        nomorUrut: tower.nomorUrut ?? '',
      })
    }
  }, [open, tower])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!tower?.id) return
    setSaving(true)
    try {
      await towersApi.update(tower.id, {
        nama:      form.nama,
        tegangan:  form.tegangan,
        tipe:      form.tipe,
        kondisi:   form.kondisi,
        lokasi:    form.lokasi || null,
        lat:       Number(form.lat),
        lng:       Number(form.lng),
        radius:    Number(form.radius),
        jalur:     form.jalur || null,
        nomorUrut: form.nomorUrut ? Number(form.nomorUrut) : null,
      })
      toast.success('Data tower berhasil diperbarui')
      onSaved()
      onClose()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Gagal menyimpan perubahan')
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  const set = (k: string, v: string) => setForm((f: any) => ({ ...f, [k]: v }))

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: 480,
          zIndex: 50,
          background: '#FFFFFF',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #E1E8EC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: 15, color: '#1c1c1c', margin: 0 }}>Edit Aset Tower</h2>
            {tower && <p style={{ fontSize: 12, color: '#97AAB3', margin: '2px 0 0' }}>{tower.id}</p>}
          </div>
          <button
            onClick={onClose}
            style={{ padding: 6, borderRadius: 6, border: 'none', background: '#F6F9FC', cursor: 'pointer', color: '#5F737F', display: 'flex', alignItems: 'center' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Nama */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-app-muted">Nama Tower <span className="text-red-500">*</span></label>
            <input
              className="form-input"
              value={form.nama ?? ''}
              onChange={(e) => set('nama', e.target.value)}
              required
              placeholder="Nama tower"
            />
          </div>

          {/* Tipe + Tegangan */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-app-muted">Tipe</label>
              <select className="form-input" value={form.tipe ?? ''} onChange={(e) => set('tipe', e.target.value)}>
                {TIPE_EDIT_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-app-muted">Tegangan</label>
              <input className="form-input" value={form.tegangan ?? ''} onChange={(e) => set('tegangan', e.target.value)} placeholder="500kV" />
            </div>
          </div>

          {/* Kondisi */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-app-muted">Kondisi</label>
            <select className="form-input" value={form.kondisi ?? 'normal'} onChange={(e) => set('kondisi', e.target.value)}>
              {KONDISI_EDIT_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>

          {/* Lat + Lng */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-app-muted">Latitude</label>
              <input className="form-input" type="number" step="any" value={form.lat ?? ''} onChange={(e) => set('lat', e.target.value)} placeholder="-6.1234" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-app-muted">Longitude</label>
              <input className="form-input" type="number" step="any" value={form.lng ?? ''} onChange={(e) => set('lng', e.target.value)} placeholder="106.7654" />
            </div>
          </div>

          {/* Lokasi */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-app-muted">Lokasi</label>
            <input className="form-input" value={form.lokasi ?? ''} onChange={(e) => set('lokasi', e.target.value)} placeholder="Kel. Rawa Buaya, Cengkareng" />
          </div>

          {/* Radius */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-app-muted">Radius Deteksi (m)</label>
            <input className="form-input" type="number" value={form.radius ?? 100} onChange={(e) => set('radius', e.target.value)} placeholder="100" />
          </div>

          {/* Jalur + Nomor Urut */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-app-muted">Jalur Transmisi</label>
            <input className="form-input" value={form.jalur ?? ''} onChange={(e) => set('jalur', e.target.value)} placeholder="SUTET 500kV DURIKOSAMBI-KEMBANGAN" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-app-muted">Nomor Urut dalam Jalur</label>
            <input className="form-input" type="number" value={form.nomorUrut ?? ''} onChange={(e) => set('nomorUrut', e.target.value)} placeholder="1" />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, paddingTop: 8, marginTop: 4, borderTop: '1px solid #E1E8EC' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ flex: 1, padding: '10px 0', border: '1px solid #E1E8EC', borderRadius: 8, background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 13, color: '#5F737F' }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{ flex: 2, padding: '10px 0', border: 'none', borderRadius: 8, background: '#076C9E', cursor: 'pointer', fontWeight: 600, fontSize: 13, color: '#fff', opacity: saving ? 0.7 : 1 }}
            >
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AsetPage() {
  const [rows, setRows]       = useState<any[]>([])
  const [total, setTotal]     = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [tipe, setTipe]       = useState('')
  const [kondisi, setKondisi] = useState('')
  const [page, setPage]       = useState(1)
  const [limit, setLimit]     = useState(10)

  const [isAdminUser, setIsAdminUser] = useState(false)
  useEffect(() => { setIsAdminUser(isAdmin()) }, [])

  const importRef = useRef<HTMLInputElement>(null)
  const [importing, setImporting] = useState(false)
  const [downloading, setDownloading] = useState(false)

  // Detail drawer
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailRow, setDetailRow]   = useState<any>(null)

  // Edit drawer
  const [editOpen, setEditOpen]   = useState(false)
  const [editRow, setEditRow]     = useState<any>(null)

  // Jalur KML
  const kmlRef = useRef<HTMLInputElement>(null)
  const [uploadingKml, setUploadingKml] = useState(false)
  const [jalurKmlList, setJalurKmlList] = useState<any[]>([])
  const [loadingKml, setLoadingKml] = useState(true)
  const [showKmlGuide, setShowKmlGuide] = useState(false)

  const fetchJalurKml = useCallback(async () => {
    setLoadingKml(true)
    try {
      const res = await jalurKmlApi.getAll()
      setJalurKmlList(res.data?.data ?? [])
    } catch {
      setJalurKmlList([])
    } finally {
      setLoadingKml(false)
    }
  }, [])

  useEffect(() => { fetchJalurKml() }, [fetchJalurKml])

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
      const res = await towersApi.getAll({
        page, limit,
        search: q || undefined,
        tipe: tipe || undefined,
        kondisi: kondisi || undefined,
      })
      const p = res.data
      if (Array.isArray(p)) { setRows(p); setTotal(p.length) }
      else { setRows(p.data ?? []); setTotal(p.total ?? 0) }
    } catch {
      setRows([]); setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [page, limit, q, tipe, kondisi])

  useEffect(() => { fetchData() }, [fetchData])

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    try {
      await importApi.import('towers', file)
      toast.success('Import berhasil')
      fetchData()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Import gagal')
    } finally {
      setImporting(false)
      if (importRef.current) importRef.current.value = ''
    }
  }

  async function handleDownloadTemplate() {
    setDownloading(true)
    try {
      const res = await api.get('/import/template/towers', { responseType: 'blob' })
      const url = URL.createObjectURL(res.data)
      const a = document.createElement('a')
      a.href = url
      a.download = 'template-import-tower.xlsx'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Gagal mengunduh template')
    } finally {
      setDownloading(false)
    }
  }

  async function handleUploadKml(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingKml(true)
    try {
      const res = await jalurKmlApi.upload(file)
      const { towers, jalur } = res.data?.data ?? {}
      const parts = []
      if (towers > 0) parts.push(`${towers} tower/gardu baru`)
      if (jalur > 0) parts.push(`${jalur} jalur`)
      toast.success(`Import KML berhasil: ${parts.length ? parts.join(', ') : 'tidak ada data baru'}`)
      fetchJalurKml()
      fetchData()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Upload KML gagal')
    } finally {
      setUploadingKml(false)
      if (kmlRef.current) kmlRef.current.value = ''
    }
  }

  async function handleDeleteKml(id: number) {
    try {
      await jalurKmlApi.remove(id)
      toast.success('Jalur berhasil dihapus')
      fetchJalurKml()
    } catch {
      toast.error('Gagal menghapus jalur')
    }
  }

  return (
    <>
      {uploadingKml && <B2WLoader fullPage label="Mengimport data KML..." />}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-app-text">Data Aset Transmisi</h1>
        {isAdminUser && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadTemplate}
              disabled={downloading}
              className="btn-outline"
            >
              <Download size={15} />
              {downloading ? 'Mengunduh...' : 'Download Template'}
            </button>
            <button
              onClick={() => importRef.current?.click()}
              disabled={importing}
              className="btn-outline"
            >
              <FileUp size={15} />
              {importing ? 'Mengimpor...' : 'Import Excel'}
            </button>
            <input ref={importRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleImport} />
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="card card-body mb-4 flex items-center gap-3 flex-wrap">
        <SearchInput
          value={search}
          onChange={(v) => { setSearch(v); setPage(1) }}
          placeholder="Cari ID atau nama tower"
        />
        <select
          value={tipe}
          onChange={(e) => { setTipe(e.target.value === 'Semua' ? '' : e.target.value); setPage(1) }}
          className="form-input w-auto pr-8"
          style={{ height: 40 }}
        >
          {TIPE_OPTIONS.map((t) => <option key={t} value={t === 'Semua' ? '' : t}>{t}</option>)}
        </select>
        <select
          value={kondisi}
          onChange={(e) => { setKondisi(e.target.value === 'Semua' ? '' : e.target.value); setPage(1) }}
          className="form-input w-auto pr-8"
          style={{ height: 40 }}
        >
          {KONDISI_OPTIONS.map((k) => <option key={k} value={k === 'Semua' ? '' : k}>{k}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-10">No</th>
                <th>ID Tower</th>
                <th>Nama Tower</th>
                <th>Tipe</th>
                <th>Tegangan (kV)</th>
                <th>Jalur</th>
                <th>Kondisi</th>
                <th>Lokasi</th>
                <th className="text-right pr-5">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRow cols={9} rows={limit} />
              ) : rows.length === 0 ? (
                <tr><td colSpan={9}><EmptyState title="Belum ada data Aset Transmisi." /></td></tr>
              ) : (
                rows.map((row, i) => (
                  <tr key={row.id}>
                    <td className="text-app-muted text-[12px]">{(page - 1) * limit + i + 1}</td>
                    <td>
                      <span className="font-mono text-[12px] text-blue-600 font-semibold">
                        {row.nomorTower ?? row.id}
                      </span>
                    </td>
                    <td className="font-semibold text-app-text">{row.namaTower ?? row.nama ?? '—'}</td>
                    <td className="text-app-muted">{row.tipe ?? '—'}</td>
                    <td className="font-mono text-[12px]">{row.tegangan ?? '—'}</td>
                    <td className="text-app-muted text-[12px] max-w-[180px] truncate" title={row.jalur ?? ''}>{row.jalur ?? '—'}</td>
                    <td><StatusBadge status={row.kondisi ?? 'normal'} /></td>
                    <td className="text-app-muted text-[12px] max-w-[200px] truncate">{row.lokasi ?? '—'}</td>
                    <td className="text-right pr-4">
                      <ActionMenu items={[
                        {
                          label: 'Lihat Detail',
                          icon: <Eye size={14} />,
                          onClick: () => { setDetailRow(row); setDetailOpen(true) },
                        },
                        ...(isAdminUser ? [{
                          label: 'Edit',
                          icon: <Pencil size={14} />,
                          onClick: () => { setEditRow(row); setEditOpen(true) },
                        }] : []),
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

      {/* Detail Drawer */}
      <AsetDetailDrawer
        towerId={detailRow?.id ?? null}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />

      {/* Edit Drawer */}
      <AsetEditDrawer
        tower={editRow}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSaved={fetchData}
      />

      {/* KML Guide Modal */}
      {showKmlGuide && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowKmlGuide(false)} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            zIndex: 50, background: '#fff', borderRadius: 12, boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
            width: '100%', maxWidth: 520, maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid #E1E8EC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="flex items-center gap-2">
                <HelpCircle size={16} className="text-blue-600" />
                <h2 style={{ fontWeight: 700, fontSize: 15, color: '#1c1c1c', margin: 0 }}>Cara Download KML di Google Maps</h2>
              </div>
              <button onClick={() => setShowKmlGuide(false)} style={{ padding: 6, borderRadius: 6, border: 'none', background: '#F6F9FC', cursor: 'pointer', color: '#5F737F', display: 'flex', alignItems: 'center' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontSize: 13, color: '#5F737F', margin: 0 }}>
                File KML yang bisa diimport harus berisi data koordinat jalur transmisi (LineString). Ikuti langkah berikut untuk mendownload dari Google My Maps:
              </p>
              {[
                { step: '1', text: 'Buka Google My Maps di browser (mymap.google.com)' },
                { step: '2', text: 'Pilih atau buat peta yang berisi data jalur transmisi' },
                { step: '3', text: 'Klik ikon titik tiga (⋮) di samping nama peta' },
                { step: '4', text: 'Pilih "Export to KML/KMZ"' },
                { step: '5', text: 'Pastikan pilih format KML (bukan KMZ) lalu klik Download' },
                { step: '6', text: 'Upload file .kml yang sudah didownload ke sistem ini' },
              ].map(({ step, text }) => (
                <div key={step} className="flex items-start gap-3">
                  <div style={{ minWidth: 24, height: 24, borderRadius: '50%', background: '#076C9E', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                    {step}
                  </div>
                  <p style={{ fontSize: 13, color: '#1c1c1c', margin: 0, paddingTop: 3 }}>{text}</p>
                </div>
              ))}
              <div style={{ background: '#FEF3C7', borderRadius: 8, padding: '12px 14px', marginTop: 4 }}>
                <p style={{ fontSize: 12, color: '#92400E', margin: 0, fontWeight: 500 }}>
                  ⚠️ Catatan: File KML yang berisi NetworkLink (link ke Google Maps) tidak bisa diimport langsung — harus download dulu data aktualnya.
                </p>
              </div>
              <a
                href="https://mymap.google.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#076C9E', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
              >
                <ExternalLink size={13} />
                Buka Google My Maps
              </a>
            </div>
          </div>
        </>
      )}

      {/* Jalur KML Section */}
      <input ref={kmlRef} type="file" accept=".kml" className="hidden" onChange={handleUploadKml} />
      <div className="card overflow-hidden mt-6">
        <div className="flex items-center justify-between px-5 py-4 border-b border-app-border">
          <div className="flex items-center gap-2">
            <Map size={16} className="text-app-muted" />
            <h2 className="text-[14px] font-bold text-app-text">Jalur KML</h2>
            <span className="text-[11px] text-app-muted bg-app-surface px-2 py-0.5 rounded-full">
              {jalurKmlList.length} jalur
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKmlGuide(true)}
              className="btn-outline"
              style={{ fontSize: 12 }}
            >
              <HelpCircle size={14} />
              Cara Download KML
            </button>
            {isAdminUser && (
              <button
                onClick={() => kmlRef.current?.click()}
                disabled={uploadingKml}
                className="btn-primary"
                style={{ fontSize: 12 }}
              >
                <Map size={14} />
                {uploadingKml ? 'Mengimport...' : 'Import KML'}
              </button>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-10">No</th>
                <th>Nama Jalur</th>
                <th>Tipe</th>
                <th>Warna</th>
                <th>Titik Koordinat</th>
                <th>Ditambahkan</th>
                {isAdminUser && <th className="text-right pr-5">Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {loadingKml ? (
                <SkeletonRow cols={isAdminUser ? 7 : 6} rows={3} />
              ) : jalurKmlList.length === 0 ? (
                <tr>
                  <td colSpan={isAdminUser ? 7 : 6}>
                    <EmptyState title="Belum ada jalur KML. Upload file .kml untuk menampilkan jalur transmisi di peta." />
                  </td>
                </tr>
              ) : (
                jalurKmlList.map((jalur: any, i: number) => (
                  <tr key={jalur.id}>
                    <td className="text-app-muted text-[12px]">{i + 1}</td>
                    <td className="font-semibold text-app-text">{jalur.nama}</td>
                    <td>
                      <span style={{
                        fontSize: 11, fontWeight: 600,
                        padding: '2px 8px', borderRadius: 999,
                        background: jalur.tipe === 'SUTET' ? '#FEF3C7' : jalur.tipe === 'SKTT' ? '#EDE9FE' : '#DBEAFE',
                        color: jalur.tipe === 'SUTET' ? '#92400E' : jalur.tipe === 'SKTT' ? '#5B21B6' : '#1E40AF',
                      }}>
                        {jalur.tipe}
                      </span>
                    </td>
                    <td>
                      {jalur.warna ? (
                        <div className="flex items-center gap-2">
                          <div style={{ width: 14, height: 14, borderRadius: 3, background: jalur.warna, border: '1px solid #E1E8EC' }} />
                          <span className="font-mono text-[11px] text-app-muted">{jalur.warna}</span>
                        </div>
                      ) : (
                        <span className="text-app-muted text-[12px]">—</span>
                      )}
                    </td>
                    <td className="text-app-muted text-[12px]">
                      {Array.isArray(jalur.path) ? `${jalur.path.length} titik` : '—'}
                    </td>
                    <td className="text-app-muted text-[12px]">
                      {jalur.createdAt
                        ? new Date(jalur.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '—'}
                    </td>
                    {isAdminUser && (
                      <td className="text-right pr-4">
                        <button
                          onClick={() => handleDeleteKml(jalur.id)}
                          style={{
                            padding: '5px 10px', borderRadius: 6, border: '1px solid #FCA5A5',
                            background: '#FFF', cursor: 'pointer', color: '#DC2626',
                            display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600,
                          }}
                        >
                          <Trash2 size={13} />
                          Hapus
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
