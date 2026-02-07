'use client'

import Link from 'next/link'
import {
  Users,
  UserPlus,
  CheckCircle2,
  Clock,
  FileEdit,
  Download,
  GitBranch,
  BarChart3,
  ArrowRight,
  TrendingDown,
  Activity,
  Eye,
  FileText,
  Send,
} from 'lucide-react'

const stats = [
  {
    label: 'Active Patients',
    value: '47',
    icon: Users,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    label: 'This Month',
    value: '12',
    subtext: 'new patients',
    icon: UserPlus,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    label: 'Completed Procedures',
    value: '9',
    icon: CheckCircle2,
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
  },
  {
    label: 'Avg Intake Time',
    value: '42 min',
    icon: Clock,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    badge: { text: 'Down from 2.5 hrs', color: 'bg-emerald-100 text-emerald-700' },
  },
]

const quickActions = [
  {
    label: 'Create New Form',
    description: 'Build intake forms for patients',
    href: '/clinic/forms',
    icon: FileEdit,
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
  },
  {
    label: 'Import Patient',
    description: 'Add patients from ATLAS',
    href: '/clinic/patients',
    icon: Download,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    label: 'View Pipeline',
    description: 'Track patient journey stages',
    href: '/clinic/pipeline',
    icon: GitBranch,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    label: 'View Analytics',
    description: 'Clinic performance metrics',
    href: '/clinic/analytics',
    icon: BarChart3,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
]

const recentActivity = [
  {
    id: '1',
    action: 'Muhammad Al-Rashid completed intake form',
    type: 'form',
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
    time: '15 minutes ago',
  },
  {
    id: '2',
    action: 'Sarah Johnson imported from ATLAS',
    type: 'import',
    icon: Download,
    iconColor: 'text-blue-500',
    time: '1 hour ago',
  },
  {
    id: '3',
    action: 'Cosmetic Surgery Pre-Op form shared',
    type: 'share',
    icon: Send,
    iconColor: 'text-violet-500',
    time: '2 hours ago',
  },
  {
    id: '4',
    action: 'Lisa Wong procedure marked complete',
    type: 'complete',
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
    time: '4 hours ago',
  },
  {
    id: '5',
    action: 'Orthopedic Surgery Pre-Op published',
    type: 'publish',
    icon: FileText,
    iconColor: 'text-violet-500',
    time: 'Yesterday',
  },
]

export default function ClinicDashboard() {
  return (
    <div className="p-6 lg:p-8">
      {/* Hero Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          NovaMed Tourism Clinic Operations Hub
        </h1>
        <p className="text-slate-500">
          Monitor patient intake, manage forms, and track clinic performance
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className={`icon-box ${stat.iconBg}`}>
              <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
            <p className="value">{stat.value}</p>
            <p className="stat-label">
              {stat.label}
              {stat.subtext && <span className="text-slate-400 ml-1">({stat.subtext})</span>}
            </p>
            {stat.badge && (
              <span className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${stat.badge.color}`}>
                <TrendingDown className="w-3 h-3" />
                {stat.badge.text}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href} className="quick-action">
              <div className={`icon-box ${action.iconBg}`}>
                <action.icon className={`w-5 h-5 ${action.iconColor}`} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">{action.label}</p>
                <p className="text-sm text-slate-500">{action.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-premium p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
            <Link
              href="/clinic/submissions"
              className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivity.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{item.action}</p>
                  <p className="text-xs text-slate-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          {/* Clinic Summary */}
          <div className="card-premium p-6 bg-gradient-to-br from-violet-50 to-purple-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Clinic Performance</p>
                <p className="text-sm text-slate-500">This month</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Intake Completion</span>
                <span className="font-semibold text-slate-900">94%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '94%' }} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Verification Rate</span>
                <span className="font-semibold text-slate-900">91%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '91%' }} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Patient Satisfaction</span>
                <span className="font-semibold text-slate-900">4.7/5</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '94%' }} />
              </div>
            </div>
          </div>

          {/* Published Forms Quick View */}
          <div className="card-premium p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Active Forms</h3>
              <Link href="/clinic/forms" className="text-sm text-violet-600 hover:text-violet-700 font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-slate-900">Cosmetic Surgery Pre-Op</p>
                  <span className="badge badge-verified">Published</span>
                </div>
                <p className="text-xs text-slate-500">18 submissions</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-slate-900">Orthopedic Pre-Op</p>
                  <span className="badge badge-verified">Published</span>
                </div>
                <p className="text-xs text-slate-500">8 submissions</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-slate-900">Dental Surgery Pre-Op</p>
                  <span className="badge badge-unverified">Draft</span>
                </div>
                <p className="text-xs text-slate-500">Not published</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
