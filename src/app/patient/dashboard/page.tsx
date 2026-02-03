import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { 
  AlertTriangle, 
  Pill, 
  Activity, 
  Syringe,
  FileText,
  Shield,
  Clock,
  CheckCircle2,
  ArrowRight,
  Heart,
  QrCode,
  TrendingUp,
  Eye
} from 'lucide-react'
import { formatDate, calculateAge } from '@/lib/utils'

export default async function PatientDashboard() {
  const session = await getSession()
  if (!session || session.role !== 'PATIENT') redirect('/login')

  const patient = await prisma.patient.findUnique({
    where: { userId: session.id },
    include: {
      allergies: true,
      medications: true,
      conditions: true,
      surgeries: true,
      vaccinations: true,
      documents: true,
      emergencyContacts: true,
      insurance: true,
      primaryPhysician: true,
      verifications: {
        include: { clinician: true },
        orderBy: { verifiedAt: 'desc' },
        take: 1,
      },
      auditLogs: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  })

  if (!patient) redirect('/login')

  const verifiedCount = {
    allergies: patient.allergies.filter(a => a.verified).length,
    medications: patient.medications.filter(m => m.verified).length,
    conditions: patient.conditions.filter(c => c.verified).length,
  }

  const totalRecords = patient.allergies.length + patient.medications.length + patient.conditions.length + patient.surgeries.length + patient.vaccinations.length
  const totalVerified = patient.allergies.filter(a => a.verified).length + patient.medications.filter(m => m.verified).length + patient.conditions.filter(c => c.verified).length
  const verificationPercent = totalRecords > 0 ? Math.round((totalVerified / totalRecords) * 100) : 0

  const recentVerification = patient.verifications[0]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome back, {patient.fullName.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-500">
              Here's an overview of your health identity
            </p>
          </div>
          <Link href="/patient/atlas-card" className="btn-primary">
            <QrCode className="w-5 h-5" />
            View Atlas Card
          </Link>
        </div>
      </div>

      {/* Profile Summary Card */}
      <div className="card-premium p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
              {patient.fullName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{patient.fullName}</h2>
              <p className="text-slate-500">{patient.visaId || 'ATL-2024-0847'}</p>
            </div>
          </div>
          
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Blood Type</p>
              <p className="font-semibold text-slate-900">{patient.bloodType || 'O+'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Age</p>
              <p className="font-semibold text-slate-900">{calculateAge(patient.dateOfBirth)} years</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Nationality</p>
              <p className="font-semibold text-slate-900">{patient.nationality}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Emergency</p>
              <p className="font-mono text-sm font-semibold text-rose-600">{patient.emergencyCode}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Link href="/patient/wallet?tab=allergies" className="stat-card group hover:-translate-y-1 transition-all">
          <div className="icon-box bg-rose-100">
            <AlertTriangle className="w-6 h-6 text-rose-600" />
          </div>
          <p className="value">{patient.allergies.length}</p>
          <p className="stat-label">Allergies</p>
          {verifiedCount.allergies > 0 && (
            <span className="badge badge-verified mt-2">
              <CheckCircle2 className="w-3 h-3" /> {verifiedCount.allergies} verified
            </span>
          )}
        </Link>
        
        <Link href="/patient/wallet?tab=medications" className="stat-card group hover:-translate-y-1 transition-all">
          <div className="icon-box bg-blue-100">
            <Pill className="w-6 h-6 text-blue-600" />
          </div>
          <p className="value">{patient.medications.length}</p>
          <p className="stat-label">Medications</p>
          {verifiedCount.medications > 0 && (
            <span className="badge badge-verified mt-2">
              <CheckCircle2 className="w-3 h-3" /> {verifiedCount.medications} verified
            </span>
          )}
        </Link>
        
        <Link href="/patient/wallet?tab=conditions" className="stat-card group hover:-translate-y-1 transition-all">
          <div className="icon-box bg-violet-100">
            <Activity className="w-6 h-6 text-violet-600" />
          </div>
          <p className="value">{patient.conditions.length}</p>
          <p className="stat-label">Conditions</p>
        </Link>
        
        <Link href="/patient/wallet?tab=vaccinations" className="stat-card group hover:-translate-y-1 transition-all">
          <div className="icon-box bg-emerald-100">
            <Syringe className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="value">{patient.vaccinations.length}</p>
          <p className="stat-label">Vaccinations</p>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Verification Status */}
        <div className="card-premium p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Verification Status</h3>
            <span className="badge badge-info">{verificationPercent}%</span>
          </div>
          
          <div className="progress-bar mb-4">
            <div className="progress-fill" style={{ width: `${verificationPercent}%` }} />
          </div>
          
          <p className="text-sm text-slate-500 mb-4">
            {totalVerified} of {totalRecords} records verified by healthcare providers
          </p>
          
          {recentVerification && (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-700 text-sm font-medium mb-1">
                <CheckCircle2 className="w-4 h-4" />
                Last Verified
              </div>
              <p className="text-sm text-emerald-600">
                by {recentVerification.clinician.fullName}
              </p>
              <p className="text-xs text-emerald-500 mt-1">
                {formatDate(recentVerification.verifiedAt)}
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card-premium p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link href="/patient/documents" className="quick-action">
              <div className="icon-box bg-violet-100">
                <FileText className="w-5 h-5 text-violet-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">Upload Documents</p>
                <p className="text-sm text-slate-500">{patient.documents.length} files stored</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400" />
            </Link>
            
            <Link href="/patient/sharing" className="quick-action">
              <div className="icon-box bg-pink-100">
                <Shield className="w-5 h-5 text-pink-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">Share Records</p>
                <p className="text-sm text-slate-500">Create secure share links</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400" />
            </Link>
            
            <Link href="/patient/emr" className="quick-action">
              <div className="icon-box bg-cyan-100">
                <TrendingUp className="w-5 h-5 text-cyan-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">Import Records</p>
                <p className="text-sm text-slate-500">Connect to your EMR</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card-premium p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Recent Activity</h3>
            <Link href="/patient/audit-log" className="text-sm text-violet-600 hover:text-violet-700 font-medium">
              View all
            </Link>
          </div>
          
          {patient.auditLogs.length > 0 ? (
            <div className="space-y-3">
              {patient.auditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0">
                    <Eye className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {log.actorName || log.actorType}
                    </p>
                    <p className="text-xs text-slate-500">
                      {log.action} • {formatDate(log.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No recent activity</p>
            </div>
          )}
        </div>
      </div>

      {/* Emergency Contacts */}
      {patient.emergencyContacts.length > 0 && (
        <div className="mt-6 card-premium p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            Emergency Contacts
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {patient.emergencyContacts.map((contact) => (
              <div key={contact.id} className="p-4 bg-slate-50 rounded-xl">
                <p className="font-medium text-slate-900">{contact.name}</p>
                <p className="text-sm text-slate-500">{contact.relationship}</p>
                <p className="text-sm text-slate-600 mt-1">{contact.phone}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
