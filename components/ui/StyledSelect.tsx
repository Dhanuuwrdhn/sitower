'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Check } from 'lucide-react'

export type StyledSelectOption = { value: string; label: string }

type PanelPos = { left: number; width: number; top?: number; bottom?: number; maxH: number }

/**
 * Portal-based single-select dropdown styled to match the app (replaces the
 * native <select> on desktop). The panel is rendered to document.body with
 * fixed positioning so it never gets clipped by overflow containers, and flips
 * upward when there isn't enough room below.
 */
export function StyledSelect({
  value,
  onChange,
  options,
  placeholder = 'Pilih...',
  disabled = false,
  className = '',
}: {
  value: string
  onChange: (v: string) => void
  options: StyledSelectOption[]
  placeholder?: string
  disabled?: boolean
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [pos, setPos] = useState<PanelPos | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  const updatePos = () => {
    const r = triggerRef.current?.getBoundingClientRect()
    if (!r) return
    const spaceBelow = window.innerHeight - r.bottom
    const spaceAbove = r.top
    const desired = 280
    const openUp = spaceBelow < desired && spaceAbove > spaceBelow
    const maxH = Math.max(160, Math.min(desired, (openUp ? spaceAbove : spaceBelow) - 12))
    setPos({
      left: r.left,
      width: r.width,
      top: openUp ? undefined : r.bottom + 4,
      bottom: openUp ? window.innerHeight - r.top + 4 : undefined,
      maxH,
    })
  }

  useEffect(() => {
    function handle(e: MouseEvent) {
      const t = e.target as Node
      if (triggerRef.current?.contains(t)) return
      if (panelRef.current?.contains(t)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  useLayoutEffect(() => {
    if (!open) return
    updatePos()
    const onMove = () => updatePos()
    window.addEventListener('resize', onMove)
    window.addEventListener('scroll', onMove, true)
    return () => {
      window.removeEventListener('resize', onMove)
      window.removeEventListener('scroll', onMove, true)
    }
  }, [open])

  const selected = options.find(o => o.value === value)

  const panel = open && pos && (
    <div
      ref={panelRef}
      style={{
        position: 'fixed',
        left: pos.left,
        width: pos.width,
        top: pos.top,
        bottom: pos.bottom,
        maxHeight: pos.maxH,
        zIndex: 60,
      }}
      className="bg-white border border-[#E1E8EC] rounded-xl shadow-lg overflow-y-auto py-1"
    >
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => { onChange(o.value); setOpen(false) }}
            className={`w-full text-left px-4 py-2.5 flex items-center justify-between transition-colors ${active ? 'bg-[#F0F9FF]' : 'hover:bg-[#F6F9FC]'}`}
          >
            <span className={`text-[13px] font-medium ${active ? 'text-[#076C9E]' : 'text-[#1C1C1C]'}`}>{o.label}</span>
            {active && <Check size={15} className="text-[#076C9E] shrink-0" />}
          </button>
        )
      })}
    </div>
  )

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => { if (!disabled) { setOpen(v => !v); requestAnimationFrame(updatePos) } }}
        className={`w-full min-h-[44px] px-3 py-2 border border-[#E1E8EC] rounded-lg bg-white flex items-center justify-between gap-2 text-left transition-all hover:border-[#076C9E] disabled:bg-app-bg disabled:text-app-muted disabled:cursor-not-allowed ${className}`}
      >
        <span className={`text-[14px] font-medium truncate ${selected ? 'text-[#1C1C1C]' : 'text-[#97AAB3]'}`}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown size={16} className={`text-[#5F737F] shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {mounted && panel && createPortal(panel, document.body)}
    </>
  )
}
