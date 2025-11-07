import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Clock, Plus } from "lucide-react"

export default async function PatientDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch patient profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id).single()

  // Fetch appointments
  const { data: appointments } = await supabase
    .from("appointments")
    .select(
      `
      *,
      doctor:doctors(full_name, specialization, phone, email)
    `,
    )
    .eq("patient_id", user?.id)
    .order("appointment_date", { ascending: true })

  // Separate upcoming and past appointments
  const today = new Date().toISOString().split("T")[0]
  const upcomingAppointments = appointments?.filter((apt) => apt.appointment_date >= today) || []
  const pastAppointments = appointments?.filter((apt) => apt.appointment_date < today) || []

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

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {profile?.full_name}!</h1>
          <p className="text-muted-foreground">Manage your appointments and medical records</p>
        </div>
        <Button asChild>
          <Link href="/patient/book">
            <Plus className="h-4 w-4 mr-2" />
            Book Appointment
          </Link>
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointments?.filter((apt) => apt.status === "pending").length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>Your scheduled appointments</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-start justify-between border-b pb-4 last:border-0">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                      <span className="text-sm font-medium capitalize">
                        {appointment.appointment_type.replace("_", " ")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">Dr. {appointment.doctor?.full_name}</p>
                      <p className="text-sm text-muted-foreground">{appointment.doctor?.specialization}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(appointment.appointment_date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {appointment.appointment_time}
                      </span>
                    </div>
                    <p className="text-sm">
                      <span className="font-medium">Reason:</span> {appointment.reason}
                    </p>
                    {appointment.notes && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Notes:</span> {appointment.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No upcoming appointments</p>
              <Button asChild>
                <Link href="/patient/book">Book Your First Appointment</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Past Appointments</CardTitle>
            <CardDescription>Your appointment history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pastAppointments.slice(0, 5).map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="space-y-1">
                    <p className="font-medium">Dr. {appointment.doctor?.full_name}</p>
                    <p className="text-sm text-muted-foreground">{appointment.doctor?.specialization}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(appointment.appointment_date).toLocaleDateString()} at {appointment.appointment_time}
                    </p>
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
