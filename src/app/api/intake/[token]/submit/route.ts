import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession, generateConsentToken } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'PATIENT') {
      return NextResponse.json({ error: 'Please log in as a patient to submit' }, { status: 401 })
    }

    const patient = await prisma.patient.findUnique({
      where: { userId: session.id },
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    const { token } = await params
    const { answers, consentDuration } = await request.json()

    const form = await prisma.intakeForm.findFirst({
      where: {
        shareToken: token,
        isPublished: true,
      },
      include: { clinic: true },
    })

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    const consentToken = generateConsentToken()
    const consentExpiresAt = new Date(Date.now() + consentDuration * 60 * 1000)

    const submission = await prisma.intakeSubmission.create({
      data: {
        formId: form.id,
        patientId: patient.id,
        answers: JSON.stringify(answers),
        consentToken,
        consentDuration,
        consentExpiresAt,
      },
    })

    // Log the submission
    await createAuditLog({
      patientId: patient.id,
      actorType: 'PATIENT',
      actorId: patient.id,
      actorName: patient.fullName,
      action: 'SUBMIT_INTAKE',
      category: 'intake_form',
      consentType: 'MEDICAL_TOURISM',
      metadata: {
        formId: form.id,
        formName: form.name,
        clinicName: form.clinic.name,
        consentExpiresAt: consentExpiresAt.toISOString(),
      },
    })

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      consentToken,
      consentExpiresAt,
    })
  } catch (error) {
    console.error('Submit intake error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
