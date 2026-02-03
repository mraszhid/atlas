import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { 
  Settings, 
  Building2,
  Bell,
  Key,
  Users,
  ArrowLeft,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Globe
} from 'lucide-react'

export default async function ClinicSettingsPage() {
  const session = await getSession()
  if (!session || (session.role !== 'CLINIC_ADMIN' && session.role !== 'CLINIC_STAFF')) {
    redirect('/login')
  }

  const clinicStaff = await prisma.clinicStaff.findUnique({
    where: { userId: session.id },
    include: { 
      clinic: {
        include: {
          staff: true,
        },
      },
      user: true,
    },
  })

  if (!clinicStaff) redirect('/login')

  const clinic = clinicStaff.clinic
  const isAdmin = clinicStaff.role === 'ADMIN'

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/clinic/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-500">Manage clinic and account settings</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Clinic Information */}
          <div className="card-premium p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-violet-500" />
              Clinic Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Clinic Name</label>
                <input 
                  type="text" 
                  defaultValue={clinic.name}
                  className="input"
                  disabled={!isAdmin}
                />
              </div>
              <div>
                <label className="label">Specialty</label>
                <input 
                  type="text" 
                  defaultValue={clinic.specialty || ''}
                  className="input"
                  disabled={!isAdmin}
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input 
                  type="email" 
                  defaultValue={clinic.email || ''}
                  className="input"
                  disabled={!isAdmin}
                />
              </div>
              <div>
                <label className="label">Phone</label>
                <input 
                  type="tel" 
                  defaultValue={clinic.phone || ''}
                  className="input"
                  disabled={!isAdmin}
                />
              </div>
              <div className="md:col-span-2">
                <label className="label">Address</label>
                <input 
                  type="text" 
                  defaultValue={clinic.address || ''}
                  className="input"
                  disabled={!isAdmin}
                />
              </div>
              <div>
                <label className="label">City</label>
                <input 
                  type="text" 
                  defaultValue={clinic.city || ''}
                  className="input"
                  disabled={!isAdmin}
                />
              </div>
              <div>
                <label className="label">Country</label>
                <input 
                  type="text" 
                  defaultValue={clinic.country || ''}
                  className="input"
                  disabled={!isAdmin}
                />
              </div>
            </div>
            
            {isAdmin && (
              <button className="btn-primary mt-4">
                Save Changes
              </button>
            )}
          </div>

          {/* Staff Management */}
          {isAdmin && (
            <div className="card-premium p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Staff Members
              </h2>
              
              <div className="space-y-3">
                {clinic.staff.map((staff) => (
                  <div key={staff.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {staff.fullName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{staff.fullName}</p>
                        <p className="text-sm text-slate-500">{staff.role}</p>
                      </div>
                    </div>
                    <span className={`badge ${staff.role === 'ADMIN' ? 'badge-purple' : 'badge-info'}`}>
                      {staff.role}
                    </span>
                  </div>
                ))}
              </div>
              
              <button className="btn-secondary mt-4">
                <Users className="w-4 h-4" />
                Invite Staff Member
              </button>
            </div>
          )}

          {/* Notifications */}
          <div className="card-premium p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              Notifications
            </h2>
            
            <div className="space-y-4">
              {[
                { label: 'Email notifications for new patient imports', defaultChecked: true },
                { label: 'Alert when intake forms are completed', defaultChecked: true },
                { label: 'Daily summary of clinic activity', defaultChecked: false },
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
          {/* Clinic Status */}
          <div className="card-premium p-6 bg-gradient-to-br from-violet-50 to-purple-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{clinic.name}</p>
                <p className="text-sm text-slate-500">{clinic.specialty}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                Verified clinic
              </div>
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                ATLAS connected
              </div>
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                Intake forms active
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="card-premium p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Contact Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-4 h-4" />
                {clinic.email}
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-4 h-4" />
                {clinic.phone}
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-4 h-4" />
                {clinic.city}, {clinic.country}
              </div>
            </div>
          </div>

          {/* Your Account */}
          <div className="card-premium p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Your Account</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold">
                {clinicStaff.fullName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-medium text-slate-900">{clinicStaff.fullName}</p>
                <p className="text-sm text-slate-500">{clinicStaff.role}</p>
              </div>
            </div>
            <p className="text-sm text-slate-500">{clinicStaff.user.email}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
