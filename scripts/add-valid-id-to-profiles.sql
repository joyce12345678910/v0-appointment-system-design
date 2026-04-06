-- Add valid_id_url column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS valid_id_url TEXT;

-- Add comment to describe the column
COMMENT ON COLUMN profiles.valid_id_url IS 'URL to the patient valid ID document uploaded during registration';
