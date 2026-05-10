'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronDown, X, ArrowLeft } from 'lucide-react'

const MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const DAYS = ['Min','Sen','Sel','Rab','Kam','Jum','Sab']
const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: CURRENT_YEAR - 1999 }, (_, i) => 2000 + i)

interface Props {
  open: boolean
  value: string // YYYY-MM-DD
  onConfirm: (date: string) => void
  onClose: () => void
}

export default function CalendarPickerSheet({ open, value, onConfirm, onClose }: Props) {
  const [viewMode, setViewMode] = useState<'calendar' | 'year' | 'month'>('calendar')
  const [displayYear, setDisplayYear] = useState(CURRENT_YEAR)
  const [displayMonth, setDisplayMonth] = useState(new Date().getMonth() + 1)
  const [selected, setSelected] = useState('')

  useEffect(() => {
    if (!open) return
    const d = value ? new Date(value + 'T00:00:00') : new Date()
    setDisplayYear(d.getFullYear())
    setDisplayMonth(d.getMonth() + 1)
    setSelected(value || '')
    setViewMode('calendar')
  }, [open, value])

  // Calendar grid
  const daysInMonth = new Date(displayYear, displayMonth, 0).getDate()
  const firstDay = new Date(displayYear, displayMonth - 1, 1).getDay()
  const daysInPrevMonth = new Date(displayYear, displayMonth - 1, 0).getDate()

  // cells: {day, month, year, isCurrentMonth}
  const cells: { day: number; month: number; year: number; isCurrentMonth: boolean }[] = []
  // prev month fill
  for (let i = firstDay - 1; i >= 0; i--) {
    const prevMonth = displayMonth === 1 ? 12 : displayMonth - 1
    const prevYear = displayMonth === 1 ? displayYear - 1 : displayYear
    cells.push({ day: daysInPrevMonth - i, month: prevMonth, year: prevYear, isCurrentMonth: false })
  }
  // current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, month: displayMonth, year: displayYear, isCurrentMonth: true })
  }
  // next month fill
  const remaining = 42 - cells.length // 6 rows × 7 cols
  const nextMonthNum = displayMonth === 12 ? 1 : displayMonth + 1
  const nextYearNum = displayMonth === 12 ? displayYear + 1 : displayYear
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, month: nextMonthNum, year: nextYearNum, isCurrentMonth: false })
  }

  function toDateStr(day: number, month: number, year: number) {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  function prevMonth() {
    if (displayMonth === 1) { setDisplayMonth(12); setDisplayYear(y => y - 1) }
    else setDisplayMonth(m => m - 1)
  }
  function nextMonth() {
    if (displayMonth === 12) { setDisplayMonth(1); setDisplayYear(y => y + 1) }
    else setDisplayMonth(m => m + 1)
  }

  const today = new Date()
  const todayStr = toDateStr(today.getDate(), today.getMonth() + 1, today.getFullYear())

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 ${open ? 'opacity-100 z-[75] pointer-events-auto' : 'opacity-0 z-[-1] pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sheet */}
      <div className={`fixed left-0 right-0 bottom-0 z-[80] bg-white rounded-t-2xl transition-transform duration-300 flex flex-col ${open ? 'translate-y-0' : 'translate-y-full'}`}>

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-sm bg-[#D1D9E0]" />
        </div>

        {/* ── CALENDAR VIEW ── */}
        {viewMode === 'calendar' && (
          <>
            {/* Header */}
            <div className="flex items-center px-4 py-3 shrink-0">
              <button onClick={onClose} className="w-8 h-8 rounded-lg border-none bg-transparent flex items-center justify-center cursor-pointer text-[#97AAB3]">
                <X size={18} />
              </button>
              <span className="flex-1 text-center font-bold text-base text-[#1C1C1C]">Pilih Tanggal</span>
              <div className="w-8" />
            </div>

            {/* Month / Year navigation */}
            <div className="flex items-center justify-between px-4 pb-3 shrink-0">
              <button onClick={prevMonth} className="w-8 h-8 rounded-lg border border-[#E1E8EC] bg-white flex items-center justify-center cursor-pointer text-[#5F737F]">
                <ChevronLeft size={14} />
              </button>

              <div className="flex items-center gap-3">
                {/* Month picker trigger */}
                <button
                  onClick={() => setViewMode('month')}
                  className="flex items-center gap-1 font-bold text-[15px] text-[#1C1C1C] border-none bg-transparent cursor-pointer"
                >
                  {MONTHS[displayMonth - 1]}
                  <ChevronDown size={13} className="text-[#076c9e]" />
                </button>

                {/* Year picker trigger */}
                <button
                  onClick={() => setViewMode('year')}
                  className="flex items-center gap-1 font-bold text-[15px] text-[#1C1C1C] border-none bg-transparent cursor-pointer"
                >
                  {displayYear}
                  <ChevronDown size={13} className="text-[#076c9e]" />
                </button>
              </div>

              <button onClick={nextMonth} className="w-8 h-8 rounded-lg border border-[#E1E8EC] bg-white flex items-center justify-center cursor-pointer text-[#5F737F]">
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 px-4 mb-1 shrink-0">
              {DAYS.map(d => (
                <p key={d} className="text-center text-[11px] font-bold text-[#97AAB3] py-1">{d}</p>
              ))}
            </div>

            {/* Day cells — 6 rows */}
            <div className="grid grid-cols-7 px-4 shrink-0">
              {cells.map((cell, i) => {
                const ds = toDateStr(cell.day, cell.month, cell.year)
                const isSel = ds === selected
                const isT = ds === todayStr
                return (
                  <button
                    key={i}
                    onClick={() => setSelected(ds)}
                    className={`flex items-center justify-center w-9 h-9 mx-auto rounded-full text-[13px] border-none cursor-pointer transition-all ${
                      isSel
                        ? 'bg-[#076c9e] text-white font-bold'
                        : isT
                          ? 'text-[#076c9e] font-semibold bg-transparent'
                          : cell.isCurrentMonth
                            ? 'bg-transparent text-[#1C1C1C]'
                            : 'bg-transparent text-[#C4CDD5]'
                    }`}
                  >
                    {cell.day}
                  </button>
                )
              })}
            </div>

            {/* Simpan */}
            <div className="px-4 pt-4 pb-6 shrink-0">
              <button
                onClick={() => { if (selected) { onConfirm(selected); onClose() } }}
                disabled={!selected}
                className="w-full h-11 rounded-full bg-[#076c9e] text-white font-semibold text-[14px] cursor-pointer border-none disabled:opacity-40"
              >
                Simpan
              </button>
            </div>
          </>
        )}

        {/* ── YEAR VIEW ── */}
        {viewMode === 'year' && (
          <>
            <div className="flex items-center px-4 py-3 shrink-0">
              <button onClick={() => setViewMode('calendar')} className="w-8 h-8 rounded-lg border-none bg-transparent flex items-center justify-center cursor-pointer text-[#97AAB3]">
                <ArrowLeft size={18} />
              </button>
              <span className="flex-1 text-center font-bold text-base text-[#1C1C1C]">Pilih Tahun</span>
              <div className="w-8" />
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-6">
              <div className="grid grid-cols-4 gap-y-4 gap-x-2 pt-2">
                {YEARS.map(y => (
                  <button
                    key={y}
                    onClick={() => { setDisplayYear(y); setViewMode('calendar') }}
                    className={`h-10 rounded-xl cursor-pointer text-[14px] font-semibold border-none transition-all ${
                      displayYear === y
                        ? 'bg-[#076c9e] text-white'
                        : 'bg-transparent text-[#5F737F]'
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── MONTH VIEW ── */}
        {viewMode === 'month' && (
          <>
            <div className="flex items-center px-4 py-3 shrink-0">
              <button onClick={() => setViewMode('calendar')} className="w-8 h-8 rounded-lg border-none bg-transparent flex items-center justify-center cursor-pointer text-[#97AAB3]">
                <ArrowLeft size={18} />
              </button>
              <span className="flex-1 text-center font-bold text-base text-[#1C1C1C]">Pilih Bulan</span>
              <div className="w-8" />
            </div>

            <div className="px-4 pb-8 shrink-0">
              <div className="grid grid-cols-3 gap-3 pt-2">
                {MONTHS.map((name, idx) => {
                  const isActive = displayMonth === idx + 1
                  return (
                    <button
                      key={name}
                      onClick={() => { setDisplayMonth(idx + 1); setViewMode('calendar') }}
                      className={`h-11 rounded-xl cursor-pointer text-[14px] font-semibold border-none transition-all ${
                        isActive
                          ? 'bg-[#076c9e] text-white'
                          : 'bg-transparent text-[#5F737F]'
                      }`}
                    >
                      {name}
                    </button>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
