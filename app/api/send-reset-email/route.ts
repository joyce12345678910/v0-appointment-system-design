import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Use service role client for admin operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const resendApiKey = process.env.RESEND_API_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.log("[v0] Missing Supabase config")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    if (!resendApiKey) {
      console.log("[v0] Missing RESEND_API_KEY")
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Generate password reset link using admin API
    const { data, error } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email: email,
      options: {
        redirectTo: "https://tactay-billedo.com/auth/reset-password"
      }
    })

    if (error) {
      console.log("[v0] Generate link error:", error.message)
      // Don't reveal if user exists - return success anyway
      return NextResponse.json({ success: true })
    }

    if (!data?.properties?.hashed_token) {
      console.log("[v0] No hashed token generated")
      return NextResponse.json({ success: true })
    }

    // Build direct reset link with token_hash parameter
    const resetLink = `https://tactay-billedo.com/auth/reset-password?token_hash=${data.properties.hashed_token}&type=recovery`
    console.log("[v0] Reset link generated successfully")

    // Send email via Resend
    const emailHtml = generateResetEmail(resetLink)

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
        html: emailHtml,
      }),
    })

    const emailData = await emailResponse.json().catch(() => ({}))

    if (!emailResponse.ok) {
      console.log("[v0] Resend error:", emailResponse.status, emailData)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    console.log("[v0] Password reset email sent via Resend, ID:", emailData.id)
    return NextResponse.json({ success: true })

  } catch (error) {
    console.log("[v0] Password reset error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}

function generateResetEmail(resetLink: string): string {
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
              <h2 style="color: #059669; margin: 0 0 20px; font-size: 24px;">Reset Your Password</h2>
              <p style="color: #6b7280; margin: 0 0 30px; font-size: 16px;">
                We received a request to reset your password. Click the button below to create a new password.
              </p>
              
              <a href="${resetLink}" style="display: inline-block; background-color: #059669; color: #ffffff; padding: 16px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                Reset Password
              </a>
              
              <p style="color: #9ca3af; margin: 30px 0 0; font-size: 14px;">
                This link will expire in 1 hour.
              </p>
              <p style="color: #9ca3af; margin: 10px 0 0; font-size: 12px;">
                If you didn't request this, you can safely ignore this email.
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
