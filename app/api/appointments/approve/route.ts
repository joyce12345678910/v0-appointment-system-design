import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { appointmentId, action } = await request.json()

    if (!appointmentId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get authenticated user and check if admin
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { data: userProfile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (userProfile?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Fetch appointment details
    const { data: appointment, error: fetchError } = await supabase
      .from("appointments")
      .select(
        `*,
        patient:profiles!appointments_patient_id_fkey(full_name, email),
        doctor:doctors(full_name, specialization)`
      )
      .eq("id", appointmentId)
      .single()

    if (fetchError || !appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    // Update appointment status
    const newStatus = action === "approve" ? "approved" : "cancelled"
    const { error: updateError } = await supabase
      .from("appointments")
      .update({ status: newStatus })
      .eq("id", appointmentId)

    if (updateError) {
      console.error("Update error:", updateError)
      return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 })
    }

    // Send email notification
    const templateName = action === "approve" ? "appointment_approved" : "appointment_cancelled"
    const emailData = {
      templateName,
      recipientEmail: appointment.patient.email,
      recipientName: appointment.patient.full_name,
      variables: {
        full_name: appointment.patient.full_name,
        doctor_name: appointment.doctor.full_name,
        specialization: appointment.doctor.specialization,
        appointment_date: new Date(appointment.appointment_date).toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        appointment_time: appointment.appointment_time,
        appointment_reason: appointment.reason,
      },
    }

    // Send email
    await fetch(`${request.nextUrl.origin}/api/email/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emailData),
    }).catch((err) => console.error("Email send failed:", err))

    return NextResponse.json({
      success: true,
      message: `Appointment ${newStatus}`,
      appointment: { id: appointmentId, status: newStatus },
    })
  } catch (error) {
    console.error("Error approving appointment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
