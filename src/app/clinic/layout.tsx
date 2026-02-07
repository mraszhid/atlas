'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  Users,
  ClipboardList,
  GitBranch,
  BarChart3,
  Settings,
  Shield,
  Menu,
  X,
  LogOut,
  MapPin,
  Building2,
  ChevronDown,
} from 'lucide-react'

const navItems = [
  { href: '/clinic/dashboard', label: 'Dashboard', icon: LayoutDashboard, iconClass: 'icon-dashboard' },
  { href: '/clinic/forms', label: 'Forms', icon: FileText, iconClass: 'icon-forms' },
  { href: '/clinic/patients', label: 'Patients', icon: Users, iconClass: 'icon-patients' },
  { href: '/clinic/submissions', label: 'Submissions', icon: ClipboardList, iconClass: 'icon-documents' },
  { href: '/clinic/pipeline', label: 'Pipeline', icon: GitBranch, iconClass: 'icon-wallet' },
  { href: '/clinic/analytics', label: 'Analytics', icon: BarChart3, iconClass: 'icon-insurance' },
  { href: '/clinic/settings', label: 'Settings', icon: Settings, iconClass: 'icon-settings' },
]

export default function ClinicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'sidebar-premium transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">ATLAS</span>
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                Clinic Admin
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-slate-400">
            <Building2 className="w-4 h-4" />
            <span className="text-sm font-medium text-white">NovaMed Tourism Clinic</span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-slate-500">
            <MapPin className="w-3 h-3" />
            <span className="text-xs">Bangkok, Thailand</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <p className="sidebar-section-title">Main Menu</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn('sidebar-link', isActive && 'active')}
              >
                <item.icon className={cn('icon', item.iconClass)} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="sidebar-user">
          <div
            className="sidebar-user-card"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="sidebar-user-avatar bg-gradient-to-br from-violet-500 to-purple-600">
              NC
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Clinic Admin</p>
              <p className="text-xs text-slate-400 truncate">clinic@demo.atlas</p>
            </div>
            <ChevronDown className={cn(
              'w-4 h-4 text-slate-400 transition-transform',
              profileOpen && 'rotate-180'
            )} />
          </div>

          {profileOpen && (
            <div className="mt-2 py-1 bg-white/5 rounded-xl border border-white/10">
              <Link
                href="/clinic/settings"
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                onClick={() => { setSidebarOpen(false); setProfileOpen(false) }}
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 glass border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-700" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">ATLAS</span>
            <span className="text-[10px] font-semibold bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded">
              Clinic
            </span>
          </div>
          <Link href="/clinic/settings" className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <Settings className="w-5 h-5 text-slate-700" />
          </Link>
        </div>
      </div>

      {/* Main content */}
      <main className="main-content pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  )
}
