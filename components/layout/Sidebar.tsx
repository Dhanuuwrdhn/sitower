'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useLayoutEffect, useState } from 'react'
import { X, KeyRound, LogOut, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import { authApi } from '@/lib/api'
import {
  IconDashboard, IconRiwayat, IconAset,
  IconAsBuilt, IconClimb, IconCleanup, IconUsers, IconToggle, IconLightning,
} from '@/components/icons/SpektraIcons'
import { getUser, logout } from '@/lib/auth'
import { useSidebar } from './SidebarContext'

function getInitials(nama: string) {
  const parts = nama.trim().split(' ')
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

type NavItem = {
  label: string
  href: string
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>
  adminOnly?: boolean
  hidden?: boolean
}

const ALL_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: IconDashboard, href: '/dashboard' },
  { label: 'Riwayat Kerawanan Transmisi', icon: IconRiwayat, href: '/laporan/gangguan' },
  { label: 'Data Aset Transmisi', icon: IconAset, href: '/aset', },
  { label: 'As Built Drawing', icon: IconAsBuilt, href: '/as-built-drawing', hidden: true },
  { label: 'Climb Up Inspection', icon: IconClimb, href: '/laporan/cui', hidden: true },
  { label: 'Clean Up Isolator', icon: IconCleanup, href: '/laporan/cleanup', hidden: true },
  { label: 'Manajemen User', icon: IconUsers, href: '/admin/users', adminOnly: true },
]

// ─── Desktop NavLink ───────────────────────────────────────────────────────────

function NavLink({
  href, label, Icon, active, collapsed,
}: {
  href: string
  label: string
  Icon: React.ComponentType<{ size?: number; className?: string }>
  active: boolean
  collapsed: boolean
}) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: collapsed ? '12px 0' : '12px 14px',
        margin: collapsed ? '4px 8px' : '4px 10px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        color: active ? '#FFFFFF' : 'rgba(255,255,255,0.72)',
        fontSize: 13.5, fontWeight: active ? 600 : 400,
        background: active ? 'rgba(255,255,255,0.18)' : 'transparent',
        whiteSpace: 'nowrap', borderRadius: 8, textDecoration: 'none',
        transition: 'background 0.15s, color 0.15s', cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          const el = e.currentTarget as HTMLElement
          el.style.background = 'rgba(255,255,255,0.1)'
          el.style.color = '#fff'
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          const el = e.currentTarget as HTMLElement
          el.style.background = 'transparent'
          el.style.color = 'rgba(255,255,255,0.72)'
        }
      }}
    >
      <Icon size={20} className="shrink-0" />
      {!collapsed && <span style={{ letterSpacing: '-0.01em' }}>{label}</span>}
    </Link>
  )
}

// ─── Mobile PWA NavLink — Figma 74:3616 Menu items 398x48 ─────────────────────

function MobileNavLink({
  href, label, Icon, active,
}: {
  href: string
  label: string
  Icon: React.ComponentType<{ size?: number; className?: string }>
  active: boolean
}) {
  return (
    <a
      href={href}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 16px',
        color: '#ffffff',
        fontSize: 14, fontWeight: active ? 600 : 500,
        background: active ? 'rgba(255,255,255,0.18)' : 'transparent',
        borderRadius: 10, textDecoration: 'none',
        transition: 'background 0.15s',
        margin: '2px 0',
      }}
    >
      <Icon size={22} className="shrink-0" />
      <span>{label}</span>
    </a>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const pathname = usePathname()
  const { collapsed, setCollapsed, isMobile, mobileOpen, setMobileOpen } = useSidebar()

  useEffect(() => {
    if (isMobile && mobileOpen) setMobileOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isMobile])

  const [user, setUser] = useState<ReturnType<typeof getUser>>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  useLayoutEffect(() => {
    const u = getUser()
    setUser(u)
    setIsAdmin(u?.role === 'admin' || u?.role === 'superadmin')
  }, [])

  const showAll = process.env.NEXT_PUBLIC_SHOW_ALL_MENU === 'true'
  const navItems = ALL_NAV_ITEMS.filter((item) => (!item.hidden || showAll) && (!item.adminOnly || isAdmin))

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  const isCollapsed = !isMobile && collapsed

  /* ════════════════════════════════════════════════
     MOBILE PWA SIDEBAR — Figma 74:3616
     Full-screen overlay, decorative ellipses
  ════════════════════════════════════════════════ */
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Sidebar panel — full-screen, z-[60] agar di atas topbar (z-50) */}
        <aside
          className="fixed left-0 top-0 bottom-0 z-[60] flex flex-col overflow-hidden transition-transform duration-300"
          style={{
            width: '100vw',
            background: '#076c9e',
            transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          }}
        >
          {/* Header — ⚡SPEKTRA + subtitle + close button */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.12)',
            flexShrink: 0,
            position: 'relative',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <IconLightning size={26} />
                <span style={{
                  fontFamily: 'Orbitron, sans-serif',
                  fontWeight: 800, fontSize: 22,
                  color: '#ffffff', letterSpacing: '0.05em',
                  userSelect: 'none', lineHeight: 1.1,
                }}>
                  SPEKTRA
                </span>
              </span>
              <span style={{
                fontSize: 12, fontWeight: 400,
                color: 'rgba(255,255,255,0.85)',
                letterSpacing: '0.01em',
                lineHeight: 1.35,
                userSelect: 'none',
              }}>
                Sistem Pemantauan<br />Kerawanan Transmisi
              </span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              style={{
                width: 36, height: 36, borderRadius: 8,
                border: 'none', background: 'rgba(255,255,255,0.12)',
                color: '#fff', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Profile card — avatar + name + role + Request Ganti Password button */}
          {user && (
            <div style={{
              margin: '12px 16px',
              padding: '14px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: 12,
              display: 'flex', flexDirection: 'column', gap: 12,
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  border: '2px solid rgba(255,255,255,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: 16,
                  flexShrink: 0, userSelect: 'none',
                }}>
                  {getInitials(user.nama)}
                </div>
                <div style={{ overflow: 'hidden', minWidth: 0, flex: 1 }}>
                  <p style={{
                    color: '#fff', fontWeight: 700, fontSize: 16,
                    lineHeight: '22px', whiteSpace: 'nowrap',
                    overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {user.nama}
                  </p>
                  <p style={{
                    color: 'rgba(255,255,255,0.75)', fontSize: 13,
                    lineHeight: '18px', whiteSpace: 'nowrap',
                    overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {user.jabatan ?? user.unit ?? 'PLN'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowChangePassword(true)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 8, padding: '10px 14px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.45)',
                  borderRadius: 8,
                  color: '#FFFFFF', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  minHeight: 40,
                }}
              >
                <Lock size={15} />
                Request Ganti Password
              </button>
            </div>
          )}

          {/* Nav menu */}
          <nav style={{
            flex: 1, overflowY: 'auto', padding: '4px 16px 12px',
            position: 'relative',
          }}>
            {navItems.map(({ label, icon: Icon, href }) => (
              <MobileNavLink
                key={href}
                href={href}
                label={label}
                Icon={Icon}
                active={isActive(href)}
              />
            ))}
          </nav>

          {/* Keluar Akun — full-width prominent button */}
          <div style={{
            padding: '12px 16px',
            borderTop: '1px solid rgba(255,255,255,0.10)',
            flexShrink: 0,
          }}>
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 10, padding: '12px 16px',
                background: 'rgba(252,165,165,0.10)',
                border: '1px solid rgba(252,165,165,0.45)',
                borderRadius: 10,
                color: '#FCA5A5', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                minHeight: 48,
              }}
            >
              <LogOut size={18} />
              Keluar Akun
            </button>
          </div>

          {/* Footer */}
          <div style={{
            padding: '10px 16px 14px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            flexShrink: 0, position: 'relative',
          }}>
            <p style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.01em' }}>
              © 2026. PT PLN (Persero).
            </p>
            <p style={{ fontSize: 9, fontWeight: 500, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Powered by Born2Works
            </p>
          </div>
        </aside>

        {showLogoutConfirm && (
          <LogoutConfirmModal
            onCancel={() => setShowLogoutConfirm(false)}
            onConfirm={logout}
          />
        )}
        {showChangePassword && (
          <RequestPasswordModal onClose={() => setShowChangePassword(false)} />
        )}
      </>
    )
  }

  /* ════════════════════════════════════════════════
     DESKTOP SIDEBAR — existing design unchanged
  ════════════════════════════════════════════════ */
  const transform = 'translateX(0)'
  const width = collapsed ? 68 : 260

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 flex flex-col z-50 transition-transform duration-300"
      style={{
        width, transform,
        background: 'linear-gradient(160deg, #085f8e 0%, #0a7ab5 55%, #0d8fd4 100%)',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        overflow: 'hidden',
      }}
    >
      {/* Top-right cyan glow */}
      <div className="absolute top-0 right-0 pointer-events-none" style={{
        width: 200, height: 200,
        background: 'radial-gradient(circle, rgba(100,210,255,0.22) 0%, transparent 65%)',
        filter: 'blur(30px)',
      }} />

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: isCollapsed ? 'center' : 'flex-start',
        padding: isCollapsed ? '20px 14px' : '12px 16px',
        minHeight: 64,
        justifyContent: isCollapsed ? 'center' : 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        flexShrink: 0, position: 'relative',
      }}>
        {!isCollapsed && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, userSelect: 'none', flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconLightning size={22} />
              <span style={{
                fontFamily: 'Orbitron, sans-serif', fontWeight: 800,
                fontSize: 18, color: '#FFFFFF', letterSpacing: '0.06em', lineHeight: 1.1,
              }}>SPEKTRA</span>
            </div>
            <span style={{
              fontSize: 10.5, fontWeight: 500,
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: '0.02em',
            }}>
              Sistem Pemantauan<br />Kerawanan Transmisi
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            width: 32, height: 32, borderRadius: 6, border: 'none',
            background: 'transparent', color: 'rgba(255,255,255,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'background 0.15s, color 0.15s', flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.color = '#fff'; el.style.background = 'rgba(255,255,255,0.12)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.color = 'rgba(255,255,255,0.6)'; el.style.background = 'transparent'
          }}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <IconToggle size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, paddingTop: 32, paddingBottom: 8, overflowY: 'auto', overflowX: 'hidden' }}>
        {navItems.map(({ label, icon: Icon, href }) => (
          <NavLink
            key={href} href={href} label={label} Icon={Icon}
            active={isActive(href)} collapsed={isCollapsed}
          />
        ))}
      </nav>

      {/* Bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{
        height: 140,
        background: 'radial-gradient(ellipse at center bottom, rgba(249,239,119,0.18), transparent 70%)',
      }} />

      {/* Footer */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: isCollapsed ? '10px 0' : '12px 16px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
        flexShrink: 0, position: 'relative',
      }}>
        {isCollapsed ? (
          <p style={{ fontSize: 8, fontWeight: 800, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em' }}>B2W</p>
        ) : (
          <>
            <p style={{ fontSize: 8.5, fontWeight: 500, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Powered by</p>
            <p style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em' }}>Born2Works</p>
          </>
        )}
      </div>
    </aside>
  )
}

// ─── Logout confirmation modal ────────────────────────────────────────────
function LogoutConfirmModal({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={onCancel} />
      <div style={{ position: 'relative', background: '#fff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 360 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1B1B1B', marginBottom: 8 }}>Keluar</h3>
        <p style={{ fontSize: 14, color: '#5F737F', marginBottom: 20 }}>Apakah anda yakin ingin keluar?</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onCancel}
            style={{ flex: 1, height: 44, borderRadius: 22, background: '#fff', border: '1px solid #E1E8EC', color: '#374151', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Batal
          </button>
          <button onClick={onConfirm}
            style={{ flex: 1, height: 44, borderRadius: 22, background: '#D92D20', border: 'none', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Ya
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Request password change modal ────────────────────────────────────────
function RequestPasswordModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ passwordLama: '', passwordBaru: '', konfirmasiPasswordBaru: '' })
  const [submitting, setSubmitting] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.passwordLama || !form.passwordBaru) { toast.error('Semua field wajib diisi'); return }
    if (form.passwordBaru !== form.konfirmasiPasswordBaru) { toast.error('Konfirmasi password tidak cocok'); return }
    setSubmitting(true)
    try {
      await authApi.requestChangePassword(form)
      toast.success('Permintaan ganti password dikirim')
      onClose()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Gagal mengirim permintaan')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
      <form onSubmit={submit} style={{ position: 'relative', background: '#fff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 400 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1B1B1B' }}>Request Ganti Password</h3>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>
        {(['passwordLama','passwordBaru','konfirmasiPasswordBaru'] as const).map((k, i) => (
          <div key={k} style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
              {k === 'passwordLama' ? 'Password Lama' : k === 'passwordBaru' ? 'Password Baru' : 'Konfirmasi Password Baru'}
            </label>
            <input type="password" value={form[k]}
              onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              autoFocus={i === 0}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E1E8EC', fontSize: 14, minHeight: 44 }} />
          </div>
        ))}
        <p style={{ fontSize: 11, color: '#97AAB3', marginBottom: 16 }}>
          Min. 8 karakter, 1 huruf kapital, 1 karakter spesial.
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={onClose}
            style={{ flex: 1, height: 44, borderRadius: 22, background: '#fff', border: '1px solid #E1E8EC', color: '#374151', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Batal
          </button>
          <button type="submit" disabled={submitting}
            style={{ flex: 1, height: 44, borderRadius: 22, background: '#076C9E', border: 'none', color: '#fff', fontSize: 14, fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
            {submitting ? 'Mengirim...' : 'Kirim Permintaan'}
          </button>
        </div>
      </form>
    </div>
  )
}
