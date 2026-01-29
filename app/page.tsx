"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin, Facebook, Phone, Mail, Star, Check, Clock } from "lucide-react"

export default function HomePage() {
  const doctors = [
    {
      name: "Dr. Adrian Ubarre",
      specialty: "Senior Physician",
      image: "/male-cardiologist-doctor-portrait.jpg",
    },
    {
      name: "Dr. Lyka Kayabcabo",
      specialty: "General Practitioner",
      image: "/doctor-female-2.png",
    },
  ]

  const testimonials = [
    {
      name: "Ola M.",
      text: "Exceptional care and service at Tactay Billedo! What sets this clinic apart is its attention to detail and personalized service. It's clear they genuinely care about making each visit as comfortable and stress-free as possible.",
      rating: 5,
    },
    {
      name: "David S.",
      text: "Dr. Adrian is amazing. He does such great work and has such great advice. He is not only super personable but is also so fast! We can't believe what he accomplished in an hour.",
      rating: 5,
    },
    {
      name: "Chelsea P.",
      text: "I honestly have to say that Dr. Adrian is the best physician I've ever known. He has such a wonderful spirit and a smile that brightens the day.",
      rating: 5,
    },
  ]

  const benefits = [
    "Serving the entire family - all ages welcome",
    "Same-day emergency appointments available",
    "Transparent pricing with no surprise bills",
  ]

  const perks = [
    "Modern comfortable waiting area",
    "State-of-the-art medical technology",
    "Spa-like relaxing environment",
    "Professional and caring medical team",
    "Extended hours for your convenience",
    "Ample free parking available",
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
      <div className="bg-white pt-20 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">Redefining your healthcare experience</h1>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-semibold px-8 py-6 rounded-lg"
              >
                <Link href="/patient/book">Book Online</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg font-semibold px-8 py-6 rounded-lg border-2 bg-transparent"
              >
                <Link href="tel:0917-568-0416">Or Call 0917 568 0416</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="bg-background py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground text-center mb-8">Welcome to Tactay Billedo!</h2>
            <p className="text-lg text-foreground leading-relaxed">
              Enjoy state-of-the-art medical care in a spa-like environment. Our experienced physicians, with decades of combined experience, use the latest technology and modern techniques to provide exceptional healthcare.
            </p>
            <p className="text-lg text-foreground leading-relaxed">
              Inspired by excellence and dedicated to your comfort, our clinic mirrors professionalism and innovation, guiding us to deliver organized, efficient, and compassionate care. Immerse yourself in a relaxing, welcoming environment and transform your medical visit into a positive and enjoyable experience.
            </p>
            <div className="space-y-4 pt-6 text-lg text-foreground">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
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
                className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 text-lg font-semibold rounded-xl bg-transparent transition"
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

      {/* Testimonials Section */}
      <div className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">Kind words from our patients</h2>
            <p className="text-muted-foreground text-sm">Testimonials reflect individual experiences and may not represent all patients.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-card p-8 rounded-lg border border-border">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <span key={j} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-foreground mb-4 leading-relaxed italic text-sm">"{testimonial.text}"</p>
                <p className="font-semibold text-foreground">— {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-20 px-4 bg-card">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl font-bold text-foreground text-center mb-16">All-in-one healthcare solutions, right here in one place</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "Comprehensive Medicine", 
                desc: "From routine check-ups to specialized care and advanced treatments, leverage our expertise and modern technology to achieve optimal health outcomes."
              },
              { 
                title: "Emergency Services", 
                desc: "In pain or urgent need? We offer immediate relief through same-day appointments and compassionate emergency care. We're here to get you feeling better fast."
              },
              { 
                title: "Preventive Care", 
                desc: "Modern and personalized preventive care for all ages. We invite you to book a consultation and take the first step toward better health."
              },
            ].map((service, i) => (
              <div key={i} className="bg-background p-8 rounded-lg">
                <h3 className="text-xl font-bold text-foreground mb-4">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">{service.desc}</p>
                <a href="/patient/book" className="text-primary font-semibold hover:underline text-sm">
                  LEARN MORE
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Luxury Perks Section */}
      <div className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-5xl">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-foreground mb-4">A place of relaxation and rejuvenation</h2>
              <h3 className="text-2xl font-semibold text-foreground">You deserve quality care!</h3>
            </div>
            <p className="text-center text-lg text-foreground mb-4">Our free signature comforts and perks:</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {perks.map((perk, i) => (
                <div key={i} className="flex items-center gap-3 text-foreground">
                  <span className="text-primary font-bold">✓</span>
                  <span>{perk}</span>
                </div>
              ))}
            </div>
            <div className="text-center pt-6">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-semibold px-8 py-6 rounded-lg"
              >
                <Link href="/patient/book">Your First Visit</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 px-4 bg-card">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl font-bold text-foreground text-center mb-6">Transparent Pricing</h2>
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground">No Surprises</h3>
              <p className="text-lg text-foreground leading-relaxed">
                Nothing is more important to us than delivering the highest quality of care—and that includes full transparency from start to finish. We keep you informed about the cost of any treatment so there are no surprises.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground">Insurance</h3>
              <p className="text-lg text-foreground leading-relaxed">
                We work with most insurance providers to make healthcare accessible. Give us a call at <a href="tel:0917-568-0416" className="text-primary font-semibold">0917 568 0416</a> with any questions. We're here to help.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl font-bold text-foreground text-center mb-16">Meet Our Expert Team</h2>

          <div className="grid md:grid-cols-2 gap-12">
            {doctors.map((doctor) => (
              <div key={doctor.name} className="group">
                <div className="overflow-hidden rounded-lg mb-6 shadow-md h-80">
                  <img
                    src={doctor.image || "/placeholder.svg"}
                    alt={doctor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-1">{doctor.name}</h3>
                <p className="text-primary font-semibold">{doctor.specialty}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visit Section */}
      <div className="py-20 px-4 bg-card">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl font-bold text-foreground text-center mb-16">Visit Our Clinic</h2>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Contact Info */}
            <div className="space-y-8">
              <p className="text-lg text-foreground leading-relaxed">
                Conveniently book online or give us a call. Same-day appointments and ample free parking are available. We look forward to welcoming you!
              </p>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex gap-4">
                  <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-foreground mb-2">Address</h3>
                    <p className="text-foreground leading-relaxed">
                      2nd Floor Shell Santo Domingo Building, National Highway, Santo Domingo, Camarines Sur, Philippines
                    </p>
                    <a
                      href="https://share.google.com/JvtaNORpcUr4mRMWO"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-semibold mt-2 inline-block hover:underline"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex gap-4">
                  <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-foreground mb-2">Hours</h3>
                    <p className="text-foreground">Monday - Friday: 9-5</p>
                    <p className="text-foreground">Saturday: 10-3</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4">
                  <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-foreground mb-2">Phone</h3>
                    <a href="tel:0917-568-0416" className="text-primary font-semibold">
                      0917 568 0416
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-lg overflow-hidden shadow-md h-96">
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
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-primary-foreground py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <h2 className="text-4xl font-bold">Book today for quality care</h2>
          <p className="text-xl text-primary-foreground/90">
            Tactay Billedo is committed to exceptional care with cutting-edge technology and an experienced team that prioritizes your well-being.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg font-semibold px-8 py-6 rounded-lg"
          >
            <Link href="/patient/book">Book Online</Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-foreground text-primary-foreground/80 py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm">
            <p>&copy; 2025 Tactay Billedo Medical Center. All rights reserved.</p>
            <p className="mt-2">Dr. Adrian Ubarre & Medical Team</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
