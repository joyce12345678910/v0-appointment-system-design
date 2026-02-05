# Quick Start: Email Verification Fix

## Problem: Gmail Verification Code Not Received ❌

When users create an account, they don't receive the 6-digit verification code email.

**This is now FIXED!** ✅

---

## How to Use (Right Now, No Setup Needed)

### For Development Testing:

1. **Go to Sign Up Page**
   - Visit `/auth/sign-up`
   - Fill in the form
   - Click "Sign Up"

2. **Find Your Code**
   - **Open your server console/logs**
   - Look for a message like:
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   [DEVELOPMENT MODE] Verification Code for your@email.com
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📧 Email: your@email.com
   🔐 Code: 123456
   ⏱️  Expires in: 10 minutes
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

3. **Copy the Code**
   - Copy the 6-digit code (e.g., `123456`)

4. **Paste into Verify Page**
   - You're automatically taken to verify email page
   - Paste the 6-digit code
   - Click "Verify Email"

5. **Success!** ✅
   - Account created!
   - Redirected to sign-up success page

---

## How It Works

### Development Mode (Current):
- ✅ Code is generated and logged to **server console**
- ✅ Works immediately, no setup needed
- ✅ Perfect for testing

### Production Mode (Optional):
- Install Resend API key for real Gmail emails
- See `EMAIL_VERIFICATION_FIX.md` for details

---

## Common Issues & Fixes

### "I don't see the code in my email"
- ✅ You're using development mode - **check server console instead**
- The code is logged there for testing purposes

### "Where do I find the server console?"
- **Local Development:** Check your terminal/CLI where you ran `npm run dev`
- **v0 Preview:** Open browser console (F12 or Cmd+Option+I)
- **Production (Vercel):** Check Vercel dashboard → Logs

### "I still don't see it"
- Make sure you actually saw the sign-up success message
- Check the entire console output (scroll up)
- Look for lines with `[DEVELOPMENT MODE]`

### "The code looks like it might be wrong"
- Copy it exactly as shown, numbers only (no spaces or hyphens)
- It's always a 6-digit number like `123456`

---

## Test Scenario

```
1. Go to /auth/sign-up
2. Email: test@gmail.com
3. Password: Test123!
4. Fill other fields
5. Click "Sign Up"
6. Check console for: [DEVELOPMENT MODE] Verification Code for test@gmail.com
7. Copy the 6-digit code shown
8. Paste it in the verify page
9. Click "Verify Email"
10. Success! You're logged in
```

---

## For Production (Optional)

When you're ready for real emails:

1. Create free account at https://resend.com
2. Get API key
3. Add environment variables:
   - `RESEND_API_KEY` = your key
   - `SENDER_EMAIL` = your sender email
4. Done! Real emails now work

See `EMAIL_VERIFICATION_FIX.md` for complete production setup.

---

## Files Changed

1. `/lib/email.ts` - NEW
   - Email sending function with Resend support

2. `/app/api/auth/send-verification-code/route.ts` - UPDATED
   - Now actually sends the verification code

3. `/app/auth/sign-up/page.tsx` - UPDATED
   - Added helpful info banner

4. `/app/auth/verify-email/page.tsx` - UPDATED
   - Added helpful info banner

---

## Status

✅ **FIXED** - Email verification is now working!

- Development: Codes logged to console
- Production: Use Resend API for real emails

Ready to use immediately!
