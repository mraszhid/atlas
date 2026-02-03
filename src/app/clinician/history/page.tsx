import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { 
  History, 
  Eye,
  CheckCircle2,
  FileText,
  ArrowLeft,
  Clock
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function ClinicianHistoryPage() {
  const session = await getSession()
  if (!session || session.role !== 'CLINICIAN') redirect('/login')

  const clinician = await prisma.clinician.findUnique({
    where: { userId: session.id },
  })

  if (!clinician) redirect('/login')

  // Get audit logs where this clinician accessed patient records
  const accessLogs = await prisma.auditLog.findMany({
    where: {
      actorType: 'CLINICIAN',
      actorId: clinician.id,
    },
    include: {
      patient: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  // Demo data if no logs
  const demoLogs = [
    { id: '1', action: 'VIEW', category: 'patient_records', patientName: 'Muhammad Rashid', createdAt: new Date(Date.now() - 1000 * 60 * 30) },
    { id: '2', action: 'VERIFY', category: 'allergies,medications', patientName: 'Sarah Chen', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    { id: '3', action: 'VIEW', category: 'conditions', patientName: 'James Anderson', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) },
    { id: '4', action: 'VERIFY', category: 'medications', patientName: 'Maria Garcia', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48) },
    { id: '5', action: 'VIEW', category: 'emergency_info', patientName: 'Muhammad Rashid', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72) },
  ]

  const logsToShow = accessLogs.length > 0 ? accessLogs : demoLogs

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'VIEW': return <Eye className="w-4 h-4 text-blue-500" />
      case 'VERIFY': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      default: return <FileText className="w-4 h-4 text-slate-500" />
    }
  }

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'VIEW': return 'badge-info'
      case 'VERIFY': return 'badge-verified'
      default: return 'badge-unverified'
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/clinician/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Access History</h1>
        <p className="text-slate-500">View your patient record access history</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="stat-card">
          <div className="icon-box bg-blue-100">
            <Eye className="w-6 h-6 text-blue-600" />
          </div>
          <p className="value">{logsToShow.filter(l => l.action === 'VIEW').length}</p>
          <p className="stat-label">Records Viewed</p>
        </div>
        
        <div className="stat-card">
          <div className="icon-box bg-emerald-100">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="value">{logsToShow.filter(l => l.action === 'VERIFY').length}</p>
          <p className="stat-label">Verifications</p>
        </div>
        
        <div className="stat-card">
          <div className="icon-box bg-violet-100">
            <History className="w-6 h-6 text-violet-600" />
          </div>
          <p className="value">{logsToShow.length}</p>
          <p className="stat-label">Total Actions</p>
        </div>
      </div>

      {/* Access Log */}
      <div className="card-premium overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900">Recent Activity</h2>
        </div>
        
        <div className="divide-y divide-slate-100">
          {logsToShow.map((log: any) => (
            <div key={log.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                {getActionIcon(log.action)}
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">
                  {log.patient?.fullName || log.patientName}
                </p>
                <p className="text-sm text-slate-500">
                  {log.category?.replace(/_/g, ' ').replace(/,/g, ', ')}
                </p>
              </div>
              <div className="text-right">
                <span className={`badge ${getActionBadge(log.action)}`}>
                  {log.action}
                </span>
                <p className="text-xs text-slate-400 mt-1">
                  {formatDate(log.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
