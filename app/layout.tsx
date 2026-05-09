import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import ClientLayout from '@/components/layout/ClientLayout'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SPEKTRA – Sistem Pemantauan Kerawanan Transmisi',
  description: 'Sistem Pemantauan Kerawanan Transmisi Tower PLN UIW Banten. Built by Born2Works.',
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
    <html lang="id" className={inter.variable}>
      <body className="antialiased">
        <ClientLayout>{children}</ClientLayout>
        <Script id="sw-register" strategy="afterInteractive">
          {`if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/sw.js') }`}
        </Script>
      </body>
    </html>
  )
}
