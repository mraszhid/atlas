'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  AlertTriangle, 
  Shield, 
  Phone, 
  Heart, 
  Pill, 
  Activity,
  Scissors,
  Lock,
  Search,
  CheckCircle2,
  FileText,
  AlertCircle,
  ArrowLeft,
  Zap,
  Droplet,
  Brain,
  Sparkles,
  Languages,
  XCircle,
  Info
} from 'lucide-react'
import { cn, formatDate, calculateAge, t } from '@/lib/utils'

// Demo patient data
const DEMO_PATIENT = {
  fullName: 'Muhammad Rashid',
  dateOfBirth: '1985-03-15',
  bloodType: 'O+',
  nationality: 'United Arab Emirates',
  emergencyCode: 'ATLAS-DEMO-1234',
  organDonor: true,
  advanceDirective: 'No resuscitation if brain death confirmed. Healthcare proxy: Fatima Rashid (wife).',
  decisionMakerName: 'Fatima Rashid',
  decisionMakerPhone: '+971 50 987 6543',
  allergies: [
    { allergen: 'Penicillin', severity: 'SEVERE', reaction: 'Anaphylaxis - requires epinephrine', verified: true },
    { allergen: 'Sulfa Drugs', severity: 'MODERATE', reaction: 'Skin rash, hives', verified: true },
    { allergen: 'Shellfish', severity: 'MILD', reaction: 'GI upset', verified: false },
  ],
  medications: [
    { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily with meals', verified: true },
    { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily in morning', verified: true },
    { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily at bedtime', verified: true },
    { name: 'Aspirin', dosage: '81mg', frequency: 'Once daily', verified: false },
  ],
  conditions: [
    { name: 'Type 2 Diabetes Mellitus', status: 'MANAGED', diagnosedDate: '2018-06-15', verified: true },
    { name: 'Hypertension', status: 'MANAGED', diagnosedDate: '2015-03-20', verified: true },
    { name: 'Hyperlipidemia', status: 'MANAGED', diagnosedDate: '2016-01-10', verified: true },
  ],
  surgeries: [
    { name: 'Appendectomy', date: '2010-08-22', hospital: 'Cleveland Clinic Abu Dhabi' },
    { name: 'Knee Arthroscopy', date: '2019-04-15', hospital: 'Dubai Healthcare City' },
  ],
  emergencyContacts: [
    { name: 'Fatima Rashid', relationship: 'Wife', phone: '+971 50 987 6543' },
    { name: 'Ahmed Rashid', relationship: 'Brother', phone: '+971 55 234 5678' },
  ],
}

// AI Triage data based on patient
const AI_TRIAGE = {
  criticalAlerts: [
    { type: 'SEVERE', message: 'PENICILLIN ALLERGY - Anaphylaxis risk', detail: 'Avoid ALL beta-lactam antibiotics including amoxicillin, ampicillin, cephalosporins' },
    { type: 'SEVERE', message: 'SULFA DRUG ALLERGY', detail: 'Avoid sulfonamide antibiotics, some diuretics (furosemide alternatives available)' },
  ],
  drugInteractions: [
    { drugs: 'Metformin + IV Contrast', risk: 'HIGH', warning: 'Lactic acidosis risk - Hold metformin 48h before/after contrast procedures' },
    { drugs: 'Lisinopril + NSAIDs', risk: 'MODERATE', warning: 'May reduce antihypertensive effect and worsen kidney function' },
    { drugs: 'Aspirin + Surgery', risk: 'MODERATE', warning: 'Increased bleeding risk - Consider holding 7 days pre-surgery' },
  ],
  safeAlternatives: {
    antibiotics: ['Azithromycin (Z-pack)', 'Fluoroquinolones (Ciprofloxacin, Levofloxacin)', 'Vancomycin', 'Doxycycline'],
    painRelief: ['Paracetamol/Acetaminophen (preferred)', 'Tramadol (with caution)', 'Avoid NSAIDs if possible due to HTN'],
    anesthesia: ['Propofol - SAFE', 'Fentanyl - SAFE', 'Avoid: Succinylcholine monitoring needed (diabetes)'],
  },
  diabeticProtocol: {
    alert: 'Type 2 Diabetes - Active on Metformin',
    guidelines: [
      'Check blood glucose before any procedure',
      'Target glucose: 140-180 mg/dL during acute illness',
      'Hold Metformin if NPO or receiving IV contrast',
      'Watch for hypoglycemia signs if patient unable to eat',
    ],
  },
  localTranslations: {
    th: {
      allergy: 'ผู้ป่วยแพ้เพนิซิลลิน - ห้ามใช้ยากลุ่มเบต้าแลคแทม',
      diabetes: 'ผู้ป่วยเป็นเบาหวาน - ตรวจน้ำตาลก่อนทำหัตถการ',
    },
    ar: {
      allergy: 'المريض لديه حساسية من البنسلين - تجنب جميع المضادات الحيوية بيتا لاكتام',
      diabetes: 'مريض السكري - فحص نسبة السكر في الدم قبل أي إجراء',
    },
    zh: {
      allergy: '患者对青霉素过敏 - 避免所有β-内酰胺类抗生素',
      diabetes: '糖尿病患者 - 任何手术前检查血糖',
    },
  },
}

function EmergencyPageContent() {
  const searchParams = useSearchParams()
  const codeFromUrl = searchParams.get('code')
  
  const [mode, setMode] = useState<'search' | 'view'>('search')
  const [searchType, setSearchType] = useState<'code' | 'passport'>('code')
  const [searchValue, setSearchValue] = useState(codeFromUrl || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [patientData, setPatientData] = useState<any>(null)
  const [language, setLanguage] = useState('en')
  const [showOverrideModal, setShowOverrideModal] = useState(false)
  const [isDemo, setIsDemo] = useState(false)
  const [showAITriage, setShowAITriage] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [triageLanguage, setTriageLanguage] = useState('en')

  useEffect(() => {
    if (codeFromUrl) {
      handleSearch(codeFromUrl)
    }
  }, [codeFromUrl])

  function loadDemoData() {
    setIsDemo(true)
    setPatientData(DEMO_PATIENT)
    setMode('view')
    // Auto-trigger AI triage for demo
    setTimeout(() => triggerAITriage(), 500)
  }

  async function triggerAITriage() {
    setAiLoading(true)
    // Simulate AI processing
    await new Promise(r => setTimeout(r, 2000))
    setAiLoading(false)
    setShowAITriage(true)
  }

  async function handleSearch(code?: string) {
    const value = code || searchValue
    if (!value.trim()) {
      setError('Please enter a code or passport number')
      return
    }

    if (value.toUpperCase().includes('DEMO') || value === 'ATLAS-DEMO-1234') {
      loadDemoData()
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/emergency/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchType, searchValue: value, language }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.locked) {
          setShowOverrideModal(true)
        } else {
          setError(data.error || 'Patient not found')
        }
        setLoading(false)
        return
      }

      setPatientData(data)
      setIsDemo(false)
      setMode('view')
    } catch {
      setError('Connection error. Please try again.')
    }
    setLoading(false)
  }

  async function handleOverride(passcode: string) {
    setLoading(true)
    try {
      const res = await fetch('/api/emergency/override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchType, searchValue, passcode, language }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Invalid passcode')
        setLoading(false)
        return
      }

      setPatientData(data)
      setShowOverrideModal(false)
      setMode('view')
    } catch {
      setError('Connection error')
    }
    setLoading(false)
  }

  function goBack() {
    setMode('search')
    setPatientData(null)
    setSearchValue('')
    setError('')
    setIsDemo(false)
    setShowAITriage(false)
  }

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'th', label: 'ไทย' },
    { code: 'ar', label: 'عربي' },
    { code: 'zh', label: '中文' },
  ]

  // VIEW MODE - Patient Data + AI Triage
  if (mode === 'view' && patientData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-900 via-rose-800 to-slate-900">
        {/* Emergency Header */}
        <div className="bg-rose-600 text-white px-4 py-3 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
              <span className="font-bold text-lg">EMERGENCY ACCESS</span>
              {isDemo && (
                <span className="px-2 py-0.5 bg-amber-500 text-amber-900 rounded text-xs font-bold uppercase">
                  Demo Mode
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              {!showAITriage && (
                <button 
                  onClick={triggerAITriage}
                  disabled={aiLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all"
                >
                  {aiLoading ? (
                    <>
                      <Brain className="w-4 h-4 animate-pulse" />
                      AI Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      AI Triage
                    </>
                  )}
                </button>
              )}
              <button onClick={goBack} className="flex items-center gap-2 text-white/80 hover:text-white">
                <ArrowLeft className="w-4 h-4" />
                New Search
              </button>
            </div>
          </div>
        </div>

        {/* AI Triage Banner */}
        {showAITriage && (
          <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white px-4 py-3">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold flex items-center gap-2">
                    AI Triage Assistant Active
                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  </p>
                  <p className="text-sm text-white/80">Real-time clinical decision support</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/60">Translate alerts:</span>
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setTriageLanguage(lang.code)}
                    className={cn(
                      "px-2 py-1 rounded text-xs font-medium transition-all",
                      triageLanguage === lang.code ? 'bg-white text-violet-700' : 'bg-white/20 hover:bg-white/30'
                    )}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* AI Triage Section */}
          {showAITriage && (
            <div className="mb-6 space-y-4">
              {/* Critical Alerts */}
              <div className="bg-rose-600 rounded-2xl p-6 text-white shadow-xl animate-pulse-slow">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6" />
                  CRITICAL ALERTS - DO NOT ADMINISTER
                </h2>
                <div className="space-y-3">
                  {AI_TRIAGE.criticalAlerts.map((alert, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-4">
                      <p className="font-bold text-lg">{alert.message}</p>
                      <p className="text-rose-100 mt-1">{alert.detail}</p>
                    </div>
                  ))}
                </div>
                
                {/* Local translation */}
                {triageLanguage !== 'en' && AI_TRIAGE.localTranslations[triageLanguage as keyof typeof AI_TRIAGE.localTranslations] && (
                  <div className="mt-4 p-4 bg-white/10 rounded-xl border-2 border-white/30">
                    <p className="text-sm text-rose-200 mb-2 flex items-center gap-2">
                      <Languages className="w-4 h-4" /> Local Translation:
                    </p>
                    <p className="text-xl font-bold" dir={triageLanguage === 'ar' ? 'rtl' : 'ltr'}>
                      {AI_TRIAGE.localTranslations[triageLanguage as keyof typeof AI_TRIAGE.localTranslations]?.allergy}
                    </p>
                  </div>
                )}
              </div>

              {/* Two column layout */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Safe Alternatives */}
                <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-xl">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6" />
                    SAFE ALTERNATIVES
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-emerald-200 text-sm font-medium mb-2">For Infection:</p>
                      <div className="flex flex-wrap gap-2">
                        {AI_TRIAGE.safeAlternatives.antibiotics.map((drug, i) => (
                          <span key={i} className="px-3 py-1 bg-white/20 rounded-full text-sm">{drug}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-emerald-200 text-sm font-medium mb-2">For Pain:</p>
                      <div className="flex flex-wrap gap-2">
                        {AI_TRIAGE.safeAlternatives.painRelief.map((drug, i) => (
                          <span key={i} className="px-3 py-1 bg-white/20 rounded-full text-sm">{drug}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Drug Interactions */}
                <div className="bg-amber-600 rounded-2xl p-6 text-white shadow-xl">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <AlertCircle className="w-6 h-6" />
                    DRUG INTERACTIONS
                  </h2>
                  <div className="space-y-3">
                    {AI_TRIAGE.drugInteractions.map((interaction, i) => (
                      <div key={i} className="bg-white/10 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-bold">{interaction.drugs}</p>
                          <span className={cn(
                            "px-2 py-0.5 rounded text-xs font-bold",
                            interaction.risk === 'HIGH' ? 'bg-rose-500' : 'bg-amber-700'
                          )}>
                            {interaction.risk} RISK
                          </span>
                        </div>
                        <p className="text-amber-100 text-sm">{interaction.warning}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Diabetic Protocol */}
              <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Activity className="w-6 h-6" />
                  DIABETIC PATIENT PROTOCOL
                </h2>
                <div className="bg-white/10 rounded-xl p-4 mb-4">
                  <p className="font-bold text-lg">{AI_TRIAGE.diabeticProtocol.alert}</p>
                </div>
                <ul className="space-y-2">
                  {AI_TRIAGE.diabeticProtocol.guidelines.map((guideline, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-200 flex-shrink-0 mt-0.5" />
                      <span>{guideline}</span>
                    </li>
                  ))}
                </ul>
                
                {triageLanguage !== 'en' && AI_TRIAGE.localTranslations[triageLanguage as keyof typeof AI_TRIAGE.localTranslations] && (
                  <div className="mt-4 p-3 bg-white/10 rounded-xl">
                    <p className="font-bold" dir={triageLanguage === 'ar' ? 'rtl' : 'ltr'}>
                      {AI_TRIAGE.localTranslations[triageLanguage as keyof typeof AI_TRIAGE.localTranslations]?.diabetes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Patient Identity Card */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-xl">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white text-3xl font-bold">
                {patientData.fullName.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-900">{patientData.fullName}</h1>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-600">
                  <span>{calculateAge(patientData.dateOfBirth)} years old</span>
                  <span className="flex items-center gap-1">
                    <Droplet className="w-4 h-4 text-rose-500" />
                    <strong className="text-rose-600">{patientData.bloodType}</strong>
                  </span>
                  <span>{patientData.nationality}</span>
                </div>
                {patientData.organDonor && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-medium">
                    <Heart className="w-4 h-4 fill-current" />
                    Registered Organ Donor
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Allergies */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border-l-4 border-rose-500">
              <h2 className="flex items-center gap-2 text-lg font-bold text-rose-700 mb-4">
                <AlertTriangle className="w-5 h-5" />
                Allergies
              </h2>
              <div className="space-y-3">
                {patientData.allergies?.map((allergy: any, i: number) => (
                  <div key={i} className={cn(
                    "p-4 rounded-xl",
                    allergy.severity === 'SEVERE' ? 'bg-rose-100 border-2 border-rose-300' :
                    allergy.severity === 'MODERATE' ? 'bg-amber-50 border border-amber-200' :
                    'bg-slate-50'
                  )}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-slate-900">{allergy.allergen}</p>
                        <p className="text-sm text-slate-600 mt-1">{allergy.reaction}</p>
                      </div>
                      <span className={cn(
                        "badge",
                        allergy.severity === 'SEVERE' ? 'badge-emergency' :
                        allergy.severity === 'MODERATE' ? 'badge-gold' : 'badge-info'
                      )}>
                        {allergy.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Medications */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border-l-4 border-blue-500">
              <h2 className="flex items-center gap-2 text-lg font-bold text-blue-700 mb-4">
                <Pill className="w-5 h-5" />
                Current Medications
              </h2>
              <div className="space-y-3">
                {patientData.medications?.map((med: any, i: number) => (
                  <div key={i} className="p-4 bg-blue-50 rounded-xl">
                    <p className="font-bold text-slate-900">{med.name}</p>
                    <p className="text-sm text-blue-700 font-medium">{med.dosage}</p>
                    <p className="text-sm text-slate-600">{med.frequency}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Conditions */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border-l-4 border-violet-500">
              <h2 className="flex items-center gap-2 text-lg font-bold text-violet-700 mb-4">
                <Activity className="w-5 h-5" />
                Medical Conditions
              </h2>
              <div className="space-y-3">
                {patientData.conditions?.map((condition: any, i: number) => (
                  <div key={i} className="p-4 bg-violet-50 rounded-xl">
                    <p className="font-bold text-slate-900">{condition.name}</p>
                    <p className="text-sm text-slate-600">Status: {condition.status}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border-l-4 border-emerald-500">
              <h2 className="flex items-center gap-2 text-lg font-bold text-emerald-700 mb-4">
                <Phone className="w-5 h-5" />
                Emergency Contacts
              </h2>
              <div className="space-y-3">
                {patientData.emergencyContacts?.map((contact: any, i: number) => (
                  <div key={i} className="p-4 bg-emerald-50 rounded-xl">
                    <p className="font-bold text-slate-900">{contact.name}</p>
                    <p className="text-sm text-slate-600">{contact.relationship}</p>
                    <a 
                      href={`tel:${contact.phone}`}
                      className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700"
                    >
                      <Phone className="w-4 h-4" />
                      {contact.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Advance Directive */}
          {patientData.advanceDirective && (
            <div className="mt-6 bg-white rounded-2xl p-6 shadow-xl border-l-4 border-slate-500">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-700 mb-4">
                <FileText className="w-5 h-5" />
                Advance Directive
              </h2>
              <div className="p-4 bg-slate-100 rounded-xl">
                <p className="text-slate-800 whitespace-pre-wrap">{patientData.advanceDirective}</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center text-white/60 text-sm">
            <p>Access logged for audit • Powered by ATLAS Health Identity</p>
          </div>
        </div>

        <style jsx global>{`
          @keyframes pulse-slow {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.9; }
          }
          .animate-pulse-slow {
            animation: pulse-slow 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    )
  }

  // SEARCH MODE
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 mb-4 shadow-lg shadow-rose-500/30">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Emergency Access</h1>
          <p className="text-slate-400">Access critical patient health information</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
          {/* Search Type Toggle */}
          <div className="flex gap-2 p-1 bg-white/5 rounded-xl mb-6">
            <button
              onClick={() => setSearchType('code')}
              className={cn(
                "flex-1 py-2.5 rounded-lg text-sm font-medium transition-all",
                searchType === 'code' ? 'bg-white text-slate-900' : 'text-white/60 hover:text-white'
              )}
            >
              Emergency Code
            </button>
            <button
              onClick={() => setSearchType('passport')}
              className={cn(
                "flex-1 py-2.5 rounded-lg text-sm font-medium transition-all",
                searchType === 'passport' ? 'bg-white text-slate-900' : 'text-white/60 hover:text-white'
              )}
            >
              Passport Number
            </button>
          </div>

          <div className="relative mb-4">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={searchType === 'code' ? 'ATLAS-XXXX-XXXX' : 'Passport Number'}
              className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 text-center text-lg font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-300 text-sm mb-4">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-rose-500 to-rose-600 rounded-xl text-white font-semibold hover:from-rose-400 hover:to-rose-500 transition-all shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Access Records
              </>
            )}
          </button>

          <div className="mt-6 pt-6 border-t border-white/10">
            <button
              onClick={loadDemoData}
              className="w-full py-3 bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 rounded-xl text-violet-300 font-medium hover:bg-violet-500/30 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              View Demo with AI Triage
            </button>
            <p className="text-center text-white/40 text-xs mt-3">
              See AI-powered emergency triage in action
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-white/40 hover:text-white/60 text-sm transition-colors">
            ← Back to ATLAS
          </Link>
        </div>
      </div>

      {/* Override Modal */}
      {showOverrideModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Lock className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Records Locked</h3>
                <p className="text-sm text-slate-400">Enter emergency override code</p>
              </div>
            </div>
            <input
              type="password"
              placeholder="Override Passcode"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 text-center mb-4 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleOverride((e.target as HTMLInputElement).value)
                }
              }}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowOverrideModal(false)}
                className="flex-1 py-2.5 bg-white/10 rounded-xl text-white font-medium hover:bg-white/20"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  const input = (e.target as HTMLElement).parentElement?.previousElementSibling as HTMLInputElement
                  handleOverride(input?.value || '')
                }}
                className="flex-1 py-2.5 bg-amber-500 rounded-xl text-white font-medium hover:bg-amber-400"
              >
                Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function EmergencyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
      </div>
    }>
      <EmergencyPageContent />
    </Suspense>
  )
}
