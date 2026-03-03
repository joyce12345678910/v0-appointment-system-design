"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isValidSession, setIsValidSession] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        setIsValidSession(true)
      } else {
        setError("Invalid or expired reset link. Please request a new one.")
      }
    }
    checkSession()
  }, [supabase.auth])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) throw error
      setSuccess(true)
      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isValidSession && !error) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-emerald-600 via-green-500 to-teal-500 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardContent className="pt-6">
            <p className="text-center text-sm text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-600 via-green-500 to-teal-500 flex items-center justify-center p-4 relative overflow-hidden">
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
            
            {/* Logo Container */}
            <div className="relative bg-white rounded-3xl p-5 shadow-2xl border border-white/20 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl opacity-50"></div>
              <img 
                src="/tactay-billedo-logo.png" 
                alt="Tactay-Billedo Clinic" 
                className="h-24 w-auto mx-auto relative z-10 drop-shadow-lg"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mt-5 mb-1 drop-shadow-lg">Tactay-Billedo Clinic</h1>
          <p className="text-emerald-100 text-base font-medium">Dental & Medical Care</p>
        </div>

        {/* Reset Password Card */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">Create New Password</CardTitle>
            <CardDescription className="text-gray-600">Enter your new password below</CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="flex flex-col gap-4">
                <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800 font-medium border border-emerald-100">
                  Password reset successful! Redirecting to login...
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">
                    New Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    className="h-11 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    className="h-11 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                
                {error && <p className="text-sm text-destructive font-medium bg-red-50 p-3 rounded-lg">{error}</p>}
                
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl" 
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>

                <div className="pt-4 border-t border-gray-200 text-center text-sm">
                  <Link 
                    href="/auth/login" 
                    className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                  >
                    Back to Login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-white/90 text-sm mt-6 drop-shadow">© 2025 Tactay-Billedo Clinic. All rights reserved.</p>
      </div>
    </div>
  )
}
