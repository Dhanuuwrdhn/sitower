'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

const MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const DAYS = ['Min','Sen','Sel','Rab','Kam','Jum','Sab']
const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: CURRENT_YEAR - 2019 }, (_, i) => CURRENT_YEAR - i)

interface Props {
  open: boolean
  value: string // YYYY-MM-DD
  onConfirm: (date: string) => void
  onClose: () => void
}

export default function CalendarPickerSheet({ open, value, onConfirm, onClose }: Props) {
  const [viewMode, setViewMode] = useState<'calendar' | 'year'>('calendar')
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

  const daysInMonth = new Date(displayYear, displayMonth, 0).getDate()
  const firstDay = new Date(displayYear, displayMonth - 1, 1).getDay()
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  function toDateStr(day: number) {
    return `${displayYear}-${String(displayMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`
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
  const todayStr = toDateStr === undefined ? '' : `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`

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

        {/* Header */}
        <div className="flex items-center px-4 py-3 shrink-0">
          {viewMode === 'year' ? (
            <button onClick={() => setViewMode('calendar')} className="w-8 h-8 rounded-lg border-none bg-transparent flex items-center justify-center cursor-pointer text-[#97AAB3]">
              <ChevronLeft size={18} />
            </button>
          ) : (
            <button onClick={onClose} className="w-8 h-8 rounded-lg border-none bg-transparent flex items-center justify-center cursor-pointer text-[#97AAB3]">
              <X size={18} />
            </button>
          )}
          <span className="flex-1 text-center font-bold text-base text-[#1C1C1C]">
            {viewMode === 'year' ? 'Pilih Tahun' : 'Pilih Tanggal'}
          </span>
          <div className="w-8" />
        </div>

        {/* ── Calendar view ── */}
        {viewMode === 'calendar' && (
          <>
            {/* Month / Year navigation */}
            <div className="flex items-center justify-between px-5 pb-2 shrink-0">
              <button onClick={prevMonth} className="w-8 h-8 rounded-lg border border-[#E1E8EC] bg-white flex items-center justify-center cursor-pointer text-[#5F737F]">
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => setViewMode('year')}
                className="flex items-center gap-1 font-bold text-[15px] text-[#1C1C1C] border-none bg-transparent cursor-pointer"
              >
                {MONTHS[displayMonth - 1]} {displayYear}
                <ChevronRight size={13} className="text-[#076c9e]" />
              </button>
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

            {/* Day cells */}
            <div className="grid grid-cols-7 px-4 shrink-0">
              {cells.map((day, i) => {
                if (!day) return <div key={i} />
                const ds = toDateStr(day)
                const isSel = ds === selected
                const isT = ds === todayStr
                return (
                  <button
                    key={i}
                    onClick={() => setSelected(ds)}
                    className={`flex items-center justify-center w-9 h-9 mx-auto rounded-full text-[14px] border-none cursor-pointer transition-all ${
                      isSel ? 'bg-[#076c9e] text-white font-bold' :
                      isT   ? 'border border-[#076c9e] text-[#076c9e] font-semibold bg-transparent' :
                              'bg-transparent text-[#1C1C1C]'
                    }`}
                  >
                    {day}
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

        {/* ── Year view ── */}
        {viewMode === 'year' && (
          <div className="flex-1 overflow-y-auto px-4 pb-6">
            <div className="grid grid-cols-4 gap-2 pt-1">
              {YEARS.map(y => (
                <button
                  key={y}
                  onClick={() => { setDisplayYear(y); setViewMode('calendar') }}
                  className={`h-[38px] rounded-lg border-2 cursor-pointer text-[13px] font-semibold transition-all ${
                    displayYear === y
                      ? 'border-[#076c9e] bg-[#076c9e] text-white'
                      : 'border-[#E1E8EC] bg-white text-[#5F737F]'
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
