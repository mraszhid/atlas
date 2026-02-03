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
  Eye,
  Shield,
  Pill,
  Activity,
  Clock,
  HelpCircle
} from 'lucide-react'
import { AIBanner, AIStageProgress, AIConfidence } from '@/components/ai/AIComponents'

const DEMO_PATIENT = {
  name: 'Muhammad Rashid',
  dob: '1985-03-15',
  atlasId: 'ATLAS-MR84-X7K2',
}

// AI Verification Results
const AI_VERIFICATION = {
  overallConfidence: 87,
  verifiedItems: [
    {
      category: 'Allergies',
      items: [
        { 
          name: 'Penicillin Allergy',
          patientReported: 'Penicillin - Anaphylaxis',
          documentFound: 'Hospital discharge summary (2019)',
          documentExcerpt: 'Severe allergic reaction to Amoxicillin requiring epinephrine',
          status: 'verified',
          confidence: 98,
        },
        { 
          name: 'Sulfa Drug Allergy',
          patientReported: 'Sulfa Drugs - Skin rash',
          documentFound: 'Pharmacy alert record',
          documentExcerpt: 'Patient flagged for sulfonamide sensitivity',
          status: 'verified',
          confidence: 94,
        },
        { 
          name: 'Shellfish Allergy',
          patientReported: 'Shellfish - GI upset',
          documentFound: null,
          documentExcerpt: null,
          status: 'unverified',
          confidence: 0,
          note: 'No supporting documentation found. Patient-reported only.',
        },
      ],
    },
    {
      category: 'Medications',
      items: [
        { 
          name: 'Metformin',
          patientReported: '500mg twice daily',
          documentFound: 'E-prescription (Active)',
          documentExcerpt: 'Metformin HCl 500mg - Take 1 tablet twice daily with meals',
          status: 'verified',
          confidence: 99,
        },
        { 
          name: 'Lisinopril',
          patientReported: '10mg once daily',
          documentFound: 'E-prescription (Active)',
          documentExcerpt: 'Lisinopril 20mg - Take 1 tablet daily in the morning',
          status: 'discrepancy',
          confidence: 85,
          discrepancy: 'Dosage mismatch: Patient reports 10mg, prescription shows 20mg',
          suggestion: 'Confirm current dosage with patient - may have been recently changed',
        },
        { 
          name: 'Atorvastatin',
          patientReported: '20mg at bedtime',
          documentFound: 'E-prescription (Active)',
          documentExcerpt: 'Atorvastatin 20mg - Take 1 tablet at bedtime',
          status: 'verified',
          confidence: 99,
        },
        { 
          name: 'Aspirin',
          patientReported: '81mg daily',
          documentFound: null,
          documentExcerpt: null,
          status: 'unverified',
          confidence: 0,
          note: 'No prescription found. May be OTC self-medication.',
        },
      ],
    },
    {
      category: 'Conditions',
      items: [
        { 
          name: 'Type 2 Diabetes',
          patientReported: 'Diagnosed 2018',
          documentFound: 'Lab report & diagnosis code',
          documentExcerpt: 'ICD-10: E11.9 - Type 2 diabetes mellitus without complications. HbA1c history available.',
          status: 'verified',
          confidence: 99,
        },
        { 
          name: 'Hypertension',
          patientReported: 'Diagnosed 2015',
          documentFound: 'Diagnosis code & treatment history',
          documentExcerpt: 'ICD-10: I10 - Essential hypertension. On ACE inhibitor therapy.',
          status: 'verified',
          confidence: 97,
        },
        { 
          name: 'Hyperlipidemia',
          patientReported: 'Diagnosed 2016',
          documentFound: 'Lab report & diagnosis code',
          documentExcerpt: 'ICD-10: E78.5 - Hyperlipidemia. On statin therapy with documented response.',
          status: 'verified',
          confidence: 96,
        },
      ],
    },
  ],
  recommendations: [
    'Clarify Lisinopril dosage discrepancy with patient before signing',
    'Consider requesting documentation for Shellfish allergy',
    'Aspirin appears to be OTC - document as self-reported if patient confirms',
  ],
}

export default function AIVerifyPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [currentStage, setCurrentStage] = useState(-1)
  const [signedCategories, setSignedCategories] = useState<Set<string>>(new Set())

  const stages = [
    { id: 'fetch', label: 'Fetching patient records...', duration: 1000, result: 'Found 12 documents' },
    { id: 'extract', label: 'Extracting medical data...', duration: 1500, result: '3 allergies, 4 medications, 3 conditions' },
    { id: 'crossref', label: 'Cross-referencing with patient claims...', duration: 1800, result: 'Comparing 10 items' },
    { id: 'validate', label: 'Validating against drug databases...', duration: 1200, result: '1 discrepancy found' },
    { id: 'score', label: 'Calculating confidence scores...', duration: 800, result: '87% overall confidence' },
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
  }

  function signCategory(category: string) {
    setSignedCategories(prev => new Set([...Array.from(prev), category]))
  }

  function signAll() {
    const allCategories = AI_VERIFICATION.verifiedItems.map(v => v.category)
    setSignedCategories(new Set(allCategories))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      case 'discrepancy': return <AlertTriangle className="w-5 h-5 text-amber-500" />
      case 'unverified': return <HelpCircle className="w-5 h-5 text-slate-400" />
      default: return null
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-emerald-50 border-emerald-200'
      case 'discrepancy': return 'bg-amber-50 border-amber-200'
      case 'unverified': return 'bg-slate-50 border-slate-200'
      default: return 'bg-white'
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/clinician/patients" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Patients
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Verification Assistant</h1>
        <p className="text-slate-500">Cross-reference patient claims with medical records automatically</p>
      </div>

      <AIBanner 
        title="Verification AI" 
        subtitle="Scans documents • Cross-references claims • Identifies discrepancies • Confidence scoring"
      />

      {!analysisComplete ? (
        <div className="max-w-2xl mx-auto">
          <div className="card-premium p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Patient Records</h2>
            
            <div className="p-4 bg-emerald-50 rounded-xl border-2 border-emerald-200 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xl font-bold">
                  MR
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900">{DEMO_PATIENT.name}</p>
                  <p className="text-sm text-slate-500">DOB: {DEMO_PATIENT.dob}</p>
                  <p className="text-xs text-slate-400 font-mono">{DEMO_PATIENT.atlasId}</p>
                </div>
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl mb-6">
              <p className="text-sm text-slate-600 mb-2">Records to verify:</p>
              <div className="flex gap-4">
                <span className="badge badge-emergency">3 Allergies</span>
                <span className="badge badge-info">4 Medications</span>
                <span className="badge badge-purple">3 Conditions</span>
              </div>
            </div>

            {!isAnalyzing ? (
              <button onClick={startAnalysis} className="btn-primary w-full">
                <Brain className="w-5 h-5" />
                Start AI Verification
              </button>
            ) : (
              <div className="mt-6">
                <AIStageProgress stages={stages} currentStage={currentStage} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {/* Summary Banner */}
          <div className="card-premium p-6 mb-6 bg-gradient-to-r from-slate-50 to-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <AIConfidence score={AI_VERIFICATION.overallConfidence} size="lg" />
                <div>
                  <p className="font-bold text-slate-900">Verification Complete</p>
                  <p className="text-sm text-slate-500">
                    {AI_VERIFICATION.verifiedItems.flatMap(v => v.items).filter(i => i.status === 'verified').length} verified •
                    {' '}{AI_VERIFICATION.verifiedItems.flatMap(v => v.items).filter(i => i.status === 'discrepancy').length} discrepancies •
                    {' '}{AI_VERIFICATION.verifiedItems.flatMap(v => v.items).filter(i => i.status === 'unverified').length} unverified
                  </p>
                </div>
              </div>
              <button onClick={signAll} className="btn-primary">
                <Shield className="w-5 h-5" />
                Sign All & Verify
              </button>
            </div>
          </div>

          {/* Recommendations */}
          {AI_VERIFICATION.recommendations.length > 0 && (
            <div className="card-premium p-4 mb-6 bg-amber-50 border-amber-200">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-800">AI Recommendations</p>
                  <ul className="mt-2 space-y-1">
                    {AI_VERIFICATION.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-amber-700">• {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Verification Results */}
          <div className="space-y-6">
            {AI_VERIFICATION.verifiedItems.map((section) => (
              <div key={section.category} className="card-premium overflow-hidden">
                <div className="px-6 py-4 bg-slate-50 border-b flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    {section.category === 'Allergies' && <AlertTriangle className="w-5 h-5 text-rose-500" />}
                    {section.category === 'Medications' && <Pill className="w-5 h-5 text-blue-500" />}
                    {section.category === 'Conditions' && <Activity className="w-5 h-5 text-violet-500" />}
                    {section.category}
                  </h3>
                  {signedCategories.has(section.category) ? (
                    <span className="badge badge-verified"><CheckCircle2 className="w-3 h-3" /> Signed</span>
                  ) : (
                    <button onClick={() => signCategory(section.category)} className="btn-ghost btn-sm">
                      <Shield className="w-4 h-4" /> Sign
                    </button>
                  )}
                </div>
                
                <div className="divide-y">
                  {section.items.map((item, i) => (
                    <div key={i} className={`p-4 ${getStatusBg(item.status)}`}>
                      <div className="flex items-start gap-4">
                        <div className="mt-1">{getStatusIcon(item.status)}</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-slate-900">{item.name}</p>
                              <p className="text-sm text-slate-600">Patient reported: {item.patientReported}</p>
                            </div>
                            {item.confidence > 0 && (
                              <span className={`text-sm font-bold ${
                                item.confidence >= 90 ? 'text-emerald-600' :
                                item.confidence >= 70 ? 'text-amber-600' :
                                'text-slate-400'
                              }`}>
                                {item.confidence}%
                              </span>
                            )}
                          </div>
                          
                          {item.documentFound && (
                            <div className="mt-3 p-3 bg-white rounded-lg border">
                              <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                                <FileText className="w-3 h-3" /> Source: {item.documentFound}
                              </p>
                              <p className="text-sm text-slate-700 italic">"{item.documentExcerpt}"</p>
                            </div>
                          )}
                          
                          {item.discrepancy && (
                            <div className="mt-3 p-3 bg-amber-100 rounded-lg border border-amber-300">
                              <p className="text-sm text-amber-800 font-medium flex items-center gap-1">
                                <AlertTriangle className="w-4 h-4" /> {item.discrepancy}
                              </p>
                              {item.suggestion && (
                                <p className="text-sm text-amber-700 mt-1">💡 {item.suggestion}</p>
                              )}
                            </div>
                          )}
                          
                          {item.note && (
                            <p className="mt-2 text-sm text-slate-500 italic">{item.note}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Final Sign Off */}
          {signedCategories.size === AI_VERIFICATION.verifiedItems.length && (
            <div className="mt-6 card-premium p-6 bg-emerald-50 border-emerald-200 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-emerald-800">All Categories Verified</h3>
              <p className="text-emerald-600 mt-1">Records have been verified and signed by Dr. Clinician</p>
              <Link href="/clinician/patients" className="btn-primary mt-4">
                Return to Patients
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
