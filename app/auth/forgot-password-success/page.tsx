import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail } from "lucide-react"

export default function ForgotPasswordSuccessPage() {
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
            
            {/* Logo - Transparent Background */}
            <div className="relative p-2">
              <img 
                src="/tactay-billedo-logo.png" 
                alt="TACTAY-BILLEDO CLINIC" 
                className="h-28 w-auto mx-auto relative z-10 drop-shadow-2xl"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mt-5 mb-1 drop-shadow-lg">TACTAY-BILLEDO CLINIC</h1>
          <p className="text-emerald-100 text-base font-medium">Dental & Medical Care</p>
        </div>

        {/* Success Card */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-4 text-center">
            <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Check Your Email</CardTitle>
            <CardDescription className="text-gray-600">Password reset link sent</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800 border border-emerald-100">
              We&apos;ve sent a password reset link to your email address. Please check your inbox and click the link to reset your password. The link will expire in 1 hour.
            </div>
            <Button asChild className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl">
              <Link href="/auth/login">Back to Login</Link>
            </Button>
            <p className="text-center text-sm text-gray-500">
              Didn&apos;t receive the email?{" "}
              <Link href="/auth/forgot-password" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                Try again
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-white/90 text-sm mt-6 drop-shadow">© 2025 TACTAY-BILLEDO CLINIC. All rights reserved.</p>
      </div>
    </div>
  )
}
