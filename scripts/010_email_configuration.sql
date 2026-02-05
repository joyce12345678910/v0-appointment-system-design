-- Create email templates table for Tactay Billedo branded emails
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name VARCHAR(100) NOT NULL UNIQUE,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  sender_name VARCHAR(100) DEFAULT 'Tactay Billedo',
  sender_email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default email templates
INSERT INTO email_templates (template_name, subject, body, sender_name, sender_email) VALUES
('verification_code', 'Email Verification - Tactay Billedo', 'Hi {{full_name}},

Your email verification code is: {{code}}

This code will expire in 10 minutes.

If you did not request this code, please ignore this email.

Best regards,
Tactay Billedo Dental Clinic Team
0917 568 0416
Santo Domingo, Camarines Sur', 'Tactay Billedo', 'noreply@tactaybilledo.com'),

('appointment_confirmation', 'Appointment Confirmation - Tactay Billedo', 'Hi {{full_name}},

Your appointment has been confirmed!

Details:
Doctor: Dr. {{doctor_name}}
Date: {{appointment_date}}
Time: {{appointment_time}}
Type: {{appointment_type}}

Please arrive 15 minutes before your scheduled time.

Location:
2nd Floor Shell Santo Domingo Building
National Highway, Santo Domingo
Camarines Sur, Philippines

For inquiries, call us at 0917 568 0416

Best regards,
Tactay Billedo Dental Clinic Team', 'Tactay Billedo', 'noreply@tactaybilledo.com'),

('appointment_approved', 'Your Appointment is Approved - Tactay Billedo', 'Hi {{full_name}},

Great news! Your appointment request has been approved.

Doctor: Dr. {{doctor_name}} ({{specialization}})
Date: {{appointment_date}}
Time: {{appointment_time}}
Reason: {{appointment_reason}}

Please log in to your dashboard for more details.

Best regards,
Tactay Billedo Dental Clinic Team
0917 568 0416', 'Tactay Billedo', 'noreply@tactaybilledo.com'),

('appointment_reminder', 'Appointment Reminder - Tactay Billedo', 'Hi {{full_name}},

This is a reminder of your upcoming appointment.

Doctor: Dr. {{doctor_name}}
Date: {{appointment_date}}
Time: {{appointment_time}}

Please arrive 15 minutes early.

Best regards,
Tactay Billedo Dental Clinic Team
0917 568 0416', 'Tactay Billedo', 'noreply@tactaybilledo.com');

-- Enable RLS on email_templates
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read email templates
CREATE POLICY "Allow public read access to email templates"
  ON email_templates
  FOR SELECT
  USING (true);
