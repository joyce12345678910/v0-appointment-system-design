-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_availability ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Doctors policies (read-only for patients, full access for admins)
CREATE POLICY "Anyone authenticated can view doctors"
  ON public.doctors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert doctors"
  ON public.doctors FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update doctors"
  ON public.doctors FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete doctors"
  ON public.doctors FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Appointments policies
CREATE POLICY "Patients can view their own appointments"
  ON public.appointments FOR SELECT
  USING (auth.uid() = patient_id);

CREATE POLICY "Patients can create appointments"
  ON public.appointments FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can update their own pending appointments"
  ON public.appointments FOR UPDATE
  USING (auth.uid() = patient_id AND status = 'pending');

CREATE POLICY "Admins can view all appointments"
  ON public.appointments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all appointments"
  ON public.appointments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete appointments"
  ON public.appointments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Medical records policies
CREATE POLICY "Patients can view their own medical records"
  ON public.medical_records FOR SELECT
  USING (auth.uid() = patient_id);

CREATE POLICY "Admins can view all medical records"
  ON public.medical_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert medical records"
  ON public.medical_records FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update medical records"
  ON public.medical_records FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete medical records"
  ON public.medical_records FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Doctor availability policies
CREATE POLICY "Anyone authenticated can view doctor availability"
  ON public.doctor_availability FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage doctor availability"
  ON public.doctor_availability FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
