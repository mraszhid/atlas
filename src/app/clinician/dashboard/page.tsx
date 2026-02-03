import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Shield,
  FileCheck,
  Activity,
  TrendingUp
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function ClinicianDashboard() {
  const session = await getSession()
  if (!session || session.role !== 'CLINICIAN') redirect('/login')

  const clinician = await prisma.clinician.findUnique({
    where: { userId: session.id },
    include: {
      verifications: {
        include: { patient: true },
        orderBy: { verifiedAt: 'desc' },
        take: 10,
      },
    },
  })

  if (!clinician) redirect('/login')

  // Get all patients for quick access
  const patients = await prisma.patient.findMany({
    take: 10,
    orderBy: { updatedAt: 'desc' },
    include: {
      allergies: true,
      medications: true,
      conditions: true,
    },
  })

  const totalVerifications = clinician.verifications.length
  const recentVerifications = clinician.verifications.slice(0, 5)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Welcome, {clinician.fullName} 👋
        </h1>
        <p className="text-slate-500">
          {clinician.institution} • {clinician.specialty}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="stat-card">
          <div className="icon-box bg-emerald-100">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="value">{totalVerifications}</p>
          <p className="stat-label">Total Verifications</p>
        </div>
        
        <div className="stat-card">
          <div className="icon-box bg-blue-100">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <p className="value">{patients.length}</p>
          <p className="stat-label">Patients in System</p>
        </div>
        
        <div className="stat-card">
          <div className="icon-box bg-violet-100">
            <Activity className="w-6 h-6 text-violet-600" />
          </div>
          <p className="value">{recentVerifications.filter(v => {
            const weekAgo = new Date()
            weekAgo.setDate(weekAgo.getDate() - 7)
            return v.verifiedAt > weekAgo
          }).length}</p>
          <p className="stat-label">This Week</p>
        </div>
        
        <div className="stat-card">
          <div className="icon-box bg-amber-100">
            <TrendingUp className="w-6 h-6 text-amber-600" />
          </div>
          <p className="value">98%</p>
          <p className="stat-label">Accuracy Rate</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Patients */}
        <div className="lg:col-span-2 card-premium p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Recent Patients</h2>
            <Link href="/clinician/patients" className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="space-y-3">
            {patients.slice(0, 5).map((patient) => (
              <Link 
                key={patient.id}
                href={`/clinician/patients?id=${patient.id}`}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    {patient.fullName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{patient.fullName}</p>
                    <p className="text-sm text-slate-500">
                      {patient.allergies.length} allergies • {patient.medications.length} medications • {patient.conditions.length} conditions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`badge ${patient.allergies.some(a => a.verified) ? 'badge-verified' : 'badge-unverified'}`}>
                    {patient.allergies.some(a => a.verified) ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions & Recent Verifications */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card-premium p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/clinician/patients" className="quick-action">
                <div className="icon-box bg-blue-100">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">Search Patients</p>
                  <p className="text-sm text-slate-500">Find and verify records</p>
                </div>
              </Link>
              
              <Link href="/clinician/patients" className="quick-action">
                <div className="icon-box bg-emerald-100">
                  <FileCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">Verify Records</p>
                  <p className="text-sm text-slate-500">Review pending items</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Verifications */}
          <div className="card-premium p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Verifications</h2>
            {recentVerifications.length > 0 ? (
              <div className="space-y-3">
                {recentVerifications.slice(0, 4).map((verification) => (
                  <div key={verification.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {verification.patient.fullName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {verification.category} • {formatDate(verification.verifiedAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No verifications yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Credentials Card */}
      <div className="mt-6 card-premium p-6 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-slate-900">{clinician.fullName}</p>
            <p className="text-sm text-slate-500">{clinician.specialty} • License #{clinician.licenseNumber}</p>
          </div>
          <div className="text-right">
            <span className="badge badge-verified">
              <CheckCircle2 className="w-3 h-3" /> Verified Provider
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
