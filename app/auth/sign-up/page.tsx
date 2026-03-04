"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [address, setAddress] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/patient`,
          data: {
            full_name: fullName,
            role: "patient",
          },
        },
      })

      if (error) throw error

      if (data.user) {
        router.push("/auth/sign-up-success")
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
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
        <div className="text-center mb-6">
          <div className="relative inline-block">
            {/* Decorative Rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-2 border-white/20 animate-pulse"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full border border-white/10"></div>
            </div>
            {/* Floating Dots */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-emerald-200/60 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
            
            {/* Logo - Transparent Background */}
            <div className="relative p-2">
              <img 
                src="/tactay-billedo-logo.png" 
                alt="Tactay-Billedo Clinic" 
                className="h-24 w-auto mx-auto relative z-10 drop-shadow-2xl"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mt-4 mb-1 drop-shadow-lg">Tactay-Billedo Clinic</h1>
          <p className="text-emerald-100 text-base font-medium">Dental & Medical Care</p>
        </div>

        {/* Sign Up Card */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
            <CardDescription className="text-gray-600">Register as a patient</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-700 font-medium">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Juan Dela Cruz"
                  className="h-10 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="juan@example.com"
                  className="h-10 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700 font-medium">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+63-917-123-4567"
                    className="h-10 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="text-gray-700 font-medium">
                    Date of Birth
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    className="h-10 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-gray-700 font-medium">
                  Address
                </Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="123 Main St, Manila"
                  className="h-10 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  className="h-10 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
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
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>

              <div className="pt-3 border-t border-gray-200 text-center text-sm">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                  >
                    Login here
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
