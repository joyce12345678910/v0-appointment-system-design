import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const siteUrl = "https://tactay-billedo.com"

    // Create admin client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Check if user exists first
    const { data: users } = await supabaseAdmin.auth.admin.listUsers()
    const user = users?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase())
    
    if (!user) {
      // Return success even if user doesn't exist (prevents email enumeration)
      return NextResponse.json({ success: true })
    }

    // Generate a simple magic link for recovery that goes directly to reset-password page
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email: email,
    })

    if (error || !data?.properties?.hashed_token) {
      console.log("[v0] Error generating link:", error?.message)
      return NextResponse.json({ error: "Failed to generate reset link" }, { status: 500 })
    }

    // Build the reset URL that goes directly to the reset-password page
    // Using the token_hash and type parameters that Supabase expects
    const resetLink = `${siteUrl}/auth/reset-password?token_hash=${data.properties.hashed_token}&type=recovery`

    console.log("[v0] Reset link generated for:", email)

    // Send email via Resend
    const resendApiKey = process.env.RESEND_API_KEY
    
    if (!resendApiKey) {
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
    }

    const patientName = user.user_metadata?.full_name || "Patient"

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "TACTAY-BILLEDO DENTAL CLINIC <noreply@tactay-billedo.com>",
        to: [email],
        subject: "Reset Your Password - TACTAY-BILLEDO CLINIC",
        html: `
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
              <h2 style="color: #059669; margin: 0 0 20px; font-size: 28px;">Password Reset</h2>
              <p style="color: #374151; margin: 0 0 20px; font-size: 18px;">Hello <strong>${patientName}</strong>,</p>
              <p style="color: #6b7280; margin: 0 0 30px; font-size: 16px; line-height: 1.6;">
                Click the button below to reset your password.
              </p>
              
              <a href="${resetLink}" style="display: inline-block; background-color: #059669; color: #ffffff; padding: 16px 48px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                Reset Password
              </a>
              
              <p style="color: #9ca3af; margin: 30px 0 0; font-size: 14px;">
                This link expires in 1 hour.
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
        `,
      }),
    })

    const emailData = await emailResponse.json()

    if (emailResponse.ok) {
      console.log("[v0] Password reset email sent via Resend, ID:", emailData.id)
      return NextResponse.json({ success: true })
    } else {
      console.log("[v0] Resend error:", emailData)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }
  } catch (error) {
    console.log("[v0] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
