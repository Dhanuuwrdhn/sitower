import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sidebar: {
          bg: '#076C9E',
          active: 'rgba(255,255,255,0.18)',
          hover: 'rgba(255,255,255,0.1)',
          text: '#FFFFFF',
          muted: 'rgba(255,255,255,0.8)',
          border: 'rgba(255,255,255,0.1)',
        },
        brand: {
          primary: '#2563eb',
          gold: '#f59e0b',
        },
        app: {
          bg: '#F6F9FC',
          card: '#ffffff',
          border: '#e8edf2',
          text: '#1a202c',
          muted: '#4a5568',
          subtle: '#94a3b8',
        },
        status: {
          berlangsung: '#ef4444',
          'berlangsung-bg': '#fef2f2',
          'berlangsung-border': '#fecaca',
          ditangani: '#d97706',
          'ditangani-bg': '#fffbeb',
          'ditangani-border': '#fde68a',
          menunggu: '#64748b',
          'menunggu-bg': '#f8fafc',
          'menunggu-border': '#e2e8f0',
          pemantauan: '#2563eb',
          'pemantauan-bg': '#eff6ff',
          'pemantauan-border': '#bfdbfe',
          eskalasi: '#7c3aed',
          'eskalasi-bg': '#faf5ff',
          'eskalasi-border': '#ddd6fe',
          selesai: '#16a34a',
          'selesai-bg': '#f0fdf4',
          'selesai-border': '#bbf7d0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        orbitron: ['Orbitron', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        dropdown: '0 4px 16px rgba(0,0,0,0.12)',
        popup: '0 8px 32px rgba(0,0,0,0.16)',
      },
    },
  },
  plugins: [],
}
export default config
