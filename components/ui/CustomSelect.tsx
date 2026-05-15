'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown } from 'lucide-react'

interface CustomSelectProps {
  label?: string
  value: string
  onChange: (value: string) => void
  options: string[] | { value: string; label: string }[]
  placeholder?: string
  required?: boolean
  className?: string
}

export function CustomSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  className = '',
}: CustomSelectProps) {
  const [open, setOpen]   = useState(false)
  const [pos, setPos]     = useState({ top: 0, left: 0, width: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (
        menuRef.current   && !menuRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  function handleOpen() {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPos({ top: rect.bottom + 4, left: rect.left, width: rect.width })
    }
    setOpen((v) => !v)
  }

  const normalized = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  )
  const selected = normalized.find((o) => o.value === value)

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-[12px] font-bold text-gray-700">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className={`form-input rounded-xl bg-white text-left flex items-center justify-between gap-2 cursor-pointer transition-all duration-150 ${
          open
            ? 'border-blue-500 ring-1 ring-blue-500/30'
            : 'border-gray-100 hover:border-gray-300'
        }`}
      >
        <span className={`text-[13px] truncate ${selected ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
          {selected?.label ?? placeholder ?? 'Pilih…'}
        </span>
        <ChevronDown
          size={15}
          className={`text-gray-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180 text-blue-500' : ''}`}
        />
      </button>

      {/* Dropdown — portal so overflow:hidden parents can't clip it */}
      {open && typeof document !== 'undefined' && createPortal(
        <div
          ref={menuRef}
          style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}
          className="bg-white border border-gray-100 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150"
        >
          {normalized.map((opt) => {
            const isSelected = opt.value === value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false) }}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 text-[13px] transition-colors text-left border-b border-gray-50 last:border-0 ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50 font-medium'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <Check size={14} className="text-blue-600 shrink-0" />
                )}
              </button>
            )
          })}
        </div>,
        document.body,
      )}
    </div>
  )
}
