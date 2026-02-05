-- Add profile_photo_url column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS profile_photo_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN profiles.profile_photo_url IS 'URL to the patient profile photo stored in Supabase Storage';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_photo_url ON profiles(profile_photo_url);
