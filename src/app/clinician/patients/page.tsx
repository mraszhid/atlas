'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  User, 
  CheckCircle2, 
  AlertTriangle, 
  Pill, 
  Activity,
  Shield,
  Lock,
  X
} from 'lucide-react'
import { cn, formatDate, calculateAge } from '@/lib/utils'

interface Patient {
  id: string
  fullName: string
  dateOfBirth: string
  nationality: string
  photoUrl: string | null
  emergencyCode: string
}

interface PatientDetails {
  patient: Patient
  allergies: any[]
  medications: any[]
  conditions: any[]
  surgeries: any[]
  verifications: any[]
}

export default function ClinicianPatientsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<PatientDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)
  const [showVerifyModal, setShowVerifyModal] = useState(false)

  useEffect(() => {
    fetchPatients()
  }, [])

  async function fetchPatients() {
    const res = await fetch('/api/clinician/patients')
    const data = await res.json()
    setPatients(data)
    setLoading(false)
  }

  async function selectPatient(patientId: string) {
    setLoading(true)
    const res = await fetch(`/api/clinician/patients/${patientId}`)
    const data = await res.json()
    setSelectedPatient(data)
    setLoading(false)
  }

  async function handleVerify(categories: string[], notes: string) {
    if (!selectedPatient) return
    setVerifying(true)

    const res = await fetch('/api/clinician/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId: selectedPatient.patient.id,
        categories,
        notes,
      }),
    })

    if (res.ok) {
      // Refresh patient data
      await selectPatient(selectedPatient.patient.id)
      setShowVerifyModal(false)
    }
    setVerifying(false)
  }

  const filteredPatients = patients.filter(p =>
    p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.emergencyCode.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-clinical-900 mb-2">
          Patient Verification
        </h1>
        <p className="text-clinical-500">
          Search for patients and verify their health records
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <div className="atlas-card overflow-hidden">
          <div className="p-4 border-b border-clinical-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-clinical-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patients..."
                className="input pl-10"
              />
            </div>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {loading && !selectedPatient ? (
              <div className="p-8 text-center text-clinical-500">Loading...</div>
            ) : filteredPatients.length === 0 ? (
              <div className="p-8 text-center text-clinical-500">No patients found</div>
            ) : (
              filteredPatients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => selectPatient(patient.id)}
                  className={cn(
                    'w-full p-4 text-left border-b border-clinical-100 hover:bg-clinical-50 transition-colors',
                    selectedPatient?.patient.id === patient.id && 'bg-atlas-50 border-l-4 border-l-atlas-500'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-clinical-100 overflow-hidden flex-shrink-0">
                      {patient.photoUrl ? (
                        <img src={patient.photoUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-clinical-500">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-clinical-900 truncate">{patient.fullName}</p>
                      <p className="text-sm text-clinical-500">
                        {calculateAge(patient.dateOfBirth)} yrs • {patient.nationality}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Patient Details */}
        <div className="lg:col-span-2">
          {selectedPatient ? (
            <div className="space-y-6">
              {/* Patient Header */}
              <div className="atlas-card p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-clinical-100 overflow-hidden">
                      {selectedPatient.patient.photoUrl ? (
                        <img src={selectedPatient.patient.photoUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-clinical-400">
                          <User className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-clinical-900">
                        {selectedPatient.patient.fullName}
                      </h2>
                      <p className="text-clinical-500">
                        {calculateAge(selectedPatient.patient.dateOfBirth)} years old • 
                        DOB: {formatDate(selectedPatient.patient.dateOfBirth)}
                      </p>
                      <p className="text-clinical-500">{selectedPatient.patient.nationality}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowVerifyModal(true)}
                    className="btn-primary"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Verify Records
                  </button>
                </div>

                {/* Existing Verifications */}
                {selectedPatient.verifications.length > 0 && (
                  <div className="mt-4 p-4 bg-medical-50 rounded-lg border border-medical-200">
                    <h4 className="font-medium text-medical-800 mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Previous Verifications
                    </h4>
                    {selectedPatient.verifications.map((v: any) => (
                      <div key={v.id} className="text-sm text-medical-700">
                        <span className="font-medium">{v.clinician.fullName}</span>
                        {' '}verified {v.category} on {formatDate(v.verifiedAt)}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Health Records */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Allergies */}
                <div className="atlas-card p-6">
                  <h3 className="font-semibold text-clinical-900 flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-alert-500" />
                    Allergies
                  </h3>
                  {selectedPatient.allergies.length > 0 ? (
                    <div className="space-y-2">
                      {selectedPatient.allergies.map((allergy: any) => (
                        <div key={allergy.id} className="p-3 bg-clinical-50 rounded-lg flex items-start justify-between">
                          <div>
                            <p className="font-medium text-clinical-900">{allergy.allergen}</p>
                            {allergy.reaction && (
                              <p className="text-sm text-clinical-500">{allergy.reaction}</p>
                            )}
                          </div>
                          {allergy.verified ? (
                            <span className="badge badge-verified">
                              <CheckCircle2 className="w-3 h-3" />
                              Verified
                            </span>
                          ) : (
                            <span className="badge badge-unverified">Unverified</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-clinical-500 text-sm">No allergies recorded</p>
                  )}
                </div>

                {/* Medications */}
                <div className="atlas-card p-6">
                  <h3 className="font-semibold text-clinical-900 flex items-center gap-2 mb-4">
                    <Pill className="w-5 h-5 text-atlas-500" />
                    Medications
                  </h3>
                  {selectedPatient.medications.length > 0 ? (
                    <div className="space-y-2">
                      {selectedPatient.medications.map((med: any) => (
                        <div key={med.id} className="p-3 bg-clinical-50 rounded-lg flex items-start justify-between">
                          <div>
                            <p className="font-medium text-clinical-900">{med.name}</p>
                            <p className="text-sm text-clinical-500">
                              {med.dosage} • {med.frequency}
                            </p>
                          </div>
                          {med.verified ? (
                            <span className="badge badge-verified">
                              <CheckCircle2 className="w-3 h-3" />
                              Verified
                            </span>
                          ) : (
                            <span className="badge badge-unverified">Unverified</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-clinical-500 text-sm">No medications recorded</p>
                  )}
                </div>

                {/* Conditions */}
                <div className="atlas-card p-6">
                  <h3 className="font-semibold text-clinical-900 flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-medical-500" />
                    Conditions
                  </h3>
                  {selectedPatient.conditions.length > 0 ? (
                    <div className="space-y-2">
                      {selectedPatient.conditions.map((condition: any) => (
                        <div key={condition.id} className="p-3 bg-clinical-50 rounded-lg flex items-start justify-between">
                          <div>
                            <p className="font-medium text-clinical-900">{condition.name}</p>
                            {condition.notes && (
                              <p className="text-sm text-clinical-500">{condition.notes}</p>
                            )}
                          </div>
                          {condition.verified ? (
                            <span className="badge badge-verified">
                              <CheckCircle2 className="w-3 h-3" />
                              Verified
                            </span>
                          ) : (
                            <span className="badge badge-unverified">Unverified</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-clinical-500 text-sm">No conditions recorded</p>
                  )}
                </div>

                {/* Surgeries */}
                <div className="atlas-card p-6">
                  <h3 className="font-semibold text-clinical-900 flex items-center gap-2 mb-4">
                    <Lock className="w-5 h-5 text-clinical-500" />
                    Surgeries
                  </h3>
                  {selectedPatient.surgeries.length > 0 ? (
                    <div className="space-y-2">
                      {selectedPatient.surgeries.map((surgery: any) => (
                        <div key={surgery.id} className="p-3 bg-clinical-50 rounded-lg flex items-start justify-between">
                          <div>
                            <p className="font-medium text-clinical-900">{surgery.procedure}</p>
                            <p className="text-sm text-clinical-500">
                              {surgery.date && formatDate(surgery.date)} • {surgery.hospital}
                            </p>
                          </div>
                          {surgery.verified ? (
                            <span className="badge badge-verified">
                              <CheckCircle2 className="w-3 h-3" />
                              Verified
                            </span>
                          ) : (
                            <span className="badge badge-unverified">Unverified</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-clinical-500 text-sm">No surgeries recorded</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="atlas-card p-12 text-center">
              <User className="w-16 h-16 text-clinical-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-clinical-700 mb-2">Select a Patient</h3>
              <p className="text-clinical-500">
                Choose a patient from the list to view and verify their health records
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Verify Modal */}
      {showVerifyModal && selectedPatient && (
        <VerifyModal
          patient={selectedPatient}
          onClose={() => setShowVerifyModal(false)}
          onVerify={handleVerify}
          loading={verifying}
        />
      )}
    </div>
  )
}

function VerifyModal({
  patient,
  onClose,
  onVerify,
  loading,
}: {
  patient: PatientDetails
  onClose: () => void
  onVerify: (categories: string[], notes: string) => void
  loading: boolean
}) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [notes, setNotes] = useState('')

  const categories = [
    { id: 'allergies', label: 'Allergies', count: patient.allergies.filter(a => !a.verified).length },
    { id: 'medications', label: 'Medications', count: patient.medications.filter(m => !m.verified).length },
    { id: 'conditions', label: 'Conditions', count: patient.conditions.filter(c => !c.verified).length },
    { id: 'surgeries', label: 'Surgeries', count: patient.surgeries.filter(s => !s.verified).length },
  ]

  function toggleCategory(cat: string) {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-clinical-200 flex justify-between items-center sticky top-0 bg-white">
          <div>
            <h3 className="text-lg font-semibold text-clinical-900">Verify Patient Records</h3>
            <p className="text-sm text-clinical-500">For {patient.patient.fullName}</p>
          </div>
          <button onClick={onClose} className="p-2 text-clinical-400 hover:text-clinical-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Category Selection */}
          <div>
            <label className="label">Select categories to verify</label>
            <div className="space-y-2">
              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className={cn(
                    'flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors',
                    selectedCategories.includes(cat.id)
                      ? 'border-medical-500 bg-medical-50'
                      : 'border-clinical-200 hover:border-clinical-300'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() => toggleCategory(cat.id)}
                      className="w-5 h-5 rounded border-clinical-300 text-medical-600 focus:ring-medical-500"
                    />
                    <span className="font-medium text-clinical-900">{cat.label}</span>
                  </div>
                  <span className="text-sm text-clinical-500">
                    {cat.count} unverified
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="label">Verification Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input min-h-[100px]"
              placeholder="Add any notes about this verification..."
            />
          </div>

          {/* Signature Preview */}
          <div className="bg-clinical-50 rounded-lg p-4">
            <p className="text-sm text-clinical-500 mb-2">Digital Signature</p>
            <p className="font-medium text-clinical-900">Verified by clinician</p>
            <p className="text-sm text-clinical-600">{formatDate(new Date())}</p>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              By verifying these records, you confirm that you have reviewed the patient's information 
              and attest to its accuracy. Verified records will be locked from patient editing.
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-clinical-200 flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button
            onClick={() => onVerify(selectedCategories, notes)}
            disabled={selectedCategories.length === 0 || loading}
            className="btn-primary flex-1"
          >
            {loading ? 'Verifying...' : 'Sign & Verify'}
          </button>
        </div>
      </div>
    </div>
  )
}
