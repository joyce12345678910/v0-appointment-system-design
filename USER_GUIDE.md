# Tactay Billedo Appointment System - User Guide

## 👤 For Patients

### Creating an Account

1. **Visit Sign-Up Page**: Go to `/auth/sign-up`
2. **Fill in Details**:
   - Full Name
   - Email Address
   - Phone Number
   - Date of Birth
   - Address
   - Password

3. **Verify Email**:
   - Check your email for a **6-digit verification code**
   - Enter the code on the verification page
   - Code expires in 10 minutes
   - Can request a new code if needed

4. **Account Created**: You're ready to book appointments!

### Booking an Appointment

1. **Dashboard**: Go to your patient dashboard
2. **Click "Book Appointment"** button
3. **Select Doctor**: Choose from available doctors
4. **Choose Appointment Type**:
   - Consultation
   - Follow-up
   - Emergency
   - Routine Checkup

5. **Select Date & Time**:
   - Choose your preferred date
   - System shows available time slots (8 AM - 5 PM)
   - If slots show as unavailable, the doctor is fully booked for that date
   - You CAN book at a different time on the same day

6. **Reason for Visit**: Describe your symptoms or reason
7. **Submit**: Request appointment

### Tracking Your Appointments

1. **Dashboard View**: See all your appointments
2. **Upcoming Appointments**: 
   - Shows full doctor details (name, specialization)
   - Contact information for doctor
   - Date and time of appointment
   - Reason for visit
   - Status (Pending, Approved, Completed)

3. **Email Notifications**:
   - Confirmation email when you book
   - Approval email when admin confirms
   - Rejection email if appointment is cancelled

### Important Notes

- ✅ **Approval Process**: Appointments need admin approval before confirmation
- 📧 **Check Email**: Always check your email for appointment updates
- ⏰ **Arrive Early**: Please arrive 15 minutes before your scheduled time
- 📋 **Bring Documents**: Bring any relevant medical records or test results

---

## 👨‍⚕️ For Admins

### Managing Appointments

1. **Admin Dashboard**: Go to `/admin`
2. **View Recent Appointments**: See latest appointment requests
3. **Appointment Details**:
   - Patient name, phone, email
   - Doctor name and specialization
   - Date, time, and type of appointment
   - Reason and any additional notes

### Approving/Rejecting Appointments

1. **Find the Appointment**: In the recent appointments list
2. **Approve**:
   - Click "Approve" button
   - Optionally add notes
   - System sends confirmation email to patient
   - Patient receives appointment confirmation with all details

3. **Reject**:
   - Click "Reject" button
   - Provide reason for rejection
   - System sends cancellation email to patient

### Scheduling Conflicts

**The system PREVENTS double-booking:**
- If a patient books 10:00 AM with Dr. A, no other patient can book 10:00 AM with Dr. A
- Other patients CAN book 11:00 AM, 2:00 PM, etc., on the same day with same doctor
- System shows "No available slots" when all time slots for a day are booked

### Email Notifications

All emails are automatically sent by the system:
- ✅ Branded with "Tactay Billedo" sender name
- ✅ Includes clinic contact: 0917 568 0416
- ✅ Professional formatting
- ✅ Complete appointment details

### Admin Statistics

Your admin dashboard shows:
- **Total Patients**: All registered patient users
- **Total Doctors**: Available doctors in system
- **Total Appointments**: All appointments ever created
- **Pending Approvals**: Awaiting your confirmation
- **Approved Today**: Approved appointments
- **Medical Records**: Total patient records

---

## 🔐 Security & Privacy

### Your Data is Protected
- Passwords are securely hashed
- Session-based authentication
- Email verification prevents unauthorized signups
- Admin actions require authentication
- All data encrypted in transit

### Email Verification
- One-time use verification codes
- 6-digit format for security
- 10-minute expiration
- Can request new code anytime

---

## 📱 Accessing from Different Devices

The system is fully responsive:
- ✅ Works on desktop computers
- ✅ Optimized for tablets
- ✅ Mobile-friendly for smartphones
- ✅ Works in all modern browsers

---

## 🆘 Troubleshooting

### "No available slots for this date"
- **Cause**: Doctor is fully booked for that date
- **Solution**: Try a different date or different time slot

### "Email code expired"
- **Cause**: 10 minutes have passed since code was sent
- **Solution**: Click "Resend Code" to get a new code

### "Invalid verification code"
- **Cause**: Wrong code entered
- **Solution**: Check your email again and enter the correct 6-digit code

### "Appointment not approved yet"
- **Cause**: Admin hasn't reviewed your appointment request
- **Status**: Check back later or look for approval email

### "Time slot already booked"
- **Cause**: Another patient booked this slot while you were selecting
- **Solution**: The system will show this slot as unavailable in real-time

---

## 📞 Support & Contact

**Tactay Billedo Dental Clinic**
- 📱 Phone: 0917 568 0416
- 📍 Location: 2nd Floor Shell Santo Domingo Building
  National Highway, Santo Domingo
  Camarines Sur, Philippines

**Business Hours**: [Add clinic hours here]

---

## 🔄 System Status

All features are active and working:
- ✅ Patient registration with email verification
- ✅ Appointment booking system
- ✅ Real-time availability checking
- ✅ Double-booking prevention
- ✅ Email notifications
- ✅ Admin approval system
- ✅ Responsive design

---

*Last Updated: 2025*
*Tactay Billedo Appointment System*
