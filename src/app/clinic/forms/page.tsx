'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  FileEdit,
  Trash2,
  Copy,
  ExternalLink,
  Eye,
  Send,
  CheckCircle2,
  Clock,
  MoreVertical,
  Upload,
  Search,
  X,
  FileText,
} from 'lucide-react'

interface MockForm {
  id: string
  name: string
  status: 'published' | 'draft'
  createdAt: string
  updatedAt: string
  submissions: number
  shareUrl: string
}

const mockForms: MockForm[] = [
  {
    id: '1',
    name: 'Cosmetic Surgery Pre-Op Assessment',
    status: 'published',
    createdAt: 'Jan 15, 2026',
    updatedAt: 'Feb 1, 2026',
    submissions: 18,
    shareUrl: '/intake/cosm-preop-nvm-2026',
  },
  {
    id: '2',
    name: 'Orthopedic Surgery Pre-Op Assessment',
    status: 'published',
    createdAt: 'Jan 20, 2026',
    updatedAt: 'Jan 28, 2026',
    submissions: 8,
    shareUrl: '/intake/orth-preop-nvm-2026',
  },
  {
    id: '3',
    name: 'Dental Surgery Pre-Op',
    status: 'draft',
    createdAt: 'Feb 3, 2026',
    updatedAt: 'Feb 5, 2026',
    submissions: 0,
    shareUrl: '',
  },
]

export default function ClinicFormsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const publishedForms = mockForms.filter((f) => f.status === 'published')
  const draftForms = mockForms.filter((f) => f.status === 'draft')

  function copyShareUrl(form: MockForm) {
    const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${form.shareUrl}` : form.shareUrl
    navigator.clipboard.writeText(fullUrl)
    setCopiedId(form.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Intake Forms</h1>
          <p className="text-slate-500">Create and manage patient intake forms for medical tourism</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary">
            <Upload className="w-4 h-4" />
            Import Template
          </button>
          <Link href="/clinic/forms/new" className="btn-primary">
            <Plus className="w-5 h-5" />
            Create New Form
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="card-premium p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search forms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-12"
          />
        </div>
      </div>

      {/* Published Forms */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          Published Forms
          <span className="text-sm font-normal text-slate-500">({publishedForms.length})</span>
        </h2>
        <div className="space-y-4">
          {publishedForms.map((form) => (
            <div key={form.id} className="card-premium p-6">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">{form.name}</h3>
                    <span className="badge badge-verified">
                      <CheckCircle2 className="w-3 h-3" />
                      Published
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-3">
                    <span>Created: {form.createdAt}</span>
                    <span>Updated: {form.updatedAt}</span>
                    <span className="font-medium text-slate-700">{form.submissions} submissions</span>
                  </div>

                  {/* Share URL */}
                  <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-3">
                    <code className="flex-1 text-sm font-mono text-slate-600 truncate">
                      {typeof window !== 'undefined' ? window.location.origin : ''}{form.shareUrl}
                    </code>
                    <button
                      onClick={() => copyShareUrl(form)}
                      className="btn-ghost btn-sm flex-shrink-0"
                    >
                      {copiedId === form.id ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      {copiedId === form.id ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Link href={`/clinic/forms/${form.id}`} className="btn-secondary btn-sm">
                    <Eye className="w-4 h-4" />
                    View
                  </Link>
                  <Link href={`/clinic/forms/${form.id}`} className="btn-secondary btn-sm">
                    <FileEdit className="w-4 h-4" />
                    Edit
                  </Link>
                  <Link href="/clinic/submissions" className="btn-secondary btn-sm">
                    <FileText className="w-4 h-4" />
                    Submissions
                  </Link>
                  <button
                    onClick={() => copyShareUrl(form)}
                    className="btn-secondary btn-sm"
                  >
                    <Send className="w-4 h-4" />
                    Share
                  </button>
                  <button className="btn-ghost btn-sm text-slate-400 hover:text-amber-600">
                    Unpublish
                  </button>
                  <button className="btn-ghost btn-sm text-slate-400 hover:text-rose-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Draft Forms */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-400" />
          Draft Forms
          <span className="text-sm font-normal text-slate-500">({draftForms.length})</span>
        </h2>
        <div className="space-y-4">
          {draftForms.map((form) => (
            <div key={form.id} className="card-premium p-6 border-dashed">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">{form.name}</h3>
                    <span className="badge badge-unverified">
                      <Clock className="w-3 h-3" />
                      Draft
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">Last edited: {form.updatedAt}</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/clinic/forms/${form.id}`} className="btn-secondary btn-sm">
                    <FileEdit className="w-4 h-4" />
                    Edit
                  </Link>
                  <button className="btn-primary btn-sm">
                    Publish
                  </button>
                  <button className="btn-ghost btn-sm text-slate-400 hover:text-rose-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State for no forms */}
      {mockForms.length === 0 && (
        <div className="card-premium p-12 text-center">
          <FileEdit className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No Forms Created</h3>
          <p className="text-slate-500 mb-6">Create your first intake form to start collecting patient information</p>
          <Link href="/clinic/forms/new" className="btn-primary">
            <Plus className="w-5 h-5" />
            Create First Form
          </Link>
        </div>
      )}
    </div>
  )
}
