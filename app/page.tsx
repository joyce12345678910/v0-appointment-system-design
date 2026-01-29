"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin, Facebook, Phone, Mail, Clock, Check, Star } from "lucide-react"

export default function HomePage() {
  const doctors = [
    {
      name: "Dr. LYKA KAYABCABO",
      specialty: "General Practitioner",
      image: "/doctor-female-2.png",
    },
    {
      name: "Dr. ADRIAN UBARRE",
      specialty: "Senior Physician",
      image: "/male-cardiologist-doctor-portrait.jpg",
    },
  ]

  const testimonials = [
    {
      name: "Maria Santos",
      text: "Exceptional care and service! The doctors are professional and truly care about your well-being. I felt comfortable the entire visit.",
      rating: 5,
    },
    {
      name: "John Reyes",
      text: "Amazing experience from start to finish. The staff is friendly and the facility is very clean and modern. Highly recommended!",
      rating: 5,
    },
    {
      name: "Ana Cruz",
      text: "Finally found a clinic I can trust. Dr. Ubarre is knowledgeable and takes time to explain everything clearly.",
      rating: 5,
    },
  ]

  const benefits = [
    "Same-day emergency appointments available",
    "Transparent pricing with no surprise bills",
    "State-of-the-art medical technology",
    "Comfortable and welcoming environment",
    "Extended hours for your convenience",
    "Professional and caring medical team",
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Bar */}
      <nav className="sticky top-0 bg-background border-b border-border z-50 shadow-sm">
        <div className="container mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">Tactay Billedo</div>
          <div className="hidden md:flex gap-8 items-center">
            <a href="#services" className="text-foreground hover:text-primary transition font-medium">
              Services
            </a>
            <a href="#team" className="text-foreground hover:text-primary transition font-medium">
              Our Team
            </a>
            <a href="#location" className="text-foreground hover:text-primary transition font-medium">
              Location
            </a>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
              <Link href="/auth/sign-up">Book Now</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary via-primary to-[#004a99] text-primary-foreground py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-foreground rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-foreground rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold text-balance leading-tight">Redefining Your Healthcare Experience</h1>
                <p className="text-xl text-primary-foreground/90 text-pretty leading-relaxed">
                  Experience state-of-the-art medical care in a comfortable, professional environment. Our experienced team is dedicated to your well-being.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg font-semibold px-8 py-6 rounded-xl shadow-lg"
                >
                  <Link href="/patient/book">Book Online</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 text-lg font-semibold bg-transparent rounded-xl transition"
                >
                  <Link href="/auth/login">Call or Sign In</Link>
                </Button>
              </div>

              <div className="flex flex-wrap gap-8 text-sm text-primary-foreground/80 pt-4">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  <span>Same-day Appointments</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  <span>Transparent Pricing</span>
                </div>
              </div>
            </div>

            <div className="relative w-full h-64 sm:h-80 md:h-96 hidden md:block">
              <img
                src="/smiling-professional-doctor-with-modern-background.jpg"
                alt="Featured Doctor"
                className="rounded-2xl shadow-2xl w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-24 px-4 bg-card" id="services">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Comprehensive Healthcare Solutions</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              From routine check-ups to specialized care, we provide a full range of medical services all in one convenient location.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "General Medicine", desc: "Preventive care and routine check-ups for the whole family", icon: "🏥" },
              { title: "Specialized Care", desc: "Expert consultations for specific medical concerns", icon: "👨‍⚕️" },
              { title: "Emergency Services", desc: "Immediate care for urgent medical situations", icon: "🚑" },
            ].map((service, i) => (
              <div
                key={i}
                className="bg-background p-8 rounded-xl shadow-sm hover:shadow-md transition border border-border group"
              >
                <div className="h-14 w-14 bg-secondary rounded-lg mb-6 flex items-center justify-center text-3xl group-hover:bg-primary group-hover:text-primary-foreground transition">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Kind Words from Our Patients</h2>
            <p className="text-lg text-muted-foreground">Real experiences from people who trust us with their healthcare</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-card p-8 rounded-xl border border-border shadow-sm hover:shadow-md transition">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                <p className="font-bold text-foreground">— {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-24 px-4 bg-card" id="team">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Meet Our Expert Doctors</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              With decades of combined experience, our dedicated physicians are committed to your health and wellness
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {doctors.map((doctor) => (
              <div key={doctor.name} className="group">
                <div className="overflow-hidden rounded-2xl mb-6 shadow-md hover:shadow-xl transition h-96">
                  <img
                    src={doctor.image || "/placeholder.svg"}
                    alt={doctor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">{doctor.name}</h3>
                <p className="text-primary font-semibold text-lg">{doctor.specialty}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Perks & Benefits Section */}
      <div className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">You Deserve Quality Care</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We believe in making healthcare accessible, affordable, and comfortable for everyone
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex gap-4 items-start bg-card p-6 rounded-xl border border-border hover:border-primary transition">
                <Check className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <p className="text-foreground font-medium">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Location & Contact Section */}
      <div className="py-24 px-4 bg-card" id="location">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Map */}
            <div className="rounded-2xl overflow-hidden shadow-lg h-96 order-2 md:order-1">
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
            <div className="space-y-8 order-1 md:order-2">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Visit Our Clinic</h2>
                <p className="text-muted-foreground text-lg">
                  Conveniently located in Santo Domingo with ample parking and modern facilities. We're ready to welcome you!
                </p>
              </div>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex gap-4">
                  <div className="h-12 w-12 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Address</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      2nd Floor Shell Santo Domingo Building, National Highway, Santo Domingo, Camarines Sur, Philippines
                    </p>
                    <a
                      href="https://share.google.com/JvtaNORpcUr4mRMWO"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 font-semibold mt-2 inline-flex items-center gap-2 transition"
                    >
                      Get Directions
                      <MapPin className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4">
                  <div className="h-12 w-12 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Phone</h3>
                    <p className="text-muted-foreground">0917 568 0416</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <div className="h-12 w-12 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Email</h3>
                    <p className="text-muted-foreground">mttactay.billedo@gmail.com</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="pt-6 border-t border-border">
                <a
                  href="https://www.facebook.com/TactayBilledoDentalClinic/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-xl transition shadow-md hover:shadow-lg"
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
      <div className="bg-gradient-to-r from-primary to-[#004a99] text-primary-foreground py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">Book Today for Quality Care</h2>
            <p className="text-xl text-primary-foreground/90">
              Tactay Billedo is committed to exceptional care with cutting-edge technology and a compassionate team.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              asChild
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg font-semibold px-8 py-6 rounded-xl"
            >
              <Link href="/patient/book">Book Now</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 text-lg font-semibold rounded-xl bg-transparent transition"
            >
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-foreground text-primary-foreground/70 py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-primary-foreground font-bold mb-4 text-lg">Tactay Billedo</h3>
              <p className="text-sm leading-relaxed">Providing exceptional healthcare services with compassion and expertise.</p>
            </div>
            <div>
              <h3 className="text-primary-foreground font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#services" className="hover:text-primary-foreground transition">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#team" className="hover:text-primary-foreground transition">
                    Our Team
                  </a>
                </li>
                <li>
                  <a href="#location" className="hover:text-primary-foreground transition">
                    Location
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-primary-foreground font-bold mb-4">Services</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/patient/book" className="hover:text-primary-foreground transition">
                    Book Appointment
                  </a>
                </li>
                <li>
                  <a href="/patient/records" className="hover:text-primary-foreground transition">
                    Medical Records
                  </a>
                </li>
                <li>
                  <a href="/patient/profile" className="hover:text-primary-foreground transition">
                    Patient Profile
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-primary-foreground font-bold mb-4">Follow Us</h3>
              <a
                href="https://www.facebook.com/TactayBilledoDentalClinic/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-primary-foreground transition"
              >
                <Facebook className="h-5 w-5" />
                <span>Facebook</span>
              </a>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm">
            <p>&copy; 2025 Tactay Billedo Medical Center. All rights reserved.</p>
            <p className="mt-2">Dr. Adrian Ubarre & Team</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
