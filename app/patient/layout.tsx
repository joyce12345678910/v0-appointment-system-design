import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PatientNavbar } from "@/components/patient-navbar"

export default async function PatientLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is patient
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "patient") {
    redirect("/admin")
  }

  return (
    <div className="min-h-screen bg-background">
      <PatientNavbar />
      <main className="container mx-auto p-6">{children}</main>
    </div>
  )
}
