'use client'

import { useState, useEffect } from 'react'
import { 
  Settings, 
  User, 
  Globe, 
  Bell, 
  Lock,
  Save,
  CheckCircle2,
  Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProfileData {
  fullName: string
  phone: string | null
  preferredLanguage: string
  emergencyLocked: boolean
}

const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية' },
  { code: 'zh', label: '中文' },
]

export default function SettingsPage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    const res = await fetch('/api/patient/profile')
    const data = await res.json()
    setProfile({
      fullName: data.fullName,
      phone: data.phone,
      preferredLanguage: data.preferredLanguage,
      emergencyLocked: data.emergencyLocked,
    })
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
    })

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-clinical-200 rounded" />
          <div className="h-64 bg-clinical-200 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-clinical-900 mb-2">
          Settings
        </h1>
        <p className="text-clinical-500">
          Manage your account preferences and security settings
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="atlas-card p-4">
          <nav className="space-y-1">
            {[
              { id: 'profile', icon: User, label: 'Profile' },
              { id: 'language', icon: Globe, label: 'Language' },
              { id: 'security', icon: Lock, label: 'Security' },
              { id: 'notifications', icon: Bell, label: 'Notifications' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  activeTab === tab.id
                    ? 'bg-atlas-50 text-atlas-700'
                    : 'text-clinical-600 hover:bg-clinical-50'
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
            <div className="atlas-card p-6">
              <h2 className="text-lg font-semibold text-clinical-900 mb-6">Profile Information</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    value={profile?.fullName || ''}
                    onChange={(e) => setProfile(p => p ? { ...p, fullName: e.target.value } : null)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input
                    type="tel"
                    value={profile?.phone || ''}
                    onChange={(e) => setProfile(p => p ? { ...p, phone: e.target.value } : null)}
                    className="input"
                    placeholder="+1 555 123 4567"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'language' && (
            <div className="atlas-card p-6">
              <h2 className="text-lg font-semibold text-clinical-900 mb-6">Language Preferences</h2>
              <div className="max-w-md">
                <label className="label">Preferred Language</label>
                <p className="text-sm text-clinical-500 mb-3">
                  This affects clinical summaries and emergency access translations
                </p>
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <label
                      key={lang.code}
                      className={cn(
                        'flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer',
                        profile?.preferredLanguage === lang.code
                          ? 'border-atlas-500 bg-atlas-50'
                          : 'border-clinical-200 hover:border-clinical-300'
                      )}
                    >
                      <input
                        type="radio"
                        name="language"
                        value={lang.code}
                        checked={profile?.preferredLanguage === lang.code}
                        onChange={() => setProfile(p => p ? { ...p, preferredLanguage: lang.code } : null)}
                        className="sr-only"
                      />
                      <span className="font-medium text-clinical-900">{lang.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="atlas-card p-6">
              <h2 className="text-lg font-semibold text-clinical-900 mb-6">Security Settings</h2>
              <div className="space-y-6 max-w-lg">
                <div className="p-4 bg-alert-50 rounded-lg border border-alert-200">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-alert-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-alert-800">Emergency Access Lock</h3>
                      <p className="text-sm text-alert-700 mt-1">
                        Require additional verification for emergency access. Clinicians will need to 
                        use override with their credentials.
                      </p>
                      <label className="flex items-center gap-3 mt-4 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={profile?.emergencyLocked || false}
                          onChange={(e) => setProfile(p => p ? { ...p, emergencyLocked: e.target.checked } : null)}
                          className="w-5 h-5 rounded border-clinical-300 text-alert-600"
                        />
                        <span className="font-medium text-alert-800">Lock emergency access</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-clinical-900 mb-3">Change Password</h3>
                  <button className="btn-secondary">
                    Change Password
                  </button>
                  <p className="text-sm text-clinical-500 mt-2">
                    Last changed: Never (demo account)
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="atlas-card p-6">
              <h2 className="text-lg font-semibold text-clinical-900 mb-6">Notification Preferences</h2>
              <div className="space-y-4 max-w-lg">
                {[
                  { id: 'access', label: 'Record Access Alerts', description: 'Get notified when someone accesses your records' },
                  { id: 'emergency', label: 'Emergency Access Alerts', description: 'Immediate notification on emergency access' },
                  { id: 'expiry', label: 'Consent Expiry Reminders', description: 'Remind when share links are about to expire' },
                  { id: 'updates', label: 'Product Updates', description: 'News and feature announcements' },
                ].map((pref) => (
                  <label key={pref.id} className="flex items-start gap-3 p-4 bg-clinical-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={pref.id !== 'updates'}
                      className="w-5 h-5 rounded border-clinical-300 text-atlas-600 mt-0.5"
                    />
                    <div>
                      <p className="font-medium text-clinical-900">{pref.label}</p>
                      <p className="text-sm text-clinical-500">{pref.description}</p>
                    </div>
                  </label>
                ))}
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
              <span className="text-medical-600 flex items-center gap-2">
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
