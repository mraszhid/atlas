'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Search, 
  Shield,
  CheckCircle2,
  ArrowLeft,
  User,
  Loader2,
  AlertTriangle,
  FileCheck,
  Calendar
} from 'lucide-react'

export default function InsurerVerifyPage() {
  const [searchType, setSearchType] = useState<'policy' | 'atlas'>('policy')
  const [searchValue, setSearchValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [patient, setPatient] = useState<any>(null)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch() {
    if (!searchValue.trim()) {
      setError('Please enter a search value')
      return
    }

    setLoading(true)
    setError('')
    setPatient(null)
    setVerified(false)

    // Simulate API call
    await new Promise(r => setTimeout(r, 1000))

    // Demo patient data
    if (searchValue.length >= 3) {
      setPatient({
        id: 'demo-patient',
        fullName: 'Muhammad Rashid',
        dateOfBirth: '1985-03-15',
        nationality: 'United Arab Emirates',
        policyNumber: 'GTI-2024-78392',
        policyStatus: 'ACTIVE',
        coverageType: 'Premium International',
        validFrom: '2024-01-01',
        validUntil: '2024-12-31',
        maxCoverage: '$500,000',
        remainingCoverage: '$487,500',
        preExistingConditions: ['Type 2 Diabetes', 'Hypertension'],
        exclusions: ['Cosmetic procedures', 'Pre-existing condition complications (first 12 months)'],
      })
    } else {
      setError('Patient not found. Try: POL-12345 or any 3+ character search')
    }

    setLoading(false)
  }

  async function handleVerify() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setVerified(true)
    setLoading(false)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/insurer/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Verify Patient</h1>
        <p className="text-slate-500">Verify patient identity and coverage eligibility</p>
      </div>

      <div className="max-w-3xl">
        {/* Search Card */}
        <div className="card-premium p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Find Patient</h2>
          
          {/* Search Type Toggle */}
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-4">
            <button
              onClick={() => setSearchType('policy')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                searchType === 'policy' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <FileCheck className="w-4 h-4 inline mr-2" />
              Policy Number
            </button>
            <button
              onClick={() => setSearchType('atlas')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                searchType === 'atlas' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Shield className="w-4 h-4 inline mr-2" />
              ATLAS Code
            </button>
          </div>

          {/* Search Input */}
          <div className="flex gap-3">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={searchType === 'policy' ? 'POL-XXXXX-XXXX' : 'ATLAS-XXXX-XXXX'}
              className="input flex-1"
            />
            <button 
              onClick={handleSearch}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              Search
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Patient & Coverage Details */}
        {patient && !verified && (
          <div className="space-y-6">
            {/* Identity Card */}
            <div className="card-premium p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                Patient Identity
              </h2>
              
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-2xl font-bold">
                  {patient.fullName.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900">{patient.fullName}</h3>
                  <p className="text-slate-500">{patient.nationality}</p>
                  <p className="text-sm text-slate-400 mt-1">DOB: {patient.dateOfBirth}</p>
                </div>
                <span className="badge badge-verified">
                  <CheckCircle2 className="w-3 h-3" /> Identity Verified
                </span>
              </div>
            </div>

            {/* Coverage Card */}
            <div className="card-premium p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-500" />
                Coverage Details
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Policy Number</p>
                  <p className="font-mono font-bold text-slate-900">{patient.policyNumber}</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl">
                  <p className="text-xs font-semibold text-emerald-600 uppercase mb-1">Status</p>
                  <p className="font-bold text-emerald-700">{patient.policyStatus}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Coverage Type</p>
                  <p className="font-medium text-slate-900">{patient.coverageType}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Valid Period</p>
                  <p className="font-medium text-slate-900">{patient.validFrom} - {patient.validUntil}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-xs font-semibold text-blue-600 uppercase mb-1">Max Coverage</p>
                  <p className="font-bold text-blue-700">{patient.maxCoverage}</p>
                </div>
                <div className="p-4 bg-violet-50 rounded-xl">
                  <p className="text-xs font-semibold text-violet-600 uppercase mb-1">Remaining</p>
                  <p className="font-bold text-violet-700">{patient.remainingCoverage}</p>
                </div>
              </div>

              {/* Pre-existing & Exclusions */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-amber-50 rounded-xl">
                  <p className="text-xs font-semibold text-amber-600 uppercase mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Pre-existing Conditions
                  </p>
                  <ul className="space-y-1">
                    {patient.preExistingConditions.map((c: string, i: number) => (
                      <li key={i} className="text-sm text-slate-700">• {c}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-rose-50 rounded-xl">
                  <p className="text-xs font-semibold text-rose-600 uppercase mb-2">Exclusions</p>
                  <ul className="space-y-1">
                    {patient.exclusions.map((e: string, i: number) => (
                      <li key={i} className="text-sm text-slate-700">• {e}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <button 
              onClick={handleVerify}
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Confirm Verification
                </>
              )}
            </button>
          </div>
        )}

        {/* Success State */}
        {verified && (
          <div className="card-premium p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Verification Complete!</h2>
            <p className="text-slate-500 mb-6">
              {patient.fullName}'s identity and coverage has been verified and logged.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/insurer/claims" className="btn-primary">
                Process Claim
              </Link>
              <button 
                onClick={() => {
                  setPatient(null)
                  setVerified(false)
                  setSearchValue('')
                }}
                className="btn-secondary"
              >
                New Verification
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
