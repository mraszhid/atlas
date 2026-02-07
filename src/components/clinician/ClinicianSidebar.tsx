'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users,
  CheckCircle2,
  History,
  Settings,
  LogOut,
  ChevronRight,
  Brain
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ClinicianData {
  fullName: string
  specialty?: string | null
  licenseNumber?: string | null
}

export default function ClinicianSidebar({ clinician }: { clinician?: ClinicianData | null }) {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { 
      section: 'Overview',
      items: [
        { href: '/clinician/dashboard', label: 'Dashboard', icon: LayoutDashboard, iconClass: 'icon-dashboard' },
      ]
    },
    {
      section: 'Patient Care',
      items: [
        { href: '/clinician/patients', label: 'Patients', icon: Users, iconClass: 'icon-patients' },
        { href: '/clinician/verifications', label: 'Verifications', icon: CheckCircle2, iconClass: 'icon-verify' },
        { href: '/clinician/ai-verify', label: 'AI Verify', icon: Brain, iconClass: 'icon-ai' },
      ]
    },
    {
      section: 'Account',
      items: [
        { href: '/clinician/history', label: 'Access History', icon: History, iconClass: 'icon-history' },
        { href: '/clinician/settings', label: 'Settings', icon: Settings, iconClass: 'icon-settings' },
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
        <Link href="/clinician/dashboard" className="flex items-center gap-3">
          <img src="/atlas-logo.png" alt="ATLAS" className="w-10 h-10 flex-shrink-0" />
          <div>
            <span className="text-xl font-bold text-white tracking-tight">ATLAS</span>
            <span className="text-xs text-slate-400 block -mt-1">Clinician Portal</span>
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
          <div className="sidebar-user-avatar bg-gradient-to-br from-emerald-400 to-teal-500">
            {clinician?.fullName?.charAt(0) || 'D'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {clinician?.fullName || 'Dr. Clinician'}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {clinician?.specialty || 'Healthcare Provider'}
            </p>
          </div>
          <LogOut className="w-4 h-4 text-slate-400" />
        </div>
        
        {clinician?.licenseNumber && (
          <div className="mt-3 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-xs text-emerald-400 font-medium">License #</p>
            <p className="text-sm font-mono text-white">{clinician.licenseNumber}</p>
          </div>
        )}
      </div>
    </aside>
  )
}
