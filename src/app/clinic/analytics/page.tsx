'use client'

import { useState } from 'react'
import {
  BarChart3,
  Users,
  Clock,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Star,
  DollarSign,
  Download,
  Mail,
  Activity,
  Stethoscope,
  Calendar,
} from 'lucide-react'

const dateRanges = ['Last 7 days', 'Last 30 days', 'Last 90 days']

const keyMetrics = [
  {
    label: 'Patients Onboarded',
    value: '12',
    subtext: 'this month',
    icon: Users,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    trend: '+18%',
    trendUp: true,
  },
  {
    label: 'Avg. Intake Time',
    value: '42 min',
    subtext: 'was 2.5 hrs',
    icon: Clock,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    trend: '-72%',
    trendUp: false,
    improvement: true,
  },
  {
    label: 'Intake Completion Rate',
    value: '94%',
    icon: CheckCircle2,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    trend: '+6%',
    trendUp: true,
  },
  {
    label: 'Clinician Verification',
    value: '91%',
    icon: Stethoscope,
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
    trend: '+12%',
    trendUp: true,
  },
  {
    label: 'Procedures Completed',
    value: '9',
    subtext: 'this month',
    icon: Activity,
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    trend: '+3',
    trendUp: true,
  },
  {
    label: 'Patient Satisfaction',
    value: '4.7/5',
    icon: Star,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    trend: '+0.2',
    trendUp: true,
  },
]

const onboardingData = [
  { month: 'Sep', value: 4 },
  { month: 'Oct', value: 6 },
  { month: 'Nov', value: 5 },
  { month: 'Dec', value: 8 },
  { month: 'Jan', value: 10 },
  { month: 'Feb', value: 12 },
]

const intakeTimeData = [
  { month: 'Sep', value: 150 },
  { month: 'Oct', value: 120 },
  { month: 'Nov', value: 90 },
  { month: 'Dec', value: 70 },
  { month: 'Jan', value: 55 },
  { month: 'Feb', value: 42 },
]

const procedureBreakdown = [
  { type: 'Cosmetic Surgery', count: 18, percentage: 39 },
  { type: 'Orthopedic', count: 14, percentage: 30 },
  { type: 'Dental Surgery', count: 10, percentage: 22 },
  { type: 'Other', count: 5, percentage: 9 },
]

const verificationSpeed = [
  { period: 'Week 1', hours: 48 },
  { period: 'Week 2', hours: 36 },
  { period: 'Week 3', hours: 24 },
  { period: 'Week 4', hours: 18 },
]

export default function ClinicAnalyticsPage() {
  const [selectedRange, setSelectedRange] = useState('Last 30 days')

  const maxOnboarding = Math.max(...onboardingData.map((d) => d.value))
  const maxIntakeTime = Math.max(...intakeTimeData.map((d) => d.value))
  const maxVerification = Math.max(...verificationSpeed.map((d) => d.hours))

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Clinic Analytics</h1>
          <p className="text-slate-500">Performance metrics and operational insights</p>
        </div>
        <div className="flex gap-3">
          <div className="nav-pills">
            {dateRanges.map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={`nav-pill ${selectedRange === range ? 'active' : ''}`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {keyMetrics.map((metric) => (
          <div key={metric.label} className="stat-card">
            <div className="flex items-start justify-between mb-3">
              <div className={`icon-box ${metric.iconBg}`}>
                <metric.icon className={`w-6 h-6 ${metric.iconColor}`} />
              </div>
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                  metric.improvement
                    ? 'bg-emerald-100 text-emerald-700'
                    : metric.trendUp
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                {metric.improvement || metric.trendUp ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {metric.trend}
              </span>
            </div>
            <p className="value">{metric.value}</p>
            <p className="stat-label">
              {metric.label}
              {metric.subtext && (
                <span className="text-slate-400 ml-1">({metric.subtext})</span>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Financial Metrics */}
      <div className="card-premium p-6 mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-500" />
          Financial Metrics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <p className="text-xs font-semibold text-emerald-600 uppercase mb-1">Monthly Revenue</p>
            <p className="text-2xl font-bold text-slate-900">$48,500</p>
            <p className="text-sm text-emerald-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +22% vs. last month
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-600 uppercase mb-1">Cost Savings (Automation)</p>
            <p className="text-2xl font-bold text-slate-900">$12,300</p>
            <p className="text-sm text-blue-600 mt-1">Reduced admin by 65%</p>
          </div>
          <div className="p-4 bg-violet-50 rounded-xl border border-violet-100">
            <p className="text-xs font-semibold text-violet-600 uppercase mb-1">ROI on ATLAS</p>
            <p className="text-2xl font-bold text-slate-900">340%</p>
            <p className="text-sm text-violet-600 mt-1">Annual projected return</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Patients Onboarded */}
        <div className="card-premium p-6">
          <h3 className="font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Patients Onboarded Over Time
          </h3>
          <div className="flex items-end gap-3 h-48">
            {onboardingData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-semibold text-slate-900">{d.value}</span>
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-500"
                  style={{ height: `${(d.value / maxOnboarding) * 100}%` }}
                />
                <span className="text-xs text-slate-500">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Intake Time Trend */}
        <div className="card-premium p-6">
          <h3 className="font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            Avg. Intake Time (minutes)
          </h3>
          <div className="flex items-end gap-3 h-48">
            {intakeTimeData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-semibold text-slate-900">{d.value}</span>
                <div
                  className="w-full bg-gradient-to-t from-amber-500 to-amber-400 rounded-t-lg transition-all duration-500"
                  style={{ height: `${(d.value / maxIntakeTime) * 100}%` }}
                />
                <span className="text-xs text-slate-500">{d.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
            <p className="text-xs text-emerald-700 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              Intake time reduced by 72% since implementing ATLAS
            </p>
          </div>
        </div>

        {/* Procedure Completion by Type */}
        <div className="card-premium p-6">
          <h3 className="font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-violet-500" />
            Procedures by Type
          </h3>
          <div className="space-y-4">
            {procedureBreakdown.map((item) => (
              <div key={item.type}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-slate-700">{item.type}</span>
                  <span className="text-slate-500">{item.count} ({item.percentage}%)</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clinician Verification Speed */}
        <div className="card-premium p-6">
          <h3 className="font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-emerald-500" />
            Verification Speed (hours)
          </h3>
          <div className="flex items-end gap-3 h-48">
            {verificationSpeed.map((d) => (
              <div key={d.period} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-semibold text-slate-900">{d.hours}h</span>
                <div
                  className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all duration-500"
                  style={{ height: `${(d.hours / maxVerification) * 100}%` }}
                />
                <span className="text-xs text-slate-500">{d.period}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
            <p className="text-xs text-emerald-700 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              Verification time down 63% this month
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button className="btn-primary">
          <Download className="w-4 h-4" />
          Download Report as PDF
        </button>
        <button className="btn-secondary">
          <Mail className="w-4 h-4" />
          Email Report
        </button>
      </div>
    </div>
  )
}
