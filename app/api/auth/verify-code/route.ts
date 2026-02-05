import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if code exists and is valid
    const { data: verification, error: dbError } = await supabase
      .from("email_verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .single()

    if (dbError || !verification) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 })
    }

    // Check if code is expired
    if (new Date() > new Date(verification.expires_at)) {
      return NextResponse.json({ error: "Verification code has expired" }, { status: 400 })
    }

    // Mark code as used
    await supabase.from("email_verification_codes").update({ used: true }).eq("id", verification.id)

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    })
  } catch (error) {
    console.error("Error verifying code:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
