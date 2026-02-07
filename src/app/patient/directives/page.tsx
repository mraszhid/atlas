'use client'

import { useState, useEffect } from 'react'
import {
  Heart,
  Shield,
  Save,
  AlertTriangle,
  CheckCircle2,
  User,
  Phone,
  Mail,
  Upload,
  Plus,
  Pencil,
  Trash2,
  X
} from 'lucide-react'

interface DirectivesData {
  organDonor: boolean
  advanceDirective: string | null
  decisionMakerName: string | null
  decisionMakerRelationship: string | null
  decisionMakerPhone: string | null
  decisionMakerEmail: string | null
}

interface EmergencyContact {
  id: string
  name: string
  relationship: string
  phone: string
}

const MOCK_DIRECTIVES: DirectivesData = {
  organDonor: true,
  advanceDirective: null,
  decisionMakerName: null,
  decisionMakerRelationship: null,
  decisionMakerPhone: null,
  decisionMakerEmail: null,
}

const MOCK_CONTACTS: EmergencyContact[] = [
  { id: '1', name: 'Fatima Al-Rashid', relationship: 'Sister', phone: '+971 50 123 4567' },
  { id: '2', name: 'Dr. Hassan Al-Rashid', relationship: 'Brother', phone: '+971 55 987 6543' },
]

export default function DirectivesPage() {
  const [data, setData] = useState<DirectivesData | null>(null)
  const [contacts, setContacts] = useState<EmergencyContact[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showAddContact, setShowAddContact] = useState(false)
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const res = await fetch('/api/patient/profile')
      if (res.ok) {
        const profile = await res.json()
        if (profile && !profile.error) {
          setData({
            organDonor: profile.organDonor,
            advanceDirective: profile.advanceDirective,
            decisionMakerName: profile.decisionMakerName,
            decisionMakerRelationship: profile.decisionMakerRelationship || null,
            decisionMakerPhone: profile.decisionMakerPhone,
            decisionMakerEmail: profile.decisionMakerEmail || null,
          })
          if (profile.emergencyContacts) {
            setContacts(profile.emergencyContacts)
          } else {
            setContacts(MOCK_CONTACTS)
          }
          setLoading(false)
          return
        }
      }
    } catch {}
    setData(MOCK_DIRECTIVES)
    setContacts(MOCK_CONTACTS)
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
    }).catch(() => {})
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  function addContact(contact: Omit<EmergencyContact, 'id'>) {
    const newContact = { ...contact, id: Date.now().toString() }
    setContacts(prev => [...prev, newContact])
    setShowAddContact(false)
    fetch('/api/patient/emergency-contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    }).catch(() => {})
  }

  function removeContact(id: string) {
    setContacts(prev => prev.filter(c => c.id !== id))
    fetch(`/api/patient/emergency-contacts/${id}`, { method: 'DELETE' }).catch(() => {})
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

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          Advance Directives
        </h1>
        <p className="text-slate-500">
          Record your healthcare wishes, emergency contacts, and designate a decision-maker
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Info Banner */}
        <div className="card-premium p-4 bg-rose-50 border-rose-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-rose-800">Emergency Visibility</p>
              <p className="text-sm text-rose-700 mt-1">
                This information appears in emergency access. Your advance directive, organ donor status, and emergency contacts are visible to first responders.
              </p>
            </div>
          </div>
        </div>

        {/* Organ Donor */}
        <div className="card-premium p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            Organ Donor Status
          </h2>
          <div className="flex gap-4">
            <label className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
              data?.organDonor ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'
            }`}>
              <input
                type="radio"
                name="organDonor"
                checked={data?.organDonor === true}
                onChange={() => setData(d => d ? { ...d, organDonor: true } : null)}
                className="sr-only"
              />
              <CheckCircle2 className={`w-6 h-6 ${data?.organDonor ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span className="font-medium text-slate-900">Yes, I am an organ donor</span>
            </label>
            <label className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
              data?.organDonor === false ? 'border-slate-500 bg-slate-50' : 'border-slate-200'
            }`}>
              <input
                type="radio"
                name="organDonor"
                checked={data?.organDonor === false}
                onChange={() => setData(d => d ? { ...d, organDonor: false } : null)}
                className="sr-only"
              />
              <span className="font-medium text-slate-900">No</span>
            </label>
          </div>
        </div>

        {/* Living Will */}
        <div className="card-premium p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-violet-500" />
            Living Will / Advance Directive
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Upload a PDF of your living will or describe your healthcare preferences below. This will be shown to healthcare providers during emergency access.
          </p>
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-violet-400 hover:bg-violet-50/50 transition-all cursor-pointer mb-4">
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600">Upload Living Will PDF</p>
            <p className="text-xs text-slate-400 mt-1">(File upload mocked for demo)</p>
          </div>
          <textarea
            value={data?.advanceDirective || ''}
            onChange={(e) => setData(d => d ? { ...d, advanceDirective: e.target.value } : null)}
            className="input min-h-[120px]"
            placeholder="Example: No resuscitation if brain death is confirmed. Do not use artificial life support if there is no reasonable expectation of recovery."
            aria-label="Advance directive text"
          />
        </div>

        {/* Healthcare Decision-Maker (POA) */}
        <div className="card-premium p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" />
            Healthcare Decision-Maker (POA)
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Designate someone to make healthcare decisions on your behalf if you are unable to.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="poa-name">Full Name</label>
              <input
                id="poa-name"
                type="text"
                value={data?.decisionMakerName || ''}
                onChange={(e) => setData(d => d ? { ...d, decisionMakerName: e.target.value } : null)}
                className="input"
                placeholder="e.g., Jane Doe"
              />
            </div>
            <div>
              <label className="label" htmlFor="poa-rel">Relationship</label>
              <input
                id="poa-rel"
                type="text"
                value={data?.decisionMakerRelationship || ''}
                onChange={(e) => setData(d => d ? { ...d, decisionMakerRelationship: e.target.value } : null)}
                className="input"
                placeholder="e.g., Spouse, Parent"
              />
            </div>
            <div>
              <label className="label" htmlFor="poa-phone">Phone Number</label>
              <input
                id="poa-phone"
                type="tel"
                value={data?.decisionMakerPhone || ''}
                onChange={(e) => setData(d => d ? { ...d, decisionMakerPhone: e.target.value } : null)}
                className="input"
                placeholder="+1 555 123 4567"
              />
            </div>
            <div>
              <label className="label" htmlFor="poa-email">Email</label>
              <input
                id="poa-email"
                type="email"
                value={data?.decisionMakerEmail || ''}
                onChange={(e) => setData(d => d ? { ...d, decisionMakerEmail: e.target.value } : null)}
                className="input"
                placeholder="jane@example.com"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="card-premium p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Phone className="w-5 h-5 text-emerald-500" />
              Emergency Contacts
            </h2>
            <button onClick={() => setShowAddContact(true)} className="btn-primary btn-sm">
              <Plus className="w-4 h-4" />
              Add Contact
            </button>
          </div>

          {contacts.length === 0 ? (
            <div className="text-center py-8">
              <Phone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No emergency contacts added</p>
              <button onClick={() => setShowAddContact(true)} className="text-sm text-violet-600 hover:text-violet-700 mt-2">
                Add your first contact
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900">{contact.name}</p>
                      <p className="text-sm text-slate-500">{contact.relationship}</p>
                      <a href={`tel:${contact.phone}`} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => setEditingContact(contact)}
                      className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                      aria-label="Edit contact"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeContact(contact.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      aria-label="Remove contact"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
            <span className="text-emerald-600 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Saved successfully
            </span>
          )}
        </div>
      </div>

      {/* Add Contact Modal */}
      {(showAddContact || editingContact) && (
        <ContactModal
          contact={editingContact}
          onClose={() => { setShowAddContact(false); setEditingContact(null) }}
          onSave={(contact) => {
            if (editingContact) {
              setContacts(prev => prev.map(c => c.id === editingContact.id ? { ...c, ...contact } : c))
              setEditingContact(null)
            } else {
              addContact(contact)
            }
          }}
        />
      )}
    </div>
  )
}

function ContactModal({
  contact,
  onClose,
  onSave,
}: {
  contact: EmergencyContact | null
  onClose: () => void
  onSave: (data: { name: string; relationship: string; phone: string }) => void
}) {
  const [formData, setFormData] = useState({
    name: contact?.name || '',
    relationship: contact?.relationship || '',
    phone: contact?.phone || '',
  })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-900">
            {contact ? 'Edit Contact' : 'Add Emergency Contact'}
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form
          className="p-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            onSave(formData)
          }}
        >
          <div>
            <label className="label" htmlFor="contact-name">Full Name *</label>
            <input
              id="contact-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              placeholder="e.g., Fatima Al-Rashid"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="contact-rel">Relationship *</label>
            <input
              id="contact-rel"
              type="text"
              value={formData.relationship}
              onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
              className="input"
              placeholder="e.g., Sister, Spouse"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="contact-phone">Phone Number *</label>
            <input
              id="contact-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input"
              placeholder="+971 50 123 4567"
              required
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">
              {contact ? 'Update' : 'Add Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
