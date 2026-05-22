'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react'

const MONTHS_FULL = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']
const DAYS = ['M','S','S','R','K','J','S']  // Min Sen Sel Rab Kam Jum Sab

const PRIMARY = '#076c9e'

function toIso(y: number, m: number, d: number) {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function parse(iso: string | undefined): { y: number; m: number; d: number } | null {
  if (!iso) return null
  const dt = new Date(iso.length > 10 ? iso : `${iso}T00:00:00`)
  if (isNaN(dt.getTime())) return null
  return { y: dt.getFullYear(), m: dt.getMonth() + 1, d: dt.getDate() }
}

function parseTime(iso: string | undefined): { h: number; mi: number } {
  if (!iso || iso.length < 13) return { h: 0, mi: 0 }
  const dt = new Date(iso)
  if (isNaN(dt.getTime())) return { h: 0, mi: 0 }
  return { h: dt.getHours(), mi: dt.getMinutes() }
}

function fmtDisplay(iso: string | undefined, withTime: boolean) {
  const p = parse(iso)
  if (!p) return ''
  const datePart = `${String(p.d).padStart(2, '0')}/${String(p.m).padStart(2, '0')}/${p.y}`
  if (!withTime) return datePart
  const t = parseTime(iso)
  return `${datePart} ${String(t.h).padStart(2, '0')}:${String(t.mi).padStart(2, '0')}`
}

export interface DatePickerProps {
  value: string          // ISO date or empty
  onChange: (iso: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  /** Min/max ISO dates (YYYY-MM-DD). Inclusive. */
  min?: string
  max?: string
  /** When true, also pick hour + minute. Value becomes ISO with time. */
  withTime?: boolean
}

export function DatePicker({
  value, onChange, placeholder = 'Pilih tanggal', className = '', disabled = false, min, max, withTime = false,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<'days' | 'months' | 'years'>('days')
  const wrapRef = useRef<HTMLDivElement>(null)
  const today = new Date()

  const [hour, setHour]     = useState(parseTime(value).h)
  const [minute, setMinute] = useState(parseTime(value).mi)

  useEffect(() => {
    if (!withTime) return
    const t = parseTime(value)
    setHour(t.h); setMinute(t.mi)
  }, [value, withTime])

  // displayed month/year while navigating
  const initial = useMemo(() => parse(value) ?? { y: today.getFullYear(), m: today.getMonth() + 1, d: today.getDate() }, [value, today.getFullYear(), today.getMonth(), today.getDate()])
  const [dispY, setDispY] = useState(initial.y)
  const [dispM, setDispM] = useState(initial.m)

  useEffect(() => {
    if (open) {
      const p = parse(value)
      if (p) { setDispY(p.y); setDispM(p.m) }
      setView('days')
    }
  }, [open, value])

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // build 6×7 grid
  const cells = useMemo(() => {
    const firstDay = new Date(dispY, dispM - 1, 1).getDay()
    const daysInMonth = new Date(dispY, dispM, 0).getDate()
    const daysInPrev = new Date(dispY, dispM - 1, 0).getDate()
    const out: { d: number; m: number; y: number; cur: boolean }[] = []
    for (let i = firstDay - 1; i >= 0; i--) {
      const m = dispM === 1 ? 12 : dispM - 1
      const y = dispM === 1 ? dispY - 1 : dispY
      out.push({ d: daysInPrev - i, m, y, cur: false })
    }
    for (let d = 1; d <= daysInMonth; d++) out.push({ d, m: dispM, y: dispY, cur: true })
    while (out.length < 42) {
      const idx = out.length
      const baseIdx = idx - firstDay - daysInMonth + 1
      const m = dispM === 12 ? 1 : dispM + 1
      const y = dispM === 12 ? dispY + 1 : dispY
      out.push({ d: baseIdx, m, y, cur: false })
    }
    return out
  }, [dispY, dispM])

  // Normalize to YYYY-MM-DD so day-cell highlight works even when `value`
  // is a full ISO string (e.g. from withTime mode or pre-existing records).
  const selectedIso = (value || '').slice(0, 10)
  const todayIso = toIso(today.getFullYear(), today.getMonth() + 1, today.getDate())

  function inRange(iso: string) {
    if (min && iso < min) return false
    if (max && iso > max) return false
    return true
  }

  function emit(d: number, m: number, y: number, h: number, mi: number) {
    if (withTime) {
      const dt = new Date(y, m - 1, d, h, mi, 0, 0)
      onChange(dt.toISOString())
    } else {
      onChange(toIso(y, m, d))
    }
  }

  function pick(d: number, m: number, y: number) {
    const iso = toIso(y, m, d)
    if (!inRange(iso)) return
    if (withTime) {
      emit(d, m, y, hour, minute)
      // keep popover open for time tweak
    } else {
      onChange(iso)
      setOpen(false)
    }
  }

  function changeTime(h: number, mi: number) {
    const clampedH = Math.max(0, Math.min(23, h))
    const clampedM = Math.max(0, Math.min(59, mi))
    setHour(clampedH); setMinute(clampedM)
    const p = parse(value)
    if (p) emit(p.d, p.m, p.y, clampedH, clampedM)
    else emit(today.getDate(), today.getMonth() + 1, today.getFullYear(), clampedH, clampedM)
  }

  function prev() {
    if (dispM === 1) { setDispM(12); setDispY(y => y - 1) }
    else setDispM(m => m - 1)
  }
  function next() {
    if (dispM === 12) { setDispM(1); setDispY(y => y + 1) }
    else setDispM(m => m + 1)
  }

  // Years grid (decade view)
  const yearStart = Math.floor(dispY / 12) * 12
  const years = Array.from({ length: 12 }, (_, i) => yearStart + i)

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setOpen(o => !o)}
        disabled={disabled}
        className={`w-full h-[42px] px-3 flex items-center gap-2 border border-[#E1E8EC] rounded-lg bg-white text-left transition-all hover:border-[#076C9E] disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <CalendarIcon size={16} className="text-[#5F737F] shrink-0" />
        <span className={`text-[14px] flex-1 truncate ${value ? 'text-[#1C1C1C] font-medium' : 'text-[#97AAB3]'}`}>
          {value ? fmtDisplay(value, withTime) : placeholder}
        </span>
        {value && !disabled && (
          <span
            role="button"
            onClick={(e) => { e.stopPropagation(); onChange('') }}
            className="p-0.5 rounded hover:bg-app-bg text-[#97AAB3]"
            aria-label="Hapus tanggal"
          >
            <X size={14} />
          </span>
        )}
        <ChevronDown size={14} className={`text-[#5F737F] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-[300px] bg-white border border-[#E1E8EC] rounded-xl shadow-[0_8px_24px_rgba(28,28,28,0.12)] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#F0F4F7]">
            <button
              type="button"
              onClick={() => setView(v => v === 'days' ? 'months' : v === 'months' ? 'years' : 'days')}
              className="flex items-center gap-1 font-bold text-[14px] text-[#1C1C1C] hover:text-[#076c9e] transition-colors"
            >
              {view === 'days'   && <>{MONTHS_FULL[dispM - 1]} {dispY}</>}
              {view === 'months' && <>{dispY}</>}
              {view === 'years'  && <>{yearStart} – {yearStart + 11}</>}
              <ChevronDown size={13} className="text-[#076c9e]" />
            </button>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => view === 'days' ? prev() : view === 'months' ? setDispY(y => y - 1) : setDispY(y => y - 12)}
                className="w-7 h-7 rounded-lg hover:bg-[#F6F9FC] flex items-center justify-center text-[#5F737F]"
                aria-label="Sebelumnya"
              ><ChevronLeft size={16} /></button>
              <button
                type="button"
                onClick={() => view === 'days' ? next() : view === 'months' ? setDispY(y => y + 1) : setDispY(y => y + 12)}
                className="w-7 h-7 rounded-lg hover:bg-[#F6F9FC] flex items-center justify-center text-[#5F737F]"
                aria-label="Berikutnya"
              ><ChevronRight size={16} /></button>
            </div>
          </div>

          {/* Days view */}
          {view === 'days' && (
            <div className="p-3">
              <div className="grid grid-cols-7 mb-1">
                {DAYS.map((d, i) => (
                  <div key={i} className="text-center text-[10px] font-bold text-[#97AAB3] py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-1">
                {cells.map((c, i) => {
                  const iso = toIso(c.y, c.m, c.d)
                  const isSel = iso === selectedIso
                  const isToday = iso === todayIso
                  const blocked = !inRange(iso)
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={blocked}
                      onClick={() => pick(c.d, c.m, c.y)}
                      className={`mx-auto w-9 h-9 rounded-lg text-[12px] font-medium transition-all flex items-center justify-center
                        ${isSel
                          ? 'bg-[#076c9e] text-white font-bold shadow-sm'
                          : blocked
                            ? 'text-[#D8DEE3] cursor-not-allowed'
                            : c.cur
                              ? `text-[#1C1C1C] hover:bg-[#F0F9FF] ${isToday ? 'text-[#076c9e] font-bold ring-1 ring-[#076c9e]' : ''}`
                              : 'text-[#C4CDD5] hover:bg-[#F6F9FC]'
                        }`}
                    >
                      {c.d}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Months view */}
          {view === 'months' && (
            <div className="p-3 grid grid-cols-3 gap-2">
              {MONTHS_SHORT.map((name, idx) => {
                const m = idx + 1
                const isActive = dispM === m && parse(selectedIso)?.y === dispY && parse(selectedIso)?.m === m
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => { setDispM(m); setView('days') }}
                    className={`h-10 rounded-lg text-[13px] font-semibold transition-all ${
                      isActive
                        ? 'bg-[#076c9e] text-white'
                        : dispM === m
                          ? 'bg-[#F0F9FF] text-[#076c9e]'
                          : 'text-[#5F737F] hover:bg-[#F6F9FC]'
                    }`}
                  >
                    {name}
                  </button>
                )
              })}
            </div>
          )}

          {/* Years view */}
          {view === 'years' && (
            <div className="p-3 grid grid-cols-3 gap-2">
              {years.map((y) => {
                const isActive = parse(selectedIso)?.y === y
                return (
                  <button
                    key={y}
                    type="button"
                    onClick={() => { setDispY(y); setView('months') }}
                    className={`h-10 rounded-lg text-[13px] font-semibold transition-all ${
                      isActive
                        ? 'bg-[#076c9e] text-white'
                        : dispY === y
                          ? 'bg-[#F0F9FF] text-[#076c9e]'
                          : 'text-[#5F737F] hover:bg-[#F6F9FC]'
                    }`}
                  >
                    {y}
                  </button>
                )
              })}
            </div>
          )}

          {/* Time row (only when withTime) */}
          {withTime && (
            <div className="flex items-center justify-between gap-3 px-3 py-2 border-t border-[#F0F4F7]">
              <span className="text-[12px] font-semibold text-[#5F737F]">Jam</span>
              <div className="flex items-center gap-1">
                <input
                  type="number" min={0} max={23}
                  value={String(hour).padStart(2, '0')}
                  onChange={(e) => changeTime(Number(e.target.value || 0), minute)}
                  className="w-12 h-9 text-center border border-[#E1E8EC] rounded-lg text-[14px] font-semibold text-[#1C1C1C] outline-none focus:border-[#076c9e]"
                />
                <span className="text-[#5F737F] font-bold">:</span>
                <input
                  type="number" min={0} max={59}
                  value={String(minute).padStart(2, '0')}
                  onChange={(e) => changeTime(hour, Number(e.target.value || 0))}
                  className="w-12 h-9 text-center border border-[#E1E8EC] rounded-lg text-[14px] font-semibold text-[#1C1C1C] outline-none focus:border-[#076c9e]"
                />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-[#F0F4F7] bg-[#FAFBFC]">
            <button
              type="button"
              onClick={() => { onChange(''); setOpen(false) }}
              className="text-[12px] font-semibold text-[#D92D20] hover:underline"
            >
              Clear
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (withTime) {
                    const n = new Date()
                    emit(n.getDate(), n.getMonth() + 1, n.getFullYear(), n.getHours(), n.getMinutes())
                    setHour(n.getHours()); setMinute(n.getMinutes())
                  } else {
                    const iso = todayIso
                    if (inRange(iso)) { onChange(iso) }
                  }
                }}
                className="text-[12px] font-semibold text-[#076c9e] hover:underline"
                style={{ color: PRIMARY }}
              >
                Sekarang
              </button>
              {withTime && (
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-[12px] font-semibold text-white bg-[#076c9e] px-3 py-1.5 rounded-md hover:opacity-90"
                >
                  Simpan
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
