import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = await createClient()
    
    // Use Supabase's built-in password reset
    // This sends the email through Supabase's email service
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://tactay-billedo.com/auth/reset-password",
    })

    if (error) {
      console.log("[v0] Password reset error:", error.message)
      // Don't reveal if user exists or not
      if (error.message.includes("rate limit")) {
        return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
      }
      // Return success even on error to prevent email enumeration
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.log("[v0] Password reset error:", error)
    return NextResponse.json({ success: true }) // Don't reveal errors
  }
}
