-- Insert sample doctors
INSERT INTO public.doctors (full_name, specialization, email, phone, license_number, years_of_experience, consultation_fee, available)
VALUES
  ('Dr. Maria Santos', 'General Practitioner', 'maria.santos@tactay.com', '+63-917-123-4567', 'MD-2015-001', 8, 1500.00, true),
  ('Dr. Juan Dela Cruz', 'Cardiologist', 'juan.delacruz@tactay.com', '+63-917-234-5678', 'MD-2012-002', 11, 2500.00, true),
  ('Dr. Ana Reyes', 'Pediatrician', 'ana.reyes@tactay.com', '+63-917-345-6789', 'MD-2018-003', 5, 1800.00, true),
  ('Dr. Carlos Mendoza', 'Orthopedic Surgeon', 'carlos.mendoza@tactay.com', '+63-917-456-7890', 'MD-2010-004', 13, 3000.00, true),
  ('Dr. Sofia Garcia', 'Dermatologist', 'sofia.garcia@tactay.com', '+63-917-567-8901', 'MD-2016-005', 7, 2000.00, true);

-- Insert sample doctor availability (Monday to Friday, 9 AM to 5 PM)
INSERT INTO public.doctor_availability (doctor_id, day_of_week, start_time, end_time)
SELECT 
  d.id,
  day,
  '09:00:00'::TIME,
  '17:00:00'::TIME
FROM public.doctors d
CROSS JOIN generate_series(1, 5) AS day; -- 1 = Monday, 5 = Friday
