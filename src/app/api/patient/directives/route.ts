import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'

export async function PUT(request: NextRequest) {
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

    const { organDonor, advanceDirective, decisionMakerName, decisionMakerPhone } = await request.json()

    await prisma.patient.update({
      where: { id: patient.id },
      data: {
        organDonor,
        advanceDirective,
        decisionMakerName,
        decisionMakerPhone,
      },
    })

    await createAuditLog({
      patientId: patient.id,
      actorType: 'PATIENT',
      actorId: patient.id,
      actorName: patient.fullName,
      action: 'UPDATE',
      category: 'advance_directives',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update directives error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
