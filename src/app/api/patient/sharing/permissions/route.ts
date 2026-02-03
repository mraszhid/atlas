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

    const permissions = await prisma.sharingPermission.findMany({
      where: { patientId: patient.id },
    })

    return NextResponse.json(permissions)
  } catch (error) {
    console.error('Fetch permissions error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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

    const data = await request.json()
    const { shareMode, ...fields } = data

    await prisma.sharingPermission.upsert({
      where: {
        patientId_shareMode: {
          patientId: patient.id,
          shareMode,
        },
      },
      update: fields,
      create: {
        patientId: patient.id,
        shareMode,
        ...fields,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update permissions error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
