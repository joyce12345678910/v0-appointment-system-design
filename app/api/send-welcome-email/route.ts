import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, fullName } = body

    if (!email || !fullName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const resendApiKey = process.env.RESEND_API_KEY

    if (!resendApiKey) {
      console.log("[v0] RESEND_API_KEY not set, skipping welcome email")
      return NextResponse.json({ 
        success: true,
        warning: "Email not sent - RESEND_API_KEY not set"
      })
    }

    const emailPayload = {
      from: "TACTAY-BILLEDO DENTAL CLINIC <noreply@tactay-billedo.com>",
      to: [email],
      subject: "Welcome to TACTAY-BILLEDO CLINIC!",
      html: generateWelcomeEmail(fullName),
    }

    console.log("[v0] Sending welcome email via Resend to:", email)

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify(emailPayload),
    })

    const responseData = await response.json().catch(() => ({}))

    if (!response.ok) {
      console.log("[v0] Resend error:", response.status, responseData)
      return NextResponse.json({ 
        success: true,
        warning: "Welcome email could not be sent",
        details: responseData
      })
    }

    console.log("[v0] Welcome email sent successfully, ID:", responseData.id)
    return NextResponse.json({ success: true, sentTo: email, messageId: responseData.id })
  } catch (error) {
    console.log("[v0] Welcome email error:", error)
    return NextResponse.json({ 
      success: true,
      warning: "Email service temporarily unavailable"
    })
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
              <div style="width: 80px; height: 80px; background-color: #d1fae5; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 40px;">🎉</span>
              </div>
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
