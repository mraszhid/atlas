import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { 
  Users, 
  Search,
  CheckCircle2,
  Clock,
  ArrowLeft,
  FileText,
  Eye,
  AlertTriangle
} from 'lucide-react'
import { formatDate, calculateAge } from '@/lib/utils'

export default async function ClinicPatientsPage() {
  const session = await getSession()
  if (!session || (session.role !== 'CLINIC_ADMIN' && session.role !== 'CLINIC_STAFF')) {
    redirect('/login')
  }

  const clinicStaff = await prisma.clinicStaff.findUnique({
    where: { userId: session.id },
    include: { 
      clinic: {
        include: {
          clinicPatients: {
            include: { 
              patient: {
                include: {
                  allergies: true,
                  medications: true,
                  conditions: true,
                },
              },
            },
            orderBy: { importedAt: 'desc' },
          },
        },
      },
    },
  })

  if (!clinicStaff) redirect('/login')

  const patients = clinicStaff.clinic.clinicPatients

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/clinic/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Patients</h1>
            <p className="text-slate-500">Manage patients at {clinicStaff.clinic.name}</p>
          </div>
          <Link href="/clinic/import" className="btn-primary">
            <Users className="w-5 h-5" />
            Import Patient
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="card-premium p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search patients by name, ID, or nationality..."
            className="input pl-12"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="stat-card">
          <div className="icon-box bg-blue-100">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <p className="value">{patients.length}</p>
          <p className="stat-label">Total Patients</p>
        </div>
        
        <div className="stat-card">
          <div className="icon-box bg-emerald-100">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="value">{patients.filter(p => p.status === 'ACTIVE').length}</p>
          <p className="stat-label">Active</p>
        </div>
        
        <div className="stat-card">
          <div className="icon-box bg-amber-100">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <p className="value">{patients.filter(p => p.status === 'PENDING').length}</p>
          <p className="stat-label">Pending</p>
        </div>
        
        <div className="stat-card">
          <div className="icon-box bg-violet-100">
            <FileText className="w-6 h-6 text-violet-600" />
          </div>
          <p className="value">{patients.filter(p => p.status === 'COMPLETED').length}</p>
          <p className="stat-label">Completed</p>
        </div>
      </div>

      {/* Patient List */}
      <div className="card-premium overflow-hidden">
        <table className="table-premium">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Health Summary</th>
              <th>Status</th>
              <th>Imported</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.length > 0 ? patients.map((cp) => (
              <tr key={cp.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {cp.patient.fullName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{cp.patient.fullName}</p>
                      <p className="text-sm text-slate-500">{cp.patient.nationality} • {calculateAge(cp.patient.dateOfBirth)} yrs</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex gap-2">
                    {cp.patient.allergies.length > 0 && (
                      <span className="badge badge-emergency">
                        <AlertTriangle className="w-3 h-3" />
                        {cp.patient.allergies.length} allergies
                      </span>
                    )}
                    <span className="badge badge-info">
                      {cp.patient.medications.length} meds
                    </span>
                  </div>
                </td>
                <td>
                  <span className={`badge ${
                    cp.status === 'ACTIVE' ? 'badge-verified' : 
                    cp.status === 'COMPLETED' ? 'badge-info' : 
                    'badge-gold'
                  }`}>
                    {cp.status}
                  </span>
                </td>
                <td>
                  <p className="text-sm text-slate-500">{formatDate(cp.importedAt)}</p>
                </td>
                <td>
                  <button className="btn-ghost btn-sm">
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="text-center py-12">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No patients yet</p>
                  <Link href="/clinic/import" className="btn-primary btn-sm mt-4">
                    Import First Patient
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
