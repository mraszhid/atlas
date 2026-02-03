'use client'

import { useState, useEffect } from 'react'
import { 
  Share2, 
  Shield, 
  Clock, 
  Copy, 
  QrCode,
  CheckCircle2,
  Link as LinkIcon,
  Eye,
  Trash2,
  Plus,
  AlertTriangle
} from 'lucide-react'
import { cn, formatDateTime, shareModeLabels, consentDurations } from '@/lib/utils'

interface ConsentLink {
  id: string
  token: string
  shareMode: string
  duration: number
  expiresAt: string
  revokedAt: string | null
  accessedCount: number
  createdAt: string
}

interface SharingPermission {
  shareMode: string
  allergies: boolean
  medications: boolean
  conditions: boolean
  surgeries: boolean
  vaccinations: boolean
  labResults: boolean
  documents: boolean
  insurance: boolean
  advanceDirective: boolean
}

export default function SharingPage() {
  const [permissions, setPermissions] = useState<SharingPermission[]>([])
  const [consentLinks, setConsentLinks] = useState<ConsentLink[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedMode, setSelectedMode] = useState<string>('EMERGENCY')

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [permRes, linksRes] = await Promise.all([
        fetch('/api/patient/sharing/permissions'),
        fetch('/api/patient/sharing/links'),
      ])
      const perms = permRes.ok ? await permRes.json() : []
      const links = linksRes.ok ? await linksRes.json() : []
      setPermissions(Array.isArray(perms) ? perms : [])
      setConsentLinks(Array.isArray(links) ? links : [])
    } catch (error) {
      console.error('Error fetching sharing data:', error)
      setPermissions([])
      setConsentLinks([])
    }
    setLoading(false)
  }

  async function createLink(mode: string, duration: number) {
    const res = await fetch('/api/patient/sharing/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shareMode: mode, duration }),
    })
    if (res.ok) {
      fetchData()
      setShowCreateModal(false)
    }
  }

  async function revokeLink(linkId: string) {
    if (!confirm('Revoke this share link?')) return
    await fetch(`/api/patient/sharing/links/${linkId}`, { method: 'DELETE' })
    fetchData()
  }

  async function updatePermission(mode: string, field: string, value: boolean) {
    await fetch('/api/patient/sharing/permissions', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shareMode: mode, [field]: value }),
    })
    fetchData()
  }

  const activeLinks = consentLinks.filter(l => !l.revokedAt && new Date(l.expiresAt) > new Date())

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-clinical-900 mb-2">
          Sharing & Consent
        </h1>
        <p className="text-clinical-500">
          Control who can access your health information and for how long
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Share Links */}
          <div className="atlas-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-clinical-900 flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-atlas-500" />
                Active Share Links
              </h2>
              <button onClick={() => setShowCreateModal(true)} className="btn-primary btn-sm">
                <Plus className="w-4 h-4" />
                Create Link
              </button>
            </div>

            {loading ? (
              <div className="py-8 text-center text-clinical-500">Loading...</div>
            ) : activeLinks.length === 0 ? (
              <div className="py-8 text-center">
                <Share2 className="w-12 h-12 text-clinical-300 mx-auto mb-3" />
                <p className="text-clinical-500">No active share links</p>
                <button onClick={() => setShowCreateModal(true)} className="text-atlas-600 hover:text-atlas-700 text-sm mt-2">
                  Create your first share link
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {activeLinks.map((link) => (
                  <div key={link.id} className="p-4 bg-clinical-50 rounded-lg border border-clinical-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className={cn(
                          'px-2 py-1 text-xs font-medium rounded-full',
                          link.shareMode === 'EMERGENCY' ? 'bg-alert-100 text-alert-700' :
                          link.shareMode === 'MEDICAL_TOURISM' ? 'bg-purple-100 text-purple-700' :
                          'bg-atlas-100 text-atlas-700'
                        )}>
                          {shareModeLabels[link.shareMode]?.label || link.shareMode}
                        </span>
                        <div className="mt-2 flex items-center gap-2">
                          <code className="text-sm bg-white px-2 py-1 rounded border font-mono">
                            {link.token.substring(0, 12)}...
                          </code>
                          <button 
                            onClick={() => navigator.clipboard.writeText(`${window.location.origin}/share/${link.token}`)}
                            className="p-1 text-clinical-400 hover:text-clinical-600"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => revokeLink(link.id)}
                        className="text-alert-600 hover:text-alert-700 text-sm"
                      >
                        Revoke
                      </button>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-xs text-clinical-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Expires {formatDateTime(link.expiresAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {link.accessedCount} views
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sharing Permissions by Mode */}
          <div className="atlas-card p-6">
            <h2 className="text-lg font-semibold text-clinical-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-medical-500" />
              Sharing Permissions
            </h2>
            
            <div className="flex gap-2 mb-6">
              {Object.entries(shareModeLabels).map(([mode, { label }]) => (
                <button
                  key={mode}
                  onClick={() => setSelectedMode(mode)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    selectedMode === mode
                      ? mode === 'EMERGENCY' ? 'bg-alert-500 text-white' :
                        mode === 'MEDICAL_TOURISM' ? 'bg-purple-500 text-white' :
                        'bg-atlas-500 text-white'
                      : 'bg-clinical-100 text-clinical-600 hover:bg-clinical-200'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            {permissions.length > 0 && (
              <PermissionGrid
                permission={permissions.find(p => p.shareMode === selectedMode)}
                onUpdate={(field, value) => updatePermission(selectedMode, field, value)}
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Share Mode Info */}
          <div className="atlas-card p-6">
            <h3 className="font-semibold text-clinical-900 mb-4">Share Modes Explained</h3>
            <div className="space-y-4">
              {Object.entries(shareModeLabels).map(([mode, { label, description }]) => (
                <div key={mode} className="pb-4 border-b border-clinical-100 last:border-0 last:pb-0">
                  <p className="font-medium text-clinical-900">{label}</p>
                  <p className="text-sm text-clinical-500">{description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Security Info */}
          <div className="atlas-card p-6 bg-medical-50 border-medical-200">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-medical-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-medical-800">Zero-Trust Sharing</p>
                <p className="text-sm text-medical-600 mt-1">
                  All share links are time-limited, revocable instantly, and every access is logged for your review.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Link Modal */}
      {showCreateModal && (
        <CreateLinkModal
          onClose={() => setShowCreateModal(false)}
          onCreate={createLink}
        />
      )}
    </div>
  )
}

function PermissionGrid({ 
  permission, 
  onUpdate 
}: { 
  permission?: SharingPermission
  onUpdate: (field: string, value: boolean) => void 
}) {
  if (!permission) return null

  const fields = [
    { key: 'allergies', label: 'Allergies' },
    { key: 'medications', label: 'Medications' },
    { key: 'conditions', label: 'Conditions' },
    { key: 'surgeries', label: 'Surgeries' },
    { key: 'vaccinations', label: 'Vaccinations' },
    { key: 'labResults', label: 'Lab Results' },
    { key: 'documents', label: 'Documents' },
    { key: 'insurance', label: 'Insurance' },
    { key: 'advanceDirective', label: 'Advance Directive' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {fields.map((field) => (
        <label
          key={field.key}
          className={cn(
            'flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors',
            permission[field.key as keyof SharingPermission]
              ? 'border-medical-500 bg-medical-50'
              : 'border-clinical-200 hover:border-clinical-300'
          )}
        >
          <input
            type="checkbox"
            checked={permission[field.key as keyof SharingPermission] as boolean}
            onChange={(e) => onUpdate(field.key, e.target.checked)}
            className="w-5 h-5 rounded border-clinical-300 text-medical-600"
          />
          <span className="text-sm text-clinical-900">{field.label}</span>
        </label>
      ))}
    </div>
  )
}

function CreateLinkModal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (mode: string, duration: number) => void
}) {
  const [mode, setMode] = useState('CLINIC_VISIT')
  const [duration, setDuration] = useState(1440)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-clinical-900 mb-4">Create Share Link</h3>
        
        <div className="space-y-4">
          <div>
            <label className="label">Share Mode</label>
            <div className="space-y-2">
              {Object.entries(shareModeLabels).map(([key, { label, description }]) => (
                <label
                  key={key}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer',
                    mode === key ? 'border-atlas-500 bg-atlas-50' : 'border-clinical-200'
                  )}
                >
                  <input
                    type="radio"
                    name="mode"
                    value={key}
                    checked={mode === key}
                    onChange={() => setMode(key)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-clinical-900">{label}</p>
                    <p className="text-sm text-clinical-500">{description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="input"
            >
              {consentDurations.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={() => onCreate(mode, duration)} className="btn-primary flex-1">
            Create Link
          </button>
        </div>
      </div>
    </div>
  )
}
