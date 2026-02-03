'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft,
  Brain,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Pill,
  Activity,
  Clipboard,
  Eye,
  Send
} from 'lucide-react'
import { AIBanner, AIStageProgress, AIConfidence } from '@/components/ai/AIComponents'

// Demo patient for AI analysis
const DEMO_PATIENT = {
  name: 'Muhammad Rashid',
  conditions: ['Type 2 Diabetes', 'Hypertension', 'Hyperlipidemia'],
  medications: ['Metformin 500mg', 'Lisinopril 10mg', 'Atorvastatin 20mg'],
  allergies: ['Penicillin (SEVERE)', 'Sulfa Drugs'],
  lastVisit: '6 months ago',
}

// AI-generated questions
const AI_GENERATED_QUESTIONS = {
  diabetesQuestions: [
    { id: 'hba1c', label: 'When was your last HbA1c test?', type: 'date', required: true, aiReason: 'Patient has Type 2 Diabetes - HbA1c monitoring essential' },
    { id: 'hba1c_value', label: 'What was the HbA1c result?', type: 'text', placeholder: 'e.g., 7.2%', required: true, aiReason: 'Tracking glycemic control' },
    { id: 'glucose_monitoring', label: 'How often do you check your blood glucose at home?', type: 'select', options: ['Daily', '2-3 times/week', 'Weekly', 'Rarely', 'Never'], required: true, aiReason: 'Assess self-management' },
    { id: 'hypoglycemia', label: 'Have you experienced any low blood sugar episodes recently?', type: 'yesno', required: true, aiReason: 'Safety check for medication adjustment' },
  ],
  hypertensionQuestions: [
    { id: 'bp_home', label: 'Do you monitor your blood pressure at home?', type: 'yesno', required: true, aiReason: 'Patient has Hypertension - home monitoring important' },
    { id: 'bp_recent', label: 'What was your most recent blood pressure reading?', type: 'text', placeholder: 'e.g., 130/85', required: true, aiReason: 'Assess current control' },
    { id: 'bp_symptoms', label: 'Have you experienced headaches, dizziness, or vision changes?', type: 'yesno', required: true, aiReason: 'Screen for hypertensive symptoms' },
  ],
  medicationQuestions: [
    { id: 'med_adherence', label: 'Are you taking all your medications as prescribed?', type: 'yesno', required: true, aiReason: 'Patient on 3 medications - adherence check' },
    { id: 'med_side_effects', label: 'Have you experienced any side effects from your medications?', type: 'textarea', placeholder: 'Describe any issues...', required: false, aiReason: 'Monitor for adverse effects' },
  ],
  allergyVerification: [
    { id: 'allergy_confirm', label: 'Please confirm your known allergies: Penicillin (SEVERE), Sulfa Drugs', type: 'confirm', required: true, aiReason: 'Critical safety verification' },
    { id: 'new_allergies', label: 'Have you discovered any new allergies since your last visit?', type: 'textarea', placeholder: 'Describe any new reactions...', required: false, aiReason: 'Update allergy list' },
  ],
}

export default function AIIntakePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [currentStage, setCurrentStage] = useState(-1)
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set())
  const [showPreview, setShowPreview] = useState(false)
  const [formSent, setFormSent] = useState(false)

  const stages = [
    { id: 'fetch', label: 'Fetching patient ATLAS profile...', duration: 1000, result: 'Found: Muhammad Rashid' },
    { id: 'analyze', label: 'Analyzing medical history...', duration: 1500, result: '3 conditions, 3 medications, 2 allergies' },
    { id: 'identify', label: 'Identifying care gaps...', duration: 1200, result: 'Last HbA1c > 3 months ago' },
    { id: 'generate', label: 'Generating smart questions...', duration: 1400, result: '12 personalized questions' },
    { id: 'prioritize', label: 'Prioritizing by clinical relevance...', duration: 800, result: 'Complete' },
  ]

  async function startAnalysis() {
    setIsAnalyzing(true)
    setCurrentStage(0)

    for (let i = 0; i < stages.length; i++) {
      setCurrentStage(i)
      await new Promise(r => setTimeout(r, stages[i].duration))
    }

    setCurrentStage(stages.length)
    setIsAnalyzing(false)
    setAnalysisComplete(true)
    
    // Pre-select all questions
    const allIds = [...Object.values(AI_GENERATED_QUESTIONS)].flat().map(q => q.id)
    setSelectedQuestions(new Set(allIds))
  }

  function toggleQuestion(id: string) {
    const newSet = new Set(selectedQuestions)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedQuestions(newSet)
  }

  const totalQuestions = selectedQuestions.size

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/clinic/forms" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Forms
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Smart Intake</h1>
        <p className="text-slate-500">Generate personalized intake questions based on patient health history</p>
      </div>

      <AIBanner 
        title="Smart Intake Generator" 
        subtitle="Analyzes patient records • Identifies care gaps • Generates relevant questions"
      />

      {!analysisComplete ? (
        <div className="max-w-2xl mx-auto">
          <div className="card-premium p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Select Patient</h2>
            
            <div className="p-4 bg-violet-50 rounded-xl border-2 border-violet-200 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                  MR
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900">{DEMO_PATIENT.name}</p>
                  <p className="text-sm text-slate-600">
                    {DEMO_PATIENT.conditions.length} conditions • {DEMO_PATIENT.medications.length} medications • {DEMO_PATIENT.allergies.length} allergies
                  </p>
                </div>
                <CheckCircle2 className="w-6 h-6 text-violet-500" />
              </div>
            </div>

            {!isAnalyzing ? (
              <button onClick={startAnalysis} className="btn-primary w-full">
                <Brain className="w-5 h-5" />
                Generate AI Intake Form
              </button>
            ) : (
              <div className="mt-6">
                <AIStageProgress stages={stages} currentStage={currentStage} />
              </div>
            )}
          </div>
        </div>
      ) : showPreview ? (
        <div className="max-w-2xl mx-auto">
          <div className="card-premium p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Form Preview</h2>
              <button onClick={() => setShowPreview(false)} className="btn-ghost btn-sm">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </div>

            {formSent ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Form Sent!</h3>
                <p className="text-slate-500 mb-6">Sent to {DEMO_PATIENT.name}'s ATLAS account.</p>
                <Link href="/clinic/forms" className="btn-primary">View All Forms</Link>
              </div>
            ) : (
              <>
                <div className="border rounded-xl p-6 bg-slate-50 mb-6 max-h-96 overflow-y-auto">
                  {Object.entries(AI_GENERATED_QUESTIONS).map(([category, questions]) => {
                    const activeQuestions = questions.filter(q => selectedQuestions.has(q.id))
                    if (activeQuestions.length === 0) return null
                    return (
                      <div key={category} className="mb-6">
                        <h4 className="font-semibold text-slate-700 mb-3 capitalize">
                          {category.replace(/([A-Z])/g, ' $1').replace('Questions', '')}
                        </h4>
                        <div className="space-y-3">
                          {activeQuestions.map((q, i) => (
                            <div key={q.id} className="p-3 bg-white rounded-lg">
                              <label className="block text-sm font-medium text-slate-900 mb-2">
                                {q.label} {q.required && <span className="text-rose-500">*</span>}
                              </label>
                              <input type="text" className="input" placeholder="Patient response..." disabled />
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
                <button onClick={() => setFormSent(true)} className="btn-primary w-full">
                  <Send className="w-5 h-5" />
                  Send to Patient ({totalQuestions} questions)
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* AI Insights */}
            <div className="card-premium p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-amber-600" />
                <div>
                  <p className="font-semibold text-slate-900">AI Insights</p>
                  <p className="text-sm text-slate-600">
                    Based on Type 2 Diabetes - added diabetic monitoring questions. Hypertension detected - included BP questions.
                  </p>
                </div>
              </div>
            </div>

            {/* Diabetes Questions */}
            <div className="card-premium p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-violet-500" />
                Diabetes Management
                <span className="badge badge-purple ml-auto">AI Generated</span>
              </h3>
              <div className="space-y-3">
                {AI_GENERATED_QUESTIONS.diabetesQuestions.map(q => (
                  <QuestionRow key={q.id} question={q} selected={selectedQuestions.has(q.id)} onToggle={() => toggleQuestion(q.id)} />
                ))}
              </div>
            </div>

            {/* Hypertension Questions */}
            <div className="card-premium p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-rose-500" />
                Blood Pressure
                <span className="badge badge-purple ml-auto">AI Generated</span>
              </h3>
              <div className="space-y-3">
                {AI_GENERATED_QUESTIONS.hypertensionQuestions.map(q => (
                  <QuestionRow key={q.id} question={q} selected={selectedQuestions.has(q.id)} onToggle={() => toggleQuestion(q.id)} />
                ))}
              </div>
            </div>

            {/* Medication Questions */}
            <div className="card-premium p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Pill className="w-5 h-5 text-blue-500" />
                Medication Review
              </h3>
              <div className="space-y-3">
                {AI_GENERATED_QUESTIONS.medicationQuestions.map(q => (
                  <QuestionRow key={q.id} question={q} selected={selectedQuestions.has(q.id)} onToggle={() => toggleQuestion(q.id)} />
                ))}
              </div>
            </div>

            {/* Allergy Verification */}
            <div className="card-premium p-6 border-rose-200 bg-rose-50/30">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                Allergy Verification
                <span className="badge badge-emergency ml-auto">Critical</span>
              </h3>
              <div className="space-y-3">
                {AI_GENERATED_QUESTIONS.allergyVerification.map(q => (
                  <QuestionRow key={q.id} question={q} selected={selectedQuestions.has(q.id)} onToggle={() => toggleQuestion(q.id)} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card-premium p-6 bg-gradient-to-br from-violet-50 to-purple-50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  MR
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{DEMO_PATIENT.name}</p>
                  <p className="text-sm text-slate-500">ATLAS Patient</p>
                </div>
              </div>
            </div>

            <div className="card-premium p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Form Summary</h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">Questions</span>
                  <span className="font-bold">{totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Est. Time</span>
                  <span className="font-bold">{Math.ceil(totalQuestions * 0.5)} min</span>
                </div>
              </div>
              <AIConfidence score={94} size="sm" />
            </div>

            <button onClick={() => setShowPreview(true)} className="btn-primary w-full">
              <Eye className="w-5 h-5" />
              Preview Form
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function QuestionRow({ question, selected, onToggle }: { question: any; selected: boolean; onToggle: () => void }) {
  return (
    <div 
      onClick={onToggle}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
        selected ? 'bg-violet-50 border-violet-300' : 'bg-white border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
          selected ? 'bg-violet-500 border-violet-500' : 'border-slate-300'
        }`}>
          {selected && <CheckCircle2 className="w-3 h-3 text-white" />}
        </div>
        <div className="flex-1">
          <p className="font-medium text-slate-900">{question.label}</p>
          <p className="text-xs text-violet-600 mt-1 flex items-center gap-1">
            <Brain className="w-3 h-3" />
            {question.aiReason}
          </p>
        </div>
      </div>
    </div>
  )
}
