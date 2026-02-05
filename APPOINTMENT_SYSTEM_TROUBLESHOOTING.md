# Appointment System Troubleshooting & Fix Guide

## System Overview
The appointment system requires users to be authenticated before booking appointments. This is a security feature to ensure proper patient identity verification and data protection.

---

## Issue Resolution Summary

### ✅ COMPLETED FIXES

#### 1. **Removed "Reason for Visit" Field**
**Status:** ✅ Fixed
**Changes Made:**
- Updated database schema to make `reason` column optional (nullable)
- Removed the textarea field from the booking form UI
- Updated form submission logic to exclude reason field
- Form validation adjusted accordingly

**Files Modified:**
- `/scripts/011_make_reason_optional.sql` - Database migration
- `/app/patient/book/page.tsx` - Removed UI component and state management

**Testing Steps:**
1. Navigate to `/patient/book` (must be logged in)
2. Fill out the appointment form
3. Verify the "Reason for Visit" field is not present
4. Submit the form successfully without providing a reason

---

## Authentication Flow (By Design)

### How the "Request Appointment" Button Works

**Landing Page Buttons:**
- "Book Appointment" → Redirects to `/auth/sign-up`
- "Get Started Now" → Redirects to `/auth/sign-up`
- "Sign In" → Redirects to `/auth/login`

**This is intentional behavior:**
1. Users must register or login first
2. After authentication, they are redirected to `/patient` dashboard
3. From the patient dashboard, they can navigate to "Book Appointment"
4. The booking page at `/patient/book` is protected by authentication middleware

### Why This Design?
- **Security:** Ensures proper patient identity verification
- **Data Integrity:** Links appointments to verified user accounts
- **Medical Records:** Maintains accurate patient history
- **Compliance:** Meets healthcare data protection requirements

---

## Troubleshooting Guide

### Problem 1: Button Not Responding
**Symptoms:** Clicking "Book Appointment" does nothing

**Diagnostic Steps:**
1. Open browser DevTools (F12)
2. Check Console tab for JavaScript errors
3. Check Network tab for failed requests
4. Verify React hydration completed

**Common Causes & Fixes:**

#### A. JavaScript Errors
```bash
# Check browser console for errors
# Look for: "Hydration", "Failed to fetch", "TypeError"
```

**Fix:** Clear browser cache and hard reload (Ctrl+Shift+R)

#### B. Network Issues
```bash
# In Network tab, look for:
# - Failed requests (red)
# - CORS errors
# - Timeout issues
```

**Fix:** Check internet connection and Supabase configuration

#### C. React Hydration Mismatch
```bash
# Console error: "Hydration failed"
# Console error: "Text content does not match"
```

**Fix:** Clear Next.js cache
```bash
rm -rf .next
npm run dev
```

---

### Problem 2: Redirect Not Working After Login
**Symptoms:** After login, user stays on login page or goes to wrong page

**Diagnostic Steps:**
1. Check middleware configuration
2. Verify Supabase auth state
3. Check router push calls

**Fix:**
```typescript
// Verify in /lib/supabase/middleware.tsx
// Ensure updateSession() is properly configured
```

**Manual Test:**
1. Login with test credentials
2. Check URL changes to `/patient`
3. Verify navigation bar shows patient options

---

### Problem 3: Booking Form Not Submitting
**Symptoms:** Click "Request Appointment" but nothing happens

**Diagnostic Steps:**

#### A. Check Form Validation
```javascript
console.log("[v0] Form state:", {
  selectedDoctor,
  appointmentDate,
  appointmentTime,
  appointmentType
})
```

**Common Issues:**
- Missing required fields
- Invalid date format
- No available time slots

#### B. Check Database Connection
```javascript
// In handleSubmit function, add:
console.log("[v0] User authenticated:", user)
console.log("[v0] Submitting data:", appointmentData)
```

**Fix:** Verify Supabase environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### C. Check Database Permissions
**Issue:** Row Level Security (RLS) blocking inserts

**Fix:** Verify RLS policies allow authenticated users to insert appointments
```sql
-- Check in Supabase dashboard or run:
SELECT * FROM pg_policies WHERE tablename = 'appointments';
```

---

### Problem 4: Available Time Slots Not Loading
**Symptoms:** Time dropdown shows "No available slots"

**Diagnostic Steps:**
```javascript
console.log("[v0] Selected doctor:", selectedDoctor)
console.log("[v0] Selected date:", appointmentDate)
console.log("[v0] Available slots:", availableTimeSlots)
```

**Common Causes:**

#### A. All Slots Booked
**Fix:** Choose a different date or doctor

#### B. Database Query Error
```javascript
// Check console for Supabase errors
// Look for: "Failed to load available time slots"
```

**Fix:** Verify appointments table structure and RLS policies

#### C. Time Zone Issues
**Fix:** Ensure date formatting matches database expectations
```javascript
// Date should be in format: YYYY-MM-DD
const formattedDate = new Date().toISOString().split('T')[0]
```

---

### Problem 5: Document Upload Failing
**Symptoms:** File upload shows error or gets stuck

**Diagnostic Steps:**
1. Check file size (max 10MB)
2. Check file type (PDF, JPEG, PNG, DOC only)
3. Check Blob storage configuration

**Common Causes:**

#### A. File Too Large
```javascript
// Max size: 10MB (10,485,760 bytes)
if (file.size > 10485760) {
  // Show error
}
```

**Fix:** Compress or resize file before upload

#### B. Invalid File Type
```javascript
const validTypes = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]
```

**Fix:** Convert file to supported format

#### C. Blob Storage Not Configured
**Fix:** Verify Blob integration in Vercel:
1. Check environment variable `BLOB_READ_WRITE_TOKEN`
2. Verify integration is connected
3. Test API endpoint `/api/appointments/upload-document`

---

## Backend API Troubleshooting

### Test Upload Endpoint
```bash
curl -X POST http://localhost:3000/api/appointments/upload-document \
  -F "file=@test-document.pdf" \
  -H "Content-Type: multipart/form-data"
```

**Expected Response:**
```json
{
  "url": "https://blob-url.vercel-storage.com/...",
  "filename": "test-document.pdf",
  "size": 12345,
  "type": "application/pdf"
}
```

### Test Appointment Creation
```javascript
// In browser console (when logged in):
const supabase = createClient()
const { data, error } = await supabase
  .from('appointments')
  .insert({
    patient_id: 'user-uuid',
    doctor_id: 'doctor-uuid',
    appointment_date: '2025-02-15',
    appointment_time: '10:00',
    appointment_type: 'consultation',
    status: 'pending'
  })
  .select()

console.log('[v0] Result:', { data, error })
```

---

## Performance Optimization

### Check Page Load Speed
```javascript
// Add to /app/patient/book/page.tsx
console.log('[v0] Page mounted at:', Date.now())

useEffect(() => {
  console.log('[v0] Doctors loaded:', doctors.length)
}, [doctors])
```

### Optimize Database Queries
- Ensure indexes exist on frequently queried columns
- Use `.select()` to limit returned fields
- Implement pagination for large datasets

---

## Security Checklist

✅ **Authentication Required:** Users must login before booking
✅ **RLS Policies:** Database access restricted per user role
✅ **Input Validation:** All form fields validated before submission
✅ **File Upload Security:** Type and size restrictions enforced
✅ **HTTPS Only:** All requests over secure connection
✅ **Session Management:** Supabase handles secure sessions

---

## Common Error Messages & Solutions

### Error: "Not authenticated"
**Cause:** User session expired or invalid
**Fix:** Redirect to login page and sign in again

### Error: "Failed to book appointment"
**Cause:** Database constraint violation or permission denied
**Fix:** Check RLS policies and form data validity

### Error: "No file provided"
**Cause:** File upload attempted without selecting a file
**Fix:** Ensure file input has valid file before submission

### Error: "Upload failed"
**Cause:** Blob storage issue or network error
**Fix:** Check Blob integration and internet connection

---

## Testing Checklist

### Manual Testing Steps:

1. **Landing Page**
   - [ ] All buttons visible and clickable
   - [ ] "Book Appointment" redirects to signup
   - [ ] "Sign In" redirects to login
   - [ ] Responsive on mobile devices

2. **Authentication Flow**
   - [ ] Sign up creates new user
   - [ ] Login authenticates existing user
   - [ ] Logout clears session
   - [ ] Protected routes redirect unauthenticated users

3. **Booking Form**
   - [ ] Doctor dropdown populated
   - [ ] Appointment type selection works
   - [ ] Date picker shows future dates only
   - [ ] Time slots load based on doctor/date
   - [ ] Document upload works (optional)
   - [ ] Form submission creates appointment
   - [ ] Success message shown
   - [ ] Redirect to dashboard

4. **Admin Review**
   - [ ] Pending appointments visible to admin
   - [ ] Admin can approve/cancel appointments
   - [ ] Status updates reflected in patient view
   - [ ] Uploaded documents accessible

---

## Developer Tools & Commands

### Clear All Caches
```bash
# Clear Next.js cache
rm -rf .next

# Clear node modules (if needed)
rm -rf node_modules
npm install

# Clear browser cache
# Chrome: Ctrl+Shift+Delete
# Firefox: Ctrl+Shift+Delete
```

### Restart Development Server
```bash
# Stop server: Ctrl+C
npm run dev
```

### View Database in Supabase Dashboard
1. Go to Supabase project
2. Navigate to Table Editor
3. Check `appointments` table for recent entries
4. Verify data integrity

### Check Logs
```bash
# Server-side logs
# Check Vercel deployment logs or terminal output

# Client-side logs
# Open browser DevTools > Console
```

---

## Contact & Support

If issues persist after following this guide:

1. **Check Documentation:** Review Next.js and Supabase docs
2. **Community Support:** Post on GitHub discussions
3. **Technical Support:** Contact development team

---

## Changelog

### Version 2.0 (Current)
- ✅ Removed "Reason for Visit" requirement
- ✅ Added document upload feature
- ✅ Implemented Gen-Z modern UI design
- ✅ Added comprehensive troubleshooting guide

### Version 1.0
- Initial appointment system implementation
- Basic booking functionality
- Admin approval workflow
