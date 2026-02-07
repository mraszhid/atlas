'use client'

import { useState, useEffect } from 'react'
import {
  Download,
  Shield,
  Info,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Share2,
  Printer,
  Copy,
  Pencil,
  X,
  QrCode,
  Save
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

const MOCK_PATIENT: PatientData = {
  id: '1',
  fullName: 'Muhammad Al-Rashid',
  dateOfBirth: '1987-03-15',
  bloodType: 'O+',
  visaId: 'ATL-2024-0847',
  emergencyCode: 'ATLAS-A7K9-M2X1',
  nationality: 'UAE',
  organDonor: true,
}

export default function AtlasCardPage() {
  const [patient, setPatient] = useState<PatientData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    fetchPatientData()
  }, [])

  async function fetchPatientData() {
    try {
      const res = await fetch('/api/patient/profile')
      if (res.ok) {
        const data = await res.json()
        if (data && !data.error) {
          setPatient(data)
          setLoading(false)
          return
        }
      }
    } catch {}
    setPatient(MOCK_PATIENT)
    setLoading(false)
  }

  function getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  function formatDOB(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  function copyEmergencyCode() {
    if (!patient) return
    navigator.clipboard.writeText(patient.emergencyCode)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  function copyShareLink() {
    if (!patient) return
    const link = `${window.location.origin}/emergency?code=${patient.emergencyCode}`
    navigator.clipboard.writeText(link)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  function handleDownload() {
    window.print()
  }

  function handlePrint() {
    window.print()
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-8">
        <div className="max-w-5xl mx-auto animate-pulse">
          <div className="h-8 w-64 bg-slate-200 rounded mb-4" />
          <div className="h-4 w-96 bg-slate-200 rounded mb-8" />
          <div className="h-96 bg-slate-200 rounded-3xl" />
        </div>
      </div>
    )
  }

  if (!patient) return null

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
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
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity" />
              <div
                className="relative rounded-3xl p-6 sm:p-8 text-white overflow-hidden transform transition-all duration-500 hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 40%, #020617 100%)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
                }}
              >
                <div className="absolute inset-0 opacity-30" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)' }} />
                <div className="relative z-10">
                  {/* Header Row */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-lg sm:text-xl font-bold">ATLAS HEALTH IDENTITY CARD</span>
                    </div>
                    <div className="text-right">
                      {patient.organDonor && (
                        <div className="flex items-center gap-1 text-rose-400">
                          <Heart className="w-3 h-3 fill-current" />
                          <span className="text-xs">Organ Donor</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Main Info */}
                  <div className="flex gap-6 mb-8">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-700/50 border-2 border-slate-600/50 flex items-center justify-center text-3xl sm:text-4xl font-bold backdrop-blur flex-shrink-0">
                      {getInitials(patient.fullName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-1">{patient.fullName}</h2>
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
                          <p className="font-semibold text-sm">{patient.nationality}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 my-6" />

                  {/* QR Code Row */}
                  <div className="flex items-end justify-between">
                    <div className="bg-white p-4 rounded-2xl shadow-inner">
                      <QrCode className="w-28 h-28 sm:w-32 sm:h-32 text-slate-800" />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Emergency Code</p>
                      <button
                        onClick={copyEmergencyCode}
                        className="font-mono text-xl sm:text-2xl font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-2 justify-end"
                      >
                        {patient.emergencyCode}
                        {copiedCode ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-500" />}
                      </button>
                      <p className="text-xs text-slate-500 mt-2">Click to copy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <button onClick={handleDownload} className="btn-primary flex-1">
                <Download className="w-5 h-5" />
                <span className="hidden sm:inline">Download PDF</span>
                <span className="sm:hidden">PDF</span>
              </button>
              <button onClick={copyShareLink} className="btn-secondary flex-1">
                {copiedLink ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Share2 className="w-5 h-5" />
                    <span className="hidden sm:inline">Share Link</span>
                    <span className="sm:hidden">Share</span>
                  </>
                )}
              </button>
              <button onClick={handlePrint} className="btn-secondary flex-1">
                <Printer className="w-5 h-5" />
                <span className="hidden sm:inline">Print</span>
              </button>
            </div>

            {/* Edit Card Details */}
            <button
              onClick={() => setShowEditModal(true)}
              className="btn-ghost w-full mt-3 justify-center"
            >
              <Pencil className="w-4 h-4" />
              Edit Card Details
            </button>
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
                  <button
                    onClick={copyEmergencyCode}
                    className="font-mono text-2xl font-bold text-rose-600 mb-2 hover:text-rose-700 transition-colors flex items-center gap-2"
                  >
                    {patient.emergencyCode}
                    {copiedCode ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                  </button>
                  <p className="text-sm text-slate-600">
                    Share this code verbally if QR scanning is not possible. First responders can enter it at atlas.health/emergency
                  </p>
                </div>
              </div>
            </div>

            {/* What's Accessible */}
            <div className="card-premium p-6">
              <h3 className="font-semibold text-slate-900 mb-4">What is Accessible in Emergency</h3>
              <div className="space-y-3">
                {[
                  { icon: <AlertTriangle className="w-4 h-4" />, label: 'Critical allergies and reactions', color: 'bg-rose-100 text-rose-600' },
                  { icon: <Shield className="w-4 h-4" />, label: 'Current medications and dosages', color: 'bg-blue-100 text-blue-600' },
                  { icon: <Heart className="w-4 h-4" />, label: 'Medical conditions', color: 'bg-violet-100 text-violet-600' },
                  { icon: <Info className="w-4 h-4" />, label: 'Emergency contacts', color: 'bg-emerald-100 text-emerald-600' },
                  { icon: <Shield className="w-4 h-4" />, label: 'Advance directives', color: 'bg-amber-100 text-amber-600' },
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

            {/* Offline Info */}
            <div className="card-premium p-6 bg-slate-50">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center flex-shrink-0">
                  <Info className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Works Offline</h3>
                  <p className="text-sm text-slate-600">
                    This card works offline. Share the QR code or emergency code with first responders. No internet required for scanning.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditCardModal
          patient={patient}
          onClose={() => setShowEditModal(false)}
          onSave={(updates) => {
            setPatient({ ...patient, ...updates })
            setShowEditModal(false)
            fetch('/api/patient/profile', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updates),
            }).catch(() => {})
          }}
        />
      )}
    </div>
  )
}

function EditCardModal({
  patient,
  onClose,
  onSave,
}: {
  patient: PatientData
  onClose: () => void
  onSave: (updates: Partial<PatientData>) => void
}) {
  const [formData, setFormData] = useState({
    dateOfBirth: patient.dateOfBirth,
    bloodType: patient.bloodType || '',
    organDonor: patient.organDonor,
    nationality: patient.nationality,
  })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-900">Edit Card Details</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form
          className="p-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            onSave(formData)
          }}
        >
          <div>
            <label className="label" htmlFor="edit-dob">Date of Birth</label>
            <input
              id="edit-dob"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="label" htmlFor="edit-blood">Blood Type</label>
            <select
              id="edit-blood"
              value={formData.bloodType}
              onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
              className="input"
            >
              <option value="">Unknown</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="edit-nationality">Nationality</label>
            <input
              id="edit-nationality"
              type="text"
              value={formData.nationality}
              onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="flex items-center gap-3 p-4 bg-rose-50 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={formData.organDonor}
                onChange={(e) => setFormData({ ...formData, organDonor: e.target.checked })}
                className="w-5 h-5 rounded border-slate-300 text-rose-600"
              />
              <div>
                <p className="font-medium text-slate-900">Organ Donor</p>
                <p className="text-xs text-slate-500">This will be visible to emergency responders</p>
              </div>
            </label>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
