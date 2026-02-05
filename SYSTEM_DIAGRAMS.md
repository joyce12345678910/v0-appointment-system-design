# System Diagrams - Appointment Document Verification

## 1. Component Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      APPOINTMENT SYSTEM                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     PATIENT APPLICATION                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  /app/patient/book/page.tsx                                    │
│  ├── Doctor Selection                                          │
│  ├── Appointment Details                                       │
│  ├── Document Upload (NEW) ←──┐                               │
│  │   ├── File Input           │                               │
│  │   ├── Drag & Drop          │                               │
│  │   ├── Validation           │ Upload Endpoint               │
│  │   └── Progress             │                               │
│  └── Form Submission          │                               │
│      └── Must include doc ────┘                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

                           ↓

┌─────────────────────────────────────────────────────────────────┐
│                      API LAYER (BACKEND)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  POST /api/appointments/upload-document                        │
│  ├── Authenticate User                                        │
│  ├── Validate File                                            │
│  │   ├── Type Check (JPEG, PNG, WebP, PDF)                   │
│  │   └── Size Check (<5MB)                                    │
│  ├── Generate Filename                                        │
│  │   └── user-id/timestamp-random.ext                         │
│  ├── Upload to Storage                                        │
│  └── Return Public URL                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

    ↓                              ↓                    ↓

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ DATABASE         │  │ STORAGE BUCKET   │  │ EMAIL SERVICE    │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ appointments:    │  │ appointment-docs:│  │ Confirmation:    │
│ - id             │  │ - user-id/       │  │ - Appointment    │
│ - patient_id     │  │   123456-abc.pdf │  │   booked         │
│ - doctor_id      │  │ - user-id/       │  │ - Document       │
│ - date/time      │  │   234567-def.jpg │  │   uploaded       │
│ - reason         │  │                  │  │ - Pending status │
│ - status         │  │ Public URLs      │  │                  │
│ - doc_url (NEW)  │  │ (readable)       │  │ On Approval:     │
│ - doc_name (NEW) │  │                  │  │ - Appointment    │
│ - doc_time (NEW) │  │ Private files    │  │   approved       │
│                  │  │ (user-scoped)    │  │                  │
└──────────────────┘  └──────────────────┘  └──────────────────┘

                           ↓

┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN APPLICATION                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  /app/admin/appointments/page.tsx                              │
│  ├── Appointment List                                          │
│  │   ├── Status Badge                                          │
│  │   └── Document Badge (NEW) ←──┐                            │
│  └── View Details                │ Dialog View                │
│      └── appointment-details-dialog.tsx                        │
│          ├── Patient Info        │                            │
│          ├── Doctor Info         │                            │
│          ├── Appointment Details │                            │
│          ├── Reason              │                            │
│          └── Document Section (NEW)                           │
│              ├── File Name       │                            │
│              ├── Upload Time     │                            │
│              └── Download Link ──┘                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Data Flow Diagram

```
PATIENT UPLOAD FLOW
═══════════════════════════════════════════════════════════════════

1. Patient Upload
   ┌─────────────┐
   │ File Select │
   └──────┬──────┘
          │
          ↓ (Drag or Click)
   ┌──────────────┐
   │   Validate   │
   │ - Type OK?   │
   │ - Size OK?   │
   └──────┬───────┘
          │
          ├─ NO → Show Error Message → User Retries
          │
          └─ YES
              │
              ↓
         ┌──────────────────────────────┐
         │  Upload to API Endpoint      │
         │  /api/appointments/upload-doc│
         └──────────────┬───────────────┘
                        │
                        ↓
              ┌────────────────────┐
              │ Server Validation  │
              │ - Re-validate type │
              │ - Re-validate size │
              └────────┬───────────┘
                       │
                       ├─ FAIL → Return Error
                       │
                       └─ PASS
                           │
                           ↓
                  ┌──────────────────┐
                  │ Generate Filename│
                  │ user-id/         │
                  │ timestamp-random │
                  └────────┬─────────┘
                           │
                           ↓
                  ┌──────────────────┐
                  │ Upload to Storage│
                  │ (Supabase)       │
                  └────────┬─────────┘
                           │
                           ↓
                  ┌──────────────────┐
                  │ Get Public URL   │
                  │ Return to Client │
                  └────────┬─────────┘
                           │
                           ↓
              ┌────────────────────────┐
              │ Update Client State    │
              │ uploadedDocument = {   │
              │   url: "...",          │
              │   name: "..."          │
              │ }                      │
              └────────┬───────────────┘
                       │
                       ↓
              ┌────────────────────┐
              │ Show Success ✓     │
              │ Green Checkmark    │
              │ Show File Name     │
              └────────────────────┘

2. Form Submission
   ┌────────────────────┐
   │ User Clicks Submit │
   └────────┬───────────┘
            │
            ↓
   ┌──────────────────────────┐
   │ Check uploadedDocument   │
   │ exists?                  │
   └────────┬───────┬─────────┘
            │       │
      YES   │       │   NO
            │       └──→ Show Error
            │            "Upload required"
            │
            ↓
   ┌──────────────────────────┐
   │ Create Appointment with: │
   │ - All details            │
   │ - document_url (NEW)     │
   │ - document_file_name     │
   │ - document_uploaded_at   │
   │ - status: "pending"      │
   └────────┬───────────────┘
            │
            ↓
   ┌──────────────────────────┐
   │ Store in Database        │
   └────────┬───────────────┘
            │
            ↓
   ┌──────────────────────────┐
   │ Send Confirmation Email  │
   │ (Include doc info)       │
   └────────┬───────────────┘
            │
            ↓
   ┌──────────────────────────┐
   │ Redirect to Dashboard    │
   │ (Pending status)         │
   └──────────────────────────┘
```

---

## 3. Admin Review Flow

```
ADMIN REVIEW FLOW
═══════════════════════════════════════════════════════════════════

1. Admin Views List
   ┌───────────────────────────┐
   │ Appointments List         │
   │                           │
   │ [Pending] 📄 John Doe    │ ← Document badge
   │ [Pending]    Jane Smith  │
   │ [Approved]   Bob Wilson  │
   └───────┬───────────────────┘
           │ Click "View"
           ↓
   ┌─────────────────────────────┐
   │ Appointment Details Dialog  │
   │                             │
   │ Status: Pending             │
   │ Patient: John Doe           │
   │ Doctor: Dr. Smith           │
   │ Date: 2026-02-10            │
   │ Time: 14:00                 │
   │ Type: Consultation          │
   │ Reason: Back pain           │
   │                             │
   │ ┌─────────────────────────┐ │
   │ │ Uploaded Document       │ │
   │ │ ID_scan.pdf             │ │
   │ │ Uploaded: 2026-02-05... │ │
   │ │ [Download/View Link] 🔗 │ │
   │ └─────────────────────────┘ │
   └──────────┬──────────────────┘
              │
              ↓
   ┌─────────────────────────────┐
   │ Click Link to View Document │
   │ (Opens in new tab)          │
   └──────────┬──────────────────┘
              │
              ↓
   ┌─────────────────────────────┐
   │ Admin Reviews Document      │
   │ - Check validity            │
   │ - Verify document matches   │
   │   appointment reason        │
   │ - Confirm identity/docs OK  │
   └──────────┬──────────────────┘
              │
              ├─ Document Valid?
              │
         YES  │  NO
             │      │
             │      ↓
             │  ┌──────────────────┐
             │  │ Click Reject     │
             │  └────────┬─────────┘
             │           │
             │           ↓
             │  ┌──────────────────┐
             │  │ Add Rejection    │
             │  │ Notes (Optional) │
             │  └────────┬─────────┘
             │           │
             ↓           ↓
   ┌─────────────────────────────┐
   │ Click Approve/Reject Button │
   └──────────┬──────────────────┘
              │
              ↓
   ┌─────────────────────────────┐
   │ Update Status:              │
   │ - approved or cancelled     │
   │ - Set approved_at           │
   │ - Set approved_by (admin)   │
   └──────────┬──────────────────┘
              │
              ↓
   ┌─────────────────────────────┐
   │ Send Email to Patient       │
   │ - Approval/Rejection notice │
   │ - Next steps                │
   │ - Include document ref      │
   └─────────────────────────────┘
```

---

## 4. Database Schema Changes

```
BEFORE (Original)
═════════════════════════════════════════════════════════════════

appointments
┌──────────────────────────────────────────┐
│ id (PK)              [UUID]              │
│ patient_id (FK)      [UUID]              │
│ doctor_id (FK)       [UUID]              │
│ appointment_date     [DATE]              │
│ appointment_time     [TIME]              │
│ appointment_type     [TEXT]              │
│ reason               [TEXT]              │
│ status               [ENUM]              │
│ notes                [TEXT]              │
│ approved_by          [UUID]              │
│ approved_at          [TIMESTAMP]         │
│ created_at           [TIMESTAMP]         │
│ updated_at           [TIMESTAMP]         │
└──────────────────────────────────────────┘


AFTER (Enhanced)
═════════════════════════════════════════════════════════════════

appointments
┌──────────────────────────────────────────┐
│ id (PK)              [UUID]              │
│ patient_id (FK)      [UUID]              │
│ doctor_id (FK)       [UUID]              │
│ appointment_date     [DATE]              │
│ appointment_time     [TIME]              │
│ appointment_type     [TEXT]              │
│ reason               [TEXT]              │
│ status               [ENUM]              │
│ notes                [TEXT]              │
│ approved_by          [UUID]              │
│ approved_at          [TIMESTAMP]         │
│ document_url         [TEXT]      ← NEW   │
│ document_file_name   [TEXT]      ← NEW   │
│ document_uploaded_at [TIMESTAMP] ← NEW   │
│ created_at           [TIMESTAMP]         │
│ updated_at           [TIMESTAMP]         │
└──────────────────────────────────────────┘

NEW INDEX:
idx_appointments_document_url (document_url)
WHERE document_url IS NOT NULL
```

---

## 5. File Upload Architecture

```
CLIENT SIDE                          SERVER SIDE
══════════════════════════════════════════════════════════════════

┌──────────────────┐
│ File Input       │
│ Accept: JPEG,    │
│ PNG, WebP, PDF   │
└────────┬─────────┘
         │
         ↓ File Selected
┌──────────────────────────────┐
│ Validate Locally             │
│ - Check file type            │
│ - Check file size            │
│ - Show preview/name          │
└────────┬─────────────────────┘
         │
         ├─ FAIL → Show Error
         │
         └─ PASS
             │
             ↓
      [Show Loading]
             │
             ├─────────→ FormData {file}
             │           │
             │           ↓
             │      ┌──────────────────────┐
             │      │ /api/.../upload-doc  │
             │      │ POST                 │
             │      └──────────┬───────────┘
             │                 │
             │                 ↓
             │      ┌──────────────────────┐
             │      │ Authenticate User    │
             │      └──────────┬───────────┘
             │                 │
             │                 ├─ FAIL → Return 401
             │                 │
             │                 └─ PASS
             │                     │
             │                     ↓
             │          ┌──────────────────────┐
             │          │ Validate File        │
             │          │ - Type (server)      │
             │          │ - Size (server)      │
             │          └──────────┬───────────┘
             │                     │
             │                     ├─ FAIL → Return 400
             │                     │
             │                     └─ PASS
             │                         │
             │                         ↓
             │          ┌──────────────────────┐
             │          │ Generate Filename    │
             │          │ user-id/timestamp-   │
             │          │ random.ext           │
             │          └──────────┬───────────┘
             │                     │
             │                     ↓
             │          ┌──────────────────────┐
             │          │ Upload to Storage    │
             │          │ Supabase: bucket     │
             │          └──────────┬───────────┘
             │                     │
             │                     ├─ FAIL → Return 500
             │                     │
             │                     └─ PASS
             │                         │
             │                         ↓
             │          ┌──────────────────────┐
             │          │ Get Public URL       │
             │          │ https://...          │
             │          └──────────┬───────────┘
             │                     │
             ←─────────────────────┤
                                   │
                                Return JSON:
                                {
                                  success: true,
                                  url: "...",
                                  fileName: "...",
                                  path: "..."
                                }

         ↓ Response Received
    [Stop Loading]
         │
         ↓
    ┌──────────────────┐
    │ Update State:    │
    │ uploadedDocument │
    └────────┬─────────┘
         │
         ↓
    ┌──────────────────┐
    │ Show Success ✓   │
    │ with File Name   │
    └──────────────────┘
```

---

## 6. State Management

```
PATIENT BOOKING PAGE STATE
═════════════════════════════════════════════════════════════════

const BookAppointmentPage = () => {
  // Existing state
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [appointmentDate, setAppointmentDate] = useState("")
  const [appointmentTime, setAppointmentTime] = useState("")
  const [appointmentType, setAppointmentType] = useState("")
  const [reason, setReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  // NEW STATE (Document Upload)
  const [uploadedDocument, setUploadedDocument] = useState<{
    url: string
    name: string
  } | null>(null)
  const [isUploadingDocument, setIsUploadingDocument] = useState(false)
  const [documentError, setDocumentError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // ... handlers and JSX ...
}

STATE FLOW:
═════════════════════════════════════════════════════════════════

Initial State:
{
  uploadedDocument: null,
  isUploadingDocument: false,
  documentError: null,
  fileInputRef: HTMLInputElement | null
}

After File Selected:
{
  uploadedDocument: null,
  isUploadingDocument: true,
  documentError: null
}

Upload Success:
{
  uploadedDocument: {
    url: "https://...",
    name: "ID_scan.pdf"
  },
  isUploadingDocument: false,
  documentError: null
}

Upload Error:
{
  uploadedDocument: null,
  isUploadingDocument: false,
  documentError: "File size exceeds 5MB"
}
```

---

## 7. Component Hierarchy

```
App Structure
═════════════════════════════════════════════════════════════════

/patient/book
│
├── BookAppointmentPage (main component)
│   ├── Doctor Selection (Select component)
│   ├── Appointment Type (Select component)
│   ├── Date & Time (Input + Select)
│   ├── Reason (Textarea)
│   ├── Document Upload (NEW)
│   │   ├── Upload Area
│   │   │   ├── Icon (Upload)
│   │   │   ├── Text
│   │   │   ├── File Input (hidden)
│   │   │   └── Button (Select File)
│   │   ├── Success State
│   │   │   ├── Icon (CheckCircle)
│   │   │   ├── File Name
│   │   │   └── Button (X - remove)
│   │   └── Error State
│   │       ├── Icon (AlertCircle)
│   │       └── Error Message
│   └── Submit Button

/admin/appointments
│
├── AppointmentsPage
│   ├── Search Bar
│   ├── Tabs (All, Pending, Approved, etc.)
│   ├── Appointment List
│   │   └── Appointment Item (repeating)
│   │       ├── Status Badge
│   │       ├── Document Badge (NEW)
│   │       ├── Date/Time Badge
│   │       ├── Patient Info
│   │       ├── Doctor Info
│   │       └── View Button
│   └── AppointmentDetailsDialog
│       ├── Status
│       ├── Patient Info
│       ├── Doctor Info
│       ├── Appointment Details
│       ├── Reason
│       ├── Document Section (NEW)
│       │   ├── File Icon
│       │   ├── File Name
│       │   ├── Upload Time
│       │   └── Download Link
│       ├── Notes
│       └── Approval Info
```

---

## 8. Validation Flow

```
FILE VALIDATION PROCESS
═════════════════════════════════════════════════════════════════

1. CLIENT-SIDE VALIDATION (Immediate Feedback)
   ┌─────────────────────────┐
   │ File Selected           │
   └──────────┬──────────────┘
              │
              ├─ Check MIME Type
              │  Valid: image/jpeg, image/png, image/webp, application/pdf
              │  ├─ PASS → Continue
              │  └─ FAIL → Show Error, Stop
              │
              ├─ Check File Size
              │  Max: 5MB (5 * 1024 * 1024 bytes)
              │  ├─ PASS → Continue
              │  └─ FAIL → Show Error, Stop
              │
              └─ Upload to API
                 │
                 └─→ Server Side Validation


2. SERVER-SIDE VALIDATION (Security)
   ┌─────────────────────────────┐
   │ API Receives File           │
   └──────────┬──────────────────┘
              │
              ├─ Authenticate User
              │  ├─ PASS → Continue
              │  └─ FAIL → 401 Unauthorized
              │
              ├─ Check MIME Type Again
              │  ├─ PASS → Continue
              │  └─ FAIL → 400 Bad Request
              │
              ├─ Check File Size Again
              │  ├─ PASS → Continue
              │  └─ FAIL → 413 Payload Too Large
              │
              ├─ Read File Content
              │  ├─ PASS → Continue
              │  └─ FAIL → 500 Server Error
              │
              └─ Upload to Storage
                 ├─ PASS → Return 200 with URL
                 └─ FAIL → Return 500
```

---

## 9. Error Handling Flow

```
COMPREHENSIVE ERROR HANDLING
═════════════════════════════════════════════════════════════════

Upload Attempt
│
├─ No File Selected
│  └─ Show: "Please select a file"
│
├─ Invalid File Type
│  └─ Show: "Only JPEG, PNG, WebP, and PDF are allowed"
│
├─ File Size > 5MB
│  └─ Show: "File size must be less than 5MB"
│
├─ Network Error
│  └─ Show: "Upload failed. Please check internet and retry"
│
├─ Server Error (500)
│  └─ Show: "Failed to upload document. Try again later"
│
├─ Auth Error (401)
│  └─ Show: "Your session expired. Please login again"
│
├─ Storage Error
│  └─ Show: "Failed to save document. Try again"
│
└─ Success
   └─ Show: "✓ Document uploaded successfully"
```

---

## 10. Security Layers

```
SECURITY ARCHITECTURE
═════════════════════════════════════════════════════════════════

Level 1: Authentication
  ├─ User must be logged in
  ├─ Session validated
  └─ User ID extracted from token

Level 2: Authorization
  ├─ User can only upload for their own appointment
  ├─ Admin can only view approved documents
  └─ Document scoped to user directory

Level 3: File Validation
  ├─ Client-side type check (prevent user mistakes)
  ├─ Client-side size check (save bandwidth)
  ├─ Server-side type validation (security)
  ├─ Server-side size validation (prevent abuse)
  └─ MIME type verification

Level 4: File Storage
  ├─ Random filename (prevent enumeration)
  ├─ User-scoped directory (prevent cross-access)
  ├─ Unique identifiers (timestamp + random)
  ├─ Public URL obfuscation (tied to appointment)
  └─ Database record linking (audit trail)

Level 5: Transmission
  ├─ HTTPS only
  ├─ Authenticated endpoints
  ├─ Rate limiting (future)
  └─ CORS configuration

Result: Multi-layered security prevents unauthorized access
```

---

**All diagrams use ASCII art for documentation compatibility**

---

*Last Updated: 2026-02-05*
