'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useLayoutEffect, useState } from 'react'
import { X } from 'lucide-react'
import {
  IconDashboard, IconRiwayat, IconAset, IconSertifikat,
  IconAsBuilt, IconClimb, IconCleanup, IconUsers, IconToggle,
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
}

const ALL_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',           icon: IconDashboard,  href: '/dashboard' },
  { label: 'Riwayat Gangguan',    icon: IconRiwayat,    href: '/laporan/gangguan' },
  { label: 'Data Aset Transmisi', icon: IconAset,       href: '/aset' },
  { label: 'Sertifikat',          icon: IconSertifikat, href: '/sertifikat' },
  { label: 'As Built Drawing',    icon: IconAsBuilt,    href: '/as-built-drawing' },
  { label: 'Climb Up Inspection', icon: IconClimb,      href: '/laporan/cui' },
  { label: 'Clean Up Isolator',   icon: IconCleanup,    href: '/laporan/cleanup' },
  { label: 'Manajemen User',      icon: IconUsers,      href: '/admin/users', adminOnly: true },
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
  useLayoutEffect(() => {
    const u = getUser()
    setUser(u)
    setIsAdmin(u?.role === 'admin')
  }, [])

  const navItems = ALL_NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin)

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
          className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
            mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Sidebar panel — full-screen */}
        <aside
          className="fixed left-0 top-0 bottom-0 z-50 flex flex-col overflow-hidden transition-transform duration-300"
          style={{
            width: '100vw',
            background: '#076c9e',
            transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          }}
        >
          {/* Decorative ellipse — yellow, top-right (Figma Ellipse 38 #f9ef77) */}
          <div className="absolute pointer-events-none" style={{
            width: 360, height: 360,
            borderRadius: '50%',
            background: '#f9ef77',
            opacity: 0.18,
            top: -120, right: -80,
          }} />

          {/* Decorative ellipse — teal, bottom-right (Figma Ellipse 37 #2aa3b2) */}
          <div className="absolute pointer-events-none" style={{
            width: 380, height: 380,
            borderRadius: '50%',
            background: '#2aa3b2',
            opacity: 0.22,
            bottom: -120, right: -80,
          }} />

          {/* Header — ⚡SPEKTRA + close button */}
          <div style={{
            height: 64,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 16px',
            borderBottom: '1px solid rgba(255,255,255,0.12)',
            flexShrink: 0,
            position: 'relative',
          }}>
            <span style={{
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 800, fontSize: 22,
              color: '#ffffff', letterSpacing: '0.05em',
              userSelect: 'none',
            }}>
              ⚡SPEKTRA
            </span>
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

          {/* User info — Figma: avatar circle + nama 16px/700 + jabatan 14px/500 */}
          {user && (
            <div style={{
              padding: '16px',
              borderBottom: '1px solid rgba(255,255,255,0.12)',
              display: 'flex', alignItems: 'center', gap: 12,
              flexShrink: 0, position: 'relative',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                border: '2px solid rgba(255,255,255,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: 15,
                flexShrink: 0, userSelect: 'none',
              }}>
                {getInitials(user.nama)}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <p style={{
                  color: '#fff', fontWeight: 700, fontSize: 16,
                  lineHeight: '24px', whiteSpace: 'nowrap',
                  overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {user.nama}
                </p>
                <p style={{
                  color: 'rgba(255,255,255,0.7)', fontSize: 13,
                  lineHeight: '20px', whiteSpace: 'nowrap',
                  overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {user.jabatan ?? user.unit ?? 'PLN'}
                </p>
              </div>
            </div>
          )}

          {/* Nav menu — Figma: 8 items, 14px/500 */}
          <nav style={{
            flex: 1, overflowY: 'auto', padding: '12px 16px',
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

          {/* Footer — Figma: "© 2026. PT PLN (Persero)." + Keluar */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.12)',
            padding: '12px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0, position: 'relative',
          }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.5)' }}>
              © 2026. PT PLN (Persero).
            </p>
            <button
              onClick={logout}
              style={{
                background: 'rgba(255,255,255,0.12)', border: 'none',
                borderRadius: 6, color: 'rgba(255,255,255,0.8)',
                fontSize: 12, fontWeight: 600, padding: '6px 14px',
                cursor: 'pointer',
              }}
            >
              Keluar
            </button>
          </div>
        </aside>
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
      className="fixed left-0 top-0 bottom-0 flex flex-col z-50 transition-transform duration-300 overflow-hidden"
      style={{
        width, transform,
        background: 'linear-gradient(160deg, #085f8e 0%, #0a7ab5 55%, #0d8fd4 100%)',
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
        height: 64, display: 'flex', alignItems: 'center',
        padding: isCollapsed ? '0 14px' : '0 16px',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        flexShrink: 0, position: 'relative',
      }}>
        {!isCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, userSelect: 'none' }}>
            <span style={{ fontSize: 22, lineHeight: 1 }}>⚡</span>
            <span style={{
              fontFamily: 'Orbitron, sans-serif', fontWeight: 800,
              fontSize: 18, color: '#FFFFFF', letterSpacing: '0.06em',
            }}>SPEKTRA</span>
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

      {/* User info */}
      {user && (
        <div style={{
          padding: isCollapsed ? '12px 0' : '12px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', gap: 10,
          justifyContent: isCollapsed ? 'center' : 'flex-start', flexShrink: 0,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0, userSelect: 'none',
          }}>
            {getInitials(user.nama)}
          </div>
          {!isCollapsed && (
            <div style={{ overflow: 'hidden' }}>
              <p style={{
                color: '#fff', fontWeight: 700, fontSize: 14, lineHeight: '22px',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{user.nama}</p>
              <p style={{
                color: 'rgba(255,255,255,0.65)', fontSize: 12, lineHeight: '18px',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{user.jabatan ?? user.unit ?? 'PLN'}</p>
            </div>
          )}
        </div>
      )}

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
        padding: isCollapsed ? '12px 0' : '10px 16px',
        display: 'flex', alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        flexShrink: 0, position: 'relative', gap: 8,
      }}>
        {isCollapsed ? (
          <button onClick={logout} title="Logout" style={{
            background: 'transparent', border: 'none',
            color: 'rgba(255,255,255,0.45)', cursor: 'pointer', fontSize: 9, fontWeight: 700,
          }}>B2W</button>
        ) : (
          <>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.03em' }}>
              © 2026. PT PLN (Persero).
            </p>
            <button onClick={logout} style={{
              background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 6,
              color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600,
              padding: '4px 10px', cursor: 'pointer', flexShrink: 0,
            }}>Keluar</button>
          </>
        )}
      </div>
    </aside>
  )
}
