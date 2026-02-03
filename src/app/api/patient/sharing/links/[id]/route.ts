import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    const link = await prisma.consentLink.findFirst({
      where: { id, patientId: patient.id },
    })

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    await prisma.consentLink.update({
      where: { id },
      data: { revokedAt: new Date() },
    })

    await createAuditLog({
      patientId: patient.id,
      actorType: 'PATIENT',
      actorId: patient.id,
      actorName: patient.fullName,
      action: 'REVOKE',
      category: 'sharing',
      consentToken: link.token,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete link error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
