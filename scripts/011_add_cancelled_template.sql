-- Add cancelled appointment email template
INSERT INTO email_templates (template_name, subject, body, sender_name, sender_email) VALUES
('appointment_cancelled', 'Appointment Cancelled - Tactay Billedo', 'Hi {{full_name}},

Your appointment has been cancelled.

Details:
Doctor: Dr. {{doctor_name}} ({{specialization}})
Date: {{appointment_date}}
Time: {{appointment_time}}

Reason: {{reason_for_cancellation}}

If you would like to reschedule, please log in to your account and book a new appointment.

For inquiries, call us at 0917 568 0416

Best regards,
Tactay Billedo Dental Clinic Team', 'Tactay Billedo', 'noreply@tactaybilledo.com')
ON CONFLICT (template_name) DO UPDATE SET
  body = EXCLUDED.body,
  updated_at = NOW();
