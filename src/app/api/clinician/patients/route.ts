import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== 'CLINICIAN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const patients = await prisma.patient.findMany({
      select: {
        id: true,
        fullName: true,
        dateOfBirth: true,
        nationality: true,
        photoUrl: true,
        emergencyCode: true,
      },
      orderBy: { fullName: 'asc' },
    })

    return NextResponse.json(patients)
  } catch (error) {
    console.error('Fetch patients error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
