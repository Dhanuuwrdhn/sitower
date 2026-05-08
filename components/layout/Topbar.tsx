'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getUser, logout } from '@/lib/auth'

const PAGE_TITLES: Record<string, string> = {
  '/laporan/gangguan': 'Riwayat Gangguan',
  '/aset':             'Data Aset Transmisi',
  '/sertifikat':       'Sertifikat',
  '/as-built-drawing': 'As Built Drawing',
  '/laporan/cui':      'Climb Up Inspection',
  '/laporan/cleanup':  'Clean Up Isolator',
  '/admin/users':      'User Management',
}

function getInitials(nama: string) {
  const parts = nama.trim().split(' ')
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function getPageTitle(pathname: string) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  const prefix = Object.keys(PAGE_TITLES).find((k) => pathname.startsWith(k) && k !== '/')
  return prefix ? PAGE_TITLES[prefix] : ''
}

export default function Topbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null)
  const title = getPageTitle(pathname)

  // Read cookie only on client to avoid SSR hydration mismatch
  useEffect(() => {
    setUser(getUser())
  }, [])

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between bg-white px-7"
      style={{ height: 64, borderBottom: '1px solid #e8edf2' }}
    >
      {/* Page title — hidden on dashboard */}
      {title ? (
        <h1 className="text-[15px] font-semibold text-app-text">{title}</h1>
      ) : (
        <div />
      )}

      {/* User info + logout */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-[13px] font-semibold text-app-text leading-tight">
            {user?.nama ?? '—'}
          </p>
          <p className="text-[11px] text-app-subtle leading-tight mt-0.5">
            {user?.jabatan} · {user?.unit}
          </p>
        </div>
        <button
          onClick={logout}
          title="Logout"
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 hover:opacity-80 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #2563eb, #0891b2)' }}
        >
          {user?.nama ? getInitials(user.nama) : '?'}
        </button>
      </div>
    </header>
  )
}
