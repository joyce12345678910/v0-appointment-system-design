import { updateSession } from "@/lib/supabase/middleware"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const code = request.nextUrl.searchParams.get("code")
  const error = request.nextUrl.searchParams.get("error")
  
  // If there's a code parameter at root, redirect to auth callback
  if (pathname === "/" && code) {
    const redirectUrl = new URL("/auth/callback", request.url)
    redirectUrl.searchParams.set("code", code)
    // Pass type parameter if present (for recovery flow)
    const type = request.nextUrl.searchParams.get("type")
    if (type) {
      redirectUrl.searchParams.set("type", type)
    } else {
      // Default to recovery since password reset sends code to root
      redirectUrl.searchParams.set("type", "recovery")
    }
    return NextResponse.redirect(redirectUrl)
  }
  
  // If there's an error parameter at root, redirect to login with error message
  if (pathname === "/" && error) {
    const errorDescription = request.nextUrl.searchParams.get("error_description")
    const redirectUrl = new URL("/auth/login", request.url)
    if (errorDescription?.includes("expired")) {
      redirectUrl.searchParams.set("error", "link_expired")
    } else {
      redirectUrl.searchParams.set("error", "verification_failed")
    }
    return NextResponse.redirect(redirectUrl)
  }
  
  // Handle errors on forgot-password page - redirect to login
  // Note: error details are in hash fragment which isn't visible server-side
  // So we check for expired=true query param which Supabase adds
  if (pathname === "/auth/forgot-password" && request.nextUrl.searchParams.get("expired") === "true") {
    const redirectUrl = new URL("/auth/login", request.url)
    redirectUrl.searchParams.set("error", "link_expired")
    return NextResponse.redirect(redirectUrl)
  }
  
  // Also handle if there's an error param on forgot-password
  if (pathname === "/auth/forgot-password" && error) {
    const redirectUrl = new URL("/auth/login", request.url)
    redirectUrl.searchParams.set("error", "verification_failed")
    return NextResponse.redirect(redirectUrl)
  }
  
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
