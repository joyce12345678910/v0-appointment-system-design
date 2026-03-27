import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { appointmentId, action } = await request.json()

    if (!appointmentId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

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
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    const patientEmail = appointment.patient?.email
    const patientName = appointment.patient?.full_name || "Patient"
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
    const reason = appointment.reason || "Not specified"
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

    // Send email using Brevo (Sendinblue)
    const brevoApiKey = process.env.BREVO_API_KEY
    const senderEmail = process.env.BREVO_SENDER_EMAIL || "noreply@tactay-billedo.com"
    const senderName = process.env.BREVO_SENDER_NAME || "TACTAY-BILLEDO DENTAL CLINIC"

    console.log("[v0] ========== EMAIL DEBUG ==========")
    console.log("[v0] BREVO_API_KEY exists:", !!brevoApiKey)
    console.log("[v0] BREVO_API_KEY length:", brevoApiKey?.length || 0)
    console.log("[v0] Sender Email:", senderEmail)
    console.log("[v0] Patient Email:", patientEmail)
    console.log("[v0] Patient Name:", patientName)
    console.log("[v0] Subject:", subject)
    console.log("[v0] ===================================")

    if (brevoApiKey) {
      console.log("[v0] Making request to Brevo API...")
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": brevoApiKey,
        },
        body: JSON.stringify({
          sender: {
            name: senderName,
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
        }),
      })

      console.log("[v0] Brevo API response status:", response.status)
      const responseData = await response.json()
      console.log("[v0] Brevo API response data:", JSON.stringify(responseData))
      
      if (!response.ok) {
        console.error("[v0] Brevo API error:", responseData)
        return NextResponse.json({ 
          error: "Failed to send email", 
          details: responseData 
        }, { status: 500 })
      }

      console.log("[v0] Email sent successfully! Message ID:", responseData.messageId)
      return NextResponse.json({ success: true, messageId: responseData.messageId })
    } else {
      // Log email for development/testing when no API key is set
      console.log("[v0] Email would be sent (no BREVO_API_KEY set):")
      console.log("[v0] To:", patientEmail)
      console.log("[v0] Subject:", subject)
      
      return NextResponse.json({ 
        success: true, 
        message: "Email logged (BREVO_API_KEY not configured). Add BREVO_API_KEY to send real emails.",
        emailDetails: { to: patientEmail, subject }
      })
    }
  } catch (error) {
    console.error("[v0] Error sending email:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
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
  <title>Appointment Confirmed</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0fdf4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #059669 0%, #10b981 50%, #14b8a6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">TACTAY-BILLEDO CLINIC</h1>
              <p style="color: #d1fae5; margin: 8px 0 0 0; font-size: 14px;">Dental & Medical Care</p>
            </td>
          </tr>
          
          <!-- Success Icon -->
          <tr>
            <td style="padding: 40px 30px 20px; text-align: center;">
              <div style="width: 80px; height: 80px; background-color: #d1fae5; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 40px; line-height: 80px;">✓</span>
              </div>
              <h2 style="color: #059669; margin: 20px 0 10px; font-size: 28px; font-weight: 700;">Appointment Confirmed!</h2>
              <p style="color: #6b7280; margin: 0; font-size: 16px;">Great news, ${patientName}!</p>
            </td>
          </tr>
          
          <!-- Appointment Details -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 12px; padding: 24px;">
                <tr>
                  <td>
                    <h3 style="color: #111827; margin: 0 0 20px; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px;">Appointment Details</h3>
                    
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #6b7280; font-size: 14px;">Patient Name</span><br>
                          <span style="color: #111827; font-size: 16px; font-weight: 600;">${patientName}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #6b7280; font-size: 14px;">Date & Time</span><br>
                          <span style="color: #111827; font-size: 16px; font-weight: 600;">${appointmentDate} at ${appointmentTime}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #6b7280; font-size: 14px;">Doctor</span><br>
                          <span style="color: #111827; font-size: 16px; font-weight: 600;">Dr. ${doctorName}</span><br>
                          <span style="color: #059669; font-size: 14px;">${doctorSpecialization}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #6b7280; font-size: 14px;">Appointment Type</span><br>
                          <span style="color: #111827; font-size: 16px; font-weight: 600;">${appointmentType}</span>
                        </td>
                      </tr>
                      ${reason ? `
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #6b7280; font-size: 14px;">Reason for Visit</span><br>
                          <span style="color: #111827; font-size: 16px;">${reason}</span>
                        </td>
                      </tr>
                      ` : ''}
                      ${notes ? `
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #6b7280; font-size: 14px;">Notes from Clinic</span><br>
                          <span style="color: #111827; font-size: 16px;">${notes}</span>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Reminders -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-radius: 12px; padding: 20px;">
                <tr>
                  <td>
                    <h4 style="color: #92400e; margin: 0 0 12px; font-size: 16px; font-weight: 600;">Important Reminders</h4>
                    <ul style="color: #92400e; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                      <li>Please arrive 10-15 minutes before your scheduled time</li>
                      <li>Bring a valid ID and any relevant medical records</li>
                      <li>If you need to reschedule, please contact us at least 24 hours in advance</li>
                    </ul>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; margin: 0 0 8px; font-size: 14px;">Need to make changes?</p>
              <p style="color: #059669; margin: 0 0 16px; font-size: 14px; font-weight: 600;">Log in to your account or contact us directly</p>
              <p style="color: #9ca3af; margin: 0; font-size: 12px;">© 2025 TACTAY-BILLEDO CLINIC. All rights reserved.</p>
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
  const { patientName, doctorName, doctorSpecialization, appointmentDate, appointmentTime, reason, notes } = params

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Update</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fef2f2;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef2f2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #059669 0%, #10b981 50%, #14b8a6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">TACTAY-BILLEDO CLINIC</h1>
              <p style="color: #d1fae5; margin: 8px 0 0 0; font-size: 14px;">Dental & Medical Care</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <h2 style="color: #dc2626; margin: 0 0 10px; font-size: 24px; font-weight: 700;">Appointment Could Not Be Confirmed</h2>
              <p style="color: #6b7280; margin: 0 0 20px; font-size: 16px;">Dear ${patientName},</p>
              <p style="color: #6b7280; margin: 0; font-size: 14px; line-height: 1.6;">
                We regret to inform you that your appointment request for <strong>${appointmentDate} at ${appointmentTime}</strong> 
                with <strong>Dr. ${doctorName}</strong> (${doctorSpecialization}) could not be confirmed at this time.
              </p>
            </td>
          </tr>
          
          ${notes ? `
          <tr>
            <td style="padding: 0 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef2f2; border-radius: 12px; padding: 20px;">
                <tr>
                  <td>
                    <h4 style="color: #991b1b; margin: 0 0 12px; font-size: 16px; font-weight: 600;">Reason</h4>
                    <p style="color: #7f1d1d; margin: 0; font-size: 14px;">${notes}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ` : ''}
          
          <!-- CTA -->
          <tr>
            <td style="padding: 0 30px 40px; text-align: center;">
              <p style="color: #6b7280; margin: 0 0 20px; font-size: 14px;">
                Please log in to your account to schedule a new appointment at a different time.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; margin: 0 0 8px; font-size: 14px;">We apologize for any inconvenience.</p>
              <p style="color: #9ca3af; margin: 0; font-size: 12px;">© 2025 TACTAY-BILLEDO CLINIC. All rights reserved.</p>
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
  <title>Appointment Completed</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #eff6ff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #eff6ff; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #059669 0%, #10b981 50%, #14b8a6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">TACTAY-BILLEDO CLINIC</h1>
              <p style="color: #d1fae5; margin: 8px 0 0 0; font-size: 14px;">Dental & Medical Care</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <div style="width: 80px; height: 80px; background-color: #dbeafe; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 40px; line-height: 80px;">✓</span>
              </div>
              <h2 style="color: #2563eb; margin: 20px 0 10px; font-size: 24px; font-weight: 700;">Thank You for Your Visit!</h2>
              <p style="color: #6b7280; margin: 0 0 20px; font-size: 16px;">Dear ${patientName},</p>
              <p style="color: #6b7280; margin: 0; font-size: 14px; line-height: 1.6;">
                Your appointment on <strong>${appointmentDate} at ${appointmentTime}</strong> 
                with <strong>Dr. ${doctorName}</strong> (${doctorSpecialization}) has been completed.
              </p>
            </td>
          </tr>
          
          ${notes ? `
          <tr>
            <td style="padding: 0 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border-radius: 12px; padding: 20px;">
                <tr>
                  <td>
                    <h4 style="color: #166534; margin: 0 0 12px; font-size: 16px; font-weight: 600;">Notes from Your Visit</h4>
                    <p style="color: #15803d; margin: 0; font-size: 14px;">${notes}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ` : ''}
          
          <!-- CTA -->
          <tr>
            <td style="padding: 0 30px 40px; text-align: center;">
              <p style="color: #6b7280; margin: 0 0 10px; font-size: 14px;">
                You can view your medical records and book follow-up appointments by logging into your account.
              </p>
              <p style="color: #059669; margin: 0; font-size: 14px; font-weight: 600;">
                We hope to see you again soon!
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; margin: 0 0 8px; font-size: 14px;">Thank you for choosing TACTAY-BILLEDO CLINIC</p>
              <p style="color: #9ca3af; margin: 0; font-size: 12px;">© 2025 TACTAY-BILLEDO CLINIC. All rights reserved.</p>
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
