'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Users,
  Download,
  Plus,
  Search,
  Eye,
  MessageSquare,
  CheckCircle2,
  Archive,
  Clock,
  AlertTriangle,
  ChevronDown,
  Filter,
  SortAsc,
  UserPlus,
} from 'lucide-react'

const mockPatients = [
  {
    id: '1',
    name: 'Muhammad Al-Rashid',
    age: 41,
    gender: 'Male',
    nationality: 'UAE',
    status: 'active',
    importDate: 'Feb 1, 2026',
    procedure: 'Cosmetic Surgery',
    procedureDate: 'Feb 15, 2026',
    intake: { form: true, history: true, labs: true, allergiesVerified: true, medsVerified: false },
    avatar: 'MA',
    avatarGradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    age: 34,
    gender: 'Female',
    nationality: 'USA',
    status: 'active',
    importDate: 'Feb 3, 2026',
    procedure: 'Orthopedic Surgery',
    procedureDate: 'Mar 5, 2026',
    intake: { form: true, history: true, labs: false, allergiesVerified: false, medsVerified: false },
    avatar: 'SJ',
    avatarGradient: 'from-rose-500 to-pink-500',
  },
  {
    id: '3',
    name: 'Lisa Wong',
    age: 29,
    gender: 'Female',
    nationality: 'Singapore',
    status: 'active',
    importDate: 'Feb 5, 2026',
    procedure: 'Cosmetic Surgery',
    procedureDate: 'Mar 8, 2026',
    intake: { form: true, history: false, labs: false, allergiesVerified: false, medsVerified: false },
    avatar: 'LW',
    avatarGradient: 'from-amber-500 to-orange-500',
  },
  {
    id: '4',
    name: 'Ahmed Hassan',
    age: 52,
    gender: 'Male',
    nationality: 'Egypt',
    status: 'active',
    importDate: 'Jan 28, 2026',
    procedure: 'Orthopedic Surgery',
    procedureDate: 'Feb 20, 2026',
    intake: { form: true, history: true, labs: true, allergiesVerified: true, medsVerified: true },
    avatar: 'AH',
    avatarGradient: 'from-emerald-500 to-teal-500',
  },
  {
    id: '5',
    name: 'Yuki Tanaka',
    age: 38,
    gender: 'Female',
    nationality: 'Japan',
    status: 'active',
    importDate: 'Feb 4, 2026',
    procedure: 'Dental Surgery',
    procedureDate: 'Mar 12, 2026',
    intake: { form: false, history: false, labs: false, allergiesVerified: false, medsVerified: false },
    avatar: 'YT',
    avatarGradient: 'from-violet-500 to-purple-500',
  },
]

const completedPatients = [
  { id: 'c1', name: 'James Anderson', procedure: 'Cosmetic Surgery', completedDate: 'Jan 20, 2026' },
  { id: 'c2', name: 'Maria Garcia', procedure: 'Dental Surgery', completedDate: 'Jan 15, 2026' },
  { id: 'c3', name: 'Hans Mueller', procedure: 'Orthopedic Surgery', completedDate: 'Jan 10, 2026' },
]

const tabs = ['All', 'Imported', 'Active', 'Completed']

export default function ClinicPatientsPage() {
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showImportModal, setShowImportModal] = useState(false)
  const [showCompleted, setShowCompleted] = useState(false)

  const filteredPatients = mockPatients.filter((p) => {
    if (activeTab === 'Active') return p.status === 'active'
    if (activeTab === 'Completed') return false
    return true
  })

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Patient Roster</h1>
          <p className="text-slate-500">Manage and track all clinic patients</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowImportModal(true)} className="btn-primary">
            <Download className="w-4 h-4" />
            Import ATLAS Patient
          </button>
          <button className="btn-secondary">
            <UserPlus className="w-4 h-4" />
            Manual Entry
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="nav-pills">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`nav-pill ${activeTab === tab ? 'active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 py-2 text-sm w-64"
            />
          </div>
          <button className="btn-ghost btn-sm">
            <SortAsc className="w-4 h-4" />
            Sort
          </button>
        </div>
      </div>

      {/* Patient Count */}
      <div className="mb-6">
        <p className="text-sm font-medium text-slate-500">
          47 Total Patients
          <span className="mx-2 text-slate-300">|</span>
          {mockPatients.length} Active
          <span className="mx-2 text-slate-300">|</span>
          29 Completed
        </p>
      </div>

      {/* Active Patients */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          Active Patients
        </h2>
        <div className="space-y-3">
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="card-premium p-5">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Patient Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${patient.avatarGradient} flex items-center justify-center text-white font-bold flex-shrink-0`}
                  >
                    {patient.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{patient.name}</p>
                    <p className="text-sm text-slate-500">
                      {patient.age} yrs, {patient.gender} - {patient.nationality}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex-shrink-0">
                  <span className="badge badge-verified">
                    <CheckCircle2 className="w-3 h-3" />
                    Active
                  </span>
                  <p className="text-xs text-slate-500 mt-1">Imported {patient.importDate}</p>
                </div>

                {/* Procedure */}
                <div className="flex-shrink-0 text-sm">
                  <p className="font-medium text-slate-900">{patient.procedure}</p>
                  <p className="text-slate-500">{patient.procedureDate}</p>
                </div>

                {/* Intake Steps */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      patient.intake.form
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                    title="Intake Form"
                  >
                    {patient.intake.form ? <CheckCircle2 className="w-3.5 h-3.5" /> : '1'}
                  </span>
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      patient.intake.history
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                    title="Medical History"
                  >
                    {patient.intake.history ? <CheckCircle2 className="w-3.5 h-3.5" /> : '2'}
                  </span>
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      patient.intake.labs
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                    title="Lab Results"
                  >
                    {patient.intake.labs ? <CheckCircle2 className="w-3.5 h-3.5" /> : '3'}
                  </span>
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      patient.intake.allergiesVerified
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                    title="Allergies Verified"
                  >
                    {patient.intake.allergiesVerified ? <CheckCircle2 className="w-3.5 h-3.5" /> : '4'}
                  </span>
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      patient.intake.medsVerified
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                    title="Medications Verified"
                  >
                    {patient.intake.medsVerified ? <CheckCircle2 className="w-3.5 h-3.5" /> : '5'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <Link href={`/clinic/patients/${patient.id}`} className="btn-secondary btn-sm">
                    <Eye className="w-4 h-4" />
                    View
                  </Link>
                  <button className="btn-ghost btn-sm">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button className="btn-ghost btn-sm text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <button className="btn-ghost btn-sm text-slate-400">
                    <Archive className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Patients */}
      <div>
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className="flex items-center gap-2 text-lg font-semibold text-slate-900 mb-4"
        >
          <Archive className="w-5 h-5 text-slate-400" />
          Completed Patients
          <span className="text-sm font-normal text-slate-500">(29)</span>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform ${
              showCompleted ? 'rotate-180' : ''
            }`}
          />
        </button>

        {showCompleted && (
          <div className="space-y-2">
            {completedPatients.map((patient) => (
              <div key={patient.id} className="card-premium p-4 opacity-75">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm">
                      {patient.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-slate-700">{patient.name}</p>
                      <p className="text-sm text-slate-500">{patient.procedure}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="badge badge-info">Completed</span>
                    <p className="text-xs text-slate-500 mt-1">{patient.completedDate}</p>
                  </div>
                </div>
              </div>
            ))}
            <p className="text-sm text-slate-500 text-center py-2">
              + 26 more completed patients
            </p>
          </div>
        )}
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-900">Import ATLAS Patient</h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label">ATLAS Code or Email</label>
                <input
                  type="text"
                  className="input"
                  placeholder="ATLAS-XXXX-XXXX or patient@email.com"
                />
              </div>
              <p className="text-sm text-slate-500">
                Enter the patient's ATLAS code or registered email to import their health profile.
              </p>
            </div>
            <div className="p-6 border-t border-slate-200 flex gap-3">
              <button
                onClick={() => setShowImportModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button className="btn-primary flex-1">
                <Search className="w-4 h-4" />
                Search & Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
