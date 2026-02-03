'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield, Eye, EyeOff, ArrowRight, AlertCircle, Loader2, Heart, Building2, Activity, User } from 'lucide-react'

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

      // Redirect based on role
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
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">ATLAS</span>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
            Your Health Identity,
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              Secured & Portable
            </span>
          </h1>
          
          <p className="text-lg text-gray-400 mb-8 max-w-md">
            Access your medical records anywhere in the world. Share securely with healthcare providers.
          </p>
          
          <div className="space-y-4">
            {[
              'Patient-owned health records',
              'Emergency QR code access',
              'Clinician verification',
              'Global healthcare portability',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-gray-300">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
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
      
      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className={`w-full max-w-md transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">ATLAS</span>
          </div>
          
          {/* Login Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
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
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
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
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-blue-600 rounded-xl text-white font-semibold hover:from-violet-500 hover:to-blue-500 transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                Don't have an account?{' '}
                <Link href="/" className="text-violet-400 hover:text-violet-300 font-medium">
                  Create one
                </Link>
              </p>
            </div>
          </div>
          
          {/* Quick Demo Access */}
          <div className="mt-6 p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            <p className="text-sm text-gray-400 text-center mb-4">Quick Demo Access</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { role: 'Patient', email: 'patient@demo.atlas', icon: <Heart className="w-4 h-4" />, color: 'from-rose-500 to-pink-500' },
                { role: 'Clinician', email: 'clinician@demo.atlas', icon: <Activity className="w-4 h-4" />, color: 'from-emerald-500 to-teal-500' },
                { role: 'Insurer', email: 'insurer@demo.atlas', icon: <Shield className="w-4 h-4" />, color: 'from-amber-500 to-orange-500' },
                { role: 'Clinic', email: 'clinic@demo.atlas', icon: <Building2 className="w-4 h-4" />, color: 'from-violet-500 to-purple-500' },
              ].map((account) => (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => quickLogin(account.email)}
                  className="flex items-center gap-2 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-left group"
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${account.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    {account.icon}
                  </div>
                  <span className="text-sm text-gray-300 font-medium">{account.role}</span>
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
