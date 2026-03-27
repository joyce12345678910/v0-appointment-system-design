-- Sync emails from auth.users to profiles table
-- This ensures all existing users have their email in the profiles table

UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id
AND (p.email IS NULL OR p.email = '' OR p.email != u.email);
