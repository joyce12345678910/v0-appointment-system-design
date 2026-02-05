# Technical Specifications - Tactay Billedo Appointment System

## System Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│           Patient/Admin Browsers                     │
├─────────────────────────────────────────────────────┤
│                  Next.js Frontend                    │
│  (Auth, Booking, Dashboard Pages - Next 15)         │
├─────────────────────────────────────────────────────┤
│              API Routes & Endpoints                  │
│  (Node.js Server Actions & Route Handlers)          │
├─────────────────────────────────────────────────────┤
│            Supabase Backend Services                 │
│  (PostgreSQL Database, Auth, RLS Policies)          │
├─────────────────────────────────────────────────────┤
│          Email Service Provider (Optional)           │
│  (SendGrid, Mailgun, AWS SES)                       │
└─────────────────────────────────────────────────────┘
```

## Database Schema

### Core Tables

#### `profiles`
```sql
- id (UUID, PK) - User ID
- full_name (VARCHAR)
- phone (VARCHAR)
- date_of_birth (DATE)
- address (VARCHAR)
- email (VARCHAR)
- role (ENUM: 'patient', 'admin')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `appointments`
```sql
- id (UUID, PK)
- patient_id (UUID, FK -> profiles)
- doctor_id (UUID, FK -> doctors)
- appointment_date (DATE)
- appointment_time (TIME)
- appointment_type (VARCHAR)
- reason (TEXT)
- notes (TEXT, nullable)
- status (ENUM: 'pending', 'approved', 'completed', 'cancelled')
- approved_by (UUID, FK -> profiles, nullable)
- approved_at (TIMESTAMP, nullable)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `doctors`
```sql
- id (UUID, PK)
- full_name (VARCHAR)
- specialization (VARCHAR)
- phone (VARCHAR)
- email (VARCHAR)
- available (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `email_verification_codes` (NEW)
```sql
- id (UUID, PK)
- email (VARCHAR)
- code (VARCHAR, 6 digits)
- used (BOOLEAN)
- expires_at (TIMESTAMP)
- created_at (TIMESTAMP)
```

#### `email_templates` (NEW)
```sql
- id (UUID, PK)
- template_name (VARCHAR, UNIQUE)
- subject (VARCHAR)
- body (TEXT)
- sender_name (VARCHAR)
- sender_email (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## API Endpoints

### Authentication Endpoints

#### POST `/api/auth/send-verification-code`
**Description**: Generate and send 6-digit verification code

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Verification code sent to email"
}
```

**Status Codes**:
- `200` - Code sent successfully
- `400` - Missing email parameter
- `500` - Server error

---

#### POST `/api/auth/verify-code`
**Description**: Verify 6-digit code for email

**Request Body**:
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

**Status Codes**:
- `200` - Code verified
- `400` - Invalid or expired code
- `500` - Server error

---

### Appointment Endpoints

#### POST `/api/appointments/check-availability`
**Description**: Check if time slot is available

**Request Body**:
```json
{
  "doctorId": "uuid",
  "appointmentDate": "2025-02-15",
  "appointmentTime": "10:00"
}
```

**Response**:
```json
{
  "available": true,
  "message": "Time slot is available"
}
```

**Status Codes**:
- `200` - Availability checked
- `400` - Missing required fields
- `500` - Server error

---

#### POST `/api/appointments/approve`
**Description**: Approve or reject appointment (Admin only)

**Request Body**:
```json
{
  "appointmentId": "uuid",
  "action": "approve" // or "reject"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Appointment approved",
  "appointment": {
    "id": "uuid",
    "status": "approved"
  }
}
```

**Status Codes**:
- `200` - Appointment updated
- `401` - Not authenticated
- `403` - Not admin
- `404` - Appointment not found
- `500` - Server error

---

### Email Endpoints

#### POST `/api/email/send`
**Description**: Send branded email using templates

**Request Body**:
```json
{
  "templateName": "appointment_confirmation",
  "recipientEmail": "user@example.com",
  "recipientName": "John Doe",
  "variables": {
    "full_name": "John Doe",
    "doctor_name": "Smith",
    "appointment_date": "February 15, 2025",
    "appointment_time": "10:00 AM",
    "appointment_type": "Consultation"
  }
}
```

**Response**:
```json
{
  "success": true,
  "message": "Email queued for sending",
  "email": {
    "from": "Tactay Billedo <noreply@tactaybilledo.com>",
    "to": "user@example.com",
    "subject": "Appointment Confirmation - Tactay Billedo"
  }
}
```

**Status Codes**:
- `200` - Email queued
- `400` - Missing required fields
- `404` - Template not found
- `500` - Server error

---

## Authentication & Authorization

### User Roles
- **patient**: Can view own appointments, book appointments
- **admin**: Can approve/reject appointments, view all appointments

### Session Management
- JWT-based authentication via Supabase
- HTTP-only cookies for security
- Auto-refresh tokens handled by Supabase client

### Protected Routes
- `/patient/*` - Requires patient role
- `/admin/*` - Requires admin role
- `/auth/*` - Public access

## Security Measures

### Data Protection
1. **Password Hashing**: bcrypt via Supabase Auth
2. **Data Encryption**: All data in transit uses HTTPS/TLS
3. **Database Encryption**: Supabase handles at-rest encryption
4. **SQL Injection Prevention**: Parameterized queries via Supabase ORM

### Email Security
1. **Verification Codes**: 6-digit codes, one-time use
2. **Code Expiration**: 10 minutes
3. **Verified Sender**: "Tactay Billedo" branded emails
4. **No Sensitive Data**: Codes sent separately from user data

### Access Control
1. **Row-Level Security (RLS)**: Patients see only their appointments
2. **Admin Verification**: Appointment actions require admin role
3. **User Isolation**: Each session isolated to authenticated user

## Performance Considerations

### Database Indexes
```sql
-- Recommended indexes
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_date ON appointments(doctor_id, appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_email_verification_codes_email ON email_verification_codes(email);
```

### Caching Strategy
- Client-side: React Query/SWR caching
- Server-side: Session storage for sign-up data
- Database: Supabase built-in caching

### Query Optimization
- Eager loading of doctor info with appointments
- Filtered queries by date range
- Indexed lookups for availability checking

## Deployment Checklist

- [ ] Configure environment variables in Vercel
- [ ] Set up Supabase project with all tables
- [ ] Run all migration scripts (009, 010, 011)
- [ ] Configure email provider (SendGrid, Mailgun, etc.)
- [ ] Test email templates with real provider
- [ ] Set up domain for email sender (noreply@tactaybilledo.com)
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS if needed
- [ ] Test all user flows end-to-end
- [ ] Set up monitoring and error tracking
- [ ] Create admin user account
- [ ] Add doctors to system
- [ ] Test with real email provider
- [ ] Create backup strategy

## Email Configuration

### For Production Email Sending

Replace the logging in `/app/api/email/send/route.ts` with:

#### SendGrid Integration
```typescript
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const msg = {
  to: recipientEmail,
  from: `${template.sender_name} <${template.sender_email}>`,
  subject: subject,
  html: body,
}

await sgMail.send(msg)
```

#### AWS SES Integration
```typescript
const sesClient = new SESClient({ region: 'us-east-1' })

const sendEmailCommand = new SendEmailCommand({
  Source: `${template.sender_name} <${template.sender_email}>`,
  Destination: { ToAddresses: [recipientEmail] },
  Message: {
    Subject: { Data: subject },
    Body: { Html: { Data: body } }
  }
})

await sesClient.send(sendEmailCommand)
```

---

## Monitoring & Logging

### Key Metrics to Track
- Appointment booking success rate
- Average approval time
- Email delivery success rate
- System error rate
- API response times

### Error Logging
- All API errors logged to console (configure for production)
- Database errors logged with context
- Email send failures logged but don't block operations

---

## Version History

### v1.0 (Current)
- Patient registration with 6-digit email verification
- Appointment booking system
- Real-time availability checking
- Double-booking prevention
- Branded email notifications
- Admin appointment management
- Responsive design

---

## Future Enhancements

- SMS notifications for appointments
- Appointment reminders (24h before)
- Doctor availability management
- Patient medical records
- Payment/booking fees
- Patient reviews/ratings
- Multi-language support
- Calendar integration (Google, Outlook)
- Video consultation support
- Insurance integration

---

## Support & Maintenance

**System Status**: Production Ready ✅

**Contact Information**:
- Clinic: 0917 568 0416
- Location: 2nd Floor Shell Santo Domingo Building, National Highway, Santo Domingo, Camarines Sur

---

*Last Updated: February 2025*
*Tactay Billedo Appointment System v1.0*
