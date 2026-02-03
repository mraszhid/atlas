import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session || (session.role !== 'CLINIC_ADMIN' && session.role !== 'CLINIC_STAFF')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const clinicStaff = await prisma.clinicStaff.findUnique({
      where: { userId: session.id },
    })

    if (!clinicStaff) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 })
    }

    const forms = await prisma.intakeForm.findMany({
      where: { clinicId: clinicStaff.clinicId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(forms.map(f => ({
      ...f,
      sections: JSON.parse(f.sections),
    })))
  } catch (error) {
    console.error('Fetch forms error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'CLINIC_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const clinicStaff = await prisma.clinicStaff.findUnique({
      where: { userId: session.id },
    })

    if (!clinicStaff) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 })
    }

    const { name, description, template } = await request.json()

    // Generate default sections based on template
    let sections: Array<{ id: string; title: string; fields: Array<{ id: string; type: string; label: string; required: boolean; options?: string[] }> }> = []
    if (template === 'cosmetic') {
      sections = [
        {
          id: 'medical_history',
          title: 'Medical History',
          fields: [
            { id: 'prev_surgeries', type: 'long_text', label: 'Previous surgeries or cosmetic procedures', required: true },
            { id: 'current_meds', type: 'long_text', label: 'Current medications and supplements', required: true },
            { id: 'allergies', type: 'long_text', label: 'Known allergies', required: true },
          ],
        },
        {
          id: 'procedure_info',
          title: 'Procedure Information',
          fields: [
            { id: 'procedure_interest', type: 'multiple_choice', label: 'Procedure of interest', options: ['Rhinoplasty', 'Facelift', 'Liposuction', 'Other'], required: true },
            { id: 'procedure_goals', type: 'long_text', label: 'What are your goals?', required: true },
          ],
        },
        {
          id: 'consent',
          title: 'Consent',
          fields: [
            { id: 'consent_share', type: 'consent', label: 'I consent to share my medical information', required: true },
          ],
        },
      ]
    } else if (template === 'orthopedic') {
      sections = [
        {
          id: 'injury_info',
          title: 'Injury/Condition Information',
          fields: [
            { id: 'body_part', type: 'multiple_choice', label: 'Affected body part', options: ['Knee', 'Hip', 'Shoulder', 'Spine', 'Other'], required: true },
            { id: 'injury_description', type: 'long_text', label: 'Describe your injury', required: true },
          ],
        },
        {
          id: 'consent',
          title: 'Consent',
          fields: [
            { id: 'consent_share', type: 'consent', label: 'I consent to share my medical information', required: true },
          ],
        },
      ]
    }

    const form = await prisma.intakeForm.create({
      data: {
        clinicId: clinicStaff.clinicId,
        name,
        description,
        template,
        sections: JSON.stringify(sections),
        isPublished: false,
      },
    })

    return NextResponse.json({
      ...form,
      sections,
    })
  } catch (error) {
    console.error('Create form error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
