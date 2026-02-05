# Appointment Document Verification System

## Overview

The appointment system has been enhanced with a document verification feature to ensure appointments are valid and prevent fake or incomplete requests. Patients must now upload a valid document (ID, referral slip, or required medical document) when submitting an appointment request.

## Features

### Patient-Side Features

#### Required Document Upload
- Patients must upload a document before submitting an appointment request
- Supported file types: JPEG, PNG, WebP, and PDF
- Maximum file size: 5MB
- Clear error messages if document is missing or invalid

#### File Upload UI
- Drag-and-drop enabled upload interface
- Visual feedback for successful uploads
- File validation with helpful error messages
- Ability to remove and re-upload documents
- Upload progress indicator

#### Validation Rules
1. **File Type Validation**: Only image and PDF files accepted
   - JPEG (.jpg, .jpeg)
   - PNG (.png)
   - WebP (.webp)
   - PDF (.pdf)

2. **File Size Validation**: Maximum 5MB per file

3. **Required Field**: Document upload is mandatory before appointment submission

### Admin-Side Features

#### View Uploaded Documents
- Admins can see all uploaded documents in the appointment details dialog
- Documents are displayed with:
  - Original file name
  - Upload timestamp
  - Clickable link to view/download the document
  - File icon for visual identification

#### Approval Based on Document
- Admins review the document before approving
- Document information visible during approval/rejection process
- Can approve or reject appointments based on document validity

#### Document Badge
- Appointments with documents show a "Document" badge in the list
- Green badge indicates document successfully uploaded
- Easy identification of appointments with supporting documents

## Database Schema

### New Columns Added to `appointments` Table

```sql
- document_url (TEXT): URL to the uploaded document stored in Supabase Storage
- document_file_name (TEXT): Original file name of the uploaded document
- document_uploaded_at (TIMESTAMP): When the document was uploaded
```

## API Endpoints

### POST `/api/appointments/upload-document`

Uploads an appointment document to Supabase Storage.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: FormData with 'file' field

**Response:**
```json
{
  "success": true,
  "url": "https://...",
  "fileName": "document.pdf",
  "path": "user-id/timestamp-random.pdf"
}
```

**Error Responses:**
- 400: No file provided or invalid file type
- 401: Not authenticated
- 413: File size exceeds 5MB limit
- 500: Upload failed

## Storage Configuration

### Supabase Storage Setup

Documents are stored in the `appointment-documents` bucket:
- Bucket name: `appointment-documents`
- Visibility: Public (URLs are public)
- File path format: `{user-id}/{timestamp}-{random}.{ext}`

**Note:** The storage bucket must be created in Supabase with public read access.

## Updated Type Definitions

The `Appointment` interface now includes:
```typescript
document_url?: string
document_file_name?: string
document_uploaded_at?: string
```

## User Flow

### Patient Booking Flow
1. Patient navigates to "Book Appointment" page
2. Fills in appointment details (doctor, date, time, reason)
3. Scrolls to "Upload Document" section
4. Clicks to upload or drags a file into the upload area
5. Selects file from device (JPEG, PNG, WebP, or PDF, max 5MB)
6. Document uploads successfully (shown with checkmark)
7. Can view uploaded file name
8. Can remove and re-upload if needed
9. Submits appointment request with document
10. Receives confirmation email with appointment status as "Pending"

### Admin Review Flow
1. Admin navigates to "Appointments" page
2. Sees appointment with "Document" badge
3. Clicks "View" button to see appointment details
4. Views uploaded document in the details dialog
5. Clicks link to open/download document for verification
6. Reviews document against appointment reason
7. Approves or rejects appointment based on document validity
8. If approved: Patient receives approval email
9. If rejected: Patient receives rejection email and can resubmit

## Security Considerations

1. **File Validation**: Files validated by type and size on both client and server
2. **Authentication**: Only authenticated users can upload documents
3. **File Organization**: Documents stored in user-specific directories
4. **Public URLs**: Document URLs are public but tied to specific appointments
5. **No Sensitive Data**: Only medical/ID documents should be uploaded

## System Rules

- Appointment status remains "Pending" until admin review
- Patients cannot proceed without uploading a document
- Only approved appointments can be confirmed
- Document upload is permanent - cannot be removed after approval
- Rejected appointments show clear reason to patient

## Implementation Details

### Client-Side (React)
- Uses `handleDocumentUpload()` to process selected files
- Validates file type and size before upload
- Shows upload progress and feedback
- Stores document URL in component state
- Validates document upload before form submission

### Server-Side (API Route)
- Authenticates user via Supabase
- Validates file type and size on server
- Generates unique file name with timestamp and random value
- Uploads to Supabase Storage bucket
- Returns public URL and file metadata

### Database
- Stores document URL, file name, and upload timestamp
- Maintains audit trail of document uploads

## Troubleshooting

### Document Upload Fails
- Check file size (must be under 5MB)
- Verify file type (JPEG, PNG, WebP, or PDF only)
- Ensure internet connection is stable
- Check Supabase Storage bucket configuration

### Document Not Visible in Admin View
- Ensure document_url is stored in database
- Check that Supabase Storage bucket is public
- Verify file still exists in storage

### Appointment Submission Fails with Document
- Document must be successfully uploaded first (show checkmark)
- File must be a valid type
- Check all other required fields are filled

## Future Enhancements

Potential improvements:
- Document type categorization (ID, Referral, etc.)
- OCR validation to extract document information
- Document expiry dates (e.g., ID valid for 5 years)
- Multiple document uploads per appointment
- Document templates for specific appointment types
- Automated document validation and approval
