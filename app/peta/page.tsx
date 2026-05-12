'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { SlidersHorizontal, X, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { towersApi, jalurKmlApi } from '@/lib/api'
import { isAdmin } from '@/lib/auth'
import B2WLoader from '@/components/ui/B2WLoader'
import type { JalurKmlItem } from '@/components/map/TowerMapGoogle'

const TowerMap = dynamic(() => import('@/components/map/TowerMapGoogle'), { ssr: false })

const TIPE_OPTIONS = ['Semua', 'SUTET', 'SUTT', 'SKTT', 'Gardu Induk']
const KONDISI_OPTIONS = ['Semua', 'normal', 'waspada', 'gangguan', 'maintenance']

const LEGEND = [
  { color: '#ef4444', label: 'Kritis' },
  { color: '#f59e0b', label: 'Sedang' },
  { color: '#22c55e', label: 'Aman' },
  { color: '#3b82f6', label: 'Normal' },
]

export default function PetaPage() {
  const [towers, setTowers] = useState<any[]>([])
  const [jalurKml, setJalurKml] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [adminUser, setAdminUser] = useState(false)
  const [importingSktt, setImportingSktt] = useState(false)
  const skttInputRef = useRef<HTMLInputElement>(null)

  // Filter state
  const [tipe, setTipe] = useState('Semua')
  const [kondisi, setKondisi] = useState('Semua')
  const [sheetOpen, setSheetOpen] = useState(false)

  // Pending filter for bottom sheet (apply on tap)
  const [pendingTipe, setPendingTipe] = useState('Semua')
  const [pendingKondisi, setPendingKondisi] = useState('Semua')

  useEffect(() => {
    setAdminUser(isAdmin())
    Promise.allSettled([
      towersApi.getMap().then((r) => setTowers(Array.isArray(r.data) ? r.data : [])),
      jalurKmlApi.getAll().then((r) => setJalurKml(r.data?.data ?? [])),
    ]).finally(() => setLoading(false))
  }, [])

  async function handleSkttImport(file: File) {
    setImportingSktt(true)
    try {
      const res = await jalurKmlApi.importSktt(file)
      toast.success(`Import SKTT selesai: ${res.data.data?.created ?? 0} rute baru`)
      jalurKmlApi.getAll().then((r) => setJalurKml(r.data?.data ?? []))
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Gagal import SKTT')
    } finally {
      setImportingSktt(false)
    }
  }

  // Generate SUTT/SUTET polylines from tower data (group by tipe+jalur, sort by nomorUrut)
  const computedJalurLines = useMemo<JalurKmlItem[]>(() => {
    const groups = new Map<string, { tipe: string; towers: any[] }>()
    for (const t of towers) {
      if (t.tipe !== 'SUTT' && t.tipe !== 'SUTET') continue
      if (!t.jalur) continue
      const key = `${t.tipe}::${t.jalur}`
      if (!groups.has(key)) groups.set(key, { tipe: t.tipe, towers: [] })
      groups.get(key)!.towers.push(t)
    }
    const result: JalurKmlItem[] = []
    let fakeId = -1
    for (const group of Array.from(groups.values())) {
      const sorted = [...group.towers].sort((a: any, b: any) => (a.nomorUrut ?? 0) - (b.nomorUrut ?? 0))
      const path = sorted.map((t: any) => ({ lat: t.lat, lng: t.lng }))
      if (path.length < 2) continue
      result.push({
        id: fakeId--,
        nama: group.towers[0].jalur,
        tipe: group.tipe,
        warna: group.tipe === 'SUTET' ? '#e65100' : '#0288D1',
        path,
      })
    }
    return result
  }, [towers])

  const allJalurKml = useMemo(() => [...computedJalurLines, ...jalurKml], [computedJalurLines, jalurKml])

  const filteredTowers = towers.filter((t) => {
    if (tipe !== 'Semua' && t.tipe !== tipe) return false
    if (kondisi !== 'Semua' && t.kondisi !== kondisi) return false
    return true
  })

  const activeFilterCount = (tipe !== 'Semua' ? 1 : 0) + (kondisi !== 'Semua' ? 1 : 0)

  function openSheet() {
    setPendingTipe(tipe)
    setPendingKondisi(kondisi)
    setSheetOpen(true)
  }

  function applyFilters() {
    setTipe(pendingTipe)
    setKondisi(pendingKondisi)
    setSheetOpen(false)
  }

  if (loading) return <B2WLoader label="Memuat peta..." />

  return (
    <>
      {/* ─── DESKTOP MAP ──────────────────────────────────────────── */}
      <div className="desktop-map-page p-6 flex flex-col h-full gap-4">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontWeight: 700, fontSize: 22, color: '#1c1c1c', lineHeight: '32px' }}>
              Peta Jalur Transmisi
            </h1>
            <p style={{ fontSize: 13, color: '#5f737f', marginTop: 2 }}>
              Sebaran tower transmisi PLN UIW Banten
            </p>
          </div>
          {adminUser && (
            <>
              <input ref={skttInputRef} type="file" accept=".xlsx,.xls" style={{ display: 'none' }}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleSkttImport(f); e.target.value = '' }}
              />
              <button
                onClick={() => skttInputRef.current?.click()}
                disabled={importingSktt}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 22, background: '#fff', border: '1px solid #076c9e', color: '#076c9e', fontWeight: 600, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                <Upload size={14} /> {importingSktt ? 'Mengimport...' : 'Import SKTT Excel'}
              </button>
            </>
          )}
        </div>

        {/* Desktop filters */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#5f737f' }}>Tipe:</label>
            <select
              value={tipe}
              onChange={(e) => setTipe(e.target.value)}
              style={{
                padding: '6px 10px', borderRadius: 8, border: '1px solid #E1E8EC',
                fontSize: 13, color: '#1c1c1c', background: '#fff', cursor: 'pointer',
              }}
            >
              {TIPE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#5f737f' }}>Kondisi:</label>
            <select
              value={kondisi}
              onChange={(e) => setKondisi(e.target.value)}
              style={{
                padding: '6px 10px', borderRadius: 8, border: '1px solid #E1E8EC',
                fontSize: 13, color: '#1c1c1c', background: '#fff', cursor: 'pointer',
              }}
            >
              {KONDISI_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <span style={{ fontSize: 12, color: '#97aab3', alignSelf: 'center' }}>
            {filteredTowers.length} tower ditampilkan
          </span>
        </div>

        <div style={{ display: 'flex', gap: 16, flex: 1, minHeight: 0 }}>
          {/* Map */}
          <div style={{
            flex: 1, background: '#fff', border: '1px solid #E1E8EC',
            borderRadius: 12, overflow: 'hidden', minHeight: 500,
          }}>
            <TowerMap towers={filteredTowers} jalurKml={allJalurKml} />
          </div>

          {/* Side panel — legend */}
          <div style={{ width: 220, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{
              background: '#fff', border: '1px solid #E1E8EC',
              borderRadius: 12, padding: '16px',
            }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#97aab3', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                Legenda
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {LEGEND.map((l) => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: l.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: '#1c1c1c' }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{
              background: '#fff', border: '1px solid #E1E8EC',
              borderRadius: 12, padding: '16px',
            }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#97aab3', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                Total Tower
              </p>
              <p style={{ fontSize: 32, fontWeight: 700, color: '#076c9e' }}>{filteredTowers.length}</p>
              <p style={{ fontSize: 12, color: '#97aab3' }}>dari {towers.length} tower</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MOBILE PWA MAP ───────────────────────────────────────── */}
      <div className="pwa-map-page">
        {/* Full screen map */}
        <div className="pwa-map-fullscreen">
          <TowerMap towers={filteredTowers} jalurKml={allJalurKml} />

          {/* Legend overlay */}
          <div className="pwa-map-legend">
            {LEGEND.map((l) => (
              <div key={l.label} className="pwa-map-legend-item">
                <div className="pwa-map-legend-dot" style={{ background: l.color }} />
                <span>{l.label}</span>
              </div>
            ))}
          </div>

          {/* Tower count overlay */}
          <div style={{
            position: 'absolute', top: 12, right: 12, zIndex: 500,
            background: 'rgba(255,255,255,0.95)', borderRadius: 10,
            padding: '6px 12px', boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#076c9e' }}>
              {filteredTowers.length}
            </span>
            <span style={{ fontSize: 11, color: '#97aab3' }}> tower</span>
          </div>
        </div>

        {/* Filter FAB */}
        <button className="pwa-map-fab" onClick={openSheet} aria-label="Buka filter">
          <SlidersHorizontal size={22} />
          {activeFilterCount > 0 && (
            <span className="pwa-map-fab-badge">{activeFilterCount}</span>
          )}
        </button>

        {/* Backdrop */}
        <div
          className={`pwa-filter-sheet-backdrop ${sheetOpen ? 'open' : ''}`}
          onClick={() => setSheetOpen(false)}
        />

        {/* Bottom sheet */}
        <div className={`pwa-filter-sheet ${sheetOpen ? 'open' : ''}`}>
          <div className="pwa-filter-sheet-handle" />
          <div className="pwa-filter-sheet-header">
            <span className="pwa-filter-sheet-title">Filter Peta</span>
            <button className="pwa-filter-sheet-close" onClick={() => setSheetOpen(false)}>
              <X size={16} />
            </button>
          </div>

          {/* Tipe filter */}
          <div className="pwa-filter-section">
            <p className="pwa-filter-section-label">Tipe Tower</p>
            <div className="pwa-filter-chips">
              {TIPE_OPTIONS.map((o) => (
                <button
                  key={o}
                  className={`pwa-filter-chip ${pendingTipe === o ? 'active' : ''}`}
                  onClick={() => setPendingTipe(o)}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          {/* Kondisi filter */}
          <div className="pwa-filter-section">
            <p className="pwa-filter-section-label">Kondisi</p>
            <div className="pwa-filter-chips">
              {KONDISI_OPTIONS.map((o) => (
                <button
                  key={o}
                  className={`pwa-filter-chip ${pendingKondisi === o ? 'active' : ''}`}
                  onClick={() => setPendingKondisi(o)}
                >
                  {o === 'Semua' ? 'Semua' : o.charAt(0).toUpperCase() + o.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <button className="pwa-filter-apply" onClick={applyFilters}>
            Terapkan Filter
          </button>
        </div>
      </div>
    </>
  )
}
