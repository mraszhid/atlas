import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { 
  Users, 
  FileEdit, 
  Clock,
  ArrowRight,
  CheckCircle2,
  FileText,
  Building2,
  TrendingUp,
  Calendar,
  AlertCircle
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function ClinicDashboard() {
  const session = await getSession()
  if (!session || (session.role !== 'CLINIC_ADMIN' && session.role !== 'CLINIC_STAFF')) {
    redirect('/login')
  }

  const clinicStaff = await prisma.clinicStaff.findUnique({
    where: { userId: session.id },
    include: { 
      clinic: {
        include: {
          intakeForms: { orderBy: { createdAt: 'desc' } },
          clinicPatients: {
            include: { 
              patient: true,
              notes: {
                include: { staff: true },
                orderBy: { createdAt: 'desc' },
                take: 1,
              },
            },
            orderBy: { importedAt: 'desc' },
            take: 10,
          },
        },
      },
    },
  })

  if (!clinicStaff) redirect('/login')

  const clinic = clinicStaff.clinic
  const totalPatients = clinic.clinicPatients.length
  const activePatients = clinic.clinicPatients.filter(cp => cp.status === 'ACTIVE').length
  const pendingPatients = clinic.clinicPatients.filter(cp => cp.status === 'PENDING').length
  const totalForms = clinic.intakeForms.length
  const publishedForms = clinic.intakeForms.filter(f => f.isPublished).length

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Clinic Dashboard 🏥
            </h1>
            <p className="text-slate-500">
              {clinic.name} • {clinic.city}, {clinic.country}
            </p>
          </div>
          <Link href="/clinic/forms" className="btn-primary">
            <FileEdit className="w-5 h-5" />
            Manage Forms
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="stat-card">
          <div className="icon-box bg-blue-100">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <p className="value">{totalPatients}</p>
          <p className="stat-label">Total Patients</p>
        </div>
        
        <div className="stat-card">
          <div className="icon-box bg-emerald-100">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="value">{activePatients}</p>
          <p className="stat-label">Active Cases</p>
        </div>
        
        <div className="stat-card">
          <div className="icon-box bg-amber-100">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <p className="value">{pendingPatients}</p>
          <p className="stat-label">Pending Intake</p>
        </div>
        
        <div className="stat-card">
          <div className="icon-box bg-violet-100">
            <FileText className="w-6 h-6 text-violet-600" />
          </div>
          <p className="value">{publishedForms}/{totalForms}</p>
          <p className="stat-label">Published Forms</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <div className="lg:col-span-2 card-premium p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Recent Patients</h2>
            <Link href="/clinic/patients" className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {clinic.clinicPatients.length > 0 ? (
            <div className="space-y-3">
              {clinic.clinicPatients.map((cp) => (
                <div 
                  key={cp.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {cp.patient.fullName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{cp.patient.fullName}</p>
                      <p className="text-sm text-slate-500">{cp.patient.nationality}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`badge ${
                      cp.status === 'ACTIVE' ? 'badge-verified' : 
                      cp.status === 'COMPLETED' ? 'badge-info' : 
                      'badge-gold'
                    }`}>
                      {cp.status === 'ACTIVE' && <CheckCircle2 className="w-3 h-3" />}
                      {cp.status === 'PENDING' && <Clock className="w-3 h-3" />}
                      {cp.status}
                    </span>
                    <p className="text-xs text-slate-400 mt-1">
                      {formatDate(cp.importedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No patients imported yet</p>
              <p className="text-sm text-slate-400 mt-1">Share your intake form to start receiving patients</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card-premium p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/clinic/forms" className="quick-action">
                <div className="icon-box bg-violet-100">
                  <FileEdit className="w-5 h-5 text-violet-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">Create Form</p>
                  <p className="text-sm text-slate-500">Build intake forms</p>
                </div>
              </Link>
              
              <Link href="/clinic/import" className="quick-action">
                <div className="icon-box bg-blue-100">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">Import Patient</p>
                  <p className="text-sm text-slate-500">Add from ATLAS</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Intake Forms */}
          <div className="card-premium p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Intake Forms</h2>
            </div>
            
            {clinic.intakeForms.length > 0 ? (
              <div className="space-y-3">
                {clinic.intakeForms.slice(0, 3).map((form) => (
                  <div key={form.id} className="p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-slate-900 text-sm">{form.name}</p>
                      <span className={`badge ${form.isPublished ? 'badge-verified' : 'badge-unverified'}`}>
                        {form.isPublished ? 'Live' : 'Draft'}
                      </span>
                    </div>
                    {form.isPublished && form.shareToken && (
                      <p className="text-xs text-slate-500 font-mono truncate">
                        /intake/{form.shareToken}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No forms created</p>
              </div>
            )}
          </div>

          {/* Clinic Info */}
          <div className="card-premium p-6 bg-gradient-to-br from-violet-50 to-purple-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{clinic.name}</p>
                <p className="text-sm text-slate-500">{clinic.specialty}</p>
              </div>
            </div>
            <div className="text-sm text-slate-600 space-y-1">
              <p>📍 {clinic.address}</p>
              <p>📞 {clinic.phone}</p>
              <p>✉️ {clinic.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
