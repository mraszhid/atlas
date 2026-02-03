import { NextRequest, NextResponse } from 'next/server'
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
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    const insurances = await prisma.insurance.findMany({
      where: { patientId: patient.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(insurances)
  } catch (error) {
    console.error('Fetch insurance error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'PATIENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const patient = await prisma.patient.findUnique({
      where: { userId: session.id },
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    const data = await request.json()

    const insurance = await prisma.insurance.create({
      data: {
        patientId: patient.id,
        providerName: data.providerName,
        policyNumber: data.policyNumber,
        groupNumber: data.groupNumber || null,
        coverageStart: data.coverageStart ? new Date(data.coverageStart) : null,
        coverageEnd: data.coverageEnd ? new Date(data.coverageEnd) : null,
        emergencyPhone: data.emergencyPhone || null,
        planType: data.planType || null,
        isActive: true,
      },
    })

    return NextResponse.json(insurance)
  } catch (error) {
    console.error('Create insurance error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
