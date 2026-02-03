import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import ClinicianSidebar from '@/components/clinician/ClinicianSidebar'

export default async function ClinicianLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  
  if (!session || session.role !== 'CLINICIAN') {
    redirect('/login')
  }
  
  const clinician = await prisma.clinician.findUnique({
    where: { userId: session.id },
  })
  
  if (!clinician) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <ClinicianSidebar clinician={clinician} />
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}
