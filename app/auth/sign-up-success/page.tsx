import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SignUpSuccessPage() {
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
                alt="Tactay-Billedo Clinic" 
                className="h-28 w-auto mx-auto relative z-10 drop-shadow-2xl"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mt-5 mb-1 drop-shadow-lg">Tactay-Billedo Clinic</h1>
          <p className="text-emerald-100 text-base font-medium">Dental & Medical Care</p>
        </div>

        {/* Success Card */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-4 text-center">
            <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Registration Successful!</CardTitle>
            <CardDescription className="text-gray-600">Check your email to confirm your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800 border border-emerald-100">
              We&apos;ve sent a confirmation email to your inbox. Please click the link in the email to verify your
              account before signing in.
            </div>
            <Button asChild className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl">
              <Link href="/auth/login">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-white/90 text-sm mt-6 drop-shadow">© 2025 Tactay-Billedo Clinic. All rights reserved.</p>
      </div>
    </div>
  )
}
