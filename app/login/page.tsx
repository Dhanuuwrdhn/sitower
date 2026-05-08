'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { authApi } from '@/lib/api'
import { saveAuth } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [nik, setNik]               = useState('')
  const [password, setPassword]     = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authApi.login(nik, password)
      saveAuth(res.data.access_token, res.data.pegawai)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login gagal. Periksa NIK dan password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-app-bg">
      {/* Left panel — branding */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 p-10"
        style={{ background: 'linear-gradient(180deg, #1a3a5c 0%, #0d2137 100%)' }}
      >
        {/* Logo */}
        <div>
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-amber-400" fill="currentColor" />
            </div>
            <span className="text-xl font-bold text-white tracking-wide">SPEKTRA</span>
          </div>
          <h2 className="text-2xl font-bold text-white leading-snug mb-3">
            Sistem Pemantauan<br />Kerawanan Transmisi
          </h2>
          <p className="text-[14px] text-white/60 leading-relaxed">
            Platform terpadu untuk pemantauan kondisi tower transmisi, pelaporan gangguan, dan pengelolaan aset jaringan.
          </p>
        </div>

        {/* Features list */}
        <div className="space-y-3">
          {[
            'Pemantauan real-time kondisi tower',
            'Laporan gangguan & inspeksi CUI',
            'Peta jalur transmisi interaktif',
            'Manajemen sertifikat & as-built drawing',
          ].map((f) => (
            <div key={f} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-500/30 flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              </div>
              <span className="text-[13px] text-white/70">{f}</span>
            </div>
          ))}
          <p className="text-[11px] text-white/30 pt-4">© 2025 SPEKTRA</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-8 lg:hidden">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" fill="currentColor" />
          </div>
          <span className="text-xl font-bold text-app-text">SPEKTRA</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-7">
            <h1 className="text-[22px] font-bold text-app-text mb-1">Masuk ke SPEKTRA</h1>
            <p className="text-[13px] text-app-muted">Gunakan NIK dan password akun Anda</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[12px] font-semibold text-app-text mb-1.5">
                NIK Pegawai
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={16}
                value={nik}
                onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))}
                placeholder="16 digit NIK"
                required
                className="form-input font-mono tracking-widest"
                style={{ height: 44 }}
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-app-text mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="form-input pr-10"
                  style={{ height: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-app-subtle hover:text-app-muted transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-[12px] text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || nik.length < 16}
              className="w-full h-11 rounded-xl bg-blue-600 text-white text-[13px] font-semibold
                         hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memverifikasi...
                </>
              ) : 'Masuk'}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-8 p-4 rounded-xl bg-white border border-app-border">
            <p className="text-[11px] font-bold text-app-muted uppercase tracking-wider mb-3">Akun Demo</p>
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-app-border">
                  <th className="text-left pb-2 text-[11px] font-semibold text-app-muted">NIK</th>
                  <th className="text-left pb-2 text-[11px] font-semibold text-app-muted">Password</th>
                  <th className="text-left pb-2 text-[11px] font-semibold text-app-muted">Role</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                <tr className="border-b border-app-border/50">
                  <td className="py-2 text-[11px] text-app-text">1234567890123456</td>
                  <td className="py-2 text-app-text">admin123</td>
                  <td className="py-2">
                    <span className="px-2 py-0.5 bg-[#fffbeb] text-[#b45309] border border-[#fde68a] rounded-full text-[10px] font-sans font-bold">
                      Admin
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-[11px] text-app-text">9876543210987654</td>
                  <td className="py-2 text-app-text">teknisi123</td>
                  <td className="py-2">
                    <span className="px-2 py-0.5 bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe] rounded-full text-[10px] font-sans font-bold">
                      Teknisi
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
