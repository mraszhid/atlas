import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return 'N/A'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return 'N/A'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function timeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const seconds = Math.floor((new Date().getTime() - d.getTime()) / 1000)
  
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
  return formatDate(d)
}

export function calculateAge(dob: Date | string): number {
  const birthDate = typeof dob === 'string' ? new Date(dob) : dob
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

// Translations for clinical summary (mocked but functional)
export const translations: Record<string, Record<string, string>> = {
  en: {
    clinicalSummary: 'Clinical Summary',
    allergies: 'Allergies',
    medications: 'Current Medications',
    conditions: 'Chronic Conditions',
    surgeries: 'Past Surgeries',
    emergencyContacts: 'Emergency Contacts',
    noAllergies: 'No known allergies',
    noMedications: 'No current medications',
    noConditions: 'No chronic conditions',
    noSurgeries: 'No past surgeries',
    verified: 'Verified by Clinician',
    unverified: 'Patient-Reported',
    organDonor: 'Organ Donor',
    advanceDirective: 'Advance Directive on File',
    emergencyAccess: 'Emergency Access',
    accessLogged: 'This access is being logged',
    timeLimited: 'Time-limited access',
  },
  es: {
    clinicalSummary: 'Resumen Clínico',
    allergies: 'Alergias',
    medications: 'Medicamentos Actuales',
    conditions: 'Condiciones Crónicas',
    surgeries: 'Cirugías Anteriores',
    emergencyContacts: 'Contactos de Emergencia',
    noAllergies: 'Sin alergias conocidas',
    noMedications: 'Sin medicamentos actuales',
    noConditions: 'Sin condiciones crónicas',
    noSurgeries: 'Sin cirugías anteriores',
    verified: 'Verificado por Médico',
    unverified: 'Reportado por Paciente',
    organDonor: 'Donante de Órganos',
    advanceDirective: 'Directiva Anticipada Registrada',
    emergencyAccess: 'Acceso de Emergencia',
    accessLogged: 'Este acceso está siendo registrado',
    timeLimited: 'Acceso por tiempo limitado',
  },
  fr: {
    clinicalSummary: 'Résumé Clinique',
    allergies: 'Allergies',
    medications: 'Médicaments Actuels',
    conditions: 'Maladies Chroniques',
    surgeries: 'Chirurgies Antérieures',
    emergencyContacts: 'Contacts d\'Urgence',
    noAllergies: 'Aucune allergie connue',
    noMedications: 'Aucun médicament actuel',
    noConditions: 'Aucune maladie chronique',
    noSurgeries: 'Aucune chirurgie antérieure',
    verified: 'Vérifié par Médecin',
    unverified: 'Déclaré par Patient',
    organDonor: 'Donneur d\'Organes',
    advanceDirective: 'Directive Anticipée Enregistrée',
    emergencyAccess: 'Accès d\'Urgence',
    accessLogged: 'Cet accès est enregistré',
    timeLimited: 'Accès limité dans le temps',
  },
  ar: {
    clinicalSummary: 'الملخص السريري',
    allergies: 'الحساسية',
    medications: 'الأدوية الحالية',
    conditions: 'الحالات المزمنة',
    surgeries: 'العمليات الجراحية السابقة',
    emergencyContacts: 'جهات اتصال الطوارئ',
    noAllergies: 'لا توجد حساسية معروفة',
    noMedications: 'لا توجد أدوية حالية',
    noConditions: 'لا توجد حالات مزمنة',
    noSurgeries: 'لا توجد عمليات جراحية سابقة',
    verified: 'تم التحقق من قبل الطبيب',
    unverified: 'أبلغ عنه المريض',
    organDonor: 'متبرع بالأعضاء',
    advanceDirective: 'توجيه مسبق مسجل',
    emergencyAccess: 'الوصول في حالات الطوارئ',
    accessLogged: 'يتم تسجيل هذا الوصول',
    timeLimited: 'وصول محدود المدة',
  },
  zh: {
    clinicalSummary: '临床摘要',
    allergies: '过敏史',
    medications: '当前用药',
    conditions: '慢性病症',
    surgeries: '既往手术',
    emergencyContacts: '紧急联系人',
    noAllergies: '无已知过敏',
    noMedications: '无当前用药',
    noConditions: '无慢性病症',
    noSurgeries: '无既往手术',
    verified: '医生已验证',
    unverified: '患者自报',
    organDonor: '器官捐献者',
    advanceDirective: '预先指示已存档',
    emergencyAccess: '紧急访问',
    accessLogged: '此次访问已被记录',
    timeLimited: '限时访问',
  },
}

export function t(key: string, lang: string = 'en'): string {
  return translations[lang]?.[key] || translations['en'][key] || key
}

// Document type labels
export const documentTypeLabels: Record<string, string> = {
  labs: 'Lab Results',
  imaging: 'Imaging/Radiology',
  discharge_summary: 'Discharge Summary',
  operative_notes: 'Operative Notes',
  consult_letter: 'Consultation Letter',
  prescription: 'Prescription',
  vaccination_record: 'Vaccination Record',
  other: 'Other',
}

// Share mode labels
export const shareModeLabels: Record<string, { label: string; description: string }> = {
  EMERGENCY: {
    label: 'Emergency Access',
    description: 'Minimal critical information for emergency responders',
  },
  CLINIC_VISIT: {
    label: 'Clinic Visit',
    description: 'Expanded health data for scheduled appointments',
  },
  MEDICAL_TOURISM: {
    label: 'Medical Tourism Intake',
    description: 'Full pre-visit documentation for international clinics',
  },
  INSURANCE: {
    label: 'Insurance Verification',
    description: 'Identity and coverage verification only',
  },
}

// Consent duration options
export const consentDurations = [
  { value: 15, label: '15 minutes' },
  { value: 60, label: '1 hour' },
  { value: 1440, label: '24 hours' },
  { value: 10080, label: '7 days' },
]
