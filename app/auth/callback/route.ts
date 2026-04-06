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
      const session = data.session
      
      // Check if this is a password recovery flow
      // For password recovery, Supabase sets specific indicators:
      // 1. The type parameter is "recovery"
      // 2. The user's app_metadata may have recovery indicators
      // 3. The AMR claim may include "recovery" method
      const amr = session.user?.app_metadata?.amr
      const hasRecoveryAmr = Array.isArray(amr) && amr.some((m: { method?: string }) => m.method === "recovery")
      const isRecovery = type === "recovery" || hasRecoveryAmr
      
      if (isRecovery) {
        return NextResponse.redirect(`${origin}/auth/reset-password`)
      }
      
      // Not recovery - this is either sign-up verification or regular login
      // Redirect to patient dashboard or admin based on role
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
    
    // If code exchange failed, redirect to login with error
    if (error) {
      return NextResponse.redirect(`${origin}/auth/login?error=verification_failed`)
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
