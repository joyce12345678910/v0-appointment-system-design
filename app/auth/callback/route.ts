import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const type = searchParams.get("type")
  const next = searchParams.get("next") ?? "/patient"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // If type is recovery, redirect to reset password page
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/auth/reset-password`)
      }
      
      // Check session to determine where to redirect
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // Return to forgot password page with error if code exchange failed
  return NextResponse.redirect(`${origin}/auth/forgot-password?expired=true`)
}
