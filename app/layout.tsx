import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
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
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
