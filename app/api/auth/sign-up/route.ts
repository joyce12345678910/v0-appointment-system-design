import { createClient as createServerClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, fullName, phone, dateOfBirth, address, validIdUrl } = body

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Use service role client to create user without email confirmation
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const supabase = createServerClient(supabaseUrl, supabaseServiceKey)

    // Create user with admin API - this bypasses email confirmation
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm the email
      user_metadata: {
        full_name: fullName,
        role: "patient",
        phone: phone || null,
        date_of_birth: dateOfBirth || null,
        address: address || null,
        valid_id_url: validIdUrl || null,
      },
    })

    if (createError) {
      console.log("[v0] Error creating user:", createError.message)
      return NextResponse.json({ error: createError.message }, { status: 400 })
    }

    if (!userData.user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    console.log("[v0] User created successfully:", userData.user.id)

    // Send welcome email via Brevo directly (same as appointment emails)
    const brevoApiKey = process.env.BREVO_API_KEY
    const senderEmail = process.env.BREVO_SENDER_EMAIL || "tactaybilledoclinic@gmail.com"

    if (brevoApiKey) {
      try {
        console.log("[v0] Sending welcome email to:", email)
        
        const emailPayload = {
          sender: {
            name: "TACTAY-BILLEDO CLINIC",
            email: senderEmail,
          },
          to: [{ email, name: fullName }],
          subject: "Welcome to TACTAY-BILLEDO CLINIC!",
          htmlContent: generateWelcomeEmail(fullName),
        }

        const emailResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": brevoApiKey,
          },
          body: JSON.stringify(emailPayload),
        })

        const emailData = await emailResponse.json().catch(() => ({}))
        
        if (emailResponse.ok) {
          console.log("[v0] Welcome email sent successfully, ID:", emailData.messageId)
        } else {
          console.log("[v0] Failed to send welcome email:", emailResponse.status, emailData)
        }
      } catch (emailError) {
        console.log("[v0] Error sending welcome email:", emailError)
      }
    } else {
      console.log("[v0] BREVO_API_KEY not set, skipping welcome email")
    }

    return NextResponse.json({ 
      success: true, 
      user: { 
        id: userData.user.id, 
        email: userData.user.email 
      } 
    })
  } catch (error) {
    console.log("[v0] Sign up API error:", error)
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}

function generateWelcomeEmail(patientName: string): string {
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
              <h2 style="color: #059669; margin: 0 0 20px; font-size: 28px;">Welcome to Our Clinic!</h2>
              <p style="color: #374151; margin: 0 0 20px; font-size: 18px;">Hello <strong>${patientName}</strong>,</p>
              <p style="color: #6b7280; margin: 0 0 30px; font-size: 16px; line-height: 1.6;">
                Thank you for registering with Tactay-Billedo Clinic! We are delighted to have you as part of our patient family.
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border-radius: 12px; padding: 25px; text-align: left; margin-bottom: 30px;">
                <tr>
                  <td>
                    <h3 style="color: #059669; margin: 0 0 15px; font-size: 16px;">What you can do now:</h3>
                    <ul style="color: #374151; margin: 0; padding-left: 20px; line-height: 2;">
                      <li>Book appointments with our doctors</li>
                      <li>View your medical records</li>
                      <li>Manage your profile information</li>
                      <li>Track your appointment history</li>
                    </ul>
                  </td>
                </tr>
              </table>
              
              <a href="https://tactay-billedo.com/auth/login" style="display: inline-block; background-color: #059669; color: #ffffff; padding: 14px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                Login to Your Account
              </a>
              
              <p style="color: #9ca3af; margin: 30px 0 0; font-size: 14px;">
                If you have any questions, feel free to contact us anytime.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-radius: 0 0 16px 16px;">
              <p style="color: #6b7280; margin: 0 0 5px; font-size: 14px;">We look forward to serving you!</p>
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
