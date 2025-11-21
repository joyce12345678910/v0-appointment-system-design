-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insert the admin user into auth.users
-- NOTE: We use 'admin@tactay.com' because Supabase requires a valid email format
-- The password 'admin123' is hashed using bcrypt
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@tactay.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name": "System Admin", "role": "admin"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- The trigger on auth.users will automatically create the profile in public.profiles
-- with the role 'admin' because we passed it in raw_user_meta_data
