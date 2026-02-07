'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  User,
  Calendar,
  MapPin,
  Droplets,
  Heart,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Pill,
  Activity,
  Stethoscope,
  FileText,
  Plus,
  Download,
  Shield,
  ExternalLink,
  Send,
  MessageSquare,
  Archive,
} from 'lucide-react'

const patient = {
  name: 'Muhammad Al-Rashid',
  age: 41,
  gender: 'Male',
  nationality: 'UAE',
  bloodType: 'O+',
  procedure: {
    type: 'Cosmetic Surgery',
    date: 'February 15, 2026',
    surgeon: 'Dr. Priya Sharma',
    status: 'Pre-Op',
  },
  intake: [
    { step: 'Intake Form Completed', done: true, date: 'Feb 1, 2026' },
    { step: 'Medical History Provided', done: true, date: 'Feb 1, 2026' },
    { step: 'Lab Results Uploaded', done: true, date: 'Feb 3, 2026' },
    { step: 'Allergies Verified by Clinician', done: true, date: 'Feb 4, 2026' },
    { step: 'Medications Verified', done: false, date: null },
  ],
  allergies: [
    { name: 'Penicillin', severity: 'SEVERE', verified: true },
    { name: 'Sulfa Drugs', severity: 'MODERATE', verified: true },
  ],
  medications: [
    { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', verified: false },
    { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', verified: false },
    { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', verified: false },
  ],
  conditions: ['Type 2 Diabetes', 'Hypertension', 'Hyperlipidemia'],
  surgeries: ['Appendectomy (2015)', 'Knee Arthroscopy (2020)'],
  notes: [
    {
      id: '1',
      author: 'Nurse Priya Sharma',
      date: 'Feb 4, 2026',
      content: 'Verified allergies with patient. Penicillin allergy is severe - confirmed anaphylactic reaction history. Added to surgical alert.',
    },
    {
      id: '2',
      author: 'Admin Staff',
      date: 'Feb 1, 2026',
      content: 'Patient imported from ATLAS. All consent forms received. Procedure scheduled for Feb 15.',
    },
  ],
  consent: {
    mode: 'Medical Tourism Intake',
    expiry: 'March 15, 2026',
    accessCount: 12,
  },
}

export default function PatientDetailPage() {
  const [showAddNote, setShowAddNote] = useState(false)
  const [noteText, setNoteText] = useState('')

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/clinic/patients"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Patients
        </Link>
      </div>

      {/* Patient Header */}
      <div className="card-premium p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
              MA
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{patient.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {patient.age} yrs, {patient.gender}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {patient.nationality}
                </span>
                <span className="flex items-center gap-1">
                  <Droplets className="w-4 h-4" />
                  Blood Type: {patient.bloodType}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn-primary btn-sm">
              <Send className="w-4 h-4" />
              Request Clinician Verify
            </button>
            <button className="btn-secondary btn-sm">
              <Activity className="w-4 h-4" />
              Update Status
            </button>
            <button className="btn-ghost btn-sm text-slate-400">
              <Archive className="w-4 h-4" />
              Archive
            </button>
            <button className="btn-secondary btn-sm">
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Procedure Details */}
          <div className="card-premium p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-violet-500" />
              Procedure Details
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Procedure Type</p>
                <p className="font-medium text-slate-900">{patient.procedure.type}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Scheduled Date</p>
                <p className="font-medium text-slate-900">{patient.procedure.date}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Lead Surgeon</p>
                <p className="font-medium text-slate-900">{patient.procedure.surgeon}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Status</p>
                <span className="badge badge-gold">{patient.procedure.status}</span>
              </div>
            </div>
          </div>

          {/* Intake Status */}
          <div className="card-premium p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Intake Status
            </h2>
            <div className="space-y-3">
              {patient.intake.map((step, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-xl ${
                    step.done ? 'bg-emerald-50' : 'bg-slate-50'
                  }`}
                >
                  {step.done ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Clock className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                  <span
                    className={`flex-1 text-sm font-medium ${
                      step.done ? 'text-emerald-800' : 'text-slate-600'
                    }`}
                  >
                    {step.step}
                  </span>
                  {step.date && (
                    <span className="text-xs text-slate-500">{step.date}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ATLAS Health Data */}
          <div className="card-premium p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" />
              ATLAS Health Data
            </h2>

            {/* Allergies */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                Allergies
              </h3>
              <div className="space-y-2">
                {patient.allergies.map((allergy, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-rose-50 rounded-xl border border-rose-100">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{allergy.name}</span>
                      <span className="badge badge-emergency">{allergy.severity}</span>
                    </div>
                    {allergy.verified && (
                      <span className="badge badge-verified">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Medications */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Pill className="w-4 h-4 text-blue-500" />
                Current Medications
              </h3>
              <div className="space-y-2">
                {patient.medications.map((med, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <div>
                      <span className="font-medium text-slate-900">{med.name}</span>
                      <span className="text-sm text-slate-500 ml-2">
                        {med.dosage} - {med.frequency}
                      </span>
                    </div>
                    {med.verified ? (
                      <span className="badge badge-verified">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <span className="badge badge-gold">
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Conditions */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-violet-500" />
                Chronic Conditions
              </h3>
              <div className="flex flex-wrap gap-2">
                {patient.conditions.map((condition, i) => (
                  <span key={i} className="badge badge-purple">{condition}</span>
                ))}
              </div>
            </div>

            {/* Past Surgeries */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Past Surgeries</h3>
              <div className="flex flex-wrap gap-2">
                {patient.surgeries.map((surgery, i) => (
                  <span key={i} className="badge badge-info">{surgery}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Clinic Notes */}
          <div className="card-premium p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-500" />
                Clinic Notes
              </h2>
              <button
                onClick={() => setShowAddNote(!showAddNote)}
                className="btn-secondary btn-sm"
              >
                <Plus className="w-4 h-4" />
                Add Note
              </button>
            </div>

            {showAddNote && (
              <div className="mb-4 p-4 bg-slate-50 rounded-xl">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="input mb-3"
                  rows={3}
                  placeholder="Add a clinical note..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => { setShowAddNote(false); setNoteText('') }}
                    className="btn-secondary btn-sm"
                  >
                    Cancel
                  </button>
                  <button className="btn-primary btn-sm">Save Note</button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {patient.notes.map((note) => (
                <div key={note.id} className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-slate-900">{note.author}</p>
                    <p className="text-xs text-slate-500">{note.date}</p>
                  </div>
                  <p className="text-sm text-slate-700">{note.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Consent & Sharing */}
          <div className="card-premium p-6 bg-gradient-to-br from-violet-50 to-purple-50">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-violet-500" />
              Consent & Sharing
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Sharing Mode</span>
                <span className="font-medium text-slate-900">{patient.consent.mode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Expires</span>
                <span className="font-medium text-slate-900">{patient.consent.expiry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Access Count</span>
                <span className="font-medium text-slate-900">{patient.consent.accessCount} views</span>
              </div>
            </div>
            <button className="btn-ghost btn-sm mt-4 w-full text-violet-600">
              <ExternalLink className="w-4 h-4" />
              View Access Log
            </button>
          </div>

          {/* Quick Actions */}
          <div className="card-premium p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Actions</h3>
            <div className="space-y-2">
              <button className="btn-primary w-full btn-sm">
                <Send className="w-4 h-4" />
                Request Clinician Verify
              </button>
              <button className="btn-secondary w-full btn-sm">
                <Activity className="w-4 h-4" />
                Update Status
              </button>
              <button className="btn-secondary w-full btn-sm">
                <Archive className="w-4 h-4" />
                Archive Patient
              </button>
              <button className="btn-secondary w-full btn-sm">
                <Download className="w-4 h-4" />
                Download Record
              </button>
            </div>
          </div>

          {/* Intake Progress */}
          <div className="card-premium p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Intake Progress</h3>
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Completion</span>
                <span className="font-semibold text-slate-900">80%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '80%' }} />
              </div>
            </div>
            <p className="text-xs text-slate-500">
              4 of 5 intake steps completed
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
