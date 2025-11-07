-- Promote a user to admin role
-- Replace 'your-email@example.com' with the email you used to sign up

UPDATE profiles
SET role = 'admin'
WHERE id = (
  SELECT id 
  FROM auth.users 
  WHERE email = 'admin@test.com'  -- CHANGE THIS to your email
);

-- Verify the update
SELECT 
  p.id,
  u.email,
  p.role,
  p.full_name
FROM profiles p
JOIN auth.users u ON u.id = p.id
WHERE u.email = 'admin@test.com';  -- CHANGE THIS to your email
