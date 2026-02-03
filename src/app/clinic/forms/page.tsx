'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  FileEdit,
  Trash2,
  Copy,
  ExternalLink,
  GripVertical,
  Save,
  Eye,
  Settings,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'

interface FormField {
  id: string
  type: string
  label: string
  required: boolean
  options?: string[]
  placeholder?: string
}

interface FormSection {
  id: string
  title: string
  fields: FormField[]
}

interface IntakeForm {
  id: string
  name: string
  description: string | null
  template: string | null
  sections: FormSection[]
  isPublished: boolean
  shareToken: string | null
  createdAt: string
}

const fieldTypes = [
  { value: 'short_text', label: 'Short Text' },
  { value: 'long_text', label: 'Long Text' },
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'date', label: 'Date' },
  { value: 'number', label: 'Number' },
  { value: 'file_upload', label: 'File Upload Request' },
  { value: 'consent', label: 'Consent Checkbox' },
]

export default function ClinicFormsPage() {
  const [forms, setForms] = useState<IntakeForm[]>([])
  const [selectedForm, setSelectedForm] = useState<IntakeForm | null>(null)
  const [loading, setLoading] = useState(true)
  const [showNewFormModal, setShowNewFormModal] = useState(false)
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    fetchForms()
  }, [])

  async function fetchForms() {
    const res = await fetch('/api/clinic/forms')
    const data = await res.json()
    setForms(data)
    setLoading(false)
  }

  async function createForm(name: string, description: string, template?: string) {
    const res = await fetch('/api/clinic/forms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, template }),
    })
    const newForm = await res.json()
    setForms([newForm, ...forms])
    setSelectedForm(newForm)
    setShowNewFormModal(false)
    setEditMode(true)
  }

  async function saveForm(form: IntakeForm) {
    await fetch(`/api/clinic/forms/${form.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setForms(forms.map(f => f.id === form.id ? form : f))
    setEditMode(false)
  }

  async function publishForm(formId: string) {
    const res = await fetch(`/api/clinic/forms/${formId}/publish`, {
      method: 'POST',
    })
    const updated = await res.json()
    setForms(forms.map(f => f.id === formId ? { ...f, isPublished: true, shareToken: updated.shareToken } : f))
    if (selectedForm?.id === formId) {
      setSelectedForm({ ...selectedForm, isPublished: true, shareToken: updated.shareToken })
    }
  }

  async function deleteForm(formId: string) {
    if (!confirm('Are you sure you want to delete this form?')) return
    await fetch(`/api/clinic/forms/${formId}`, { method: 'DELETE' })
    setForms(forms.filter(f => f.id !== formId))
    if (selectedForm?.id === formId) setSelectedForm(null)
  }

  function addSection() {
    if (!selectedForm) return
    const newSection: FormSection = {
      id: `section_${Date.now()}`,
      title: 'New Section',
      fields: [],
    }
    setSelectedForm({
      ...selectedForm,
      sections: [...selectedForm.sections, newSection],
    })
  }

  function addField(sectionId: string) {
    if (!selectedForm) return
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type: 'short_text',
      label: 'New Field',
      required: false,
    }
    setSelectedForm({
      ...selectedForm,
      sections: selectedForm.sections.map(s =>
        s.id === sectionId ? { ...s, fields: [...s.fields, newField] } : s
      ),
    })
  }

  function updateSection(sectionId: string, updates: Partial<FormSection>) {
    if (!selectedForm) return
    setSelectedForm({
      ...selectedForm,
      sections: selectedForm.sections.map(s =>
        s.id === sectionId ? { ...s, ...updates } : s
      ),
    })
  }

  function updateField(sectionId: string, fieldId: string, updates: Partial<FormField>) {
    if (!selectedForm) return
    setSelectedForm({
      ...selectedForm,
      sections: selectedForm.sections.map(s =>
        s.id === sectionId
          ? {
              ...s,
              fields: s.fields.map(f =>
                f.id === fieldId ? { ...f, ...updates } : f
              ),
            }
          : s
      ),
    })
  }

  function removeField(sectionId: string, fieldId: string) {
    if (!selectedForm) return
    setSelectedForm({
      ...selectedForm,
      sections: selectedForm.sections.map(s =>
        s.id === sectionId
          ? { ...s, fields: s.fields.filter(f => f.id !== fieldId) }
          : s
      ),
    })
  }

  function removeSection(sectionId: string) {
    if (!selectedForm) return
    setSelectedForm({
      ...selectedForm,
      sections: selectedForm.sections.filter(s => s.id !== sectionId),
    })
  }

  return (
    <div className="p-8 bg-clinical-50 min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-clinical-900 mb-2">
            Intake Form Builder
          </h1>
          <p className="text-clinical-500">
            Create and manage patient intake forms for medical tourism
          </p>
        </div>
        <button onClick={() => setShowNewFormModal(true)} className="btn-primary">
          <Plus className="w-5 h-5" />
          New Form
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form List */}
        <div className="atlas-card overflow-hidden">
          <div className="p-4 border-b border-clinical-200">
            <h2 className="font-semibold text-clinical-900">Your Forms</h2>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-clinical-500">Loading...</div>
            ) : forms.length === 0 ? (
              <div className="p-8 text-center text-clinical-500">
                <FileEdit className="w-12 h-12 mx-auto mb-4 text-clinical-300" />
                <p>No forms created yet</p>
                <button 
                  onClick={() => setShowNewFormModal(true)}
                  className="text-atlas-600 hover:text-atlas-700 font-medium mt-2"
                >
                  Create your first form
                </button>
              </div>
            ) : (
              forms.map((form) => (
                <button
                  key={form.id}
                  onClick={() => { setSelectedForm(form); setEditMode(false); }}
                  className={cn(
                    'w-full p-4 text-left border-b border-clinical-100 hover:bg-clinical-50 transition-colors',
                    selectedForm?.id === form.id && 'bg-atlas-50 border-l-4 border-l-atlas-500'
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-clinical-900">{form.name}</p>
                    <span className={`badge ${form.isPublished ? 'badge-verified' : 'badge-unverified'}`}>
                      {form.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-sm text-clinical-500 truncate">{form.description || 'No description'}</p>
                  <p className="text-xs text-clinical-400 mt-1">{formatDate(form.createdAt)}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Form Editor */}
        <div className="lg:col-span-2">
          {selectedForm ? (
            <div className="space-y-6">
              {/* Form Header */}
              <div className="atlas-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {editMode ? (
                      <input
                        type="text"
                        value={selectedForm.name}
                        onChange={(e) => setSelectedForm({ ...selectedForm, name: e.target.value })}
                        className="input text-xl font-semibold"
                      />
                    ) : (
                      <h2 className="text-xl font-semibold text-clinical-900">{selectedForm.name}</h2>
                    )}
                    {editMode ? (
                      <textarea
                        value={selectedForm.description || ''}
                        onChange={(e) => setSelectedForm({ ...selectedForm, description: e.target.value })}
                        className="input mt-2"
                        placeholder="Form description..."
                      />
                    ) : (
                      <p className="text-clinical-500 mt-1">{selectedForm.description || 'No description'}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {editMode ? (
                      <>
                        <button onClick={() => setEditMode(false)} className="btn-secondary btn-sm">
                          Cancel
                        </button>
                        <button onClick={() => saveForm(selectedForm)} className="btn-primary btn-sm">
                          <Save className="w-4 h-4" />
                          Save
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setEditMode(true)} className="btn-secondary btn-sm">
                          <Settings className="w-4 h-4" />
                          Edit
                        </button>
                        {!selectedForm.isPublished && (
                          <button onClick={() => publishForm(selectedForm.id)} className="btn-primary btn-sm">
                            Publish
                          </button>
                        )}
                        <button onClick={() => deleteForm(selectedForm.id)} className="btn-ghost btn-sm text-alert-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Share Link */}
                {selectedForm.isPublished && selectedForm.shareToken && (
                  <div className="bg-medical-50 rounded-lg p-4 border border-medical-200">
                    <p className="text-sm font-medium text-medical-800 mb-2">Share Link</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-white px-3 py-2 rounded border text-sm font-mono text-clinical-700">
                        {typeof window !== 'undefined' ? window.location.origin : ''}/intake/{selectedForm.shareToken}
                      </code>
                      <button 
                        onClick={() => navigator.clipboard.writeText(`${window.location.origin}/intake/${selectedForm.shareToken}`)}
                        className="btn-secondary btn-sm"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <a
                        href={`/intake/${selectedForm.shareToken}`}
                        target="_blank"
                        className="btn-secondary btn-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Sections */}
              {editMode ? (
                <div className="space-y-4">
                  {selectedForm.sections.map((section, sectionIndex) => (
                    <div key={section.id} className="atlas-card overflow-hidden">
                      <div className="p-4 bg-clinical-50 border-b border-clinical-200 flex items-center gap-3">
                        <GripVertical className="w-5 h-5 text-clinical-400 cursor-grab" />
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => updateSection(section.id, { title: e.target.value })}
                          className="input flex-1"
                          placeholder="Section title"
                        />
                        <button
                          onClick={() => removeSection(section.id)}
                          className="p-2 text-clinical-400 hover:text-alert-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-4 space-y-3">
                        {section.fields.map((field) => (
                          <div key={field.id} className="flex items-start gap-3 p-3 bg-clinical-50 rounded-lg">
                            <GripVertical className="w-5 h-5 text-clinical-400 cursor-grab mt-2" />
                            <div className="flex-1 grid grid-cols-3 gap-3">
                              <input
                                type="text"
                                value={field.label}
                                onChange={(e) => updateField(section.id, field.id, { label: e.target.value })}
                                className="input col-span-2"
                                placeholder="Field label"
                              />
                              <select
                                value={field.type}
                                onChange={(e) => updateField(section.id, field.id, { type: e.target.value })}
                                className="input"
                              >
                                {fieldTypes.map((ft) => (
                                  <option key={ft.value} value={ft.value}>{ft.label}</option>
                                ))}
                              </select>
                            </div>
                            <label className="flex items-center gap-2 text-sm text-clinical-600 mt-2">
                              <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) => updateField(section.id, field.id, { required: e.target.checked })}
                                className="rounded"
                              />
                              Required
                            </label>
                            <button
                              onClick={() => removeField(section.id, field.id)}
                              className="p-2 text-clinical-400 hover:text-alert-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addField(section.id)}
                          className="w-full py-2 border-2 border-dashed border-clinical-300 rounded-lg text-clinical-500 hover:border-atlas-500 hover:text-atlas-600 transition-colors"
                        >
                          <Plus className="w-4 h-4 inline mr-2" />
                          Add Field
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addSection}
                    className="w-full py-4 border-2 border-dashed border-clinical-300 rounded-xl text-clinical-500 hover:border-atlas-500 hover:text-atlas-600 transition-colors"
                  >
                    <Plus className="w-5 h-5 inline mr-2" />
                    Add Section
                  </button>
                </div>
              ) : (
                <div className="atlas-card p-6">
                  <h3 className="font-semibold text-clinical-900 mb-4">Form Preview</h3>
                  {selectedForm.sections.map((section) => (
                    <div key={section.id} className="mb-6 last:mb-0">
                      <h4 className="font-medium text-clinical-800 mb-3 pb-2 border-b border-clinical-200">
                        {section.title}
                      </h4>
                      <div className="space-y-4">
                        {section.fields.map((field) => (
                          <div key={field.id}>
                            <label className="label">
                              {field.label}
                              {field.required && <span className="text-alert-500 ml-1">*</span>}
                            </label>
                            <div className="text-xs text-clinical-400 capitalize">
                              {field.type.replace('_', ' ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="atlas-card p-12 text-center">
              <FileEdit className="w-16 h-16 text-clinical-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-clinical-700 mb-2">Select a Form</h3>
              <p className="text-clinical-500">
                Choose a form from the list or create a new one
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New Form Modal */}
      {showNewFormModal && (
        <NewFormModal
          onClose={() => setShowNewFormModal(false)}
          onCreate={createForm}
        />
      )}
    </div>
  )
}

function NewFormModal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (name: string, description: string, template?: string) => void
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [template, setTemplate] = useState('')

  const templates = [
    { id: '', name: 'Blank Form', description: 'Start from scratch' },
    { id: 'cosmetic', name: 'Cosmetic Surgery', description: 'Pre-visit intake for cosmetic procedures' },
    { id: 'orthopedic', name: 'Orthopedic Surgery', description: 'Pre-visit intake for orthopedic procedures' },
    { id: 'fertility', name: 'Fertility Treatment', description: 'Pre-visit intake for fertility treatments' },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-6 border-b border-clinical-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-clinical-900">Create New Form</h3>
          <button onClick={onClose} className="p-2 text-clinical-400 hover:text-clinical-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="label">Form Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="e.g., Cosmetic Surgery Pre-Visit"
            />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input"
              placeholder="Brief description of this form..."
            />
          </div>
          <div>
            <label className="label">Template</label>
            <div className="grid grid-cols-2 gap-2">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={cn(
                    'p-3 rounded-lg border-2 text-left transition-colors',
                    template === t.id
                      ? 'border-atlas-500 bg-atlas-50'
                      : 'border-clinical-200 hover:border-clinical-300'
                  )}
                >
                  <p className="font-medium text-clinical-900 text-sm">{t.name}</p>
                  <p className="text-xs text-clinical-500">{t.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-clinical-200 flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button
            onClick={() => onCreate(name, description, template || undefined)}
            disabled={!name}
            className="btn-primary flex-1"
          >
            Create Form
          </button>
        </div>
      </div>
    </div>
  )
}
