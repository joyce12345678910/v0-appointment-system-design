import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { doctorId, appointmentDate, appointmentTime } = await request.json()

    if (!doctorId || !appointmentDate || !appointmentTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if there's already an appointment at this time for this doctor
    const { data: existingAppointment, error } = await supabase
      .from("appointments")
      .select("id")
      .eq("doctor_id", doctorId)
      .eq("appointment_date", appointmentDate)
      .eq("appointment_time", appointmentTime)
      .in("status", ["pending", "approved", "completed"])
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 means no rows found, which is expected
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to check availability" }, { status: 500 })
    }

    const isAvailable = !existingAppointment

    return NextResponse.json({
      available: isAvailable,
      message: isAvailable ? "Time slot is available" : "Time slot is already booked",
    })
  } catch (error) {
    console.error("Error checking availability:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
