'use client'

import { useState, useEffect } from 'react'
import {
  Shield,
  Building2,
  Phone,
  CheckCircle2
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Insurance {
  id: string
  providerName: string
  policyNumber: string
  groupNumber: string | null
  coverageStart: string | null
  coverageEnd: string | null
  emergencyPhone: string | null
  planType: string | null
  isActive: boolean
}

const MOCK_INSURANCE: Insurance[] = [
  {
    id: '1',
    providerName: 'Daman Health Insurance',
    policyNumber: 'DHI-2024-847291',
    groupNumber: 'GRP-UAE-001',
    coverageStart: '2024-01-01',
    coverageEnd: '2025-12-31',
    emergencyPhone: '+971 800 4326',
    planType: 'Enhanced Health Plan',
    isActive: true,
  },
]

export default function InsurancePage() {
  const [insurances, setInsurances] = useState<Insurance[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInsurances()
  }, [])

  async function fetchInsurances() {
    try {
      const res = await fetch('/api/patient/insurance')
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          setInsurances(data)
          setLoading(false)
          return
        }
      }
    } catch {}
    setInsurances(MOCK_INSURANCE)
    setLoading(false)
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          Insurance
        </h1>
        <p className="text-slate-500">
          Your health insurance information
        </p>
      </div>

      {loading ? (
        <div className="card-premium p-8 text-center text-slate-500">Loading...</div>
      ) : insurances.length === 0 ? (
        <div className="card-premium p-12 text-center max-w-lg mx-auto">
          <Shield className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-700 mb-2">No Insurance on File</h3>
          <p className="text-slate-500">
            No insurance information has been added to your account yet.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
          {insurances.map((insurance) => (
            <div key={insurance.id} className="card-premium p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{insurance.providerName}</h3>
                  <p className="text-sm text-slate-500">{insurance.planType || 'Health Insurance'}</p>
                </div>
                <span className={`badge ml-auto ${insurance.isActive ? 'badge-verified' : 'badge-unverified'}`}>
                  {insurance.isActive ? (
                    <><CheckCircle2 className="w-3 h-3" /> Active</>
                  ) : 'Inactive'}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-t border-slate-100">
                  <span className="text-slate-500">Policy Number</span>
                  <span className="font-mono text-slate-900">{insurance.policyNumber}</span>
                </div>
                {insurance.groupNumber && (
                  <div className="flex justify-between py-2 border-t border-slate-100">
                    <span className="text-slate-500">Group Number</span>
                    <span className="font-mono text-slate-900">{insurance.groupNumber}</span>
                  </div>
                )}
                {insurance.coverageStart && insurance.coverageEnd && (
                  <div className="flex justify-between py-2 border-t border-slate-100">
                    <span className="text-slate-500">Coverage Period</span>
                    <span className="text-slate-900">
                      {formatDate(insurance.coverageStart)} - {formatDate(insurance.coverageEnd)}
                    </span>
                  </div>
                )}
                {insurance.emergencyPhone && (
                  <div className="flex justify-between py-2 border-t border-slate-100">
                    <span className="text-slate-500">Emergency Line</span>
                    <a href={`tel:${insurance.emergencyPhone}`} className="text-blue-600 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {insurance.emergencyPhone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
