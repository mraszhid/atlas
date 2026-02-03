import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'

// Mock FHIR data for demo
const mockFhirData = {
  allergies: [
    { allergen: 'Aspirin', reaction: 'Gastrointestinal upset', severity: 'moderate' },
    { allergen: 'Sulfa drugs', reaction: 'Skin rash', severity: 'mild' },
  ],
  medications: [
    { name: 'Omeprazole', dosage: '20mg', frequency: 'Once daily', prescribedFor: 'GERD' },
    { name: 'Vitamin D3', dosage: '2000 IU', frequency: 'Once daily', prescribedFor: 'Deficiency' },
  ],
  conditions: [
    { name: 'Gastroesophageal Reflux Disease', notes: 'Managed with medication' },
  ],
  labResults: [
    { testName: 'Vitamin D, 25-Hydroxy', result: '42', unit: 'ng/mL', referenceRange: '30-100' },
    { testName: 'TSH', result: '2.1', unit: 'mIU/L', referenceRange: '0.4-4.0' },
    { testName: 'Creatinine', result: '0.9', unit: 'mg/dL', referenceRange: '0.7-1.3' },
  ],
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

    const { provider } = await request.json()

    // Simulate FHIR import delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    const importCounts = {
      allergies: 0,
      medications: 0,
      conditions: 0,
      labResults: 0,
    }

    // Import allergies
    for (const allergy of mockFhirData.allergies) {
      const exists = await prisma.allergy.findFirst({
        where: { patientId: patient.id, allergen: allergy.allergen },
      })
      if (!exists) {
        await prisma.allergy.create({
          data: {
            patientId: patient.id,
            allergen: allergy.allergen,
            reaction: allergy.reaction,
            severity: allergy.severity,
            source: 'EMR_IMPORT',
            verified: false,
          },
        })
        importCounts.allergies++
      }
    }

    // Import medications
    for (const med of mockFhirData.medications) {
      const exists = await prisma.medication.findFirst({
        where: { patientId: patient.id, name: med.name },
      })
      if (!exists) {
        await prisma.medication.create({
          data: {
            patientId: patient.id,
            name: med.name,
            dosage: med.dosage,
            frequency: med.frequency,
            prescribedFor: med.prescribedFor,
            source: 'EMR_IMPORT',
            verified: false,
          },
        })
        importCounts.medications++
      }
    }

    // Import conditions
    for (const condition of mockFhirData.conditions) {
      const exists = await prisma.condition.findFirst({
        where: { patientId: patient.id, name: condition.name },
      })
      if (!exists) {
        await prisma.condition.create({
          data: {
            patientId: patient.id,
            name: condition.name,
            notes: condition.notes,
            source: 'EMR_IMPORT',
            verified: false,
          },
        })
        importCounts.conditions++
      }
    }

    // Import lab results
    for (const lab of mockFhirData.labResults) {
      const exists = await prisma.labResult.findFirst({
        where: { patientId: patient.id, testName: lab.testName },
      })
      if (!exists) {
        await prisma.labResult.create({
          data: {
            patientId: patient.id,
            testName: lab.testName,
            result: lab.result,
            unit: lab.unit,
            referenceRange: lab.referenceRange,
            date: new Date(),
            provider: provider === 'demo_hospital' ? 'Demo Hospital' : provider,
            source: 'EMR_IMPORT',
            verified: false,
          },
        })
        importCounts.labResults++
      }
    }

    // Create EMR import record
    await prisma.emrImport.create({
      data: {
        patientId: patient.id,
        emrProvider: provider,
        resourceType: 'Bundle',
        fhirData: JSON.stringify({ 
          resourceType: 'Bundle',
          type: 'collection',
          entry: mockFhirData,
        }),
        status: 'SUCCESS',
      },
    })

    // Log the import
    await createAuditLog({
      patientId: patient.id,
      actorType: 'PATIENT',
      actorId: patient.id,
      actorName: patient.fullName,
      action: 'IMPORT_EMR',
      category: 'emr_import',
      metadata: { provider, ...importCounts },
    })

    return NextResponse.json({
      success: true,
      provider,
      timestamp: new Date().toISOString(),
      records: importCounts,
    })
  } catch (error) {
    console.error('EMR import error:', error)
    return NextResponse.json({ error: 'Import failed' }, { status: 500 })
  }
}
