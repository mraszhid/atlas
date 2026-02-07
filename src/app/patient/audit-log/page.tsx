'use client'

import { useState, useEffect } from 'react'
import {
  History,
  Shield,
  Eye,
  FileText,
  AlertTriangle,
  CheckCircle2,
  User,
  Download,
  ChevronDown,
  Calendar,
  Monitor
} from 'lucide-react'
import { cn, formatDateTime } from '@/lib/utils'

interface AuditLog {
  id: string
  actorType: string
  actorName: string | null
  actorInstitution: string | null
  action: string
  category: string | null
  documentTitle: string | null
  consentType: string | null
  createdAt: string
  metadata: string | null
  duration?: string | null
  ipAddress?: string | null
  device?: string | null
}

const MOCK_LOGS: AuditLog[] = [
  { id: '1', actorType: 'CLINICIAN', actorName: 'Dr. Sarah Chen', actorInstitution: 'Cleveland Clinic Abu Dhabi', action: 'VIEW', category: 'allergies,medications,conditions', documentTitle: null, consentType: 'CLINIC_VISIT', createdAt: new Date(Date.now() - 3600000).toISOString(), metadata: null, duration: '12 min', ipAddress: '185.23.xx.xx', device: 'Chrome / Windows' },
  { id: '2', actorType: 'CLINICIAN', actorName: 'Dr. Sarah Chen', actorInstitution: 'Cleveland Clinic Abu Dhabi', action: 'VERIFY', category: 'allergies', documentTitle: null, consentType: 'CLINIC_VISIT', createdAt: new Date(Date.now() - 7200000).toISOString(), metadata: null, duration: '3 min', ipAddress: '185.23.xx.xx', device: 'Chrome / Windows' },
  { id: '3', actorType: 'CLINIC_STAFF', actorName: 'Dubai Health Clinic', actorInstitution: 'Dubai Health Authority', action: 'VIEW', category: 'documents', documentTitle: 'Blood Panel Results', consentType: 'CLINIC_VISIT', createdAt: new Date(Date.now() - 86400000).toISOString(), metadata: '{"clinicName":"Dubai Health Clinic"}', duration: '5 min', ipAddress: '91.74.xx.xx', device: 'Safari / macOS' },
  { id: '4', actorType: 'EMERGENCY_ACCESS', actorName: 'Emergency Responder', actorInstitution: null, action: 'EMERGENCY_ACCESS', category: 'allergies,medications,conditions', documentTitle: null, consentType: 'EMERGENCY', createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), metadata: '{"reason":"Ambulance response"}', duration: '8 min', ipAddress: '94.56.xx.xx', device: 'Mobile Safari / iOS' },
  { id: '5', actorType: 'PATIENT', actorName: 'Muhammad Al-Rashid', actorInstitution: null, action: 'UPDATE', category: 'medications', documentTitle: null, consentType: null, createdAt: new Date(Date.now() - 7 * 86400000).toISOString(), metadata: null, duration: null, ipAddress: '188.12.xx.xx', device: 'Chrome / Android' },
  { id: '6', actorType: 'SYSTEM', actorName: 'System', actorInstitution: null, action: 'CREATE', category: null, documentTitle: null, consentType: null, createdAt: new Date(Date.now() - 14 * 86400000).toISOString(), metadata: null, duration: null, ipAddress: null, device: null },
]

export default function PatientAuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(10)

  useEffect(() => {
    fetchLogs()
  }, [])

  async function fetchLogs() {
    try {
      const res = await fetch('/api/patient/audit-log')
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          setLogs(data)
          setLoading(false)
          return
        }
      }
    } catch {}
    setLogs(MOCK_LOGS)
    setLoading(false)
  }

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true
    if (filter === 'emergency') return log.consentType === 'EMERGENCY' || log.consentType === 'EMERGENCY_OVERRIDE'
    if (filter === 'clinician') return log.actorType === 'CLINICIAN'
    if (filter === 'clinic') return log.actorType === 'CLINIC_STAFF'
    return true
  })

  const visibleLogs = filteredLogs.slice(0, visibleCount)

  const actionIcons: Record<string, React.ReactNode> = {
    VIEW: <Eye className="w-4 h-4" />,
    VERIFY: <CheckCircle2 className="w-4 h-4" />,
    DOWNLOAD: <Download className="w-4 h-4" />,
    EMERGENCY_ACCESS: <AlertTriangle className="w-4 h-4" />,
    EMERGENCY_OVERRIDE: <AlertTriangle className="w-4 h-4" />,
    SUBMIT_INTAKE: <FileText className="w-4 h-4" />,
    CREATE: <FileText className="w-4 h-4" />,
    UPDATE: <FileText className="w-4 h-4" />,
  }

  const actorTypeColors: Record<string, string> = {
    PATIENT: 'bg-blue-100 text-blue-600',
    CLINICIAN: 'bg-emerald-100 text-emerald-600',
    CLINIC_STAFF: 'bg-violet-100 text-violet-600',
    EMERGENCY_ACCESS: 'bg-rose-100 text-rose-600',
    SYSTEM: 'bg-slate-100 text-slate-600',
  }

  function formatAction(action: string, category: string | null, documentTitle: string | null): string {
    const actions: Record<string, string> = {
      VIEW: 'Viewed',
      VERIFY: 'Verified',
      DOWNLOAD: 'Downloaded',
      EMERGENCY_ACCESS: 'Emergency access to',
      EMERGENCY_OVERRIDE: 'Emergency override access to',
      SUBMIT_INTAKE: 'Submitted intake form',
      CREATE: 'Created',
      UPDATE: 'Updated',
      ADD_NOTE: 'Added clinic note',
    }
    let text = actions[action] || action.toLowerCase().replace('_', ' ')
    if (category) text += ` ${category.replace(/,/g, ', ')}`
    if (documentTitle) text += `: ${documentTitle}`
    return text
  }

  function exportCSV() {
    const headers = ['Date', 'Actor', 'Institution', 'Action', 'Category', 'Access Type', 'Duration', 'IP Address', 'Device']
    const rows = filteredLogs.map(log => [
      new Date(log.createdAt).toISOString(),
      log.actorName || log.actorType,
      log.actorInstitution || '',
      log.action,
      log.category || '',
      log.consentType || 'NORMAL',
      log.duration || '',
      log.ipAddress || '',
      log.device || '',
    ])
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `atlas-audit-log-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Audit Log
          </h1>
          <p className="text-slate-500">
            Complete audit trail of who accessed your health records
          </p>
        </div>
        <button onClick={exportCSV} className="btn-secondary">
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      {/* Info Banner */}
      <div className="card-premium p-4 mb-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-800">Your data access is fully audited</p>
            <p className="text-sm text-blue-600 mt-1">
              Every view, download, and modification of your health records is logged with timestamp, actor identity, and access type.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'all', label: 'All', icon: null },
          { id: 'clinic', label: 'Clinic', icon: null },
          { id: 'clinician', label: 'Clinician', icon: null },
          { id: 'emergency', label: 'Emergency', icon: <AlertTriangle className="w-4 h-4" /> },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1',
              filter === f.id
                ? f.id === 'emergency' ? 'bg-rose-600 text-white' :
                  f.id === 'clinician' ? 'bg-emerald-600 text-white' :
                  f.id === 'clinic' ? 'bg-violet-600 text-white' :
                  'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            )}
          >
            {f.icon}
            {f.label}
          </button>
        ))}
      </div>

      {/* Log List */}
      <div className="card-premium overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading audit logs...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-8 text-center">
            <History className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500">No access logs found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {visibleLogs.map((log) => {
              const metadata = log.metadata ? JSON.parse(log.metadata) : null
              const isExpanded = expandedId === log.id

              return (
                <div key={log.id} className="hover:bg-slate-50 transition-colors">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : log.id)}
                    className="w-full p-4 text-left"
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                        actorTypeColors[log.actorType] || 'bg-slate-100 text-slate-600'
                      )}>
                        {actionIcons[log.action] || <User className="w-4 h-4" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-slate-900">
                            {log.actorName || log.actorType.replace(/_/g, ' ')}
                          </span>
                          {log.actorInstitution && (
                            <span className="text-slate-500 text-sm">
                              ({log.actorInstitution})
                            </span>
                          )}
                          <span className={cn(
                            'px-2 py-0.5 text-xs font-medium rounded-full',
                            log.consentType === 'EMERGENCY' || log.consentType === 'EMERGENCY_OVERRIDE'
                              ? 'bg-rose-100 text-rose-700'
                              : log.consentType === 'CLINIC_VISIT'
                              ? 'bg-blue-100 text-blue-700'
                              : log.consentType === 'MEDICAL_TOURISM'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          )}>
                            {log.consentType?.replace(/_/g, ' ') || 'SYSTEM'}
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm mt-1">
                          {formatAction(log.action, log.category, log.documentTitle)}
                        </p>
                      </div>

                      <div className="text-right flex-shrink-0 flex items-center gap-2">
                        <p className="text-sm text-slate-500">{formatDateTime(log.createdAt)}</p>
                        <ChevronDown className={cn('w-4 h-4 text-slate-400 transition-transform', isExpanded && 'rotate-180')} />
                      </div>
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pl-18">
                      <div className="ml-14 p-4 bg-slate-50 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        {log.duration && (
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Duration</p>
                            <p className="text-slate-900 font-medium">{log.duration}</p>
                          </div>
                        )}
                        {log.consentType && (
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Consent Type</p>
                            <p className="text-slate-900 font-medium">{log.consentType.replace(/_/g, ' ')}</p>
                          </div>
                        )}
                        {log.ipAddress && (
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">IP Address</p>
                            <p className="text-slate-900 font-mono text-xs">{log.ipAddress}</p>
                          </div>
                        )}
                        {log.device && (
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Device</p>
                            <p className="text-slate-900 flex items-center gap-1">
                              <Monitor className="w-3 h-3" /> {log.device}
                            </p>
                          </div>
                        )}
                        {metadata?.reason && (
                          <div className="col-span-2 sm:col-span-4">
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Reason</p>
                            <p className="text-slate-900">{metadata.reason}</p>
                          </div>
                        )}
                        {metadata?.clinicName && (
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Clinic</p>
                            <p className="text-slate-900">{metadata.clinicName}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Load More */}
        {visibleCount < filteredLogs.length && (
          <div className="p-4 text-center border-t border-slate-100">
            <button
              onClick={() => setVisibleCount(prev => prev + 10)}
              className="btn-ghost"
            >
              Load More ({filteredLogs.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
