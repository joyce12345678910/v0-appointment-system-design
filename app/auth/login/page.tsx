"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, Suspense } from "react"

function LoginContent() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingRedirect, setIsCheckingRedirect] = useState(true)
  const router = useRouter() // Used for login redirect
  const searchParams = useSearchParams()

  // Check for hash fragment errors AND query param errors (from Supabase auth redirects)
  // This runs FIRST and blocks rendering until checked
  useEffect(() => {
    // Debug logging to trace redirect flow
    console.log("[v0] Login page loaded")
    console.log("[v0] Full URL:", window.location.href)
    console.log("[v0] Hash:", window.location.hash)
    console.log("[v0] Search:", window.location.search)
    console.log("[v0] Referrer:", document.referrer)
    
    // Check hash fragment first
    const hash = window.location.hash.substring(1)
    if (hash) {
      console.log("[v0] Detected hash fragment:", hash)
      const hashParams = new URLSearchParams(hash)
      const hashError = hashParams.get("error")
      const errorCode = hashParams.get("error_code")
      const errorDescription = hashParams.get("error_description") || ""
      
      // If there's an OTP expired, access denied, or link-related error, redirect to forgot-password
      if (hashError === "access_denied" || 
          errorCode === "otp_expired" || 
          errorDescription.toLowerCase().includes("expired") ||
          errorDescription.toLowerCase().includes("invalid") ||
          errorDescription.toLowerCase().includes("link")) {
        window.location.href = "/auth/forgot-password?expired=true"
        return
      }
      
      // For other auth errors in hash, show a message
      if (hashError) {
        setError(errorDescription ? decodeURIComponent(errorDescription.replace(/\+/g, ' ')) : "Authentication error occurred")
        window.history.replaceState(null, "", "/auth/login")
      }
    }
    
    // Also check query params for errors
    const queryError = searchParams.get("error")
    const queryErrorCode = searchParams.get("error_code")
    const queryErrorDescription = searchParams.get("error_description") || ""
    
    if (queryError === "link_expired" || 
        queryError === "access_denied" || 
        queryErrorCode === "otp_expired" ||
        queryErrorDescription.toLowerCase().includes("expired") ||
        queryErrorDescription.toLowerCase().includes("invalid") ||
        queryErrorDescription.toLowerCase().includes("link")) {
      window.location.href = "/auth/forgot-password?expired=true"
      return
    }
    
    setIsCheckingRedirect(false)
  }, [searchParams])

  // Check for query params (verified success message only)
  useEffect(() => {
    const verified = searchParams.get("verified")
    
    if (verified === "true") {
      setSuccessMessage("Email verified successfully! You can now log in.")
      setError(null)
    }
  }, [searchParams])

  // Clear any stale session on login page load
  useEffect(() => {
    const clearStaleSession = async () => {
      const supabase = createClient()
      try {
        // Try to get the current session
        const { error } = await supabase.auth.getSession()
        // If there's a refresh token error, sign out to clear stale cookies
        if (error && (error.message.includes("Refresh Token") || error.message.includes("refresh_token"))) {
          await supabase.auth.signOut()
        }
      } catch {
        // If any error occurs, try to sign out
        await supabase.auth.signOut()
      }
    }
    clearStaleSession()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      // First, sign out any existing session to ensure clean login
      await supabase.auth.signOut()
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

      if (profile?.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/patient")
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading while checking for redirects
  if (isCheckingRedirect) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-emerald-600 via-green-500 to-teal-500 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-600 via-green-500 to-teal-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Home Navigation Button - Mobile Friendly */}
      <Link href="/" className="fixed top-4 left-4 z-50 sm:top-6 sm:left-6">
        <Button 
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/15 transition-all duration-200 font-medium rounded-full"
        >
          <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="hidden xs:inline">Home</span>
        </Button>
      </Link>

      {/* Background Logo Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <img 
          src="/tactay-billedo-logo.png" 
          alt="" 
          className="w-[800px] h-auto"
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Modern Logo Header with Decorative Elements */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            {/* Decorative Rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full border-2 border-white/20 animate-pulse"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border border-white/10"></div>
            </div>
            {/* Floating Dots */}
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-white/40 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-emerald-200/60 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
            
            {/* Logo - Transparent Background */}
            <div className="relative p-2">
              <img 
                src="/tactay-billedo-logo.png" 
                alt="Tactay-Billedo Clinic" 
                className="h-28 w-auto mx-auto relative z-10 drop-shadow-2xl"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mt-5 mb-1 drop-shadow-lg">Tactay-Billedo Clinic</h1>
          <p className="text-emerald-100 text-base font-medium">Dental & Medical Care</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
            <CardDescription className="text-gray-600">Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              {successMessage && (
                <p className="text-sm text-emerald-700 font-medium bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                  {successMessage}
                </p>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="h-11 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="h-11 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <p className="text-sm text-destructive font-medium bg-red-50 p-3 rounded-lg">{error}</p>}

              <Button
                type="submit"
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <Link
                href="/auth/forgot-password"
                className="block text-center text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                Forgot your password?
              </Link>

              <div className="pt-4 border-t border-gray-200 text-center text-sm">
                <p className="text-gray-600">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/auth/sign-up"
                    className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-white/90 text-sm mt-6 drop-shadow">© 2025 Tactay-Billedo Clinic. All rights reserved.</p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full bg-gradient-to-br from-emerald-600 via-green-500 to-teal-500 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
