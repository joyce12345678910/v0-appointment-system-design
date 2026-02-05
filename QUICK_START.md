# Quick Start Guide - Tactay Billedo Appointment System

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Supabase project set up
- Environment variables configured in Vercel
- Node.js 18+ installed locally (for development)

### Step 1: Verify All Scripts Ran ✅

Check that these migration scripts have been executed:
```
✅ scripts/009_email_verification_codes.sql
✅ scripts/010_email_configuration.sql
✅ scripts/011_add_cancelled_template.sql
```

If not run yet, execute them in order.

### Step 2: Test Patient Registration 👤

1. Go to `/auth/sign-up`
2. Fill in test account:
   - Name: Test User
   - Email: your-test@gmail.com
   - Phone: 0917-123-4567
   - DOB: 01/01/1990
   - Address: Test Address
   - Password: TestPass123!

3. Check email for 6-digit code
4. Enter code on verification page
5. Account created! ✅

### Step 3: Test Appointment Booking 📅

1. Log in as patient
2. Click "Book Appointment"
3. Select:
   - Doctor: Any available doctor
   - Type: Consultation
   - Date: Any future date
   - Time: Any available slot
   - Reason: "Test appointment"

4. Click "Request Appointment"
5. Check email for confirmation
6. See appointment on dashboard ✅

### Step 4: Test Admin Approval 👨‍⚕️

1. Log in as admin
2. Go to `/admin`
3. Find your test appointment in "Recent Appointments"
4. Click "Approve" button
5. Patient receives approval email ✅

### Step 5: Verify Time Slot Blocking 🔒

1. Try booking same time with same doctor
2. Should show "No available slots"
3. Book different time - should work ✅

---

## 📋 Checklist Before Production

### Database
- [ ] All 3 migration scripts executed
- [ ] Tables created: `email_verification_codes`, `email_templates`
- [ ] Sample doctors added to system
- [ ] Admin user created

### Email Configuration
- [ ] Choose email provider (SendGrid, Mailgun, AWS SES)
- [ ] Add API keys to environment variables
- [ ] Update `/app/api/email/send/route.ts` with provider integration
- [ ] Test email delivery
- [ ] Verify "Tactay Billedo" sender name appears

### Security
- [ ] HTTPS/SSL enabled
- [ ] RLS policies verified
- [ ] Admin-only routes protected
- [ ] Email codes expiring correctly

### Testing
- [ ] Patient sign-up with verification
- [ ] Appointment booking
- [ ] Time slot conflict prevention
- [ ] Email notifications
- [ ] Admin approval workflow
- [ ] Mobile responsiveness

### Deployment
- [ ] Environment variables in Vercel
- [ ] Supabase project connected
- [ ] Database backups enabled
- [ ] Error monitoring (Sentry, etc.)
- [ ] Analytics enabled

---

## 🎯 Key Features Overview

### For Patients
```
Sign Up → Email Verification (6-digit) → Dashboard → Book Appointment
           ↓
       Email Confirmation → Wait for Approval → See Full Details
```

### For Admins
```
View Recent Appointments → Approve/Reject → Send Branded Emails
                          ↓
                    Patient Notified
```

### Scheduling System
```
Patient Books 10:00 AM
     ↓
System Checks: Is 10:00 AM free with Dr. X?
     ↓
YES: Booking allowed, other times available
NO: Show error, offer alternative times
```

---

## 📧 Email Setup Examples

### SendGrid
1. Get API key from SendGrid dashboard
2. Add to environment: `SENDGRID_API_KEY`
3. Update email sending code in `/app/api/email/send/route.ts`

### Mailgun
1. Get API key and domain from Mailgun
2. Add to environment: `MAILGUN_API_KEY`, `MAILGUN_DOMAIN`
3. Update email sending code

### AWS SES
1. Verify sender email in SES console
2. Add to environment: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
3. Update email sending code

---

## 🔐 Testing Credentials

### Default Test Account (Create One)
- Email: test@clinic.com
- Password: TestPass123!
- Role: Patient

### Admin Account (Should be created manually)
- Email: admin@clinic.com
- Password: AdminPass123!
- Role: Admin

---

## 📱 Test on Different Devices

### Desktop
```
http://localhost:3000/auth/sign-up
http://localhost:3000/patient
http://localhost:3000/admin
```

### Mobile (Use ngrok for external testing)
```
ngrok http 3000
https://your-ngrok-url.ngrok.io
```

---

## 🐛 Troubleshooting

### "Email verification code not received"
- Check spam/junk folder
- Verify email provider configuration
- Check API keys are correct
- Review server logs for email send errors

### "Time slot shows available but booking fails"
- Refresh page to sync state
- Try different doctor
- Check database for conflicts

### "Admin approval email not sent"
- Verify email provider is configured
- Check email template exists in database
- Check API error logs

### "Sign-up fails on verification"
- Ensure 6-digit code is correct
- Code expires after 10 minutes
- Request new code if expired

---

## 📊 Monitoring

### What to Monitor
1. **Email Delivery**: Check sent vs. received
2. **Appointment Bookings**: Track success rate
3. **System Errors**: Review error logs
4. **Performance**: Monitor API response times

### Error Log Locations
- Browser console: `/browser-console`
- Server logs: Vercel dashboard
- Database logs: Supabase dashboard

---

## 🎓 Learning the Code

### Key Files to Understand
1. **Sign-up Flow**: `/app/auth/sign-up/page.tsx`
2. **Verification**: `/app/auth/verify-email/page.tsx`
3. **Booking**: `/app/patient/book/page.tsx`
4. **Dashboard**: `/app/patient/page.tsx`
5. **API Routes**: `/app/api/appointments/*`

### Code Structure
```
/app
  /auth
    /sign-up
    /verify-email
  /patient
    /book
  /api
    /auth (sign-up, verification)
    /appointments (booking, approval)
    /email (sending branded emails)
/components
  /appointment-actions (admin controls)
/lib
  /email.ts (email utilities)
/scripts
  /009_010_011.sql (migrations)
```

---

## 🚨 Important Notes

### Code Not to Modify
- ❌ Database schema (use migrations)
- ❌ Authentication logic (Supabase handles)
- ❌ RLS policies (already configured)

### Safe to Customize
- ✅ Email templates (in database)
- ✅ UI styling (Tailwind classes)
- ✅ Doctor list
- ✅ Business hours
- ✅ Clinic information

### Production Ready
- ✅ Sign-up with email verification
- ✅ Appointment scheduling
- ✅ Double-booking prevention
- ✅ Branded emails
- ✅ Mobile responsive
- ✅ Secure authentication

---

## 📞 Support & Resources

**For Issues**:
1. Check error logs in Vercel dashboard
2. Review Supabase database status
3. Verify email provider configuration
4. Check environment variables are set

**Documentation**:
- `/IMPLEMENTATION_SUMMARY.md` - What was built
- `/USER_GUIDE.md` - How users interact
- `/TECHNICAL_SPECIFICATIONS.md` - System architecture

**Contact**:
- Clinic: 0917 568 0416
- Location: 2nd Floor Shell Santo Domingo Building

---

## ✅ You're All Set!

The appointment system is ready to use. Go to:
- **Patient**: `http://localhost:3000/auth/sign-up`
- **Admin**: `http://localhost:3000/admin`

Happy scheduling! 🎉

---

*Last Updated: February 2025*
*Tactay Billedo Appointment System - v1.0*
