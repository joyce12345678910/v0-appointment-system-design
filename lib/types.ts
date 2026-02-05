export interface Profile {
  id: string
  email: string
  full_name: string
  role: "admin" | "patient"
  phone?: string
  date_of_birth?: string
  address?: string
  profile_photo_url?: string
  created_at: string
}

export interface Doctor {
  id: string
  full_name: string
  specialization: string
  email: string
  phone: string
  license_number: string
  years_of_experience?: number
  consultation_fee?: number
  available: boolean
  created_at: string
}

export interface Appointment {
  id: string
  patient_id: string
  doctor_id: string
  appointment_date: string
  appointment_time: string
  appointment_type: "consultation" | "follow_up" | "emergency" | "routine_checkup"
  reason: string
  status: "pending" | "approved" | "completed" | "cancelled"
  notes?: string
  approved_by?: string
  approved_at?: string
  document_url?: string
  document_file_name?: string
  document_uploaded_at?: string
  created_at: string
  patient?: Profile
  doctor?: Doctor
}

export interface MedicalRecord {
  id: string
  patient_id: string
  doctor_id: string
  visit_date: string
  diagnosis: string
  prescription?: string
  lab_results?: string
  notes?: string
  created_at: string
  patient?: Profile
  doctor?: Doctor
}
