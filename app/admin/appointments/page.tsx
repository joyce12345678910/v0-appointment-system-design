"use client"

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
import { Eye, Search } from "lucide-react"

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
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
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
    <div className="space-y-6 p-4 md:p-0">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Appointments</h1>
        <p className="text-muted-foreground text-sm md:text-base">Manage all patient appointments</p>
      </div>

      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-xl md:text-2xl">All Appointments</CardTitle>
          <CardDescription>View and manage appointment requests</CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by patient name, doctor, or reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1 h-auto">
              <TabsTrigger value="all" className="text-xs sm:text-sm py-2">
                All ({appointments.length})
              </TabsTrigger>
              <TabsTrigger value="pending" className="text-xs sm:text-sm py-2">
                Pending ({pendingCount})
              </TabsTrigger>
              <TabsTrigger value="approved" className="text-xs sm:text-sm py-2">
                Approved ({approvedCount})
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-xs sm:text-sm py-2">
                Completed ({completedCount})
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="text-xs sm:text-sm py-2">
                Cancelled ({cancelledCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {isLoading ? (
                <p className="text-center text-muted-foreground py-8 text-sm">Loading appointments...</p>
              ) : filteredAppointments.length > 0 ? (
                <div className="space-y-3 md:space-y-4">
                  {filteredAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col gap-3 border rounded-lg p-3 md:p-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={getStatusColor(appointment.status)} variant="outline">
                              {appointment.status}
                            </Badge>
                            <span className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">
                              {new Date(appointment.appointment_date).toLocaleDateString()} at{" "}
                              {appointment.appointment_time}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-sm md:text-base break-words">
                              {appointment.patient?.full_name}
                            </p>
                            <p className="text-xs md:text-sm text-muted-foreground">
                              Dr. {appointment.doctor?.full_name} - {appointment.doctor?.specialization}
                            </p>
                          </div>
                          <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                            <span className="font-medium">Reason:</span> {appointment.reason}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap md:flex-nowrap">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(appointment)}
                            className="text-xs md:text-sm flex-1 md:flex-none"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <div className="flex gap-1 flex-1 md:flex-none">
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
                <p className="text-center text-muted-foreground py-8 text-sm">No appointments found</p>
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
