'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  Pill,
  Activity,
  FileText,
  Shield,
  Clock,
  CheckCircle2,
  ArrowRight,
  Heart,
  QrCode,
  Eye,
  Lock,
  Unlock,
  Download,
  Share2,
  Copy,
  Wallet
} from 'lucide-react'

interface DashboardData {
  fullName: string
  dateOfBirth: string
  bloodType: string | null
  nationality: string
  emergencyCode: string
  organDonor: boolean
  emergencyLocked: boolean
  visaId: string | null
  allergies: { id: string; allergen: string; severity: string; verified: boolean }[]
  medications: { id: string; name: string; dosage: string; verified: boolean }[]
  conditions: { id: string; name: string; verified: boolean }[]
  documents: { id: string; type: string }[]
  auditLogs: { id: string; actorName: string | null; actorType: string; action: string; createdAt: string; consentType: string | null }[]
}

const MOCK_DATA: DashboardData = {
  fullName: 'Muhammad Al-Rashid',
  dateOfBirth: '1987-03-15',
  bloodType: 'O+',
  nationality: 'UAE',
  emergencyCode: 'ATLAS-A7K9-M2X1',
  organDonor: true,
  emergencyLocked: false,
  visaId: 'ATL-2024-0847',
  allergies: [
    { id: '1', allergen: 'Penicillin', severity: 'severe', verified: true },
    { id: '2', allergen: 'Sulfonamides', severity: 'moderate', verified: false },
  ],
  medications: [
    { id: '1', name: 'Metformin 500mg', dosage: 'BID', verified: true },
    { id: '2', name: 'Lisinopril 10mg', dosage: 'Daily', verified: true },
    { id: '3', name: 'Atorvastatin 20mg', dosage: 'Daily', verified: false },
  ],
  conditions: [
    { id: '1', name: 'Type 2 Diabetes', verified: true },
    { id: '2', name: 'Hypertension', verified: true },
  ],
  documents: [
    { id: '1', type: 'labs' },
    { id: '2', type: 'labs' },
    { id: '3', type: 'discharge_summary' },
    { id: '4', type: 'prescription' },
    { id: '5', type: 'imaging' },
  ],
  auditLogs: [
    { id: '1', actorName: 'Dr. Sarah Chen', actorType: 'CLINICIAN', action: 'VIEW', createdAt: new Date(Date.now() - 3600000).toISOString(), consentType: 'CLINIC_VISIT' },
    { id: '2', actorName: 'Dubai Health Clinic', actorType: 'CLINIC_STAFF', action: 'VERIFY', createdAt: new Date(Date.now() - 86400000).toISOString(), consentType: 'CLINIC_VISIT' },
    { id: '3', actorName: 'System', actorType: 'SYSTEM', action: 'CREATE', createdAt: new Date(Date.now() - 172800000).toISOString(), consentType: null },
  ],
}

export default function PatientDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [emergencyLocked, setEmergencyLocked] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/patient/dashboard')
        if (res.ok) {
          const json = await res.json()
          if (json && !json.error) {
            setData(json)
            setEmergencyLocked(json.emergencyLocked)
            setLoading(false)
            return
          }
        }
      } catch {}
      setData(MOCK_DATA)
      setEmergencyLocked(MOCK_DATA.emergencyLocked)
      setLoading(false)
    }
    fetchData()
  }, [])

  function copyEmergencyCode() {
    if (!data) return
    navigator.clipboard.writeText(data.emergencyCode)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  function toggleEmergencyLock() {
    setEmergencyLocked(!emergencyLocked)
    fetch('/api/patient/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emergencyLocked: !emergencyLocked }),
    }).catch(() => {})
  }

  function formatTimeAgo(dateStr: string) {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 bg-slate-200 rounded" />
          <div className="h-4 w-96 bg-slate-200 rounded" />
          <div className="h-64 bg-slate-200 rounded-3xl" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-36 bg-slate-200 rounded-2xl" />)}
          </div>
        </div>
      </div>
    )
  }

  if (!data) return null

  const docsByType = data.documents.reduce((acc, doc) => {
    acc[doc.type] = (acc[doc.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="p-4 sm:p-8">
      {/* Hero */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Welcome, {data.fullName.split(' ')[0]}
            </h1>
            <p className="text-slate-500">
              Here is an overview of your health identity
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/patient/atlas-card" className="btn-primary">
              <QrCode className="w-5 h-5" />
              View Atlas Card
            </Link>
          </div>
        </div>
      </div>

      {/* Atlas Card Preview + Emergency Lock */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Mini Atlas Card */}
        <div className="lg:col-span-2">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity" />
            <div
              className="relative rounded-3xl p-6 sm:p-8 text-white overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 40%, #020617 100%)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              <div className="absolute inset-0 opacity-30" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)' }} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold">ATLAS HEALTH IDENTITY CARD</span>
                  </div>
                  {data.organDonor && (
                    <div className="flex items-center gap-1 text-rose-400">
                      <Heart className="w-4 h-4 fill-current" />
                      <span className="text-xs font-medium">Organ Donor</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-1">{data.fullName}</h2>
                    <p className="text-slate-400 font-mono text-sm mb-4">{data.visaId || 'ATL-2024-0847'}</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">DOB</p>
                        <p className="font-semibold text-sm">{new Date(data.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Blood Type</p>
                        <p className="font-semibold text-sm">{data.bloodType || 'O+'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Nationality</p>
                        <p className="font-semibold text-sm">{data.nationality}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-end gap-4 sm:flex-col sm:items-end sm:justify-between">
                    <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
                      <QrCode className="w-16 h-16 sm:w-20 sm:h-20 text-white/80" />
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 mt-6 pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Emergency Code</p>
                    <button
                      onClick={copyEmergencyCode}
                      className="font-mono text-lg font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-2"
                    >
                      {data.emergencyCode}
                      {copiedCode ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-500" />}
                    </button>
                  </div>
                  <Link href="/patient/atlas-card" className="btn-secondary btn-sm bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <Download className="w-4 h-4" />
                    Download PDF
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Lock Toggle */}
        <div className="card-premium p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <Shield className="w-5 h-5 text-slate-600" />
              Emergency Lock
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Control whether first responders can access your records without override.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <button
              onClick={toggleEmergencyLock}
              className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-3 font-semibold ${
                emergencyLocked
                  ? 'border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100'
                  : 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              {emergencyLocked ? (
                <>
                  <Lock className="w-6 h-6" />
                  LOCKED
                </>
              ) : (
                <>
                  <Unlock className="w-6 h-6" />
                  UNLOCKED
                </>
              )}
            </button>
            <p className="text-xs text-slate-400 text-center">
              {emergencyLocked
                ? 'Emergency access requires clinician override'
                : 'First responders can access critical data'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Link href="/patient/wallet" className="stat-card group hover:-translate-y-1 transition-all">
          <div className="icon-box bg-rose-100">
            <AlertTriangle className="w-6 h-6 text-rose-600" />
          </div>
          <p className="value">{data.allergies.length}</p>
          <p className="stat-label">Allergies</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            <span className="badge badge-info text-xs">
              {data.medications.length} meds
            </span>
            <span className="badge badge-purple text-xs">
              {data.conditions.length} conditions
            </span>
          </div>
        </Link>

        <Link href="/patient/documents" className="stat-card group hover:-translate-y-1 transition-all">
          <div className="icon-box bg-violet-100">
            <FileText className="w-6 h-6 text-violet-600" />
          </div>
          <p className="value">{data.documents.length}</p>
          <p className="stat-label">Documents</p>
          <div className="flex gap-1 mt-2 flex-wrap">
            {Object.entries(docsByType).slice(0, 2).map(([type, count]) => (
              <span key={type} className="text-xs text-slate-400">{count} {type.replace('_', ' ')}</span>
            ))}
          </div>
        </Link>

        <Link href="/patient/sharing" className="stat-card group hover:-translate-y-1 transition-all">
          <div className="icon-box bg-pink-100">
            <Share2 className="w-6 h-6 text-pink-600" />
          </div>
          <p className="value">0</p>
          <p className="stat-label">Active Sharing Links</p>
          <span className="text-xs text-slate-400 mt-2 block">Create consent links</span>
        </Link>

        <Link href="/patient/audit-log" className="stat-card group hover:-translate-y-1 transition-all">
          <div className="icon-box bg-indigo-100">
            <Eye className="w-6 h-6 text-indigo-600" />
          </div>
          <p className="value">{data.auditLogs.length}</p>
          <p className="stat-label">Recent Audit Events</p>
          {data.auditLogs[0] && (
            <span className="text-xs text-slate-400 mt-2 block">{formatTimeAgo(data.auditLogs[0].createdAt)}</span>
          )}
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="card-premium p-6 mb-6">
        <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link href="/patient/wallet" className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group">
            <div className="icon-box bg-violet-100">
              <Wallet className="w-5 h-5 text-violet-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-900">Health Wallet</p>
              <p className="text-sm text-slate-500">View all records</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </Link>

          <Link href="/patient/documents" className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group">
            <div className="icon-box bg-blue-100">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-900">Document Vault</p>
              <p className="text-sm text-slate-500">{data.documents.length} files stored</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </Link>

          <Link href="/patient/atlas-card" className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group">
            <div className="icon-box bg-amber-100">
              <QrCode className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-900">Atlas Card</p>
              <p className="text-sm text-slate-500">View & download</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </Link>

          <Link href="/patient/sharing" className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group">
            <div className="icon-box bg-pink-100">
              <Share2 className="w-5 h-5 text-pink-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-900">Share Records</p>
              <p className="text-sm text-slate-500">Create share links</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </Link>
        </div>
      </div>

      {/* Recent Audit Log */}
      <div className="card-premium p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Recent Audit Activity</h3>
          <Link href="/patient/audit-log" className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {data.auditLogs.length > 0 ? (
          <div className="space-y-3">
            {data.auditLogs.slice(0, 3).map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  log.consentType === 'EMERGENCY' ? 'bg-rose-100' :
                  log.actorType === 'CLINICIAN' ? 'bg-emerald-100' :
                  'bg-slate-200'
                }`}>
                  <Eye className={`w-4 h-4 ${
                    log.consentType === 'EMERGENCY' ? 'text-rose-600' :
                    log.actorType === 'CLINICIAN' ? 'text-emerald-600' :
                    'text-slate-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {log.actorName || log.actorType}
                  </p>
                  <p className="text-xs text-slate-500">
                    {log.action.replace('_', ' ').toLowerCase()} &middot; {formatTimeAgo(log.createdAt)}
                  </p>
                </div>
                {log.consentType && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    log.consentType === 'EMERGENCY' ? 'bg-rose-100 text-rose-700' :
                    log.consentType === 'CLINIC_VISIT' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {log.consentType.replace('_', ' ')}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  )
}
