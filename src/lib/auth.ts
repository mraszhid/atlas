import { cookies } from 'next/headers'
import prisma from './prisma'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

export type UserRole = 'PATIENT' | 'CLINICIAN' | 'INSURER' | 'CLINIC_ADMIN' | 'CLINIC_STAFF'

export interface SessionUser {
  id: string
  email: string
  role: UserRole
  patientId?: string
  clinicianId?: string
  insurerId?: string
  clinicStaffId?: string
  clinicId?: string
  name?: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createSession(userId: string): Promise<string> {
  const sessionId = uuidv4()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  
  // Store session in database
  await prisma.session.create({
    data: {
      id: sessionId,
      userId,
      expiresAt,
    },
  })
  
  const cookieStore = await cookies()
  cookieStore.set('atlas_session', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  })
  
  return sessionId
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('atlas_session')?.value
    
    if (!sessionId) return null
    
    // Get session from database
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    })
    
    if (!session || session.expiresAt < new Date()) {
      // Clean up expired session
      if (session) {
        await prisma.session.delete({ where: { id: sessionId } }).catch(() => {})
      }
      return null
    }
    
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        patient: true,
        clinician: true,
        insurer: true,
        clinicStaff: {
          include: { clinic: true }
        },
      },
    })
    
    if (!user) return null
    
    const sessionUser: SessionUser = {
      id: user.id,
      email: user.email,
      role: user.role as UserRole,
    }
    
    if (user.patient) {
      sessionUser.patientId = user.patient.id
      sessionUser.name = user.patient.fullName
    }
    if (user.clinician) {
      sessionUser.clinicianId = user.clinician.id
      sessionUser.name = user.clinician.fullName
    }
    if (user.insurer) {
      sessionUser.insurerId = user.insurer.id
      sessionUser.name = user.insurer.companyName
    }
    if (user.clinicStaff) {
      sessionUser.clinicStaffId = user.clinicStaff.id
      sessionUser.clinicId = user.clinicStaff.clinicId
      sessionUser.name = user.clinicStaff.fullName
    }
    
    return sessionUser
  } catch (error) {
    console.error('Session error:', error)
    return null
  }
}

export async function destroySession(): Promise<void> {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('atlas_session')?.value
    
    if (sessionId) {
      await prisma.session.delete({ where: { id: sessionId } }).catch(() => {})
      cookieStore.delete('atlas_session')
    }
  } catch (error) {
    console.error('Destroy session error:', error)
  }
}

export async function requireAuth(allowedRoles?: UserRole[]): Promise<SessionUser> {
  const user = await getSession()
  
  if (!user) {
    throw new Error('UNAUTHORIZED')
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw new Error('FORBIDDEN')
  }
  
  return user
}

// Generate unique emergency code
export function generateEmergencyCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    if (i === 4) code += '-'
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

// Generate consent token
export function generateConsentToken(): string {
  return uuidv4().replace(/-/g, '').substring(0, 24)
}

// Clean up expired sessions (call periodically)
export async function cleanupExpiredSessions(): Promise<void> {
  await prisma.session.deleteMany({
    where: {
      expiresAt: { lt: new Date() }
    }
  })
}
