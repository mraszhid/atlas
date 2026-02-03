import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'CLINICIAN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const clinician = await prisma.clinician.findUnique({
      where: { userId: session.id },
    })

    if (!clinician) {
      return NextResponse.json({ error: 'Clinician not found' }, { status: 404 })
    }

    const { patientId, categories, notes } = await request.json()

    if (!patientId || !categories || categories.length === 0) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        allergies: true,
        medications: true,
        conditions: true,
        surgeries: true,
      },
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    const itemIds: string[] = []
    const now = new Date()

    // Update items in each category
    for (const category of categories) {
      if (category === 'allergies') {
        const items = patient.allergies.filter(a => !a.verified)
        for (const item of items) {
          await prisma.allergy.update({
            where: { id: item.id },
            data: { verified: true, verifiedAt: now, verifiedById: clinician.id, locked: true },
          })
          itemIds.push(item.id)
        }
      }
      if (category === 'medications') {
        const items = patient.medications.filter(m => !m.verified)
        for (const item of items) {
          await prisma.medication.update({
            where: { id: item.id },
            data: { verified: true, verifiedAt: now, verifiedById: clinician.id, locked: true },
          })
          itemIds.push(item.id)
        }
      }
      if (category === 'conditions') {
        const items = patient.conditions.filter(c => !c.verified)
        for (const item of items) {
          await prisma.condition.update({
            where: { id: item.id },
            data: { verified: true, verifiedAt: now, verifiedById: clinician.id, locked: true },
          })
          itemIds.push(item.id)
        }
      }
      if (category === 'surgeries') {
        const items = patient.surgeries.filter(s => !s.verified)
        for (const item of items) {
          await prisma.surgery.update({
            where: { id: item.id },
            data: { verified: true, verifiedAt: now, verifiedById: clinician.id, locked: true },
          })
          itemIds.push(item.id)
        }
      }
    }

    // Create verification record
    const verification = await prisma.verification.create({
      data: {
        patientId,
        clinicianId: clinician.id,
        category: categories.join(','),
        itemIds: itemIds.join(','),
        signature: `${clinician.fullName}, ${clinician.specialty || 'MD'} - ${clinician.licenseNumber}`,
        institution: clinician.institution,
        notes,
      },
    })

    // Log the verification
    await createAuditLog({
      patientId,
      actorType: 'CLINICIAN',
      actorId: clinician.id,
      actorName: clinician.fullName,
      actorInstitution: clinician.institution || undefined,
      action: 'VERIFY',
      category: categories.join(','),
      consentType: 'NORMAL',
      metadata: { verificationId: verification.id, itemCount: itemIds.length },
    })

    return NextResponse.json({ success: true, verification })
  } catch (error) {
    console.error('Verify error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
