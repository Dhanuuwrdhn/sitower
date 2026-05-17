import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'
import ClientLayout from '@/components/layout/ClientLayout'

export const metadata: Metadata = {
  title: 'SPEKTRA – Sistem Pemantauan Kerawanan Transmisi',
  description: 'Sistem Pemantauan Kerawanan Transmisi Tower PLN.',
  keywords: ['SPEKTRA', 'PLN', 'tower transmisi', 'kerawanan', 'monitoring', 'Born2Works'],
  authors: [{ name: 'Born2Works' }],
  creator: 'Born2Works',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SPEKTRA',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#076c9e',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="antialiased">
        <ClientLayout>{children}</ClientLayout>
        <Script id="sw-register" strategy="afterInteractive">
          {`if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/sw.js') }`}
        </Script>
      </body>
    </html>
  )
}
