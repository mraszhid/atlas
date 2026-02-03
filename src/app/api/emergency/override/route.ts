import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createAuditLog } from '@/lib/audit'

export async function POST(request: NextRequest) {
  try {
    const { patientId, clinicianId, reason, verificationCode } = await request.json()

    if (!patientId || !clinicianId || !reason) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    // In production, verify the clinician ID against a registry
    // For MVP, we accept any clinician ID that looks valid

    // Simulate verification code check (in production, this would be a real facility code)
    if (verificationCode && verificationCode.length < 4) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 })
    }

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    // Get full emergency data
    const allergies = await prisma.allergy.findMany({ where: { patientId } })
    const medications = await prisma.medication.findMany({ where: { patientId } })
    const conditions = await prisma.condition.findMany({ where: { patientId } })
    const surgeries = await prisma.surgery.findMany({ where: { patientId } })
    const emergencyContacts = await prisma.emergencyContact.findMany({ where: { patientId } })
    const documentsCount = await prisma.document.count({
      where: { patientId, shareEmergency: true },
    })

    const hasVerification = await prisma.verification.findFirst({
      where: { patientId },
    })

    // Create audit log for override
    await createAuditLog({
      patientId,
      actorType: 'EMERGENCY_ACCESS',
      actorId: clinicianId,
      actorName: `Clinician: ${clinicianId}`,
      action: 'EMERGENCY_OVERRIDE',
      category: 'emergency_override',
      consentType: 'EMERGENCY_OVERRIDE',
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      metadata: { 
        clinicianId,
        reason,
        overrideTime: new Date().toISOString(),
      },
    })

    return NextResponse.json({
      patient: {
        fullName: patient.fullName,
        dateOfBirth: patient.dateOfBirth,
        nationality: patient.nationality,
        photoUrl: patient.photoUrl,
        organDonor: patient.organDonor,
        advanceDirective: patient.advanceDirective,
        decisionMakerName: patient.decisionMakerName,
        decisionMakerPhone: patient.decisionMakerPhone,
      },
      allergies,
      medications,
      conditions,
      surgeries,
      emergencyContacts,
      documentsCount,
      verified: !!hasVerification,
      overrideUsed: true,
    })
  } catch (error) {
    console.error('Emergency override error:', error)
    return NextResponse.json({ error: 'Override failed' }, { status: 500 })
  }
}
