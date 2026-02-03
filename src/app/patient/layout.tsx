import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import PatientSidebar from '@/components/patient/PatientSidebar'

export default async function PatientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  
  if (!session || session.role !== 'PATIENT') {
    redirect('/login')
  }
  
  const patient = await prisma.patient.findUnique({
    where: { userId: session.id },
  })
  
  if (!patient) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PatientSidebar patient={patient} />
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}
