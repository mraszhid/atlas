'use client'

import { useState, useEffect } from 'react'
import { 
  Download, 
  Wallet,
  Shield,
  Info,
  CheckCircle2,
  Smartphone,
  AlertTriangle,
  Heart,
  Sparkles
} from 'lucide-react'

interface PatientData {
  id: string
  fullName: string
  dateOfBirth: string
  bloodType: string | null
  visaId: string | null
  emergencyCode: string
  nationality: string
  organDonor: boolean
}

export default function AtlasCardPage() {
  const [patient, setPatient] = useState<PatientData | null>(null)
  const [qrCode, setQrCode] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [showWalletAnimation, setShowWalletAnimation] = useState(false)
  const [walletAdded, setWalletAdded] = useState(false)

  useEffect(() => {
    fetchPatientData()
  }, [])

  async function fetchPatientData() {
    try {
      const res = await fetch('/api/patient/profile')
      if (!res.ok) {
        window.location.href = '/login'
        return
      }
      const data = await res.json()
      if (!data || data.error) {
        window.location.href = '/login'
        return
      }
      setPatient(data)
      
      const QRCode = await import('qrcode')
      const emergencyUrl = `${window.location.origin}/emergency?code=${data.emergencyCode}`
      const qr = await QRCode.toDataURL(emergencyUrl, {
        width: 160,
        margin: 0,
        color: { dark: '#0f172a', light: '#ffffff' },
      })
      setQrCode(qr)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch patient data:', error)
      window.location.href = '/login'
    }
  }

  function getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  function formatDOB(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  function handleAddToWallet() {
    setShowWalletAnimation(true)
    setTimeout(() => {
      setWalletAdded(true)
      setTimeout(() => {
        setShowWalletAnimation(false)
      }, 1500)
    }, 2000)
  }

  async function handleDownload() {
    window.print()
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-slate-200 rounded mb-4" />
            <div className="h-4 w-96 bg-slate-200 rounded mb-8" />
            <div className="h-96 bg-slate-200 rounded-3xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!patient) return null

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Your Atlas Health Card
          </h1>
          <p className="text-slate-500">
            Your portable health identity for emergencies worldwide
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Card Section */}
          <div>
            {/* Premium Atlas Card */}
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity" />
              
              <div 
                className="relative rounded-3xl p-8 text-white overflow-hidden transform transition-all duration-500 hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 40%, #020617 100%)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
                }}
              >
                {/* Shine effect */}
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, transparent 100%)',
                  }}
                />
                
                {/* Card Content */}
                <div className="relative z-10">
                  {/* Header Row */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xl font-bold">Atlas</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs uppercase tracking-widest text-slate-400">Health ID</span>
                      {patient.organDonor && (
                        <div className="flex items-center gap-1 mt-1 text-rose-400">
                          <Heart className="w-3 h-3 fill-current" />
                          <span className="text-xs">Organ Donor</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Main Info */}
                  <div className="flex gap-6 mb-8">
                    <div className="w-24 h-24 rounded-2xl bg-slate-700/50 border-2 border-slate-600/50 flex items-center justify-center text-4xl font-bold backdrop-blur">
                      {getInitials(patient.fullName)}
                    </div>
                    
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold tracking-tight mb-1">{patient.fullName}</h2>
                      <p className="text-slate-400 font-mono text-sm mb-4">{patient.visaId || 'ATL-2024-0847'}</p>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Date of Birth</p>
                          <p className="font-semibold text-sm">{formatDOB(patient.dateOfBirth)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Blood Type</p>
                          <p className="font-semibold text-sm">{patient.bloodType || 'O+'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Nationality</p>
                          <p className="font-semibold text-sm">{patient.nationality.slice(0, 3).toUpperCase()}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-white/10 my-6" />

                  {/* QR Code Row */}
                  <div className="flex items-end justify-between">
                    <div className="bg-white p-3 rounded-2xl shadow-inner">
                      {qrCode && <img src={qrCode} alt="Emergency QR" className="w-32 h-32" />}
                    </div>
                    
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">In Emergency</p>
                      <p className="text-amber-400 font-bold tracking-wide">SCAN QR CODE</p>
                      <p className="text-xs text-slate-500 mt-2">or enter code manually:</p>
                      <p className="font-mono text-sm text-white">{patient.emergencyCode}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <button onClick={handleDownload} className="btn-primary flex-1">
                <Download className="w-5 h-5" />
                Download PDF
              </button>
              <button 
                onClick={handleAddToWallet} 
                disabled={walletAdded}
                className={`flex-1 ${walletAdded ? 'btn-secondary' : 'btn-secondary hover:bg-slate-900 hover:text-white hover:border-slate-900'} transition-all`}
              >
                {walletAdded ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    Added to Wallet
                  </>
                ) : (
                  <>
                    <Wallet className="w-5 h-5" />
                    Add to Wallet
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            {/* Emergency Code Card */}
            <div className="card-premium p-6 bg-gradient-to-br from-rose-50 to-orange-50 border-rose-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Emergency Access Code</h3>
                  <p className="font-mono text-2xl font-bold text-rose-600 mb-2">{patient.emergencyCode}</p>
                  <p className="text-sm text-slate-600">
                    Share this code verbally if QR scanning isn't possible. First responders can enter it at atlas.health/emergency
                  </p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="card-premium p-6">
              <h3 className="font-semibold text-slate-900 mb-4">What's Accessible in Emergency</h3>
              <div className="space-y-3">
                {[
                  { icon: <AlertTriangle className="w-4 h-4" />, label: 'Critical allergies & reactions', color: 'bg-rose-100 text-rose-600' },
                  { icon: <Shield className="w-4 h-4" />, label: 'Current medications & dosages', color: 'bg-blue-100 text-blue-600' },
                  { icon: <Heart className="w-4 h-4" />, label: 'Medical conditions', color: 'bg-violet-100 text-violet-600' },
                  { icon: <Info className="w-4 h-4" />, label: 'Emergency contacts', color: 'bg-emerald-100 text-emerald-600' },
                  { icon: <Sparkles className="w-4 h-4" />, label: 'Advance directives', color: 'bg-amber-100 text-amber-600' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center`}>
                      {item.icon}
                    </div>
                    <span className="text-slate-700">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Wallet Info */}
            <div className="card-premium p-6 bg-slate-50">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Apple & Google Wallet</h3>
                  <p className="text-sm text-slate-600">
                    Add your Atlas Card to your phone's wallet for quick access. Works offline and shows on your lock screen in emergencies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Animation Overlay */}
      {showWalletAnimation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="relative">
            {/* Phone mockup */}
            <div className="w-72 h-[500px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl">
              <div className="w-full h-full bg-slate-800 rounded-[2.5rem] overflow-hidden relative">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-2xl" />
                
                {/* Wallet UI */}
                <div className="pt-12 px-4">
                  <p className="text-white/60 text-sm mb-4">Wallet</p>
                  
                  {/* Existing cards */}
                  <div className="space-y-3 mb-4">
                    <div className="h-20 rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 opacity-50" />
                    <div className="h-20 rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 opacity-50" />
                  </div>
                  
                  {/* Atlas Card sliding in */}
                  <div 
                    className={`h-24 rounded-xl bg-gradient-to-r from-slate-700 to-slate-900 p-4 transform transition-all duration-1000 ${
                      walletAdded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">Atlas Health Card</p>
                        <p className="text-white/60 text-sm">{patient.fullName}</p>
                      </div>
                    </div>
                  </div>
                  
                  {walletAdded && (
                    <div className="mt-8 text-center">
                      <div className="w-16 h-16 rounded-full bg-emerald-500 mx-auto flex items-center justify-center mb-3 animate-bounce">
                        <CheckCircle2 className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-white font-semibold">Added to Wallet!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
