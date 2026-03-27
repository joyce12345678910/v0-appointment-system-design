import { NextResponse } from "next/server"

export async function GET() {
  const brevoApiKey = process.env.BREVO_API_KEY
  const senderEmail = process.env.BREVO_SENDER_EMAIL

  console.log("[v0] ========== EMAIL TEST ==========")
  console.log("[v0] BREVO_API_KEY exists:", !!brevoApiKey)
  console.log("[v0] BREVO_API_KEY first 10 chars:", brevoApiKey?.substring(0, 10) + "...")
  console.log("[v0] BREVO_SENDER_EMAIL:", senderEmail)
  console.log("[v0] ===================================")

  if (!brevoApiKey) {
    return NextResponse.json({ 
      error: "BREVO_API_KEY not set",
      senderEmail: senderEmail || "not set"
    }, { status: 500 })
  }

  if (!senderEmail) {
    return NextResponse.json({ 
      error: "BREVO_SENDER_EMAIL not set",
      apiKeyExists: true
    }, { status: 500 })
  }

  // Test sending an email to the sender email itself (always works for verified emails)
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": brevoApiKey,
      },
      body: JSON.stringify({
        sender: {
          name: "TACTAY-BILLEDO DENTAL CLINIC",
          email: senderEmail,
        },
        to: [
          {
            email: senderEmail,
            name: "Test Recipient",
          },
        ],
        subject: "Test Email - TACTAY-BILLEDO CLINIC",
        htmlContent: `
          <h1>Test Email</h1>
          <p>This is a test email from TACTAY-BILLEDO DENTAL CLINIC.</p>
          <p>If you receive this, your Brevo integration is working correctly!</p>
          <p>Sent at: ${new Date().toISOString()}</p>
        `,
      }),
    })

    const responseData = await response.json()
    console.log("[v0] Brevo test response status:", response.status)
    console.log("[v0] Brevo test response data:", JSON.stringify(responseData))

    if (!response.ok) {
      return NextResponse.json({ 
        error: "Brevo API error",
        status: response.status,
        details: responseData,
        senderEmail
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: `Test email sent to ${senderEmail}`,
      messageId: responseData.messageId,
      senderEmail
    })
  } catch (error) {
    console.error("[v0] Test email error:", error)
    return NextResponse.json({ 
      error: "Failed to send test email",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
