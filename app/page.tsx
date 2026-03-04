"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MapPin, Facebook, Phone, Mail, Calendar, Shield, Users, Star, ChevronRight, Clock, Menu, X } from "lucide-react"

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check for auth errors in URL and redirect to appropriate page
    const urlParams = new URLSearchParams(window.location.search)
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    
    const error = urlParams.get("error") || hashParams.get("error")
    const errorCode = urlParams.get("error_code") || hashParams.get("error_code")
    
    if (error || errorCode) {
      // Clear the URL and redirect to forgot-password with error
      router.replace("/auth/forgot-password?expired=true")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-gray-100 z-50">
        <div className="container mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img 
              src="/tactay-billedo-logo.png" 
              alt="Tactay-Billedo Logo" 
              className="h-10 sm:h-12 w-auto"
            />
          </Link>
          <div className="hidden md:flex gap-8 items-center">
            <a href="#services" className="text-gray-600 hover:text-emerald-600 transition font-medium">
              Services
            </a>
            <a href="#about" className="text-gray-600 hover:text-emerald-600 transition font-medium">
              About
            </a>
            <a href="#location" className="text-gray-600 hover:text-emerald-600 transition font-medium">
              Location
            </a>
            <a href="#contact" className="text-gray-600 hover:text-emerald-600 transition font-medium">
              Contact
            </a>
          </div>
          <div className="flex gap-2 sm:gap-3 items-center">
            <Button asChild size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-5 sm:px-6 text-xs sm:text-sm">
              <Link href="/auth/login">Log In</Link>
            </Button>
            <button 
              className="md:hidden p-2 text-gray-600 hover:text-emerald-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4">
            <div className="flex flex-col gap-3">
              <a href="#services" className="text-gray-600 hover:text-emerald-600 transition font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                Services
              </a>
              <a href="#about" className="text-gray-600 hover:text-emerald-600 transition font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                About
              </a>
              <a href="#location" className="text-gray-600 hover:text-emerald-600 transition font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                Location
              </a>
              <a href="#contact" className="text-gray-600 hover:text-emerald-600 transition font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Logo - Large and Subtle */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
          <img 
            src="/tactay-billedo-logo.png" 
            alt="" 
            className="w-[800px] h-auto"
          />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-green-50"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-30"></div>

        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight text-balance">
                <span className="text-emerald-600">TACTAY-BILLEDO</span>{" "}
                <span className="block sm:inline">DENTAL CLINIC</span>
              </h1>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-semibold px-8 py-6 rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all"
                >
                  <Link href="/auth/sign-up" className="flex items-center gap-2">
                    Book Appointment
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-gray-300 text-gray-700 hover:border-emerald-500 hover:text-emerald-600 text-lg font-semibold px-8 py-6 rounded-full transition-all bg-white"
                >
                  <Link href="#contact">Contact Us</Link>
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-4 sm:gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900">1000+ Patients</p>
                    <p className="text-gray-500">Trust us</p>
                  </div>
                </div>
                <div className="h-12 w-px bg-gray-200 hidden sm:block"></div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 font-semibold text-gray-900">4.9</span>
                </div>
              </div>

              {/* Mobile Logo and Feature Cards */}
              <div className="lg:hidden pt-4 pb-8">
                {/* Mobile Logo with Attractive Background Design */}
                <div className="relative flex justify-center items-center mb-4 mx-auto" style={{ minHeight: '220px', maxWidth: '280px' }}>
                  {/* Outer Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/40 via-green-100/30 to-teal-200/40 rounded-3xl blur-xl"></div>
                  
                  {/* Main Card Background */}
                  <div className="absolute inset-2 bg-gradient-to-br from-white via-emerald-50/80 to-green-50 rounded-2xl shadow-xl border border-emerald-100/50"></div>
                  
                  {/* Decorative Circles */}
                  <div className="absolute w-52 h-52 rounded-full bg-gradient-to-br from-emerald-100/60 to-green-50/40 animate-pulse"></div>
                  <div className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-green-100/50 to-teal-50/30"></div>
                  <div className="absolute w-36 h-36 rounded-full border-2 border-emerald-300/30 shadow-inner"></div>
                  
                  {/* Glowing Ring */}
                  <div className="absolute w-48 h-48 rounded-full border-4 border-emerald-200/40 shadow-[0_0_30px_rgba(16,185,129,0.2)]"></div>
                  
                  {/* Dot Patterns */}
                  <div className="absolute top-3 right-3 opacity-30">
                    <div className="grid grid-cols-3 gap-1">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 opacity-30">
                    <div className="grid grid-cols-3 gap-1">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Floating Accent Dots */}
                  <div className="absolute top-4 left-6 w-2 h-2 bg-emerald-400 rounded-full animate-bounce opacity-60"></div>
                  <div className="absolute bottom-6 right-4 w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.3s' }}></div>
                  <div className="absolute top-1/3 right-2 w-1 h-1 bg-teal-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.6s' }}></div>
                  
                  {/* The Logo */}
                  <img
                    src="/tactay-billedo-logo.png"
                    alt="Tactay-Billedo Dental Clinic"
                    className="relative z-10 w-40 h-auto drop-shadow-2xl"
                  />
                </div>
                
                {/* Feature Cards Row */}
                <div className="grid grid-cols-2 gap-3 px-2">
                  <div className="bg-white rounded-xl shadow-lg p-3 flex items-center gap-2 border border-gray-100">
                    <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-xs">Easy Booking</p>
                      <p className="text-xs text-gray-500">Online 24/7</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-3 flex items-center gap-2 border border-gray-100">
                    <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-xs">Safe & Secure</p>
                      <p className="text-xs text-gray-500">Data protected</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              {/* Modern Logo Container with Background Design */}
              <div className="relative z-10">
                {/* Decorative Background Circles */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-br from-emerald-100 to-green-50 animate-pulse"></div>
                  <div className="absolute w-[380px] h-[380px] rounded-full bg-gradient-to-tr from-green-100 to-teal-50 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute w-[320px] h-[320px] rounded-full bg-gradient-to-bl from-emerald-50 to-white border-2 border-emerald-100"></div>
                </div>
                
                {/* Decorative Dots Pattern */}
                <div className="absolute top-0 right-0 w-24 h-24 opacity-20">
                  <div className="grid grid-cols-4 gap-2">
                    {[...Array(16)].map((_, i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-10 left-0 w-20 h-20 opacity-20">
                  <div className="grid grid-cols-4 gap-2">
                    {[...Array(16)].map((_, i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-green-500"></div>
                    ))}
                  </div>
                </div>
                
                {/* Glowing Ring Effect */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[400px] h-[400px] rounded-full border-4 border-emerald-200/50 shadow-[0_0_60px_rgba(16,185,129,0.3)]"></div>
                </div>
                
                {/* The Logo */}
                <div className="relative p-8">
                  <img
                    src="/tactay-billedo-logo.png"
                    alt="Tactay-Billedo Dental Clinic"
                    className="w-full max-w-md mx-auto drop-shadow-2xl relative z-10 hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                {/* Floating Accent Elements */}
                <div className="absolute top-8 right-8 w-6 h-6 bg-emerald-400 rounded-full animate-bounce opacity-60"></div>
                <div className="absolute bottom-16 left-8 w-4 h-4 bg-green-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.3s' }}></div>
                <div className="absolute top-1/2 right-4 w-3 h-3 bg-teal-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.6s' }}></div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute top-10 -left-4 bg-white rounded-2xl shadow-xl p-4 animate-float z-20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Easy Booking</p>
                    <p className="text-sm text-gray-500">Online 24/7</p>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-20 -right-4 bg-white rounded-2xl shadow-xl p-4 animate-float-delayed z-20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Safe & Secure</p>
                    <p className="text-sm text-gray-500">Your data protected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <p className="text-emerald-600 font-semibold mb-2">OUR SERVICES</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive dental and medical services designed for your complete well-being
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "General Dentistry", 
                desc: "Regular checkups, cleanings, fillings, and preventive care for optimal oral health", 
                icon: <div className="text-3xl">🦷</div>,
                color: "bg-emerald-50 hover:bg-emerald-100"
              },
              { 
                title: "Cosmetic Dentistry", 
                desc: "Teeth whitening, veneers, and smile makeovers to enhance your beautiful smile", 
                icon: <div className="text-3xl">✨</div>,
                color: "bg-green-50 hover:bg-green-100"
              },
              { 
                title: "Oral Surgery", 
                desc: "Expert surgical procedures including extractions and implant placements", 
                icon: <div className="text-3xl">🏥</div>,
                color: "bg-teal-50 hover:bg-teal-100"
              },
            ].map((service, i) => (
              <div
                key={i}
                className={`${service.color} p-8 rounded-3xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group`}
              >
                <div className="w-16 h-16 bg-white rounded-2xl mb-6 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              {/* Modern Logo Display with Decorative Background */}
              <div className="relative z-10 rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50 p-8 shadow-2xl">
                {/* Decorative Circles Background */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                  <div className="absolute w-80 h-80 rounded-full bg-gradient-to-br from-emerald-100 to-green-50 opacity-50"></div>
                  <div className="absolute w-64 h-64 rounded-full bg-gradient-to-tr from-green-100 to-teal-50 opacity-50"></div>
                  <div className="absolute w-48 h-48 rounded-full border-4 border-emerald-200/30"></div>
                </div>
                
                {/* Dot Pattern */}
                <div className="absolute top-4 right-4 w-16 h-16 opacity-20">
                  <div className="grid grid-cols-4 gap-1">
                    {[...Array(16)].map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 w-12 h-12 opacity-20">
                  <div className="grid grid-cols-3 gap-1">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    ))}
                  </div>
                </div>
                
                {/* The Logo */}
                <img
                  src="/tactay-billedo-logo.png"
                  alt="Tactay-Billedo Dental Clinic"
                  className="relative z-10 w-full max-w-sm mx-auto h-auto drop-shadow-xl"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-emerald-500 rounded-3xl -z-10"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-green-200 rounded-3xl -z-10"></div>
            </div>
            
            <div className="space-y-6">
              <p className="text-emerald-600 font-semibold">ABOUT US</p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Providing Quality Healthcare Since 2015
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Tactay-Billedo Clinic has been serving the community with dedication and excellence. 
                Our team of experienced professionals is committed to providing the highest standard 
                of dental and medical care in a comfortable, modern environment.
              </p>
              
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Expert Team</h4>
                    <p className="text-sm text-gray-600">Licensed professionals</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Safe & Clean</h4>
                    <p className="text-sm text-gray-600">Sterilized equipment</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Flexible Hours</h4>
                    <p className="text-sm text-gray-600">Convenient scheduling</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Star className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Top Rated</h4>
                    <p className="text-sm text-gray-600">5-star reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="location" className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <p className="text-emerald-600 font-semibold mb-2">FIND US</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Visit Our Clinic</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Conveniently located and ready to serve you
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            <div className="rounded-3xl overflow-hidden shadow-lg h-[400px]">
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

            <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl p-8 md:p-12 text-white flex flex-col justify-center" id="contact">
              <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Address</h4>
                    <p className="text-emerald-100">
                      2nd Floor Shell Santo Domingo Building, National Highway, Santo Domingo, Philippines, 2729
                    </p>
                    <a
                      href="https://share.google.com/JvtaNORpcUr4mRMWO"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white underline hover:no-underline mt-2 inline-block text-sm"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Phone</h4>
                    <p className="text-emerald-100">0917 568 0416</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <p className="text-emerald-100">mttactay.billedo@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Facebook className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Social Media</h4>
                    <a
                      href="https://www.facebook.com/TactayBilledoDentalClinic/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-100 hover:text-white transition"
                    >
                      Follow us on Facebook
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <img 
            src="/tactay-billedo-logo.png" 
            alt="" 
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-auto"
          />
        </div>
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready for Your Best Smile?
          </h2>
          <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
            Join thousands of happy patients who trust Tactay-Billedo Clinic for their dental and medical needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-emerald-600 hover:bg-gray-100 text-lg font-semibold px-10 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <Link href="/auth/sign-up" className="flex items-center gap-2">
                Book Appointment
                <ChevronRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 text-lg font-semibold px-10 py-6 rounded-full bg-transparent transition-all"
            >
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <img 
                src="/tactay-billedo-logo.png" 
                alt="Tactay-Billedo" 
                className="h-16 w-auto mb-4 drop-shadow-lg"
              />
              <p className="text-gray-500 max-w-sm">
                Providing excellent dental and medical healthcare services since 2015. 
                Your health is our top priority.
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Quick Links</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#services" className="hover:text-emerald-400 transition">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-emerald-400 transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#location" className="hover:text-emerald-400 transition">
                    Location
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-emerald-400 transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Connect</h3>
              <a
                href="https://www.facebook.com/TactayBilledoDentalClinic/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition"
              >
                <Facebook className="h-5 w-5" />
                Facebook
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 Tactay-Billedo Clinic. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }
      `}</style>
    </div>
  )
}
