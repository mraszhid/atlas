import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { 
  History, 
  Eye,
  Download,
  FileText,
  ArrowLeft,
  Users
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function ClinicHistoryPage() {
  const session = await getSession()
  if (!session || (session.role !== 'CLINIC_ADMIN' && session.role !== 'CLINIC_STAFF')) {
    redirect('/login')
  }

  const clinicStaff = await prisma.clinicStaff.findUnique({
    where: { userId: session.id },
    include: { clinic: true },
  })

  if (!clinicStaff) redirect('/login')

  // Demo access logs
  const accessLogs = [
    { id: '1', action: 'IMPORT', patientName: 'Muhammad Rashid', staffName: clinicStaff.fullName, createdAt: new Date(Date.now() - 1000 * 60 * 30) },
    { id: '2', action: 'VIEW', patientName: 'Sarah Chen', staffName: clinicStaff.fullName, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    { id: '3', action: 'IMPORT', patientName: 'James Anderson', staffName: 'Nurse Priya Sharma', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) },
    { id: '4', action: 'VIEW', patientName: 'Maria Garcia', staffName: clinicStaff.fullName, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48) },
    { id: '5', action: 'FORM_SENT', patientName: 'New Patient', staffName: clinicStaff.fullName, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72) },
    { id: '6', action: 'VIEW', patientName: 'Muhammad Rashid', staffName: 'Nurse Priya Sharma', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96) },
  ]

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'VIEW': return <Eye className="w-4 h-4 text-blue-500" />
      case 'IMPORT': return <Download className="w-4 h-4 text-emerald-500" />
      case 'FORM_SENT': return <FileText className="w-4 h-4 text-violet-500" />
      default: return <History className="w-4 h-4 text-slate-500" />
    }
  }

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'VIEW': return 'Viewed records'
      case 'IMPORT': return 'Imported patient'
      case 'FORM_SENT': return 'Sent intake form'
      default: return action
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/clinic/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Access History</h1>
        <p className="text-slate-500">View clinic access and activity logs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="stat-card">
          <div className="icon-box bg-blue-100">
            <Eye className="w-6 h-6 text-blue-600" />
          </div>
          <p className="value">{accessLogs.filter(l => l.action === 'VIEW').length}</p>
          <p className="stat-label">Records Viewed</p>
        </div>
        
        <div className="stat-card">
          <div className="icon-box bg-emerald-100">
            <Download className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="value">{accessLogs.filter(l => l.action === 'IMPORT').length}</p>
          <p className="stat-label">Patients Imported</p>
        </div>
        
        <div className="stat-card">
          <div className="icon-box bg-violet-100">
            <FileText className="w-6 h-6 text-violet-600" />
          </div>
          <p className="value">{accessLogs.filter(l => l.action === 'FORM_SENT').length}</p>
          <p className="stat-label">Forms Sent</p>
        </div>
        
        <div className="stat-card">
          <div className="icon-box bg-amber-100">
            <Users className="w-6 h-6 text-amber-600" />
          </div>
          <p className="value">2</p>
          <p className="stat-label">Active Staff</p>
        </div>
      </div>

      {/* Access Log */}
      <div className="card-premium overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Recent Activity</h2>
          <span className="text-sm text-slate-500">{clinicStaff.clinic.name}</span>
        </div>
        
        <div className="divide-y divide-slate-100">
          {accessLogs.map((log) => (
            <div key={log.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                {getActionIcon(log.action)}
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">{log.patientName}</p>
                <p className="text-sm text-slate-500">{getActionLabel(log.action)} by {log.staffName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">{formatDate(log.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
