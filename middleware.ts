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
    return NextResponse.redirect(redirectUrl)
  }
  
  // If there's an error parameter at root, redirect to forgot password
  if (pathname === "/" && error) {
    const redirectUrl = new URL("/auth/forgot-password", request.url)
    redirectUrl.searchParams.set("expired", "true")
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
