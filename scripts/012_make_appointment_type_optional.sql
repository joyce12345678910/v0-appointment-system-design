-- Make appointment_type column optional
-- This allows appointments to be created without specifying an appointment type

ALTER TABLE appointments 
ALTER COLUMN appointment_type DROP NOT NULL;

-- Add a comment explaining the change
COMMENT ON COLUMN appointments.appointment_type IS 'Type of appointment - now optional to simplify booking process';
