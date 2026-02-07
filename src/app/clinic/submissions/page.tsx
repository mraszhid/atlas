'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ClipboardList,
  Search,
  Eye,
  Download,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertTriangle,
  SortAsc,
  FileText,
  ExternalLink,
  X,
  ArrowRight,
} from 'lucide-react'

const tabs = ['All', 'Pending Review', 'Approved', 'Rejected']

const mockSubmissions = [
  {
    id: '1',
    patientName: 'Muhammad Al-Rashid',
    formName: 'Cosmetic Surgery Pre-Op Assessment',
    submittedDate: 'Feb 1, 2026',
    status: 'approved',
    avatar: 'MA',
    avatarGradient: 'from-blue-500 to-cyan-500',
    hasAtlasData: true,
  },
  {
    id: '2',
    patientName: 'Sarah Johnson',
    formName: 'Orthopedic Surgery Pre-Op Assessment',
    submittedDate: 'Feb 3, 2026',
    status: 'pending',
    avatar: 'SJ',
    avatarGradient: 'from-rose-500 to-pink-500',
    hasAtlasData: true,
  },
  {
    id: '3',
    patientName: 'Ahmed Hassan',
    formName: 'Cosmetic Surgery Pre-Op Assessment',
    submittedDate: 'Feb 2, 2026',
    status: 'flagged',
    flagReason: 'Allergy information needs verification',
    avatar: 'AH',
    avatarGradient: 'from-emerald-500 to-teal-500',
    hasAtlasData: true,
  },
  {
    id: '4',
    patientName: 'Lisa Wong',
    formName: 'Cosmetic Surgery Pre-Op Assessment',
    submittedDate: 'Feb 5, 2026',
    status: 'pending',
    avatar: 'LW',
    avatarGradient: 'from-amber-500 to-orange-500',
    hasAtlasData: false,
  },
  {
    id: '5',
    patientName: 'Yuki Tanaka',
    formName: 'Orthopedic Surgery Pre-Op Assessment',
    submittedDate: 'Feb 4, 2026',
    status: 'approved',
    avatar: 'YT',
    avatarGradient: 'from-violet-500 to-purple-500',
    hasAtlasData: true,
  },
  {
    id: '6',
    patientName: 'Hans Mueller',
    formName: 'Cosmetic Surgery Pre-Op Assessment',
    submittedDate: 'Jan 28, 2026',
    status: 'approved',
    avatar: 'HM',
    avatarGradient: 'from-indigo-500 to-blue-500',
    hasAtlasData: true,
  },
]

function getStatusBadge(status: string) {
  switch (status) {
    case 'approved':
      return (
        <span className="badge badge-verified">
          <CheckCircle2 className="w-3 h-3" /> Approved
        </span>
      )
    case 'pending':
      return (
        <span className="badge badge-gold">
          <Clock className="w-3 h-3" /> Pending
        </span>
      )
    case 'flagged':
      return (
        <span className="badge badge-emergency">
          <AlertTriangle className="w-3 h-3" /> Flagged
        </span>
      )
    case 'rejected':
      return (
        <span className="badge badge-unverified">
          <X className="w-3 h-3" /> Rejected
        </span>
      )
    default:
      return null
  }
}

export default function ClinicSubmissionsPage() {
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSubmissions = mockSubmissions.filter((s) => {
    if (activeTab === 'Pending Review') return s.status === 'pending' || s.status === 'flagged'
    if (activeTab === 'Approved') return s.status === 'approved'
    if (activeTab === 'Rejected') return s.status === 'rejected'
    return true
  })

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Intake Submissions</h1>
        <p className="text-slate-500">Review and manage patient intake form submissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="stat-card">
          <div className="icon-box bg-blue-100">
            <ClipboardList className="w-6 h-6 text-blue-600" />
          </div>
          <p className="value">18</p>
          <p className="stat-label">Total Submissions</p>
        </div>
        <div className="stat-card">
          <div className="icon-box bg-amber-100">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <p className="value">4</p>
          <p className="stat-label">Pending Review</p>
        </div>
        <div className="stat-card">
          <div className="icon-box bg-emerald-100">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="value">13</p>
          <p className="stat-label">Approved</p>
        </div>
        <div className="stat-card">
          <div className="icon-box bg-rose-100">
            <AlertTriangle className="w-6 h-6 text-rose-600" />
          </div>
          <p className="value">1</p>
          <p className="stat-label">Flagged</p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="nav-pills">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`nav-pill ${activeTab === tab ? 'active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search submissions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 py-2 text-sm w-64"
            />
          </div>
          <button className="btn-ghost btn-sm">
            <SortAsc className="w-4 h-4" />
            Sort
          </button>
        </div>
      </div>

      {/* Submission Count */}
      <p className="text-sm font-medium text-slate-500 mb-4">
        18 Submissions (This month)
      </p>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.map((submission) => (
          <div key={submission.id} className="card-premium p-5">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Patient Info */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${submission.avatarGradient} flex items-center justify-center text-white font-bold flex-shrink-0`}
                >
                  {submission.avatar}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{submission.patientName}</p>
                  <p className="text-sm text-slate-500 truncate">{submission.formName}</p>
                </div>
              </div>

              {/* Date & Status */}
              <div className="flex-shrink-0 text-sm">
                <p className="text-slate-500">Submitted {submission.submittedDate}</p>
                <div className="mt-1">{getStatusBadge(submission.status)}</div>
              </div>

              {/* Flag Reason */}
              {submission.status === 'flagged' && (
                <div className="flex-shrink-0">
                  <p className="text-xs text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
                    <AlertTriangle className="w-3 h-3 inline mr-1" />
                    {(submission as any).flagReason}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 flex-shrink-0">
                <button className="btn-secondary btn-sm">
                  <Eye className="w-4 h-4" />
                  View Responses
                </button>
                {submission.hasAtlasData && (
                  <button className="btn-ghost btn-sm text-violet-600">
                    <ExternalLink className="w-4 h-4" />
                    ATLAS Data
                  </button>
                )}
                <button className="btn-ghost btn-sm">
                  <Download className="w-4 h-4" />
                  PDF
                </button>
                <button className="btn-ghost btn-sm">
                  <MessageSquare className="w-4 h-4" />
                  Notes
                </button>
                {(submission.status === 'pending' || submission.status === 'flagged') && (
                  <>
                    <button className="btn-primary btn-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      Approve
                    </button>
                    <button className="btn-ghost btn-sm text-amber-600">
                      Request Changes
                    </button>
                    <button className="btn-ghost btn-sm text-rose-600">
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredSubmissions.length === 0 && (
        <div className="card-premium p-12 text-center">
          <ClipboardList className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No Submissions Found</h3>
          <p className="text-slate-500">
            {activeTab === 'All'
              ? 'No submissions have been received yet.'
              : `No ${activeTab.toLowerCase()} submissions found.`}
          </p>
        </div>
      )}
    </div>
  )
}
