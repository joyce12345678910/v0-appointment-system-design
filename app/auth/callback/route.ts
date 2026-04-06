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
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // If type is recovery, redirect to reset password page
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/auth/reset-password`)
      }
      
      // Check session to determine where to redirect
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
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
