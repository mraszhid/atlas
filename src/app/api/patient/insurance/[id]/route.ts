import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

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

    await prisma.insurance.deleteMany({
      where: { id, patientId: patient.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete insurance error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
