'use client'

import { useState } from 'react'
import {
  Building2,
  Users,
  Stethoscope,
  Bell,
  CreditCard,
  Shield,
  Save,
  Plus,
  Mail,
  Phone,
  MapPin,
  Globe,
  Upload,
  CheckCircle2,
  ExternalLink,
  Smartphone,
  MessageSquare,
  Key,
  Download,
  FileText,
} from 'lucide-react'

const currentAdmins = [
  { id: '1', name: 'Dr. Somchai Prasert', role: 'Owner', email: 'somchai@novamed.co.th', permissions: 'Full Access' },
  { id: '2', name: 'Nurse Priya Sharma', role: 'Admin', email: 'priya@novamed.co.th', permissions: 'Staff & Patients' },
  { id: '3', name: 'Receptionist Maya', role: 'Staff', email: 'maya@novamed.co.th', permissions: 'Patients Only' },
]

const linkedClinicians = [
  { id: '1', name: 'Dr. Ananya Patel', specialty: 'Cosmetic Surgery', status: 'active', verifications: 24 },
  { id: '2', name: 'Dr. James Liu', specialty: 'Orthopedic Surgery', status: 'active', verifications: 18 },
  { id: '3', name: 'Dr. Sarah Kim', specialty: 'Dental Surgery', status: 'pending', verifications: 0 },
]

export default function ClinicSettingsPage() {
  const [activeSection, setActiveSection] = useState('profile')
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const sections = [
    { id: 'profile', label: 'Clinic Profile', icon: Building2 },
    { id: 'users', label: 'Users & Permissions', icon: Users },
    { id: 'clinicians', label: 'Clinician Access', icon: Stethoscope },
    { id: 'integrations', label: 'Integrations', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'privacy', label: 'Data & Privacy', icon: Shield },
  ]

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-500">Manage clinic configuration, users, and integrations</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Section Navigation */}
        <div className="lg:col-span-1">
          <div className="card-premium p-2 sticky top-6">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-violet-50 text-violet-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Clinic Profile */}
          {activeSection === 'profile' && (
            <div className="card-premium p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-violet-500" />
                Clinic Profile
              </h2>

              {/* Logo */}
              <div className="mb-6">
                <label className="label">Clinic Logo</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                    NM
                  </div>
                  <button className="btn-secondary btn-sm">
                    <Upload className="w-4 h-4" />
                    Upload Logo
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="label">Clinic Name</label>
                  <input type="text" className="input" defaultValue="NovaMed Tourism Clinic" />
                </div>
                <div>
                  <label className="label">Location</label>
                  <input type="text" className="input" defaultValue="Bangkok, Thailand" />
                </div>
                <div>
                  <label className="label">Website</label>
                  <input type="url" className="input" defaultValue="https://novamed.co.th" />
                </div>
                <div>
                  <label className="label">Contact Email</label>
                  <input type="email" className="input" defaultValue="contact@novamed.co.th" />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input type="tel" className="input" defaultValue="+66 2 xxx xxxx" />
                </div>
                <div>
                  <label className="label">Specialty</label>
                  <input type="text" className="input" defaultValue="Medical Tourism, Cosmetic Surgery" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Address</label>
                  <input type="text" className="input" defaultValue="123 Sukhumvit Road, Khlong Toei, Bangkok 10110" />
                </div>
              </div>

              <button onClick={handleSave} className="btn-primary">
                <Save className="w-4 h-4" />
                {saved ? 'Saved!' : 'Save Changes'}
              </button>
            </div>
          )}

          {/* Users & Permissions */}
          {activeSection === 'users' && (
            <div className="card-premium p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  Admin Users & Permissions
                </h2>
                <button className="btn-primary btn-sm">
                  <Plus className="w-4 h-4" />
                  Invite New Admin User
                </button>
              </div>

              <div className="space-y-3">
                {currentAdmins.map((admin) => (
                  <div key={admin.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {admin.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{admin.name}</p>
                        <p className="text-sm text-slate-500">{admin.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500">{admin.permissions}</span>
                      <span className={`badge ${admin.role === 'Owner' ? 'badge-purple' : admin.role === 'Admin' ? 'badge-info' : 'badge-unverified'}`}>
                        {admin.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clinician Access */}
          {activeSection === 'clinicians' && (
            <div className="card-premium p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-emerald-500" />
                  Linked Clinicians
                </h2>
                <button className="btn-primary btn-sm">
                  <Plus className="w-4 h-4" />
                  Invite New Clinician
                </button>
              </div>

              <div className="space-y-3">
                {linkedClinicians.map((clinician) => (
                  <div key={clinician.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                        {clinician.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{clinician.name}</p>
                        <p className="text-sm text-slate-500">{clinician.specialty}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {clinician.verifications > 0 && (
                        <span className="text-xs text-slate-500">{clinician.verifications} verifications</span>
                      )}
                      <span className={`badge ${clinician.status === 'active' ? 'badge-verified' : 'badge-gold'}`}>
                        {clinician.status === 'active' ? 'Active' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Integrations */}
          {activeSection === 'integrations' && (
            <div className="card-premium p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                Integrations
              </h2>

              <div className="space-y-4">
                {[
                  {
                    name: 'Email Notifications',
                    description: 'Send notifications via email for new patients, form completions, and alerts',
                    icon: Mail,
                    iconColor: 'text-blue-500',
                    enabled: true,
                  },
                  {
                    name: 'SMS Notifications',
                    description: 'Send SMS reminders to patients for upcoming procedures',
                    icon: Smartphone,
                    iconColor: 'text-emerald-500',
                    enabled: true,
                  },
                  {
                    name: 'Slack Webhook',
                    description: 'Post notifications to a Slack channel for team awareness',
                    icon: MessageSquare,
                    iconColor: 'text-violet-500',
                    enabled: false,
                  },
                ].map((integration) => (
                  <div key={integration.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                        <integration.icon className={`w-5 h-5 ${integration.iconColor}`} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{integration.name}</p>
                        <p className="text-sm text-slate-500">{integration.description}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={integration.enabled} className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Billing */}
          {activeSection === 'billing' && (
            <div className="card-premium p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-violet-500" />
                Billing & Plan
              </h2>

              <div className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border border-violet-200 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-violet-600 uppercase">Current Plan</p>
                    <p className="text-2xl font-bold text-slate-900">ATLAS Clinic Pro</p>
                  </div>
                  <span className="badge badge-verified">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                </div>
                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Price</p>
                    <p className="font-semibold text-slate-900">$299/month</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Billing Cycle</p>
                    <p className="font-semibold text-slate-900">Monthly</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Next Invoice</p>
                    <p className="font-semibold text-slate-900">Mar 1, 2026</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="btn-secondary">
                  <CreditCard className="w-4 h-4" />
                  Update Payment Method
                </button>
                <button className="btn-ghost text-violet-600">
                  <ExternalLink className="w-4 h-4" />
                  View Invoices
                </button>
              </div>
            </div>
          )}

          {/* Data & Privacy */}
          {activeSection === 'privacy' && (
            <div className="card-premium p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-rose-500" />
                Data & Privacy
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">GDPR Data Download</p>
                      <p className="text-sm text-slate-500">Download all patient data in GDPR-compliant format</p>
                    </div>
                    <button className="btn-secondary btn-sm">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Data Processing Agreement (DPA)</p>
                      <p className="text-sm text-slate-500">View and sign the ATLAS data processing agreement</p>
                    </div>
                    <button className="btn-secondary btn-sm">
                      <FileText className="w-4 h-4" />
                      View DPA
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">HIPAA Compliance Documentation</p>
                      <p className="text-sm text-slate-500">Access HIPAA compliance certificates and policies</p>
                    </div>
                    <button className="btn-secondary btn-sm">
                      <FileText className="w-4 h-4" />
                      View Docs
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">API Keys</p>
                      <p className="text-sm text-slate-500">Manage API keys for third-party integrations</p>
                    </div>
                    <button className="btn-secondary btn-sm">
                      <Key className="w-4 h-4" />
                      Manage Keys
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
