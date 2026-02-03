import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { 
  Settings, 
  User,
  Shield,
  Bell,
  Key,
  Building2,
  ArrowLeft,
  CheckCircle2,
  Mail,
  Phone
} from 'lucide-react'

export default async function ClinicianSettingsPage() {
  const session = await getSession()
  if (!session || session.role !== 'CLINICIAN') redirect('/login')

  const clinician = await prisma.clinician.findUnique({
    where: { userId: session.id },
    include: { user: true },
  })

  if (!clinician) redirect('/login')

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/clinician/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-500">Manage your account and preferences</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="card-premium p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-violet-500" />
              Personal Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name</label>
                <input 
                  type="text" 
                  defaultValue={clinician.fullName}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input 
                  type="email" 
                  defaultValue={clinician.user.email}
                  className="input"
                  disabled
                />
              </div>
              <div>
                <label className="label">Specialty</label>
                <input 
                  type="text" 
                  defaultValue={clinician.specialty || ''}
                  className="input"
                />
              </div>
              <div>
                <label className="label">License Number</label>
                <input 
                  type="text" 
                  defaultValue={clinician.licenseNumber}
                  className="input"
                  disabled
                />
              </div>
            </div>
            
            <button className="btn-primary mt-4">
              Save Changes
            </button>
          </div>

          {/* Institution */}
          <div className="card-premium p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-500" />
              Institution
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Institution Name</label>
                <input 
                  type="text" 
                  defaultValue={clinician.institution || ''}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Country</label>
                <input 
                  type="text" 
                  defaultValue={clinician.country || ''}
                  className="input"
                />
              </div>
            </div>
            
            <button className="btn-primary mt-4">
              Update Institution
            </button>
          </div>

          {/* Notifications */}
          <div className="card-premium p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              Notifications
            </h2>
            
            <div className="space-y-4">
              {[
                { label: 'Email notifications for new verification requests', defaultChecked: true },
                { label: 'SMS alerts for urgent patient updates', defaultChecked: false },
                { label: 'Weekly summary of verifications', defaultChecked: true },
                { label: 'System maintenance notifications', defaultChecked: true },
              ].map((item, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    defaultChecked={item.defaultChecked}
                    className="w-5 h-5 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                  />
                  <span className="text-slate-700">{item.label}</span>
                </label>
              ))}
            </div>
            
            <button className="btn-secondary mt-4">
              Save Preferences
            </button>
          </div>

          {/* Security */}
          <div className="card-premium p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-rose-500" />
              Security
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="label">Current Password</label>
                <input type="password" className="input" placeholder="••••••••" />
              </div>
              <div>
                <label className="label">New Password</label>
                <input type="password" className="input" placeholder="••••••••" />
              </div>
              <div>
                <label className="label">Confirm New Password</label>
                <input type="password" className="input" placeholder="••••••••" />
              </div>
            </div>
            
            <button className="btn-danger mt-4">
              Change Password
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Status */}
          <div className="card-premium p-6 bg-gradient-to-br from-emerald-50 to-teal-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Verified Provider</p>
                <p className="text-sm text-slate-500">Account in good standing</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                License verified
              </div>
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                Identity confirmed
              </div>
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                Institution verified
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="card-premium p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Account Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-4 h-4" />
                {clinician.user.email}
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Building2 className="w-4 h-4" />
                {clinician.institution || 'Not set'}
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Shield className="w-4 h-4" />
                License: {clinician.licenseNumber}
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card-premium p-6 border-rose-200 bg-rose-50">
            <h3 className="font-semibold text-rose-900 mb-2">Danger Zone</h3>
            <p className="text-sm text-rose-700 mb-4">
              Permanently delete your account and all associated data.
            </p>
            <button className="btn-danger btn-sm w-full">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
