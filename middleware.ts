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
    // Pass type parameter if present
    const type = request.nextUrl.searchParams.get("type")
    if (type) {
      redirectUrl.searchParams.set("type", type)
    }
    return NextResponse.redirect(redirectUrl)
  }
  
  // If there's a code parameter on /auth/callback, pass through to let the route handler process it
  // This handles cases where Supabase redirects directly to callback with a code
  
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
  
  // Don't redirect expired=true from forgot-password - let the page handle it
  // This shows the user a message to request a new link
  
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
