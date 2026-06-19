# TACTAY-BILLEDO DENTAL CLINIC - Step-by-Step User Manual

This comprehensive guide will walk you through deploying and setting up the Tactay-Billedo Dental Clinic Appointment System from start to finish.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Download and Extract the Project](#2-download-and-extract-the-project)
3. [Create a Supabase Project](#3-create-a-supabase-project)
4. [Set Up the Database](#4-set-up-the-database)
5. [Configure Environment Variables](#5-configure-environment-variables)
6. [Run the Project Locally](#6-run-the-project-locally)
7. [Deploy to Vercel](#7-deploy-to-vercel)
8. [Configure Supabase Authentication](#8-configure-supabase-authentication)
9. [Set Up Email Service (Brevo)](#9-set-up-email-service-brevo)
10. [Create Admin Account](#10-create-admin-account)
11. [Testing the System](#11-testing-the-system)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Prerequisites

Before you begin, make sure you have the following installed on your computer:

### Required Software

| Software | Version | Download Link |
|----------|---------|---------------|
| Node.js | 18.x or higher | https://nodejs.org/ |
| npm | 9.x or higher | Comes with Node.js |
| Git | Latest | https://git-scm.com/ |

### Required Accounts

You will need to create accounts on the following platforms (all have free tiers):

1. **Supabase** - For database and authentication
   - Website: https://supabase.com/
   - Sign up for a free account

2. **Vercel** - For hosting the application
   - Website: https://vercel.com/
   - Sign up with your GitHub account (recommended)

3. **Brevo (formerly Sendinblue)** - For sending emails
   - Website: https://www.brevo.com/
   - Sign up for a free account (300 emails/day free)

### Verify Installation

Open your terminal/command prompt and run these commands to verify installation:

```bash
# Check Node.js version
node --version
# Should show v18.x.x or higher

# Check npm version
npm --version
# Should show 9.x.x or higher

# Check Git version
git --version
# Should show git version x.x.x
```

---

## 2. Download and Extract the Project

### Step 2.1: Download the ZIP File

1. Download the project ZIP file from v0
2. Save it to a location you can easily find (e.g., Desktop or Documents)

### Step 2.2: Extract the ZIP File

1. Right-click on the downloaded ZIP file
2. Select "Extract All" (Windows) or double-click to extract (Mac)
3. Choose a destination folder (e.g., `C:\Projects\dental-clinic` or `~/Projects/dental-clinic`)

### Step 2.3: Open Terminal in Project Folder

**Windows:**
1. Open the extracted folder
2. Click on the address bar
3. Type `cmd` and press Enter

**Mac/Linux:**
1. Open Terminal
2. Navigate to the folder:
   ```bash
   cd ~/Projects/dental-clinic
   ```

### Step 2.4: Install Dependencies

Run the following command to install all required packages:

```bash
npm install
```

This may take a few minutes. Wait until it completes without errors.

---

## 3. Create a Supabase Project

### Step 3.1: Log in to Supabase

1. Go to https://supabase.com/
2. Click "Sign In" or "Start your project"
3. Log in with your account

### Step 3.2: Create a New Project

1. Click the "New Project" button
2. Fill in the following details:
   - **Name:** `tactay-billedo-dental` (or your preferred name)
   - **Database Password:** Create a strong password and **SAVE IT SOMEWHERE SAFE**
   - **Region:** Choose the region closest to your users
3. Click "Create new project"
4. Wait 2-3 minutes for the project to be created

### Step 3.3: Get Your Project Credentials

Once your project is ready:

1. Go to **Project Settings** (gear icon in the sidebar)
2. Click on **API** in the left menu
3. You will see:
   - **Project URL** - Copy this (looks like `https://xxxxxxxx.supabase.co`)
   - **anon public** key - Copy this (under "Project API keys")
   - **service_role** key - Copy this (click "Reveal" to see it)

**IMPORTANT:** Keep these credentials safe. You will need them in Step 5.

---

## 4. Set Up the Database

### Step 4.1: Open SQL Editor

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click "New query" to create a new SQL query

### Step 4.2: Run Migration Scripts

You need to run the SQL scripts in the `/scripts` folder **in order**. Here's how:

#### Script 1: Create Tables

1. Open the file `/scripts/001_create_tables.sql` in a text editor
2. Copy ALL the contents
3. Paste into the Supabase SQL Editor
4. Click "Run" (or press Ctrl+Enter / Cmd+Enter)
5. You should see "Success. No rows returned"

#### Script 2: Row Level Security

1. Click "New query" in SQL Editor
2. Open `/scripts/002_row_level_security.sql`
3. Copy ALL contents and paste into SQL Editor
4. Click "Run"

#### Script 3: Profile Trigger

1. Click "New query"
2. Open `/scripts/003_create_profile_trigger.sql`
3. Copy ALL contents and paste into SQL Editor
4. Click "Run"

#### Script 4: Seed Data (Optional)

1. Click "New query"
2. Open `/scripts/004_seed_data.sql`
3. Copy ALL contents and paste into SQL Editor
4. Click "Run"

#### Continue with remaining scripts...

Run the following scripts in order (same process as above):

- `/scripts/005_fix_rls_policies.sql`
- `/scripts/009_email_verification_codes.sql`
- `/scripts/010_add_appointment_document.sql`
- `/scripts/011_make_reason_optional.sql`
- `/scripts/012_make_appointment_type_optional.sql`
- `/scripts/013_add_profile_delete_policy.sql`
- `/scripts/014_sync_emails_to_profiles.sql`
- `/scripts/015_update_profile_trigger_for_valid_id.sql`
- `/scripts/add-valid-id-to-profiles.sql`

### Step 4.3: Verify Tables Were Created

1. Go to **Table Editor** in the left sidebar
2. You should see these tables:
   - `profiles`
   - `doctors`
   - `appointments`
   - `medical_records`
   - `services`
   - `email_verification_codes`

If you see all these tables, your database is set up correctly!

---

## 5. Configure Environment Variables

### Step 5.1: Create Environment File

1. In your project folder, create a new file called `.env.local`
2. Open it with a text editor (Notepad, VS Code, etc.)

### Step 5.2: Add Environment Variables

Copy and paste the following into `.env.local`, then replace the placeholder values with your actual credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Supabase Database (get from Supabase Dashboard > Settings > Database)
POSTGRES_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
POSTGRES_PRISMA_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true
POSTGRES_URL_NON_POOLING=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-database-password
POSTGRES_DATABASE=postgres
POSTGRES_HOST=db.[YOUR-PROJECT-REF].supabase.co

# Email Service (Brevo) - Set up in Step 9
BREVO_API_KEY=your-brevo-api-key
BREVO_SENDER_EMAIL=your-verified-sender-email@example.com

# Redirect URLs (update after deploying to Vercel)
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

### Step 5.3: Where to Find Each Value

| Variable | Where to Find It |
|----------|------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase > Settings > API > Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase > Settings > API > anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase > Settings > API > service_role (click Reveal) |
| `POSTGRES_PASSWORD` | The password you created when setting up Supabase |
| Database URLs | Supabase > Settings > Database > Connection string |

---

## 6. Run the Project Locally

### Step 6.1: Start the Development Server

In your terminal (make sure you're in the project folder), run:

```bash
npm run dev
```

### Step 6.2: Open the Application

1. Open your web browser
2. Go to: `http://localhost:3000`
3. You should see the Tactay-Billedo Dental Clinic homepage!

### Step 6.3: Test Basic Functionality

1. Click "Log In" to see the login page
2. Click "Sign Up" to see the registration page
3. Navigate around to make sure pages load correctly

**Note:** Email features won't work until you set up Brevo (Step 9).

---

## 7. Deploy to Vercel

### Step 7.1: Push to GitHub (Recommended)

First, create a GitHub repository:

1. Go to https://github.com/new
2. Create a new repository (e.g., `tactay-billedo-dental`)
3. Keep it **Private** for security
4. Don't initialize with README

Then push your code:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Dental Clinic System"

# Add remote repository (replace with your repo URL)
git remote add origin https://github.com/YOUR-USERNAME/tactay-billedo-dental.git

# Push to GitHub
git push -u origin main
```

### Step 7.2: Deploy to Vercel

1. Go to https://vercel.com/
2. Sign in with your GitHub account
3. Click "Add New" > "Project"
4. Select your `tactay-billedo-dental` repository
5. Click "Import"

### Step 7.3: Configure Environment Variables on Vercel

Before deploying, add your environment variables:

1. In the Vercel import screen, expand "Environment Variables"
2. Add each variable from your `.env.local` file:
   - Click "Add"
   - Enter the variable name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
   - Enter the value
   - Repeat for all variables

**Important Variables to Add:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `BREVO_API_KEY`
- `BREVO_SENDER_EMAIL`
- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` (set to your Vercel URL + `/auth/callback`)

### Step 7.4: Deploy

1. Click "Deploy"
2. Wait for the deployment to complete (2-5 minutes)
3. Once done, you'll get a URL like `https://your-project.vercel.app`

### Step 7.5: Update Redirect URL

After deployment, update the redirect URL:

1. Go to your Vercel project settings
2. Go to "Environment Variables"
3. Update `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` to:
   ```
   https://your-project.vercel.app/auth/callback
   ```
4. Redeploy the project for changes to take effect

---

## 8. Configure Supabase Authentication

### Step 8.1: Set Up Redirect URLs

1. Go to your Supabase dashboard
2. Navigate to **Authentication** > **URL Configuration**
3. Add your URLs:

**Site URL:**
```
https://your-project.vercel.app
```

**Redirect URLs (add all of these):**
```
https://your-project.vercel.app/auth/callback
https://your-project.vercel.app/auth/reset-password
http://localhost:3000/auth/callback
http://localhost:3000/auth/reset-password
```

### Step 8.2: Configure Email Templates (Optional)

1. Go to **Authentication** > **Email Templates**
2. Customize the following templates:
   - Confirm signup
   - Reset password
   - Magic link

### Step 8.3: Disable Email Confirmation (For Testing)

If you want users to sign up without email confirmation (for testing):

1. Go to **Authentication** > **Providers**
2. Click on **Email**
3. Toggle OFF "Confirm email"

**Warning:** Enable this for production!

---

## 9. Set Up Email Service (Brevo)

### Step 9.1: Create Brevo Account

1. Go to https://www.brevo.com/
2. Sign up for a free account
3. Verify your email address

### Step 9.2: Get API Key

1. Log in to Brevo
2. Click on your profile icon (top right)
3. Go to **SMTP & API**
4. Click "Create a new API key"
5. Name it (e.g., "Dental Clinic App")
6. Copy the API key

### Step 9.3: Verify Sender Email

1. In Brevo, go to **Senders & IP**
2. Click "Add a sender"
3. Enter your email address
4. Verify it by clicking the link sent to that email

### Step 9.4: Update Environment Variables

Update your `.env.local` and Vercel environment variables:

```env
BREVO_API_KEY=your-api-key-from-step-9.2
BREVO_SENDER_EMAIL=your-verified-email-from-step-9.3
```

### Step 9.5: Redeploy

If you updated Vercel environment variables, redeploy your project:

1. Go to your Vercel dashboard
2. Click on your project
3. Go to "Deployments"
4. Click the three dots on the latest deployment
5. Click "Redeploy"

---

## 10. Create Admin Account

### Step 10.1: Sign Up as a Regular User

1. Go to your deployed website
2. Click "Sign Up"
3. Create an account with your admin email
4. Verify your email if required

### Step 10.2: Promote to Admin

1. Go to your Supabase dashboard
2. Open **SQL Editor**
3. Run this query (replace the email):

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-admin-email@example.com';
```

### Step 10.3: Verify Admin Access

1. Log in with your admin account
2. You should now see the Admin Dashboard
3. You can access:
   - `/admin` - Dashboard
   - `/admin/appointments` - Manage appointments
   - `/admin/patients` - View patients
   - `/admin/doctors` - Manage doctors
   - `/admin/medical-records` - View medical records
   - `/admin/calendar` - Calendar view

---

## 11. Testing the System

### Test 1: Patient Registration

1. Open an incognito/private browser window
2. Go to your website
3. Click "Sign Up"
4. Fill in patient details
5. Verify you can log in

### Test 2: Book Appointment

1. Log in as a patient
2. Go to "Book Appointment" 
3. Select a service, date, and time
4. Submit the appointment
5. Check if it appears in "My Appointments"

### Test 3: Admin Functions

1. Log in as admin
2. Go to Admin Dashboard
3. Check appointments list
4. Try approving/rejecting an appointment
5. Add a new doctor
6. Create a medical record

### Test 4: Email Notifications

1. Book a new appointment as a patient
2. Check if confirmation email is received
3. Try the "Forgot Password" feature
4. Verify reset email is received

---

## 12. Troubleshooting

### Issue: "Invalid API Key" Error

**Solution:**
- Double-check your Supabase API keys in environment variables
- Make sure there are no extra spaces in the values
- Verify the keys match what's shown in Supabase dashboard

### Issue: Database Tables Not Found

**Solution:**
- Go back to Step 4 and run ALL SQL scripts
- Check SQL Editor for any error messages
- Verify tables exist in Table Editor

### Issue: Emails Not Sending

**Solution:**
- Verify Brevo API key is correct
- Check that sender email is verified in Brevo
- Look at Brevo dashboard for failed email logs
- Check Vercel function logs for errors

### Issue: Can't Log In After Deployment

**Solution:**
- Verify redirect URLs are set in Supabase (Step 8.1)
- Check that `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` matches your Vercel URL
- Clear browser cache and cookies

### Issue: "Page Not Found" Errors

**Solution:**
- Make sure all environment variables are set in Vercel
- Redeploy the project after adding variables
- Check Vercel deployment logs for build errors

### Issue: Admin Dashboard Not Accessible

**Solution:**
- Verify your account role is set to 'admin' in the database
- Run the SQL query in Step 10.2 again
- Log out and log back in

---

## Quick Reference

### Important URLs

| Page | URL |
|------|-----|
| Homepage | `/` |
| Login | `/auth/login` |
| Sign Up | `/auth/sign-up` |
| Patient Dashboard | `/patient` |
| Book Appointment | `/patient/book` |
| My Records | `/patient/records` |
| My Profile | `/patient/profile` |
| Admin Dashboard | `/admin` |
| Admin Appointments | `/admin/appointments` |
| Admin Patients | `/admin/patients` |
| Admin Doctors | `/admin/doctors` |
| Admin Medical Records | `/admin/medical-records` |
| Admin Calendar | `/admin/calendar` |

### User Roles

| Role | Access Level |
|------|-------------|
| `patient` | Can book appointments, view own records |
| `admin` | Full access to all features |

### Support

If you encounter issues not covered in this guide:

1. Check the browser console for errors (F12 > Console)
2. Check Vercel function logs
3. Review Supabase logs (Database > Logs)

---

## Congratulations!

You have successfully deployed the Tactay-Billedo Dental Clinic Appointment System. Your patients can now:

- Create accounts
- Book appointments online
- View their medical records
- Receive email notifications

And you can:

- Manage all appointments
- Add and manage doctors
- Create medical records
- View patient information
- Use the calendar to see scheduled appointments

Thank you for using this system!
