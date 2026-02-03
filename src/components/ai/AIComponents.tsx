'use client'

import { useState, useEffect, useCallback } from 'react'
import { Sparkles, Brain, Loader2, CheckCircle2, AlertTriangle, Zap } from 'lucide-react'

// ============ AI TYPING EFFECT HOOK ============
export function useAITyping() {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const typeText = useCallback(async (text: string, speed: number = 20) => {
    setIsTyping(true)
    setIsComplete(false)
    setDisplayedText('')
    
    for (let i = 0; i < text.length; i++) {
      await new Promise(r => setTimeout(r, speed))
      setDisplayedText(text.slice(0, i + 1))
    }
    
    setIsTyping(false)
    setIsComplete(true)
  }, [])

  const reset = useCallback(() => {
    setDisplayedText('')
    setIsTyping(false)
    setIsComplete(false)
  }, [])

  return { displayedText, isTyping, isComplete, typeText, reset }
}

// ============ AI STREAMING STAGES HOOK ============
interface AIStage {
  id: string
  label: string
  duration: number
  result?: string
}

export function useAIStages() {
  const [currentStage, setCurrentStage] = useState(-1)
  const [stages, setStages] = useState<AIStage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const runStages = useCallback(async (stageList: AIStage[]) => {
    setStages(stageList)
    setIsProcessing(true)
    setIsComplete(false)
    setCurrentStage(0)

    for (let i = 0; i < stageList.length; i++) {
      setCurrentStage(i)
      await new Promise(r => setTimeout(r, stageList[i].duration))
    }

    setCurrentStage(stageList.length)
    setIsProcessing(false)
    setIsComplete(true)
  }, [])

  const reset = useCallback(() => {
    setCurrentStage(-1)
    setStages([])
    setIsProcessing(false)
    setIsComplete(false)
  }, [])

  return { currentStage, stages, isProcessing, isComplete, runStages, reset }
}

// ============ AI THINKING INDICATOR ============
export function AIThinking({ label = 'Analyzing...' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-violet-600">
      <div className="relative">
        <Brain className="w-5 h-5 animate-pulse" />
        <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-amber-500 animate-ping" />
      </div>
      <span className="text-sm font-medium">{label}</span>
      <div className="flex gap-1">
        <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}

// ============ AI STAGE PROGRESS ============
export function AIStageProgress({ stages, currentStage }: { stages: AIStage[], currentStage: number }) {
  return (
    <div className="space-y-3">
      {stages.map((stage, i) => (
        <div key={stage.id} className="flex items-center gap-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
            i < currentStage 
              ? 'bg-emerald-500 text-white' 
              : i === currentStage 
                ? 'bg-violet-500 text-white animate-pulse' 
                : 'bg-slate-200 text-slate-400'
          }`}>
            {i < currentStage ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : i === currentStage ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span className="text-xs">{i + 1}</span>
            )}
          </div>
          <div className="flex-1">
            <p className={`text-sm font-medium ${
              i <= currentStage ? 'text-slate-900' : 'text-slate-400'
            }`}>
              {stage.label}
            </p>
            {i < currentStage && stage.result && (
              <p className="text-xs text-emerald-600 mt-0.5">{stage.result}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ============ AI CONFIDENCE BADGE ============
export function AIConfidence({ score, size = 'md' }: { score: number, size?: 'sm' | 'md' | 'lg' }) {
  const getColor = () => {
    if (score >= 90) return 'from-emerald-500 to-green-500'
    if (score >= 70) return 'from-amber-500 to-yellow-500'
    return 'from-rose-500 to-red-500'
  }

  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-lg',
    lg: 'w-20 h-20 text-2xl',
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${getColor()} flex items-center justify-center text-white font-bold shadow-lg`}>
      {score}%
    </div>
  )
}

// ============ AI RESULT CARD ============
export function AIResultCard({ 
  type, 
  title, 
  children,
  icon
}: { 
  type: 'success' | 'warning' | 'danger' | 'info'
  title: string
  children: React.ReactNode
  icon?: React.ReactNode
}) {
  const styles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    danger: 'bg-rose-50 border-rose-200 text-rose-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }

  const iconStyles = {
    success: 'bg-emerald-100 text-emerald-600',
    warning: 'bg-amber-100 text-amber-600',
    danger: 'bg-rose-100 text-rose-600',
    info: 'bg-blue-100 text-blue-600',
  }

  const defaultIcons = {
    success: <CheckCircle2 className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    danger: <AlertTriangle className="w-5 h-5" />,
    info: <Zap className="w-5 h-5" />,
  }

  return (
    <div className={`p-4 rounded-xl border-2 ${styles[type]}`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg ${iconStyles[type]} flex items-center justify-center flex-shrink-0`}>
          {icon || defaultIcons[type]}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold mb-1">{title}</h4>
          <div className="text-sm opacity-90">{children}</div>
        </div>
      </div>
    </div>
  )
}

// ============ AI STREAMING TEXT ============
export function AIStreamingText({ 
  text, 
  speed = 15,
  onComplete 
}: { 
  text: string
  speed?: number
  onComplete?: () => void
}) {
  const [displayed, setDisplayed] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let i = 0
    setDisplayed('')
    setIsComplete(false)
    
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
        setIsComplete(true)
        onComplete?.()
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed, onComplete])

  return (
    <span>
      {displayed}
      {!isComplete && <span className="inline-block w-2 h-4 bg-violet-500 animate-pulse ml-0.5" />}
    </span>
  )
}

// ============ AI HEADER BANNER ============
export function AIBanner({ 
  title = 'AI Assistant Active',
  subtitle
}: { 
  title?: string
  subtitle?: string
}) {
  return (
    <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white px-6 py-4 rounded-2xl mb-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-white rounded-full blur-2xl animate-pulse" style={{ animationDelay: '500ms' }} />
      </div>
      
      <div className="relative flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
          <Brain className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-lg flex items-center gap-2">
            {title}
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          </h3>
          {subtitle && <p className="text-white/80 text-sm">{subtitle}</p>}
        </div>
      </div>
    </div>
  )
}
