'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'

export type SearchableOption = { value: string; label: string; sub?: string }

export function SearchableSelect({
  label,
  placeholder,
  options,
  values,
  onChange,
  onClear,
}: {
  label: string
  placeholder: string
  options: SearchableOption[]
  values: string[]
  onChange: (vals: string[]) => void
  onClear: () => void
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase()) ||
    (o.sub ?? '').toLowerCase().includes(search.toLowerCase())
  )

  const toggle = (v: string) => {
    if (values.includes(v)) onChange(values.filter(x => x !== v))
    else onChange([...values, v])
  }

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      <div className="flex items-center justify-between">
        <span className="font-bold text-[14px] text-[#1C1C1C]">
          {label.endsWith(' *') ? (
            <>{label.slice(0, -2)} <span className="text-red-500">*</span></>
          ) : label}
        </span>
        {values.length > 0 && (
          <button type="button" onClick={(e) => { e.stopPropagation(); onClear() }} className="text-[11px] text-[#D92D20] font-semibold hover:underline">
            Reset
          </button>
        )}
      </div>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full min-h-[44px] px-3 py-2 border border-[#E1E8EC] rounded-lg bg-white flex flex-wrap items-center gap-1.5 text-left transition-all hover:border-[#076C9E]"
        >
          {values.length === 0 ? (
            <span className="text-[#97AAB3] text-[14px]">{placeholder}</span>
          ) : (
            values.map(v => {
              const opt = options.find(o => o.value === v)
              return (
                <span key={v} className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F0F9FF] text-[#076C9E] border border-[#B9E6FE] rounded text-[12px] font-medium">
                  {opt?.label ?? v}
                  <X size={12} className="cursor-pointer" onClick={(e) => { e.stopPropagation(); toggle(v) }} />
                </span>
              )
            })
          )}
          <div className="ml-auto flex items-center gap-1">
            <ChevronDown size={14} className={`text-[#5F737F] transition-transform ${open ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {open && (
          <div className="absolute z-20 mt-1 w-full bg-white border border-[#E1E8EC] rounded-xl shadow-sm overflow-hidden flex flex-col max-h-[280px]">
            <div className="p-2 border-b border-[#E1E8EC]">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F6F9FC] rounded-lg border border-[#E1E8EC]">
                <Search size={14} className="text-[#5F737F]" />
                <input
                  autoFocus
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cari..."
                  className="bg-transparent border-none outline-none text-[13px] text-[#1C1C1C] w-full"
                />
              </div>
            </div>
            <div className="overflow-y-auto flex-1 py-1">
              {filtered.map(opt => {
                const active = values.includes(opt.value)
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggle(opt.value)}
                    className={`w-full text-left px-4 py-2.5 flex flex-col transition-colors ${active ? 'bg-[#F0F9FF]' : 'hover:bg-[#F6F9FC]'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[13px] font-medium ${active ? 'text-[#076C9E]' : 'text-[#1C1C1C]'}`}>{opt.label ?? opt.value}</span>
                      {active && <div className="w-4 h-4 rounded-full bg-[#076C9E] flex items-center justify-center"><X size={10} color="#fff" /></div>}
                    </div>
                    {opt.sub && <span className="text-[11px] text-[#5F737F] leading-tight mt-0.5">{opt.sub}</span>}
                  </button>
                )
              })}
              {filtered.length === 0 && <p className="text-center py-4 text-[13px] text-[#97AAB3]">Tidak ditemukan</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
