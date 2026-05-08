'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  IconDashboard, IconRiwayat, IconAset, IconSertifikat,
  IconAsBuilt, IconClimb, IconCleanup, IconUsers, IconToggle,
} from '@/components/icons/SpektraIcons'
import { getUser } from '@/lib/auth'
import { useSidebar } from './SidebarContext'

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Nav link ─────────────────────────────────────────────────────────────────

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
    <a
      href={href}
      title={collapsed ? label : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: collapsed ? '10px 0' : '10px 14px',
        margin: collapsed ? '1px 8px' : '1px 10px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        color: active ? '#FFFFFF' : 'rgba(255,255,255,0.72)',
        fontSize: 13.5,
        fontWeight: active ? 600 : 400,
        background: active ? 'rgba(255,255,255,0.18)' : 'transparent',
        whiteSpace: 'nowrap',
        borderRadius: 8,
        textDecoration: 'none',
        transition: 'background 0.15s, color 0.15s',
        cursor: 'pointer',
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
    </a>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const pathname = usePathname()
  const { collapsed, setCollapsed } = useSidebar()

  const [isAdmin, setIsAdmin] = useState(false)
  useEffect(() => {
    const u = getUser()
    setIsAdmin(u?.role === 'admin')
  }, [])

  const navItems = ALL_NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin)

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 flex flex-col z-50 transition-all duration-300 overflow-hidden"
      style={{
        width: collapsed ? 68 : 260,
        background: 'linear-gradient(160deg, #085f8e 0%, #0a7ab5 55%, #0d8fd4 100%)',
      }}
    >
      {/* Top-right cyan glow */}
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: 200, height: 200,
          background: 'radial-gradient(circle, rgba(100,210,255,0.22) 0%, transparent 65%)',
          filter: 'blur(30px)',
        }}
      />

      {/* Header */}
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          padding: collapsed ? '0 14px' : '0 16px',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          flexShrink: 0,
          position: 'relative',
        }}
      >
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, userSelect: 'none' }}>
            {/* Lightning bolt — just the emoji, matching Figma */}
            <span style={{ fontSize: 22, lineHeight: 1 }}>⚡</span>
            <span style={{
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 800,
              fontSize: 18,
              color: '#FFFFFF',
              letterSpacing: '0.06em',
            }}>
              SPEKTRA
            </span>
          </div>
        )}

        {/* Toggle button — grid icon like Figma */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            width: 32, height: 32,
            borderRadius: 6,
            border: 'none',
            background: 'transparent',
            color: 'rgba(255,255,255,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.15s, color 0.15s',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.color = '#fff'
            el.style.background = 'rgba(255,255,255,0.12)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.color = 'rgba(255,255,255,0.6)'
            el.style.background = 'transparent'
          }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {/* Grid/layout toggle icon matching Figma */}
          <IconToggle size={18} />
        </button>
      </div>

      {/* Nav — unified list, no section labels */}
      <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto', overflowX: 'hidden' }}>
        {navItems.map(({ label, icon: Icon, href }) => (
          <NavLink
            key={href}
            href={href}
            label={label}
            Icon={Icon}
            active={isActive(href)}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Bottom glow */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: 140,
          background: 'radial-gradient(ellipse at center bottom, rgba(249,239,119,0.18), transparent 70%)',
        }}
      />

      {/* Footer */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: collapsed ? '12px 0' : '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        flexShrink: 0,
        position: 'relative',
      }}>
        {!collapsed && (
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.03em' }}>
            Powered by{' '}
            <span style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>Born2Works</span>
          </p>
        )}
        {collapsed && (
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.28)', fontWeight: 700 }}>B2W</span>
        )}
      </div>
    </aside>
  )
}
