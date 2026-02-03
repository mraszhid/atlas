'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users,
  FileText,
  Download,
  History,
  Settings,
  LogOut,
  ChevronRight,
  Building2,
  Brain
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ClinicData {
  name: string
  staffRole?: string | null
  staffName?: string | null
}

export default function ClinicSidebar({ clinic }: { clinic?: ClinicData | null }) {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { 
      section: 'Overview',
      items: [
        { href: '/clinic/dashboard', label: 'Dashboard', icon: LayoutDashboard, iconClass: 'icon-dashboard' },
      ]
    },
    {
      section: 'Patient Management',
      items: [
        { href: '/clinic/patients', label: 'Patients', icon: Users, iconClass: 'icon-patients' },
        { href: '/clinic/import', label: 'Import Patient', icon: Download, iconClass: 'icon-emr' },
      ]
    },
    {
      section: 'Forms',
      items: [
        { href: '/clinic/forms', label: 'Intake Forms', icon: FileText, iconClass: 'icon-forms' },
        { href: '/clinic/ai-intake', label: 'AI Smart Intake', icon: Brain, iconClass: 'icon-ai' },
      ]
    },
    {
      section: 'Account',
      items: [
        { href: '/clinic/history', label: 'Access History', icon: History, iconClass: 'icon-history' },
        { href: '/clinic/settings', label: 'Settings', icon: Settings, iconClass: 'icon-settings' },
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
        <Link href="/clinic/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-white tracking-tight">Atlas</span>
            <span className="text-xs text-slate-400 block -mt-1">Clinic Portal</span>
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

      {/* Clinic Card */}
      <div className="sidebar-user">
        <div className="sidebar-user-card" onClick={handleLogout}>
          <div className="sidebar-user-avatar bg-gradient-to-br from-violet-400 to-purple-500">
            {clinic?.name?.charAt(0) || 'C'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {clinic?.staffName || 'Staff Member'}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {clinic?.name || 'Medical Clinic'}
            </p>
          </div>
          <LogOut className="w-4 h-4 text-slate-400" />
        </div>
        
        {clinic?.staffRole && (
          <div className="mt-3 px-3 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
            <p className="text-xs text-violet-400 font-medium">Role</p>
            <p className="text-sm text-white">{clinic.staffRole}</p>
          </div>
        )}
      </div>
    </aside>
  )
}
