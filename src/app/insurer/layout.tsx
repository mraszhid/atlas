import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import InsurerSidebar from '@/components/insurer/InsurerSidebar'

export default async function InsurerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  
  if (!session || session.role !== 'INSURER') {
    redirect('/login')
  }
  
  const insurer = await prisma.insurer.findUnique({
    where: { userId: session.id },
  })
  
  if (!insurer) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <InsurerSidebar insurer={insurer} />
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}
