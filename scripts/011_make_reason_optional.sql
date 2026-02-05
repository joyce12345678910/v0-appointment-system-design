-- Make the 'reason' field optional in appointments table
-- This allows appointments to be created without a reason for visit

ALTER TABLE public.appointments 
ALTER COLUMN reason DROP NOT NULL;

-- Add a comment to document the change
COMMENT ON COLUMN public.appointments.reason IS 'Optional reason for visit - can be NULL';
