'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight, AlertCircle, Loader2, Heart, Building2, Activity, BadgeCheck, Shield } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed')
        setLoading(false)
        return
      }

      switch (data.role) {
        case 'PATIENT':
          router.push('/patient/dashboard')
          break
        case 'CLINICIAN':
          router.push('/clinician/dashboard')
          break
        case 'INSURER':
          router.push('/insurer/dashboard')
          break
        case 'CLINIC_ADMIN':
        case 'CLINIC_STAFF':
          router.push('/clinic/dashboard')
          break
        default:
          router.push('/')
      }
    } catch {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  function quickLogin(demoEmail: string) {
    setEmail(demoEmail)
    setPassword('demo123')
  }

  return (
    <div className="min-h-screen bg-[#0f0a2e] flex">
      {/* Left Side — Branding with health/ID visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Radial glows matching landing page */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-violet-600/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px]" />
        </div>

        {/* Globe wireframe — subtle background */}
        <div className="absolute bottom-0 right-0 w-[700px] h-[700px] translate-x-[15%] translate-y-[20%] pointer-events-none opacity-[0.06]">
          <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="200" cy="200" r="180" fill="none" stroke="white" strokeWidth="0.5" />
            <ellipse cx="200" cy="200" rx="120" ry="180" fill="none" stroke="white" strokeWidth="0.3" />
            <ellipse cx="200" cy="200" rx="60" ry="180" fill="none" stroke="white" strokeWidth="0.3" />
            <ellipse cx="200" cy="200" rx="180" ry="60" fill="none" stroke="white" strokeWidth="0.3" />
            <ellipse cx="200" cy="200" rx="180" ry="120" fill="none" stroke="white" strokeWidth="0.3" />
            <line x1="20" y1="200" x2="380" y2="200" stroke="white" strokeWidth="0.3" />
            <line x1="200" y1="20" x2="200" y2="380" stroke="white" strokeWidth="0.3" />
          </svg>
        </div>

        {/* Health ID card — floating */}
        <div className="absolute top-[15%] right-[10%] pointer-events-none opacity-[0.07] rotate-[6deg]">
          <svg width="220" height="140" viewBox="0 0 220 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="218" height="138" rx="12" stroke="white" strokeWidth="1" />
            <rect x="18" y="22" width="28" height="22" rx="3" stroke="white" strokeWidth="0.7" />
            <line x1="18" y1="33" x2="46" y2="33" stroke="white" strokeWidth="0.4" />
            <line x1="32" y1="22" x2="32" y2="44" stroke="white" strokeWidth="0.4" />
            <rect x="182" y="18" width="6" height="20" rx="1" fill="white" opacity="0.5" />
            <rect x="175" y="25" width="20" height="6" rx="1" fill="white" opacity="0.5" />
            <rect x="18" y="58" width="40" height="50" rx="5" stroke="white" strokeWidth="0.7" />
            <circle cx="38" cy="74" r="8" stroke="white" strokeWidth="0.5" />
            <rect x="70" y="60" width="80" height="3.5" rx="1.5" fill="white" opacity="0.4" />
            <rect x="70" y="72" width="56" height="2.5" rx="1" fill="white" opacity="0.25" />
            <rect x="70" y="84" width="68" height="2.5" rx="1" fill="white" opacity="0.25" />
            <rect x="168" y="80" width="32" height="32" rx="3" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>

        {/* ECG line */}
        <div className="absolute top-[58%] left-0 w-full pointer-events-none opacity-[0.05]">
          <svg width="100%" height="40" viewBox="0 0 800 40" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 20 L150 20 L165 20 L172 6 L180 34 L188 3 L196 37 L204 18 L210 20 L400 20 L500 20 L512 6 L520 34 L528 3 L536 37 L544 18 L550 20 L800 20"
              fill="none"
              stroke="rgba(139,92,246,0.5)"
              strokeWidth="1.2"
              className="animate-dash"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16">
          <Link href="/" className="flex items-center gap-3 mb-12 group">
            <img src="/atlas-logo.png" alt="ATLAS" className="w-12 h-12 flex-shrink-0 group-hover:scale-105 transition-transform" />
            <span className="text-2xl font-bold text-white tracking-tight">ATLAS</span>
          </Link>

          <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
            Your Health Identity,
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Anywhere in the World
            </span>
          </h1>

          <p className="text-lg text-gray-400 mb-10 max-w-md leading-relaxed">
            Access your verified medical records anywhere. Share securely with clinics across borders.
          </p>

          <div className="space-y-4">
            {[
              'Patient-owned health records',
              'AI-powered intake interviews',
              'Clinician-verified data',
              'Emergency QR code access',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-gray-300">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side — Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        {/* Subtle glow on form side */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className={`relative z-10 w-full max-w-md transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Mobile Logo */}
          <Link href="/" className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <img src="/atlas-logo.png" alt="ATLAS" className="w-10 h-10 flex-shrink-0" />
            <span className="text-xl font-bold text-white tracking-tight">ATLAS</span>
          </Link>

          {/* Login Card */}
          <div className="bg-white/[0.04] backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
              <p className="text-gray-400">Sign in to access your health identity</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-center gap-2 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-xl text-white font-semibold hover:from-violet-400 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                  Create one
                </Link>
              </p>
            </div>
          </div>

          {/* Quick Demo Access */}
          <div className="mt-6 p-6 bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/10">
            <p className="text-sm text-gray-400 text-center mb-4">Quick Demo Access</p>
            <p className="text-xs text-gray-500 text-center mb-4">
              Password: <code className="px-1.5 py-0.5 bg-white/10 rounded text-violet-300 font-mono">demo123</code>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { role: 'Patient', email: 'patient@demo.atlas', icon: <Heart className="w-4 h-4" />, color: 'bg-violet-500/10 border-violet-500/20 text-violet-400' },
                { role: 'Clinician', email: 'clinician@demo.atlas', icon: <Activity className="w-4 h-4" />, color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' },
                { role: 'Clinic', email: 'clinic@demo.atlas', icon: <Building2 className="w-4 h-4" />, color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' },
                { role: 'Insurer', email: 'insurer@demo.atlas', icon: <Shield className="w-4 h-4" />, color: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
              ].map((account) => (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => quickLogin(account.email)}
                  className="flex flex-col items-center gap-2 p-3 bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 rounded-xl transition-all group"
                >
                  <div className={`w-10 h-10 rounded-xl ${account.color} border flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    {account.icon}
                  </div>
                  <span className="text-xs text-gray-300 font-medium">{account.role}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Emergency Access */}
          <div className="mt-4 text-center">
            <Link href="/emergency" className="text-sm text-gray-500 hover:text-violet-400 transition-colors">
              Emergency Access →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
