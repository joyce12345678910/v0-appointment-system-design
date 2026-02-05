# Appointment Document Verification - Quick Start Checklist

## Pre-Launch Checklist

### Database & Storage (Do First)
- [ ] **Database Migration**: Execute `/scripts/012_add_appointment_document.sql`
  - Via Supabase CLI: `supabase db push`
  - Or via Supabase Dashboard SQL Editor
  - Columns added: `document_url`, `document_file_name`, `document_uploaded_at`

- [ ] **Supabase Storage Setup**:
  - [ ] Create bucket named: `appointment-documents`
  - [ ] Go to Storage → Create new bucket
  - [ ] Set bucket to PUBLIC (not private)

- [ ] **Storage Policies**: Add in Supabase Dashboard (Storage → Policies)
  - [ ] Policy 1: Allow authenticated users to upload
  - [ ] Policy 2: Allow public read access
  - (Exact SQL in SETUP_APPOINTMENT_DOCUMENTS.md)

### Code Verification
- [ ] All new files exist and no syntax errors:
  - [ ] `/app/api/appointments/upload-document/route.ts`
  - [ ] `/APPOINTMENT_DOCUMENT_VERIFICATION.md`
  - [ ] `/SETUP_APPOINTMENT_DOCUMENTS.md`
  - [ ] `/APPOINTMENT_DOCUMENT_IMPLEMENTATION.md`

- [ ] Updated files compile correctly:
  - [ ] `/app/patient/book/page.tsx`
  - [ ] `/components/appointment-details-dialog.tsx`
  - [ ] `/app/admin/appointments/page.tsx`
  - [ ] `/lib/types.ts`

### Environment Variables
- [ ] Verify existing variables are set:
  ```env
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  SUPABASE_SERVICE_ROLE_KEY (for server-side)
  ```

### Application Testing
- [ ] Application starts without errors
- [ ] No console errors on admin pages
- [ ] No console errors on patient booking page

## Testing Phase (Before Going Live)

### Phase 1: Basic Functionality (Day 1)
- [ ] **Patient Testing**
  - [ ] Navigate to Book Appointment page
  - [ ] Page loads without errors
  - [ ] Upload document section visible
  - [ ] Successfully upload a test image file
  - [ ] File appears with checkmark
  - [ ] Can see file name displayed
  - [ ] Complete and submit appointment

- [ ] **Database Verification**
  - [ ] Query appointments table shows new document columns
  - [ ] New appointment has `document_url` populated
  - [ ] New appointment has `document_file_name` populated
  - [ ] New appointment has `document_uploaded_at` populated

### Phase 2: Admin Review (Day 1-2)
- [ ] **Admin Testing**
  - [ ] Navigate to Admin Appointments
  - [ ] Appointment shows "Document" badge
  - [ ] Click "View" on appointment with document
  - [ ] Details dialog opens without errors
  - [ ] Document section visible in dialog
  - [ ] Document file name displayed correctly
  - [ ] Document upload timestamp shown
  - [ ] Can click link to open document
  - [ ] Document opens in new tab/window
  - [ ] Can download document if PDF

### Phase 3: Validation Testing (Day 2-3)
- [ ] **File Type Validation**
  - [ ] Upload JPEG → Success
  - [ ] Upload PNG → Success
  - [ ] Upload WebP → Success
  - [ ] Upload PDF → Success
  - [ ] Upload TXT file → Shows error
  - [ ] Upload DOC file → Shows error
  - [ ] Upload ZIP file → Shows error

- [ ] **File Size Validation**
  - [ ] Upload 1MB file → Success
  - [ ] Upload 5MB file → Success
  - [ ] Upload 5.1MB file → Shows error
  - [ ] Upload 10MB file → Shows error

- [ ] **Required Field Validation**
  - [ ] Try submitting without document → Shows error
  - [ ] Error message clear and helpful
  - [ ] Cannot proceed without uploading

### Phase 4: Edge Cases (Day 3-4)
- [ ] **Network Issues**
  - [ ] Slow upload completes successfully
  - [ ] Cancel upload and retry works
  - [ ] Network error shows helpful message

- [ ] **Multiple Appointments**
  - [ ] Create 5+ appointments with different documents
  - [ ] Each shows correct document in admin view
  - [ ] No document mixing between appointments

- [ ] **Approval/Rejection Flow**
  - [ ] Admin can approve appointment with document
  - [ ] Admin can reject appointment with document
  - [ ] Patient receives correct approval email
  - [ ] Patient receives correct rejection email

## Go-Live Checklist

### Pre-Launch (2 Hours Before)
- [ ] All testing phases completed successfully
- [ ] No critical bugs found
- [ ] Backup of database created
- [ ] Team briefed on new feature
- [ ] Customer communication prepared

### Launch (Go-Live)
- [ ] Deploy code to production
- [ ] Verify all environment variables set correctly
- [ ] Test appointment booking in production
- [ ] Test admin viewing of documents
- [ ] Monitor error logs
- [ ] Have rollback plan ready

### Post-Launch (First 24 Hours)
- [ ] Monitor for upload errors
- [ ] Check storage usage
- [ ] Review user feedback
- [ ] Monitor email delivery
- [ ] Check admin approval speed
- [ ] Verify document links working

## Feature Status Check

| Component | Status | Details |
|-----------|--------|---------|
| Database Migration | ✅ Ready | 3 new columns added |
| API Upload Endpoint | ✅ Ready | Full error handling |
| Patient UI | ✅ Ready | Drag-drop upload |
| Admin UI | ✅ Ready | Document viewing |
| Type Definitions | ✅ Ready | Updated types |
| Documentation | ✅ Ready | 3 detailed docs |
| Storage Setup | ⏳ Action | Create bucket |
| Storage Policies | ⏳ Action | Add 2 policies |

## Known Limitations (Design Choices)

1. **Single Document Upload**
   - Currently one document per appointment
   - Future: Support multiple documents

2. **No Auto-Approval**
   - All documents require admin review
   - Future: OCR-based auto-validation

3. **No Document Expiry**
   - Documents stored indefinitely
   - Future: Auto-cleanup after X days

4. **No Encryption**
   - Documents stored in plain text
   - Future: Encryption at rest

5. **No Virus Scanning**
   - No malware/virus detection
   - Future: Integrate scanning service

## Support & Troubleshooting

### If Uploads Fail
1. Check error message in application
2. Verify file type (JPEG, PNG, WebP, PDF only)
3. Verify file size (<5MB)
4. Check browser console for details
5. See SETUP_APPOINTMENT_DOCUMENTS.md troubleshooting

### If Document Not Visible to Admin
1. Check Supabase Storage bucket permissions
2. Verify bucket is PUBLIC
3. Check database has document_url stored
4. Refresh admin page

### If Appointment Cannot Submit
1. Verify document uploaded (should show checkmark)
2. Check error message
3. Verify all fields filled
4. Check browser console

## Success Criteria

✅ Feature is successful if:
- Patients can upload documents when booking
- Documents cannot be forgotten (required field)
- Admin can see all documents for review
- Documents persist correctly in database
- Email confirmations include appointment status
- No data loss during uploads
- No security vulnerabilities

❌ Feature needs fixes if:
- Upload fails more than 5% of the time
- Documents not visible to admin
- File validation not working
- Database columns not created
- Storage bucket permissions wrong

## Quick Reference URLs

- **Setup Guide**: SETUP_APPOINTMENT_DOCUMENTS.md
- **Full Feature Docs**: APPOINTMENT_DOCUMENT_VERIFICATION.md
- **Implementation Details**: APPOINTMENT_DOCUMENT_IMPLEMENTATION.md
- **Supabase Docs**: https://supabase.com/docs/guides/storage

## Support Contact

If issues arise:
1. Check SETUP_APPOINTMENT_DOCUMENTS.md troubleshooting section
2. Review browser console for detailed errors
3. Check Supabase dashboard for bucket/policy issues
4. Review logs in /app/api/appointments/upload-document/route.ts

---

**Last Updated:** 2026-02-05  
**Feature Status:** Ready for Deployment  
**Estimated Time to Deploy:** 1-2 hours  
**Estimated Time to Test:** 2-4 hours
