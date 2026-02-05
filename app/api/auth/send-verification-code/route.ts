import { createClient } from "@/lib/supabase/server"
import { sendVerificationCodeEmail } from "@/lib/email"
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

    // Validate email format
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
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
      verified: false,
    })

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to generate verification code" }, { status: 500 })
    }

    // Send verification code via email
    const emailSent = await sendVerificationCodeEmail(email, code)

    if (!emailSent) {
      console.warn(`Warning: Verification code generated for ${email} but email delivery status unknown`)
      // Still return success - code is stored in DB and can be used in dev mode
    }

    return NextResponse.json({
      success: true,
      message: "Verification code sent to email",
    })
  } catch (error) {
    console.error("Error sending verification code:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
