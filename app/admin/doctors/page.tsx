"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AddDoctorDialog } from "@/components/add-doctor-dialog"
import { EditDoctorDialog } from "@/components/edit-doctor-dialog"
import { DeleteDoctorDialog } from "@/components/delete-doctor-dialog"
import type { Doctor } from "@/lib/types"
import { Search, Mail, Phone, Award } from "lucide-react"

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDoctors()
  }, [])

  useEffect(() => {
    filterDoctors()
  }, [doctors, searchQuery])

  const fetchDoctors = async () => {
    const supabase = createClient()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.from("doctors").select("*").order("full_name", { ascending: true })

      if (error) throw error
      setDoctors(data || [])
    } catch (error) {
      console.error("Error fetching doctors:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterDoctors = () => {
    if (!searchQuery) {
      setFilteredDoctors(doctors)
      return
    }

    const filtered = doctors.filter(
      (doctor) =>
        doctor.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    setFilteredDoctors(filtered)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Doctors</h1>
          <p className="text-muted-foreground">Manage doctor profiles and availability</p>
        </div>
        <AddDoctorDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Doctors</CardTitle>
          <CardDescription>Total doctors: {doctors.length}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, specialization, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Doctors List */}
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">Loading doctors...</p>
          ) : filteredDoctors.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">Dr. {doctor.full_name}</CardTitle>
                        <CardDescription>{doctor.specialization}</CardDescription>
                      </div>
                      <Badge variant={doctor.available ? "default" : "secondary"}>
                        {doctor.available ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {doctor.email}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        {doctor.phone}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Award className="h-4 w-4" />
                        License: {doctor.license_number}
                      </div>
                    </div>

                    {(doctor.years_of_experience || doctor.consultation_fee) && (
                      <div className="flex gap-4 text-sm">
                        {doctor.years_of_experience && (
                          <div>
                            <span className="font-medium">Experience:</span> {doctor.years_of_experience} years
                          </div>
                        )}
                        {doctor.consultation_fee && (
                          <div>
                            <span className="font-medium">Fee:</span> ₱{doctor.consultation_fee.toFixed(2)}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <EditDoctorDialog doctor={doctor} />
                      <DeleteDoctorDialog doctorId={doctor.id} doctorName={doctor.full_name} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No doctors found</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
