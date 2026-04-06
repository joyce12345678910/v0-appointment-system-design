import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Create admin client to generate reset link
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Check if user exists
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (listError) {
      console.log("[v0] Error listing users:", listError.message)
      // Still return success to prevent email enumeration
      return NextResponse.json({ success: true })
    }

    const user = users.users.find(u => u.email?.toLowerCase() === email.toLowerCase())
    
    if (!user) {
      // Return success even if user doesn't exist (prevents email enumeration)
      console.log("[v0] User not found for email:", email)
      return NextResponse.json({ success: true })
    }

    // Generate password reset link
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email: email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('.supabase.co', '')}.supabase.co/auth/v1/verify?redirect_to=${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL || 'https://tactay-billedo.com')}/auth/callback?type=recovery`
      }
    })

    if (linkError) {
      console.log("[v0] Error generating link:", linkError.message)
      return NextResponse.json({ error: "Failed to generate reset link" }, { status: 500 })
    }

    // The action_link contains the full reset URL
    const resetLink = linkData.properties?.action_link
    
    if (!resetLink) {
      console.log("[v0] No action link generated")
      return NextResponse.json({ error: "Failed to generate reset link" }, { status: 500 })
    }

    console.log("[v0] Reset link generated successfully")

    // Send email via Resend
    const resendApiKey = process.env.RESEND_API_KEY
    
    if (!resendApiKey) {
      console.log("[v0] RESEND_API_KEY not set")
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
    }

    const emailPayload = {
      from: "TACTAY-BILLEDO DENTAL CLINIC <noreply@tactay-billedo.com>",
      to: [email],
      subject: "Reset Your Password - TACTAY-BILLEDO CLINIC",
      html: generateResetEmailHtml(user.user_metadata?.full_name || "Patient", resetLink),
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify(emailPayload),
    })

    const emailData = await emailResponse.json()

    if (emailResponse.ok) {
      console.log("[v0] Password reset email sent successfully via Resend, ID:", emailData.id)
      return NextResponse.json({ success: true })
    } else {
      console.log("[v0] Failed to send email via Resend:", emailResponse.status, emailData)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }
  } catch (error) {
    console.log("[v0] Error in send-reset-email:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generateResetEmailHtml(patientName: string, resetLink: string): string {
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
              <h2 style="color: #059669; margin: 0 0 20px; font-size: 28px;">Password Reset Request</h2>
              <p style="color: #374151; margin: 0 0 20px; font-size: 18px;">Hello <strong>${patientName}</strong>,</p>
              <p style="color: #6b7280; margin: 0 0 30px; font-size: 16px; line-height: 1.6;">
                We received a request to reset your password. Click the button below to create a new password.
              </p>
              
              <a href="${resetLink}" style="display: inline-block; background-color: #059669; color: #ffffff; padding: 16px 48px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; margin-bottom: 30px;">
                Reset Password
              </a>
              
              <p style="color: #9ca3af; margin: 30px 0 0; font-size: 14px; line-height: 1.6;">
                This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.
              </p>
              
              <p style="color: #9ca3af; margin: 20px 0 0; font-size: 12px; word-break: break-all;">
                If the button doesn't work, copy and paste this link:<br>
                <a href="${resetLink}" style="color: #059669;">${resetLink}</a>
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
