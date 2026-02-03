'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { 
  Globe, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  Upload,
  Clock,
  Shield,
  ArrowRight,
  ArrowLeft
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'

interface FormField {
  id: string
  type: string
  label: string
  required: boolean
  options?: string[]
}

interface FormSection {
  id: string
  title: string
  fields: FormField[]
}

interface IntakeFormData {
  id: string
  name: string
  description: string | null
  sections: FormSection[]
  clinic: {
    name: string
    city: string
    country: string
  }
}

export default function IntakePage({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = use(params)
  const [form, setForm] = useState<IntakeFormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentSection, setCurrentSection] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [consentDuration, setConsentDuration] = useState(10080) // 7 days default

  useEffect(() => {
    fetchForm()
  }, [resolvedParams.token])

  async function fetchForm() {
    try {
      const res = await fetch(`/api/intake/${resolvedParams.token}`)
      if (!res.ok) {
        setError('Form not found or expired')
        setLoading(false)
        return
      }
      const data = await res.json()
      setForm(data)
    } catch {
      setError('Failed to load form')
    }
    setLoading(false)
  }

  async function handleSubmit() {
    if (!form) return
    setSubmitting(true)

    try {
      const res = await fetch(`/api/intake/${resolvedParams.token}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          consentDuration,
        }),
      })

      if (res.ok) {
        setSubmitted(true)
      } else {
        const data = await res.json()
        setError(data.error || 'Submission failed')
      }
    } catch {
      setError('Submission failed')
    }
    setSubmitting(false)
  }

  function updateAnswer(fieldId: string, value: any) {
    setAnswers(prev => ({ ...prev, [fieldId]: value }))
  }

  function validateSection(sectionIndex: number): boolean {
    if (!form) return false
    const section = form.sections[sectionIndex]
    for (const field of section.fields) {
      if (field.required && !answers[field.id]) {
        return false
      }
    }
    return true
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-clinical-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-atlas-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error && !form) {
    return (
      <div className="min-h-screen bg-clinical-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-alert-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-clinical-900 mb-2">Form Not Available</h1>
          <p className="text-clinical-500 mb-6">{error}</p>
          <Link href="/" className="btn-primary">
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-clinical-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-medical-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-medical-600" />
          </div>
          <h1 className="text-2xl font-bold text-clinical-900 mb-2">Intake Submitted!</h1>
          <p className="text-clinical-500 mb-6">
            Your intake form has been submitted to {form?.clinic.name}. 
            They will review your information before your visit.
          </p>
          <div className="bg-clinical-100 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-clinical-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Consent valid for {consentDuration / 1440} days</span>
            </div>
          </div>
          <Link href="/login" className="btn-primary">
            Go to Atlas Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (!form) return null

  const currentSectionData = form.sections[currentSection]
  const isLastSection = currentSection === form.sections.length - 1
  const progress = ((currentSection + 1) / form.sections.length) * 100

  return (
    <div className="min-h-screen bg-clinical-50">
      {/* Header */}
      <header className="bg-white border-b border-clinical-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-atlas-500 to-medical-500 flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-display font-bold text-clinical-900">ATLAS</span>
                <span className="block text-xs text-clinical-500">Medical Tourism Intake</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-clinical-500 text-sm">
              <Shield className="w-4 h-4" />
              <span>Secure Form</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Clinic Info */}
        <div className="atlas-card p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-clinical-100 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-clinical-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-clinical-900">{form.name}</h1>
              <p className="text-clinical-500">{form.clinic.name} • {form.clinic.city}, {form.clinic.country}</p>
            </div>
          </div>
          {form.description && (
            <p className="mt-4 text-clinical-600">{form.description}</p>
          )}
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-clinical-500 mb-2">
            <span>Section {currentSection + 1} of {form.sections.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Form Section */}
        <div className="atlas-card p-6 mb-6">
          <h2 className="text-lg font-semibold text-clinical-900 mb-6 pb-4 border-b border-clinical-200">
            {currentSectionData.title}
          </h2>

          <div className="space-y-6">
            {currentSectionData.fields.map((field) => (
              <FormFieldInput
                key={field.id}
                field={field}
                value={answers[field.id]}
                onChange={(value) => updateAnswer(field.id, value)}
              />
            ))}
          </div>
        </div>

        {/* Consent Duration (on last section) */}
        {isLastSection && (
          <div className="atlas-card p-6 mb-6">
            <h3 className="font-semibold text-clinical-900 mb-4">Consent Duration</h3>
            <p className="text-sm text-clinical-500 mb-4">
              How long should the clinic have access to your submitted information?
            </p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 1440, label: '24 hours' },
                { value: 10080, label: '7 days' },
                { value: 43200, label: '30 days' },
                { value: 129600, label: '90 days' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setConsentDuration(option.value)}
                  className={cn(
                    'py-3 px-4 rounded-lg border-2 text-sm font-medium transition-colors',
                    consentDuration === option.value
                      ? 'border-atlas-500 bg-atlas-50 text-atlas-700'
                      : 'border-clinical-200 text-clinical-600 hover:border-clinical-300'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentSection(prev => prev - 1)}
            disabled={currentSection === 0}
            className="btn-secondary"
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>

          {isLastSection ? (
            <button
              onClick={handleSubmit}
              disabled={!validateSection(currentSection) || submitting}
              className="btn-primary"
            >
              {submitting ? 'Submitting...' : 'Submit Intake'}
              <CheckCircle2 className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setCurrentSection(prev => prev + 1)}
              disabled={!validateSection(currentSection)}
              className="btn-primary"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-alert-50 border border-alert-200 rounded-lg text-alert-700">
            {error}
          </div>
        )}
      </main>
    </div>
  )
}

function FormFieldInput({
  field,
  value,
  onChange,
}: {
  field: FormField
  value: any
  onChange: (value: any) => void
}) {
  return (
    <div>
      <label className="label">
        {field.label}
        {field.required && <span className="text-alert-500 ml-1">*</span>}
      </label>

      {field.type === 'short_text' && (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="input"
        />
      )}

      {field.type === 'long_text' && (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="input min-h-[120px]"
        />
      )}

      {field.type === 'multiple_choice' && field.options && (
        <div className="space-y-2">
          {field.options.map((option) => (
            <label
              key={option}
              className={cn(
                'flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors',
                value === option
                  ? 'border-atlas-500 bg-atlas-50'
                  : 'border-clinical-200 hover:border-clinical-300'
              )}
            >
              <input
                type="radio"
                name={field.id}
                value={option}
                checked={value === option}
                onChange={() => onChange(option)}
                className="sr-only"
              />
              <span className="text-clinical-900">{option}</span>
            </label>
          ))}
        </div>
      )}

      {field.type === 'checkbox' && (
        <label className="flex items-center gap-3 p-4 rounded-lg border border-clinical-200 cursor-pointer">
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            className="w-5 h-5 rounded border-clinical-300 text-atlas-600 focus:ring-atlas-500"
          />
          <span className="text-clinical-700">Yes</span>
        </label>
      )}

      {field.type === 'date' && (
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="input"
        />
      )}

      {field.type === 'number' && (
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="input"
        />
      )}

      {field.type === 'file_upload' && (
        <div className="border-2 border-dashed border-clinical-300 rounded-lg p-8 text-center">
          <Upload className="w-8 h-8 text-clinical-400 mx-auto mb-2" />
          <p className="text-clinical-500 text-sm">File upload available in full version</p>
        </div>
      )}

      {field.type === 'consent' && (
        <label className="flex items-start gap-3 p-4 rounded-lg border border-clinical-200 cursor-pointer">
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            className="w-5 h-5 rounded border-clinical-300 text-atlas-600 focus:ring-atlas-500 mt-0.5"
          />
          <span className="text-clinical-700 text-sm">{field.label}</span>
        </label>
      )}
    </div>
  )
}
