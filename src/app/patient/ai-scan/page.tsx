'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { 
  Upload, 
  FileText, 
  ArrowLeft,
  Sparkles,
  Languages,
  Pill,
  AlertTriangle,
  Activity,
  CheckCircle2,
  Plus,
  Eye,
  X,
  FileImage
} from 'lucide-react'
import { AIBanner, AIStageProgress, AIConfidence, AIResultCard, AIStreamingText } from '@/components/ai/AIComponents'

// Demo extracted data for different "documents"
const DEMO_EXTRACTIONS = {
  arabic: {
    language: 'Arabic',
    sourceCountry: 'United Arab Emirates',
    documentType: 'Hospital Discharge Summary',
    facility: 'Cleveland Clinic Abu Dhabi',
    date: '2024-01-15',
    medications: [
      { original: 'ميتفورمين ٥٠٠ ملغ', translated: 'Metformin 500mg', frequency: 'Twice daily', confidence: 98 },
      { original: 'ليسينوبريل ١٠ ملغ', translated: 'Lisinopril 10mg', frequency: 'Once daily', confidence: 96 },
      { original: 'أتورفاستاتين ٢٠ ملغ', translated: 'Atorvastatin 20mg', frequency: 'At bedtime', confidence: 97 },
    ],
    allergies: [
      { original: 'حساسية البنسلين - صدمة تحسسية', translated: 'Penicillin - Anaphylaxis', severity: 'SEVERE', confidence: 99 },
    ],
    conditions: [
      { original: 'داء السكري النوع الثاني', translated: 'Type 2 Diabetes Mellitus', status: 'Managed', confidence: 98 },
      { original: 'ارتفاع ضغط الدم', translated: 'Hypertension', status: 'Managed', confidence: 97 },
    ],
    labResults: [
      { test: 'HbA1c', value: '7.2%', reference: '<7%', flag: 'high' },
      { test: 'Blood Glucose (Fasting)', value: '142 mg/dL', reference: '70-100 mg/dL', flag: 'high' },
      { test: 'Blood Pressure', value: '138/88 mmHg', reference: '<120/80 mmHg', flag: 'high' },
    ],
  },
  thai: {
    language: 'Thai',
    sourceCountry: 'Thailand',
    documentType: 'Medical Certificate',
    facility: 'Bumrungrad International Hospital',
    date: '2024-01-10',
    medications: [
      { original: 'พาราเซตามอล 500 มก.', translated: 'Paracetamol 500mg', frequency: 'As needed', confidence: 99 },
      { original: 'ออมีพราโซล 20 มก.', translated: 'Omeprazole 20mg', frequency: 'Before breakfast', confidence: 97 },
    ],
    allergies: [
      { original: 'แพ้ซัลฟา', translated: 'Sulfa drugs', severity: 'MODERATE', confidence: 94 },
    ],
    conditions: [
      { original: 'กรดไหลย้อน', translated: 'GERD (Acid Reflux)', status: 'Active', confidence: 96 },
    ],
    labResults: [],
  },
  chinese: {
    language: 'Chinese (Simplified)',
    sourceCountry: 'China',
    documentType: 'Prescription Record',
    facility: 'Peking Union Medical College Hospital',
    date: '2024-01-08',
    medications: [
      { original: '阿司匹林 100毫克', translated: 'Aspirin 100mg', frequency: 'Once daily', confidence: 98 },
      { original: '氨氯地平 5毫克', translated: 'Amlodipine 5mg', frequency: 'Once daily', confidence: 96 },
      { original: '二甲双胍 500毫克', translated: 'Metformin 500mg', frequency: 'Twice daily', confidence: 97 },
    ],
    allergies: [],
    conditions: [
      { original: '高血压', translated: 'Hypertension', status: 'Managed', confidence: 99 },
      { original: '2型糖尿病', translated: 'Type 2 Diabetes', status: 'Managed', confidence: 98 },
    ],
    labResults: [
      { test: 'Total Cholesterol', value: '5.8 mmol/L', reference: '<5.2 mmol/L', flag: 'high' },
    ],
  },
}

export default function AIScanPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)
  const [currentStage, setCurrentStage] = useState(-1)
  const [extraction, setExtraction] = useState<typeof DEMO_EXTRACTIONS.arabic | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [addedToWallet, setAddedToWallet] = useState<Set<string>>(new Set())
  const fileInputRef = useRef<HTMLInputElement>(null)

  const stages = [
    { id: 'detect', label: 'Detecting document type...', duration: 1200, result: '' },
    { id: 'language', label: 'Identifying language...', duration: 1000, result: '' },
    { id: 'ocr', label: 'Extracting text with OCR...', duration: 1500, result: '' },
    { id: 'translate', label: 'Translating to English...', duration: 1800, result: '' },
    { id: 'parse', label: 'Parsing medical information...', duration: 1400, result: '' },
    { id: 'validate', label: 'Validating drug names & dosages...', duration: 1200, result: '' },
    { id: 'structure', label: 'Structuring data for ATLAS...', duration: 800, result: '' },
  ]

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
      setScanComplete(false)
      setExtraction(null)
      setShowResults(false)
      setAddedToWallet(new Set())
    }
  }

  function selectDemoDocument(type: 'arabic' | 'thai' | 'chinese') {
    setFile({ name: `medical_record_${type}.pdf` } as File)
    setPreview(`/demo-${type}.png`)
    setScanComplete(false)
    setExtraction(DEMO_EXTRACTIONS[type])
    setShowResults(false)
    setAddedToWallet(new Set())
  }

  async function startScan() {
    setIsScanning(true)
    setCurrentStage(0)

    // Run through stages
    for (let i = 0; i < stages.length; i++) {
      setCurrentStage(i)
      await new Promise(r => setTimeout(r, stages[i].duration))
    }

    setCurrentStage(stages.length)
    setIsScanning(false)
    setScanComplete(true)
    
    // Show results after a brief pause
    await new Promise(r => setTimeout(r, 500))
    setShowResults(true)
    
    // Use pre-set extraction or default to arabic
    if (!extraction) {
      setExtraction(DEMO_EXTRACTIONS.arabic)
    }
  }

  function addToWallet(type: string, index: number) {
    const key = `${type}-${index}`
    setAddedToWallet(prev => new Set([...Array.from(prev), key]))
  }

  function addAllToWallet() {
    const allKeys: string[] = []
    extraction?.medications.forEach((_, i) => allKeys.push(`med-${i}`))
    extraction?.allergies.forEach((_, i) => allKeys.push(`allergy-${i}`))
    extraction?.conditions.forEach((_, i) => allKeys.push(`condition-${i}`))
    setAddedToWallet(new Set(allKeys))
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/patient/documents" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Documents
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Document Scanner</h1>
        <p className="text-slate-500">Upload medical documents in any language - AI extracts and translates everything</p>
      </div>

      <AIBanner 
        title="Medical Document AI" 
        subtitle="Supports 40+ languages • Extracts medications, allergies, conditions & lab results"
      />

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          {/* Upload Area */}
          <div className="card-premium p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Upload Document</h2>
            
            {!file ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center cursor-pointer hover:border-violet-400 hover:bg-violet-50/50 transition-all"
              >
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 font-medium mb-2">Drop your document here or click to browse</p>
                <p className="text-sm text-slate-400">Supports PDF, JPG, PNG • Max 10MB</p>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png" 
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative">
                <div className="aspect-[3/4] bg-slate-100 rounded-xl overflow-hidden relative">
                  {preview ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                      <FileImage className="w-16 h-16 text-slate-500" />
                      <p className="absolute bottom-4 text-white text-sm">{file.name}</p>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FileText className="w-16 h-16 text-slate-400" />
                    </div>
                  )}
                  
                  {/* Scanning overlay */}
                  {isScanning && (
                    <div className="absolute inset-0 bg-violet-900/80 flex items-center justify-center">
                      <div className="absolute inset-0">
                        <div className="h-1 bg-violet-400 animate-scan" />
                      </div>
                      <div className="text-center text-white z-10">
                        <Sparkles className="w-12 h-12 mx-auto mb-3 animate-pulse" />
                        <p className="font-medium">Scanning document...</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => { setFile(null); setPreview(null); setExtraction(null); setScanComplete(false); setShowResults(false); }}
                  className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-100"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            )}

            {file && !isScanning && !scanComplete && (
              <button onClick={startScan} className="btn-primary w-full mt-4">
                <Sparkles className="w-5 h-5" />
                Start AI Scan
              </button>
            )}
          </div>

          {/* Demo Documents */}
          <div className="card-premium p-6">
            <h3 className="font-semibold text-slate-900 mb-3">Try Demo Documents</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { type: 'arabic' as const, label: 'Arabic', flag: '🇦🇪' },
                { type: 'thai' as const, label: 'Thai', flag: '🇹🇭' },
                { type: 'chinese' as const, label: 'Chinese', flag: '🇨🇳' },
              ].map(doc => (
                <button 
                  key={doc.type}
                  onClick={() => selectDemoDocument(doc.type)}
                  className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-center"
                >
                  <span className="text-2xl mb-2 block">{doc.flag}</span>
                  <span className="text-sm font-medium text-slate-700">{doc.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Scanning Progress */}
          {(isScanning || scanComplete) && (
            <div className="card-premium p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Processing Status</h3>
              <AIStageProgress stages={stages} currentStage={currentStage} />
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {showResults && extraction ? (
            <>
              {/* Summary Card */}
              <div className="card-premium p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Scan Complete</h3>
                      <p className="text-sm text-slate-600">{extraction.documentType}</p>
                    </div>
                  </div>
                  <AIConfidence score={97} size="md" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-white/60 rounded-lg">
                    <p className="text-slate-500">Language</p>
                    <p className="font-semibold text-slate-900 flex items-center gap-2">
                      <Languages className="w-4 h-4" /> {extraction.language}
                    </p>
                  </div>
                  <div className="p-3 bg-white/60 rounded-lg">
                    <p className="text-slate-500">Source</p>
                    <p className="font-semibold text-slate-900">{extraction.sourceCountry}</p>
                  </div>
                  <div className="p-3 bg-white/60 rounded-lg col-span-2">
                    <p className="text-slate-500">Facility</p>
                    <p className="font-semibold text-slate-900">{extraction.facility}</p>
                  </div>
                </div>

                <button onClick={addAllToWallet} className="btn-primary w-full mt-4">
                  <Plus className="w-5 h-5" />
                  Add All to Health Wallet
                </button>
              </div>

              {/* Medications */}
              {extraction.medications.length > 0 && (
                <div className="card-premium p-6">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Pill className="w-5 h-5 text-blue-500" />
                    Medications Found ({extraction.medications.length})
                  </h3>
                  <div className="space-y-3">
                    {extraction.medications.map((med, i) => (
                      <div key={i} className="p-4 bg-blue-50 rounded-xl">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-xs text-blue-600 font-mono mb-1">{med.original}</p>
                            <p className="font-bold text-slate-900">{med.translated}</p>
                            <p className="text-sm text-slate-600">{med.frequency}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-emerald-600 font-medium">{med.confidence}%</span>
                            {addedToWallet.has(`med-${i}`) ? (
                              <span className="badge badge-verified"><CheckCircle2 className="w-3 h-3" /> Added</span>
                            ) : (
                              <button onClick={() => addToWallet('med', i)} className="btn-ghost btn-sm">
                                <Plus className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Allergies */}
              {extraction.allergies.length > 0 && (
                <div className="card-premium p-6">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                    Allergies Found ({extraction.allergies.length})
                  </h3>
                  <div className="space-y-3">
                    {extraction.allergies.map((allergy, i) => (
                      <div key={i} className={`p-4 rounded-xl ${
                        allergy.severity === 'SEVERE' ? 'bg-rose-100 border-2 border-rose-300' : 'bg-amber-50'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-xs text-rose-600 font-mono mb-1">{allergy.original}</p>
                            <p className="font-bold text-slate-900">{allergy.translated}</p>
                            <span className={`badge mt-2 ${
                              allergy.severity === 'SEVERE' ? 'badge-emergency' : 'badge-gold'
                            }`}>
                              {allergy.severity}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-emerald-600 font-medium">{allergy.confidence}%</span>
                            {addedToWallet.has(`allergy-${i}`) ? (
                              <span className="badge badge-verified"><CheckCircle2 className="w-3 h-3" /> Added</span>
                            ) : (
                              <button onClick={() => addToWallet('allergy', i)} className="btn-ghost btn-sm">
                                <Plus className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Conditions */}
              {extraction.conditions.length > 0 && (
                <div className="card-premium p-6">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-violet-500" />
                    Conditions Found ({extraction.conditions.length})
                  </h3>
                  <div className="space-y-3">
                    {extraction.conditions.map((condition, i) => (
                      <div key={i} className="p-4 bg-violet-50 rounded-xl">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-xs text-violet-600 font-mono mb-1">{condition.original}</p>
                            <p className="font-bold text-slate-900">{condition.translated}</p>
                            <p className="text-sm text-slate-600">Status: {condition.status}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-emerald-600 font-medium">{condition.confidence}%</span>
                            {addedToWallet.has(`condition-${i}`) ? (
                              <span className="badge badge-verified"><CheckCircle2 className="w-3 h-3" /> Added</span>
                            ) : (
                              <button onClick={() => addToWallet('condition', i)} className="btn-ghost btn-sm">
                                <Plus className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="card-premium p-12 text-center">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Document Scanned</h3>
              <p className="text-slate-500">Upload a medical document or try a demo to see AI extraction in action</p>
            </div>
          )}
        </div>
      </div>

      {/* Custom animation styles */}
      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
