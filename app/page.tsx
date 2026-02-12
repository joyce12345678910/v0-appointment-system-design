"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin, Facebook, Phone, Mail, Calendar, Shield, UserCheck, ArrowRight, CheckCircle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50 shadow-sm">
        <div className="container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">Tactay-Billedo</div>
          <div className="flex gap-3">
            <Button asChild variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 shadow-sm">
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 text-balance leading-tight">
              Professional Dental & Medical Care Made Simple
            </h1>
            <p className="text-lg md:text-xl text-gray-600 text-pretty leading-relaxed">
              Book appointments with trusted doctors, access your medical records securely, and manage your healthcare—all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold px-8 py-6 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <Link href="/auth/sign-up" className="flex items-center gap-2">
                  Book Appointment <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 text-base font-semibold px-8 py-6 rounded-lg transition-all bg-transparent"
              >
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 pt-4">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Trusted by thousands of patients</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-16 md:py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Why Choose Tactay-Billedo</h2>
            <p className="text-base text-gray-600">Professional healthcare with modern convenience</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white p-6 md:p-8 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="h-12 w-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Expert Doctors</h3>
              <p className="text-sm text-gray-600">Qualified specialists with years of professional experience</p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="h-12 w-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Secure Records</h3>
              <p className="text-sm text-gray-600">Your medical data protected with advanced encryption</p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:shadow-md transition-all sm:col-span-2 lg:col-span-1">
              <div className="h-12 w-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Easy Booking</h3>
              <p className="text-sm text-gray-600">Schedule appointments in minutes, anytime, anywhere</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-base text-gray-600">Get started in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-xl mb-2">
                1
              </div>
              <h3 className="text-lg font-bold text-gray-900">Create Account</h3>
              <p className="text-sm text-gray-600">Register in seconds with your basic information</p>
            </div>

            <div className="text-center space-y-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-xl mb-2">
                2
              </div>
              <h3 className="text-lg font-bold text-gray-900">Choose Doctor</h3>
              <p className="text-sm text-gray-600">Select from our team of qualified specialists</p>
            </div>

            <div className="text-center space-y-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-xl mb-2">
                3
              </div>
              <h3 className="text-lg font-bold text-gray-900">Book Appointment</h3>
              <p className="text-sm text-gray-600">Schedule your visit at a convenient time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Credibility */}
      <section className="py-16 md:py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-blue-50 rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Trusted by Thousands</h2>
                <p className="text-base text-gray-600 leading-relaxed">
                  With years of experience and a dedicated team of professionals, we provide reliable healthcare services you can depend on.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-blue-600">5+</div>
                    <div className="text-sm text-gray-600">Years Experience</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-blue-600">2</div>
                    <div className="text-sm text-gray-600">Expert Doctors</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3 bg-white p-4 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Secure & Private</h4>
                    <p className="text-sm text-gray-600">Your medical information is protected with industry-standard encryption</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white p-4 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Professional Care</h4>
                    <p className="text-sm text-gray-600">Receive treatment from qualified and experienced medical professionals</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white p-4 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Convenient Access</h4>
                    <p className="text-sm text-gray-600">Book appointments and access records anytime, from any device</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Contact */}
      <section className="py-16 md:py-20 px-4 bg-gray-50" id="location">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Visit Our Clinic</h2>
            <p className="text-base text-gray-600">Located in Santo Domingo, Philippines</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4 bg-white p-6 rounded-xl border border-gray-200">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    2nd Floor Shell Santo Domingo Building, National Highway, Santo Domingo, Philippines, 2729
                  </p>
                  <a
                    href="https://share.google.com/JvtaNORpcUr4mRMWO"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2 inline-flex items-center gap-1"
                  >
                    View on Maps <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white p-6 rounded-xl border border-gray-200">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                  <p className="text-sm text-gray-600">0917 568 0416</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white p-6 rounded-xl border border-gray-200">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                  <p className="text-sm text-gray-600">mttactay.billedo@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white p-6 rounded-xl border border-gray-200">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Facebook className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Follow Us</h3>
                  <a
                    href="https://www.facebook.com/TactayBilledoDentalClinic/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
                  >
                    Visit our Facebook page <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden shadow-md border border-gray-200 h-[400px] md:h-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.8640651643476!2d121.04540287346156!3d14.577864385925958!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b7f5e5e5e5e5%3A0x5e5e5e5e5e5e5e5e!2sTactay%20Billedo%20Dental%20Clinic!5e0!3m2!1sen!2sph!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-blue-600 text-white py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Get Started?</h2>
          <p className="text-lg text-blue-100">Book your appointment today and experience quality healthcare</p>
          <div className="pt-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 text-base font-semibold px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <Link href="/auth/sign-up" className="flex items-center gap-2">
                Book Appointment Now <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-800">
            <div>
              <div className="text-xl font-bold text-white mb-2">Tactay-Billedo</div>
              <p className="text-sm">Professional dental & medical care since 2015</p>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#location" className="hover:text-white transition">Location</a>
              <a href="tel:09175680416" className="hover:text-white transition">Contact</a>
              <a
                href="https://www.facebook.com/TactayBilledoDentalClinic/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition inline-flex items-center gap-1"
              >
                <Facebook className="h-4 w-4" />
                Facebook
              </a>
            </div>
          </div>
          <div className="pt-6 text-center text-sm">
            <p>&copy; 2025 Tactay-Billedo Medical Center. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
