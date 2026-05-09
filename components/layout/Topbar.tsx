'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { getUser, logout } from '@/lib/auth'
import { authApi } from '@/lib/api'
import toast from 'react-hot-toast'
import { KeyRound, LogOut, Menu } from 'lucide-react'
import { useSidebar } from './SidebarContext'

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

// ─── Change Password Modal ─────────────────────────────────────────────────────

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.newPassword !== form.confirmPassword) {
      toast.error('Konfirmasi password tidak cocok')
      return
    }
    if (form.newPassword.length < 6) {
      toast.error('Password baru minimal 6 karakter')
      return
    }
    setLoading(true)
    try {
      await authApi.changePassword({
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      })
      toast.success('Password berhasil diubah')
      onClose()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Gagal mengubah password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6">
        <h2 className="text-base font-semibold text-app-text mb-4">Ganti Password</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {[
            { key: 'oldPassword',      label: 'Password Lama' },
            { key: 'newPassword',      label: 'Password Baru' },
            { key: 'confirmPassword',  label: 'Konfirmasi Password Baru' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-app-subtle mb-1">{label}</label>
              <input
                type="password"
                required
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
              />
            </div>
          ))}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-app-subtle hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? 'Menyimpan…' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Topbar ───────────────────────────────────────────────────────────────────

export default function Topbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { isMobile, setMobileOpen } = useSidebar()

  useLayoutEffect(() => {
    setUser(getUser())
  }, [])

  useEffect(() => {
    if (!dropdownOpen) return
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [dropdownOpen])

  useEffect(() => {
    setDropdownOpen(false)
  }, [pathname])

  /* ── Mobile PWA topbar — Figma 48:13809 "Header Mobile" ── */
  if (isMobile) {
    return (
      <header
        className="pwa-topbar"
        style={{ background: '#076c9e', height: 64 }}
      >
        <span className="pwa-topbar-logo">⚡SPEKTRA</span>
        <button
          className="pwa-topbar-hamburger"
          onClick={() => setMobileOpen(true)}
          aria-label="Buka menu"
        >
          <Menu size={24} color="#ffffff" />
        </button>
      </header>
    )
  }

  /* ── Desktop topbar — floating rounded card with dropdown ── */
  return (
    <>
      <div className="sticky top-0 z-30 bg-app-bg px-4 pt-4 pb-0 sm:px-6">
        <header
          className="flex items-center justify-between bg-white px-4 sm:px-6 rounded-2xl shadow-sm"
          style={{ height: 60, border: '1px solid #e8edf2' }}
        >
          <div className="flex items-center gap-3">
            <p className="text-[15px] font-semibold text-app-text">
              {getPageTitle(pathname)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[13px] font-semibold text-app-text leading-tight">
                {user?.nama ?? '—'}
              </p>
              <p className="text-[11px] text-app-subtle leading-tight mt-0.5">
                {user?.jabatan} · {user?.unit}
              </p>
            </div>

            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 hover:opacity-80 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #2563eb, #0891b2)' }}
              >
                {user?.nama ? getInitials(user.nama) : '?'}
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                  style={{ top: '100%' }}
                >
                  <div className="flex items-center gap-3 px-4 py-3.5">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ background: 'linear-gradient(135deg, #2563eb, #0891b2)' }}
                    >
                      {user?.nama ? getInitials(user.nama) : '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-app-text leading-tight truncate">
                        {user?.nama ?? '—'}
                      </p>
                      <p className="text-[11px] text-app-subtle leading-tight mt-0.5 truncate">
                        {user?.nik ?? user?.jabatan ?? ''}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-100" />

                  <button
                    onClick={() => { setDropdownOpen(false); setShowChangePassword(true) }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-app-text hover:bg-gray-50 transition-colors"
                  >
                    <KeyRound size={15} className="text-app-subtle shrink-0" />
                    Request Ganti Password
                  </button>

                  <div className="border-t border-gray-100" />

                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={15} className="shrink-0" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
      </div>

      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}
    </>
  )
}
