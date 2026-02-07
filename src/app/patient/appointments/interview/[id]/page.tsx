'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Shield,
  Clock,
  Mic,
  MicOff,
  Pause,
  Play,
  PhoneOff,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Edit3,
  Send,
  Save,
  Lock,
  Bell,
  X,
  Check,
  ArrowLeft,
  Pill,
  Heart,
  Stethoscope,
  Plane,
  ClipboardList,
  FileCheck,
  CircleDot,
} from 'lucide-react'

// ============================================================
// INTERVIEW SCRIPT DATA
// ============================================================

interface InterviewStep {
  section: number
  sectionTitle: string
  aiText: string
  responses?: { label: string; value: string; action?: 'next' | 'input' | 'end' }[]
  autoAdvance?: boolean
}

const interviewScript: InterviewStep[] = [
  // Section 1 -- Introduction
  {
    section: 1,
    sectionTitle: 'Identity Verification',
    aiText: "Hello Muhammad. I'm your ATLAS intake assistant. I'll be helping you prepare for your upcoming visit to NovaMed Tourism Clinic on February 15th. This will take about 10 to 15 minutes. Let's begin with confirming your identity.",
    autoAdvance: true,
  },
  {
    section: 1,
    sectionTitle: 'Identity Verification',
    aiText: 'Can you confirm your date of birth?',
    responses: [
      { label: 'March 15, 1987', value: 'confirmed_dob', action: 'next' },
      { label: "That's incorrect", value: 'incorrect_dob', action: 'next' },
    ],
  },
  // Section 2 -- Allergies
  {
    section: 2,
    sectionTitle: 'Allergy Review',
    aiText: 'I have two allergies on file. First, a severe allergy to Penicillin with an anaphylaxis reaction. Is this still accurate?',
    responses: [
      { label: 'Yes, confirmed', value: 'confirmed', action: 'next' },
      { label: 'Needs update', value: 'needs_update', action: 'next' },
    ],
  },
  {
    section: 2,
    sectionTitle: 'Allergy Review',
    aiText: 'Second, a moderate allergy to Sulfonamides causing a rash. Is this correct?',
    responses: [
      { label: 'Yes, confirmed', value: 'confirmed', action: 'next' },
      { label: 'Needs update', value: 'needs_update', action: 'next' },
    ],
  },
  {
    section: 2,
    sectionTitle: 'Allergy Review',
    aiText: 'Do you have any new allergies to report since your last update?',
    responses: [
      { label: 'No new allergies', value: 'none', action: 'next' },
      { label: 'Yes, add new', value: 'add_new', action: 'input' },
    ],
  },
  // Section 3 -- Medications
  {
    section: 3,
    sectionTitle: 'Medication Review',
    aiText: "Let's review your medications. I have Metformin 500mg twice daily for diabetes. Still taking this?",
    responses: [
      { label: 'Yes, same dosage', value: 'confirmed', action: 'next' },
      { label: 'Dosage changed', value: 'changed', action: 'next' },
      { label: 'No longer taking', value: 'stopped', action: 'next' },
    ],
  },
  {
    section: 3,
    sectionTitle: 'Medication Review',
    aiText: 'Lisinopril 10mg daily for blood pressure?',
    responses: [
      { label: 'Yes, same dosage', value: 'confirmed', action: 'next' },
      { label: 'Dosage changed', value: 'changed', action: 'next' },
      { label: 'No longer taking', value: 'stopped', action: 'next' },
    ],
  },
  {
    section: 3,
    sectionTitle: 'Medication Review',
    aiText: 'Atorvastatin 20mg daily for cholesterol?',
    responses: [
      { label: 'Yes, same dosage', value: 'confirmed', action: 'next' },
      { label: 'Dosage changed', value: 'changed', action: 'next' },
      { label: 'No longer taking', value: 'stopped', action: 'next' },
    ],
  },
  {
    section: 3,
    sectionTitle: 'Medication Review',
    aiText: 'Any new medications since your last update?',
    responses: [
      { label: 'No new medications', value: 'none', action: 'next' },
      { label: 'Yes, add new', value: 'add_new', action: 'input' },
    ],
  },
  // Section 4 -- Conditions
  {
    section: 4,
    sectionTitle: 'Conditions Review',
    aiText: 'You have Type 2 Diabetes on record, diagnosed 2020. Any changes in management?',
    responses: [
      { label: 'No changes', value: 'confirmed', action: 'next' },
      { label: 'Updated management', value: 'updated', action: 'next' },
    ],
  },
  {
    section: 4,
    sectionTitle: 'Conditions Review',
    aiText: 'Hypertension, diagnosed 2018. Still being treated?',
    responses: [
      { label: 'Yes, still active', value: 'confirmed', action: 'next' },
      { label: 'Resolved/changed', value: 'changed', action: 'next' },
    ],
  },
  {
    section: 4,
    sectionTitle: 'Conditions Review',
    aiText: 'Any new conditions or diagnoses?',
    responses: [
      { label: 'None', value: 'none', action: 'next' },
      { label: 'Yes, add new', value: 'add_new', action: 'input' },
    ],
  },
  // Section 5 -- Surgical History
  {
    section: 5,
    sectionTitle: 'Surgical History',
    aiText: 'I have one prior surgery -- an appendectomy in 2023 at Dubai Hospital. Any surgeries since then?',
    responses: [
      { label: 'No new surgeries', value: 'none', action: 'next' },
      { label: 'Yes, add new', value: 'add_new', action: 'input' },
    ],
  },
  // Section 6 -- Pre-Procedure
  {
    section: 6,
    sectionTitle: 'Pre-Procedure Questions',
    aiText: 'A few questions specific to your upcoming rhinoplasty procedure.',
    autoAdvance: true,
  },
  {
    section: 6,
    sectionTitle: 'Pre-Procedure Questions',
    aiText: 'Have you taken any blood thinners, aspirin, or anti-inflammatory medications in the past two weeks?',
    responses: [
      { label: 'No', value: 'no', action: 'next' },
      { label: 'Yes', value: 'yes', action: 'next' },
    ],
  },
  {
    section: 6,
    sectionTitle: 'Pre-Procedure Questions',
    aiText: 'Do you smoke or use tobacco products?',
    responses: [
      { label: 'No', value: 'no', action: 'next' },
      { label: 'Yes -- currently', value: 'yes_current', action: 'next' },
      { label: 'Former smoker', value: 'former', action: 'next' },
    ],
  },
  {
    section: 6,
    sectionTitle: 'Pre-Procedure Questions',
    aiText: 'Have you had any anesthesia reactions in past procedures?',
    responses: [
      { label: 'No known reactions', value: 'no', action: 'next' },
      { label: 'Yes -- had a reaction', value: 'yes', action: 'next' },
    ],
  },
  // Section 7 -- Summary
  {
    section: 7,
    sectionTitle: 'Summary',
    aiText: "Thank you Muhammad. I've compiled your responses into a pre-visit file. Let me summarize the key findings.",
    autoAdvance: true,
  },
  {
    section: 7,
    sectionTitle: 'Summary',
    aiText: 'All allergies confirmed. All medications confirmed with no dosage changes. No new conditions. No surgical history changes. No blood thinner use. Non-smoker. No anesthesia reactions.',
    autoAdvance: true,
  },
  {
    section: 7,
    sectionTitle: 'Summary',
    aiText: 'You can now review and edit this file before sending it to NovaMed Clinic.',
    responses: [
      { label: 'Review My File', value: 'review', action: 'end' },
    ],
  },
]

const totalSections = 7

// ============================================================
// CHECKLIST ITEMS FOR WAITING ROOM
// ============================================================

const checklistItems = [
  { label: 'Identity Confirmation', icon: Shield },
  { label: 'Allergies Review', icon: AlertCircle },
  { label: 'Medications Review', icon: Pill },
  { label: 'Conditions & Surgeries', icon: Heart },
  { label: 'Travel Health', icon: Plane },
  { label: 'Pre-Procedure Questions', icon: ClipboardList },
  { label: 'Summary', icon: FileCheck },
]

// ============================================================
// COMPONENTS
// ============================================================

function WaveformBars({ active }: { active: boolean }) {
  return (
    <div className="flex items-end justify-center gap-1 h-8">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className={`waveform-bar ${active ? 'active' : ''}`}
          style={{
            height: active ? undefined : '4px',
            backgroundColor: active ? 'rgba(6, 182, 174, 0.8)' : undefined,
          }}
        />
      ))}
    </div>
  )
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

// ============================================================
// MAIN PAGE
// ============================================================

type Phase = 'waiting' | 'interview' | 'review'

interface TranscriptEntry {
  speaker: 'ai' | 'patient'
  text: string
}

export default function InterviewExperiencePage() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('waiting')
  const [currentStep, setCurrentStep] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showResponses, setShowResponses] = useState(false)
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([])
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [showInputForm, setShowInputForm] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [responses, setResponses] = useState<Record<number, string>>({})
  const [interviewComplete, setInterviewComplete] = useState(false)

  // Review phase state
  const [updateWallet, setUpdateWallet] = useState(true)
  const [shareCategories, setShareCategories] = useState({
    allergies: true,
    medications: true,
    conditions: true,
    surgeries: true,
    preProcedure: true,
  })
  const [shareDuration, setShareDuration] = useState('30')
  const [notifyOnAccess, setNotifyOnAccess] = useState(true)
  const [sent, setSent] = useState(false)

  const transcriptRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Timer
  useEffect(() => {
    if (phase === 'interview' && !isPaused) {
      timerRef.current = setInterval(() => {
        setElapsedTime((t) => t + 1)
      }, 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [phase, isPaused])

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight
    }
  }, [transcript])

  // TTS speak function
  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        setIsSpeaking(true)
        const words = text.split(' ').length
        const duration = Math.max(2000, words * 200)
        setTimeout(() => {
          setIsSpeaking(false)
          onEnd?.()
        }, duration)
        return
      }

      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.95
      utterance.pitch = 1.0
      utterance.volume = isMuted ? 0 : 1.0

      const voices = window.speechSynthesis.getVoices()
      const preferred = voices.find(
        (v) =>
          v.name.includes('Samantha') ||
          v.name.includes('Google UK English Female') ||
          (v.name.includes('English') && v.name.includes('Female'))
      )
      if (preferred) utterance.voice = preferred

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => {
        setIsSpeaking(false)
        onEnd?.()
      }
      utterance.onerror = () => {
        setIsSpeaking(false)
        onEnd?.()
      }

      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
    },
    [isMuted]
  )

  // Play current step
  const playStep = useCallback(
    (stepIndex: number) => {
      if (stepIndex >= interviewScript.length) return

      const step = interviewScript[stepIndex]
      setShowResponses(false)
      setShowInputForm(false)

      setTranscript((prev) => [...prev, { speaker: 'ai', text: step.aiText }])

      speak(step.aiText, () => {
        if (step.autoAdvance) {
          setTimeout(() => {
            const next = stepIndex + 1
            if (next < interviewScript.length) {
              setCurrentStep(next)
              playStep(next)
            }
          }, 1200)
        } else {
          setShowResponses(true)
        }
      })
    },
    [speak]
  )

  // Start interview
  const startInterview = useCallback(() => {
    setPhase('interview')
    setCurrentStep(0)
    setTranscript([])
    setElapsedTime(0)
    setTimeout(() => {
      playStep(0)
    }, 800)
  }, [playStep])

  // Handle response selection
  const handleResponse = useCallback(
    (responseLabel: string, responseValue: string, action?: string) => {
      setTranscript((prev) => [...prev, { speaker: 'patient', text: responseLabel }])
      setShowResponses(false)
      setResponses((prev) => ({ ...prev, [currentStep]: responseValue }))

      if (action === 'input') {
        setShowInputForm(true)
        return
      }

      if (action === 'end') {
        setInterviewComplete(true)
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.cancel()
        }
        setTimeout(() => {
          setPhase('review')
        }, 600)
        return
      }

      setTimeout(() => {
        const next = currentStep + 1
        if (next < interviewScript.length) {
          setCurrentStep(next)
          playStep(next)
        }
      }, 600)
    },
    [currentStep, playStep]
  )

  // Handle input form submit
  const handleInputSubmit = useCallback(() => {
    if (!inputValue.trim()) return
    setTranscript((prev) => [...prev, { speaker: 'patient', text: `Added: ${inputValue}` }])
    setShowInputForm(false)
    setInputValue('')

    setTimeout(() => {
      const next = currentStep + 1
      if (next < interviewScript.length) {
        setCurrentStep(next)
        playStep(next)
      }
    }, 600)
  }, [currentStep, inputValue, playStep])

  // End interview early
  const endInterview = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
    setPhase('review')
  }, [])

  // Toggle pause
  const togglePause = useCallback(() => {
    if (isPaused) {
      setIsPaused(false)
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.resume()
      }
    } else {
      setIsPaused(true)
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.pause()
      }
    }
  }, [isPaused])

  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted((m) => !m)
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const currentSection = currentStep < interviewScript.length ? interviewScript[currentStep].section : totalSections
  const currentSectionTitle = currentStep < interviewScript.length ? interviewScript[currentStep].sectionTitle : 'Complete'
  const progressPercent = Math.round((currentSection / totalSections) * 100)

  // ============================================================
  // PHASE 1: WAITING ROOM (LIGHTENED)
  // ============================================================
  if (phase === 'waiting') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="max-w-lg w-full mx-4 animate-fade-in">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-atlas-400 to-atlas-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">Atlas</span>
          </div>

          {/* Greeting */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Hello Muhammad, let&apos;s prepare for your visit
            </h1>
            <p className="text-slate-500 text-sm">Pre-Visit Intake Interview</p>
          </div>

          {/* Clinic Info Card */}
          <div className="card-premium p-5 mb-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-400 w-20">Clinic</span>
                <span className="text-sm text-slate-700">NovaMed Tourism Clinic</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-400 w-20">Procedure</span>
                <span className="text-sm text-slate-700">Cosmetic Surgery (Rhinoplasty)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-400 w-20">Visit Date</span>
                <span className="text-sm text-slate-700">February 15, 2026</span>
              </div>
            </div>
          </div>

          {/* Duration Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-atlas-50 text-atlas-700 rounded-full text-sm font-medium border border-atlas-200">
              <Clock className="w-4 h-4" />
              Estimated time: ~12 minutes
            </span>
          </div>

          {/* Checklist */}
          <div className="card-premium p-5 mb-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">What we&apos;ll cover</h3>
            <div className="space-y-2.5">
              {checklistItems.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full border-2 border-slate-200 flex items-center justify-center flex-shrink-0">
                    <CircleDot className="w-3 h-3 text-slate-300" />
                  </div>
                  <item.icon className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Preparation Tip */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-800 flex items-center gap-2">
              <Pill className="w-4 h-4 flex-shrink-0" />
              <span><strong>Tip:</strong> Have your current medication list handy for a smoother review.</span>
            </p>
          </div>

          {/* Security Notice */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-6">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure, encrypted session. Your data stays private.</span>
          </div>

          {/* Begin Button */}
          <div className="text-center">
            <button
              onClick={startInterview}
              className="inline-flex items-center justify-center gap-2 px-10 py-3 font-medium rounded-xl transition-all duration-200 text-white text-base"
              style={{
                background: 'linear-gradient(135deg, #0c8ee9 0%, #0070c7 100%)',
                boxShadow: '0 4px 14px rgba(12, 142, 233, 0.3)',
              }}
            >
              Begin Interview
            </button>

            <button
              onClick={() => router.push('/patient/appointments')}
              className="block mx-auto mt-4 text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              Cancel and return
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ============================================================
  // PHASE 2: VOICE INTERVIEW (SOFTENED)
  // ============================================================
  if (phase === 'interview') {
    const step = currentStep < interviewScript.length ? interviewScript[currentStep] : null

    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-slate-800">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 lg:px-8 py-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-atlas-400 to-atlas-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-white tracking-wide uppercase hidden sm:inline">
              Atlas Intake Interview
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm text-slate-400">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{formatTime(elapsedTime)}</span>
            </div>
            <span className="text-sm text-slate-500 hidden sm:inline">NovaMed Tourism Clinic</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Center: Avatar + Question */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 lg:py-0">
            {/* AI Avatar */}
            <div className="relative mb-6">
              <div
                className="w-24 h-24 lg:w-28 lg:h-28 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #06c6ae 0%, #068074 100%)',
                  boxShadow: isSpeaking
                    ? '0 0 40px rgba(6, 198, 174, 0.4), 0 0 80px rgba(6, 198, 174, 0.2)'
                    : '0 0 20px rgba(6, 198, 174, 0.2)',
                  transition: 'box-shadow 0.3s ease',
                }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L12 6" />
                  <path d="M12 18L12 22" />
                  <path d="M4.93 4.93L7.76 7.76" />
                  <path d="M16.24 16.24L19.07 19.07" />
                  <path d="M2 12L6 12" />
                  <path d="M18 12L22 12" />
                  <path d="M4.93 19.07L7.76 16.24" />
                  <path d="M16.24 7.76L19.07 4.93" />
                </svg>
              </div>
              {isSpeaking && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-medical-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-medical-500"></span>
                  </span>
                </div>
              )}
            </div>

            {/* Waveform */}
            <div className="mb-6">
              <WaveformBars active={isSpeaking} />
            </div>

            {/* Current Question */}
            {step && (
              <div className="text-center max-w-xl mb-8 px-4">
                <p className="text-xl lg:text-2xl text-white font-medium leading-relaxed animate-fade-in">
                  {step.aiText}
                </p>
              </div>
            )}

            {/* Response Buttons */}
            {showResponses && step?.responses && (
              <div className="flex flex-wrap justify-center gap-3 mb-6 px-4 animate-fade-in">
                {step.responses.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => handleResponse(r.label, r.value, r.action)}
                    className="px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 border border-slate-600 text-white hover:bg-slate-700 hover:border-slate-500 hover:-translate-y-0.5"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            {showInputForm && (
              <div className="w-full max-w-md px-4 animate-fade-in">
                <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-4">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
                    placeholder="Enter details..."
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-medical-500 text-sm"
                    autoFocus
                  />
                  <div className="flex gap-2 mt-3">
                    <button onClick={handleInputSubmit} className="btn-primary btn-sm flex-1">
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowInputForm(false)
                        setInputValue('')
                        setTimeout(() => {
                          const next = currentStep + 1
                          if (next < interviewScript.length) {
                            setCurrentStep(next)
                            playStep(next)
                          }
                        }, 300)
                      }}
                      className="px-4 py-1.5 text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      Skip
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Progress */}
            <div className="w-full max-w-sm px-4 mt-auto lg:mt-8">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Section {currentSection} of {totalSections}</span>
                <span>{currentSectionTitle}</span>
              </div>
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${progressPercent}%`,
                    background: 'linear-gradient(90deg, #06c6ae 0%, #1fe2c8 100%)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Side: Transcript */}
          <div className="lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l border-slate-700 flex flex-col max-h-[30vh] lg:max-h-none bg-slate-750" style={{ background: '#283548' }}>
            <div className="px-4 py-3 border-b border-slate-700">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Transcript</h3>
            </div>
            <div ref={transcriptRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {transcript.map((entry, i) => (
                <div key={i} className={`flex gap-2 ${entry.speaker === 'patient' ? 'justify-end' : ''}`}>
                  {entry.speaker === 'ai' && (
                    <div className="w-6 h-6 rounded-full bg-medical-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Shield className="w-3 h-3 text-medical-400" />
                    </div>
                  )}
                  <div
                    className={`text-sm leading-relaxed max-w-[85%] px-3 py-2 rounded-lg ${
                      entry.speaker === 'ai'
                        ? 'text-slate-200 bg-slate-700/50'
                        : 'text-medical-200 bg-medical-500/20 ml-auto'
                    }`}
                  >
                    {entry.text}
                  </div>
                </div>
              ))}
              {isSpeaking && (
                <div className="flex gap-2 items-center">
                  <div className="w-6 h-6 rounded-full bg-medical-500/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-3 h-3 text-medical-400" />
                  </div>
                  <div className="ai-dots flex gap-1 text-medical-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
                    <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
                    <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="flex items-center justify-center gap-4 px-4 py-4 border-t border-slate-700">
          <button
            onClick={toggleMute}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isMuted
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600 hover:text-white'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <button
            onClick={togglePause}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isPaused
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600 hover:text-white'
            }`}
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          </button>
          <button
            onClick={endInterview}
            className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center hover:bg-rose-500/30 transition-all"
            title="End Interview"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </div>
    )
  }

  // ============================================================
  // PHASE 3: REVIEW & EDIT
  // ============================================================

  const summaryData = {
    allergies: [
      { name: 'Penicillin', severity: 'Severe', reaction: 'Anaphylaxis', status: 'confirmed' as const },
      { name: 'Sulfonamides', severity: 'Moderate', reaction: 'Rash', status: 'confirmed' as const },
    ],
    medications: [
      { name: 'Metformin 500mg', frequency: 'Twice daily', purpose: 'Diabetes', status: 'confirmed' as const },
      { name: 'Lisinopril 10mg', frequency: 'Daily', purpose: 'Blood Pressure', status: 'confirmed' as const },
      { name: 'Atorvastatin 20mg', frequency: 'Daily', purpose: 'Cholesterol', status: 'confirmed' as const },
    ],
    conditions: [
      { name: 'Type 2 Diabetes', diagnosed: '2020', status: 'confirmed' as const },
      { name: 'Hypertension', diagnosed: '2018', status: 'confirmed' as const },
    ],
    surgeries: [
      { name: 'Appendectomy', year: '2023', facility: 'Dubai Hospital', status: 'confirmed' as const },
    ],
    preProcedure: [
      { question: 'Blood thinners / aspirin (past 2 weeks)', answer: 'No', status: 'confirmed' as const },
      { question: 'Tobacco use', answer: 'Non-smoker', status: 'confirmed' as const },
      { question: 'Anesthesia reactions', answer: 'No known reactions', status: 'confirmed' as const },
    ],
  }

  type StatusType = 'confirmed' | 'changed' | 'new'

  function StatusIcon({ status }: { status: StatusType }) {
    if (status === 'new') return <PlusCircle className="w-4 h-4 text-rose-500" />
    if (status === 'changed') return <AlertCircle className="w-4 h-4 text-amber-500" />
    return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
  }

  function StatusLabel({ status }: { status: StatusType }) {
    if (status === 'new') return <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">NEW</span>
    if (status === 'changed') return <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">CHANGED</span>
    return <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">CONFIRMED</span>
  }

  if (sent) {
    return (
      <div className="p-6 lg:p-10 max-w-3xl mx-auto">
        <div className="card-premium p-12 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Intake File Sent</h2>
          <p className="text-slate-600 mb-2">
            Your intake file has been sent to <strong>NovaMed Tourism Clinic</strong>.
          </p>
          <p className="text-sm text-slate-500 mb-8">
            You will be notified when the clinic reviews your file.
          </p>
          <div className="bg-slate-50 rounded-xl p-4 mb-8 text-sm text-slate-600">
            <div className="flex items-center justify-between mb-2">
              <span>Access duration</span>
              <span className="font-medium">{shareDuration} days</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Access notifications</span>
              <span className="font-medium">{notifyOnAccess ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
          <button
            onClick={() => router.push('/patient/appointments')}
            className="btn-primary"
          >
            Return to Appointments
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.push('/patient/appointments')}
          className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Intake Summary</h1>
          <p className="text-sm text-slate-500">Ready for Review -- NovaMed Tourism Clinic</p>
        </div>
      </div>

      {/* Flagged Items Overview */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card-premium p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-2xl font-bold text-slate-900">
              {summaryData.allergies.filter(a => a.status === 'confirmed').length +
                summaryData.medications.filter(m => m.status === 'confirmed').length +
                summaryData.conditions.filter(c => c.status === 'confirmed').length +
                summaryData.surgeries.filter(s => s.status === 'confirmed').length +
                summaryData.preProcedure.filter(p => p.status === 'confirmed').length}
            </span>
          </div>
          <span className="text-xs text-slate-500">Confirmed</span>
        </div>
        <div className="card-premium p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span className="text-2xl font-bold text-slate-900">0</span>
          </div>
          <span className="text-xs text-slate-500">Changed</span>
        </div>
        <div className="card-premium p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <PlusCircle className="w-4 h-4 text-rose-500" />
            <span className="text-2xl font-bold text-slate-900">0</span>
          </div>
          <span className="text-xs text-slate-500">New</span>
        </div>
      </div>

      {/* Summary Sections */}
      <div className="space-y-6 mb-8">
        {/* Allergies */}
        <div className="card-premium overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Allergies
            </h3>
            <span className="text-xs text-slate-500">{summaryData.allergies.length} items</span>
          </div>
          <div className="divide-y divide-slate-100">
            {summaryData.allergies.map((item, i) => (
              <div key={i} className="px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <StatusIcon status={item.status} />
                  <div>
                    <span className="text-sm font-medium text-slate-900">{item.name}</span>
                    <span className="text-xs text-slate-500 ml-2">{item.severity} -- {item.reaction}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusLabel status={item.status} />
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medications */}
        <div className="card-premium overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Medications
            </h3>
            <span className="text-xs text-slate-500">{summaryData.medications.length} items</span>
          </div>
          <div className="divide-y divide-slate-100">
            {summaryData.medications.map((item, i) => (
              <div key={i} className="px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <StatusIcon status={item.status} />
                  <div>
                    <span className="text-sm font-medium text-slate-900">{item.name}</span>
                    <span className="text-xs text-slate-500 ml-2">{item.frequency} -- {item.purpose}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusLabel status={item.status} />
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conditions */}
        <div className="card-premium overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-500" />
              Conditions
            </h3>
            <span className="text-xs text-slate-500">{summaryData.conditions.length} items</span>
          </div>
          <div className="divide-y divide-slate-100">
            {summaryData.conditions.map((item, i) => (
              <div key={i} className="px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <StatusIcon status={item.status} />
                  <div>
                    <span className="text-sm font-medium text-slate-900">{item.name}</span>
                    <span className="text-xs text-slate-500 ml-2">Diagnosed {item.diagnosed}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusLabel status={item.status} />
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Surgical History */}
        <div className="card-premium overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Surgical History
            </h3>
            <span className="text-xs text-slate-500">{summaryData.surgeries.length} items</span>
          </div>
          <div className="divide-y divide-slate-100">
            {summaryData.surgeries.map((item, i) => (
              <div key={i} className="px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <StatusIcon status={item.status} />
                  <div>
                    <span className="text-sm font-medium text-slate-900">{item.name}</span>
                    <span className="text-xs text-slate-500 ml-2">{item.year} -- {item.facility}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusLabel status={item.status} />
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pre-Procedure */}
        <div className="card-premium overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              Pre-Procedure Screening
            </h3>
            <span className="text-xs text-slate-500">{summaryData.preProcedure.length} items</span>
          </div>
          <div className="divide-y divide-slate-100">
            {summaryData.preProcedure.map((item, i) => (
              <div key={i} className="px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <StatusIcon status={item.status} />
                  <div>
                    <span className="text-sm font-medium text-slate-900">{item.question}</span>
                    <span className="text-xs text-slate-500 ml-2">{item.answer}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusLabel status={item.status} />
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Update Wallet Checkbox */}
      <div className="card-premium p-5 mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={updateWallet}
            onChange={(e) => setUpdateWallet(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-atlas-600 focus:ring-atlas-500"
          />
          <span className="text-sm font-medium text-slate-900">
            Update my ATLAS health wallet with these changes
          </span>
        </label>
      </div>

      {/* Consent / Sharing Section */}
      <div className="card-premium p-6 mb-8">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4 text-slate-400" />
          Share with NovaMed Tourism Clinic
        </h3>
        <div className="space-y-3 mb-5">
          {Object.entries(shareCategories).map(([key, value]) => {
            const labels: Record<string, string> = {
              allergies: 'Allergies',
              medications: 'Medications',
              conditions: 'Conditions',
              surgeries: 'Surgical History',
              preProcedure: 'Pre-Procedure Screening',
            }
            return (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setShareCategories((prev) => ({ ...prev, [key]: e.target.checked }))}
                  className="w-4 h-4 rounded border-slate-300 text-atlas-600 focus:ring-atlas-500"
                />
                <span className="text-sm text-slate-700">{labels[key]}</span>
              </label>
            )
          })}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="text-xs font-medium text-slate-500 mb-1 block">Access Duration</label>
            <select
              value={shareDuration}
              onChange={(e) => setShareDuration(e.target.value)}
              className="input text-sm"
            >
              <option value="7">7 days</option>
              <option value="14">14 days</option>
              <option value="30">30 days (recommended for medical tourism)</option>
              <option value="60">60 days</option>
              <option value="90">90 days</option>
            </select>
          </div>
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={notifyOnAccess}
            onChange={(e) => setNotifyOnAccess(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-atlas-600 focus:ring-atlas-500"
          />
          <span className="text-sm text-slate-700 flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-slate-400" />
            Notify me when clinic accesses this data
          </span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={() => setSent(true)} className="btn-primary btn-lg flex-1 gap-2">
          <Send className="w-4 h-4" />
          Send to NovaMed Clinic
        </button>
        <button
          onClick={() => router.push('/patient/appointments')}
          className="btn-secondary btn-lg gap-2"
        >
          <Save className="w-4 h-4" />
          Save Draft
        </button>
      </div>
    </div>
  )
}
