'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { 
  Shield, 
  Zap, 
  QrCode, 
  FileCheck, 
  Building2, 
  ArrowRight,
  Globe,
  Heart,
  Lock,
  Smartphone,
  CheckCircle2,
  Star,
  Activity
} from 'lucide-react'

// Animated stars background
function StarField() {
  const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number; opacity: number; delay: number }[]>([])
  
  useEffect(() => {
    const newStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      delay: Math.random() * 5,
    }))
    setStars(newStars)
  }, [])
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

// Floating gradient orbs
function GradientOrbs() {
  return (
    <>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-float-slower" />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-float" />
    </>
  )
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0d0d15] to-[#0a0a0f]">
        <StarField />
        <GradientOrbs />
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>
      
      {/* Navigation */}
      <nav className={`relative z-50 px-6 py-4 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-6 py-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">ATLAS</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">How it Works</a>
              <a href="#demo" className="text-sm text-gray-400 hover:text-white transition-colors">Demo</a>
            </div>
            
            <div className="flex items-center gap-3">
              <Link href="/status" className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block">
                Status
              </Link>
              <Link 
                href="/login" 
                className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-blue-600 rounded-xl text-sm font-medium hover:from-violet-500 hover:to-blue-500 transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5"
              >
                Try Now <ArrowRight className="w-4 h-4 inline ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <main className="relative z-10 px-6 pt-20 pb-32">
        <div className="max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-8 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="flex items-center gap-1.5 text-sm text-gray-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Patient-owned
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-sm text-gray-300">Privacy-first</span>
            <span className="text-gray-600">•</span>
            <span className="text-sm text-gray-300">Globally portable</span>
          </div>
          
          {/* Main Headline */}
          <h1 className={`text-5xl md:text-7xl font-bold leading-tight mb-6 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="text-white">Your Health Identity,</span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Anywhere in the World
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className={`text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed transition-all duration-1000 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            The missing identity, consent, and verification layer for global healthcare —
            <br className="hidden md:block" />
            own your records, share them securely, access them in emergencies.
          </p>
          
          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Link 
              href="/login" 
              className="group px-8 py-4 bg-gradient-to-r from-violet-600 to-blue-600 rounded-2xl text-lg font-semibold hover:from-violet-500 hover:to-blue-500 transition-all shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-1 flex items-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/emergency" 
              className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-lg font-semibold hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <QrCode className="w-5 h-5" />
              Emergency Access Demo
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className={`flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 transition-all duration-1000 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-500" />
              End-to-end encrypted
            </span>
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              Works in 190+ countries
            </span>
            <span className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-violet-500" />
              No app download required
            </span>
          </div>
        </div>
        
        {/* Feature Cards */}
        <div id="features" className="max-w-7xl mx-auto mt-32">
          <div className={`text-center mb-16 transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for the Future of Healthcare</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Everything you need to manage your health identity across borders</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Patient-Owned Records',
                description: 'You control your health data. Granular permissions, time-limited sharing, instant revocation.',
                color: 'from-violet-500 to-purple-500',
                delay: 800,
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'Emergency Access',
                description: 'QR code + emergency code access for first responders. Critical data in seconds.',
                color: 'from-amber-500 to-orange-500',
                delay: 900,
              },
              {
                icon: <FileCheck className="w-6 h-6" />,
                title: 'Clinician Verified',
                description: 'Healthcare providers can verify and digitally sign your records for credibility.',
                color: 'from-emerald-500 to-teal-500',
                delay: 1000,
              },
              {
                icon: <Building2 className="w-6 h-6" />,
                title: 'Medical Tourism Ready',
                description: 'Seamless intake forms and record sharing for international healthcare.',
                color: 'from-blue-500 to-cyan-500',
                delay: 1100,
              },
            ].map((feature, i) => (
              <div 
                key={i}
                className={`group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${feature.delay}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* How It Works */}
        <div id="how-it-works" className="max-w-7xl mx-auto mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Get started in minutes, protected for life</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Your Profile', desc: 'Sign up and add your basic health information, allergies, and emergency contacts.' },
              { step: '02', title: 'Get Verified', desc: 'Visit a healthcare provider to have your records verified and digitally signed.' },
              { step: '03', title: 'Share Anywhere', desc: 'Use your Atlas Card QR code for emergency access or generate secure sharing links.' },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur" />
                <div className="relative p-8 bg-[#12121a] rounded-2xl border border-white/10 h-full">
                  <span className="text-5xl font-bold text-white/10">{item.step}</span>
                  <h3 className="text-xl font-semibold mt-4 mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Demo Section */}
        <div id="demo" className="max-w-4xl mx-auto mt-32">
          <div className="p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/10">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Try the Demo</h2>
              <p className="text-gray-400">Experience ATLAS with our pre-configured demo accounts</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { role: 'Patient', email: 'patient@demo.atlas', icon: <Heart className="w-5 h-5" />, color: 'from-rose-500 to-pink-500' },
                { role: 'Clinician', email: 'clinician@demo.atlas', icon: <Activity className="w-5 h-5" />, color: 'from-emerald-500 to-teal-500' },
                { role: 'Clinic', email: 'clinic@demo.atlas', icon: <Building2 className="w-5 h-5" />, color: 'from-violet-500 to-purple-500' },
                { role: 'Insurer', email: 'insurer@demo.atlas', icon: <Shield className="w-5 h-5" />, color: 'from-amber-500 to-orange-500' },
              ].map((account, i) => (
                <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${account.color} flex items-center justify-center mb-3`}>
                    {account.icon}
                  </div>
                  <p className="font-semibold">{account.role}</p>
                  <p className="text-xs text-gray-500 mt-1">{account.email}</p>
                  <p className="text-xs text-gray-600">Password: demo123</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Link 
                href="/login" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 rounded-xl font-medium hover:from-violet-500 hover:to-blue-500 transition-all shadow-lg shadow-violet-500/25"
              >
                Start Exploring <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">ATLAS Health Identity</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/status" className="hover:text-white transition-colors">System Status</Link>
            <Link href="/emergency" className="hover:text-white transition-colors">Emergency Access</Link>
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
      
      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(0) translateX(20px); }
          75% { transform: translateY(20px) translateX(10px); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-30px) translateX(-20px); }
        }
        
        @keyframes float-slower {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(40px) translateX(30px); }
        }
        
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }
        
        .animate-float-slower {
          animation: float-slower 15s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
