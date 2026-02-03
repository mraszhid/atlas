'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft,
  Brain,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  DollarSign,
  Clock,
  Shield,
  Download,
  User,
  Building2
} from 'lucide-react'
import { AIBanner, AIStageProgress, AIConfidence } from '@/components/ai/AIComponents'

const DEMO_PATIENTS = [
  { id: '1', name: 'Muhammad Rashid', policyNumber: 'GTI-2024-78392', coverage: 'Premium International' },
  { id: '2', name: 'Sarah Chen', policyNumber: 'GTI-2024-12847', coverage: 'Standard Plus' },
  { id: '3', name: 'James Anderson', policyNumber: 'GTI-2024-93421', coverage: 'Premium International' },
]

const PROCEDURES = [
  { id: 'cardiac', name: 'Cardiac Catheterization', code: 'CPT-93458', avgCost: '$15,000' },
  { id: 'knee', name: 'Knee Replacement Surgery', code: 'CPT-27447', avgCost: '$35,000' },
  { id: 'mri', name: 'MRI with Contrast', code: 'CPT-70553', avgCost: '$2,500' },
  { id: 'colonoscopy', name: 'Colonoscopy with Biopsy', code: 'CPT-45380', avgCost: '$3,200' },
  { id: 'dental', name: 'Dental Implant', code: 'CDT-D6010', avgCost: '$4,500' },
]

// AI Analysis results
const AI_PREAUTH_RESULT = {
  decision: 'APPROVED',
  confidence: 94,
  estimatedCost: '$14,850',
  coveredAmount: '$11,880',
  patientResponsibility: '$2,970',
  coveragePercentage: 80,
  deductibleRemaining: '$500',
  outOfPocketMax: '$5,000',
  
  analysis: {
    policyCheck: { status: 'pass', message: 'Procedure covered under Premium International plan' },
    preExisting: { status: 'pass', message: 'No pre-existing condition exclusions apply (>12 months since enrollment)' },
    waitingPeriod: { status: 'pass', message: 'Waiting period satisfied' },
    priorAuth: { status: 'pass', message: 'Prior authorization not required for diagnostic procedures' },
    networkStatus: { status: 'pass', message: 'Provider is in-network' },
    annualLimit: { status: 'pass', message: '$487,500 remaining of $500,000 annual limit' },
  },
  
  requirements: [
    { met: true, item: 'Valid policy in good standing' },
    { met: true, item: 'Procedure medically necessary (documentation provided)' },
    { met: true, item: 'In-network provider selected' },
    { met: false, item: '48-hour advance notification (waived for emergency)', waived: true },
  ],
  
  warnings: [
    'Patient has Type 2 Diabetes - ensure glucose monitoring during procedure',
    'Patient taking Metformin - hold 48h before/after if contrast used',
  ],
  
  recommendations: [
    'Recommend pre-procedure HbA1c check',
    'Coordinate with endocrinologist for perioperative glucose management',
  ],
}

const AI_DENIAL_RESULT = {
  decision: 'DENIED',
  confidence: 89,
  reason: 'Cosmetic Procedure Exclusion',
  
  analysis: {
    policyCheck: { status: 'fail', message: 'Procedure excluded under policy Section 4.2: Cosmetic procedures not medically necessary' },
    preExisting: { status: 'na', message: 'Not applicable' },
    waitingPeriod: { status: 'pass', message: 'Waiting period satisfied' },
    priorAuth: { status: 'na', message: 'Not applicable - procedure not covered' },
    networkStatus: { status: 'pass', message: 'Provider is in-network' },
    annualLimit: { status: 'na', message: 'Not applicable - procedure not covered' },
  },
  
  appealOptions: [
    'Request medical necessity review with supporting documentation',
    'Obtain letter from physician documenting functional impairment',
    'Submit photos demonstrating medical need vs cosmetic desire',
  ],
}

export default function AIPreAuthPage() {
  const [selectedPatient, setSelectedPatient] = useState<string>('')
  const [selectedProcedure, setSelectedProcedure] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [currentStage, setCurrentStage] = useState(-1)
  const [result, setResult] = useState<typeof AI_PREAUTH_RESULT | typeof AI_DENIAL_RESULT | null>(null)

  const stages = [
    { id: 'verify', label: 'Verifying patient identity...', duration: 800, result: 'Verified' },
    { id: 'policy', label: 'Checking policy coverage...', duration: 1200, result: 'Premium International - Active' },
    { id: 'benefits', label: 'Analyzing benefits & exclusions...', duration: 1500, result: 'Procedure covered' },
    { id: 'preexisting', label: 'Checking pre-existing conditions...', duration: 1000, result: 'No exclusions apply' },
    { id: 'limits', label: 'Calculating coverage limits...', duration: 1200, result: '$487,500 remaining' },
    { id: 'decision', label: 'Generating authorization decision...', duration: 800, result: 'Complete' },
  ]

  async function startAnalysis() {
    if (!selectedPatient || !selectedProcedure) return

    setIsAnalyzing(true)
    setCurrentStage(0)
    setResult(null)

    for (let i = 0; i < stages.length; i++) {
      setCurrentStage(i)
      await new Promise(r => setTimeout(r, stages[i].duration))
    }

    setCurrentStage(stages.length)
    setIsAnalyzing(false)
    setAnalysisComplete(true)
    
    // Simulate denial for dental implant (cosmetic)
    if (selectedProcedure === 'dental') {
      setResult(AI_DENIAL_RESULT as any)
    } else {
      setResult(AI_PREAUTH_RESULT)
    }
  }

  function reset() {
    setSelectedPatient('')
    setSelectedProcedure('')
    setIsAnalyzing(false)
    setAnalysisComplete(false)
    setCurrentStage(-1)
    setResult(null)
  }

  const patient = DEMO_PATIENTS.find(p => p.id === selectedPatient)
  const procedure = PROCEDURES.find(p => p.id === selectedProcedure)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/insurer/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Pre-Authorization</h1>
        <p className="text-slate-500">Instant coverage verification and pre-authorization decisions</p>
      </div>

      <AIBanner 
        title="Pre-Authorization AI" 
        subtitle="Analyzes policy terms • Checks exclusions • Calculates coverage • Instant decisions"
      />

      {!analysisComplete ? (
        <div className="max-w-2xl mx-auto">
          <div className="card-premium p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Request Pre-Authorization</h2>
            
            {/* Patient Selection */}
            <div className="mb-6">
              <label className="label">Select Patient</label>
              <div className="space-y-2">
                {DEMO_PATIENTS.map(p => (
                  <div 
                    key={p.id}
                    onClick={() => setSelectedPatient(p.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedPatient === p.id 
                        ? 'bg-amber-50 border-amber-300' 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPatient === p.id ? 'bg-amber-500 border-amber-500' : 'border-slate-300'
                      }`}>
                        {selectedPatient === p.id && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{p.name}</p>
                        <p className="text-sm text-slate-500">{p.policyNumber} • {p.coverage}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Procedure Selection */}
            <div className="mb-6">
              <label className="label">Select Procedure</label>
              <div className="space-y-2">
                {PROCEDURES.map(p => (
                  <div 
                    key={p.id}
                    onClick={() => setSelectedProcedure(p.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedProcedure === p.id 
                        ? 'bg-amber-50 border-amber-300' 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedProcedure === p.id ? 'bg-amber-500 border-amber-500' : 'border-slate-300'
                      }`}>
                        {selectedProcedure === p.id && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{p.name}</p>
                        <p className="text-sm text-slate-500">{p.code} • Est. {p.avgCost}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {!isAnalyzing ? (
              <button 
                onClick={startAnalysis} 
                disabled={!selectedPatient || !selectedProcedure}
                className="btn-primary w-full disabled:opacity-50"
              >
                <Brain className="w-5 h-5" />
                Run AI Pre-Authorization
              </button>
            ) : (
              <div className="mt-6">
                <AIStageProgress stages={stages} currentStage={currentStage} />
              </div>
            )}
          </div>
        </div>
      ) : result && (
        <div className="max-w-4xl mx-auto">
          {/* Decision Banner */}
          <div className={`rounded-2xl p-6 mb-6 ${
            result.decision === 'APPROVED' 
              ? 'bg-gradient-to-r from-emerald-500 to-green-500' 
              : 'bg-gradient-to-r from-rose-500 to-red-500'
          } text-white shadow-xl`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                  {result.decision === 'APPROVED' ? (
                    <CheckCircle2 className="w-8 h-8" />
                  ) : (
                    <XCircle className="w-8 h-8" />
                  )}
                </div>
                <div>
                  <p className="text-white/80 text-sm">Pre-Authorization Decision</p>
                  <h2 className="text-3xl font-bold">{result.decision}</h2>
                  {'reason' in result && <p className="text-white/90 mt-1">{result.reason}</p>}
                </div>
              </div>
              <AIConfidence score={result.confidence} size="lg" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Coverage Details (Approved) */}
              {'coveredAmount' in result && (
                <div className="card-premium p-6">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-500" />
                    Coverage Breakdown
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-600">Estimated Cost</span>
                      <span className="font-bold text-slate-900">{result.estimatedCost}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                      <span className="text-emerald-700">Insurance Covers ({result.coveragePercentage}%)</span>
                      <span className="font-bold text-emerald-700">{result.coveredAmount}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                      <span className="text-amber-700">Patient Responsibility</span>
                      <span className="font-bold text-amber-700">{result.patientResponsibility}</span>
                    </div>
                    <div className="border-t pt-3 mt-3 text-sm text-slate-500">
                      <p>Deductible remaining: {result.deductibleRemaining}</p>
                      <p>Out-of-pocket max: {result.outOfPocketMax}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Policy Analysis */}
              <div className="card-premium p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  Policy Analysis
                </h3>
                <div className="space-y-3">
                  {Object.entries(result.analysis).map(([key, val]: [string, any]) => (
                    <div key={key} className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        val.status === 'pass' ? 'bg-emerald-100 text-emerald-600' :
                        val.status === 'fail' ? 'bg-rose-100 text-rose-600' :
                        'bg-slate-100 text-slate-400'
                      }`}>
                        {val.status === 'pass' ? <CheckCircle2 className="w-4 h-4" /> :
                         val.status === 'fail' ? <XCircle className="w-4 h-4" /> :
                         <span className="text-xs">—</span>}
                      </div>
                      <p className="text-sm text-slate-700">{val.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Requirements */}
              {'requirements' in result && (
                <div className="card-premium p-6">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-violet-500" />
                    Requirements
                  </h3>
                  <div className="space-y-3">
                    {result.requirements.map((req: any, i: number) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          req.met ? 'bg-emerald-100 text-emerald-600' : 
                          req.waived ? 'bg-amber-100 text-amber-600' :
                          'bg-rose-100 text-rose-600'
                        }`}>
                          {req.met ? <CheckCircle2 className="w-4 h-4" /> : 
                           req.waived ? <Clock className="w-4 h-4" /> :
                           <XCircle className="w-4 h-4" />}
                        </div>
                        <p className="text-sm text-slate-700">{req.item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {'warnings' in result && result.warnings.length > 0 && (
                <div className="card-premium p-6 bg-amber-50 border-amber-200">
                  <h3 className="font-semibold text-amber-800 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Clinical Warnings
                  </h3>
                  <ul className="space-y-2">
                    {result.warnings.map((warning: string, i: number) => (
                      <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                        <span className="text-amber-500">•</span>
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Appeal Options (Denied) */}
              {'appealOptions' in result && (
                <div className="card-premium p-6 bg-blue-50 border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Appeal Options
                  </h3>
                  <ul className="space-y-2">
                    {result.appealOptions.map((option: string, i: number) => (
                      <li key={i} className="text-sm text-blue-700 flex items-start gap-2">
                        <span className="text-blue-500">{i + 1}.</span>
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                {result.decision === 'APPROVED' && (
                  <button className="btn-primary w-full">
                    <Download className="w-5 h-5" />
                    Download Pre-Auth Letter
                  </button>
                )}
                <button onClick={reset} className="btn-secondary w-full">
                  New Pre-Authorization
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
