'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { MoreHorizontal } from 'lucide-react'

export interface MenuItem {
  label: string
  icon: React.ReactNode
  onClick: () => void
  danger?: boolean
  dividerBefore?: boolean
}

export function ActionMenu({ items }: { items: MenuItem[] }) {
  const [open, setOpen] = useState(false)
  const btnRef  = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        btnRef.current  && !btnRef.current.contains(e.target as Node)
      ) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  function handleOpen(e: React.MouseEvent) {
    e.stopPropagation()
    setOpen((v) => !v)
  }

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={handleOpen}
        className="p-1.5 rounded-lg hover:bg-app-bg transition-colors text-app-muted"
      >
        <MoreHorizontal size={16} />
      </button>

      {open && (
        <div
          ref={menuRef}
          className="absolute z-[100] top-full right-0 mt-2 bg-white border border-app-border rounded-xl shadow-dropdown w-48 py-1 animate-in fade-in zoom-in duration-200 origin-top-right"
        >
          {items.map((item, i) => (
            <div key={i}>
              {item.dividerBefore && <div className="border-t border-app-border my-1" />}
              <button
                onClick={(e) => { e.stopPropagation(); item.onClick(); setOpen(false) }}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] transition-colors ${
                  item.danger
                    ? 'text-red-500 hover:bg-red-50'
                    : 'text-app-text hover:bg-app-bg'
                }`}
              >
                <span className={item.danger ? 'text-red-400' : 'text-app-muted'}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
