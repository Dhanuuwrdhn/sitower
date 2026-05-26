'use client'

import { useEffect, useState } from 'react'
import { Moon } from 'lucide-react'

const STAGING_HOST = 'staging.spektra.biz.id'
const WINDOW_START_HOUR = 2  // 02:00 WIB inclusive
const WINDOW_END_HOUR = 5    // 05:00 WIB exclusive

function wibParts(now: Date) {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  const parts = Object.fromEntries(fmt.formatToParts(now).map((p) => [p.type, p.value]))
  return {
    h: parseInt(parts.hour ?? '0', 10),
    m: parseInt(parts.minute ?? '0', 10),
    s: parseInt(parts.second ?? '0', 10),
  }
}

function inMaintenanceWindow(now: Date) {
  const { h } = wibParts(now)
  return h >= WINDOW_START_HOUR && h < WINDOW_END_HOUR
}

function secondsUntilResume(now: Date) {
  const { h, m, s } = wibParts(now)
  return (WINDOW_END_HOUR - 1 - h) * 3600 + (59 - m) * 60 + (60 - s)
}

function fmtHMS(total: number) {
  if (total < 0) total = 0
  const hh = Math.floor(total / 3600).toString().padStart(2, '0')
  const mm = Math.floor((total % 3600) / 60).toString().padStart(2, '0')
  const ss = (total % 60).toString().padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

export default function MaintenanceOverlay() {
  const [active, setActive] = useState(false)
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.location.hostname !== STAGING_HOST) return

    const tick = () => {
      const now = new Date()
      const on = inMaintenanceWindow(now)
      setActive(on)
      if (on) setRemaining(secondsUntilResume(now))
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  if (!active) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="maintenance-title"
    >
      <div className="mx-4 max-w-md rounded-2xl bg-white px-7 py-8 shadow-2xl">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50">
          <Moon size={28} className="text-indigo-600" />
        </div>
        <h1 id="maintenance-title" className="mb-2 text-xl font-bold text-slate-900">
          Server sedang maintenance
        </h1>
        <p className="mb-5 text-sm leading-relaxed text-slate-600">
          API staging dimatikan otomatis untuk jendela maintenance harian
          <span className="font-semibold text-slate-800"> 02:00 – 05:00 WIB</span>.
          Layanan akan kembali otomatis jam 05:00 WIB.
        </p>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Sisa waktu maintenance
          </p>
          <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-slate-900">
            {fmtHMS(remaining)}
          </p>
        </div>
      </div>
    </div>
  )
}
