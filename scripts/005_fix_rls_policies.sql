-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert doctors" ON public.doctors;
DROP POLICY IF EXISTS "Admins can update doctors" ON public.doctors;
DROP POLICY IF EXISTS "Admins can delete doctors" ON public.doctors;
DROP POLICY IF EXISTS "Admins can view all appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins can update all appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins can delete appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins can view all medical records" ON public.medical_records;
DROP POLICY IF EXISTS "Admins can insert medical records" ON public.medical_records;
DROP POLICY IF EXISTS "Admins can update medical records" ON public.medical_records;
DROP POLICY IF EXISTS "Admins can delete medical records" ON public.medical_records;
DROP POLICY IF EXISTS "Admins can manage doctor availability" ON public.doctor_availability;

-- Create a security definer function to check if user is admin
-- This function bypasses RLS to avoid infinite recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles policies (fixed to avoid recursion)
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

-- Doctors policies
CREATE POLICY "Admins can insert doctors"
  ON public.doctors FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update doctors"
  ON public.doctors FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete doctors"
  ON public.doctors FOR DELETE
  USING (public.is_admin());

-- Appointments policies
CREATE POLICY "Admins can view all appointments"
  ON public.appointments FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update all appointments"
  ON public.appointments FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete appointments"
  ON public.appointments FOR DELETE
  USING (public.is_admin());

-- Medical records policies
CREATE POLICY "Admins can view all medical records"
  ON public.medical_records FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can insert medical records"
  ON public.medical_records FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update medical records"
  ON public.medical_records FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete medical records"
  ON public.medical_records FOR DELETE
  USING (public.is_admin());

-- Doctor availability policies
CREATE POLICY "Admins can manage doctor availability"
  ON public.doctor_availability FOR ALL
  USING (public.is_admin());
