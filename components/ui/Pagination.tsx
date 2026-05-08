'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

const PAGE_SIZES = [10, 25, 50, 100]

interface Props {
  total: number
  page: number
  limit: number
  onChange: (page: number) => void
  onLimitChange: (limit: number) => void
}

export function Pagination({ total, page, limit, onChange, onLimitChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const from = total === 0 ? 0 : (page - 1) * limit + 1
  const to   = Math.min(page * limit, total)

  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-t border-app-border bg-white">
      <select
        value={limit}
        onChange={(e) => { onLimitChange(Number(e.target.value)); onChange(1) }}
        className="form-input w-auto pr-8 py-1.5 text-[12px]"
      >
        {PAGE_SIZES.map((n) => (
          <option key={n} value={n}>{n} baris per halaman</option>
        ))}
      </select>

      <p className="text-[12px] text-app-muted">
        {total === 0 ? 'Tidak ada data' : `Menampilkan ${from}–${to} dari ${total} data`}
      </p>

      <div className="flex items-center gap-2">
        <select
          value={page}
          onChange={(e) => onChange(Number(e.target.value))}
          className="form-input w-auto pr-8 py-1.5 text-[12px]"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <option key={p} value={p}>{p} dari {totalPages} halaman</option>
          ))}
        </select>
        <button
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="p-1.5 rounded-lg border border-app-border hover:bg-app-bg disabled:opacity-40 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="p-1.5 rounded-lg border border-app-border hover:bg-app-bg disabled:opacity-40 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
