import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Clock, Plus, Phone, Mail, Stethoscope } from "lucide-react"

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
        return "bg-yellow-50 text-yellow-700 border border-yellow-200"
      case "approved":
        return "bg-green-50 text-green-700 border border-green-200"
      case "completed":
        return "bg-blue-50 text-blue-700 border border-blue-200"
      case "cancelled":
        return "bg-red-50 text-red-700 border border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl border border-blue-100">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Welcome back, {profile?.full_name}!</h1>
          <p className="text-blue-600 mt-1">Manage your appointments and medical records</p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap">
          <Link href="/patient/book">
            <Plus className="h-4 w-4 mr-2" />
            Book Appointment
          </Link>
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Appointments</CardTitle>
            <Calendar className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{appointments?.length || 0}</div>
            <p className="text-xs text-blue-600 mt-1">All appointments</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Upcoming</CardTitle>
            <Clock className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{upcomingAppointments.length}</div>
            <p className="text-xs text-green-600 mt-1">Scheduled ahead</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Pending Approval</CardTitle>
            <Stethoscope className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900">
              {appointments?.filter((apt) => apt.status === "pending").length || 0}
            </div>
            <p className="text-xs text-orange-600 mt-1">Awaiting confirmation</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <Card className="border-blue-100">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
          <CardTitle className="text-blue-900">Upcoming Appointments</CardTitle>
          <CardDescription className="text-blue-600">Your scheduled appointments and details</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="bg-gradient-to-r from-blue-50 to-white border-2 border-blue-100 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition">
                  <div className="space-y-4">
                    {/* Header with Status and Type */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Badge className={`${getStatusColor(appointment.status)} capitalize`}>{appointment.status}</Badge>
                        {appointment.appointment_type && (
                          <span className="text-sm font-semibold text-blue-900 capitalize bg-blue-100 px-3 py-1 rounded-md">
                            {appointment.appointment_type.replace("_", " ")}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Doctor Information */}
                    <div className="bg-white border border-blue-100 rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-lg font-bold text-blue-900">Dr. {appointment.doctor?.full_name}</p>
                          <p className="text-sm text-blue-600 font-medium">{appointment.doctor?.specialization}</p>
                        </div>
                        <Stethoscope className="h-6 w-6 text-blue-400" />
                      </div>
                      
                      {/* Contact Info */}
                      <div className="flex flex-col gap-2 pt-2 border-t border-blue-50">
                        {appointment.doctor?.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-blue-500" />
                            <span className="text-gray-700">{appointment.doctor.phone}</span>
                          </div>
                        )}
                        {appointment.doctor?.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-blue-500" />
                            <span className="text-gray-700">{appointment.doctor.email}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white border border-blue-100 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-blue-600 font-semibold mb-1">
                          <Calendar className="h-4 w-4" />
                          Date
                        </div>
                        <p className="text-lg font-bold text-blue-900">
                          {new Date(appointment.appointment_date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                      <div className="bg-white border border-blue-100 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-blue-600 font-semibold mb-1">
                          <Clock className="h-4 w-4" />
                          Time
                        </div>
                        <p className="text-lg font-bold text-blue-900">{appointment.appointment_time}</p>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    {(appointment.reason || appointment.notes) && (
                      <div className="bg-white border border-blue-100 rounded-lg p-4 space-y-3">
                        {appointment.reason && (
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Reason for Visit</p>
                            <p className="text-sm text-gray-800 mt-1">{appointment.reason}</p>
                          </div>
                        )}
                        {appointment.notes && (
                          <div className={appointment.reason ? "pt-3 border-t border-blue-50" : ""}>
                            <p className="text-sm font-semibold text-gray-600">Additional Notes</p>
                            <p className="text-sm text-gray-800 mt-1">{appointment.notes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-blue-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4 font-medium">No upcoming appointments</p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/patient/book">Book Your First Appointment</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <Card className="border-blue-100">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
            <CardTitle className="text-blue-900">Past Appointments</CardTitle>
            <CardDescription className="text-blue-600">Your appointment history</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {pastAppointments.slice(0, 5).map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition">
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-900">Dr. {appointment.doctor?.full_name}</p>
                    <p className="text-sm text-gray-600">{appointment.doctor?.specialization}</p>
                    <p className="text-xs text-gray-500">
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
