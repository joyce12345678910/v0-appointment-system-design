-- Create enum types for user roles and appointment status
CREATE TYPE user_role AS ENUM ('admin', 'patient');
CREATE TYPE appointment_status AS ENUM ('pending', 'approved', 'completed', 'cancelled');
CREATE TYPE appointment_type AS ENUM ('consultation', 'follow_up', 'emergency', 'routine_checkup');

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'patient',
  phone TEXT,
  date_of_birth DATE,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Doctors table
CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  license_number TEXT NOT NULL UNIQUE,
  years_of_experience INTEGER,
  consultation_fee DECIMAL(10, 2),
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  appointment_type appointment_type NOT NULL,
  status appointment_status NOT NULL DEFAULT 'pending',
  reason TEXT NOT NULL,
  notes TEXT,
  approved_by UUID REFERENCES public.profiles(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medical records table
CREATE TABLE IF NOT EXISTS public.medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  diagnosis TEXT NOT NULL,
  prescription TEXT,
  lab_results TEXT,
  notes TEXT,
  visit_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Doctor availability table
CREATE TABLE IF NOT EXISTS public.doctor_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(doctor_id, day_of_week)
);

-- Create indexes for better query performance
CREATE INDEX idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON public.appointments(doctor_id);
CREATE INDEX idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX idx_appointments_status ON public.appointments(status);
CREATE INDEX idx_medical_records_patient_id ON public.medical_records(patient_id);
CREATE INDEX idx_medical_records_doctor_id ON public.medical_records(doctor_id);
CREATE INDEX idx_doctor_availability_doctor_id ON public.doctor_availability(doctor_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON public.doctors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medical_records_updated_at BEFORE UPDATE ON public.medical_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
