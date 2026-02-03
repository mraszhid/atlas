'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  FileCheck, 
  Clock, 
  TrendingUp,
  Search,
  Shield,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react'

interface DashboardStats {
  totalVerifications: number
  pendingClaims: number
  approvedToday: number
  avgResponseTime: string
}

export default function InsurerDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalVerifications: 156,
    pendingClaims: 12,
    approvedToday: 8,
    avgResponseTime: '2.4 hrs'
  })
  const [loading, setLoading] = useState(false)

  const recentVerifications = [
    { id: '1', patientName: 'Muhammad Rashid', type: 'Identity Verification', status: 'approved', time: '2 hours ago' },
    { id: '2', patientName: 'Sarah Chen', type: 'Coverage Check', status: 'approved', time: '4 hours ago' },
    { id: '3', patientName: 'James Wilson', type: 'Claim Verification', status: 'pending', time: '5 hours ago' },
    { id: '4', patientName: 'Maria Garcia', type: 'Identity Verification', status: 'approved', time: '1 day ago' },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Insurance Dashboard
        </h1>
        <p className="text-slate-500">
          Verify patient identities and process claims
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stat-card">
          <div className="icon-box bg-sky-100">
            <FileCheck className="w-6 h-6 text-sky-600" />
          </div>
          <p className="value">{stats.totalVerifications}</p>
          <p className="stat-label">Total Verifications</p>
        </div>
        
        <div className="stat-card">
          <div className="icon-box bg-amber-100">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <p className="value">{stats.pendingClaims}</p>
          <p className="stat-label">Pending Claims</p>
        </div>
        
        <div className="stat-card">
          <div className="icon-box bg-emerald-100">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="value">{stats.approvedToday}</p>
          <p className="stat-label">Approved Today</p>
        </div>
        
        <div className="stat-card">
          <div className="icon-box bg-violet-100">
            <TrendingUp className="w-6 h-6 text-violet-600" />
          </div>
          <p className="value">{stats.avgResponseTime}</p>
          <p className="stat-label">Avg Response Time</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="card-premium p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="quick-action w-full">
              <div className="icon-box bg-sky-100">
                <Search className="w-5 h-5 text-sky-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-slate-900">Verify Patient</p>
                <p className="text-sm text-slate-500">Search by ID or policy number</p>
              </div>
            </button>
            
            <button className="quick-action w-full">
              <div className="icon-box bg-amber-100">
                <FileCheck className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-slate-900">Process Claims</p>
                <p className="text-sm text-slate-500">{stats.pendingClaims} pending review</p>
              </div>
            </button>
            
            <button className="quick-action w-full">
              <div className="icon-box bg-emerald-100">
                <Shield className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-slate-900">Coverage Check</p>
                <p className="text-sm text-slate-500">Verify patient coverage</p>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Verifications */}
        <div className="lg:col-span-2 card-premium p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Verifications</h2>
          <div className="space-y-3">
            {recentVerifications.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-medium text-slate-600">
                    {item.patientName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{item.patientName}</p>
                    <p className="text-sm text-slate-500">{item.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`badge ${item.status === 'approved' ? 'badge-verified' : 'badge-gold'}`}>
                    {item.status === 'approved' ? (
                      <><CheckCircle2 className="w-3 h-3" /> Approved</>
                    ) : (
                      <><Clock className="w-3 h-3" /> Pending</>
                    )}
                  </span>
                  <p className="text-xs text-slate-400 mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mt-6 card-premium p-4 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800">Demo Mode</p>
            <p className="text-sm text-amber-700 mt-1">
              This is a demonstration of the insurer portal. In production, this would connect to 
              your claims processing system and patient verification APIs.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
