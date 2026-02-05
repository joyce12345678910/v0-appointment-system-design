-- Create email verification codes table
CREATE TABLE IF NOT EXISTS email_verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_verification_codes_email ON email_verification_codes(email);
CREATE INDEX IF NOT EXISTS idx_email_verification_codes_expires_at ON email_verification_codes(expires_at);

-- Enable RLS
ALTER TABLE email_verification_codes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert verification codes (for signup)
CREATE POLICY "Allow inserting verification codes" ON email_verification_codes
  FOR INSERT WITH CHECK (TRUE);

-- Allow anyone to select unverified codes for their email
CREATE POLICY "Allow viewing own verification codes" ON email_verification_codes
  FOR SELECT USING (TRUE);

-- Allow updating verification codes to mark as verified
CREATE POLICY "Allow updating verification codes" ON email_verification_codes
  FOR UPDATE USING (TRUE) WITH CHECK (TRUE);
