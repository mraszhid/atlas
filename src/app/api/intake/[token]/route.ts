import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    const form = await prisma.intakeForm.findFirst({
      where: {
        shareToken: token,
        isPublished: true,
      },
      include: {
        clinic: {
          select: {
            name: true,
            city: true,
            country: true,
          },
        },
      },
    })

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: form.id,
      name: form.name,
      description: form.description,
      sections: JSON.parse(form.sections),
      clinic: form.clinic,
    })
  } catch (error) {
    console.error('Fetch form error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
