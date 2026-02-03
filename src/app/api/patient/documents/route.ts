import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
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

    const documents = await prisma.document.findMany({
      where: { patientId: patient.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error('Fetch documents error:', error)
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

    const document = await prisma.document.create({
      data: {
        patientId: patient.id,
        title: data.title,
        type: data.type,
        date: data.date ? new Date(data.date) : null,
        provider: data.provider,
        facility: data.facility,
        country: data.country,
        tags: data.tags,
        notes: data.notes,
        fileName: `${data.title.toLowerCase().replace(/\s+/g, '_')}.pdf`,
        fileSize: Math.floor(Math.random() * 1000000) + 100000,
        mimeType: 'application/pdf',
        shareEmergency: data.shareEmergency,
        shareClinicVisit: data.shareClinicVisit,
        isPrivate: data.isPrivate,
      },
    })

    await createAuditLog({
      patientId: patient.id,
      actorType: 'PATIENT',
      actorId: patient.id,
      actorName: patient.fullName,
      action: 'CREATE',
      category: 'documents',
      documentTitle: data.title,
    })

    return NextResponse.json(document)
  } catch (error) {
    console.error('Create document error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
