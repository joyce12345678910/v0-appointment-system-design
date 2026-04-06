import { createClient as createServerClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, fullName, phone, dateOfBirth, address, validIdUrl } = body

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Use service role client to create user without email confirmation
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const supabase = createServerClient(supabaseUrl, supabaseServiceKey)

    // Create user with admin API - this bypasses email confirmation
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm the email
      user_metadata: {
        full_name: fullName,
        role: "patient",
        phone: phone || null,
        date_of_birth: dateOfBirth || null,
        address: address || null,
        valid_id_url: validIdUrl || null,
      },
    })

    if (createError) {
      console.log("[v0] Error creating user:", createError.message)
      return NextResponse.json({ error: createError.message }, { status: 400 })
    }

    if (!userData.user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    console.log("[v0] User created successfully:", userData.user.id)

    // Send welcome email (don't wait for it, fire and forget)
    try {
      const baseUrl = request.headers.get("origin") || "https://tactay-billedo.com"
      fetch(`${baseUrl}/api/send-welcome-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, fullName }),
      }).catch(() => {
        // Ignore welcome email errors
      })
    } catch {
      // Ignore welcome email errors
    }

    return NextResponse.json({ 
      success: true, 
      user: { 
        id: userData.user.id, 
        email: userData.user.email 
      } 
    })
  } catch (error) {
    console.log("[v0] Sign up API error:", error)
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}
