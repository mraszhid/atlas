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
      include: {
        allergies: { orderBy: { createdAt: 'desc' } },
        medications: { orderBy: { createdAt: 'desc' } },
        conditions: { orderBy: { createdAt: 'desc' } },
        surgeries: { orderBy: { date: 'desc' } },
        vaccinations: { orderBy: { date: 'desc' } },
        labResults: { orderBy: { date: 'desc' } },
        primaryPhysician: true,
      },
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    return NextResponse.json({
      allergies: patient.allergies,
      medications: patient.medications,
      conditions: patient.conditions,
      surgeries: patient.surgeries,
      vaccinations: patient.vaccinations,
      labResults: patient.labResults,
      primaryPhysician: patient.primaryPhysician,
    })
  } catch (error) {
    console.error('Wallet fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
