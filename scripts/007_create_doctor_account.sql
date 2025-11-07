-- This script creates a doctor account with admin privileges
-- Replace the email and password as needed

-- Step 1: Sign up with the doctor email first at /auth/sign-up
-- Use email: doctor@tactay.com
-- Use password: doctor123

-- Step 2: After signing up, run this script to promote the account to admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'doctor@tactay.com';

-- Verify the update
SELECT id, email, role FROM public.profiles WHERE email = 'doctor@tactay.com';
