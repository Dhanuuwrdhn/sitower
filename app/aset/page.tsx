'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Eye, Pencil, X, MapPin, Zap, Activity, ExternalLink, Plus } from 'lucide-react'
import { towersApi, asetApi } from '@/lib/api'
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
    asetApi.getTowerById(towerId)
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
                    <LabelValue label="Lokasi" value={tower.lokasi ?? (tower.lat && tower.lng ? `${Number(tower.lat).toFixed(6)}, ${Number(tower.lng).toFixed(6)}` : undefined)} />
                  </div>
                </div>
              </div>

              {/* Kerawanan */}
              {(tower.statusKerawanan || tower.jenisKerawanan) && (
                <div style={{ background: '#F6F9FC', borderRadius: 10, padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                    <Activity size={13} color="#5F737F" />
                    <p style={{ fontWeight: 700, fontSize: 12, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Status Kerawanan</p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
                    <LabelValue label="Status" value={tower.statusKerawanan} />
                    <LabelValue label="Jenis" value={tower.jenisKerawanan ?? '—'} />
                    {tower.pplNotes && <div style={{ gridColumn: '1 / -1' }}><LabelValue label="Catatan PPL" value={tower.pplNotes} /></div>}
                    {tower.penanggungJawab && <LabelValue label="Penanggung Jawab" value={tower.penanggungJawab} />}
                    {tower.telepon && <LabelValue label="Telepon" value={tower.telepon} />}
                    {tower.sertifikatLink && (
                      <div style={{ gridColumn: '1 / -1' }}>
                        <span className="text-[11px] text-app-muted font-medium uppercase tracking-wide">Sertifikat</span>
                        <div>
                          <a href={tower.sertifikatLink} target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: 12, color: '#076C9E', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <ExternalLink size={11} /> Lihat di Google Drive
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Jalur */}
              {(tower.jalur || tower.nomorUrut || tower.route) && (
                <div style={{ background: '#F6F9FC', borderRadius: 10, padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                    <Zap size={13} color="#5F737F" />
                    <p style={{ fontWeight: 700, fontSize: 12, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Jalur Transmisi</p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <LabelValue label="Nama Jalur" value={tower.route?.nama ?? tower.jalur} />
                    </div>
                    <LabelValue label="Nomor Urut" value={tower.nomorUrut} />
                    {tower.route?.lineType && <LabelValue label="Tipe Saluran" value={`${tower.route.lineType.kode} ${tower.route.lineType.tegangan}`} />}
                    {tower.route?.garduDari && <LabelValue label="Dari Gardu" value={tower.route.garduDari.nama} />}
                    {tower.route?.garduKe   && <LabelValue label="Ke Gardu"   value={tower.route.garduKe.nama} />}
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

// ── Add Drawer ────────────────────────────────────────────────────────────────

const EMPTY_FORM = { id: '', nama: '', tegangan: '150kV', tipe: 'SUTT', kondisi: 'normal', lokasi: '', lat: '', lng: '', radius: 100, jalur: '', nomorUrut: '' }

function AsetAddDrawer({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<any>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(() => { if (open) setForm(EMPTY_FORM) }, [open])

  const set = (k: string, v: string) => setForm((f: any) => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.id.trim()) { toast.error('ID tower wajib diisi'); return }
    if (!form.nama.trim()) { toast.error('Nama tower wajib diisi'); return }
    setSaving(true)
    try {
      await towersApi.create({
        id:        form.id.trim().toUpperCase(),
        nama:      form.nama,
        tegangan:  form.tegangan,
        tipe:      form.tipe,
        kondisi:   form.kondisi,
        lokasi:    form.lokasi || null,
        lat:       Number(form.lat),
        lng:       Number(form.lng),
        radius:    Number(form.radius) || 100,
        jalur:     form.jalur || null,
        nomorUrut: form.nomorUrut ? Number(form.nomorUrut) : null,
      })
      toast.success('Tower berhasil ditambahkan')
      onSaved()
      onClose()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Gagal menambahkan tower')
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 480, zIndex: 50, background: '#FFFFFF', boxShadow: '-4px 0 24px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #E1E8EC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontWeight: 700, fontSize: 15, color: '#1c1c1c', margin: 0 }}>Tambah Tower Baru</h2>
          <button onClick={onClose} style={{ padding: 6, borderRadius: 6, border: 'none', background: '#F6F9FC', cursor: 'pointer', color: '#5F737F', display: 'flex', alignItems: 'center' }}>
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-app-muted">ID Tower <span className="text-red-500">*</span></label>
            <input className="form-input" value={form.id} onChange={(e) => set('id', e.target.value)} required placeholder="TOWER-SUTT-150KV-KMBNG-#001" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-app-muted">Nama Tower <span className="text-red-500">*</span></label>
            <input className="form-input" value={form.nama} onChange={(e) => set('nama', e.target.value)} required placeholder="TOWER SUTT 150kV KEMBANGAN #001" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-app-muted">Tipe</label>
              <select className="form-input" value={form.tipe} onChange={(e) => set('tipe', e.target.value)}>
                {TIPE_EDIT_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-app-muted">Tegangan</label>
              <input className="form-input" value={form.tegangan} onChange={(e) => set('tegangan', e.target.value)} placeholder="150kV" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-app-muted">Kondisi</label>
            <select className="form-input" value={form.kondisi} onChange={(e) => set('kondisi', e.target.value)}>
              {KONDISI_EDIT_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-app-muted">Latitude <span className="text-red-500">*</span></label>
              <input className="form-input" type="number" step="any" value={form.lat} onChange={(e) => set('lat', e.target.value)} required placeholder="-6.1234" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-app-muted">Longitude <span className="text-red-500">*</span></label>
              <input className="form-input" type="number" step="any" value={form.lng} onChange={(e) => set('lng', e.target.value)} required placeholder="106.7654" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-app-muted">Lokasi</label>
            <input className="form-input" value={form.lokasi} onChange={(e) => set('lokasi', e.target.value)} placeholder="Kel. Rawa Buaya, Cengkareng" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-app-muted">Radius Deteksi (m)</label>
            <input className="form-input" type="number" value={form.radius} onChange={(e) => set('radius', e.target.value)} placeholder="100" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-app-muted">Jalur Transmisi</label>
            <input className="form-input" value={form.jalur} onChange={(e) => set('jalur', e.target.value)} placeholder="KMBNG-DKSBI" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-app-muted">Nomor Urut dalam Jalur</label>
            <input className="form-input" type="number" value={form.nomorUrut} onChange={(e) => set('nomorUrut', e.target.value)} placeholder="1" />
          </div>
          <div style={{ display: 'flex', gap: 10, paddingTop: 8, marginTop: 4, borderTop: '1px solid #E1E8EC' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '10px 0', border: '1px solid #E1E8EC', borderRadius: 8, background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 13, color: '#5F737F' }}>
              Batal
            </button>
            <button type="submit" disabled={saving} style={{ flex: 2, padding: '10px 0', border: 'none', borderRadius: 8, background: '#076C9E', cursor: 'pointer', fontWeight: 600, fontSize: 13, color: '#fff', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Menyimpan...' : 'Tambah Tower'}
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

  // Detail drawer
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailRow, setDetailRow]   = useState<any>(null)

  // Add drawer
  const [addOpen, setAddOpen]     = useState(false)

  // Edit drawer
  const [editOpen, setEditOpen]   = useState(false)
  const [editRow, setEditRow]     = useState<any>(null)

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

  const COLS = isAdminUser ? 8 : 7

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-app-text">Data Aset Transmisi</h1>
        {isAdminUser && (
          <button onClick={() => setAddOpen(true)} className="btn-primary" style={{ fontSize: 12 }}>
            <Plus size={14} /> Tambah Tower
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card card-body mb-4 flex items-center gap-3 flex-wrap">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Cari ID atau nama" />
        <select value={tipe} onChange={(e) => { setTipe(e.target.value === 'Semua' ? '' : e.target.value); setPage(1) }} className="form-input w-auto pr-8" style={{ height: 40 }}>
          {TIPE_OPTIONS.map((t) => <option key={t} value={t === 'Semua' ? '' : t}>{t}</option>)}
        </select>
        <select value={kondisi} onChange={(e) => { setKondisi(e.target.value === 'Semua' ? '' : e.target.value); setPage(1) }} className="form-input w-auto pr-8" style={{ height: 40 }}>
          {KONDISI_OPTIONS.map((k) => <option key={k} value={k === 'Semua' ? '' : k}>{k}</option>)}
        </select>
      </div>

      {/* Unified Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-10">No</th>
                <th>ID</th>
                <th>Nama</th>
                <th>Tipe</th>
                <th>Tegangan (kV)</th>
                <th>Jalur</th>
                <th>Kondisi</th>
                <th>Lokasi</th>
                {isAdminUser && <th className="text-right pr-5">Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRow cols={COLS} rows={limit} />
              ) : rows.length === 0 ? (
                <tr><td colSpan={COLS}><EmptyState title="Belum ada data aset." /></td></tr>
              ) : (
                <>
                  {rows.map((row, i) => (
                    <tr key={`tower-${row.id}`}>
                      <td className="text-app-muted text-[12px]">{(page - 1) * limit + i + 1}</td>
                      <td><span className="font-mono text-[12px] text-blue-600 font-semibold">{row.id}</span></td>
                      <td className="font-semibold text-app-text">{row.nama ?? '—'}</td>
                      <td className="text-app-muted">{row.tipe ?? '—'}</td>
                      <td className="font-mono text-[12px]">{row.tegangan ?? '—'}</td>
                      <td className="text-app-muted text-[12px] max-w-[160px] truncate" title={row.jalur ?? ''}>{row.jalur ?? '—'}</td>
                      <td><StatusBadge status={row.kondisi ?? 'normal'} /></td>
                      <td className="text-app-muted text-[12px] font-mono whitespace-nowrap">
                        {row.lat && row.lng
                          ? `${Number(row.lat).toFixed(5)}, ${Number(row.lng).toFixed(5)}`
                          : row.lokasi ?? '—'}
                      </td>
                      {isAdminUser && (
                        <td className="text-right pr-4">
                          <ActionMenu items={[
                            { label: 'Lihat Detail', icon: <Eye size={14} />, onClick: () => { setDetailRow(row); setDetailOpen(true) } },
                            { label: 'Edit', icon: <Pencil size={14} />, onClick: () => { setEditRow(row); setEditOpen(true) } },
                          ]} />
                        </td>
                      )}
                    </tr>
                  ))}

                </>
              )}
            </tbody>
          </table>
        </div>
        <Pagination total={total} page={page} limit={limit} onChange={setPage} onLimitChange={setLimit} />
      </div>

      <AsetAddDrawer open={addOpen} onClose={() => setAddOpen(false)} onSaved={fetchData} />
      <AsetDetailDrawer towerId={detailRow?.id ?? null} open={detailOpen} onClose={() => setDetailOpen(false)} />
      <AsetEditDrawer tower={editRow} open={editOpen} onClose={() => setEditOpen(false)} onSaved={fetchData} />
    </>
  )
}
