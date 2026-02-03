import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession, generateConsentToken } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'

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

    const links = await prisma.consentLink.findMany({
      where: { patientId: patient.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(links)
  } catch (error) {
    console.error('Fetch links error:', error)
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

    const { shareMode, duration } = await request.json()
    const token = generateConsentToken()
    const expiresAt = new Date(Date.now() + duration * 60 * 1000)

    const link = await prisma.consentLink.create({
      data: {
        patientId: patient.id,
        token,
        shareMode,
        duration,
        expiresAt,
      },
    })

    await createAuditLog({
      patientId: patient.id,
      actorType: 'PATIENT',
      actorId: patient.id,
      actorName: patient.fullName,
      action: 'CREATE_CONSENT',
      category: 'sharing',
      consentType: shareMode,
      consentToken: token,
    })

    return NextResponse.json(link)
  } catch (error) {
    console.error('Create link error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
