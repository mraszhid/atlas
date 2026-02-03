'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Download, 
  Search,
  QrCode,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  User,
  Loader2
} from 'lucide-react'

export default function ClinicImportPage() {
  const [searchType, setSearchType] = useState<'code' | 'email'>('code')
  const [searchValue, setSearchValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [patient, setPatient] = useState<any>(null)
  const [imported, setImported] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch() {
    if (!searchValue.trim()) {
      setError('Please enter a search value')
      return
    }

    setLoading(true)
    setError('')
    setPatient(null)

    // Simulate API call - in production this would search ATLAS
    await new Promise(r => setTimeout(r, 1000))

    // Demo patient data
    if (searchValue.toUpperCase().includes('ATLAS') || searchValue.includes('@')) {
      setPatient({
        id: 'demo-patient',
        fullName: 'Muhammad Rashid',
        dateOfBirth: '1985-03-15',
        nationality: 'United Arab Emirates',
        bloodType: 'O+',
        emergencyCode: searchValue.toUpperCase().includes('ATLAS') ? searchValue : 'ATLAS-MR84-X7K2',
        allergies: [
          { allergen: 'Penicillin', severity: 'SEVERE' },
          { allergen: 'Sulfa Drugs', severity: 'MODERATE' },
        ],
        medications: [
          { name: 'Metformin', dosage: '500mg' },
          { name: 'Lisinopril', dosage: '10mg' },
        ],
        conditions: [
          { name: 'Type 2 Diabetes' },
          { name: 'Hypertension' },
        ],
      })
    } else {
      setError('Patient not found. Try using demo code: ATLAS-MR84-X7K2')
    }

    setLoading(false)
  }

  async function handleImport() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setImported(true)
    setLoading(false)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/clinic/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Import Patient</h1>
        <p className="text-slate-500">Import a patient from the ATLAS network using their code or email</p>
      </div>

      <div className="max-w-2xl">
        {/* Search Card */}
        <div className="card-premium p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Find Patient</h2>
          
          {/* Search Type Toggle */}
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-4">
            <button
              onClick={() => setSearchType('code')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                searchType === 'code' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <QrCode className="w-4 h-4 inline mr-2" />
              ATLAS Code
            </button>
            <button
              onClick={() => setSearchType('email')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                searchType === 'email' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Email Address
            </button>
          </div>

          {/* Search Input */}
          <div className="flex gap-3">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={searchType === 'code' ? 'ATLAS-XXXX-XXXX' : 'patient@email.com'}
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

          <p className="text-sm text-slate-500 mt-4">
            💡 Try demo: <code className="bg-slate-100 px-2 py-0.5 rounded">ATLAS-MR84-X7K2</code>
          </p>
        </div>

        {/* Patient Preview */}
        {patient && !imported && (
          <div className="card-premium p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Patient Found</h2>
            
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                {patient.fullName.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{patient.fullName}</h3>
                <p className="text-slate-500">{patient.nationality} • Blood Type: {patient.bloodType}</p>
                <p className="text-sm text-slate-400 font-mono mt-1">{patient.emergencyCode}</p>
              </div>
            </div>

            {/* Health Summary */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-rose-50 rounded-xl">
                <p className="text-xs font-semibold text-rose-600 uppercase mb-2">Allergies</p>
                {patient.allergies.map((a: any, i: number) => (
                  <p key={i} className="text-sm text-slate-700">{a.allergen} ({a.severity})</p>
                ))}
              </div>
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-xs font-semibold text-blue-600 uppercase mb-2">Medications</p>
                {patient.medications.map((m: any, i: number) => (
                  <p key={i} className="text-sm text-slate-700">{m.name} {m.dosage}</p>
                ))}
              </div>
              <div className="p-4 bg-violet-50 rounded-xl">
                <p className="text-xs font-semibold text-violet-600 uppercase mb-2">Conditions</p>
                {patient.conditions.map((c: any, i: number) => (
                  <p key={i} className="text-sm text-slate-700">{c.name}</p>
                ))}
              </div>
            </div>

            {/* Warning */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800">Patient Consent Required</p>
                  <p className="text-sm text-amber-700 mt-1">
                    By importing this patient, they will receive a notification and must approve your clinic's access to their records.
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleImport}
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Import Patient
                </>
              )}
            </button>
          </div>
        )}

        {/* Success State */}
        {imported && (
          <div className="card-premium p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Patient Imported!</h2>
            <p className="text-slate-500 mb-6">
              {patient.fullName} has been added to your clinic. A consent request has been sent.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/clinic/patients" className="btn-primary">
                View Patients
              </Link>
              <button 
                onClick={() => {
                  setPatient(null)
                  setImported(false)
                  setSearchValue('')
                }}
                className="btn-secondary"
              >
                Import Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
