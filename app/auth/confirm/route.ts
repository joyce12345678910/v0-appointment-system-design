import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const token_hash = requestUrl.searchParams.get("token_hash")
  const type = requestUrl.searchParams.get("type")

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type: type as "recovery" | "signup" | "email",
      token_hash,
    })

    if (!error) {
      // Redirect to reset password page after successful verification
      if (type === "recovery") {
        return NextResponse.redirect(new URL("/auth/reset-password", requestUrl.origin))
      }
      // For email confirmation, redirect to login
      return NextResponse.redirect(new URL("/auth/login", requestUrl.origin))
    }
  }

  // If there's an error, redirect to error page
  return NextResponse.redirect(new URL("/auth/error?message=Invalid+or+expired+link", requestUrl.origin))
}
