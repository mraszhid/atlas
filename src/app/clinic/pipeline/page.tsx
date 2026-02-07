'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  GitBranch,
  Eye,
  ArrowRight,
  Clock,
  Users,
  CheckCircle2,
  Download,
  TrendingUp,
  Filter,
  ChevronRight,
} from 'lucide-react'

interface PipelinePatient {
  id: string
  name: string
  procedure: string
  procedureDate: string
  avatar: string
  avatarGradient: string
}

const importedPatients: PipelinePatient[] = [
  { id: 'i1', name: 'Yuki Tanaka', procedure: 'Dental Surgery', procedureDate: 'Mar 12', avatar: 'YT', avatarGradient: 'from-violet-500 to-purple-500' },
  { id: 'i2', name: 'Carlos Rivera', procedure: 'Cosmetic Surgery', procedureDate: 'Mar 18', avatar: 'CR', avatarGradient: 'from-blue-500 to-cyan-500' },
  { id: 'i3', name: 'Fatima Al-Sayed', procedure: 'Orthopedic', procedureDate: 'Mar 20', avatar: 'FA', avatarGradient: 'from-emerald-500 to-teal-500' },
  { id: 'i4', name: 'Olga Petrov', procedure: 'Cosmetic Surgery', procedureDate: 'Mar 22', avatar: 'OP', avatarGradient: 'from-rose-500 to-pink-500' },
  { id: 'i5', name: 'David Kim', procedure: 'Dental Surgery', procedureDate: 'Mar 25', avatar: 'DK', avatarGradient: 'from-amber-500 to-orange-500' },
  { id: 'i6', name: 'Elena Volkov', procedure: 'Orthopedic', procedureDate: 'Mar 28', avatar: 'EV', avatarGradient: 'from-indigo-500 to-blue-500' },
  { id: 'i7', name: 'Ravi Patel', procedure: 'Cosmetic Surgery', procedureDate: 'Apr 1', avatar: 'RP', avatarGradient: 'from-teal-500 to-cyan-500' },
  { id: 'i8', name: 'Sophie Chen', procedure: 'Dental Surgery', procedureDate: 'Apr 3', avatar: 'SC', avatarGradient: 'from-pink-500 to-rose-500' },
]

const activePatients: PipelinePatient[] = [
  { id: 'a1', name: 'Muhammad Al-Rashid', procedure: 'Cosmetic Surgery', procedureDate: 'Feb 15', avatar: 'MA', avatarGradient: 'from-blue-500 to-cyan-500' },
  { id: 'a2', name: 'Sarah Johnson', procedure: 'Orthopedic', procedureDate: 'Mar 5', avatar: 'SJ', avatarGradient: 'from-rose-500 to-pink-500' },
  { id: 'a3', name: 'Lisa Wong', procedure: 'Cosmetic Surgery', procedureDate: 'Mar 8', avatar: 'LW', avatarGradient: 'from-amber-500 to-orange-500' },
  { id: 'a4', name: 'Ahmed Hassan', procedure: 'Orthopedic', procedureDate: 'Feb 20', avatar: 'AH', avatarGradient: 'from-emerald-500 to-teal-500' },
  { id: 'a5', name: 'Priya Gupta', procedure: 'Dental Surgery', procedureDate: 'Mar 1', avatar: 'PG', avatarGradient: 'from-violet-500 to-purple-500' },
  { id: 'a6', name: 'Tom Baker', procedure: 'Cosmetic Surgery', procedureDate: 'Mar 3', avatar: 'TB', avatarGradient: 'from-cyan-500 to-blue-500' },
]

const completedPatients: PipelinePatient[] = [
  { id: 'c1', name: 'James Anderson', procedure: 'Cosmetic Surgery', procedureDate: 'Jan 20', avatar: 'JA', avatarGradient: 'from-slate-400 to-slate-500' },
  { id: 'c2', name: 'Maria Garcia', procedure: 'Dental Surgery', procedureDate: 'Jan 15', avatar: 'MG', avatarGradient: 'from-slate-400 to-slate-500' },
  { id: 'c3', name: 'Hans Mueller', procedure: 'Orthopedic', procedureDate: 'Jan 10', avatar: 'HM', avatarGradient: 'from-slate-400 to-slate-500' },
  { id: 'c4', name: 'Ana Silva', procedure: 'Cosmetic Surgery', procedureDate: 'Jan 8', avatar: 'AS', avatarGradient: 'from-slate-400 to-slate-500' },
  { id: 'c5', name: 'Wei Zhang', procedure: 'Dental Surgery', procedureDate: 'Jan 5', avatar: 'WZ', avatarGradient: 'from-slate-400 to-slate-500' },
]

const columns = [
  {
    title: 'Imported',
    count: 8,
    color: 'bg-amber-500',
    borderColor: 'border-amber-200',
    bgColor: 'bg-amber-50',
    patients: importedPatients,
    icon: Download,
  },
  {
    title: 'Active',
    count: 18,
    color: 'bg-blue-500',
    borderColor: 'border-blue-200',
    bgColor: 'bg-blue-50',
    patients: activePatients,
    icon: Users,
  },
  {
    title: 'Completed',
    count: 29,
    color: 'bg-emerald-500',
    borderColor: 'border-emerald-200',
    bgColor: 'bg-emerald-50',
    patients: completedPatients,
    icon: CheckCircle2,
  },
]

const procedureFilters = ['All', 'Cosmetic Surgery', 'Orthopedic', 'Dental Surgery']

export default function ClinicPipelinePage() {
  const [selectedFilter, setSelectedFilter] = useState('All')

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Patient Pipeline</h1>
          <p className="text-slate-500">Track patients through their treatment journey</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="input py-2 text-sm w-48"
          >
            {procedureFilters.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {columns.map((column) => (
          <div key={column.title} className="flex flex-col">
            {/* Column Header */}
            <div className={`${column.bgColor} rounded-t-2xl p-4 border ${column.borderColor} border-b-0`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${column.color}`} />
                  <h3 className="font-semibold text-slate-900">{column.title}</h3>
                </div>
                <span className="text-sm font-bold text-slate-600 bg-white px-2.5 py-1 rounded-lg">
                  {column.count}
                </span>
              </div>
            </div>

            {/* Column Body */}
            <div className={`flex-1 p-3 border ${column.borderColor} border-t-0 rounded-b-2xl bg-white space-y-3 min-h-[300px]`}>
              {column.patients.map((patient) => (
                <div
                  key={patient.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${patient.avatarGradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                    >
                      {patient.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 truncate">{patient.name}</p>
                      <p className="text-xs text-slate-500">{patient.procedure}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{patient.procedureDate}</span>
                    <div className="flex gap-1">
                      <Link
                        href={`/clinic/patients/${patient.id}`}
                        className="px-2 py-1 text-xs font-medium text-slate-600 hover:text-violet-600 hover:bg-violet-50 rounded-md transition-colors"
                      >
                        View
                      </Link>
                      {column.title !== 'Completed' && (
                        <button className="px-2 py-1 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors flex items-center gap-0.5">
                          Move <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {column.title === 'Completed' && (
                <p className="text-xs text-slate-400 text-center py-2">
                  + 24 more completed
                </p>
              )}
              {column.title === 'Active' && (
                <p className="text-xs text-slate-400 text-center py-2">
                  + 12 more active
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Flow Arrows (visible on desktop) */}
      <div className="hidden lg:flex items-center justify-center gap-4 mb-8 -mt-4">
        <div className="flex items-center gap-2 text-slate-400">
          <div className="w-12 h-0.5 bg-slate-300" />
          <ArrowRight className="w-4 h-4" />
          <span className="text-xs font-medium">Avg. 5 days</span>
          <ArrowRight className="w-4 h-4" />
          <div className="w-12 h-0.5 bg-slate-300" />
          <ArrowRight className="w-4 h-4" />
          <span className="text-xs font-medium">Avg. 9 days</span>
          <ArrowRight className="w-4 h-4" />
          <div className="w-12 h-0.5 bg-slate-300" />
        </div>
      </div>

      {/* Pipeline Analytics */}
      <div className="card-premium p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-violet-500" />
          Pipeline Analytics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <p className="text-3xl font-bold text-slate-900">14</p>
            <p className="text-sm text-slate-500 mt-1">Avg. Days in Pipeline</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              <Clock className="w-3 h-3 text-slate-400" />
              <span className="text-xs text-slate-400">Total time Imported to Completed</span>
            </div>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-xl border border-amber-100">
            <p className="text-3xl font-bold text-amber-700">5</p>
            <p className="text-sm text-slate-500 mt-1">Avg. Days: Imported to Active</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              <Download className="w-3 h-3 text-amber-400" />
              <span className="text-xs text-amber-600">Intake + verification</span>
            </div>
          </div>
          <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <p className="text-3xl font-bold text-emerald-700">9</p>
            <p className="text-sm text-slate-500 mt-1">Avg. Days: Active to Completed</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span className="text-xs text-emerald-600">Treatment + recovery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
