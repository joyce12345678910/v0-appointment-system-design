-- Add document_url column to appointments table to store uploaded images/documents
ALTER TABLE appointments
ADD COLUMN document_url TEXT,
ADD COLUMN document_uploaded_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN document_file_name TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN appointments.document_url IS 'URL to the uploaded document/ID/referral slip for verification';
COMMENT ON COLUMN appointments.document_file_name IS 'Original file name of the uploaded document';

-- Create index for faster lookups of appointments with documents
CREATE INDEX idx_appointments_document_url ON appointments(document_url) WHERE document_url IS NOT NULL;
