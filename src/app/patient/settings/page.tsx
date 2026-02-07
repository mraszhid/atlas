'use client'

import { useState, useEffect } from 'react'
import {
  User,
  Globe,
  Bell,
  Lock,
  Unlock,
  Save,
  CheckCircle2,
  Shield,
  Users,
  Database,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Download,
  Key
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProfileData {
  fullName: string
  email: string | null
  phone: string | null
  dateOfBirth: string
  nationality: string
  bloodType: string | null
  preferredLanguage: string
  emergencyLocked: boolean
  notifyAccess: boolean
  notifyEmergency: boolean
  notifyExpiry: boolean
  notifyUpdates: boolean
}

const MOCK_PROFILE: ProfileData = {
  fullName: 'Muhammad Al-Rashid',
  email: 'muhammad.rashid@email.com',
  phone: '+971 50 847 2391',
  dateOfBirth: '1987-03-15',
  nationality: 'UAE',
  bloodType: 'O+',
  preferredLanguage: 'en',
  emergencyLocked: false,
  notifyAccess: true,
  notifyEmergency: true,
  notifyExpiry: true,
  notifyUpdates: false,
}

const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Espanol' },
  { code: 'fr', label: 'Francais' },
  { code: 'ar', label: 'Arabic' },
  { code: 'zh', label: 'Chinese' },
]

export default function SettingsPage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [editingField, setEditingField] = useState<string | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    try {
      const res = await fetch('/api/patient/profile')
      if (res.ok) {
        const data = await res.json()
        if (data && !data.error) {
          setProfile({
            fullName: data.fullName,
            email: data.email || MOCK_PROFILE.email,
            phone: data.phone || MOCK_PROFILE.phone,
            dateOfBirth: data.dateOfBirth || MOCK_PROFILE.dateOfBirth,
            nationality: data.nationality || MOCK_PROFILE.nationality,
            bloodType: data.bloodType || MOCK_PROFILE.bloodType,
            preferredLanguage: data.preferredLanguage || 'en',
            emergencyLocked: data.emergencyLocked ?? false,
            notifyAccess: true,
            notifyEmergency: true,
            notifyExpiry: true,
            notifyUpdates: false,
          })
          setLoading(false)
          return
        }
      }
    } catch {}
    setProfile(MOCK_PROFILE)
    setLoading(false)
  }

  async function handleSave() {
    if (!profile) return
    setSaving(true)
    setSaved(false)
    await fetch('/api/patient/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    }).catch(() => {})
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-slate-200 rounded" />
          <div className="h-4 w-80 bg-slate-200 rounded" />
          <div className="h-64 bg-slate-200 rounded-xl" />
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'preferences', icon: Globe, label: 'Preferences' },
    { id: 'security', icon: Lock, label: 'Security' },
    { id: 'delegation', icon: Users, label: 'Delegation' },
    { id: 'data', icon: Database, label: 'Data & Privacy' },
  ]

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          Settings
        </h1>
        <p className="text-slate-500">
          Manage your account preferences and security settings
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="card-premium p-4">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left',
                  activeTab === tab.id
                    ? 'bg-violet-50 text-violet-700'
                    : 'text-slate-600 hover:bg-slate-50'
                )}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'profile' && (
            <div className="card-premium p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Profile Information</h2>
              <div className="space-y-4 max-w-lg">
                {[
                  { key: 'fullName', label: 'Full Name', type: 'text' },
                  { key: 'email', label: 'Email', type: 'email' },
                  { key: 'phone', label: 'Phone', type: 'tel' },
                  { key: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
                  { key: 'nationality', label: 'Nationality', type: 'text' },
                ].map((field) => (
                  <div key={field.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">{field.label}</p>
                      {editingField === field.key ? (
                        <input
                          type={field.type}
                          value={(profile as any)?.[field.key] || ''}
                          onChange={(e) => setProfile(p => p ? { ...p, [field.key]: e.target.value } : null)}
                          onBlur={() => setEditingField(null)}
                          className="input py-1 px-2 text-sm"
                          autoFocus
                          aria-label={field.label}
                        />
                      ) : (
                        <p className="font-medium text-slate-900">
                          {field.type === 'date' && (profile as any)?.[field.key]
                            ? new Date((profile as any)[field.key]).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                            : (profile as any)?.[field.key] || 'Not set'}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setEditingField(editingField === field.key ? null : field.key)}
                      className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                      aria-label={`Edit ${field.label}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Blood Type</p>
                    <p className="font-medium text-slate-900">{profile?.bloodType || 'Not set'}</p>
                  </div>
                  <select
                    value={profile?.bloodType || ''}
                    onChange={(e) => setProfile(p => p ? { ...p, bloodType: e.target.value } : null)}
                    className="input w-24 py-1 px-2 text-sm"
                    aria-label="Blood Type"
                  >
                    <option value="">Unknown</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <>
              {/* Language */}
              <div className="card-premium p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Language</h2>
                <div className="max-w-md">
                  <select
                    value={profile?.preferredLanguage || 'en'}
                    onChange={(e) => setProfile(p => p ? { ...p, preferredLanguage: e.target.value } : null)}
                    className="input"
                    aria-label="Preferred language"
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.label}</option>
                    ))}
                  </select>
                  <p className="text-sm text-slate-500 mt-2">
                    This affects clinical summaries and emergency access translations
                  </p>
                </div>
              </div>

              {/* Notifications */}
              <div className="card-premium p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-slate-600" />
                  Notifications
                </h2>
                <div className="space-y-3 max-w-lg">
                  {[
                    { key: 'notifyAccess', label: 'Record Access Alerts', description: 'Get notified when someone accesses your records' },
                    { key: 'notifyEmergency', label: 'Emergency Access Alerts', description: 'Immediate notification on emergency access' },
                    { key: 'notifyExpiry', label: 'Consent Expiry Reminders', description: 'Remind when share links are about to expire' },
                    { key: 'notifyUpdates', label: 'Product Updates', description: 'News and feature announcements' },
                  ].map((pref) => (
                    <label key={pref.key} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(profile as any)?.[pref.key] ?? false}
                        onChange={(e) => setProfile(p => p ? { ...p, [pref.key]: e.target.checked } : null)}
                        className="w-5 h-5 rounded border-slate-300 text-violet-600 mt-0.5"
                      />
                      <div>
                        <p className="font-medium text-slate-900">{pref.label}</p>
                        <p className="text-sm text-slate-500">{pref.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'security' && (
            <>
              {/* Emergency Lock */}
              <div className="card-premium p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-rose-500" />
                  Emergency Lock Settings
                </h2>

                <div className="flex items-center gap-4 mb-4">
                  <div className={cn(
                    'px-4 py-3 rounded-xl border-2 font-semibold flex items-center gap-2',
                    profile?.emergencyLocked
                      ? 'border-rose-300 bg-rose-50 text-rose-700'
                      : 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  )}>
                    {profile?.emergencyLocked
                      ? <><Lock className="w-5 h-5" /> LOCKED</>
                      : <><Unlock className="w-5 h-5" /> UNLOCKED</>
                    }
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-4">
                  {profile?.emergencyLocked
                    ? 'Emergency access requires clinician override with their credentials.'
                    : 'First responders can access your critical health data with your emergency code.'}
                </p>

                <div className="flex gap-3">
                  {profile?.emergencyLocked ? (
                    <>
                      <button
                        onClick={() => setProfile(p => p ? { ...p, emergencyLocked: false } : null)}
                        className="btn-primary"
                      >
                        <Unlock className="w-4 h-4" />
                        Unlock for 24 hours
                      </button>
                      <button
                        onClick={() => setProfile(p => p ? { ...p, emergencyLocked: false } : null)}
                        className="btn-secondary"
                      >
                        Unlock permanently
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setProfile(p => p ? { ...p, emergencyLocked: true } : null)}
                      className="btn-danger"
                    >
                      <Lock className="w-4 h-4" />
                      Lock Emergency Access
                    </button>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="card-premium p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Account Security</h2>
                <div className="space-y-4 max-w-lg">
                  <div>
                    <button className="btn-secondary">
                      <Key className="w-4 h-4" />
                      Change Password
                    </button>
                    <p className="text-sm text-slate-500 mt-2">Last changed: Never (demo account)</p>
                  </div>
                  <div>
                    <button onClick={handleLogout} className="btn-ghost text-rose-600 hover:text-rose-700 hover:bg-rose-50">
                      <LogOut className="w-4 h-4" />
                      Logout All Devices
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'delegation' && (
            <div className="card-premium p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">Delegation</h2>
                <button className="btn-primary btn-sm">
                  <Plus className="w-4 h-4" />
                  Invite Family Member / POA
                </button>
              </div>
              <p className="text-sm text-slate-500 mb-6">
                Grant limited access to family members or your healthcare power of attorney to manage parts of your health record.
              </p>
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No delegates added</p>
                <p className="text-sm text-slate-400 mt-1">
                  Invite a family member or POA to help manage your records
                </p>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="card-premium p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Data & Privacy</h2>
              <div className="space-y-4 max-w-lg">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h3 className="font-medium text-slate-900 mb-2">Download My Data (GDPR)</h3>
                  <p className="text-sm text-slate-500 mb-3">
                    Download a complete copy of all your health data in a portable format.
                  </p>
                  <button className="btn-secondary btn-sm">
                    <Download className="w-4 h-4" />
                    Download My Data
                  </button>
                </div>
                <div className="p-4 bg-rose-50 rounded-xl border border-rose-200">
                  <h3 className="font-medium text-rose-900 mb-2">Request Data Deletion</h3>
                  <p className="text-sm text-rose-700 mb-3">
                    Request permanent deletion of all your data. This action cannot be undone.
                  </p>
                  <button className="btn-danger btn-sm">
                    <Trash2 className="w-4 h-4" />
                    Request Data Deletion
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            {saved && (
              <span className="text-emerald-600 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Saved successfully
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
