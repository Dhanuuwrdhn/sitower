'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const EXPANDED_W = 272
const COLLAPSED_W = 68

interface SidebarCtx {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  sidebarWidth: number
  isMobile: boolean
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
}

const SidebarContext = createContext<SidebarCtx>({
  collapsed: false,
  setCollapsed: () => {},
  sidebarWidth: EXPANDED_W,
  isMobile: false,
  mobileOpen: false,
  setMobileOpen: () => {},
})

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const width = isMobile ? 0 : (collapsed ? COLLAPSED_W : EXPANDED_W)

  return (
    <SidebarContext.Provider value={{ 
      collapsed, setCollapsed, sidebarWidth: width, isMobile, mobileOpen, setMobileOpen 
    }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => useContext(SidebarContext)
export { EXPANDED_W, COLLAPSED_W }
