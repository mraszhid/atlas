'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { 
  AlertTriangle, 
  Pill, 
  Activity, 
  Syringe,
  Scissors,
  FlaskConical,
  Stethoscope,
  Plus,
  CheckCircle2,
  Lock,
  Pencil,
  Trash2,
  X
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'

type TabType = 'allergies' | 'medications' | 'conditions' | 'surgeries' | 'vaccinations' | 'labs' | 'physician'

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'allergies', label: 'Allergies', icon: <AlertTriangle className="w-4 h-4" /> },
  { id: 'medications', label: 'Medications', icon: <Pill className="w-4 h-4" /> },
  { id: 'conditions', label: 'Conditions', icon: <Activity className="w-4 h-4" /> },
  { id: 'surgeries', label: 'Surgeries', icon: <Scissors className="w-4 h-4" /> },
  { id: 'vaccinations', label: 'Vaccinations', icon: <Syringe className="w-4 h-4" /> },
  { id: 'labs', label: 'Lab Results', icon: <FlaskConical className="w-4 h-4" /> },
  { id: 'physician', label: 'Physician', icon: <Stethoscope className="w-4 h-4" /> },
]

interface WalletData {
  allergies: any[]
  medications: any[]
  conditions: any[]
  surgeries: any[]
  vaccinations: any[]
  labResults: any[]
  primaryPhysician: any
}

export default function HealthWalletPage() {
  const searchParams = useSearchParams()
  const initialTab = (searchParams.get('tab') as TabType) || 'allergies'
  const [activeTab, setActiveTab] = useState<TabType>(initialTab)
  const [data, setData] = useState<WalletData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const res = await fetch('/api/patient/wallet')
      if (!res.ok) {
        setLoading(false)
        return
      }
      const json = await res.json()
      if (json && !json.error) {
        setData(json)
      }
    } catch (error) {
      console.error('Error fetching wallet:', error)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-clinical-200 rounded" />
          <div className="h-12 bg-clinical-200 rounded" />
          <div className="h-64 bg-clinical-200 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-clinical-900 mb-2">
          Health Wallet
        </h1>
        <p className="text-clinical-500">
          Your portable medical record. Verified data is marked with a badge.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-clinical-100 rounded-lg mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap',
              activeTab === tab.id
                ? 'bg-white text-clinical-900 shadow-sm'
                : 'text-clinical-600 hover:text-clinical-900'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="atlas-card">
        <div className="p-4 border-b border-clinical-200 flex justify-between items-center">
          <h2 className="font-semibold text-clinical-900 flex items-center gap-2">
            {tabs.find(t => t.id === activeTab)?.icon}
            {tabs.find(t => t.id === activeTab)?.label}
          </h2>
          {activeTab !== 'physician' && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn-primary btn-sm"
            >
              <Plus className="w-4 h-4" />
              Add New
            </button>
          )}
        </div>

        <div className="p-6">
          {activeTab === 'allergies' && data && (
            <AllergiesSection data={data.allergies} onRefresh={fetchData} />
          )}
          {activeTab === 'medications' && data && (
            <MedicationsSection data={data.medications} onRefresh={fetchData} />
          )}
          {activeTab === 'conditions' && data && (
            <ConditionsSection data={data.conditions} onRefresh={fetchData} />
          )}
          {activeTab === 'surgeries' && data && (
            <SurgeriesSection data={data.surgeries} onRefresh={fetchData} />
          )}
          {activeTab === 'vaccinations' && data && (
            <VaccinationsSection data={data.vaccinations} onRefresh={fetchData} />
          )}
          {activeTab === 'labs' && data && (
            <LabsSection data={data.labResults} onRefresh={fetchData} />
          )}
          {activeTab === 'physician' && data && (
            <PhysicianSection data={data.primaryPhysician} onRefresh={fetchData} />
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <AddItemModal
          type={activeTab}
          onClose={() => setShowAddModal(false)}
          onSave={async (item) => {
            await fetch(`/api/patient/wallet/${activeTab}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item),
            })
            setShowAddModal(false)
            fetchData()
          }}
        />
      )}
    </div>
  )
}

function VerifiedBadge({ verified, locked }: { verified: boolean; locked?: boolean }) {
  if (!verified) {
    return <span className="badge badge-unverified">Unverified</span>
  }
  return (
    <div className="flex items-center gap-1">
      <span className="badge badge-verified">
        <CheckCircle2 className="w-3 h-3" />
        Verified
      </span>
      {locked && (
        <span className="badge bg-clinical-100 text-clinical-600">
          <Lock className="w-3 h-3" />
        </span>
      )}
    </div>
  )
}

function AllergiesSection({ data, onRefresh }: { data: any[]; onRefresh: () => void }) {
  if (data.length === 0) {
    return <EmptyState message="No allergies recorded" />
  }

  const severityColors: Record<string, string> = {
    severe: 'bg-alert-100 text-alert-700 border-alert-200',
    moderate: 'bg-amber-100 text-amber-700 border-amber-200',
    mild: 'bg-clinical-100 text-clinical-600 border-clinical-200',
  }

  return (
    <div className="space-y-4">
      {data.map((allergy) => (
        <div key={allergy.id} className="flex items-start justify-between p-4 bg-clinical-50 rounded-lg border border-clinical-200">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-clinical-900">{allergy.allergen}</h3>
              {allergy.severity && (
                <span className={cn('px-2 py-0.5 text-xs font-medium rounded-full border', severityColors[allergy.severity] || severityColors.mild)}>
                  {allergy.severity}
                </span>
              )}
              <VerifiedBadge verified={allergy.verified} locked={allergy.locked} />
            </div>
            {allergy.reaction && (
              <p className="text-sm text-clinical-600">Reaction: {allergy.reaction}</p>
            )}
            {allergy.source === 'EMR_IMPORT' && (
              <p className="text-xs text-atlas-600 mt-1">Source: EMR Import</p>
            )}
          </div>
          {!allergy.locked && (
            <div className="flex gap-2">
              <button className="p-2 text-clinical-400 hover:text-clinical-600 rounded">
                <Pencil className="w-4 h-4" />
              </button>
              <button 
                onClick={async () => {
                  await fetch(`/api/patient/wallet/allergies/${allergy.id}`, { method: 'DELETE' })
                  onRefresh()
                }}
                className="p-2 text-clinical-400 hover:text-alert-600 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function MedicationsSection({ data, onRefresh }: { data: any[]; onRefresh: () => void }) {
  if (data.length === 0) {
    return <EmptyState message="No medications recorded" />
  }

  return (
    <div className="space-y-4">
      {data.map((med) => (
        <div key={med.id} className="flex items-start justify-between p-4 bg-clinical-50 rounded-lg border border-clinical-200">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-clinical-900">{med.name}</h3>
              <VerifiedBadge verified={med.verified} locked={med.locked} />
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-clinical-600">
              {med.dosage && <span>Dosage: {med.dosage}</span>}
              {med.frequency && <span>Frequency: {med.frequency}</span>}
            </div>
            {med.prescribedFor && (
              <p className="text-sm text-clinical-500 mt-1">For: {med.prescribedFor}</p>
            )}
          </div>
          {!med.locked && (
            <div className="flex gap-2">
              <button className="p-2 text-clinical-400 hover:text-clinical-600 rounded">
                <Pencil className="w-4 h-4" />
              </button>
              <button 
                onClick={async () => {
                  await fetch(`/api/patient/wallet/medications/${med.id}`, { method: 'DELETE' })
                  onRefresh()
                }}
                className="p-2 text-clinical-400 hover:text-alert-600 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function ConditionsSection({ data, onRefresh }: { data: any[]; onRefresh: () => void }) {
  if (data.length === 0) {
    return <EmptyState message="No conditions recorded" />
  }

  return (
    <div className="space-y-4">
      {data.map((condition) => (
        <div key={condition.id} className="flex items-start justify-between p-4 bg-clinical-50 rounded-lg border border-clinical-200">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-clinical-900">{condition.name}</h3>
              <VerifiedBadge verified={condition.verified} locked={condition.locked} />
            </div>
            {condition.diagnosedDate && (
              <p className="text-sm text-clinical-600">Diagnosed: {formatDate(condition.diagnosedDate)}</p>
            )}
            {condition.notes && (
              <p className="text-sm text-clinical-500 mt-1">{condition.notes}</p>
            )}
          </div>
          {!condition.locked && (
            <div className="flex gap-2">
              <button className="p-2 text-clinical-400 hover:text-clinical-600 rounded">
                <Pencil className="w-4 h-4" />
              </button>
              <button 
                onClick={async () => {
                  await fetch(`/api/patient/wallet/conditions/${condition.id}`, { method: 'DELETE' })
                  onRefresh()
                }}
                className="p-2 text-clinical-400 hover:text-alert-600 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function SurgeriesSection({ data, onRefresh }: { data: any[]; onRefresh: () => void }) {
  if (data.length === 0) {
    return <EmptyState message="No surgeries recorded" />
  }

  return (
    <div className="space-y-4">
      {data.map((surgery) => (
        <div key={surgery.id} className="flex items-start justify-between p-4 bg-clinical-50 rounded-lg border border-clinical-200">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-clinical-900">{surgery.procedure}</h3>
              <VerifiedBadge verified={surgery.verified} locked={surgery.locked} />
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-clinical-600">
              {surgery.date && <span>Date: {formatDate(surgery.date)}</span>}
              {surgery.hospital && <span>Hospital: {surgery.hospital}</span>}
            </div>
            {surgery.notes && (
              <p className="text-sm text-clinical-500 mt-1">{surgery.notes}</p>
            )}
          </div>
          {!surgery.locked && (
            <div className="flex gap-2">
              <button className="p-2 text-clinical-400 hover:text-clinical-600 rounded">
                <Pencil className="w-4 h-4" />
              </button>
              <button 
                onClick={async () => {
                  await fetch(`/api/patient/wallet/surgeries/${surgery.id}`, { method: 'DELETE' })
                  onRefresh()
                }}
                className="p-2 text-clinical-400 hover:text-alert-600 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function VaccinationsSection({ data, onRefresh }: { data: any[]; onRefresh: () => void }) {
  if (data.length === 0) {
    return <EmptyState message="No vaccinations recorded" />
  }

  return (
    <div className="space-y-4">
      {data.map((vax) => (
        <div key={vax.id} className="flex items-start justify-between p-4 bg-clinical-50 rounded-lg border border-clinical-200">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-clinical-900">{vax.name}</h3>
              <VerifiedBadge verified={vax.verified} />
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-clinical-600">
              {vax.date && <span>Date: {formatDate(vax.date)}</span>}
              {vax.provider && <span>Provider: {vax.provider}</span>}
              {vax.lotNumber && <span>Lot: {vax.lotNumber}</span>}
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={async () => {
                await fetch(`/api/patient/wallet/vaccinations/${vax.id}`, { method: 'DELETE' })
                onRefresh()
              }}
              className="p-2 text-clinical-400 hover:text-alert-600 rounded"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function LabsSection({ data, onRefresh }: { data: any[]; onRefresh: () => void }) {
  if (data.length === 0) {
    return <EmptyState message="No lab results recorded" />
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Test Name</th>
            <th>Result</th>
            <th>Reference Range</th>
            <th>Date</th>
            <th>Provider</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((lab) => (
            <tr key={lab.id}>
              <td className="font-medium text-clinical-900">{lab.testName}</td>
              <td>
                {lab.result} {lab.unit}
              </td>
              <td className="text-clinical-500">{lab.referenceRange || '—'}</td>
              <td>{lab.date ? formatDate(lab.date) : '—'}</td>
              <td>{lab.provider || '—'}</td>
              <td>
                <button 
                  onClick={async () => {
                    await fetch(`/api/patient/wallet/labs/${lab.id}`, { method: 'DELETE' })
                    onRefresh()
                  }}
                  className="p-2 text-clinical-400 hover:text-alert-600 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PhysicianSection({ data, onRefresh }: { data: any; onRefresh: () => void }) {
  if (!data) {
    return (
      <div className="text-center py-8">
        <Stethoscope className="w-12 h-12 text-clinical-300 mx-auto mb-4" />
        <p className="text-clinical-500 mb-4">No primary physician set</p>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Primary Physician
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-md">
      <div className="bg-clinical-50 rounded-lg p-6 border border-clinical-200">
        <div className="flex items-start justify-between mb-4">
          <div className="w-16 h-16 rounded-full bg-atlas-100 flex items-center justify-center">
            <Stethoscope className="w-8 h-8 text-atlas-600" />
          </div>
          <button className="p-2 text-clinical-400 hover:text-clinical-600 rounded">
            <Pencil className="w-4 h-4" />
          </button>
        </div>
        <h3 className="text-lg font-semibold text-clinical-900">{data.name}</h3>
        <p className="text-clinical-500">{data.specialty}</p>
        <div className="mt-4 space-y-2 text-sm">
          <p><span className="text-clinical-500">Clinic:</span> <span className="text-clinical-900">{data.clinic}</span></p>
          {data.phone && <p><span className="text-clinical-500">Phone:</span> <span className="text-clinical-900">{data.phone}</span></p>}
          {data.email && <p><span className="text-clinical-500">Email:</span> <span className="text-clinical-900">{data.email}</span></p>}
          {data.country && <p><span className="text-clinical-500">Country:</span> <span className="text-clinical-900">{data.country}</span></p>}
        </div>
      </div>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12">
      <p className="text-clinical-500">{message}</p>
      <p className="text-sm text-clinical-400 mt-1">Click "Add New" to add your first entry</p>
    </div>
  )
}

function AddItemModal({ 
  type, 
  onClose, 
  onSave 
}: { 
  type: TabType
  onClose: () => void
  onSave: (item: any) => void
}) {
  const [formData, setFormData] = useState<any>({})

  const fields: Record<TabType, { name: string; label: string; type?: string; required?: boolean }[]> = {
    allergies: [
      { name: 'allergen', label: 'Allergen', required: true },
      { name: 'reaction', label: 'Reaction' },
      { name: 'severity', label: 'Severity' },
    ],
    medications: [
      { name: 'name', label: 'Medication Name', required: true },
      { name: 'dosage', label: 'Dosage' },
      { name: 'frequency', label: 'Frequency' },
      { name: 'prescribedFor', label: 'Prescribed For' },
    ],
    conditions: [
      { name: 'name', label: 'Condition Name', required: true },
      { name: 'diagnosedDate', label: 'Diagnosed Date', type: 'date' },
      { name: 'notes', label: 'Notes' },
    ],
    surgeries: [
      { name: 'procedure', label: 'Procedure', required: true },
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'hospital', label: 'Hospital' },
      { name: 'notes', label: 'Notes' },
    ],
    vaccinations: [
      { name: 'name', label: 'Vaccine Name', required: true },
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'provider', label: 'Provider' },
      { name: 'lotNumber', label: 'Lot Number' },
    ],
    labs: [
      { name: 'testName', label: 'Test Name', required: true },
      { name: 'result', label: 'Result', required: true },
      { name: 'unit', label: 'Unit' },
      { name: 'referenceRange', label: 'Reference Range' },
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'provider', label: 'Provider' },
    ],
    physician: [],
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-clinical-200 flex justify-between items-center sticky top-0 bg-white">
          <h3 className="text-lg font-semibold text-clinical-900">
            Add {tabs.find(t => t.id === type)?.label.slice(0, -1) || 'Item'}
          </h3>
          <button onClick={onClose} className="p-2 text-clinical-400 hover:text-clinical-600">
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
          {fields[type]?.map((field) => (
            <div key={field.name}>
              <label className="label">
                {field.label}
                {field.required && <span className="text-alert-500">*</span>}
              </label>
              <input
                type={field.type || 'text'}
                required={field.required}
                value={formData[field.name] || ''}
                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                className="input"
              />
            </div>
          ))}
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
