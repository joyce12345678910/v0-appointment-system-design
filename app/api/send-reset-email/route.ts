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
      // Handle rate limiting with user-friendly message
      if (error.message.includes("rate") || error.message.includes("security") || error.message.includes("seconds")) {
        // Extract seconds from message if available
        const secondsMatch = error.message.match(/(\d+)\s*seconds?/)
        const seconds = secondsMatch ? secondsMatch[1] : "60"
        return NextResponse.json({ 
          error: `Please wait ${seconds} seconds before requesting another reset email.` 
        }, { status: 429 })
      }
      // Return success even on other errors to prevent email enumeration
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.log("[v0] Password reset error:", error)
    return NextResponse.json({ success: true }) // Don't reveal errors
  }
}
