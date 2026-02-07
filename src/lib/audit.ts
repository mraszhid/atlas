import prisma from './prisma'

export type AuditAction = 
  | 'VIEW'
  | 'VERIFY'
  | 'DOWNLOAD'
  | 'IMPORT'
  | 'EMERGENCY_ACCESS'
  | 'EMERGENCY_OVERRIDE'
  | 'REVOKE'
  | 'SUBMIT_INTAKE'
  | 'CREATE_CONSENT'
  | 'ADD_NOTE'
  | 'IMPORT_EMR'
  | 'UPDATE'
  | 'CREATE'

export type ConsentType =
  | 'NORMAL'
  | 'EMERGENCY'
  | 'EMERGENCY_OVERRIDE'
  | 'MEDICAL_TOURISM'

interface AuditLogParams {
  patientId: string
  actorType: 'PATIENT' | 'CLINICIAN' | 'CLINIC_STAFF' | 'EMERGENCY_ACCESS' | 'SYSTEM'
  actorId?: string
  actorName?: string
  actorInstitution?: string
  action: AuditAction
  category?: string
  itemId?: string
  documentTitle?: string
  consentType?: ConsentType
  consentToken?: string
  ipAddress?: string
  userAgent?: string
  metadata?: Record<string, unknown>
}

export async function createAuditLog(params: AuditLogParams) {
  return prisma.auditLog.create({
    data: {
      patientId: params.patientId,
      actorType: params.actorType,
      actorId: params.actorId,
      actorName: params.actorName,
      actorInstitution: params.actorInstitution,
      action: params.action,
      category: params.category,
      itemId: params.itemId,
      documentTitle: params.documentTitle,
      consentType: params.consentType,
      consentToken: params.consentToken,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      metadata: params.metadata ? JSON.stringify(params.metadata) : null,
    },
  })
}

export async function getPatientAuditLogs(patientId: string, limit = 50) {
  return prisma.auditLog.findMany({
    where: { patientId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}
