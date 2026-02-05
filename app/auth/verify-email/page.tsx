"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

export default function VerifyEmailPage() {
  const [code, setCode] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam))
    }
  }, [searchParams])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Verification failed")
      }

      // Code verified successfully, now create the user account
      const supabase = createClient()

      // Get the email and password from sessionStorage (set during sign-up)
      const sessionData = sessionStorage.getItem("pendingSignUp")
      if (!sessionData) {
        throw new Error("Sign-up session expired. Please sign up again.")
      }

      const { password, fullName, phone, dateOfBirth, address } = JSON.parse(sessionData)

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: "patient",
          },
        },
      })

      if (authError) throw authError

      if (authData.user) {
        // Create profile with additional information
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: authData.user.id,
          full_name: fullName,
          phone,
          date_of_birth: dateOfBirth,
          address,
          role: "patient",
        })

        if (profileError) throw profileError

        // Clear session storage
        sessionStorage.removeItem("pendingSignUp")

        router.push("/auth/sign-up-success")
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred during verification")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsResending(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/send-verification-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend code")
      }

      setTimeLeft(600) // Reset timer
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to resend verification code")
    } finally {
      setIsResending(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Tactay Billedo</h1>
          <p className="text-blue-100 text-lg">Dental Clinic</p>
          <p className="text-blue-100 text-sm mt-1">Appointment System</p>
        </div>

        {/* Verification Card */}
        <Card className="shadow-2xl border-0 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">Verify Your Email</CardTitle>
            <CardDescription className="text-gray-600">Enter the 6-digit code sent to {email}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-gray-700 font-medium">
                  Verification Code
                </Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="000000"
                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-center text-2xl tracking-widest"
                  maxLength={6}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                />
                <p className="text-xs text-gray-500 text-center">Expires in {formatTime(timeLeft)}</p>
              </div>

              {error && <p className="text-sm text-destructive font-medium bg-red-50 p-3 rounded-lg">{error}</p>}

              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                disabled={isLoading || code.length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify Email"}
              </Button>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center mb-3">Didn't receive the code?</p>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={handleResendCode}
                  disabled={isResending || timeLeft > 540} // Allow resend after 1 minute
                >
                  {isResending ? "Sending..." : "Resend Code"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-white text-sm mt-6">© 2025 Tactay Billedo Dental Clinic. All rights reserved.</p>
      </div>
    </div>
  )
}
