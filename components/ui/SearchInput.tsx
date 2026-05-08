'use client'

import { Search } from 'lucide-react'

interface Props {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  width?: number
}

export function SearchInput({ value, onChange, placeholder = 'Cari...', width = 300 }: Props) {
  return (
    <div className="relative" style={{ width }}>
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="form-input pl-9"
        style={{ height: 40 }}
      />
    </div>
  )
}
