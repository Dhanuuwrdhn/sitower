'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FileUp, Eye, Pencil } from 'lucide-react'
import { towersApi, importApi } from '@/lib/api'
import { isAdmin } from '@/lib/auth'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ActionMenu } from '@/components/ui/ActionMenu'
import { Pagination } from '@/components/ui/Pagination'
import { SearchInput } from '@/components/ui/SearchInput'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonRow } from '@/components/ui/SkeletonRow'

const TIPE_OPTIONS = ['Semua', 'SUTET', 'SUTT', 'SKTT', 'Gardu Induk']
const KONDISI_OPTIONS = ['Semua', 'normal', 'waspada', 'gangguan', 'maintenance']

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

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-app-text">Data Aset Transmisi</h1>
        {isAdminUser && (
          <>
            <button
              onClick={() => importRef.current?.click()}
              disabled={importing}
              className="btn-outline"
            >
              <FileUp size={15} />
              {importing ? 'Mengimpor...' : 'Import Excel'}
            </button>
            <input ref={importRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleImport} />
          </>
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
                <th>Kondisi</th>
                <th>Lokasi</th>
                <th className="text-right pr-5">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRow cols={8} rows={limit} />
              ) : rows.length === 0 ? (
                <tr><td colSpan={8}><EmptyState /></td></tr>
              ) : (
                rows.map((row, i) => (
                  <tr key={row.id}>
                    <td className="text-app-muted text-[12px]">{(page - 1) * limit + i + 1}</td>
                    <td>
                      <span className="font-mono text-[12px] text-blue-600 font-semibold">
                        {row.nomorTower ?? row.id}
                      </span>
                    </td>
                    <td className="font-semibold text-app-text">{row.namaTower ?? '—'}</td>
                    <td className="text-app-muted">{row.tipe ?? '—'}</td>
                    <td className="font-mono text-[12px]">{row.tegangan ?? '—'}</td>
                    <td><StatusBadge status={row.kondisi ?? 'normal'} /></td>
                    <td className="text-app-muted text-[12px] max-w-[200px] truncate">{row.lokasi ?? '—'}</td>
                    <td className="text-right pr-4">
                      <ActionMenu items={[
                        { label: 'Lihat Detail', icon: <Eye size={14} />, onClick: () => toast(`Detail: ${row.nomorTower}`, { icon: '👁' }) },
                        ...(isAdminUser ? [{ label: 'Edit', icon: <Pencil size={14} />, onClick: () => toast('Edit: ' + row.id) }] : []),
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
    </>
  )
}
