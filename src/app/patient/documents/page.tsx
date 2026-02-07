'use client'

import { useState, useEffect } from 'react'
import {
  FileText,
  Upload,
  Search,
  Eye,
  Download,
  Trash2,
  X,
  Pencil,
  FileImage,
  MoreVertical
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'

interface Document {
  id: string
  title: string
  type: string
  date: string | null
  provider: string | null
  facility: string | null
  country: string | null
  tags: string | null
  notes: string | null
  fileName: string
  fileSize: number | null
  shareEmergency: boolean
  shareClinicVisit: boolean
  isPrivate: boolean
  createdAt: string
}

const TYPE_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  labs: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Lab Report' },
  discharge_summary: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Discharge Summary' },
  prescription: { bg: 'bg-rose-100', text: 'text-rose-700', label: 'Prescription' },
  imaging: { bg: 'bg-violet-100', text: 'text-violet-700', label: 'Imaging' },
  operative_notes: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Operative Notes' },
  consult_letter: { bg: 'bg-cyan-100', text: 'text-cyan-700', label: 'Consultation' },
  vaccination_record: { bg: 'bg-teal-100', text: 'text-teal-700', label: 'Vaccination' },
  other: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Other' },
}

const MOCK_DOCUMENTS: Document[] = [
  { id: '1', title: 'Blood Panel Results - January 2025', type: 'labs', date: '2025-01-15', provider: 'Dr. Sarah Chen', facility: 'Cleveland Clinic Abu Dhabi', country: 'UAE', tags: 'blood work,annual', notes: null, fileName: 'blood-panel-jan2025.pdf', fileSize: 245000, shareEmergency: false, shareClinicVisit: true, isPrivate: false, createdAt: '2025-01-16T10:00:00Z' },
  { id: '2', title: 'HbA1c Results - December 2024', type: 'labs', date: '2024-12-20', provider: 'Dr. Sarah Chen', facility: 'Cleveland Clinic Abu Dhabi', country: 'UAE', tags: 'diabetes,hba1c', notes: 'HbA1c at 7.2%', fileName: 'hba1c-dec2024.pdf', fileSize: 180000, shareEmergency: true, shareClinicVisit: true, isPrivate: false, createdAt: '2024-12-21T10:00:00Z' },
  { id: '3', title: 'Hospital Discharge - Nov 2024', type: 'discharge_summary', date: '2024-11-10', provider: 'Dr. Ahmed Hassan', facility: 'Dubai Health Authority', country: 'UAE', tags: 'discharge', notes: null, fileName: 'discharge-nov2024.pdf', fileSize: 320000, shareEmergency: true, shareClinicVisit: true, isPrivate: false, createdAt: '2024-11-11T10:00:00Z' },
  { id: '4', title: 'Metformin Prescription', type: 'prescription', date: '2024-12-15', provider: 'Dr. Sarah Chen', facility: 'Cleveland Clinic Abu Dhabi', country: 'UAE', tags: 'metformin,diabetes', notes: null, fileName: 'rx-metformin.pdf', fileSize: 95000, shareEmergency: false, shareClinicVisit: true, isPrivate: false, createdAt: '2024-12-15T10:00:00Z' },
  { id: '5', title: 'Chest X-Ray', type: 'imaging', date: '2024-10-05', provider: 'Dr. Fatima Al-Zahra', facility: 'Mediclinic Dubai', country: 'UAE', tags: 'xray,chest', notes: 'Clear, no abnormalities', fileName: 'cxr-oct2024.jpg', fileSize: 1500000, shareEmergency: false, shareClinicVisit: true, isPrivate: false, createdAt: '2024-10-06T10:00:00Z' },
]

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)

  useEffect(() => {
    fetchDocuments()
  }, [])

  async function fetchDocuments() {
    try {
      const res = await fetch('/api/patient/documents')
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          setDocuments(data)
          setLoading(false)
          return
        }
      }
    } catch {}
    setDocuments(MOCK_DOCUMENTS)
    setLoading(false)
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.provider?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || doc.type === typeFilter
    return matchesSearch && matchesType
  })

  const typeCounts = documents.reduce((acc, doc) => {
    acc[doc.type] = (acc[doc.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  async function toggleVisibility(docId: string, field: 'shareEmergency' | 'shareClinicVisit' | 'isPrivate') {
    setDocuments(prev => prev.map(d => {
      if (d.id !== docId) return d
      const updated = { ...d, [field]: !d[field] }
      if (field === 'isPrivate' && !d.isPrivate) {
        updated.shareEmergency = false
        updated.shareClinicVisit = false
      }
      return updated
    }))
    fetch(`/api/patient/documents/${docId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: !documents.find(d => d.id === docId)?.[field] }),
    }).catch(() => {})
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Document Vault
          </h1>
          <p className="text-slate-500">
            Upload, organize, and control access to your medical records
          </p>
        </div>
        <button onClick={() => setShowUploadModal(true)} className="btn-primary">
          <Upload className="w-5 h-5" />
          Upload Document
        </button>
      </div>

      {/* Document Count by Category */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 flex-wrap">
        <button
          onClick={() => setTypeFilter('all')}
          className={cn(
            'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
            typeFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          )}
        >
          All ({documents.length})
        </button>
        {Object.entries(TYPE_COLORS).map(([type, { bg, text, label }]) => {
          const count = typeCounts[type] || 0
          if (count === 0) return null
          return (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                typeFilter === type ? cn(bg, text) : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              {label} ({count})
            </button>
          )
        })}
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="input pl-10"
            aria-label="Search documents"
          />
        </div>
      </div>

      {/* Document Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="card-premium p-4 animate-pulse">
              <div className="h-12 bg-slate-200 rounded-lg mb-3" />
              <div className="h-4 w-3/4 bg-slate-200 rounded mb-2" />
              <div className="h-3 w-1/2 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="card-premium p-12 text-center">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-700 mb-2">No Documents Found</h3>
          <p className="text-slate-500 mb-6">
            {searchQuery || typeFilter !== 'all'
              ? 'Try adjusting your search or filter'
              : 'Upload your first medical document to get started'}
          </p>
          <button onClick={() => setShowUploadModal(true)} className="btn-primary">
            <Upload className="w-5 h-5" />
            Upload Document
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => {
            const typeInfo = TYPE_COLORS[doc.type] || TYPE_COLORS.other
            return (
              <div key={doc.id} className="card-premium p-4 hover:shadow-card-hover transition-shadow relative">
                <div className="flex items-start gap-4">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', typeInfo.bg)}>
                    {doc.type === 'imaging' ? <FileImage className={cn('w-6 h-6', typeInfo.text)} /> : <FileText className={cn('w-6 h-6', typeInfo.text)} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-900 truncate">{doc.title}</h3>
                    <span className={cn('inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1', typeInfo.bg, typeInfo.text)}>
                      {typeInfo.label}
                    </span>
                    <p className="text-xs text-slate-400 mt-1">
                      {doc.date ? formatDate(doc.date) : 'No date'}
                      {doc.provider && ` - ${doc.provider}`}
                    </p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpenId(menuOpenId === doc.id ? null : doc.id)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded"
                      aria-label="Document menu"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {menuOpenId === doc.id && (
                      <div className="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-10 w-40">
                        <button className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                          <Eye className="w-4 h-4" /> Preview
                        </button>
                        <button className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                          <Download className="w-4 h-4" /> Download
                        </button>
                        <button className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                          <Pencil className="w-4 h-4" /> Edit Metadata
                        </button>
                        <button className="w-full px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2">
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Visibility Toggles */}
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={doc.shareEmergency}
                      onChange={() => toggleVisibility(doc.id, 'shareEmergency')}
                      className="w-4 h-4 rounded border-slate-300 text-rose-600"
                    />
                    <span className="text-slate-600">Show in Emergency Access</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={doc.shareClinicVisit}
                      onChange={() => toggleVisibility(doc.id, 'shareClinicVisit')}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600"
                    />
                    <span className="text-slate-600">Show in Clinic Visit</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={doc.isPrivate}
                      onChange={() => toggleVisibility(doc.id, 'isPrivate')}
                      className="w-4 h-4 rounded border-slate-300 text-slate-600"
                    />
                    <span className="text-slate-600">Private (only me)</span>
                  </label>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadDocumentModal
          onClose={() => setShowUploadModal(false)}
          onUpload={() => { setShowUploadModal(false); fetchDocuments() }}
        />
      )}
    </div>
  )
}

function UploadDocumentModal({ onClose, onUpload }: { onClose: () => void; onUpload: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'other',
    date: '',
    provider: '',
    facility: '',
    tags: '',
    notes: '',
    shareEmergency: false,
    shareClinicVisit: true,
    isPrivate: false,
  })
  const [uploading, setUploading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setUploading(true)
    await fetch('/api/patient/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    }).catch(() => {})
    setUploading(false)
    onUpload()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white rounded-t-2xl">
          <h3 className="text-lg font-semibold text-slate-900">Upload Document</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Drag & Drop Area */}
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-violet-400 hover:bg-violet-50/50 transition-all cursor-pointer">
            <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600 mb-1">Drag and drop or click to upload</p>
            <p className="text-sm text-slate-400">PDF, JPG, PNG up to 10MB</p>
            <p className="text-xs text-slate-400 mt-2">(File storage mocked for demo)</p>
          </div>

          <div>
            <label className="label" htmlFor="doc-title">Document Title *</label>
            <input
              id="doc-title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input"
              placeholder="e.g., Blood Test Results - January 2025"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="doc-type">Type</label>
              <select
                id="doc-type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input"
              >
                {Object.entries(TYPE_COLORS).map(([value, { label }]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="doc-date">Date</label>
              <input
                id="doc-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="doc-provider">Provider/Doctor</label>
              <input
                id="doc-provider"
                type="text"
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                className="input"
                placeholder="Dr. Name"
              />
            </div>
            <div>
              <label className="label" htmlFor="doc-facility">Facility</label>
              <input
                id="doc-facility"
                type="text"
                value={formData.facility}
                onChange={(e) => setFormData({ ...formData, facility: e.target.value })}
                className="input"
                placeholder="Hospital/Clinic"
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="doc-tags">Tags (comma-separated)</label>
            <input
              id="doc-tags"
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="input"
              placeholder="e.g., blood work, annual checkup"
            />
          </div>

          {/* Sharing Options */}
          <div className="space-y-3">
            <label className="label">Sharing Permissions</label>
            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={formData.shareClinicVisit}
                onChange={(e) => setFormData({ ...formData, shareClinicVisit: e.target.checked })}
                className="w-5 h-5 rounded border-slate-300 text-blue-600"
              />
              <div>
                <p className="font-medium text-slate-900 text-sm">Show in Clinic Visit</p>
                <p className="text-xs text-slate-500">Include when sharing with clinics</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 bg-rose-50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={formData.shareEmergency}
                onChange={(e) => setFormData({ ...formData, shareEmergency: e.target.checked })}
                className="w-5 h-5 rounded border-slate-300 text-rose-600"
              />
              <div>
                <p className="font-medium text-slate-900 text-sm">Show in Emergency Access</p>
                <p className="text-xs text-slate-500">Include during emergency access</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPrivate}
                onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                className="w-5 h-5 rounded border-slate-300 text-slate-600"
              />
              <div>
                <p className="font-medium text-slate-900 text-sm">Private (only me)</p>
                <p className="text-xs text-slate-500">Never share this document</p>
              </div>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={!formData.title || uploading} className="btn-primary flex-1">
              {uploading ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
