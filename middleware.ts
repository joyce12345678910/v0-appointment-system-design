import { updateSession } from "@/lib/supabase/middleware"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const code = searchParams.get("code")
  const error = searchParams.get("error")
  const errorCode = searchParams.get("error_code")
  
  // PRIORITY 1: Handle auth code redirects at root URL BEFORE any session checks
  // This is critical - Supabase sends password reset links to /?code=xxx
  if (pathname === "/" && code) {
    const redirectUrl = new URL("/auth/callback", request.url)
    redirectUrl.searchParams.set("code", code)
    
    // Preserve type parameter if present
    const type = searchParams.get("type")
    if (type) {
      redirectUrl.searchParams.set("type", type)
    }
    
    // Return redirect immediately without any Supabase calls
    return NextResponse.redirect(redirectUrl)
  }
  
  // PRIORITY 2: Handle auth errors at root URL
  if (pathname === "/" && (error || errorCode)) {
    const redirectUrl = new URL("/auth/reset-password", request.url)
    redirectUrl.searchParams.set("error", "expired")
    return NextResponse.redirect(redirectUrl)
  }
  
  // PRIORITY 3: Allow /auth/callback through without session checks
  // The callback route handles its own code exchange
  if (pathname === "/auth/callback") {
    return NextResponse.next()
  }
  
  // PRIORITY 4: For all other routes, update session normally
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
