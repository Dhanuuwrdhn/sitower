'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
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
      setError(err.response?.data?.message || 'Login gagal. Periksa NIK/NIP/NRP dan password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      {/* Background image */}
      <div className="login-panel-left">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/login-bg.jpg" alt="Tower transmisi PLN" className="login-bg-img" />
        <div className="login-overlay" />
      </div>

      {/* Form panel */}
      <div className="login-panel-right">
        <form onSubmit={handleSubmit} className="login-form-wrapper">
          {/* Logo */}
          <div className="login-logo">
            <h1 className="login-logo-title">⚡SPEKTRA</h1>
            <p className="login-logo-subtitle">Sistem Pemantauan Kabel dan Tower Transmisi</p>
          </div>

          {/* Fields */}
          <div className="login-fields">
            <div className="login-field-group">
              <label className="login-label" htmlFor="login-nik">NIK/NPWP/NIP</label>
              <div className="login-input-container">
                <input
                  id="login-nik"
                  type="text"
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  placeholder="Masukkan NIK/NPWP/NIP"
                  required
                  className="login-input"
                />
              </div>
            </div>

            <div className="login-field-group">
              <label className="login-label" htmlFor="login-password">Password</label>
              <div className="login-input-container login-input-container--with-icon">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="login-input login-input--password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="login-eye-btn"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="login-error">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
          </div>

          {/* Button — Figma: 328×44 fill=#076c9e "Masuk" 14px/600 */}
          <button
            type="submit"
            disabled={loading || !nik || !password}
            className="login-submit-btn"
          >
            {loading ? (
              <>
                <span className="login-spinner" />
                Memverifikasi...
              </>
            ) : 'Masuk'}
          </button>
        </form>

        {/* Powered by Born2Works — mobile only */}
        <p className="login-powered">
          Powered by <strong>Born2Works</strong>
        </p>
      </div>

      {/* Footer bar — Figma: Menu - Current 430×40 */}
      <div className="login-footer-bar">
        <span>© 2026. PT PLN (Persero).</span>
      </div>
    </div>
  )
}
