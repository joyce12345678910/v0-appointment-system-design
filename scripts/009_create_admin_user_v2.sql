-- Enable pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  admin_uid uuid;
BEGIN
  -- Check if user exists
  SELECT id INTO admin_uid FROM auth.users WHERE email = 'admin@tactay.com';

  IF admin_uid IS NULL THEN
    -- Create new user
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
      '{"role":"admin","full_name":"System Admin"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    ) RETURNING id INTO admin_uid;
  ELSE
    -- Update existing user password and metadata
    UPDATE auth.users
    SET encrypted_password = crypt('admin123', gen_salt('bf')),
        raw_user_meta_data = '{"role":"admin","full_name":"System Admin"}'
    WHERE id = admin_uid;
  END IF;

  -- Ensure profile role is admin
  -- We try to update the profile if it exists
  UPDATE public.profiles
  SET role = 'admin'
  WHERE id = admin_uid;
  
  -- If profile doesn't exist (trigger might not have fired or failed), insert it manually
  IF NOT FOUND THEN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (admin_uid, 'admin@tactay.com', 'System Admin', 'admin')
    ON CONFLICT (id) DO UPDATE SET role = 'admin';
  END IF;
  
END $$;
