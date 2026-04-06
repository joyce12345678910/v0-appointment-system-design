import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const token = searchParams.get("token")
  const type = searchParams.get("type")
  const next = searchParams.get("next") ?? searchParams.get("redirect_to") ?? "/patient"

  const supabase = await createClient()

  // Handle PKCE code exchange (OAuth flow)
  if (code) {
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data?.session) {
      // If type is explicitly recovery, redirect to reset password
      // This is the most reliable check as it comes from our own redirect URL
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/auth/reset-password`)
      }
      
      // Not recovery - this is either sign-up verification or regular login
      // Redirect to patient dashboard or admin based on role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.session.user.id)
        .single()
      
      if (profile?.role === "admin") {
        return NextResponse.redirect(`${origin}/admin`)
      }
      return NextResponse.redirect(`${origin}/patient`)
    }
    
    // If code exchange failed but type is recovery, still try to go to reset password
    // The user might already have a session from clicking the link
    if (type === "recovery") {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        return NextResponse.redirect(`${origin}/auth/reset-password`)
      }
      // No session and code failed - link may be expired
      return NextResponse.redirect(`${origin}/auth/forgot-password?expired=true`)
    }
    
    // If code exchange failed for non-recovery, redirect to login
    if (error) {
      return NextResponse.redirect(`${origin}/auth/login`)
    }
  }

  // Handle token-based verification (email verification, magic link)
  if (token) {
    // For signup verification, the token is already processed by Supabase
    // We just need to check if the user is now authenticated
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session) {
      // User is verified and logged in
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/auth/reset-password`)
      }
      
      // Check user role and redirect accordingly
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single()
      
      if (profile?.role === "admin") {
        return NextResponse.redirect(`${origin}/admin`)
      }
      return NextResponse.redirect(`${origin}/patient`)
    }
    
    // For signup type, redirect to login with success message
    if (type === "signup") {
      return NextResponse.redirect(`${origin}/auth/login?verified=true`)
    }
  }

  // Handle type-based redirects when no code/token but type exists
  if (type === "signup") {
    return NextResponse.redirect(`${origin}/auth/login?verified=true`)
  }
  
  if (type === "recovery") {
    return NextResponse.redirect(`${origin}/auth/reset-password`)
  }

  // Default: redirect to login page
  return NextResponse.redirect(`${origin}/auth/login`)
}
