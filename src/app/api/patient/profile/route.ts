import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== 'PATIENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const patient = await prisma.patient.findUnique({
      where: { userId: session.id },
      select: {
        id: true,
        fullName: true,
        dateOfBirth: true,
        nationality: true,
        passportNumber: true,
        phone: true,
        photoUrl: true,
        preferredLanguage: true,
        emergencyCode: true,
        emergencyLocked: true,
        organDonor: true,
        advanceDirective: true,
        decisionMakerName: true,
        decisionMakerPhone: true,
      },
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    return NextResponse.json(patient)
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
