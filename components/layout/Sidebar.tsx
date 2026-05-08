'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  IconDashboard, IconRiwayat, IconAset, IconSertifikat,
  IconAsBuilt, IconClimb, IconCleanup, IconUsers,
} from '@/components/icons/SpektraIcons'
import { getUser } from '@/lib/auth'
import { useSidebar } from './SidebarContext'

type NavItem = {
  label: string
  href: string
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',           icon: IconDashboard,  href: '/dashboard' },
  { label: 'Riwayat Gangguan',    icon: IconRiwayat,    href: '/laporan/gangguan' },
  { label: 'Data Aset Transmisi', icon: IconAset,       href: '/aset' },
  { label: 'Sertifikat',          icon: IconSertifikat, href: '/sertifikat' },
  { label: 'As Built Drawing',    icon: IconAsBuilt,    href: '/as-built-drawing' },
  { label: 'Climb Up Inspection', icon: IconClimb,      href: '/laporan/cui' },
  { label: 'Clean Up Isolator',   icon: IconCleanup,    href: '/laporan/cleanup' },
]

const ADMIN_ITEMS: NavItem[] = [
  { label: 'User Management', icon: IconUsers, href: '/admin/users' },
]


export default function Sidebar() {
  const pathname = usePathname()
  const { collapsed, setCollapsed } = useSidebar()

  const user = getUser()
  const items = user?.role === 'admin' ? [...NAV_ITEMS, ...ADMIN_ITEMS] : NAV_ITEMS

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 flex flex-col z-50 transition-all duration-300 overflow-hidden"
      style={{
        width: collapsed ? 68 : 272,
        background: '#076C9E',
      }}
    >
      {/* Decorative cyan blur – top-right corner */}
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: 160,
          height: 160,
          background: 'radial-gradient(circle, rgba(24,178,222,0.35) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Header */}
      <div
        className="relative flex items-center shrink-0"
        style={{
          height: 72,
          padding: collapsed ? '0 12px' : '0 16px',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {!collapsed && (
          <div className="flex items-center gap-2 min-w-0 select-none">
            <span style={{ fontSize: 20 }}>⚡</span>
            <span
              style={{
                fontFamily: 'Orbitron, sans-serif',
                fontWeight: 800,
                fontSize: 20,
                color: '#FFFFFF',
                letterSpacing: '0.04em',
                lineHeight: 1,
              }}
            >
              SPEKTRA
            </span>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="shrink-0 w-8 h-8 rounded-md flex items-center justify-center transition-colors"
          style={{ color: 'rgba(255,255,255,0.6)' }}
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
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
        {items.map(({ label, icon: Icon, href }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className="flex items-center rounded-md transition-all duration-150"
              style={{
                gap: 10,
                padding: '12px',
                margin: collapsed ? '0 8px 2px' : '0 12px 2px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                color: '#FFFFFF',
                fontSize: 14,
                fontWeight: active ? 600 : 500,
                background: active ? 'rgba(255,255,255,0.18)' : 'transparent',
                opacity: active ? 1 : 0.8,
                whiteSpace: 'nowrap',
                borderRadius: 6,
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'rgba(255,255,255,0.1)'
                  el.style.opacity = '1'
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'transparent'
                  el.style.opacity = '0.8'
                }
              }}
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Bottom yellow glow */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: 180,
          background: 'radial-gradient(ellipse at center bottom, rgba(249,239,119,0.25), transparent 70%)',
        }}
      />

      {/* Footer */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
      >
        {!collapsed && (
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.02em' }}>
            Powered by <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>Born2Works</span>
          </p>
        )}
        {collapsed && (
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>B2W</span>
        )}
      </div>
    </aside>
  )
}
