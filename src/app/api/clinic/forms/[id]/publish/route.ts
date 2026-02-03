import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession, generateConsentToken } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'CLINIC_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const shareToken = generateConsentToken()

    const form = await prisma.intakeForm.update({
      where: { id },
      data: {
        isPublished: true,
        shareToken,
      },
    })

    return NextResponse.json({
      success: true,
      shareToken: form.shareToken,
    })
  } catch (error) {
    console.error('Publish form error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
