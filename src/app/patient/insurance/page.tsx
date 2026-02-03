'use client'

import { useState, useEffect } from 'react'
import { 
  Shield, 
  Plus, 
  Phone,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Building2,
  Pencil,
  Trash2,
  X
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Insurance {
  id: string
  providerName: string
  policyNumber: string
  groupNumber: string | null
  coverageStart: string | null
  coverageEnd: string | null
  emergencyPhone: string | null
  planType: string | null
  isActive: boolean
}

export default function InsurancePage() {
  const [insurances, setInsurances] = useState<Insurance[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    fetchInsurances()
  }, [])

  async function fetchInsurances() {
    try {
      const res = await fetch('/api/patient/insurance')
      if (!res.ok) {
        setInsurances([])
        setLoading(false)
        return
      }
      const data = await res.json()
      if (Array.isArray(data)) {
        setInsurances(data)
      } else {
        setInsurances([])
      }
    } catch (error) {
      console.error('Error fetching insurance:', error)
      setInsurances([])
    }
    setLoading(false)
  }

  async function addInsurance(data: Partial<Insurance>) {
    await fetch('/api/patient/insurance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    fetchInsurances()
    setShowAddModal(false)
  }

  async function deleteInsurance(id: string) {
    if (!confirm('Remove this insurance?')) return
    await fetch(`/api/patient/insurance/${id}`, { method: 'DELETE' })
    fetchInsurances()
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-clinical-900 mb-2">
            Insurance
          </h1>
          <p className="text-clinical-500">
            Manage your health insurance information for verification
          </p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          <Plus className="w-5 h-5" />
          Add Insurance
        </button>
      </div>

      {loading ? (
        <div className="atlas-card p-8 text-center text-clinical-500">Loading...</div>
      ) : insurances.length === 0 ? (
        <div className="atlas-card p-12 text-center">
          <Shield className="w-16 h-16 text-clinical-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-clinical-700 mb-2">No Insurance Added</h3>
          <p className="text-clinical-500 mb-6">
            Add your insurance information for identity verification and coverage checks
          </p>
          <button onClick={() => setShowAddModal(true)} className="btn-primary">
            <Plus className="w-5 h-5" />
            Add Insurance
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {insurances.map((insurance) => (
            <div key={insurance.id} className="atlas-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-atlas-100 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-atlas-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-clinical-900">{insurance.providerName}</h3>
                    <p className="text-sm text-clinical-500">{insurance.planType || 'Health Insurance'}</p>
                  </div>
                </div>
                <span className={`badge ${insurance.isActive ? 'badge-verified' : 'badge-unverified'}`}>
                  {insurance.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-t border-clinical-100">
                  <span className="text-clinical-500">Policy Number</span>
                  <span className="font-mono text-clinical-900">{insurance.policyNumber}</span>
                </div>
                {insurance.groupNumber && (
                  <div className="flex justify-between py-2 border-t border-clinical-100">
                    <span className="text-clinical-500">Group Number</span>
                    <span className="font-mono text-clinical-900">{insurance.groupNumber}</span>
                  </div>
                )}
                {insurance.coverageStart && insurance.coverageEnd && (
                  <div className="flex justify-between py-2 border-t border-clinical-100">
                    <span className="text-clinical-500">Coverage Period</span>
                    <span className="text-clinical-900">
                      {formatDate(insurance.coverageStart)} - {formatDate(insurance.coverageEnd)}
                    </span>
                  </div>
                )}
                {insurance.emergencyPhone && (
                  <div className="flex justify-between py-2 border-t border-clinical-100">
                    <span className="text-clinical-500">Emergency Line</span>
                    <a href={`tel:${insurance.emergencyPhone}`} className="text-atlas-600 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {insurance.emergencyPhone}
                    </a>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-clinical-100">
                <button className="btn-ghost btn-sm flex-1">
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
                <button 
                  onClick={() => deleteInsurance(insurance.id)}
                  className="btn-ghost btn-sm text-alert-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Card */}
      <div className="atlas-card p-6 mt-6 max-w-2xl">
        <h3 className="font-semibold text-clinical-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-atlas-500" />
          Insurance Verification
        </h3>
        <p className="text-sm text-clinical-600 mb-4">
          Your insurance information can be shared with healthcare providers and insurers for:
        </p>
        <ul className="space-y-2 text-sm text-clinical-600">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-medical-500" />
            Identity verification and fraud prevention
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-medical-500" />
            Coverage eligibility checks
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-medical-500" />
            Travel insurance claims processing
          </li>
        </ul>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <AddInsuranceModal
          onClose={() => setShowAddModal(false)}
          onSave={addInsurance}
        />
      )}
    </div>
  )
}

function AddInsuranceModal({
  onClose,
  onSave,
}: {
  onClose: () => void
  onSave: (data: Partial<Insurance>) => void
}) {
  const [formData, setFormData] = useState({
    providerName: '',
    policyNumber: '',
    groupNumber: '',
    coverageStart: '',
    coverageEnd: '',
    emergencyPhone: '',
    planType: '',
  })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-clinical-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-clinical-900">Add Insurance</h3>
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
          <div>
            <label className="label">Insurance Provider *</label>
            <input
              type="text"
              value={formData.providerName}
              onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
              className="input"
              placeholder="e.g., Blue Cross Blue Shield"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Policy Number *</label>
              <input
                type="text"
                value={formData.policyNumber}
                onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                className="input"
                placeholder="ABC123456"
                required
              />
            </div>
            <div>
              <label className="label">Group Number</label>
              <input
                type="text"
                value={formData.groupNumber}
                onChange={(e) => setFormData({ ...formData, groupNumber: e.target.value })}
                className="input"
                placeholder="GRP-001"
              />
            </div>
          </div>
          <div>
            <label className="label">Plan Type</label>
            <input
              type="text"
              value={formData.planType}
              onChange={(e) => setFormData({ ...formData, planType: e.target.value })}
              className="input"
              placeholder="e.g., PPO, HMO, Travel Insurance"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Coverage Start</label>
              <input
                type="date"
                value={formData.coverageStart}
                onChange={(e) => setFormData({ ...formData, coverageStart: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label">Coverage End</label>
              <input
                type="date"
                value={formData.coverageEnd}
                onChange={(e) => setFormData({ ...formData, coverageEnd: e.target.value })}
                className="input"
              />
            </div>
          </div>
          <div>
            <label className="label">Emergency Phone</label>
            <input
              type="tel"
              value={formData.emergencyPhone}
              onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
              className="input"
              placeholder="+1 800 555 0123"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              Add Insurance
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
