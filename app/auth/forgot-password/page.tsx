"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error
      setSuccess(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
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

        {/* Forgot Password Card */}
        <Card className="shadow-2xl border-0 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">Reset Password</CardTitle>
            <CardDescription className="text-gray-600">
              Enter your email to receive a password reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="flex flex-col gap-4">
                <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800 font-medium border border-green-100">
                  Check your email for a password reset link. The link will expire in 1 hour.
                </div>
                <Link href="/auth/login">
                  <Button className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                    Back to Login
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {error && <p className="text-sm text-destructive font-medium bg-red-50 p-3 rounded-lg">{error}</p>}

                <Button
                  type="submit"
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>

                <div className="pt-4 border-t border-gray-200 text-center text-sm">
                  <p className="text-gray-600">
                    Remember your password?{" "}
                    <Link
                      href="/auth/login"
                      className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                      Login here
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-white text-sm mt-6">© 2025 Tactay Billedo Dental Clinic. All rights reserved.</p>
      </div>
    </div>
  )
}
