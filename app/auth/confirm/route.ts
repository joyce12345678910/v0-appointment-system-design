import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/auth/login'

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    })

    if (!error) {
      // If it's a recovery (password reset), redirect to reset password page
      if (type === 'recovery') {
        return NextResponse.redirect(new URL('/auth/reset-password', request.url))
      }
      // For email confirmation, redirect to login
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  // If there's an error, redirect to error page
  return NextResponse.redirect(new URL('/auth/error?message=Invalid+or+expired+link', request.url))
}
