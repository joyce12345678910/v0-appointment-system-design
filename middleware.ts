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
  
  // If there's an error parameter at root, check the error type
  // Don't redirect - let the home page handle it or user can navigate manually
  // This prevents incorrectly catching password reset errors
  
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
