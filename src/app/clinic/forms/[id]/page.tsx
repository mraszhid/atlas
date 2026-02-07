'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  GripVertical,
  Plus,
  Trash2,
  Save,
  Eye,
  Send,
  Settings,
  Type,
  Mail,
  Phone,
  Calendar,
  ChevronDown,
  AlignLeft,
  Upload,
  CheckSquare,
  List,
  FileText,
  X,
  Asterisk,
  Check,
} from 'lucide-react'

const fieldTypeOptions = [
  { value: 'text', label: 'Text', icon: Type },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'phone', label: 'Phone', icon: Phone },
  { value: 'date', label: 'Date', icon: Calendar },
  { value: 'dropdown', label: 'Dropdown', icon: ChevronDown },
  { value: 'textarea', label: 'Textarea', icon: AlignLeft },
  { value: 'file', label: 'File Upload', icon: Upload },
  { value: 'checkbox', label: 'Checkbox', icon: CheckSquare },
  { value: 'multiple_choice', label: 'Multiple Choice', icon: List },
]

interface FormField {
  id: string
  type: string
  label: string
  required: boolean
}

interface FormSection {
  id: string
  title: string
  fields: FormField[]
  collapsed: boolean
}

const initialSections: FormSection[] = [
  {
    id: 'section_1',
    title: 'Patient Demographics',
    collapsed: false,
    fields: [
      { id: 'f1', type: 'text', label: 'First Name', required: true },
      { id: 'f2', type: 'text', label: 'Last Name', required: true },
      { id: 'f3', type: 'email', label: 'Email Address', required: true },
      { id: 'f4', type: 'phone', label: 'Phone Number', required: true },
      { id: 'f5', type: 'date', label: 'Date of Birth', required: true },
      { id: 'f6', type: 'dropdown', label: 'Nationality', required: true },
    ],
  },
  {
    id: 'section_2',
    title: 'Medical History',
    collapsed: false,
    fields: [
      { id: 'f7', type: 'textarea', label: 'Known Allergies', required: true },
      { id: 'f8', type: 'textarea', label: 'Current Medications', required: true },
      { id: 'f9', type: 'textarea', label: 'Existing Medical Conditions', required: false },
      { id: 'f10', type: 'textarea', label: 'Previous Surgeries', required: false },
      { id: 'f11', type: 'dropdown', label: 'Smoking Status', required: true },
      { id: 'f12', type: 'file', label: 'Lab Results Upload', required: false },
    ],
  },
  {
    id: 'section_3',
    title: 'Consent & Preferences',
    collapsed: false,
    fields: [
      { id: 'f13', type: 'checkbox', label: 'I consent to the collection and processing of my medical data', required: true },
      { id: 'f14', type: 'checkbox', label: 'I consent to sharing my data with the assigned surgeon', required: true },
      { id: 'f15', type: 'checkbox', label: 'I acknowledge the risks and benefits have been explained to me', required: true },
      { id: 'f16', type: 'dropdown', label: 'Preferred Contact Method', required: false },
    ],
  },
]

const formOptions = [
  { id: 'require_atlas', label: 'Require ATLAS account', checked: true },
  { id: 'allow_anon', label: 'Allow anonymous submission', checked: false },
  { id: 'email_confirm', label: 'Email confirmation to patient', checked: true },
  { id: 'progress_bar', label: 'Show progress bar', checked: true },
  { id: 'import_atlas', label: 'Import from ATLAS profile', checked: true },
]

export default function FormBuilderPage() {
  const [formName, setFormName] = useState('Cosmetic Surgery Pre-Op Assessment')
  const [procedureType, setProcedureType] = useState('Cosmetic Surgery')
  const [sections, setSections] = useState<FormSection[]>(initialSections)
  const [showFieldPicker, setShowFieldPicker] = useState<string | null>(null)
  const [options, setOptions] = useState(formOptions)
  const [showPreview, setShowPreview] = useState(false)
  const [saved, setSaved] = useState(false)

  function addSection() {
    const newSection: FormSection = {
      id: `section_${Date.now()}`,
      title: 'New Section',
      collapsed: false,
      fields: [],
    }
    setSections([...sections, newSection])
  }

  function removeSection(sectionId: string) {
    setSections(sections.filter((s) => s.id !== sectionId))
  }

  function toggleSection(sectionId: string) {
    setSections(
      sections.map((s) =>
        s.id === sectionId ? { ...s, collapsed: !s.collapsed } : s
      )
    )
  }

  function updateSectionTitle(sectionId: string, title: string) {
    setSections(
      sections.map((s) =>
        s.id === sectionId ? { ...s, title } : s
      )
    )
  }

  function addField(sectionId: string, type: string) {
    const typeOption = fieldTypeOptions.find((f) => f.value === type)
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: `New ${typeOption?.label || 'Field'}`,
      required: false,
    }
    setSections(
      sections.map((s) =>
        s.id === sectionId ? { ...s, fields: [...s.fields, newField] } : s
      )
    )
    setShowFieldPicker(null)
  }

  function removeField(sectionId: string, fieldId: string) {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? { ...s, fields: s.fields.filter((f) => f.id !== fieldId) }
          : s
      )
    )
  }

  function updateField(sectionId: string, fieldId: string, updates: Partial<FormField>) {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              fields: s.fields.map((f) =>
                f.id === fieldId ? { ...f, ...updates } : f
              ),
            }
          : s
      )
    )
  }

  function toggleOption(id: string) {
    setOptions(options.map((o) => (o.id === id ? { ...o, checked: !o.checked } : o)))
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function getFieldIcon(type: string) {
    const option = fieldTypeOptions.find((f) => f.value === type)
    if (option) {
      const Icon = option.icon
      return <Icon className="w-4 h-4 text-slate-400" />
    }
    return <Type className="w-4 h-4 text-slate-400" />
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/clinic/forms"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Forms
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-900">Form Builder</h1>
          <div className="flex gap-2">
            <button onClick={handleSave} className="btn-secondary">
              <Save className="w-4 h-4" />
              {saved ? 'Saved!' : 'Save as Draft'}
            </button>
            <button onClick={() => setShowPreview(!showPreview)} className="btn-secondary">
              <Eye className="w-4 h-4" />
              {showPreview ? 'Edit' : 'Preview'}
            </button>
            <button className="btn-primary">
              <Send className="w-4 h-4" />
              Publish
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Builder */}
        <div className="lg:col-span-2 space-y-6">
          {/* Form Name & Type */}
          <div className="card-premium p-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Form Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="input"
                  placeholder="e.g., Cosmetic Surgery Pre-Op"
                />
              </div>
              <div>
                <label className="label">Procedure Type</label>
                <select
                  value={procedureType}
                  onChange={(e) => setProcedureType(e.target.value)}
                  className="input"
                >
                  <option value="Cosmetic Surgery">Cosmetic Surgery</option>
                  <option value="Orthopedic Surgery">Orthopedic Surgery</option>
                  <option value="Dental Surgery">Dental Surgery</option>
                  <option value="Fertility Treatment">Fertility Treatment</option>
                  <option value="Cardiac Surgery">Cardiac Surgery</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sections */}
          {sections.map((section, sectionIndex) => (
            <div key={section.id} className="card-premium overflow-hidden">
              {/* Section Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-3">
                <GripVertical className="w-5 h-5 text-slate-400 cursor-grab flex-shrink-0" />
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">
                    Section {sectionIndex + 1}
                  </span>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                    className="flex-1 bg-transparent border-0 font-semibold text-slate-900 focus:outline-none focus:ring-0 p-0"
                  />
                </div>
                <button
                  onClick={() => toggleSection(section.id)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      section.collapsed ? '-rotate-90' : ''
                    }`}
                  />
                </button>
                <button
                  onClick={() => removeSection(section.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Section Fields */}
              {!section.collapsed && (
                <div className="p-4 space-y-3">
                  {section.fields.map((field) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl group"
                    >
                      <GripVertical className="w-4 h-4 text-slate-300 cursor-grab flex-shrink-0" />
                      <div className="flex-shrink-0">{getFieldIcon(field.type)}</div>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) =>
                          updateField(section.id, field.id, { label: e.target.value })
                        }
                        className="flex-1 bg-transparent border-0 text-sm text-slate-900 focus:outline-none focus:ring-0 p-0"
                      />
                      <span className="text-xs text-slate-400 capitalize bg-white px-2 py-1 rounded-lg border border-slate-200">
                        {field.type.replace('_', ' ')}
                      </span>
                      <button
                        onClick={() =>
                          updateField(section.id, field.id, { required: !field.required })
                        }
                        className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                          field.required
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {field.required ? 'Required' : 'Optional'}
                      </button>
                      <button
                        onClick={() => removeField(section.id, field.id)}
                        className="p-1 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {/* Add Field Button */}
                  {showFieldPicker === section.id ? (
                    <div className="p-4 border-2 border-dashed border-violet-300 rounded-xl bg-violet-50">
                      <p className="text-sm font-medium text-slate-900 mb-3">Select Field Type</p>
                      <div className="grid grid-cols-3 gap-2">
                        {fieldTypeOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => addField(section.id, opt.value)}
                            className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-white hover:border-violet-400 hover:bg-violet-50 transition-colors text-sm"
                          >
                            <opt.icon className="w-4 h-4 text-violet-500" />
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setShowFieldPicker(null)}
                        className="mt-2 text-sm text-slate-500 hover:text-slate-700"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowFieldPicker(section.id)}
                      className="w-full py-2.5 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-violet-400 hover:text-violet-600 transition-colors text-sm font-medium"
                    >
                      <Plus className="w-4 h-4 inline mr-1" />
                      Add Field
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Add Section */}
          <button
            onClick={addSection}
            className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 hover:border-violet-400 hover:text-violet-600 transition-colors font-medium"
          >
            <Plus className="w-5 h-5 inline mr-2" />
            Add New Section
          </button>
        </div>

        {/* Sidebar Options */}
        <div className="space-y-6">
          {/* Form Summary */}
          <div className="card-premium p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-violet-500" />
              Form Summary
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Sections</span>
                <span className="font-semibold text-slate-900">{sections.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Total Fields</span>
                <span className="font-semibold text-slate-900">
                  {sections.reduce((acc, s) => acc + s.fields.length, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Required Fields</span>
                <span className="font-semibold text-slate-900">
                  {sections.reduce(
                    (acc, s) => acc + s.fields.filter((f) => f.required).length,
                    0
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Est. Completion</span>
                <span className="font-semibold text-slate-900">
                  ~{Math.ceil(sections.reduce((acc, s) => acc + s.fields.length, 0) * 0.5)} min
                </span>
              </div>
            </div>
          </div>

          {/* Form Options */}
          <div className="card-premium p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-slate-500" />
              Form Options
            </h3>
            <div className="space-y-3">
              {options.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={option.checked}
                    onChange={() => toggleOption(option.id)}
                    className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                  />
                  <span className="text-sm text-slate-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button onClick={handleSave} className="btn-secondary w-full">
              <Save className="w-4 h-4" />
              {saved ? 'Saved!' : 'Save as Draft'}
            </button>
            <button onClick={() => setShowPreview(!showPreview)} className="btn-secondary w-full">
              <Eye className="w-4 h-4" />
              Preview Form
            </button>
            <button className="btn-primary w-full">
              <Send className="w-4 h-4" />
              Publish Form
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
