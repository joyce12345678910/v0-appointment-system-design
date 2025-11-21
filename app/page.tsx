"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin, Facebook, Phone, Mail, Clock } from "lucide-react"

export default function HomePage() {
  const doctors = [
    {
      name: "Dr. LYKA KAYABCABO",
      specialty: "MATUROG",
      image: "/doctor-female-2.png",
    },
    {
      name: "Dr. ADRIAN UBARRE",
      specialty: "Cardiologist",
      image: "/male-cardiologist-doctor-portrait.jpg",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="sticky top-0 bg-white border-b border-gray-200 z-50">
        <div className="container mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">Tactay Billedo</div>
          <div className="hidden md:flex gap-8 items-center">
            <a href="#doctors" className="text-gray-700 hover:text-blue-600 transition">
              Doctors
            </a>
            <a href="#location" className="text-gray-700 hover:text-blue-600 transition">
              Location
            </a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 transition">
              Contact
            </a>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/auth/sign-up">Register</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold text-balance leading-tight">Your Health, Our Priority</h1>
                <p className="text-xl text-blue-100 text-pretty leading-relaxed">
                  Experience seamless healthcare with expert doctors, secure appointments, and comprehensive medical
                  records all in one trusted platform.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 text-lg font-semibold px-8 py-7 rounded-lg shadow-lg"
                >
                  <Link href="/auth/sign-up">Book Appointment</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg font-semibold bg-transparent rounded-lg transition"
                >
                  <Link href="/auth/login">Sign In</Link>
                </Button>
              </div>

              <div className="flex flex-wrap gap-6 text-sm text-blue-100 pt-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  <span>Quick Consultations</span>
                </div>
              </div>
            </div>

            <div className="relative w-full h-64 sm:h-80 md:h-96">
              <img
                src="/smiling-professional-doctor-with-modern-background.jpg"
                alt="Featured Doctor"
                className="rounded-2xl shadow-2xl w-full h-full object-cover"
              />
              <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-white rounded-xl shadow-xl p-3 md:p-4 max-w-xs">
                <p className="text-xs md:text-sm text-gray-600 font-semibold">Trusted by thousands of patients</p>
                <div className="flex gap-1 mt-2">
                  <span className="text-yellow-400">★★★★★</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Tactay Billedo?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We combine professional healthcare expertise with cutting-edge technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Expert Doctors", desc: "Qualified specialists with years of experience", icon: "👨‍⚕️" },
              { title: "Secure Records", desc: "Your medical data protected with encryption", icon: "🔒" },
              { title: "Easy Booking", desc: "Schedule appointments in minutes, anytime", icon: "📅" },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition border border-gray-200"
              >
                <div className="h-12 w-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center text-2xl">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Doctors Section */}
      <div className="py-20 px-4" id="doctors">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Expert Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our experienced doctors are dedicated to providing you with exceptional healthcare
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {doctors.map((doctor) => (
              <div key={doctor.name} className="group">
                <div className="overflow-hidden rounded-2xl mb-6 shadow-lg hover:shadow-2xl transition">
                  <img
                    src={doctor.image || "/placeholder.svg"}
                    alt={doctor.name}
                    className="w-full h-96 object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{doctor.name}</h3>
                <p className="text-blue-600 font-semibold text-lg">{doctor.specialty}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Location & Contact Section */}
      <div className="py-20 px-4 bg-gray-50" id="location">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Map */}
            <div className="rounded-2xl overflow-hidden shadow-lg h-96">
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

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Visit Us Today</h2>
                <p className="text-gray-600 text-lg mb-8">
                  Located in the heart of the city, we welcome you to our modern medical facility.
                </p>
              </div>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex gap-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Address</h3>
                    <p className="text-gray-600">
                      2nd Floor Shell Santo Domingo Building, National Highway, Santo Domingo, Philippines, 2729
                    </p>
                    <a
                      href="https://share.google.com/JvtaNORpcUr4mRMWO"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-semibold mt-2 inline-flex items-center gap-2"
                    >
                      View on Maps
                      <MapPin className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600">0917 568 0416</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">mttactay.billedo@gmail.com</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Follow Us</h3>
                <a
                  href="https://www.facebook.com/TactayBilledoDentalClinic/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition shadow-md hover:shadow-lg"
                >
                  <Facebook className="h-5 w-5" />
                  Follow on Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <h2 className="text-4xl font-bold">Ready to Book Your Appointment?</h2>
          <p className="text-xl text-blue-100">Join thousands of patients who trust us with their healthcare</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg font-semibold px-8 py-6 rounded-lg"
            >
              <Link href="/auth/sign-up">Get Started Now</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg font-semibold rounded-lg bg-transparent"
            >
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">Tactay Billedo</h3>
              <p className="text-sm">Providing excellent healthcare services since 2015</p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#doctors" className="hover:text-white transition">
                    Our Doctors
                  </a>
                </li>
                <li>
                  <a href="#location" className="hover:text-white transition">
                    Location
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Services</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Appointments
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Medical Records
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Consultations
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Follow</h3>
              <a
                href="https://www.facebook.com/TactayBilledoDentalClinic/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-white transition"
              >
                <Facebook className="h-5 w-5" />
                Facebook
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 Tactay Billedo Medical Center. All rights reserved.</p>
            <p>ADRIAN UBARRE</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
