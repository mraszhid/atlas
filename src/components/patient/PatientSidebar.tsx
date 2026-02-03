'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Wallet, 
  FileText, 
  CreditCard,
  Share2,
  Plug,
  Shield,
  Heart,
  History,
  Settings,
  LogOut,
  ChevronRight,
  Brain
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PatientData {
  fullName: string
  visaId?: string | null
  emergencyCode?: string
}

export default function PatientSidebar({ patient }: { patient?: PatientData | null }) {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { 
      section: 'Overview',
      items: [
        { href: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard, iconClass: 'icon-dashboard' },
      ]
    },
    {
      section: 'Health Records',
      items: [
        { href: '/patient/wallet', label: 'Health Wallet', icon: Wallet, iconClass: 'icon-wallet' },
        { href: '/patient/documents', label: 'Documents', icon: FileText, iconClass: 'icon-documents' },
        { href: '/patient/ai-scan', label: 'AI Doc Scanner', icon: Brain, iconClass: 'icon-ai' },
        { href: '/patient/atlas-card', label: 'Atlas Card', icon: CreditCard, iconClass: 'icon-card' },
      ]
    },
    {
      section: 'Sharing',
      items: [
        { href: '/patient/sharing', label: 'Sharing & Consent', icon: Share2, iconClass: 'icon-sharing' },
        { href: '/patient/emr', label: 'EMR Connect', icon: Plug, iconClass: 'icon-emr' },
      ]
    },
    {
      section: 'Personal',
      items: [
        { href: '/patient/insurance', label: 'Insurance', icon: Shield, iconClass: 'icon-insurance' },
        { href: '/patient/directives', label: 'Advance Directives', icon: Heart, iconClass: 'icon-directives' },
      ]
    },
    {
      section: 'Account',
      items: [
        { href: '/patient/audit-log', label: 'Access History', icon: History, iconClass: 'icon-history' },
        { href: '/patient/settings', label: 'Settings', icon: Settings, iconClass: 'icon-settings' },
      ]
    },
  ]

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <aside className="sidebar-premium overflow-y-auto pb-24">
      {/* Logo */}
      <div className="sidebar-logo">
        <Link href="/patient/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-white tracking-tight">Atlas</span>
            <span className="text-xs text-slate-400 block -mt-1">Health Identity</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((section) => (
          <div key={section.section}>
            <p className="sidebar-section-title">{section.section}</p>
            {section.items.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn('sidebar-link', isActive && 'active')}
                >
                  <item.icon className={cn('icon', item.iconClass)} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 text-white/50" />}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User Card */}
      <div className="sidebar-user">
        <div className="sidebar-user-card" onClick={handleLogout}>
          <div className="sidebar-user-avatar">
            {patient?.fullName?.charAt(0) || 'M'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {patient?.fullName || 'Muhammad Rashid'}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {patient?.visaId || 'ATL-2024-0847'}
            </p>
          </div>
          <LogOut className="w-4 h-4 text-slate-400" />
        </div>
        
        {patient?.emergencyCode && (
          <div className="mt-3 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
            <p className="text-xs text-rose-400 font-medium">Emergency Code</p>
            <p className="text-sm font-mono text-white">{patient.emergencyCode}</p>
          </div>
        )}
      </div>
    </aside>
  )
}
