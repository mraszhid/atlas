'use client'

import { useState, useEffect } from 'react'
import { 
  History, 
  Shield, 
  Eye, 
  FileText, 
  AlertTriangle,
  CheckCircle2,
  Building2,
  User,
  Download
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
}

export default function PatientAuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchLogs()
  }, [])

  async function fetchLogs() {
    try {
      const res = await fetch('/api/patient/audit-log')
      if (!res.ok) {
        setLogs([])
        setLoading(false)
        return
      }
      const data = await res.json()
      if (Array.isArray(data)) {
        setLogs(data)
      } else {
        setLogs([])
      }
    } catch (error) {
      console.error('Error fetching logs:', error)
      setLogs([])
    }
    setLoading(false)
  }

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true
    if (filter === 'emergency') return log.consentType === 'EMERGENCY' || log.consentType === 'EMERGENCY_OVERRIDE'
    if (filter === 'clinician') return log.actorType === 'CLINICIAN'
    if (filter === 'clinic') return log.actorType === 'CLINIC_STAFF'
    return true
  })

  const actionIcons: Record<string, React.ReactNode> = {
    VIEW: <Eye className="w-4 h-4" />,
    VERIFY: <CheckCircle2 className="w-4 h-4" />,
    DOWNLOAD: <Download className="w-4 h-4" />,
    EMERGENCY_ACCESS: <AlertTriangle className="w-4 h-4" />,
    EMERGENCY_OVERRIDE: <AlertTriangle className="w-4 h-4" />,
    SUBMIT_INTAKE: <FileText className="w-4 h-4" />,
    IMPORT: <Building2 className="w-4 h-4" />,
  }

  const actorTypeColors: Record<string, string> = {
    PATIENT: 'bg-atlas-100 text-atlas-600',
    CLINICIAN: 'bg-medical-100 text-medical-600',
    INSURER: 'bg-clinical-100 text-clinical-600',
    CLINIC_STAFF: 'bg-purple-100 text-purple-600',
    EMERGENCY_ACCESS: 'bg-alert-100 text-alert-600',
    SYSTEM: 'bg-clinical-100 text-clinical-600',
  }

  function formatAction(action: string, category: string | null, documentTitle: string | null): string {
    const actions: Record<string, string> = {
      VIEW: 'Viewed',
      VERIFY: 'Verified',
      DOWNLOAD: 'Downloaded',
      EMERGENCY_ACCESS: 'Emergency access to',
      EMERGENCY_OVERRIDE: 'Emergency override access to',
      SUBMIT_INTAKE: 'Submitted intake form',
      IMPORT: 'Imported into clinic system',
      CREATE: 'Created',
      UPDATE: 'Updated',
      ADD_NOTE: 'Added clinic note',
      IMPORT_EMR: 'Imported from EMR',
    }

    let text = actions[action] || action.toLowerCase().replace('_', ' ')
    
    if (category) {
      text += ` ${category.replace(',', ', ')}`
    }
    if (documentTitle) {
      text += `: ${documentTitle}`
    }
    
    return text
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-clinical-900 mb-2">
          Access History
        </h1>
        <p className="text-clinical-500">
          Complete audit trail of who accessed your health records
        </p>
      </div>

      {/* Info Banner */}
      <div className="atlas-card p-4 mb-6 bg-atlas-50 border-atlas-200">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-atlas-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-atlas-800">Your data access is fully audited</p>
            <p className="text-sm text-atlas-600 mt-1">
              Every view, download, and modification of your health records is logged with timestamp, 
              actor identity, and access type for your security.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            filter === 'all' ? 'bg-atlas-600 text-white' : 'bg-clinical-100 text-clinical-600 hover:bg-clinical-200'
          )}
        >
          All Activity
        </button>
        <button
          onClick={() => setFilter('emergency')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1',
            filter === 'emergency' ? 'bg-alert-600 text-white' : 'bg-clinical-100 text-clinical-600 hover:bg-clinical-200'
          )}
        >
          <AlertTriangle className="w-4 h-4" />
          Emergency
        </button>
        <button
          onClick={() => setFilter('clinician')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            filter === 'clinician' ? 'bg-medical-600 text-white' : 'bg-clinical-100 text-clinical-600 hover:bg-clinical-200'
          )}
        >
          Clinicians
        </button>
        <button
          onClick={() => setFilter('clinic')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            filter === 'clinic' ? 'bg-purple-600 text-white' : 'bg-clinical-100 text-clinical-600 hover:bg-clinical-200'
          )}
        >
          Clinics
        </button>
      </div>

      {/* Log List */}
      <div className="atlas-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-clinical-500">Loading audit logs...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-clinical-500">
            <History className="w-12 h-12 mx-auto mb-4 text-clinical-300" />
            <p>No access logs found</p>
          </div>
        ) : (
          <div className="divide-y divide-clinical-100">
            {filteredLogs.map((log) => {
              const metadata = log.metadata ? JSON.parse(log.metadata) : null
              
              return (
                <div key={log.id} className="p-4 hover:bg-clinical-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                      actorTypeColors[log.actorType] || 'bg-clinical-100 text-clinical-600'
                    )}>
                      {actionIcons[log.action] || <User className="w-4 h-4" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-clinical-900">
                          {log.actorName || log.actorType.replace('_', ' ')}
                        </span>
                        {log.actorInstitution && (
                          <span className="text-clinical-500 text-sm">
                            ({log.actorInstitution})
                          </span>
                        )}
                        <span className={cn(
                          'px-2 py-0.5 text-xs font-medium rounded-full',
                          log.consentType === 'EMERGENCY' || log.consentType === 'EMERGENCY_OVERRIDE'
                            ? 'bg-alert-100 text-alert-700'
                            : log.consentType === 'MEDICAL_TOURISM'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-clinical-100 text-clinical-600'
                        )}>
                          {log.consentType?.replace('_', ' ') || 'NORMAL'}
                        </span>
                      </div>

                      <p className="text-clinical-600 mt-1">
                        {formatAction(log.action, log.category, log.documentTitle)}
                      </p>

                      {metadata && (
                        <div className="mt-2 text-xs text-clinical-500">
                          {metadata.clinicName && <span>Clinic: {metadata.clinicName} • </span>}
                          {metadata.formName && <span>Form: {metadata.formName} • </span>}
                          {metadata.reason && <span>Reason: {metadata.reason}</span>}
                        </div>
                      )}
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-sm text-clinical-500">{formatDateTime(log.createdAt)}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
