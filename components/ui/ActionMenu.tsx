'use client'

import { useEffect, useRef, useState } from 'react'
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
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1.5 rounded-lg hover:bg-app-bg transition-colors text-app-muted"
      >
        <MoreHorizontal size={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-50 bg-white border border-app-border rounded-xl shadow-dropdown w-48 py-1">
          {items.map((item, i) => (
            <div key={i}>
              {item.dividerBefore && <div className="border-t border-app-border my-1" />}
              <button
                onClick={() => { item.onClick(); setOpen(false) }}
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
