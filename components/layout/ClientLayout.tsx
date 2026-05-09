'use client'

import { usePathname } from 'next/navigation'
import { Toaster } from 'react-hot-toast'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { SidebarProvider, useSidebar } from './SidebarContext'

const PUBLIC_PATHS = ['/login']

const TOAST_OPTS = {
  style: { background: '#fff', color: '#1a202c', border: '1px solid #e8edf2', fontSize: '13px' },
}

function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { sidebarWidth } = useSidebar()
  const isPublic = PUBLIC_PATHS.includes(pathname)

  if (isPublic) {
    return (
      <>
        {children}
        <Toaster position="top-right" toastOptions={TOAST_OPTS} />
      </>
    )
  }

  return (
    <>
      <Sidebar />
      <div
        className="flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        <Topbar />
        <main className="flex-1 bg-app-bg p-4 sm:p-6 md:px-7">
          {children}
        </main>
      </div>
      <Toaster position="top-right" toastOptions={TOAST_OPTS} />
    </>
  )
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppShell>{children}</AppShell>
    </SidebarProvider>
  )
}
