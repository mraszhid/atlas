import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { 
  Settings, 
  Building2,
  Bell,
  Key,
  User,
  ArrowLeft,
  CheckCircle2,
  Mail,
  Shield,
  Globe
} from 'lucide-react'

export default async function InsurerSettingsPage() {
  const session = await getSession()
  if (!session || session.role !== 'INSURER') redirect('/login')

  const insurer = await prisma.insurer.findUnique({
    where: { userId: session.id },
    include: { user: true },
  })

  if (!insurer) redirect('/login')

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/insurer/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-500">Manage your account and company settings</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="card-premium p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-violet-500" />
              Agent Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Agent Name</label>
                <input 
                  type="text" 
                  defaultValue={insurer.agentName || ''}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input 
                  type="email" 
                  defaultValue={insurer.user.email}
                  className="input"
                  disabled
                />
              </div>
              <div>
                <label className="label">Agent ID</label>
                <input 
                  type="text" 
                  defaultValue="AGT-2024-001"
                  className="input"
                  disabled
                />
              </div>
              <div>
                <label className="label">Department</label>
                <input 
                  type="text" 
                  defaultValue="Claims Processing"
                  className="input"
                />
              </div>
            </div>
            
            <button className="btn-primary mt-4">
              Save Changes
            </button>
          </div>

          {/* Company Information */}
          <div className="card-premium p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-500" />
              Company Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Company Name</label>
                <input 
                  type="text" 
                  defaultValue={insurer.companyName || ''}
                  className="input"
                  disabled
                />
              </div>
              <div>
                <label className="label">Company ID</label>
                <input 
                  type="text" 
                  defaultValue="INS-GTI-2024"
                  className="input"
                  disabled
                />
              </div>
              <div>
                <label className="label">Region</label>
                <input 
                  type="text" 
                  defaultValue="International"
                  className="input"
                  disabled
                />
              </div>
              <div>
                <label className="label">Support Email</label>
                <input 
                  type="email" 
                  defaultValue="support@globaltravel.ins"
                  className="input"
                  disabled
                />
              </div>
            </div>
            
            <p className="text-sm text-slate-500 mt-4">
              Contact your administrator to update company information.
            </p>
          </div>

          {/* Notifications */}
          <div className="card-premium p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-500" />
              Notifications
            </h2>
            
            <div className="space-y-4">
              {[
                { label: 'Email alerts for new claims submitted', defaultChecked: true },
                { label: 'Notification when verification is requested', defaultChecked: true },
                { label: 'Daily summary of pending claims', defaultChecked: false },
                { label: 'Alert for high-value claims (>$10,000)', defaultChecked: true },
                { label: 'Weekly activity report', defaultChecked: true },
              ].map((item, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    defaultChecked={item.defaultChecked}
                    className="w-5 h-5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
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
          <div className="card-premium p-6 bg-gradient-to-br from-amber-50 to-orange-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Verified Agent</p>
                <p className="text-sm text-slate-500">Full access granted</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                Identity verified
              </div>
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                Company authorized
              </div>
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                ATLAS connected
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="card-premium p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Account Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-4 h-4" />
                {insurer.user.email}
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Building2 className="w-4 h-4" />
                {insurer.companyName}
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Globe className="w-4 h-4" />
                International Coverage
              </div>
            </div>
          </div>

          {/* API Access */}
          <div className="card-premium p-6">
            <h3 className="font-semibold text-slate-900 mb-4">API Access</h3>
            <div className="p-3 bg-slate-100 rounded-xl">
              <p className="text-xs text-slate-500 uppercase mb-1">API Key</p>
              <p className="font-mono text-sm text-slate-700 truncate">gti_live_sk_•••••••••••</p>
            </div>
            <button className="btn-secondary btn-sm w-full mt-3">
              Regenerate Key
            </button>
          </div>

          {/* Danger Zone */}
          <div className="card-premium p-6 border-rose-200 bg-rose-50">
            <h3 className="font-semibold text-rose-900 mb-2">Danger Zone</h3>
            <p className="text-sm text-rose-700 mb-4">
              Deactivate your agent account. This will revoke all access.
            </p>
            <button className="btn-danger btn-sm w-full">
              Deactivate Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
