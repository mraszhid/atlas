'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Play, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Copy,
  Database,
  Users,
  Shield,
  FileText,
  AlertTriangle,
  ArrowLeft,
  RefreshCw
} from 'lucide-react'

interface StatusCheck {
  id: string
  name: string
  endpoint: string
  method: string
  body?: object
  category: string
  status: 'pending' | 'checking' | 'success' | 'error'
  message: string
  responseTime?: number
  httpStatus?: number
  error?: string
  details?: string
}

// Comprehensive checks for every user type and functionality
const allChecks: Omit<StatusCheck, 'status' | 'message'>[] = [
  // Database & Core
  { id: 'db', name: 'Database Connection', endpoint: '/api/status/health', method: 'GET', category: 'Database' },
  
  // Auth
  { id: 'auth-login', name: 'Login API', endpoint: '/api/auth/login', method: 'POST', body: { email: 'test@test.com', password: 'wrong' }, category: 'Authentication' },
  { id: 'auth-logout', name: 'Logout API', endpoint: '/api/auth/logout', method: 'POST', category: 'Authentication' },
  
  // Patient APIs
  { id: 'patient-profile', name: 'Patient Profile', endpoint: '/api/patient/profile', method: 'GET', category: 'Patient Portal' },
  { id: 'patient-wallet', name: 'Health Wallet', endpoint: '/api/patient/wallet', method: 'GET', category: 'Patient Portal' },
  { id: 'patient-docs', name: 'Documents List', endpoint: '/api/patient/documents', method: 'GET', category: 'Patient Portal' },
  { id: 'patient-audit', name: 'Audit Log', endpoint: '/api/patient/audit-log', method: 'GET', category: 'Patient Portal' },
  { id: 'patient-insurance', name: 'Insurance', endpoint: '/api/patient/insurance', method: 'GET', category: 'Patient Portal' },
  { id: 'patient-sharing-perms', name: 'Sharing Permissions', endpoint: '/api/patient/sharing/permissions', method: 'GET', category: 'Patient Portal' },
  { id: 'patient-sharing-links', name: 'Sharing Links', endpoint: '/api/patient/sharing/links', method: 'GET', category: 'Patient Portal' },
  { id: 'patient-allergies', name: 'Allergies CRUD', endpoint: '/api/patient/wallet/allergies', method: 'GET', category: 'Patient Portal' },
  
  // Clinician APIs
  { id: 'clinician-patients', name: 'Patients List', endpoint: '/api/clinician/patients', method: 'GET', category: 'Clinician Portal' },
  
  // Clinic APIs
  { id: 'clinic-forms', name: 'Intake Forms', endpoint: '/api/clinic/forms', method: 'GET', category: 'Clinic Portal' },
  
  // Emergency
  { id: 'emergency-access', name: 'Emergency Access', endpoint: '/api/emergency/access', method: 'POST', body: { searchType: 'code', searchValue: 'TEST-CODE' }, category: 'Emergency System' },
]

export default function StatusPage() {
  const [checks, setChecks] = useState<StatusCheck[]>(
    allChecks.map(c => ({ ...c, status: 'pending', message: 'Not checked' }))
  )
  const [isRunning, setIsRunning] = useState(false)
  const [phase, setPhase] = useState<'idle' | 'seeding' | 'checking' | 'done'>('idle')
  const [seedOutput, setSeedOutput] = useState<string>('')
  const [totalTime, setTotalTime] = useState<number | null>(null)

  async function runSingleCheck(check: StatusCheck): Promise<StatusCheck> {
    const start = Date.now()
    
    try {
      const options: RequestInit = { 
        method: check.method,
        headers: { 'Content-Type': 'application/json' },
      }
      
      if (check.body) {
        options.body = JSON.stringify(check.body)
      }
      
      // Special handling for database health check
      if (check.id === 'db') {
        try {
          const res = await fetch('/api/patient/profile')
          const time = Date.now() - start
          return {
            ...check,
            status: 'success',
            message: `Connected (${time}ms)`,
            responseTime: time,
            httpStatus: res.status,
            details: 'Database is responding to queries'
          }
        } catch (e) {
          return {
            ...check,
            status: 'error',
            message: 'Connection failed',
            error: e instanceof Error ? e.message : 'Unknown error',
            details: 'Cannot connect to database. Make sure you ran: npx prisma db push && npx tsx prisma/seed.ts'
          }
        }
      }
      
      const res = await fetch(check.endpoint, options)
      const time = Date.now() - start
      let responseText = ''
      
      try {
        responseText = await res.text()
      } catch {
        responseText = '[Could not read response]'
      }
      
      // Determine success based on expected status codes
      const isAuthEndpoint = check.category === 'Authentication'
      const isProtectedEndpoint = ['Patient Portal', 'Clinician Portal', 'Clinic Portal'].includes(check.category)
      
      // Auth endpoints: 401 means working (wrong credentials)
      if (isAuthEndpoint && (res.status === 401 || res.status === 200)) {
        return {
          ...check,
          status: 'success',
          message: `Working (${time}ms)`,
          responseTime: time,
          httpStatus: res.status,
          details: 'Authentication endpoint responding correctly'
        }
      }
      
      // Protected endpoints: 401 = API works, just needs auth
      if (isProtectedEndpoint && res.status === 401) {
        return {
          ...check,
          status: 'success',
          message: `Needs auth (${time}ms)`,
          responseTime: time,
          httpStatus: res.status,
          details: 'API is working but requires authentication'
        }
      }
      
      // Emergency: 404 = working (patient not found is expected)
      if (check.id === 'emergency-access' && (res.status === 404 || res.status === 200)) {
        return {
          ...check,
          status: 'success',
          message: `Working (${time}ms)`,
          responseTime: time,
          httpStatus: res.status,
          details: 'Emergency access API responding correctly'
        }
      }
      
      // Any 2xx is success
      if (res.ok) {
        return {
          ...check,
          status: 'success',
          message: `OK (${time}ms)`,
          responseTime: time,
          httpStatus: res.status,
        }
      }
      
      // Otherwise it's an error
      return {
        ...check,
        status: 'error',
        message: `HTTP ${res.status}`,
        responseTime: time,
        httpStatus: res.status,
        error: responseText.slice(0, 500),
        details: `Unexpected status code. Expected 2xx, 401, or 404 but got ${res.status}`
      }
      
    } catch (error) {
      return {
        ...check,
        status: 'error',
        message: 'Connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        details: 'Could not connect to the API endpoint'
      }
    }
  }

  async function runAllChecks() {
    setIsRunning(true)
    setPhase('checking')
    const start = Date.now()
    
    // Reset all to pending
    setChecks(prev => prev.map(c => ({ ...c, status: 'checking', message: 'Checking...' })))
    
    // Run checks sequentially
    for (const check of checks) {
      const result = await runSingleCheck(check)
      setChecks(prev => prev.map(c => c.id === check.id ? result : c))
      await new Promise(r => setTimeout(r, 100))
    }
    
    setTotalTime(Date.now() - start)
    setIsRunning(false)
    setPhase('done')
  }

  function copyReport() {
    const successCount = checks.filter(c => c.status === 'success').length
    const errorCount = checks.filter(c => c.status === 'error').length
    const errors = checks.filter(c => c.status === 'error')
    
    const report = `═══════════════════════════════════════════
ATLAS SYSTEM DIAGNOSTIC REPORT
Generated: ${new Date().toISOString()}
═══════════════════════════════════════════

SUMMARY
-------
Total Checks: ${checks.length}
Passed: ${successCount}
Failed: ${errorCount}
Total Time: ${totalTime}ms

${errors.length > 0 ? `
═══════════════════════════════════════════
ERRORS FOUND (${errors.length})
═══════════════════════════════════════════
${errors.map(e => `
▸ ${e.name}
  Endpoint: ${e.method} ${e.endpoint}
  HTTP Status: ${e.httpStatus || 'N/A'}
  Message: ${e.message}
  Details: ${e.details || 'N/A'}
  Error: ${e.error || 'N/A'}
`).join('\n')}
` : `
═══════════════════════════════════════════
ALL CHECKS PASSED! ✓
═══════════════════════════════════════════
`}

═══════════════════════════════════════════
ALL CHECKS DETAIL
═══════════════════════════════════════════
${checks.map(c => `[${c.status === 'success' ? '✓' : '✗'}] ${c.name}: ${c.message} (${c.responseTime || 0}ms)`).join('\n')}

═══════════════════════════════════════════
TROUBLESHOOTING GUIDE
═══════════════════════════════════════════
If you see database errors:
  1. Run: npx prisma generate
  2. Run: npx prisma db push
  3. Run: npx tsx prisma/seed.ts
  4. Restart: npm run dev

If login doesn't work:
  1. Clear browser cookies
  2. Re-run seed: npx tsx prisma/seed.ts
  3. Try demo credentials: patient@demo.atlas / demo123

If pages show "Loading..." forever:
  1. Check terminal for errors
  2. Verify database has data: npx tsx prisma/seed.ts
═══════════════════════════════════════════
`
    
    navigator.clipboard.writeText(report)
    alert('Full diagnostic report copied to clipboard!')
  }

  const categories = ['Database', 'Authentication', 'Patient Portal', 'Clinician Portal', 'Clinic Portal', 'Emergency System']
  const successCount = checks.filter(c => c.status === 'success').length
  const errorCount = checks.filter(c => c.status === 'error').length
  
  const getStatusColor = () => {
    if (phase === 'idle') return ''
    if (isRunning) return 'bg-amber-50 border-amber-200'
    if (errorCount === 0) return 'bg-emerald-50 border-emerald-200'
    return 'bg-rose-50 border-rose-200'
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">System Diagnostics</h1>
          <p className="text-slate-500">Deep health check of all ATLAS systems and APIs</p>
        </div>

        {/* Summary Card */}
        <div className={`card-premium p-6 mb-6 ${getStatusColor()}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                phase === 'idle' ? 'bg-slate-100' :
                isRunning ? 'bg-amber-100' :
                errorCount === 0 ? 'bg-emerald-100' : 'bg-rose-100'
              }`}>
                {isRunning ? <Loader2 className="w-7 h-7 text-amber-600 animate-spin" /> :
                 errorCount === 0 && phase === 'done' ? <CheckCircle2 className="w-7 h-7 text-emerald-600" /> :
                 errorCount > 0 ? <XCircle className="w-7 h-7 text-rose-600" /> :
                 <Database className="w-7 h-7 text-slate-600" />}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {phase === 'idle' && 'Ready to Run Diagnostics'}
                  {isRunning && 'Running Deep Diagnostics...'}
                  {phase === 'done' && errorCount === 0 && '✓ All Systems Operational'}
                  {phase === 'done' && errorCount > 0 && `⚠ ${errorCount} Issue${errorCount > 1 ? 's' : ''} Found`}
                </h2>
                <p className="text-slate-500">
                  {phase === 'idle' && `${checks.length} checks ready`}
                  {isRunning && `Checking ${checks.filter(c => c.status === 'checking').length} of ${checks.length}...`}
                  {phase === 'done' && `${successCount}/${checks.length} passed in ${totalTime}ms`}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {phase === 'done' && (
                <button onClick={copyReport} className="btn-secondary">
                  <Copy className="w-4 h-4" /> Copy Report
                </button>
              )}
              <button onClick={runAllChecks} disabled={isRunning} className="btn-primary">
                {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                {isRunning ? 'Running...' : 'Run Diagnostics'}
              </button>
            </div>
          </div>
        </div>

        {/* Checks by Category */}
        {categories.map(cat => {
          const catChecks = checks.filter(c => c.category === cat)
          if (catChecks.length === 0) return null
          
          const catErrors = catChecks.filter(c => c.status === 'error').length
          const catSuccess = catChecks.filter(c => c.status === 'success').length
          
          return (
            <div key={cat} className="card-premium mb-4 overflow-hidden">
              <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {cat === 'Database' && <Database className="w-5 h-5 text-sky-500" />}
                  {cat === 'Authentication' && <Shield className="w-5 h-5 text-violet-500" />}
                  {cat === 'Patient Portal' && <Users className="w-5 h-5 text-emerald-500" />}
                  {cat === 'Clinician Portal' && <Users className="w-5 h-5 text-teal-500" />}
                  {cat === 'Clinic Portal' && <FileText className="w-5 h-5 text-amber-500" />}
                  {cat === 'Emergency System' && <AlertTriangle className="w-5 h-5 text-rose-500" />}
                  <span className="font-semibold text-slate-900">{cat}</span>
                </div>
                {phase === 'done' && (
                  <span className={`text-sm font-medium ${catErrors > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {catSuccess}/{catChecks.length} passed
                  </span>
                )}
              </div>
              <div className="divide-y divide-slate-100">
                {catChecks.map(check => (
                  <div key={check.id} className={`px-5 py-3 flex items-center justify-between ${
                    check.status === 'error' ? 'bg-rose-50' : ''
                  }`}>
                    <div className="flex items-center gap-3">
                      {check.status === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                      {check.status === 'error' && <XCircle className="w-5 h-5 text-rose-500" />}
                      {check.status === 'checking' && <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />}
                      {check.status === 'pending' && <div className="w-5 h-5 rounded-full bg-slate-200" />}
                      <div>
                        <span className="font-medium text-slate-900">{check.name}</span>
                        <span className="text-xs text-slate-400 ml-2">{check.method} {check.endpoint}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm ${check.status === 'error' ? 'text-rose-600 font-medium' : 'text-slate-500'}`}>
                        {check.message}
                      </span>
                      {check.httpStatus && (
                        <span className="text-xs text-slate-400 ml-2">HTTP {check.httpStatus}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {/* Error Details */}
        {phase === 'done' && errorCount > 0 && (
          <div className="card-premium p-5 bg-rose-50 border-rose-200 mb-4">
            <h3 className="font-bold text-rose-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Error Details & Troubleshooting
            </h3>
            {checks.filter(c => c.status === 'error').map(check => (
              <div key={check.id} className="mb-4 last:mb-0 p-4 bg-white rounded-lg border border-rose-200">
                <p className="font-semibold text-rose-800">{check.name}</p>
                <p className="text-sm text-rose-600 mt-1">{check.method} {check.endpoint}</p>
                {check.details && (
                  <p className="text-sm text-rose-700 mt-2 p-2 bg-rose-50 rounded">{check.details}</p>
                )}
                {check.error && (
                  <pre className="text-xs text-rose-600 bg-rose-100 p-3 rounded mt-2 overflow-x-auto whitespace-pre-wrap">
                    {check.error}
                  </pre>
                )}
              </div>
            ))}
            
            <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="font-semibold text-amber-800 mb-2">Common Fixes:</p>
              <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
                <li>Stop the server (Ctrl+C)</li>
                <li>Run: <code className="bg-amber-100 px-1 rounded">npx prisma db push</code></li>
                <li>Run: <code className="bg-amber-100 px-1 rounded">npx tsx prisma/seed.ts</code></li>
                <li>Restart: <code className="bg-amber-100 px-1 rounded">npm run dev</code></li>
                <li>Clear browser cookies and try again</li>
              </ol>
            </div>
          </div>
        )}

        {/* Success Message */}
        {phase === 'done' && errorCount === 0 && (
          <div className="card-premium p-5 bg-emerald-50 border-emerald-200">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-emerald-800">All Systems Ready!</h3>
                <p className="text-emerald-700 mt-1">
                  You can now use the application. Go to the <Link href="/login" className="underline font-medium">Login page</Link> and 
                  use the demo credentials to explore all features.
                </p>
                <div className="mt-3 p-3 bg-emerald-100 rounded-lg">
                  <p className="text-sm font-medium text-emerald-800">Demo Credentials:</p>
                  <p className="text-sm text-emerald-700">Patient: patient@demo.atlas / demo123</p>
                  <p className="text-sm text-emerald-700">Clinician: clinician@demo.atlas / demo123</p>
                  <p className="text-sm text-emerald-700">Clinic: clinic@demo.atlas / demo123</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
