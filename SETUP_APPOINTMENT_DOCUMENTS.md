# Appointment Document Verification - Setup Guide

## Prerequisites

- Supabase project is already connected and configured
- Database migrations have been run (scripts/012_add_appointment_document.sql)
- Next.js application is set up

## Step 1: Create Supabase Storage Bucket

### Via Supabase Dashboard

1. Go to your Supabase Project Dashboard
2. Navigate to **Storage** section (left sidebar)
3. Click **Create a new bucket**
4. Name it: `appointment-documents`
5. Click **Create bucket**

### Configure Bucket Permissions

1. Select the `appointment-documents` bucket
2. Click the **Policies** tab
3. Add the following policy to allow authenticated users to upload:

**Policy Name:** Allow authenticated users to upload documents

```sql
CREATE POLICY "Allow authenticated users to upload documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'appointment-documents' AND
  (auth.uid())::text = (storage.foldername(name))[1]
);
```

4. Add policy to allow public read access:

**Policy Name:** Allow public read access to documents

```sql
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'appointment-documents');
```

## Step 2: Verify Database Migration

Run the migration script to add document fields to appointments table:

```bash
# Via Supabase CLI
supabase db push

# Or execute the SQL directly in Supabase SQL Editor
# From: scripts/012_add_appointment_document.sql
```

This adds the following columns to the `appointments` table:
- `document_url` (TEXT)
- `document_file_name` (TEXT)
- `document_uploaded_at` (TIMESTAMP)

## Step 3: Verify Environment Variables

Check that the following Supabase environment variables are set:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

These should already be configured from your initial setup.

## Step 4: Test the Feature

### Patient Testing

1. Navigate to "Book Appointment" page
2. Fill in all appointment details
3. Scroll to "Upload Document" section
4. Try uploading a test file:
   - Test valid file (JPEG, PNG, WebP, PDF)
   - Test invalid file (TXT, DOC, etc.) - should show error
   - Test large file (>5MB) - should show size error
5. Successfully upload a valid document
6. Submit appointment request
7. Verify email confirmation received

### Admin Testing

1. Navigate to Admin Dashboard → Appointments
2. Find the appointment you just created
3. Should see "Document" badge next to status
4. Click "View" button
5. In details dialog, scroll to "Uploaded Document" section
6. Verify document information is displayed
7. Click the link to open/view the document
8. Test approval/rejection process

## Verification Checklist

- [ ] Supabase storage bucket `appointment-documents` created
- [ ] Storage bucket policies configured (upload + read)
- [ ] Database migration executed successfully
- [ ] Environment variables are set correctly
- [ ] Patient can upload document in booking form
- [ ] Admin can view document in appointment details
- [ ] File type validation works (rejects non-image/PDF files)
- [ ] File size validation works (rejects >5MB files)
- [ ] Appointment cannot be submitted without document
- [ ] Document badge appears in appointment list

## Troubleshooting

### Bucket Not Found Error

**Issue:** "Bucket not found" when trying to upload

**Solution:**
1. Verify bucket name is exactly `appointment-documents`
2. Check bucket exists in Supabase Dashboard → Storage
3. Verify bucket is not private (should be public)

### Permission Denied Error

**Issue:** 403 Forbidden when uploading

**Solution:**
1. Check storage bucket policies are correctly configured
2. Verify user is authenticated
3. Check that authenticated user ID matches folder structure

### CORS Error

**Issue:** CORS error when accessing document URL

**Solution:**
1. Go to Supabase Project Settings
2. Check CORS configuration allows your domain
3. Add your domain to allowed origins if needed

### Document Not Saving to Database

**Issue:** Upload succeeds but document_url not in database

**Solution:**
1. Verify migration was executed successfully
2. Check database columns exist in appointments table
3. Verify API route returns correct URL format

## Testing File Examples

### Valid Test Files

You can create test files to verify uploads:

```bash
# Create a test image
convert -size 200x200 xc:blue test.jpg

# Create a test PDF (requires imagemagick)
convert xc:white test.pdf

# Or use any existing image from your device
```

### Test Upload Scenarios

1. **Valid JPEG:** Should upload successfully
2. **Valid PNG:** Should upload successfully
3. **Invalid TXT file:** Should show error "Only JPEG, PNG, WebP, and PDF are allowed"
4. **Large file (>5MB):** Should show error "File size exceeds 5MB limit"
5. **No file selected:** Should show error "Please upload a valid document"

## Performance Notes

- Document uploads are async and non-blocking
- Large files (4-5MB) may take a few seconds to upload
- Document URLs are public but tied to specific appointments
- Consider adding document expiry or auto-cleanup for old documents

## Security Reminders

1. Only authenticated users can upload documents
2. Documents are stored in user-specific directories
3. File paths include random tokens to prevent guessing
4. Validate file types on both client and server
5. Limit file size to prevent abuse
6. Consider encrypting sensitive documents

## Next Steps

1. Deploy application with document feature enabled
2. Inform patients about new document requirement
3. Train admins on reviewing documents
4. Monitor upload success rates
5. Consider implementing automated document validation in future

## Support

For issues with:
- **Supabase Storage:** Check [Supabase Documentation](https://supabase.com/docs/guides/storage)
- **Authentication:** Verify Supabase Auth configuration
- **File Uploads:** Check browser console for detailed error messages
