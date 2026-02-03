import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'

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
    
    const allergy = await prisma.allergy.create({
      data: {
        patientId: patient.id,
        allergen: data.allergen,
        reaction: data.reaction,
        severity: data.severity,
        verified: false,
        source: 'PATIENT',
      },
    })

    await createAuditLog({
      patientId: patient.id,
      actorType: 'PATIENT',
      actorId: patient.id,
      actorName: patient.fullName,
      action: 'CREATE',
      category: 'allergies',
      itemId: allergy.id,
    })

    return NextResponse.json(allergy)
  } catch (error) {
    console.error('Create allergy error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
