'use client'

import { useState, useEffect } from 'react'
import { 
  Heart, 
  Shield, 
  Save,
  AlertTriangle,
  CheckCircle2,
  User
} from 'lucide-react'

interface DirectivesData {
  organDonor: boolean
  advanceDirective: string | null
  decisionMakerName: string | null
  decisionMakerPhone: string | null
}

export default function DirectivesPage() {
  const [data, setData] = useState<DirectivesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const res = await fetch('/api/patient/profile')
    const profile = await res.json()
    setData({
      organDonor: profile.organDonor,
      advanceDirective: profile.advanceDirective,
      decisionMakerName: profile.decisionMakerName,
      decisionMakerPhone: profile.decisionMakerPhone,
    })
    setLoading(false)
  }

  async function handleSave() {
    if (!data) return
    setSaving(true)
    setSaved(false)

    await fetch('/api/patient/directives', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
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
          Advance Directives
        </h1>
        <p className="text-clinical-500">
          Record your healthcare wishes and designate a decision-maker
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Important Notice */}
        <div className="atlas-card p-4 bg-alert-50 border-alert-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-alert-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-alert-800">Emergency Visibility</p>
              <p className="text-sm text-alert-700 mt-1">
                Your advance directive and organ donor status are visible during emergency access.
                This information could be critical for first responders.
              </p>
            </div>
          </div>
        </div>

        {/* Organ Donor */}
        <div className="atlas-card p-6">
          <h2 className="text-lg font-semibold text-clinical-900 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-alert-500" />
            Organ Donor Status
          </h2>
          <div className="flex gap-4">
            <label className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
              data?.organDonor ? 'border-medical-500 bg-medical-50' : 'border-clinical-200'
            }`}>
              <input
                type="radio"
                name="organDonor"
                checked={data?.organDonor === true}
                onChange={() => setData(d => d ? { ...d, organDonor: true } : null)}
                className="sr-only"
              />
              <CheckCircle2 className={`w-6 h-6 ${data?.organDonor ? 'text-medical-600' : 'text-clinical-400'}`} />
              <span className="font-medium text-clinical-900">Yes, I am an organ donor</span>
            </label>
            <label className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
              data?.organDonor === false ? 'border-clinical-500 bg-clinical-50' : 'border-clinical-200'
            }`}>
              <input
                type="radio"
                name="organDonor"
                checked={data?.organDonor === false}
                onChange={() => setData(d => d ? { ...d, organDonor: false } : null)}
                className="sr-only"
              />
              <span className="font-medium text-clinical-900">No</span>
            </label>
          </div>
        </div>

        {/* Advance Directive */}
        <div className="atlas-card p-6">
          <h2 className="text-lg font-semibold text-clinical-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-atlas-500" />
            Advance Directive / Living Will
          </h2>
          <p className="text-sm text-clinical-500 mb-4">
            Describe your healthcare preferences and end-of-life wishes. This will be shown to 
            healthcare providers during emergency access.
          </p>
          <textarea
            value={data?.advanceDirective || ''}
            onChange={(e) => setData(d => d ? { ...d, advanceDirective: e.target.value } : null)}
            className="input min-h-[150px]"
            placeholder="Example: No resuscitation if brain death is confirmed. Do not use artificial life support if there is no reasonable expectation of recovery."
          />
        </div>

        {/* Healthcare Proxy */}
        <div className="atlas-card p-6">
          <h2 className="text-lg font-semibold text-clinical-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-medical-500" />
            Healthcare Proxy / Decision Maker
          </h2>
          <p className="text-sm text-clinical-500 mb-4">
            Designate someone to make healthcare decisions on your behalf if you are unable to.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                value={data?.decisionMakerName || ''}
                onChange={(e) => setData(d => d ? { ...d, decisionMakerName: e.target.value } : null)}
                className="input"
                placeholder="e.g., Jane Doe"
              />
            </div>
            <div>
              <label className="label">Phone Number</label>
              <input
                type="tel"
                value={data?.decisionMakerPhone || ''}
                onChange={(e) => setData(d => d ? { ...d, decisionMakerPhone: e.target.value } : null)}
                className="input"
                placeholder="+1 555 123 4567"
              />
            </div>
          </div>
        </div>

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
  )
}
