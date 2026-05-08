'use client'

import { createContext, useContext, useState } from 'react'

const EXPANDED_W = 272
const COLLAPSED_W = 68

interface SidebarCtx {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  sidebarWidth: number
}

const SidebarContext = createContext<SidebarCtx>({
  collapsed: false,
  setCollapsed: () => {},
  sidebarWidth: EXPANDED_W,
})

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, sidebarWidth: collapsed ? COLLAPSED_W : EXPANDED_W }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => useContext(SidebarContext)
export { EXPANDED_W, COLLAPSED_W }
