import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'CLINICIAN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const clinician = await prisma.clinician.findUnique({
      where: { userId: session.id },
    })

    if (!clinician) {
      return NextResponse.json({ error: 'Clinician not found' }, { status: 404 })
    }

    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        allergies: { orderBy: { createdAt: 'desc' } },
        medications: { orderBy: { createdAt: 'desc' } },
        conditions: { orderBy: { createdAt: 'desc' } },
        surgeries: { orderBy: { date: 'desc' } },
        verifications: {
          include: { clinician: true },
          orderBy: { verifiedAt: 'desc' },
        },
      },
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    // Log the access
    await createAuditLog({
      patientId: id,
      actorType: 'CLINICIAN',
      actorId: clinician.id,
      actorName: clinician.fullName,
      actorInstitution: clinician.institution || undefined,
      action: 'VIEW',
      category: 'patient_records',
      consentType: 'NORMAL',
    })

    return NextResponse.json({
      patient: {
        id: patient.id,
        fullName: patient.fullName,
        dateOfBirth: patient.dateOfBirth,
        nationality: patient.nationality,
        photoUrl: patient.photoUrl,
        emergencyCode: patient.emergencyCode,
      },
      allergies: patient.allergies,
      medications: patient.medications,
      conditions: patient.conditions,
      surgeries: patient.surgeries,
      verifications: patient.verifications,
    })
  } catch (error) {
    console.error('Fetch patient error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
