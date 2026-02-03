import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import ClinicSidebar from '@/components/clinic/ClinicSidebar'

export default async function ClinicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  
  if (!session || (session.role !== 'CLINIC_ADMIN' && session.role !== 'CLINIC_STAFF')) {
    redirect('/login')
  }
  
  const clinicStaff = await prisma.clinicStaff.findUnique({
    where: { userId: session.id },
    include: { clinic: true },
  })
  
  if (!clinicStaff) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <ClinicSidebar clinic={{
        name: clinicStaff.clinic.name,
        staffRole: clinicStaff.role,
        staffName: clinicStaff.fullName,
      }} />
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}
