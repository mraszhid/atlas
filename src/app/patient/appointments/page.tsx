'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  MapPin,
  Stethoscope,
  Play,
  FileText,
  Info,
  UserRound,
  Circle,
} from 'lucide-react'

// ============================================================
// MOCK DATA
// ============================================================

interface Appointment {
  id: string
  title: string
  clinicName: string
  location?: string
  surgeon?: string
  date: string
  displayDate: string
  displayTime?: string
  type: 'intake' | 'procedure' | 'followup' | 'checkup'
  status: 'ready' | 'scheduled' | 'completed' | 'sent'
  intakeStatus?: 'completed' | 'pending' | 'not_required'
  calendarDay: number
}

const upcomingAppointments: Appointment[] = [
  {
    id: 'upcoming-1',
    title: 'Pre-Visit Intake Interview',
    clinicName: 'NovaMed Tourism Clinic',
    date: '2026-02-08T14:00:00',
    displayDate: 'February 8, 2026',
    displayTime: '2:00 PM GST',
    type: 'intake',
    status: 'ready',
    calendarDay: 8,
  },
  {
    id: 'upcoming-2',
    title: 'Cosmetic Surgery (Rhinoplasty)',
    clinicName: 'NovaMed Tourism Clinic',
    location: 'Bangkok, Thailand',
    surgeon: 'Dr. Hassan Ali',
    date: '2026-02-15T09:00:00',
    displayDate: 'February 15, 2026',
    displayTime: '9:00 AM',
    type: 'procedure',
    status: 'scheduled',
    intakeStatus: 'pending',
    calendarDay: 15,
  },
  {
    id: 'upcoming-3',
    title: 'Follow-up Consultation',
    clinicName: 'NovaMed Tourism Clinic',
    date: '2026-03-05T11:00:00',
    displayDate: 'March 5, 2026',
    displayTime: '11:00 AM',
    type: 'followup',
    status: 'scheduled',
    intakeStatus: 'not_required',
    calendarDay: 5,
  },
]

const pastAppointments: Appointment[] = [
  {
    id: 'past-1',
    title: 'General Checkup',
    clinicName: 'Dubai Health Clinic',
    date: '2026-01-15T10:00:00',
    displayDate: 'January 15, 2026',
    displayTime: '10:00 AM GST',
    type: 'checkup',
    status: 'sent',
    intakeStatus: 'completed',
    calendarDay: 15,
  },
]

// ============================================================
// CALENDAR COMPONENT
// ============================================================

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface CalendarEvent {
  day: number
  month: number
  year: number
  color: 'blue' | 'green'
  appointmentId: string
}

const calendarEvents: CalendarEvent[] = [
  { day: 8, month: 1, year: 2026, color: 'blue', appointmentId: 'upcoming-1' },
  { day: 15, month: 1, year: 2026, color: 'green', appointmentId: 'upcoming-2' },
  { day: 5, month: 2, year: 2026, color: 'blue', appointmentId: 'upcoming-3' },
]

function MiniCalendar({ onDateClick }: { onDateClick: (appointmentId: string) => void }) {
  const [currentMonth, setCurrentMonth] = useState(1) // February = 1 (0-indexed)
  const [currentYear, setCurrentYear] = useState(2026)

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay()
  const today = new Date()
  const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear
  const todayDate = today.getDate()

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const getEventsForDay = (day: number) => {
    return calendarEvents.filter(
      (e) => e.day === day && e.month === currentMonth && e.year === currentYear
    )
  }

  return (
    <div className="card-premium p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-slate-900">
          {MONTH_NAMES[currentMonth]} {currentYear}
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-0 mb-2">
        {DAY_NAMES.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-slate-400 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0">
        {/* Empty cells for days before the 1st */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const events = getEventsForDay(day)
          const hasEvents = events.length > 0
          const isToday = isCurrentMonth && day === todayDate

          return (
            <button
              key={day}
              onClick={() => {
                if (hasEvents) {
                  onDateClick(events[0].appointmentId)
                }
              }}
              className={`aspect-square flex flex-col items-center justify-center rounded-lg relative transition-colors ${
                hasEvents
                  ? 'cursor-pointer hover:bg-slate-50'
                  : 'cursor-default'
              } ${isToday ? 'bg-atlas-50' : ''}`}
            >
              <span
                className={`text-sm ${
                  isToday
                    ? 'font-bold text-atlas-600'
                    : hasEvents
                      ? 'font-medium text-slate-900'
                      : 'text-slate-500'
                }`}
              >
                {day}
              </span>
              {hasEvents && (
                <div className="flex gap-0.5 mt-0.5">
                  {events.map((event, idx) => (
                    <span
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full ${
                        event.color === 'blue' ? 'bg-atlas-500' : 'bg-emerald-500'
                      }`}
                    />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-atlas-500" />
          Intake Interview
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Procedure
        </div>
      </div>
    </div>
  )
}

// ============================================================
// STATUS BADGE
// ============================================================

function StatusBadge({ status }: { status: Appointment['status'] }) {
  const config = {
    ready: {
      label: 'Ready to Join',
      className: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
      dot: 'bg-emerald-500 animate-pulse',
    },
    scheduled: {
      label: 'Scheduled',
      className: 'bg-atlas-100 text-atlas-700 border border-atlas-200',
      dot: 'bg-atlas-500',
    },
    completed: {
      label: 'Completed',
      className: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
      dot: 'bg-emerald-500',
    },
    sent: {
      label: 'Completed & Sent',
      className: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
      dot: 'bg-emerald-500',
    },
  }
  const c = config[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${c.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  )
}

function IntakeStatusBadge({ status }: { status: 'completed' | 'pending' | 'not_required' }) {
  if (status === 'completed') {
    return (
      <span className="flex items-center gap-1 text-xs text-emerald-600">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Intake Completed
      </span>
    )
  }
  if (status === 'pending') {
    return (
      <span className="flex items-center gap-1 text-xs text-amber-600">
        <Circle className="w-3.5 h-3.5" />
        Intake Pending
      </span>
    )
  }
  return (
    <span className="text-xs text-slate-400">Intake not required</span>
  )
}

// ============================================================
// ICON MAP
// ============================================================

function AppointmentIcon({ type, past }: { type: Appointment['type']; past?: boolean }) {
  const base = past
    ? 'w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0'
    : 'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0'

  if (type === 'intake') {
    return (
      <div className={past ? base : `${base} bg-gradient-to-br from-atlas-100 to-atlas-200`}>
        <Stethoscope className={`w-6 h-6 ${past ? 'text-slate-400' : 'text-atlas-600'}`} />
      </div>
    )
  }
  if (type === 'procedure') {
    return (
      <div className={past ? base : `${base} bg-gradient-to-br from-emerald-100 to-emerald-200`}>
        <UserRound className={`w-6 h-6 ${past ? 'text-slate-400' : 'text-emerald-600'}`} />
      </div>
    )
  }
  if (type === 'followup') {
    return (
      <div className={past ? base : `${base} bg-gradient-to-br from-violet-100 to-violet-200`}>
        <Calendar className={`w-6 h-6 ${past ? 'text-slate-400' : 'text-violet-600'}`} />
      </div>
    )
  }
  return (
    <div className={past ? base : `${base} bg-gradient-to-br from-slate-100 to-slate-200`}>
      <Stethoscope className={`w-6 h-6 ${past ? 'text-slate-400' : 'text-slate-600'}`} />
    </div>
  )
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function AppointmentsPage() {
  const appointmentRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const scrollToAppointment = (id: string) => {
    const el = appointmentRefs.current[id]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.classList.add('ring-2', 'ring-atlas-400', 'ring-offset-2')
      setTimeout(() => {
        el.classList.remove('ring-2', 'ring-atlas-400', 'ring-offset-2')
      }, 2000)
    }
  }

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-atlas-500 to-atlas-700 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
            <p className="text-sm text-slate-500">Your upcoming visits and intake interviews</p>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="mb-10">
        <MiniCalendar onDateClick={scrollToAppointment} />
      </div>

      {/* Upcoming Appointments */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-atlas-500" />
          Upcoming Appointments
        </h2>
        <div className="space-y-4">
          {upcomingAppointments.map((appt) => (
            <div
              key={appt.id}
              ref={(el) => { appointmentRefs.current[appt.id] = el }}
              className="card-premium p-6 transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <AppointmentIcon type={appt.type} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="font-semibold text-slate-900">{appt.title}</h3>
                      <StatusBadge status={appt.status} />
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{appt.clinicName}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {appt.displayDate}
                      </span>
                      {appt.displayTime && (
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {appt.displayTime}
                        </span>
                      )}
                      {appt.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {appt.location}
                        </span>
                      )}
                    </div>
                    {appt.surgeon && (
                      <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                        <UserRound className="w-3.5 h-3.5" />
                        Surgeon: {appt.surgeon}
                      </p>
                    )}
                    {appt.intakeStatus && (
                      <div className="mt-2">
                        <IntakeStatusBadge status={appt.intakeStatus} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {appt.type === 'intake' ? (
                    <Link
                      href={`/patient/appointments/interview/${appt.id}`}
                      className="btn-primary btn-lg gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Join Interview
                    </Link>
                  ) : (
                    <Link
                      href={`/patient/appointments/interview/${appt.id}`}
                      className="btn-secondary gap-2"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Appointments */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          Past Appointments
        </h2>
        <div className="space-y-4">
          {pastAppointments.map((appt) => (
            <div key={appt.id} className="card-premium p-6 opacity-80">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <AppointmentIcon type={appt.type} past />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="font-semibold text-slate-900">{appt.title}</h3>
                      <StatusBadge status={appt.status} />
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{appt.clinicName}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {appt.displayDate}
                      </span>
                      {appt.intakeStatus && (
                        <IntakeStatusBadge status={appt.intakeStatus} />
                      )}
                    </div>
                  </div>
                </div>
                <Link
                  href={`/patient/appointments/summary/${appt.id}`}
                  className="btn-secondary gap-2 flex-shrink-0"
                >
                  <FileText className="w-4 h-4" />
                  View Summary
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="card-premium p-6 border-l-4 border-l-atlas-500">
        <div className="flex items-start gap-3 mb-3">
          <Info className="w-5 h-5 text-atlas-500 flex-shrink-0 mt-0.5" />
          <h3 className="text-sm font-semibold text-slate-900">How the Intake Interview Works</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm text-slate-600 ml-8">
          <div className="flex items-start gap-2">
            <span className="w-6 h-6 rounded-full bg-atlas-100 text-atlas-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
            <span>Join your scheduled interview before your visit</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-6 h-6 rounded-full bg-atlas-100 text-atlas-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
            <span>AI reviews your medical records with you</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-6 h-6 rounded-full bg-atlas-100 text-atlas-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
            <span>Confirm, update, or add new health information</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-6 h-6 rounded-full bg-atlas-100 text-atlas-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
            <span>Pre-visit file is sent securely to your clinic</span>
          </div>
        </div>
      </div>
    </div>
  )
}
