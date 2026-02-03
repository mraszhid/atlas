import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

function generateEmergencyCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    if (i === 4) code += '-'
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

async function main() {
  console.log('🌱 Seeding ATLAS database...')

  // Clear existing data in reverse dependency order
  await prisma.session.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.clinicNote.deleteMany()
  await prisma.clinicPatient.deleteMany()
  await prisma.intakeAttachment.deleteMany()
  await prisma.intakeSubmission.deleteMany()
  await prisma.intakeForm.deleteMany()
  await prisma.emrImport.deleteMany()
  await prisma.verification.deleteMany()
  await prisma.consentLink.deleteMany()
  await prisma.sharingPermission.deleteMany()
  await prisma.document.deleteMany()
  await prisma.insurance.deleteMany()
  await prisma.primaryPhysician.deleteMany()
  await prisma.labResult.deleteMany()
  await prisma.vaccination.deleteMany()
  await prisma.surgery.deleteMany()
  await prisma.condition.deleteMany()
  await prisma.medication.deleteMany()
  await prisma.allergy.deleteMany()
  await prisma.emergencyContact.deleteMany()
  await prisma.clinicStaff.deleteMany()
  await prisma.clinic.deleteMany()
  await prisma.insurer.deleteMany()
  await prisma.clinician.deleteMany()
  await prisma.patient.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await bcrypt.hash('demo123', 10)

  // ============ CREATE PATIENT ============
  console.log('👤 Creating patient...')
  
  const patientUser = await prisma.user.create({
    data: { email: 'patient@demo.atlas', passwordHash, role: 'PATIENT' },
  })

  const patient = await prisma.patient.create({
    data: {
      userId: patientUser.id,
      fullName: 'Muhammad Rashid',
      dateOfBirth: new Date('1985-03-15'),
      nationality: 'United Arab Emirates',
      passportNumber: 'P4829571',
      bloodType: 'O+',
      visaId: 'ATL-2024-0847',
      phone: '+971 50 123 4567',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Muhammad',
      preferredLanguage: 'en',
      emergencyCode: 'ATLAS-' + generateEmergencyCode(),
      emergencyLocked: false,
      organDonor: true,
      advanceDirective: 'No resuscitation if brain death confirmed. Healthcare proxy: Fatima Rashid (wife).',
      decisionMakerName: 'Fatima Rashid',
      decisionMakerPhone: '+971 50 987 6543',
    },
  })

  // Emergency Contacts
  await prisma.emergencyContact.createMany({
    data: [
      { patientId: patient.id, name: 'Fatima Al-Rashid', relationship: 'Wife', phone: '+971 50 987 6543' },
      { patientId: patient.id, name: 'Ahmed Al-Rashid', relationship: 'Brother', phone: '+971 55 234 5678' },
    ],
  })

  // Allergies
  await prisma.allergy.createMany({
    data: [
      { patientId: patient.id, allergen: 'Penicillin', reaction: 'Severe rash, difficulty breathing', severity: 'severe', verified: true, verifiedAt: new Date(), locked: true },
      { patientId: patient.id, allergen: 'Shellfish', reaction: 'Hives, facial swelling', severity: 'moderate', verified: false },
      { patientId: patient.id, allergen: 'Latex', reaction: 'Contact dermatitis', severity: 'mild', verified: false },
    ],
  })

  // Medications
  await prisma.medication.createMany({
    data: [
      { patientId: patient.id, name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', prescribedFor: 'Type 2 Diabetes', verified: true, verifiedAt: new Date(), locked: true },
      { patientId: patient.id, name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', prescribedFor: 'Hypertension', verified: true, verifiedAt: new Date(), locked: true },
      { patientId: patient.id, name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily at bedtime', prescribedFor: 'High cholesterol', verified: false },
    ],
  })

  // Conditions
  await prisma.condition.createMany({
    data: [
      { patientId: patient.id, name: 'Type 2 Diabetes Mellitus', diagnosedDate: new Date('2018-06-01'), notes: 'Well-controlled with medication', verified: true, verifiedAt: new Date(), locked: true },
      { patientId: patient.id, name: 'Essential Hypertension', diagnosedDate: new Date('2019-02-15'), notes: 'Stage 1, managed with medication', verified: true, verifiedAt: new Date(), locked: true },
      { patientId: patient.id, name: 'Hyperlipidemia', diagnosedDate: new Date('2020-01-10'), notes: 'LDL target achieved', verified: false },
    ],
  })

  // Surgeries
  await prisma.surgery.createMany({
    data: [
      { patientId: patient.id, procedure: 'Appendectomy', date: new Date('2010-08-20'), hospital: 'Cleveland Clinic Abu Dhabi', notes: 'Laparoscopic, uncomplicated', verified: true, verifiedAt: new Date(), locked: true },
      { patientId: patient.id, procedure: 'Knee Arthroscopy (Right)', date: new Date('2022-03-15'), hospital: 'Mediclinic City Hospital', notes: 'Meniscus repair', verified: false },
    ],
  })

  // Vaccinations
  await prisma.vaccination.createMany({
    data: [
      { patientId: patient.id, name: 'COVID-19 (Pfizer)', date: new Date('2021-03-15'), provider: 'Dubai Health Authority', lotNumber: 'EL9262', verified: true, verifiedAt: new Date() },
      { patientId: patient.id, name: 'COVID-19 Booster', date: new Date('2021-12-01'), provider: 'Dubai Health Authority', lotNumber: 'FL8374', verified: true },
      { patientId: patient.id, name: 'Influenza 2024-25', date: new Date('2024-10-15'), provider: 'Boots Pharmacy', verified: false },
      { patientId: patient.id, name: 'Hepatitis B', date: new Date('2015-05-01'), provider: 'Travel Clinic Dubai', verified: false },
    ],
  })

  // Lab Results
  await prisma.labResult.createMany({
    data: [
      { patientId: patient.id, testName: 'HbA1c', result: '6.8', unit: '%', referenceRange: '4.0-5.6%', date: new Date('2024-11-15'), provider: 'Mediclinic' },
      { patientId: patient.id, testName: 'Fasting Glucose', result: '128', unit: 'mg/dL', referenceRange: '70-100', date: new Date('2024-11-15'), provider: 'Mediclinic' },
      { patientId: patient.id, testName: 'Total Cholesterol', result: '185', unit: 'mg/dL', referenceRange: '<200', date: new Date('2024-11-15'), provider: 'Mediclinic' },
      { patientId: patient.id, testName: 'LDL Cholesterol', result: '98', unit: 'mg/dL', referenceRange: '<100', date: new Date('2024-11-15'), provider: 'Mediclinic' },
    ],
  })

  // Primary Physician
  await prisma.primaryPhysician.create({
    data: {
      patientId: patient.id,
      name: 'Dr. Sarah Chen',
      specialty: 'Internal Medicine',
      clinic: 'Dubai Medical Center',
      phone: '+971 4 555 1234',
      email: 'dr.chen@dubaimedical.ae',
      country: 'United Arab Emirates',
    },
  })

  // Documents
  await prisma.document.createMany({
    data: [
      { patientId: patient.id, title: 'Complete Blood Count - November 2024', type: 'labs', date: new Date('2024-11-15'), provider: 'Dr. Sarah Chen', facility: 'Mediclinic City Hospital', country: 'UAE', tags: 'CBC,blood,routine', fileName: 'cbc_nov2024.pdf', fileSize: 245000, mimeType: 'application/pdf', shareEmergency: false, shareClinicVisit: true },
      { patientId: patient.id, title: 'Knee MRI Report', type: 'imaging', date: new Date('2022-02-28'), provider: 'Dr. Ahmed Hassan', facility: 'Mediclinic City Hospital', country: 'UAE', tags: 'MRI,knee,orthopedic', fileName: 'knee_mri_2022.pdf', fileSize: 1200000, mimeType: 'application/pdf', shareEmergency: true, shareClinicVisit: true },
      { patientId: patient.id, title: 'Discharge Summary - Appendectomy', type: 'discharge_summary', date: new Date('2010-08-22'), provider: 'Cleveland Clinic', facility: 'Cleveland Clinic Abu Dhabi', country: 'UAE', tags: 'surgery,appendectomy', fileName: 'appendectomy_discharge.pdf', fileSize: 520000, mimeType: 'application/pdf', shareEmergency: true, shareClinicVisit: true },
      { patientId: patient.id, title: 'COVID-19 Vaccination Certificate', type: 'vaccination_record', date: new Date('2021-12-01'), provider: 'Dubai Health Authority', facility: 'DHA Vaccination Center', country: 'UAE', tags: 'vaccine,covid', fileName: 'covid_vaccine_cert.pdf', fileSize: 180000, mimeType: 'application/pdf', shareEmergency: false, shareClinicVisit: true },
    ],
  })

  // Insurance
  await prisma.insurance.create({
    data: {
      patientId: patient.id,
      providerName: 'GlobalTravel Insurance',
      policyNumber: 'GTI-2024-789456',
      groupNumber: 'CORP-UAE-100',
      coverageStart: new Date('2024-01-01'),
      coverageEnd: new Date('2024-12-31'),
      emergencyPhone: '+1 800 555 0123',
      planType: 'Premium International',
      isActive: true,
    },
  })

  // Sharing Permissions
  await prisma.sharingPermission.createMany({
    data: [
      { patientId: patient.id, shareMode: 'EMERGENCY', allergies: true, medications: true, conditions: true, surgeries: true, vaccinations: false, labResults: false, documents: false, insurance: false, advanceDirective: true },
      { patientId: patient.id, shareMode: 'CLINIC_VISIT', allergies: true, medications: true, conditions: true, surgeries: true, vaccinations: true, labResults: true, documents: true, insurance: true, advanceDirective: true },
      { patientId: patient.id, shareMode: 'MEDICAL_TOURISM', allergies: true, medications: true, conditions: true, surgeries: true, vaccinations: true, labResults: true, documents: true, insurance: true, advanceDirective: true },
      { patientId: patient.id, shareMode: 'INSURANCE', allergies: false, medications: false, conditions: false, surgeries: false, vaccinations: false, labResults: false, documents: false, insurance: true, advanceDirective: false },
    ],
  })

  // ============ CREATE CLINICIAN ============
  console.log('👨‍⚕️ Creating clinician...')
  
  const clinicianUser = await prisma.user.create({
    data: { email: 'clinician@demo.atlas', passwordHash, role: 'CLINICIAN' },
  })

  const clinician = await prisma.clinician.create({
    data: {
      userId: clinicianUser.id,
      fullName: 'Dr. Maria Rivera',
      licenseNumber: 'DHA-PHY-2019-8574',
      specialty: 'Internal Medicine',
      institution: "St. Mary's Medical Center",
      country: 'Ireland',
    },
  })

  // Add verification record
  const allergies = await prisma.allergy.findMany({ where: { patientId: patient.id, verified: true } })
  const medications = await prisma.medication.findMany({ where: { patientId: patient.id, verified: true } })
  
  await prisma.verification.create({
    data: {
      patientId: patient.id,
      clinicianId: clinician.id,
      category: 'allergies,medications,conditions',
      itemIds: [...allergies.map(a => a.id), ...medications.map(m => m.id)].join(','),
      signature: 'Dr. Maria Rivera, MD - DHA-PHY-2019-8574',
      institution: "St. Mary's Medical Center, Dublin",
      notes: 'Verified during clinic visit. Patient records consistent with medical history.',
    },
  })

  // ============ CREATE INSURER ============
  console.log('🏢 Creating insurer...')
  
  const insurerUser = await prisma.user.create({
    data: { email: 'insurer@demo.atlas', passwordHash, role: 'INSURER' },
  })

  await prisma.insurer.create({
    data: {
      userId: insurerUser.id,
      companyName: 'GlobalTravel Insurance',
      agentName: 'James Wilson',
    },
  })

  // ============ CREATE MEDICAL TOURISM CLINIC ============
  console.log('🏥 Creating medical tourism clinic...')
  
  const clinic = await prisma.clinic.create({
    data: {
      name: 'NovaMed Tourism Clinic',
      country: 'Thailand',
      city: 'Bangkok',
      address: '123 Sukhumvit Road, Bangkok 10110',
      phone: '+66 2 123 4567',
      email: 'intake@novamed.th',
      specialty: 'Multi-specialty',
      logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=NovaMed',
    },
  })

  // Clinic Admin
  const clinicAdminUser = await prisma.user.create({
    data: { email: 'clinic@demo.atlas', passwordHash, role: 'CLINIC_ADMIN' },
  })

  await prisma.clinicStaff.create({
    data: {
      userId: clinicAdminUser.id,
      clinicId: clinic.id,
      fullName: 'Dr. Somchai Prasert',
      role: 'ADMIN',
    },
  })

  // Clinic Staff
  const clinicStaffUser = await prisma.user.create({
    data: { email: 'staff@demo.atlas', passwordHash, role: 'CLINIC_STAFF' },
  })

  await prisma.clinicStaff.create({
    data: {
      userId: clinicStaffUser.id,
      clinicId: clinic.id,
      fullName: 'Nurse Priya Sharma',
      role: 'STAFF',
    },
  })

  // Create Intake Forms
  const cosmeticIntakeForm = await prisma.intakeForm.create({
    data: {
      clinicId: clinic.id,
      name: 'Cosmetic Surgery Pre-Visit Intake',
      description: 'Complete this form before your cosmetic surgery consultation',
      template: 'Cosmetic Surgery',
      isPublished: true,
      shareToken: 'novamed-cosmetic-intake-2024',
      sections: JSON.stringify([
        {
          id: 'medical_history',
          title: 'Medical History',
          fields: [
            { id: 'prev_surgeries', type: 'long_text', label: 'Previous surgeries or cosmetic procedures', required: true },
            { id: 'current_meds', type: 'long_text', label: 'Current medications and supplements', required: true },
            { id: 'allergies', type: 'long_text', label: 'Known allergies (medications, latex, anesthesia)', required: true },
            { id: 'bleeding_disorders', type: 'checkbox', label: 'I have a bleeding disorder or take blood thinners', required: false },
            { id: 'diabetes', type: 'checkbox', label: 'I have diabetes', required: false },
            { id: 'heart_condition', type: 'checkbox', label: 'I have a heart condition', required: false },
          ],
        },
        {
          id: 'procedure_info',
          title: 'Procedure Information',
          fields: [
            { id: 'procedure_interest', type: 'multiple_choice', label: 'Procedure of interest', options: ['Rhinoplasty', 'Facelift', 'Liposuction', 'Breast Augmentation', 'Tummy Tuck', 'Other'], required: true },
            { id: 'procedure_goals', type: 'long_text', label: 'What are your goals for this procedure?', required: true },
            { id: 'previous_consultation', type: 'multiple_choice', label: 'Have you had a consultation for this procedure before?', options: ['Yes', 'No'], required: true },
          ],
        },
        {
          id: 'travel_info',
          title: 'Travel Information',
          fields: [
            { id: 'arrival_date', type: 'date', label: 'Expected arrival date in Bangkok', required: true },
            { id: 'departure_date', type: 'date', label: 'Expected departure date', required: true },
            { id: 'companion', type: 'multiple_choice', label: 'Will you have a companion during recovery?', options: ['Yes', 'No'], required: true },
            { id: 'hotel', type: 'short_text', label: 'Hotel or accommodation name', required: false },
          ],
        },
        {
          id: 'documents',
          title: 'Medical Documents',
          fields: [
            { id: 'upload_request', type: 'file_upload', label: 'Please upload relevant medical records', required: false },
          ],
        },
        {
          id: 'consent',
          title: 'Consent',
          fields: [
            { id: 'consent_share', type: 'consent', label: 'I consent to share my medical information with NovaMed Tourism Clinic for the purpose of this consultation', required: true },
            { id: 'consent_accurate', type: 'consent', label: 'I confirm that all information provided is accurate to the best of my knowledge', required: true },
          ],
        },
      ]),
    },
  })

  // Orthopedic form
  await prisma.intakeForm.create({
    data: {
      clinicId: clinic.id,
      name: 'Orthopedic Surgery Pre-Visit Intake',
      description: 'Complete this form before your orthopedic consultation',
      template: 'Orthopedic Surgery',
      isPublished: true,
      shareToken: 'novamed-ortho-intake-2024',
      sections: JSON.stringify([
        {
          id: 'injury_info',
          title: 'Injury/Condition Information',
          fields: [
            { id: 'body_part', type: 'multiple_choice', label: 'Affected body part', options: ['Knee', 'Hip', 'Shoulder', 'Spine', 'Ankle', 'Other'], required: true },
            { id: 'injury_description', type: 'long_text', label: 'Describe your injury or condition', required: true },
            { id: 'injury_date', type: 'date', label: 'When did this injury/condition begin?', required: true },
            { id: 'previous_treatment', type: 'long_text', label: 'Previous treatments tried', required: false },
          ],
        },
        {
          id: 'medical_history',
          title: 'Medical History',
          fields: [
            { id: 'prev_surgeries', type: 'long_text', label: 'Previous orthopedic surgeries', required: false },
            { id: 'current_meds', type: 'long_text', label: 'Current medications', required: true },
            { id: 'allergies', type: 'long_text', label: 'Allergies', required: true },
          ],
        },
        {
          id: 'imaging',
          title: 'Imaging & Tests',
          fields: [
            { id: 'has_xray', type: 'checkbox', label: 'I have X-rays available', required: false },
            { id: 'has_mri', type: 'checkbox', label: 'I have MRI scans available', required: false },
            { id: 'upload_imaging', type: 'file_upload', label: 'Upload imaging files', required: false },
          ],
        },
        {
          id: 'consent',
          title: 'Consent',
          fields: [
            { id: 'consent_share', type: 'consent', label: 'I consent to share my medical information with NovaMed Tourism Clinic', required: true },
          ],
        },
      ]),
    },
  })

  // ============ CREATE ADDITIONAL PATIENTS ============
  console.log('👥 Creating additional patients...')

  // Patient 2 - Sarah Chen
  const patient2User = await prisma.user.create({
    data: { email: 'sarah@demo.atlas', passwordHash, role: 'PATIENT' },
  })

  const patient2 = await prisma.patient.create({
    data: {
      userId: patient2User.id,
      fullName: 'Sarah Chen',
      dateOfBirth: new Date('1992-07-22'),
      nationality: 'Singapore',
      passportNumber: 'K8273651',
      bloodType: 'A+',
      visaId: 'ATL-2024-1293',
      phone: '+65 9123 4567',
      preferredLanguage: 'en',
      emergencyCode: 'ATLAS-' + generateEmergencyCode(),
      emergencyLocked: false,
      organDonor: true,
    },
  })

  await prisma.allergy.createMany({
    data: [
      { patientId: patient2.id, allergen: 'Shellfish', severity: 'SEVERE', reaction: 'Anaphylaxis', verified: true, source: 'CLINICIAN' },
      { patientId: patient2.id, allergen: 'Latex', severity: 'MODERATE', reaction: 'Skin rash', verified: true, source: 'CLINICIAN' },
    ],
  })

  await prisma.medication.createMany({
    data: [
      { patientId: patient2.id, name: 'Levothyroxine', dosage: '50mcg', frequency: 'Once daily', prescribedFor: 'Dr. Wong', verified: true, source: 'CLINICIAN' },
    ],
  })

  await prisma.condition.createMany({
    data: [
      { patientId: patient2.id, name: 'Hypothyroidism', diagnosedDate: new Date('2019-03-15'), verified: true, source: 'CLINICIAN' },
    ],
  })

  // Patient 3 - James Wilson (different from insurer agent)
  const patient3User = await prisma.user.create({
    data: { email: 'james@demo.atlas', passwordHash, role: 'PATIENT' },
  })

  const patient3 = await prisma.patient.create({
    data: {
      userId: patient3User.id,
      fullName: 'James Anderson',
      dateOfBirth: new Date('1978-11-30'),
      nationality: 'United States',
      passportNumber: 'B12938475',
      bloodType: 'B-',
      visaId: 'ATL-2024-0562',
      phone: '+1 555 987 6543',
      preferredLanguage: 'en',
      emergencyCode: 'ATLAS-' + generateEmergencyCode(),
      emergencyLocked: false,
      organDonor: false,
    },
  })

  await prisma.allergy.createMany({
    data: [
      { patientId: patient3.id, allergen: 'Aspirin', severity: 'MODERATE', reaction: 'GI bleeding', verified: true, source: 'CLINICIAN' },
    ],
  })

  await prisma.medication.createMany({
    data: [
      { patientId: patient3.id, name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', prescribedFor: 'Dr. Smith', verified: true, source: 'CLINICIAN' },
      { patientId: patient3.id, name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', prescribedFor: 'Dr. Smith', verified: true, source: 'CLINICIAN' },
    ],
  })

  await prisma.condition.createMany({
    data: [
      { patientId: patient3.id, name: 'Hypertension', diagnosedDate: new Date('2015-06-20'), verified: true, source: 'CLINICIAN' },
      { patientId: patient3.id, name: 'Hyperlipidemia', diagnosedDate: new Date('2016-01-10'), verified: true, source: 'CLINICIAN' },
    ],
  })

  // Patient 4 - Maria Garcia
  const patient4User = await prisma.user.create({
    data: { email: 'maria@demo.atlas', passwordHash, role: 'PATIENT' },
  })

  const patient4 = await prisma.patient.create({
    data: {
      userId: patient4User.id,
      fullName: 'Maria Garcia',
      dateOfBirth: new Date('1988-04-12'),
      nationality: 'Spain',
      passportNumber: 'ESP928374',
      bloodType: 'AB+',
      visaId: 'ATL-2024-0891',
      phone: '+34 612 345 678',
      preferredLanguage: 'es',
      emergencyCode: 'ATLAS-' + generateEmergencyCode(),
      emergencyLocked: false,
      organDonor: true,
    },
  })

  await prisma.allergy.createMany({
    data: [
      { patientId: patient4.id, allergen: 'Sulfa drugs', severity: 'SEVERE', reaction: 'Stevens-Johnson syndrome risk', verified: true, source: 'CLINICIAN' },
    ],
  })

  // Add verifications for additional patients
  await prisma.verification.createMany({
    data: [
      { patientId: patient2.id, clinicianId: clinician.id, category: 'allergies,medications', itemIds: '', signature: 'Dr. Maria Rivera, MD', institution: "St. Mary's Medical Center", notes: 'Verified during telemedicine consultation' },
      { patientId: patient3.id, clinicianId: clinician.id, category: 'allergies,medications,conditions', itemIds: '', signature: 'Dr. Maria Rivera, MD', institution: "St. Mary's Medical Center", notes: 'Annual checkup verification' },
      { patientId: patient4.id, clinicianId: clinician.id, category: 'allergies', itemIds: '', signature: 'Dr. Maria Rivera, MD', institution: "St. Mary's Medical Center", notes: 'Emergency verification' },
    ],
  })

  // ============ ADD CLINIC PATIENTS ============
  console.log('🏥 Adding patients to clinic...')

  await prisma.clinicPatient.createMany({
    data: [
      { clinicId: clinic.id, patientId: patient.id, status: 'ACTIVE' },
      { clinicId: clinic.id, patientId: patient2.id, status: 'ACTIVE' },
      { clinicId: clinic.id, patientId: patient3.id, status: 'COMPLETED' },
      { clinicId: clinic.id, patientId: patient4.id, status: 'PENDING' },
    ],
  })

  // ============ ADD CLINIC NOTES ============
  const clinicStaff = await prisma.clinicStaff.findFirst({ where: { clinicId: clinic.id, role: 'ADMIN' } })
  if (clinicStaff) {
    await prisma.clinicNote.createMany({
      data: [
        { clinicPatientId: (await prisma.clinicPatient.findFirst({ where: { patientId: patient.id } }))!.id, staffId: clinicStaff.id, content: 'Patient arrived for initial consultation. All documents verified.' },
        { clinicPatientId: (await prisma.clinicPatient.findFirst({ where: { patientId: patient2.id } }))!.id, staffId: clinicStaff.id, content: 'Pre-operative assessment scheduled for next Tuesday.' },
      ],
    })
  }

  // Add some audit logs
  await prisma.auditLog.createMany({
    data: [
      { patientId: patient.id, actorType: 'PATIENT', actorId: patient.id, actorName: 'Muhammad Al-Rashid', action: 'CREATE', category: 'profile', metadata: JSON.stringify({ event: 'Account created' }) },
      { patientId: patient.id, actorType: 'CLINICIAN', actorId: clinician.id, actorName: 'Dr. Maria Rivera', actorInstitution: "St. Mary's Medical Center", action: 'VERIFY', category: 'allergies,medications', consentType: 'NORMAL' },
      { patientId: patient.id, actorType: 'PATIENT', actorId: patient.id, actorName: 'Muhammad Al-Rashid', action: 'CREATE', category: 'documents', documentTitle: 'Complete Blood Count - November 2024' },
    ],
  })

  console.log('')
  console.log('✅ ATLAS database seeded successfully!')
  console.log('')
  console.log('📋 Demo Credentials:')
  console.log('─────────────────────────────────────')
  console.log('Patient:      patient@demo.atlas / demo123')
  console.log('Clinician:    clinician@demo.atlas / demo123')
  console.log('Insurer:      insurer@demo.atlas / demo123')
  console.log('Clinic Admin: clinic@demo.atlas / demo123')
  console.log('Clinic Staff: staff@demo.atlas / demo123')
  console.log('─────────────────────────────────────')
  console.log('')
  console.log(`🆔 Patient Emergency Code: ${patient.emergencyCode}`)
  console.log('')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
