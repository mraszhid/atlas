import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createAuditLog } from '@/lib/audit'

export async function POST(request: NextRequest) {
  try {
    const { type, value } = await request.json()

    if (!type || !value) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    let patient

    if (type === 'code') {
      // Search by emergency code
      patient = await prisma.patient.findFirst({
        where: {
          emergencyCode: {
            contains: value.toUpperCase(),
          },
        },
      })
    } else if (type === 'passport') {
      // Search by passport number
      patient = await prisma.patient.findFirst({
        where: {
          passportNumber: {
            contains: value.toUpperCase(),
          },
        },
      })
    }

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    // Check if emergency access is locked
    if (patient.emergencyLocked) {
      return NextResponse.json({ 
        locked: true, 
        patientId: patient.id 
      })
    }

    // Get patient data with emergency-allowed information only
    const permissions = await prisma.sharingPermission.findFirst({
      where: { patientId: patient.id, shareMode: 'EMERGENCY' },
    })

    const allergies = permissions?.allergies 
      ? await prisma.allergy.findMany({ where: { patientId: patient.id } })
      : []

    const medications = permissions?.medications
      ? await prisma.medication.findMany({ where: { patientId: patient.id } })
      : []

    const conditions = permissions?.conditions
      ? await prisma.condition.findMany({ where: { patientId: patient.id } })
      : []

    const surgeries = permissions?.surgeries
      ? await prisma.surgery.findMany({ where: { patientId: patient.id } })
      : []

    const emergencyContacts = await prisma.emergencyContact.findMany({
      where: { patientId: patient.id },
    })

    const documentsCount = await prisma.document.count({
      where: { patientId: patient.id, shareEmergency: true },
    })

    // Check for verified records
    const hasVerification = await prisma.verification.findFirst({
      where: { patientId: patient.id },
    })

    // Create audit log
    await createAuditLog({
      patientId: patient.id,
      actorType: 'EMERGENCY_ACCESS',
      action: 'EMERGENCY_ACCESS',
      category: 'emergency_view',
      consentType: 'EMERGENCY',
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      metadata: { searchType: type },
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
    })
  } catch (error) {
    console.error('Emergency access error:', error)
    return NextResponse.json({ error: 'Access failed' }, { status: 500 })
  }
}
