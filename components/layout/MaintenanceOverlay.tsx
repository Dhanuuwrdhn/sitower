'use client'

import { useEffect, useState } from 'react'
import { Moon, ServerCrash } from 'lucide-react'

const STAGING_HOST = 'staging.spektra.biz.id'
const WINDOW_START_HOUR = 2  // 02:00 WIB inclusive
const WINDOW_END_HOUR = 5    // 05:00 WIB exclusive
const API_PROBE_INTERVAL_MS = 15_000
const API_PROBE_TIMEOUT_MS = 5_000
const API_FAIL_THRESHOLD = 2  // consecutive failures before declaring API down

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

async function probeApi(): Promise<boolean> {
  const base = (process.env.NEXT_PUBLIC_API_URL ?? '/api').replace(/\/$/, '')
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), API_PROBE_TIMEOUT_MS)
  try {
    const res = await fetch(base, { method: 'GET', signal: controller.signal, cache: 'no-store' })
    return res.status < 500
  } catch {
    return false
  } finally {
    clearTimeout(timer)
  }
}

export default function MaintenanceOverlay() {
  const [inWindow, setInWindow] = useState(false)
  const [apiDown, setApiDown] = useState(false)
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.location.hostname !== STAGING_HOST) return

    const tickTime = () => {
      const now = new Date()
      const on = inMaintenanceWindow(now)
      setInWindow(on)
      if (on) setRemaining(secondsUntilResume(now))
    }
    tickTime()
    const timeId = window.setInterval(tickTime, 1000)

    let failStreak = 0
    let cancelled = false
    const tickApi = async () => {
      const alive = await probeApi()
      if (cancelled) return
      if (alive) {
        failStreak = 0
        setApiDown(false)
      } else {
        failStreak += 1
        if (failStreak >= API_FAIL_THRESHOLD) setApiDown(true)
      }
    }
    tickApi()
    const apiId = window.setInterval(tickApi, API_PROBE_INTERVAL_MS)

    return () => {
      cancelled = true
      window.clearInterval(timeId)
      window.clearInterval(apiId)
    }
  }, [])

  if (!inWindow && !apiDown) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="maintenance-title"
    >
      <div className="mx-4 max-w-md rounded-2xl bg-white px-7 py-8 shadow-2xl">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50">
          {inWindow ? (
            <Moon size={28} className="text-indigo-600" />
          ) : (
            <ServerCrash size={28} className="text-indigo-600" />
          )}
        </div>
        <h1 id="maintenance-title" className="mb-2 text-xl font-bold text-slate-900">
          {inWindow ? 'Scheduled maintenance' : 'Staging API offline'}
        </h1>
        <p className="mb-5 text-sm leading-relaxed text-slate-600">
          {inWindow ? (
            <>
              The staging API is paused for the daily maintenance window{' '}
              <span className="font-semibold text-slate-800">02:00 – 05:00 WIB</span>.
              Service will resume automatically at 05:00 WIB.
            </>
          ) : (
            <>
              Staging API is currently unreachable. This is usually a manual pause
              outside the scheduled window. Please wait a moment, or contact the
              dev team if it persists.
            </>
          )}
        </p>
        {inWindow ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Time until resume
            </p>
            <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-slate-900">
              {fmtHMS(remaining)}
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-[12px] text-amber-900">
              This page will refresh automatically once the API responds again.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
