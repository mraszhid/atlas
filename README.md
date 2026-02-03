# ATLAS - Global Health Identity Platform

> Patient-owned, globally portable health records with secure sharing and emergency access.

![ATLAS](https://api.dicebear.com/7.x/identicon/svg?seed=atlas&size=64)

## Overview

ATLAS is a comprehensive health identity platform designed to solve the problem of international and cross-provider medical record fragmentation. It provides:

- **Patient-owned health records** with granular sharing permissions
- **Emergency access** via QR codes and emergency codes
- **Clinician verification** for record credibility
- **Medical tourism intake** with customizable forms
- **FHIR-compatible EMR integration** (simulated)
- **Complete audit logging** for transparency

## Quick Start

```bash
# Install dependencies
npm install

# Generate Prisma client and create database
npx prisma generate
npx prisma db push

# Seed demo data
npm run db:seed

# Start development server
npm run dev
```

Visit `http://localhost:3000`

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Patient | patient@demo.atlas | demo123 |
| Clinician | clinician@demo.atlas | demo123 |
| Insurer | insurer@demo.atlas | demo123 |
| Clinic Admin | clinic@demo.atlas | demo123 |
| Clinic Staff | staff@demo.atlas | demo123 |

**Demo Emergency Code:** Check the patient's Atlas Card or sidebar after logging in

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ATLAS Platform                               │
├─────────────────────────────────────────────────────────────────────┤
│  Frontend (Next.js App Router)                                       │
│  ├── Patient Dashboard & Health Wallet                               │
│  ├── Emergency Access Portal                                         │
│  ├── Clinician Verification Portal                                   │
│  ├── Medical Tourism Clinic Portal                                   │
│  └── Insurer Verification Portal                                     │
├─────────────────────────────────────────────────────────────────────┤
│  API Layer (Next.js API Routes)                                      │
│  ├── Authentication & Session Management                             │
│  ├── Patient Data CRUD                                               │
│  ├── Emergency Access with Audit Logging                             │
│  ├── Clinician Verification Workflows                                │
│  ├── Intake Form Management                                          │
│  └── EMR Import Simulation                                           │
├─────────────────────────────────────────────────────────────────────┤
│  Data Layer (SQLite via Prisma)                                      │
│  ├── Users & Authentication                                          │
│  ├── Patient Records (Allergies, Meds, Conditions, etc.)            │
│  ├── Documents Vault                                                 │
│  ├── Consent & Sharing Permissions                                   │
│  ├── Clinic & Intake Forms                                           │
│  └── Audit Logs                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Key Features

### Patient App
- Complete health wallet (allergies, medications, conditions, surgeries, vaccinations, labs)
- Document vault with upload, tagging, and sharing controls
- Atlas Card generation with QR code for emergency access
- Granular sharing permissions by category and share mode
- Advance directives and organ donor status
- Full audit log visibility

### Emergency Access
- QR code scanning opens emergency view
- Emergency code manual entry
- Passport number lookup (simulated)
- High-contrast, fast-loading critical info display
- Multilingual support (EN, ES, FR, AR, ZH)
- Emergency override with dual verification logging

### Clinician Portal
- Patient search and selection
- View patient-entered data
- Verify and digitally sign sections
- Locked records after verification

### Medical Tourism Clinic Portal
- No-code intake form builder
- Customizable question types
- Published forms with share links
- Patient import via QR/code
- Clinic-side EMR view with patient list, intake answers, documents

### EMR Integration
- FHIR-compatible data structures
- Simulated import from Epic, Cerner, etc.
- Records marked as "EMR Import" source

---

## 7-10 Minute Demo Script

### Setup (30 seconds)
1. Open browser to `http://localhost:3000`
2. Show landing page - explain ATLAS value proposition

### Act 1: Patient Creates Record (2 minutes)
1. Login as patient (patient@demo.atlas / demo123)
2. Show dashboard with existing seeded data
3. Navigate to **Health Wallet** - show allergies, medications, conditions
4. Point out **Verified** vs **Unverified** badges
5. Navigate to **Documents** - show uploaded documents with sharing flags
6. Click **Upload Document** - demonstrate the metadata fields and sharing toggles

### Act 2: Clinician Verifies Records (1.5 minutes)
1. Open new incognito window, login as clinician (clinician@demo.atlas / demo123)
2. Go to **Patients** tab
3. Select "Muhammad Al-Rashid"
4. Show patient data - point out unverified items
5. Click **Verify Records**
6. Select categories (allergies, medications)
7. Add signature note
8. Click **Sign & Verify**
9. Show items now marked as **Verified** and **Locked**

### Act 3: Generate Atlas Card (1 minute)
1. Return to patient window
2. Navigate to **Atlas Card**
3. Show the digital card with QR code and emergency code
4. Click **Download PDF** or **Print Card**
5. "This card goes in the patient's wallet or phone"

### Act 4: Emergency Access Demo (1.5 minutes)
1. Open new browser tab to `/emergency`
2. Copy the emergency code from patient's sidebar
3. Enter code in emergency access portal
4. "First responders see critical info immediately"
5. Show: identity, allergies (high-contrast), medications, conditions, emergency contacts
6. Toggle language to **Spanish** or **Arabic**
7. Point out: "Access is logged + time limited" banner
8. Point out: Organ donor status, advance directive flag

### Act 5: Audit Log (30 seconds)
1. Return to patient dashboard
2. Navigate to **Access History**
3. Show the emergency access log entry
4. "Patient sees complete transparency of who accessed their data"

### Act 6: Medical Tourism Clinic Flow (2 minutes)
1. Open new incognito window, login as clinic admin (clinic@demo.atlas / demo123)
2. Navigate to **Form Builder**
3. Click **New Form** - name it "Demo Consultation Intake"
4. Select **Cosmetic Surgery** template
5. Show the form builder interface - sections, field types
6. Click **Publish** - copy the share link
7. Open share link in patient's browser (while logged in as patient)
8. Fill out intake form - show question types
9. Submit intake
10. Return to clinic portal - go to **Import Patient**
11. Enter intake code or scan QR
12. Show patient imported into clinic patient list
13. Click to view - show intake answers, attached documents

### Act 7: EMR Import (30 seconds)
1. Return to patient dashboard
2. Navigate to **EMR Connect**
3. Select **Demo Hospital (Mock)**
4. Click **Import from EMR**
5. Show successful import with record counts
6. Return to Health Wallet - point out "Source: EMR Import" items

### Closing (30 seconds)
- "ATLAS is the missing identity, consent, and verification layer for global healthcare"
- "Every interaction is logged, patient-owned, consent-first"
- "Designed for travelers, expats, medical tourists, and healthcare providers worldwide"

---

## Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** SQLite (via Prisma)
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI primitives
- **Icons:** Lucide React
- **QR Generation:** qrcode library
- **Authentication:** Custom session-based auth

## File Structure

```
atlas/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Demo data seeding
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── patient/       # Patient dashboard pages
│   │   ├── clinician/     # Clinician portal pages
│   │   ├── clinic/        # Medical tourism clinic pages
│   │   ├── emergency/     # Emergency access page
│   │   └── intake/        # Public intake form pages
│   ├── components/        # React components
│   └── lib/               # Utilities, auth, prisma client
├── public/                # Static assets
└── package.json
```

## Security Notes (MVP Simulation)

This MVP simulates security patterns without implementing production-grade encryption:

- **Role-based access control** - enforced at API level
- **Consent tokens with expiry** - tracked in database
- **Audit logging** - all access recorded
- **Emergency override flow** - requires clinician ID and reason
- **Granular permissions** - by category and share mode

In production, you would add:
- End-to-end encryption for health data
- OAuth2/OpenID Connect for identity providers
- HSM-backed key management
- HIPAA/GDPR compliance controls
- Real FHIR server integration

## License

MIT - Built for demonstration purposes.

---

**ATLAS** - Your Health Identity, Anywhere in the World 🌍
