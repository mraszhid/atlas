import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { 
  CheckCircle2, 
  Clock, 
  FileCheck,
  AlertTriangle,
  ArrowLeft,
  Shield
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function ClinicianVerificationsPage() {
  const session = await getSession()
  if (!session || session.role !== 'CLINICIAN') redirect('/login')

  const clinician = await prisma.clinician.findUnique({
    where: { userId: session.id },
    include: {
      verifications: {
        include: { patient: true },
        orderBy: { verifiedAt: 'desc' },
      },
    },
  })

  if (!clinician) redirect('/login')

  // Get patients pending verification (those with unverified records)
  const patientsWithUnverified = await prisma.patient.findMany({
    where: {
      OR: [
        { allergies: { some: { verified: false } } },
        { medications: { some: { verified: false } } },
        { conditions: { some: { verified: false } } },
      ],
    },
    include: {
      allergies: { where: { verified: false } },
      medications: { where: { verified: false } },
      conditions: { where: { verified: false } },
    },
    take: 10,
  })

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/clinician/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Verifications</h1>
        <p className="text-slate-500">Review and verify patient health records</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Pending Verification */}
        <div className="card-premium p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            Pending Verification
          </h2>
          
          {patientsWithUnverified.length > 0 ? (
            <div className="space-y-3">
              {patientsWithUnverified.map((patient) => {
                const pendingCount = patient.allergies.length + patient.medications.length + patient.conditions.length
                return (
                  <Link 
                    key={patient.id}
                    href={`/clinician/patients?id=${patient.id}`}
                    className="block p-4 bg-amber-50 rounded-xl border border-amber-100 hover:bg-amber-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-200 flex items-center justify-center text-amber-700 font-bold">
                          {patient.fullName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{patient.fullName}</p>
                          <p className="text-sm text-slate-500">{pendingCount} items pending</p>
                        </div>
                      </div>
                      <span className="badge badge-gold">
                        <AlertTriangle className="w-3 h-3" /> Review
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
              <p className="text-slate-500">All records verified!</p>
            </div>
          )}
        </div>

        {/* Verification History */}
        <div className="card-premium p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-500" />
            Verification History
          </h2>
          
          {clinician.verifications.length > 0 ? (
            <div className="space-y-3">
              {clinician.verifications.map((verification) => (
                <div key={verification.id} className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-slate-900">{verification.patient.fullName}</p>
                      <p className="text-sm text-emerald-700 mt-1">
                        Verified: {verification.category.split(',').join(', ')}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{formatDate(verification.verifiedAt)}</p>
                    </div>
                    <span className="badge badge-verified">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  </div>
                  {verification.notes && (
                    <p className="text-sm text-slate-600 mt-2 p-2 bg-white rounded-lg">
                      {verification.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No verifications yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
