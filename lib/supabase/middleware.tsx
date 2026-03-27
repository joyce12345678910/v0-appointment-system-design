import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase credentials are missing, allow all requests (including landing page)
  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse
  }

  // Define public paths that don't require authentication
  const publicPaths = [
    "/",
    "/auth/login",
    "/auth/sign-up",
    "/auth/sign-up-success",
    "/auth/forgot-password",
    "/auth/forgot-password-success",
    "/auth/reset-password",
    "/auth/callback",
    "/auth/error",
  ]
  
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith("/auth/")
  )

  // Skip auth check for public paths to avoid unnecessary token refresh errors
  if (isPublicPath) {
    return supabaseResponse
  }

  try {
    // With Fluid compute, don't put this client in a global environment
    // variable. Always create a new one on each request.
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    })

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    // Handle invalid refresh token by clearing cookies and redirecting to login
    if (error && (error.message.includes("Refresh Token") || error.message.includes("refresh_token"))) {
      // Clear auth cookies
      const response = NextResponse.redirect(new URL("/auth/login", request.url))
      response.cookies.delete("sb-access-token")
      response.cookies.delete("sb-refresh-token")
      // Delete all Supabase auth cookies
      request.cookies.getAll().forEach((cookie) => {
        if (cookie.name.startsWith("sb-")) {
          response.cookies.delete(cookie.name)
        }
      })
      return response
    }

    if (!user) {
      // no user, redirect to login page
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }
  } catch (error) {
    // If there's an auth error, redirect to login and clear cookies
    const response = NextResponse.redirect(new URL("/auth/login", request.url))
    request.cookies.getAll().forEach((cookie) => {
      if (cookie.name.startsWith("sb-")) {
        response.cookies.delete(cookie.name)
      }
    })
    return response
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}
