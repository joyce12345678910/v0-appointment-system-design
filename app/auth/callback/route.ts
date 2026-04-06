import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const token = searchParams.get("token")
  const type = searchParams.get("type")
  const next = searchParams.get("next") ?? searchParams.get("redirect_to") ?? "/patient"

  const supabase = await createClient()

  // For recovery flow, check for existing session FIRST
  // This handles cases where the user already clicked the link and has a valid session
  if (type === "recovery") {
    // First try to exchange the code if provided
    if (code) {
      const { error, data } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error && data?.session) {
        // Code exchange successful, redirect to reset password
        return NextResponse.redirect(`${origin}/auth/reset-password`)
      }
      
      // Code exchange failed, but check if there's already a valid session
      // This can happen if user clicked the link multiple times
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        // User has a valid session, let them reset password
        return NextResponse.redirect(`${origin}/auth/reset-password`)
      }
      // No valid session and code failed - link is expired or invalid
      return NextResponse.redirect(`${origin}/auth/reset-password?error=expired`)
    }
    
    // No code but type is recovery - check for session
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      return NextResponse.redirect(`${origin}/auth/reset-password`)
    }
    
    // No code and no session - redirect to reset password with error
    return NextResponse.redirect(`${origin}/auth/reset-password?error=expired`)
  }

  // Handle PKCE code exchange for non-recovery flows (signup verification, etc.)
  if (code) {
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data?.session) {
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
    
    // Code exchange failed for non-recovery, check for existing session
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
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
    
    // No session and code failed - redirect to login
    return NextResponse.redirect(`${origin}/auth/login`)
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
