import { createClient as createServerClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { appointmentId, action } = body

    if (!appointmentId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Use service role client to bypass RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const supabase = createServerClient(supabaseUrl, supabaseServiceKey)

    // Fetch appointment with patient and doctor details
    const { data: appointment, error: appointmentError } = await supabase
      .from("appointments")
      .select(`
        *,
        patient:profiles!appointments_patient_id_fkey(id, full_name, email, phone, address),
        doctor:doctors(id, full_name, specialization, email, phone)
      `)
      .eq("id", appointmentId)
      .single()

    if (appointmentError || !appointment) {
      return NextResponse.json({ error: "Appointment not found", details: appointmentError?.message }, { status: 404 })
    }

    // Try to get email from profile first, then from auth user
    let patientEmail = appointment.patient?.email
    const patientName = appointment.patient?.full_name || "Patient"
    
    // If no email in profile, try to get from auth.users table
    if (!patientEmail && appointment.patient_id) {
      const { data: authUser } = await supabase.auth.admin.getUserById(appointment.patient_id)
      if (authUser?.user?.email) {
        patientEmail = authUser.user.email
      }
    }
    const doctorName = appointment.doctor?.full_name || "Doctor"
    const doctorSpecialization = appointment.doctor?.specialization || ""
    const appointmentDate = new Date(appointment.appointment_date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    const appointmentTime = appointment.appointment_time
    const appointmentType = appointment.appointment_type || "General Consultation"
    const reason = appointment.reason || ""
    const notes = appointment.notes || ""

    if (!patientEmail) {
      return NextResponse.json({ error: "Patient email not found" }, { status: 400 })
    }

    let subject = ""
    let emailBody = ""

    if (action === "approved") {
      subject = `Appointment Confirmed - TACTAY-BILLEDO DENTAL CLINIC`
      emailBody = generateApprovalEmail({
        patientName,
        doctorName,
        doctorSpecialization,
        appointmentDate,
        appointmentTime,
        appointmentType,
        reason,
        notes,
      })
    } else if (action === "rejected") {
      subject = `Appointment Update - TACTAY-BILLEDO DENTAL CLINIC`
      emailBody = generateRejectionEmail({
        patientName,
        doctorName,
        doctorSpecialization,
        appointmentDate,
        appointmentTime,
        reason,
        notes,
      })
    } else if (action === "completed") {
      subject = `Appointment Completed - TACTAY-BILLEDO DENTAL CLINIC`
      emailBody = generateCompletionEmail({
        patientName,
        doctorName,
        doctorSpecialization,
        appointmentDate,
        appointmentTime,
        notes,
      })
    }

    // Send email using Brevo
    const brevoApiKey = process.env.BREVO_API_KEY
    const senderEmail = process.env.BREVO_SENDER_EMAIL || "noreply@tactay-billedo.com"

    if (!brevoApiKey) {
      return NextResponse.json({ 
        success: true,
        warning: "Email not sent - BREVO_API_KEY not set"
      })
    }

    const emailPayload = {
      sender: {
        name: "TACTAY-BILLEDO DENTAL CLINIC",
        email: senderEmail,
      },
      to: [
        {
          email: patientEmail,
          name: patientName,
        },
      ],
      subject,
      htmlContent: emailBody,
    }

    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": brevoApiKey,
        },
        body: JSON.stringify(emailPayload),
      })

      const responseData = await response.json()
      
      if (!response.ok) {
        // Return success anyway so the appointment status update completes
        return NextResponse.json({ 
          success: true,
          warning: "Email could not be sent - please update BREVO_API_KEY in v0 Settings > Vars",
          details: responseData
        })
      }

      return NextResponse.json({ success: true, messageId: responseData.messageId, sentTo: patientEmail })
    } catch (emailError) {
      // Email sending failed - return success anyway so appointment workflow completes
      return NextResponse.json({ 
        success: true,
        warning: "Email service unavailable",
        details: emailError instanceof Error ? emailError.message : "Unknown error"
      })
    }
  } catch (error) {
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}

interface EmailParams {
  patientName: string
  doctorName: string
  doctorSpecialization: string
  appointmentDate: string
  appointmentTime: string
  appointmentType?: string
  reason?: string
  notes?: string
}

function generateApprovalEmail(params: EmailParams): string {
  const { patientName, doctorName, doctorSpecialization, appointmentDate, appointmentTime, appointmentType, reason, notes } = params

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f0fdf4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="background-color: #059669; padding: 30px; text-align: center; border-radius: 16px 16px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">TACTAY-BILLEDO CLINIC</h1>
              <p style="color: #d1fae5; margin: 8px 0 0 0; font-size: 14px;">Dental & Medical Care</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <h2 style="color: #059669; margin: 0 0 20px; font-size: 24px;">Appointment Confirmed!</h2>
              <p style="color: #6b7280; margin: 0 0 30px; font-size: 16px;">Great news, ${patientName}! Your appointment has been approved.</p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 12px; padding: 20px; text-align: left;">
                <tr>
                  <td style="padding: 10px 20px; border-bottom: 1px solid #e5e7eb;">
                    <strong style="color: #374151;">Date:</strong><br>
                    <span style="color: #059669; font-size: 16px;">${appointmentDate}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 20px; border-bottom: 1px solid #e5e7eb;">
                    <strong style="color: #374151;">Time:</strong><br>
                    <span style="color: #059669; font-size: 16px;">${appointmentTime}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 20px; border-bottom: 1px solid #e5e7eb;">
                    <strong style="color: #374151;">Doctor:</strong><br>
                    <span style="color: #059669; font-size: 16px;">Dr. ${doctorName}</span><br>
                    <span style="color: #6b7280; font-size: 14px;">${doctorSpecialization}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 20px;">
                    <strong style="color: #374151;">Service:</strong><br>
                    <span style="color: #059669; font-size: 16px;">${appointmentType}</span>
                  </td>
                </tr>
              </table>
              
              <p style="color: #6b7280; margin: 30px 0 0; font-size: 14px;">
                Please arrive 10-15 minutes before your scheduled time.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-radius: 0 0 16px 16px;">
              <p style="color: #9ca3af; margin: 0; font-size: 12px;">TACTAY-BILLEDO DENTAL CLINIC</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

function generateRejectionEmail(params: EmailParams): string {
  const { patientName, doctorName, doctorSpecialization, appointmentDate, appointmentTime, notes } = params

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #fef2f2;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef2f2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="background-color: #059669; padding: 30px; text-align: center; border-radius: 16px 16px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">TACTAY-BILLEDO CLINIC</h1>
              <p style="color: #d1fae5; margin: 8px 0 0 0; font-size: 14px;">Dental & Medical Care</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <h2 style="color: #dc2626; margin: 0 0 20px; font-size: 24px;">Appointment Update</h2>
              <p style="color: #6b7280; margin: 0 0 20px; font-size: 16px;">Dear ${patientName},</p>
              <p style="color: #6b7280; margin: 0 0 20px; font-size: 14px;">
                We regret to inform you that your appointment request for <strong>${appointmentDate}</strong> at <strong>${appointmentTime}</strong> 
                with <strong>Dr. ${doctorName}</strong> could not be confirmed.
              </p>
              ${notes ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef2f2; border-radius: 12px; padding: 20px; text-align: left; margin-top: 20px;">
                <tr>
                  <td style="padding: 10px 20px;">
                    <strong style="color: #991b1b;">Reason:</strong><br>
                    <span style="color: #7f1d1d; font-size: 14px;">${notes}</span>
                  </td>
                </tr>
              </table>
              ` : ''}
              <p style="color: #6b7280; margin: 30px 0 0; font-size: 14px;">
                Please log in to your account to schedule a new appointment.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-radius: 0 0 16px 16px;">
              <p style="color: #9ca3af; margin: 0; font-size: 12px;">TACTAY-BILLEDO DENTAL CLINIC</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

function generateCompletionEmail(params: EmailParams): string {
  const { patientName, doctorName, doctorSpecialization, appointmentDate, appointmentTime, notes } = params

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #eff6ff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #eff6ff; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="background-color: #059669; padding: 30px; text-align: center; border-radius: 16px 16px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">TACTAY-BILLEDO CLINIC</h1>
              <p style="color: #d1fae5; margin: 8px 0 0 0; font-size: 14px;">Dental & Medical Care</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <h2 style="color: #2563eb; margin: 0 0 20px; font-size: 24px;">Thank You for Your Visit!</h2>
              <p style="color: #6b7280; margin: 0 0 20px; font-size: 16px;">Dear ${patientName},</p>
              <p style="color: #6b7280; margin: 0 0 20px; font-size: 14px;">
                Your appointment on <strong>${appointmentDate}</strong> at <strong>${appointmentTime}</strong> 
                with <strong>Dr. ${doctorName}</strong> has been completed.
              </p>
              ${notes ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border-radius: 12px; padding: 20px; text-align: left; margin-top: 20px;">
                <tr>
                  <td style="padding: 10px 20px;">
                    <strong style="color: #166534;">Notes:</strong><br>
                    <span style="color: #15803d; font-size: 14px;">${notes}</span>
                  </td>
                </tr>
              </table>
              ` : ''}
              <p style="color: #6b7280; margin: 30px 0 0; font-size: 14px;">
                We hope to see you again soon!
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-radius: 0 0 16px 16px;">
              <p style="color: #9ca3af; margin: 0; font-size: 12px;">TACTAY-BILLEDO DENTAL CLINIC</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}
