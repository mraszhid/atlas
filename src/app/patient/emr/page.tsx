'use client'

import { useState } from 'react'
import { 
  Plug, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  ArrowRight,
  RefreshCw,
  Shield
} from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

const emrProviders = [
  { id: 'epic', name: 'Epic MyChart', logo: '🏥', description: 'Connect to Epic MyChart' },
  { id: 'cerner', name: 'Cerner Health', logo: '🏨', description: 'Connect to Cerner Health' },
  { id: 'meditech', name: 'Meditech', logo: '⚕️', description: 'Connect to Meditech' },
  { id: 'demo_hospital', name: 'Demo Hospital (Mock)', logo: '🔬', description: 'Import demo data for testing' },
]

interface ImportResult {
  provider: string
  timestamp: string
  records: {
    allergies: number
    medications: number
    conditions: number
    labResults: number
  }
}

export default function EMRConnectPage() {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState('')

  async function handleImport() {
    if (!selectedProvider) return
    setImporting(true)
    setError('')

    try {
      const res = await fetch('/api/patient/emr/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: selectedProvider }),
      })

      const data = await res.json()

      if (res.ok) {
        setImportResult(data)
      } else {
        setError(data.error || 'Import failed')
      }
    } catch {
      setError('Connection failed')
    }
    setImporting(false)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-clinical-900 mb-2">
          Medical Records
        </h1>
        <p className="text-clinical-500">
          View medical records imported from your healthcare providers
        </p>
      </div>

      {/* Clinic Import Banner */}
      <div className="atlas-card p-4 mb-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Building2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-800">Your clinic imports your medical records automatically</p>
            <p className="text-sm text-blue-600 mt-1">
              When you visit a participating clinic, they securely import your records using HL7 FHIR standards.
              View your imported data below. Your data is encrypted in transit and at rest.
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Connected Providers */}
        <div className="atlas-card p-6">
          <h2 className="text-lg font-semibold text-clinical-900 mb-4">Connected Providers</h2>
          <div className="space-y-3">
            {emrProviders.map((provider) => (
              <div
                key={provider.id}
                className="w-full flex items-center gap-4 p-4 rounded-lg border-2 border-clinical-200 text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-clinical-100 flex items-center justify-center text-2xl">
                  {provider.logo}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-clinical-900">{provider.name}</p>
                  <p className="text-sm text-clinical-500">{provider.description}</p>
                </div>
                <span className="text-xs text-clinical-400 font-medium">Available</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleImport}
            disabled={!selectedProvider || importing}
            className="btn-primary w-full mt-6"
          >
            {importing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Refreshing Records...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                Refresh Imported Records
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-alert-50 border border-alert-200 rounded-lg flex items-center gap-2 text-alert-700">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>

        {/* Import Result */}
        <div>
          {importResult ? (
            <div className="atlas-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-medical-100 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-medical-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-clinical-900">Import Successful</h2>
                  <p className="text-sm text-clinical-500">
                    From {emrProviders.find(p => p.id === importResult.provider)?.name}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <ImportStat label="Allergies" count={importResult.records.allergies} />
                <ImportStat label="Medications" count={importResult.records.medications} />
                <ImportStat label="Conditions" count={importResult.records.conditions} />
                <ImportStat label="Lab Results" count={importResult.records.labResults} />
              </div>

              <div className="bg-clinical-50 rounded-lg p-4">
                <p className="text-sm text-clinical-600">
                  <span className="font-medium">Imported at:</span>{' '}
                  {formatDateTime(importResult.timestamp)}
                </p>
                <p className="text-sm text-clinical-600 mt-1">
                  <span className="font-medium">Source:</span> EMR Import (FHIR)
                </p>
              </div>
            </div>
          ) : (
            <div className="atlas-card p-6">
              <div className="text-center py-8">
                <Plug className="w-16 h-16 text-clinical-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-clinical-700 mb-2">No Imported Records Yet</h3>
                <p className="text-clinical-500 text-sm">
                  Records will appear here after your clinic imports them during your visit
                </p>
              </div>
            </div>
          )}

          {/* How It Works */}
          <div className="atlas-card p-6 mt-6">
            <h3 className="font-semibold text-clinical-900 mb-4">How Record Import Works</h3>
            <div className="space-y-4 text-sm text-clinical-600">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-atlas-100 text-atlas-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  1
                </div>
                <p>Your clinic connects to your healthcare provider using FHIR APIs</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-atlas-100 text-atlas-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  2
                </div>
                <p>Records are fetched as standardized FHIR resources during your visit</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-atlas-100 text-atlas-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  3
                </div>
                <p>Data is mapped to your Atlas Health Wallet categories automatically</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-atlas-100 text-atlas-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  4
                </div>
                <p>Imported records appear here marked with "Source: EMR Import (FHIR)"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ImportStat({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center justify-between p-3 bg-clinical-50 rounded-lg">
      <span className="text-clinical-700">{label}</span>
      <span className="font-semibold text-clinical-900">
        {count > 0 ? `+${count} imported` : 'No new records'}
      </span>
    </div>
  )
}
