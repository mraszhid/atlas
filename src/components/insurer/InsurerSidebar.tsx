'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users,
  FileCheck,
  Search,
  History,
  Settings,
  LogOut,
  ChevronRight,
  Shield,
  Brain
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface InsurerData {
  companyName: string
  contactName?: string | null
}

export default function InsurerSidebar({ insurer }: { insurer?: InsurerData | null }) {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { 
      section: 'Overview',
      items: [
        { href: '/insurer/dashboard', label: 'Dashboard', icon: LayoutDashboard, iconClass: 'icon-dashboard' },
      ]
    },
    {
      section: 'Verification',
      items: [
        { href: '/insurer/verify', label: 'Verify Patient', icon: Search, iconClass: 'icon-patients' },
        { href: '/insurer/claims', label: 'Claims', icon: FileCheck, iconClass: 'icon-verify' },
        { href: '/insurer/preauth', label: 'AI Pre-Auth', icon: Brain, iconClass: 'icon-ai' },
      ]
    },
    {
      section: 'Account',
      items: [
        { href: '/insurer/history', label: 'Access History', icon: History, iconClass: 'icon-history' },
        { href: '/insurer/settings', label: 'Settings', icon: Settings, iconClass: 'icon-settings' },
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
        <Link href="/insurer/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-white tracking-tight">Atlas</span>
            <span className="text-xs text-slate-400 block -mt-1">Insurer Portal</span>
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
          <div className="sidebar-user-avatar bg-gradient-to-br from-amber-400 to-orange-500">
            {insurer?.companyName?.charAt(0) || 'I'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {insurer?.contactName || 'Insurance Agent'}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {insurer?.companyName || 'Insurance Company'}
            </p>
          </div>
          <LogOut className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </aside>
  )
}
