'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import {
  Shield,
  ArrowRight,
  FileText,
  Mic,
  CheckCircle,
  Building2,
  User,
  Lock,
  BadgeCheck,
  Siren,
  BarChart3,
  ClipboardList,
  Globe,
  Menu,
  X,
} from 'lucide-react'

// Medical tourism hub positions — shifted to bottom-right so text doesn't cover them
const HUBS = [
  { name: 'Miami', x: 30, y: 65 },
  { name: 'Istanbul', x: 58, y: 55 },
  { name: 'Dubai', x: 68, y: 68 },
  { name: 'Bangkok', x: 78, y: 75 },
  { name: 'Seoul', x: 86, y: 58 },
]

// Curved arc connections between hubs
function FlightArcs() {
  // Generate curved path between two points
  const arc = (x1: number, y1: number, x2: number, y2: number) => {
    const mx = (x1 + x2) / 2
    const my = Math.min(y1, y2) - 12 - Math.abs(x2 - x1) * 0.15 // Arc height
    return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`
  }

  const connections = [
    [0, 1], [1, 2], [2, 3], [3, 4], [0, 3], [1, 3],
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="arc-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(139,92,246,0.08)" />
            <stop offset="50%" stopColor="rgba(139,92,246,0.25)" />
            <stop offset="100%" stopColor="rgba(139,92,246,0.08)" />
          </linearGradient>
        </defs>
        {connections.map(([from, to], i) => (
          <path
            key={i}
            d={arc(HUBS[from].x, HUBS[from].y, HUBS[to].x, HUBS[to].y)}
            fill="none"
            stroke="url(#arc-grad)"
            strokeWidth="0.15"
            className="animate-dash"
          />
        ))}
      </svg>

      {/* Hub dots */}
      {HUBS.map((hub, i) => (
        <div
          key={i}
          className="absolute"
          style={{ left: `${hub.x}%`, top: `${hub.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div className="absolute inset-0 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-400/20 animate-ping-slow" />
          <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_6px_2px_rgba(139,92,246,0.4)]" />
          <span className="absolute top-2.5 left-1/2 -translate-x-1/2 text-[9px] text-violet-300/50 font-medium whitespace-nowrap">
            {hub.name}
          </span>
        </div>
      ))}
    </div>
  )
}

// Globe wireframe — positioned bottom-right, not behind text
function GlobeWireframe() {
  return (
    <div className="absolute bottom-0 right-0 w-[800px] h-[800px] md:w-[1100px] md:h-[1100px] translate-x-[10%] translate-y-[25%] pointer-events-none opacity-[0.08]" aria-hidden="true">
      <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Main circle */}
        <circle cx="200" cy="200" r="180" fill="none" stroke="white" strokeWidth="0.5" />
        {/* Meridian lines */}
        <ellipse cx="200" cy="200" rx="180" ry="180" fill="none" stroke="white" strokeWidth="0.3" />
        <ellipse cx="200" cy="200" rx="120" ry="180" fill="none" stroke="white" strokeWidth="0.3" />
        <ellipse cx="200" cy="200" rx="60" ry="180" fill="none" stroke="white" strokeWidth="0.3" />
        <ellipse cx="200" cy="200" rx="30" ry="180" fill="none" stroke="white" strokeWidth="0.2" />
        {/* Latitude lines */}
        <ellipse cx="200" cy="200" rx="180" ry="60" fill="none" stroke="white" strokeWidth="0.3" />
        <ellipse cx="200" cy="200" rx="180" ry="120" fill="none" stroke="white" strokeWidth="0.3" />
        <ellipse cx="200" cy="200" rx="180" ry="30" fill="none" stroke="white" strokeWidth="0.2" />
        <line x1="20" y1="200" x2="380" y2="200" stroke="white" strokeWidth="0.3" />
        <line x1="200" y1="20" x2="200" y2="380" stroke="white" strokeWidth="0.3" />
        {/* Continent hints — abstract dots */}
        {[
          [140, 140], [150, 145], [155, 135], [160, 150], // Europe
          [180, 160], [185, 170], [175, 175], // Middle East
          [220, 180], [230, 185], [225, 175], // South Asia
          [250, 170], [260, 175], [255, 165], // SE Asia
          [280, 155], [285, 160], // East Asia
          [100, 170], [95, 175], [110, 180], [105, 165], // Africa
          [80, 140], [75, 145], [85, 135], // Americas hint
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="1.5" fill="white" opacity="0.4" />
        ))}
      </svg>
    </div>
  )
}

// Floating Health ID card — top-left area
function HealthIDCard() {
  return (
    <div className="absolute top-[18%] left-[6%] md:left-[8%] pointer-events-none opacity-[0.07] rotate-[-8deg]" aria-hidden="true">
      <svg width="280" height="175" viewBox="0 0 280 175" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Card body */}
        <rect x="1" y="1" width="278" height="173" rx="16" stroke="white" strokeWidth="1" />
        {/* Chip */}
        <rect x="24" y="28" width="36" height="28" rx="4" stroke="white" strokeWidth="0.8" />
        <line x1="24" y1="42" x2="60" y2="42" stroke="white" strokeWidth="0.5" />
        <line x1="42" y1="28" x2="42" y2="56" stroke="white" strokeWidth="0.5" />
        {/* Medical cross */}
        <rect x="230" y="24" width="8" height="24" rx="1.5" fill="white" opacity="0.6" />
        <rect x="222" y="32" width="24" height="8" rx="1.5" fill="white" opacity="0.6" />
        {/* Photo placeholder */}
        <rect x="24" y="72" width="52" height="64" rx="6" stroke="white" strokeWidth="0.8" />
        <circle cx="50" cy="92" r="10" stroke="white" strokeWidth="0.6" />
        <path d="M34 128 Q50 116 66 128" stroke="white" strokeWidth="0.6" fill="none" />
        {/* Text lines */}
        <rect x="90" y="76" width="100" height="4" rx="2" fill="white" opacity="0.5" />
        <rect x="90" y="90" width="72" height="3" rx="1.5" fill="white" opacity="0.3" />
        <rect x="90" y="104" width="88" height="3" rx="1.5" fill="white" opacity="0.3" />
        <rect x="90" y="118" width="60" height="3" rx="1.5" fill="white" opacity="0.3" />
        {/* QR code hint */}
        <rect x="210" y="100" width="42" height="42" rx="4" stroke="white" strokeWidth="0.6" />
        <rect x="216" y="106" width="10" height="10" rx="1" fill="white" opacity="0.4" />
        <rect x="230" y="106" width="10" height="10" rx="1" fill="white" opacity="0.4" />
        <rect x="216" y="120" width="10" height="10" rx="1" fill="white" opacity="0.4" />
        <rect x="232" y="122" width="6" height="6" rx="0.5" fill="white" opacity="0.3" />
        {/* Verified badge */}
        <circle cx="254" cy="78" r="12" stroke="white" strokeWidth="0.8" />
        <path d="M248 78 L252 82 L260 74" stroke="white" strokeWidth="1" fill="none" />
      </svg>
    </div>
  )
}

// ECG heartbeat line — runs across hero
function HeartbeatLine() {
  return (
    <div className="absolute top-[55%] left-0 w-full pointer-events-none opacity-[0.06]" aria-hidden="true">
      <svg width="100%" height="60" viewBox="0 0 1400 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0 30 L200 30 L220 30 L230 30 L240 10 L250 50 L260 5 L270 55 L280 25 L290 30 L400 30 L600 30 L620 30 L630 30 L640 12 L650 48 L660 5 L670 55 L680 28 L690 30 L900 30 L1000 30 L1010 30 L1020 12 L1030 48 L1040 5 L1050 55 L1060 28 L1070 30 L1200 30 L1400 30"
          fill="none"
          stroke="rgba(139,92,246,0.5)"
          strokeWidth="1.5"
          className="animate-dash"
        />
      </svg>
    </div>
  )
}

// DNA helix hint — right side
function DNAHelix() {
  return (
    <div className="absolute top-[10%] right-[4%] md:right-[6%] pointer-events-none opacity-[0.05]" aria-hidden="true">
      <svg width="40" height="320" viewBox="0 0 40 320" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Double helix strands */}
        <path d="M5 0 Q35 40 5 80 Q35 120 5 160 Q35 200 5 240 Q35 280 5 320" stroke="white" strokeWidth="1" fill="none" />
        <path d="M35 0 Q5 40 35 80 Q5 120 35 160 Q5 200 35 240 Q5 280 35 320" stroke="white" strokeWidth="1" fill="none" />
        {/* Cross-links */}
        {[20, 60, 100, 140, 180, 220, 260, 300].map((y, i) => (
          <line key={i} x1="10" y1={y} x2="30" y2={y} stroke="white" strokeWidth="0.5" opacity="0.6" />
        ))}
      </svg>
    </div>
  )
}

// Intersection observer hook for scroll animations
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(el)
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, inView }
}

// Animated counter
function CountUp({ target, suffix = '' }: { target: string; suffix?: string }) {
  const { ref, inView } = useInView(0.3)
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (!inView) return
    const numericPart = parseFloat(target)
    const isDecimal = target.includes('.')
    const duration = 1500
    const steps = 40
    const stepTime = duration / steps

    let current = 0
    const timer = setInterval(() => {
      current++
      const progress = current / steps
      const eased = 1 - Math.pow(1 - progress, 3)
      const val = numericPart * eased
      setDisplay(isDecimal ? val.toFixed(1) : Math.round(val).toString())
      if (current >= steps) clearInterval(timer)
    }, stepTime)

    return () => clearInterval(timer)
  }, [inView, target])

  return (
    <span ref={ref}>
      {display}{suffix}
    </span>
  )
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Section refs for scroll animation
  const howItWorks = useInView()
  const forWho = useInView()
  const features = useInView()
  const numbers = useInView()
  const demo = useInView()

  return (
    <div className="min-h-screen bg-[#0f0a2e] text-white overflow-x-hidden">
      {/* ============================================ */}
      {/* SECTION 1: HERO                             */}
      {/* ============================================ */}
      <section className="relative bg-[#0f0a2e] text-white overflow-hidden">
        {/* Globe wireframe — bottom-right, enlarged */}
        <GlobeWireframe />

        {/* Flight arc connections */}
        <FlightArcs />

        {/* Health ID card — top-left floating */}
        <HealthIDCard />

        {/* DNA helix — right side */}
        <DNAHelix />

        {/* ECG heartbeat line — across hero */}
        <HeartbeatLine />

        {/* Subtle radial glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-violet-600/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-2/3 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Navigation */}
        <nav className={`relative z-50 px-6 py-4 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between px-6 py-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-700 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight">ATLAS</span>
              </div>

              {/* Desktop nav */}
              <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
                <a href="#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">How it Works</a>
                <a href="#demo" className="text-sm text-gray-400 hover:text-white transition-colors">Demo</a>
                <Link href="/status" className="text-sm text-gray-400 hover:text-white transition-colors">Status</Link>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="hidden sm:flex px-5 py-2.5 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-xl text-sm font-medium hover:from-violet-400 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 items-center gap-1"
                >
                  Try Now <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {mobileMenuOpen && (
              <div className="md:hidden mt-2 px-6 py-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 space-y-3">
                <a href="#features" className="block text-sm text-gray-300 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Features</a>
                <a href="#how-it-works" className="block text-sm text-gray-300 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>How it Works</a>
                <a href="#demo" className="block text-sm text-gray-300 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Demo</a>
                <Link href="/status" className="block text-sm text-gray-300 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Status</Link>
                <Link
                  href="/login"
                  className="block text-center px-5 py-2.5 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-xl text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Try Now
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 px-6 pt-20 pb-32">
          <div className="max-w-7xl mx-auto text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-8 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <span className="flex items-center gap-1.5 text-sm text-gray-300">
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                Patient-owned
              </span>
              <span className="text-gray-600">&bull;</span>
              <span className="text-sm text-gray-300">Privacy-first</span>
              <span className="text-gray-600">&bull;</span>
              <span className="text-sm text-gray-300">Globally portable</span>
            </div>

            <h1 className={`text-5xl md:text-7xl font-bold leading-tight mb-6 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <span className="text-white">Your Health Identity,</span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Anywhere in the World
              </span>
            </h1>

            <p className={`text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed transition-all duration-700 delay-[400ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              The intake automation and health verification engine for medical tourism clinics.
              <br className="hidden md:block" />
              Patients arrive prepared. Clinics save hours.
            </p>

            <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Link
                href="/login"
                className="group px-8 py-4 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-2xl text-lg font-semibold hover:from-violet-400 hover:to-indigo-500 transition-all shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-1 flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-lg font-semibold hover:bg-white/10 transition-all flex items-center gap-2"
              >
                Watch Demo
              </button>
            </div>

            <div className={`flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 transition-all duration-700 delay-[600ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-violet-400" />
                HIPAA-ready
              </span>
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-violet-400" />
                Works in 190+ countries
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-violet-400" />
                No app download required
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 2: HOW IT WORKS                     */}
      {/* ============================================ */}
      <section id="how-it-works" className="relative bg-[#13102a] py-24 px-6">
        <div
          ref={howItWorks.ref}
          className={`max-w-7xl mx-auto transition-all duration-700 ${howItWorks.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              From booking to clinic visit — three steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="relative text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7 text-violet-400" />
              </div>
              <div className="absolute top-0 right-0 md:right-auto md:top-2 md:left-2 text-6xl font-bold text-white/[0.15] select-none pointer-events-none">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Build Your Health Profile</h3>
              <p className="text-gray-400 leading-relaxed">
                Upload your medical records, prescriptions, and lab results. AI extracts your data automatically. Get verified by a licensed clinician.
              </p>
            </div>

            <div className="relative text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mic className="w-7 h-7 text-indigo-400" />
              </div>
              <div className="absolute top-0 right-0 md:right-auto md:top-2 md:left-2 text-6xl font-bold text-white/[0.15] select-none pointer-events-none">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">AI Intake Interview</h3>
              <p className="text-gray-400 leading-relaxed">
                Before your visit, our voice AI reviews your medical history in a 15-minute guided interview. Your file is compiled and ready to send.
              </p>
            </div>

            <div className="relative text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle className="w-7 h-7 text-emerald-400" />
              </div>
              <div className="absolute top-0 right-0 md:right-auto md:top-2 md:left-2 text-6xl font-bold text-white/[0.15] select-none pointer-events-none">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Arrive Prepared</h3>
              <p className="text-gray-400 leading-relaxed">
                Your clinic has your verified records before you walk in. No clipboards. No waiting. No repeating your history.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-violet-500/10 border border-violet-500/20 rounded-full">
              <span className="text-sm font-semibold text-violet-300">Average intake time: 42 minutes</span>
              <span className="text-sm text-violet-400/70">(down from 2.5 hours)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 3: FOR CLINICS / FOR PATIENTS       */}
      {/* ============================================ */}
      <section className="bg-[#151230] py-24 px-6">
        <div
          ref={forWho.ref}
          className={`max-w-7xl mx-auto transition-all duration-700 ${forWho.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-8 lg:p-10 hover:bg-white/[0.05] hover:border-white/15 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">For Clinics</h3>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  'Cut patient intake from 2.5 hours to 30 minutes',
                  'AI-powered document extraction',
                  'No-code intake form builder',
                  'Patient pipeline management (Kanban)',
                  'Clinician verification queue',
                  'Revenue and operations analytics',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-violet-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-500 transition-colors"
              >
                Explore Clinic Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-8 lg:p-10 hover:bg-white/[0.05] hover:border-white/15 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">For Patients</h3>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  'Own and control your health records',
                  'Verified data signed by real doctors',
                  'AI intake interview before your visit',
                  'Share securely with time-limited consent',
                  'Emergency QR code access worldwide',
                  'Full audit trail — see who accessed your data',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-500 transition-colors"
              >
                Create Free Account <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 4: KEY FEATURES                     */}
      {/* ============================================ */}
      <section id="features" className="bg-[#13102a] py-24 px-6">
        <div
          ref={features.ref}
          className={`max-w-7xl mx-auto transition-all duration-700 ${features.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Everything you need for cross-border care
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Mic className="w-6 h-6" />,
                title: 'AI Intake Interview',
                desc: 'Voice AI prepares patients before their visit. Reviews history, flags changes, compiles a pre-visit file.',
                color: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
              },
              {
                icon: <ClipboardList className="w-6 h-6" />,
                title: 'Smart Intake Forms',
                desc: 'No-code form builder for any procedure type. Patients fill out before they arrive.',
                color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
              },
              {
                icon: <BadgeCheck className="w-6 h-6" />,
                title: 'Clinician Verification',
                desc: 'Licensed doctors verify and sign off on patient data. Verified records are locked and trusted.',
                color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
              },
              {
                icon: <Lock className="w-6 h-6" />,
                title: 'Privacy & Consent',
                desc: 'Granular sharing controls. Time-limited consent links. Full audit trail. Patient always in control.',
                color: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
              },
              {
                icon: <Siren className="w-6 h-6" />,
                title: 'Emergency Access',
                desc: 'QR code gives first responders instant access to critical allergies, medications, and contacts.',
                color: 'bg-red-500/10 border-red-500/20 text-red-400',
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: 'Clinic Analytics',
                desc: 'Track intake speed, completion rates, verification metrics, and patient satisfaction.',
                color: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-6 bg-white/[0.03] rounded-2xl border border-white/10 hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.color} border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 5: THE NUMBERS                      */}
      {/* ============================================ */}
      <section className="bg-[#151230] py-24 px-6">
        <div
          ref={numbers.ref}
          className={`max-w-5xl mx-auto transition-all duration-700 ${numbers.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl md:text-6xl font-bold text-violet-400 mb-2">
                <CountUp target="42" suffix=" min" />
              </div>
              <p className="text-gray-400">Average intake time (was 2.5 hours)</p>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold text-violet-400 mb-2">
                <CountUp target="94" suffix="%" />
              </div>
              <p className="text-gray-400">Intake completion rate</p>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold text-violet-400 mb-2">
                <CountUp target="4.7" suffix="/5" />
              </div>
              <p className="text-gray-400">Patient satisfaction score</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 6: DEMO ACCOUNTS                    */}
      {/* ============================================ */}
      <section id="demo" className="bg-[#13102a] py-24 px-6">
        <div
          ref={demo.ref}
          className={`max-w-5xl mx-auto transition-all duration-700 ${demo.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Try it yourself</h2>
            <p className="text-gray-400">
              Explore ATLAS from any perspective. All demo accounts use password: <code className="px-2 py-0.5 bg-white/10 rounded text-sm font-mono text-violet-300">demo123</code>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                role: 'Patient',
                email: 'patient@demo.atlas',
                desc: 'See your health wallet, Atlas Card, documents, and the AI intake interview experience.',
                icon: <User className="w-6 h-6" />,
                btnColor: 'from-violet-500 to-violet-600',
                iconColor: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
              },
              {
                role: 'Clinic Admin',
                email: 'clinic@demo.atlas',
                desc: 'Manage intake forms, patient pipeline, submissions, and clinic analytics.',
                icon: <Building2 className="w-6 h-6" />,
                btnColor: 'from-indigo-500 to-indigo-600',
                iconColor: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
              },
              {
                role: 'Clinician',
                email: 'clinician@demo.atlas',
                desc: 'Review verification queue, verify patient records, and track your activity.',
                icon: <BadgeCheck className="w-6 h-6" />,
                iconColor: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
                btnColor: 'from-emerald-500 to-emerald-600',
              },
            ].map((account, i) => (
              <div
                key={i}
                className="group p-6 bg-white/[0.03] rounded-2xl border border-white/10 hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${account.iconColor} border flex items-center justify-center mb-4`}>
                  {account.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{account.role}</h3>
                <p className="text-sm text-gray-500 font-mono mb-3">{account.email}</p>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">{account.desc}</p>
                <Link
                  href="/login"
                  className={`inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ${account.btnColor} text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity`}
                >
                  Try {account.role} Demo <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 7: FOOTER                           */}
      {/* ============================================ */}
      <footer className="bg-[#0a0720] text-white px-6 py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-700 flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">ATLAS</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
              <Link href="/status" className="hover:text-white transition-colors">Status</Link>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-sm text-gray-500 mb-2">Built for medical tourism clinics worldwide</p>
            <p className="text-xs text-gray-600">&copy; 2026 ATLAS Health Identity. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
