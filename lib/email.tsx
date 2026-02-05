export interface EmailOptions {
  templateName: string
  recipientEmail: string
  recipientName?: string
  variables?: Record<string, string | number>
}

export async function sendBrandedEmail(options: EmailOptions): Promise<void> {
  try {
    const response = await fetch("/api/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to send email")
    }

    console.log(`Email sent to ${options.recipientEmail}`)
  } catch (error) {
    console.error("Error sending email:", error)
    // Don't throw - email failures shouldn't block the main operation
  }
}

export function formatAppointmentDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/**
 * Send verification code email using Resend
 * Falls back to console logging if RESEND_API_KEY is not configured
 */
export async function sendVerificationCodeEmail(email: string, code: string): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY
  const senderEmail = process.env.SENDER_EMAIL || "noreply@tactaybilledo.com"

  // Development mode: log code to console
  if (!resendApiKey) {
    console.warn(
      `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `[DEVELOPMENT MODE] Verification Code for ${email}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `📧 Email: ${email}\n` +
        `🔐 Code: ${code}\n` +
        `⏱️  Expires in: 10 minutes\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
    )
    return true
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: senderEmail,
        to: email,
        subject: "Your Tactay Billedo Verification Code",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0066cc 0%, #00a8ff 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Tactay Billedo</h1>
              <p style="color: #e0f2ff; margin: 8px 0 0 0; font-size: 14px;">Dental Clinic Appointment System</p>
            </div>
            
            <div style="background: white; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <h2 style="color: #1f2937; margin-top: 0; margin-bottom: 20px; font-size: 20px;">Verify Your Email Address</h2>
              
              <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin: 0 0 30px 0;">
                Welcome to Tactay Billedo! To complete your account registration, please enter the verification code below:
              </p>
              
              <div style="background: linear-gradient(135deg, #f0f7ff 0%, #e0f2ff 100%); padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0; border: 2px solid #0066cc;">
                <p style="color: #0066cc; font-size: 12px; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Your Verification Code</p>
                <p style="font-size: 48px; font-weight: 800; color: #0066cc; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">${code}</p>
              </div>
              
              <p style="color: #6b7280; font-size: 13px; margin: 20px 0; text-align: center;">
                ⏱️ This code expires in <strong>10 minutes</strong>
              </p>
              
              <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="color: #92400e; font-size: 13px; margin: 0;">
                  💡 <strong>Tip:</strong> Never share this code with anyone. Tactay Billedo staff will never ask for your verification code.
                </p>
              </div>
              
              <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin-top: 30px;">
                If you didn't request this code, you can safely ignore this email.
              </p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
              
              <p style="color: #6b7280; font-size: 12px; text-align: center; margin: 0;">
                © 2025 Tactay Billedo Dental Clinic. All rights reserved.
              </p>
            </div>
          </div>
        `,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("❌ Resend API error:", error)
      return false
    }

    console.log(`✅ [EMAIL SENT] Verification code sent to ${email}`)
    return true
  } catch (error) {
    console.error("❌ Error sending verification email:", error)
    return false
  }
}
