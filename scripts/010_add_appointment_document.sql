-- Add document upload column to appointments table
-- This allows patients to upload required documents when booking appointments

ALTER TABLE appointments 
ADD COLUMN document_url TEXT,
ADD COLUMN document_filename TEXT,
ADD COLUMN document_uploaded_at TIMESTAMPTZ;

-- Add index for faster queries on appointments with documents
CREATE INDEX idx_appointments_document_url ON appointments(document_url) WHERE document_url IS NOT NULL;

-- Add comment to describe the columns
COMMENT ON COLUMN appointments.document_url IS 'URL to the uploaded document stored in Vercel Blob';
COMMENT ON COLUMN appointments.document_filename IS 'Original filename of the uploaded document';
COMMENT ON COLUMN appointments.document_uploaded_at IS 'Timestamp when the document was uploaded';
