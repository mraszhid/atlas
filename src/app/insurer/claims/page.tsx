'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  FileCheck, 
  Clock,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Filter,
  Eye,
  DollarSign,
  Calendar,
  Building2
} from 'lucide-react'

// Demo claims data
const demoClaims = [
  {
    id: 'CLM-2024-001',
    patientName: 'Muhammad Rashid',
    policyNumber: 'GTI-2024-78392',
    amount: '$12,500',
    type: 'Hospital Admission',
    provider: 'Dubai Healthcare City',
    submittedDate: '2024-01-15',
    status: 'PENDING',
  },
  {
    id: 'CLM-2024-002',
    patientName: 'Sarah Chen',
    policyNumber: 'GTI-2024-12847',
    amount: '$3,200',
    type: 'Outpatient Procedure',
    provider: 'Singapore General Hospital',
    submittedDate: '2024-01-12',
    status: 'APPROVED',
  },
  {
    id: 'CLM-2024-003',
    patientName: 'James Anderson',
    policyNumber: 'GTI-2024-93421',
    amount: '$8,750',
    type: 'Emergency Care',
    provider: 'Bangkok Hospital',
    submittedDate: '2024-01-10',
    status: 'APPROVED',
  },
  {
    id: 'CLM-2024-004',
    patientName: 'Maria Garcia',
    policyNumber: 'GTI-2024-45678',
    amount: '$15,000',
    type: 'Cosmetic Surgery',
    provider: 'NovaMed Clinic',
    submittedDate: '2024-01-08',
    status: 'DENIED',
    denyReason: 'Excluded procedure under policy terms',
  },
  {
    id: 'CLM-2024-005',
    patientName: 'Muhammad Rashid',
    policyNumber: 'GTI-2024-78392',
    amount: '$450',
    type: 'Prescription Drugs',
    provider: 'Al Ain Pharmacy',
    submittedDate: '2024-01-05',
    status: 'APPROVED',
  },
]

export default function InsurerClaimsPage() {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'DENIED'>('ALL')
  const [selectedClaim, setSelectedClaim] = useState<any>(null)

  const filteredClaims = filter === 'ALL' 
    ? demoClaims 
    : demoClaims.filter(c => c.status === filter)

  const stats = {
    total: demoClaims.length,
    pending: demoClaims.filter(c => c.status === 'PENDING').length,
    approved: demoClaims.filter(c => c.status === 'APPROVED').length,
    denied: demoClaims.filter(c => c.status === 'DENIED').length,
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/insurer/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Claims</h1>
        <p className="text-slate-500">Review and process insurance claims</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="stat-card">
          <div className="icon-box bg-blue-100">
            <FileCheck className="w-6 h-6 text-blue-600" />
          </div>
          <p className="value">{stats.total}</p>
          <p className="stat-label">Total Claims</p>
        </div>
        
        <div className="stat-card">
          <div className="icon-box bg-amber-100">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <p className="value">{stats.pending}</p>
          <p className="stat-label">Pending Review</p>
        </div>
        
        <div className="stat-card">
          <div className="icon-box bg-emerald-100">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="value">{stats.approved}</p>
          <p className="stat-label">Approved</p>
        </div>
        
        <div className="stat-card">
          <div className="icon-box bg-rose-100">
            <XCircle className="w-6 h-6 text-rose-600" />
          </div>
          <p className="value">{stats.denied}</p>
          <p className="stat-label">Denied</p>
        </div>
      </div>

      {/* Filter */}
      <div className="card-premium p-4 mb-6">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-slate-400" />
          <div className="flex gap-2">
            {(['ALL', 'PENDING', 'APPROVED', 'DENIED'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === f 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f === 'ALL' ? 'All Claims' : f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Claims Table */}
      <div className="card-premium overflow-hidden">
        <table className="table-premium">
          <thead>
            <tr>
              <th>Claim ID</th>
              <th>Patient</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Provider</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClaims.map((claim) => (
              <tr key={claim.id}>
                <td>
                  <p className="font-mono font-medium text-slate-900">{claim.id}</p>
                  <p className="text-xs text-slate-500">{claim.submittedDate}</p>
                </td>
                <td>
                  <p className="font-medium text-slate-900">{claim.patientName}</p>
                  <p className="text-xs text-slate-500">{claim.policyNumber}</p>
                </td>
                <td>
                  <p className="text-slate-700">{claim.type}</p>
                </td>
                <td>
                  <p className="font-semibold text-slate-900">{claim.amount}</p>
                </td>
                <td>
                  <p className="text-slate-700">{claim.provider}</p>
                </td>
                <td>
                  <span className={`badge ${
                    claim.status === 'APPROVED' ? 'badge-verified' :
                    claim.status === 'DENIED' ? 'badge-emergency' :
                    'badge-gold'
                  }`}>
                    {claim.status === 'APPROVED' && <CheckCircle2 className="w-3 h-3" />}
                    {claim.status === 'DENIED' && <XCircle className="w-3 h-3" />}
                    {claim.status === 'PENDING' && <Clock className="w-3 h-3" />}
                    {claim.status}
                  </span>
                </td>
                <td>
                  <button 
                    onClick={() => setSelectedClaim(claim)}
                    className="btn-ghost btn-sm"
                  >
                    <Eye className="w-4 h-4" />
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Claim Detail Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Claim Details</h2>
                <button 
                  onClick={() => setSelectedClaim(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-lg font-bold text-slate-900">{selectedClaim.id}</span>
                <span className={`badge ${
                  selectedClaim.status === 'APPROVED' ? 'badge-verified' :
                  selectedClaim.status === 'DENIED' ? 'badge-emergency' :
                  'badge-gold'
                }`}>
                  {selectedClaim.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 uppercase mb-1">Patient</p>
                  <p className="font-medium text-slate-900">{selectedClaim.patientName}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 uppercase mb-1">Policy</p>
                  <p className="font-mono text-slate-900">{selectedClaim.policyNumber}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <p className="text-xs text-blue-600 uppercase mb-1">Amount</p>
                  <p className="font-bold text-blue-700">{selectedClaim.amount}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 uppercase mb-1">Type</p>
                  <p className="font-medium text-slate-900">{selectedClaim.type}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 uppercase mb-1">Provider</p>
                <p className="font-medium text-slate-900">{selectedClaim.provider}</p>
              </div>

              {selectedClaim.denyReason && (
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                  <p className="text-xs text-rose-600 uppercase mb-1">Denial Reason</p>
                  <p className="text-rose-700">{selectedClaim.denyReason}</p>
                </div>
              )}

              {selectedClaim.status === 'PENDING' && (
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => {
                      selectedClaim.status = 'APPROVED'
                      setSelectedClaim(null)
                    }}
                    className="btn-primary flex-1"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve
                  </button>
                  <button 
                    onClick={() => {
                      selectedClaim.status = 'DENIED'
                      setSelectedClaim(null)
                    }}
                    className="btn-danger flex-1"
                  >
                    <XCircle className="w-4 h-4" />
                    Deny
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
