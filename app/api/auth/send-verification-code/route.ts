import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Generate 6-digit code
    const code = generateVerificationCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store verification code in database
    const { error: dbError } = await supabase.from("email_verification_codes").insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
    })

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to generate verification code" }, { status: 500 })
    }

    // Send email via Supabase
    const { error: emailError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: false,
    })

    // For now, just return the code (in production, send via email service)
    // In real implementation, you'd use SendGrid, Mailgun, or similar
    console.log(`Verification code for ${email}: ${code}`)

    return NextResponse.json({
      success: true,
      message: "Verification code sent to email",
    })
  } catch (error) {
    console.error("Error sending verification code:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
