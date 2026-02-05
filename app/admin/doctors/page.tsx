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
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl border border-blue-100">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Doctors</h1>
          <p className="text-blue-600 mt-1">Manage doctor profiles and availability</p>
        </div>
        <AddDoctorDialog />
      </div>

      <Card className="border-blue-100">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
          <CardTitle className="text-blue-900">All Doctors</CardTitle>
          <CardDescription className="text-blue-600">Total doctors: {doctors.length}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400" />
              <Input
                placeholder="Search by name, specialization, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-blue-200 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Doctors List */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-4">Loading doctors...</p>
            </div>
          ) : filteredDoctors.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 hover:border-blue-300 hover:shadow-md transition-all">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-lg text-blue-900">Dr. {doctor.full_name}</CardTitle>
                        <CardDescription className="text-blue-600 font-medium">{doctor.specialization}</CardDescription>
                      </div>
                      <Badge className={`${doctor.available ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"} font-semibold`}>
                        {doctor.available ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-3">
                      <div className="bg-white border border-blue-100 rounded-lg p-3 flex items-center gap-3">
                        <Mail className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-gray-700">{doctor.email}</span>
                      </div>
                      <div className="bg-white border border-blue-100 rounded-lg p-3 flex items-center gap-3">
                        <Phone className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-gray-700">{doctor.phone}</span>
                      </div>
                      <div className="bg-white border border-blue-100 rounded-lg p-3 flex items-center gap-3">
                        <Award className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-gray-700">License: {doctor.license_number}</span>
                      </div>
                    </div>

                    {(doctor.years_of_experience || doctor.consultation_fee) && (
                      <div className="bg-white border border-blue-100 rounded-lg p-4 space-y-2">
                        {doctor.years_of_experience && (
                          <div className="text-sm">
                            <span className="font-semibold text-gray-900">Experience:</span>
                            <span className="text-gray-700 ml-2">{doctor.years_of_experience} years</span>
                          </div>
                        )}
                        {doctor.consultation_fee && (
                          <div className="text-sm">
                            <span className="font-semibold text-gray-900">Consultation Fee:</span>
                            <span className="text-blue-600 ml-2 font-bold">₱{doctor.consultation_fee.toFixed(2)}</span>
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
            <div className="text-center py-12">
              <Award className="h-12 w-12 text-blue-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No doctors found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
