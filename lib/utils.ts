import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, withTime = false) {
  const d = new Date(date)
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric', month: 'long', year: 'numeric',
    ...(withTime && { hour: '2-digit', minute: '2-digit' }),
  }
  return d.toLocaleDateString('id-ID', options)
}

export function formatDateTime(date: string | Date) {
  return formatDate(date, true)
}

export function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

// Legacy color helpers — masih digunakan di komponen lama
export function statusColor(kondisi: string) {
  switch (kondisi) {
    case 'normal':      return 'text-green-700 bg-green-50 border-green-200'
    case 'waspada':     return 'text-amber-700 bg-amber-50 border-amber-200'
    case 'gangguan':    return 'text-red-700 bg-red-50 border-red-200'
    case 'maintenance': return 'text-blue-700 bg-blue-50 border-blue-200'
    default:            return 'text-slate-600 bg-slate-50 border-slate-200'
  }
}

export function kerawananColor(level: string) {
  switch (level) {
    case 'aman':   return 'text-green-700 bg-green-50 border-green-200'
    case 'sedang': return 'text-amber-700 bg-amber-50 border-amber-200'
    case 'kritis': return 'text-red-700 bg-red-50 border-red-200'
    default:       return 'text-slate-600 bg-slate-50 border-slate-200'
  }
}

export function intensitasColor(level: string) {
  return kerawananColor(level)
}

export function sertifikatStatusColor(status: string) {
  switch (status) {
    case 'valid':    return 'text-green-700 bg-green-50 border-green-200'
    case 'expiring': return 'text-amber-700 bg-amber-50 border-amber-200'
    case 'expired':  return 'text-red-700 bg-red-50 border-red-200'
    default:         return 'text-slate-600 bg-slate-50 border-slate-200'
  }
}
