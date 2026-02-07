'use client'

import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Calendar,
  Shield,
  Building2,
} from 'lucide-react'

// ============================================================
// MOCK SUMMARY DATA (all confirmed, nothing changed)
// ============================================================

const summaryData = {
  clinicName: 'Dubai Health Clinic',
  dateCompleted: 'January 15, 2026',
  patientName: 'Muhammad Al-Rashid',
  procedure: 'General Checkup',
  allergies: [
    { name: 'Penicillin', severity: 'Severe', reaction: 'Anaphylaxis', status: 'confirmed' as const },
    { name: 'Sulfonamides', severity: 'Moderate', reaction: 'Rash', status: 'confirmed' as const },
  ],
  medications: [
    { name: 'Metformin 500mg', frequency: 'Twice daily', purpose: 'Diabetes', status: 'confirmed' as const },
    { name: 'Lisinopril 10mg', frequency: 'Daily', purpose: 'Blood Pressure', status: 'confirmed' as const },
    { name: 'Atorvastatin 20mg', frequency: 'Daily', purpose: 'Cholesterol', status: 'confirmed' as const },
  ],
  conditions: [
    { name: 'Type 2 Diabetes', diagnosed: '2020', status: 'confirmed' as const },
    { name: 'Hypertension', diagnosed: '2018', status: 'confirmed' as const },
  ],
  surgeries: [
    { name: 'Appendectomy', year: '2023', facility: 'Dubai Hospital', status: 'confirmed' as const },
  ],
  preProcedure: [
    { question: 'Blood thinners / aspirin (past 2 weeks)', answer: 'No', status: 'confirmed' as const },
    { question: 'Tobacco use', answer: 'Non-smoker', status: 'confirmed' as const },
    { question: 'Anesthesia reactions', answer: 'No known reactions', status: 'confirmed' as const },
  ],
}

type StatusType = 'confirmed' | 'changed' | 'new'

function StatusBadge({ status }: { status: StatusType }) {
  if (status === 'confirmed') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
        <CheckCircle2 className="w-3 h-3" />
        Confirmed
      </span>
    )
  }
  return null
}

// ============================================================
// SECTION COMPONENT
// ============================================================

function SummarySection({
  title,
  dotColor,
  items,
}: {
  title: string
  dotColor: string
  items: { primary: string; secondary: string; status: StatusType }[]
}) {
  return (
    <div className="card-premium overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${dotColor}`} />
          {title}
        </h3>
        <span className="text-xs text-slate-500">{items.length} items</span>
      </div>
      <div className="divide-y divide-slate-100">
        {items.map((item, i) => (
          <div key={i} className="px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <div>
                <span className="text-sm font-medium text-slate-900">{item.primary}</span>
                <span className="text-xs text-slate-500 ml-2">{item.secondary}</span>
              </div>
            </div>
            <StatusBadge status={item.status} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function IntakeSummaryPage() {
  const router = useRouter()

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.push('/patient/appointments')}
          className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-900">
            Intake Summary — {summaryData.clinicName}
          </h1>
          <p className="text-sm text-slate-500 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            Completed on {summaryData.dateCompleted}
          </p>
        </div>
      </div>

      {/* Patient & Clinic Info */}
      <div className="card-premium p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
            MA
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">{summaryData.patientName}</p>
            <p className="text-xs text-slate-500">ATL-2024-0847</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Building2 className="w-4 h-4 text-slate-400" />
          <div>
            <p className="text-sm font-medium text-slate-700">{summaryData.clinicName}</p>
            <p className="text-xs text-slate-500">{summaryData.procedure}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-600">
          <Shield className="w-3.5 h-3.5" />
          Sent & Received
        </div>
      </div>

      {/* Summary Sections */}
      <div className="space-y-6 mb-8">
        <SummarySection
          title="Allergies"
          dotColor="bg-rose-500"
          items={summaryData.allergies.map((a) => ({
            primary: a.name,
            secondary: `${a.severity} — ${a.reaction}`,
            status: a.status,
          }))}
        />

        <SummarySection
          title="Medications"
          dotColor="bg-blue-500"
          items={summaryData.medications.map((m) => ({
            primary: m.name,
            secondary: `${m.frequency} — ${m.purpose}`,
            status: m.status,
          }))}
        />

        <SummarySection
          title="Conditions"
          dotColor="bg-violet-500"
          items={summaryData.conditions.map((c) => ({
            primary: c.name,
            secondary: `Diagnosed ${c.diagnosed}`,
            status: c.status,
          }))}
        />

        <SummarySection
          title="Surgical History"
          dotColor="bg-amber-500"
          items={summaryData.surgeries.map((s) => ({
            primary: s.name,
            secondary: `${s.year} — ${s.facility}`,
            status: s.status,
          }))}
        />

        <SummarySection
          title="Pre-Procedure Screening"
          dotColor="bg-indigo-500"
          items={summaryData.preProcedure.map((p) => ({
            primary: p.question,
            secondary: p.answer,
            status: p.status,
          }))}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => {
            // PDF download would go here
          }}
          className="btn-secondary btn-lg gap-2 flex-1"
        >
          <Download className="w-4 h-4" />
          Download as PDF
        </button>
        <button
          onClick={() => router.push('/patient/appointments')}
          className="btn-primary btn-lg gap-2 flex-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Appointments
        </button>
      </div>
    </div>
  )
}
