import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PatientNavbar } from "@/components/patient-navbar"

export const dynamic = 'force-dynamic'

export default async function PatientLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  let user = null
  try {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    user = data.user
  } catch (error) {
    redirect("/auth/login")
  }

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is patient
  let profile = null
  try {
    const { data, error } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    if (error) throw error
    profile = data
  } catch (error) {
    // If profile fetch fails, still allow access but redirect if not patient
  }

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
