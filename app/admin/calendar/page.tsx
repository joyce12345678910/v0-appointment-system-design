import { createClient } from "@/lib/supabase/server"
import { CalendarView } from "@/components/calendar-view"

export default async function CalendarPage() {
  const supabase = await createClient()

  // Fetch all appointments with related data
  const { data: appointments } = await supabase
    .from("appointments")
    .select(
      `
      *,
      patient:profiles!appointments_patient_id_fkey(id, full_name, email, phone),
      doctor:doctors(id, full_name, specialization, email, phone)
    `,
    )
    .order("appointment_date", { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Calendar View</h1>
        <p className="text-muted-foreground">Visual calendar of all appointments</p>
      </div>

      <CalendarView appointments={appointments || []} />
    </div>
  )
}
