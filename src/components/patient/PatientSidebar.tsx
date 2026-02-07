'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Wallet,
  FileText,
  CreditCard,
  Calendar,
  Share2,
  Heart,
  History,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X
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
  const [mobileOpen, setMobileOpen] = useState(false)

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
        { href: '/patient/documents', label: 'Document Vault', icon: FileText, iconClass: 'icon-documents' },
        { href: '/patient/atlas-card', label: 'Atlas Card', icon: CreditCard, iconClass: 'icon-card' },
        { href: '/patient/appointments', label: 'Appointments', icon: Calendar, iconClass: 'icon-ai' },
      ]
    },
    {
      section: 'Sharing & Privacy',
      items: [
        { href: '/patient/sharing', label: 'Sharing & Consent', icon: Share2, iconClass: 'icon-sharing' },
        { href: '/patient/directives', label: 'Advance Directives', icon: Heart, iconClass: 'icon-directives' },
        { href: '/patient/audit-log', label: 'Audit Log', icon: History, iconClass: 'icon-history' },
      ]
    },
    {
      section: 'Account',
      items: [
        { href: '/patient/settings', label: 'Settings', icon: Settings, iconClass: 'icon-settings' },
      ]
    },
  ]

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="sidebar-logo">
        <Link href="/patient/dashboard" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
          <img src="/atlas-logo.png" alt="ATLAS" className="w-10 h-10 flex-shrink-0" />
          <div>
            <span className="text-xl font-bold text-white tracking-tight">ATLAS</span>
            <div className="flex items-center gap-2 -mt-1">
              <span className="text-xs text-slate-400">Health Identity</span>
              <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-400 rounded">Patient</span>
            </div>
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
                  onClick={() => setMobileOpen(false)}
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
        <div className="sidebar-user-card">
          <Link href="/patient/settings" className="flex items-center gap-3 flex-1 min-w-0" onClick={() => setMobileOpen(false)}>
            <div className="sidebar-user-avatar bg-gradient-to-br from-violet-500 to-blue-500">
              {patient?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'MA'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {patient?.fullName || 'Muhammad Al-Rashid'}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {patient?.visaId || 'ATL-2024-0847'}
              </p>
            </div>
          </Link>
          <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-white transition-colors" aria-label="Logout">
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {patient?.emergencyCode && (
          <div className="mt-3 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
            <p className="text-xs text-rose-400 font-medium">Emergency Code</p>
            <p className="text-sm font-mono text-white">{patient.emergencyCode}</p>
          </div>
        )}
      </div>
    </>
  )

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop sidebar */}
      <aside className="sidebar-premium overflow-y-auto pb-24 hidden lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="sidebar-premium overflow-y-auto pb-24 relative z-10">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-4 w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
