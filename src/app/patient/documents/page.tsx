'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, 
  Upload, 
  Search, 
  Filter,
  Eye,
  Download,
  Trash2,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Image,
  FileImage
} from 'lucide-react'
import { cn, formatDate, documentTypeLabels } from '@/lib/utils'

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

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [showUploadModal, setShowUploadModal] = useState(false)

  useEffect(() => {
    fetchDocuments()
  }, [])

  async function fetchDocuments() {
    try {
      const res = await fetch('/api/patient/documents')
      if (!res.ok) {
        setDocuments([])
        setLoading(false)
        return
      }
      const data = await res.json()
      if (Array.isArray(data)) {
        setDocuments(data)
      } else {
        setDocuments([])
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
      setDocuments([])
    }
    setLoading(false)
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.provider?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.tags?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || doc.type === typeFilter
    return matchesSearch && matchesType
  })

  const typeOptions = ['all', ...Object.keys(documentTypeLabels)]

  function getFileIcon(type: string) {
    if (type === 'imaging') return <FileImage className="w-6 h-6" />
    return <FileText className="w-6 h-6" />
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-clinical-900 mb-2">
            Medical Documents
          </h1>
          <p className="text-clinical-500">
            Upload, organize, and share your medical records
          </p>
        </div>
        <button onClick={() => setShowUploadModal(true)} className="btn-primary">
          <Upload className="w-5 h-5" />
          Upload Document
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-clinical-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="input pl-10"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="input w-48"
        >
          <option value="all">All Types</option>
          {Object.entries(documentTypeLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* Document Grid */}
      {loading ? (
        <div className="atlas-card p-8 text-center text-clinical-500">Loading documents...</div>
      ) : filteredDocuments.length === 0 ? (
        <div className="atlas-card p-12 text-center">
          <FileText className="w-16 h-16 text-clinical-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-clinical-700 mb-2">No Documents Found</h3>
          <p className="text-clinical-500 mb-6">
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
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="atlas-card p-4 hover:shadow-card-hover transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-atlas-100 text-atlas-600 flex items-center justify-center flex-shrink-0">
                  {getFileIcon(doc.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-clinical-900 truncate">{doc.title}</h3>
                  <p className="text-sm text-clinical-500">
                    {documentTypeLabels[doc.type] || doc.type}
                  </p>
                  <p className="text-xs text-clinical-400 mt-1">
                    {doc.date ? formatDate(doc.date) : 'No date'} 
                    {doc.provider && ` • ${doc.provider}`}
                  </p>
                </div>
              </div>

              {/* Sharing Flags */}
              <div className="flex gap-2 mt-3">
                {doc.shareEmergency && (
                  <span className="badge badge-emergency text-xs">Emergency</span>
                )}
                {doc.shareClinicVisit && (
                  <span className="badge badge-info text-xs">Clinic Visit</span>
                )}
                {doc.isPrivate && (
                  <span className="badge badge-unverified text-xs">Private</span>
                )}
              </div>

              {/* Tags */}
              {doc.tags && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {doc.tags.split(',').map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-clinical-100 text-clinical-600 text-xs rounded">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-clinical-100">
                <button className="btn-ghost btn-sm flex-1">
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button className="btn-ghost btn-sm text-alert-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadDocumentModal
          onClose={() => setShowUploadModal(false)}
          onUpload={() => {
            setShowUploadModal(false)
            fetchDocuments()
          }}
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
    country: '',
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
    })

    setUploading(false)
    onUpload()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-clinical-200 flex justify-between items-center sticky top-0 bg-white">
          <h3 className="text-lg font-semibold text-clinical-900">Upload Document</h3>
          <button onClick={onClose} className="p-2 text-clinical-400 hover:text-clinical-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* File Upload Area */}
          <div className="border-2 border-dashed border-clinical-300 rounded-lg p-8 text-center">
            <Upload className="w-10 h-10 text-clinical-400 mx-auto mb-3" />
            <p className="text-clinical-600 mb-1">Drag & drop or click to upload</p>
            <p className="text-sm text-clinical-400">PDF, JPG, PNG up to 10MB</p>
            <p className="text-xs text-clinical-400 mt-2">(File storage mocked for demo)</p>
          </div>

          <div>
            <label className="label">Document Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input"
              placeholder="e.g., Blood Test Results - January 2024"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input"
              >
                {Object.entries(documentTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Provider/Doctor</label>
              <input
                type="text"
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                className="input"
                placeholder="Dr. Name"
              />
            </div>
            <div>
              <label className="label">Facility</label>
              <input
                type="text"
                value={formData.facility}
                onChange={(e) => setFormData({ ...formData, facility: e.target.value })}
                className="input"
                placeholder="Hospital/Clinic"
              />
            </div>
          </div>

          <div>
            <label className="label">Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="input"
              placeholder="e.g., blood work, annual checkup"
            />
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input"
              placeholder="Any additional notes..."
            />
          </div>

          {/* Sharing Options */}
          <div className="space-y-3">
            <label className="label">Sharing Permissions</label>
            <label className="flex items-center gap-3 p-3 bg-clinical-50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={formData.shareClinicVisit}
                onChange={(e) => setFormData({ ...formData, shareClinicVisit: e.target.checked })}
                className="w-5 h-5 rounded border-clinical-300 text-atlas-600"
              />
              <div>
                <p className="font-medium text-clinical-900">Shareable for Clinic Visit</p>
                <p className="text-sm text-clinical-500">Include in clinic visit sharing</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 bg-alert-50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={formData.shareEmergency}
                onChange={(e) => setFormData({ ...formData, shareEmergency: e.target.checked })}
                className="w-5 h-5 rounded border-clinical-300 text-alert-600"
              />
              <div>
                <p className="font-medium text-clinical-900">Shareable in Emergency</p>
                <p className="text-sm text-clinical-500">Include in emergency access</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 bg-clinical-50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPrivate}
                onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                className="w-5 h-5 rounded border-clinical-300 text-clinical-600"
              />
              <div>
                <p className="font-medium text-clinical-900">Private</p>
                <p className="text-sm text-clinical-500">Never share this document</p>
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
