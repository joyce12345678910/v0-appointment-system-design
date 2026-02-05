"use client"

import { Calendar } from "@/components/ui/calendar"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AppointmentActions } from "@/components/appointment-actions"
import { AppointmentDetailsDialog } from "@/components/appointment-details-dialog"
import type { Appointment } from "@/lib/types"
import { Eye, Search, FileText } from "lucide-react"

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAppointments()
  }, [])

  useEffect(() => {
    filterAppointments()
  }, [appointments, searchQuery, activeTab])

  const fetchAppointments = async () => {
    const supabase = createClient()
    setIsLoading(true)

    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(
          `
          *,
          patient:profiles!appointments_patient_id_fkey(id, full_name, email, phone),
          doctor:doctors(id, full_name, specialization, email, phone)
        `,
        )
        .order("appointment_date", { ascending: true })

      if (error) throw error
      setAppointments(data || [])
    } catch (error) {
      console.error("Error fetching appointments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAppointments = () => {
    let filtered = appointments

    if (activeTab !== "all") {
      filtered = filtered.filter((apt) => apt.status === activeTab)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (apt) =>
          apt.patient?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          apt.doctor?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          apt.reason.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredAppointments(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "approved":
        return "bg-green-50 text-green-700 border-green-200"
      case "completed":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsDetailsOpen(true)
  }

  const pendingCount = appointments.filter((apt) => apt.status === "pending").length
  const approvedCount = appointments.filter((apt) => apt.status === "approved").length
  const completedCount = appointments.filter((apt) => apt.status === "completed").length
  const cancelledCount = appointments.filter((apt) => apt.status === "cancelled").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl border border-blue-100">
        <h1 className="text-3xl font-bold text-blue-900">Appointments</h1>
        <p className="text-blue-600 mt-1">Manage all patient appointments and requests</p>
      </div>

      <Card className="border-blue-100">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 p-4 md:p-6">
          <CardTitle className="text-xl md:text-2xl text-blue-900">All Appointments</CardTitle>
          <CardDescription className="text-blue-600">View and manage appointment requests</CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400" />
              <Input
                placeholder="Search by patient name, doctor, or reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm border-blue-200 focus:border-blue-500"
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 h-auto bg-blue-50 border border-blue-200 p-1">
              <TabsTrigger 
                value="all" 
                className="text-xs sm:text-sm py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                All ({appointments.length})
              </TabsTrigger>
              <TabsTrigger 
                value="pending" 
                className="text-xs sm:text-sm py-2 data-[state=active]:bg-yellow-600 data-[state=active]:text-white"
              >
                Pending ({pendingCount})
              </TabsTrigger>
              <TabsTrigger 
                value="approved" 
                className="text-xs sm:text-sm py-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                Approved ({approvedCount})
              </TabsTrigger>
              <TabsTrigger 
                value="completed" 
                className="text-xs sm:text-sm py-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                Completed ({completedCount})
              </TabsTrigger>
              <TabsTrigger 
                value="cancelled" 
                className="text-xs sm:text-sm py-2 data-[state=active]:bg-red-600 data-[state=active]:text-white"
              >
                Cancelled ({cancelledCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="text-gray-600 mt-4">Loading appointments...</p>
                </div>
              ) : filteredAppointments.length > 0 ? (
                <div className="space-y-3 md:space-y-4">
                  {filteredAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col gap-3 bg-gradient-to-r from-blue-50 to-white border-2 border-blue-100 rounded-lg p-4 md:p-5 hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1 min-w-0 space-y-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <Badge className={`${getStatusColor(appointment.status)} border capitalize font-semibold`}>
                              {appointment.status}
                            </Badge>
                            {appointment.document_url && (
                              <Badge className="bg-green-100 text-green-800 border border-green-200 font-semibold flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                Document
                              </Badge>
                            )}
                            <span className="text-xs md:text-sm text-gray-600 whitespace-nowrap bg-gray-100 px-3 py-1 rounded-full">
                              {new Date(appointment.appointment_date).toLocaleDateString()} at{" "}
                              {appointment.appointment_time}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <p className="font-bold text-sm md:text-base text-blue-900 break-words">
                              {appointment.patient?.full_name}
                            </p>
                            <p className="text-xs md:text-sm text-blue-600 font-medium">
                              Dr. {appointment.doctor?.full_name} • {appointment.doctor?.specialization}
                            </p>
                          </div>
                          <div className="bg-white border border-blue-100 rounded-lg p-3 mt-2">
                            <p className="text-xs md:text-sm text-gray-700">
                              <span className="font-semibold text-gray-900">Reason:</span> {appointment.reason}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap md:flex-nowrap justify-end">
                          <Button
                            size="sm"
                            onClick={() => handleViewDetails(appointment)}
                            className="text-xs md:text-sm bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <div className="flex gap-1">
                            <AppointmentActions
                              appointmentId={appointment.id}
                              currentStatus={appointment.status}
                              appointmentDate={appointment.appointment_date}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-blue-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">No appointments found</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AppointmentDetailsDialog
        appointment={selectedAppointment}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </div>
  )
}
