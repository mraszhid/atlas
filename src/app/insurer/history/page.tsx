import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { 
  History, 
  Eye,
  CheckCircle2,
  FileCheck,
  ArrowLeft,
  Shield,
  Search,
  XCircle
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function InsurerHistoryPage() {
  const session = await getSession()
  if (!session || session.role !== 'INSURER') redirect('/login')

  const insurer = await prisma.insurer.findUnique({
    where: { userId: session.id },
  })

  if (!insurer) redirect('/login')

  // Demo access logs
  const accessLogs = [
    { id: '1', action: 'VERIFY', patientName: 'Muhammad Rashid', policyNumber: 'GTI-2024-78392', createdAt: new Date(Date.now() - 1000 * 60 * 30) },
    { id: '2', action: 'CLAIM_REVIEW', patientName: 'Sarah Chen', policyNumber: 'GTI-2024-12847', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    { id: '3', action: 'VERIFY', patientName: 'James Anderson', policyNumber: 'GTI-2024-93421', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5) },
    { id: '4', action: 'CLAIM_APPROVE', patientName: 'Sarah Chen', policyNumber: 'GTI-2024-12847', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) },
    { id: '5', action: 'COVERAGE_CHECK', patientName: 'Maria Garcia', policyNumber: 'GTI-2024-45678', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48) },
    { id: '6', action: 'CLAIM_DENY', patientName: 'Maria Garcia', policyNumber: 'GTI-2024-45678', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50) },
    { id: '7', action: 'VERIFY', patientName: 'Muhammad Rashid', policyNumber: 'GTI-2024-78392', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72) },
    { id: '8', action: 'CLAIM_APPROVE', patientName: 'James Anderson', policyNumber: 'GTI-2024-93421', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96) },
  ]

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'VERIFY': return <Shield className="w-4 h-4 text-blue-500" />
      case 'CLAIM_REVIEW': return <Eye className="w-4 h-4 text-amber-500" />
      case 'CLAIM_APPROVE': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      case 'CLAIM_DENY': return <XCircle className="w-4 h-4 text-rose-500" />
      case 'COVERAGE_CHECK': return <Search className="w-4 h-4 text-violet-500" />
      default: return <History className="w-4 h-4 text-slate-500" />
    }
  }

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'VERIFY': return 'Verified identity'
      case 'CLAIM_REVIEW': return 'Reviewed claim'
      case 'CLAIM_APPROVE': return 'Approved claim'
      case 'CLAIM_DENY': return 'Denied claim'
      case 'COVERAGE_CHECK': return 'Checked coverage'
      default: return action
    }
  }

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'VERIFY': return 'badge-info'
      case 'CLAIM_APPROVE': return 'badge-verified'
      case 'CLAIM_DENY': return 'badge-emergency'
      default: return 'badge-gold'
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/insurer/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Access History</h1>
        <p className="text-slate-500">View verification and claims activity log</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="stat-card">
          <div className="icon-box bg-blue-100">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <p className="value">{accessLogs.filter(l => l.action === 'VERIFY').length}</p>
          <p className="stat-label">Verifications</p>
        </div>
        
        <div className="stat-card">
          <div className="icon-box bg-emerald-100">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="value">{accessLogs.filter(l => l.action === 'CLAIM_APPROVE').length}</p>
          <p className="stat-label">Claims Approved</p>
        </div>
        
        <div className="stat-card">
          <div className="icon-box bg-rose-100">
            <XCircle className="w-6 h-6 text-rose-600" />
          </div>
          <p className="value">{accessLogs.filter(l => l.action === 'CLAIM_DENY').length}</p>
          <p className="stat-label">Claims Denied</p>
        </div>
        
        <div className="stat-card">
          <div className="icon-box bg-violet-100">
            <History className="w-6 h-6 text-violet-600" />
          </div>
          <p className="value">{accessLogs.length}</p>
          <p className="stat-label">Total Actions</p>
        </div>
      </div>

      {/* Access Log */}
      <div className="card-premium overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Recent Activity</h2>
          <span className="text-sm text-slate-500">{insurer.companyName}</span>
        </div>
        
        <div className="divide-y divide-slate-100">
          {accessLogs.map((log) => (
            <div key={log.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                {getActionIcon(log.action)}
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">{log.patientName}</p>
                <p className="text-sm text-slate-500">
                  {getActionLabel(log.action)} • Policy: {log.policyNumber}
                </p>
              </div>
              <div className="text-right">
                <span className={`badge ${getActionBadge(log.action)}`}>
                  {log.action.replace('_', ' ')}
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
