import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, Stethoscope, FileText, Clock, CheckCircle, TrendingUp } from "lucide-react"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch statistics
  const [
    { count: totalPatients },
    { count: totalDoctors },
    { count: totalAppointments },
    { count: pendingAppointments },
    { count: approvedAppointments },
    { count: totalRecords },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "patient"),
    supabase.from("doctors").select("*", { count: "exact", head: true }),
    supabase.from("appointments").select("*", { count: "exact", head: true }),
    supabase.from("appointments").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("appointments").select("*", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("medical_records").select("*", { count: "exact", head: true }),
  ])

  // Fetch recent appointments with full details
  const { data: recentAppointments } = await supabase
    .from("appointments")
    .select(
      `
      *,
      patient:profiles!appointments_patient_id_fkey(full_name, phone, email),
      doctor:doctors(full_name, specialization, phone, email)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(8)

  const stats = [
    {
      title: "Total Patients",
      value: totalPatients || 0,
      icon: Users,
      description: "Registered patients",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
    },
    {
      title: "Total Doctors",
      value: totalDoctors || 0,
      icon: Stethoscope,
      description: "Active doctors",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-100",
    },
    {
      title: "Total Appointments",
      value: totalAppointments || 0,
      icon: Calendar,
      description: "All time appointments",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-100",
    },
    {
      title: "Pending Approvals",
      value: pendingAppointments || 0,
      icon: Clock,
      description: "Awaiting approval",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-100",
    },
    {
      title: "Approved Today",
      value: approvedAppointments || 0,
      icon: CheckCircle,
      description: "Confirmed appointments",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-100",
    },
    {
      title: "Medical Records",
      value: totalRecords || 0,
      icon: FileText,
      description: "Total records",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-100",
    },
  ]

  const getStatusStyle = (status: string) => {
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
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl border border-blue-100">
        <h1 className="text-3xl font-bold text-blue-900">Admin Dashboard</h1>
        <p className="text-blue-600 mt-1">Welcome to Tactay Billedo Admin Panel - System Overview</p>
      </div>

      {/* Statistics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className={`${stat.bgColor} border-2 ${stat.borderColor} hover:shadow-md transition`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">{stat.title}</CardTitle>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              <p className={`text-xs ${stat.color} opacity-75 mt-1`}>{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Appointments */}
      <Card className="border-blue-100">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Recent Appointments
              </CardTitle>
              <CardDescription className="text-blue-600">Latest appointment requests and their status</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {recentAppointments && recentAppointments.length > 0 ? (
            <div className="space-y-4">
              {recentAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-white border-2 border-blue-100 rounded-xl p-5 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                >
                  {/* Status Badge - Top Right */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-lg text-gray-900">
                          {new Date(appointment.appointment_date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 ml-7 mt-1">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {appointment.appointment_time}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(appointment.status)} capitalize`}
                    >
                      {appointment.status}
                    </span>
                  </div>

                  {/* Patient & Doctor Info */}
                  <div className="grid md:grid-cols-2 gap-6 mb-4">
                    {/* Patient */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Patient</p>
                          <p className="font-semibold text-gray-900">{appointment.patient?.full_name || "N/A"}</p>
                        </div>
                      </div>
                      {appointment.patient?.phone && (
                        <p className="text-xs text-gray-600 ml-11">{appointment.patient.phone}</p>
                      )}
                    </div>

                    {/* Doctor */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-cyan-50 rounded-lg">
                          <Stethoscope className="h-4 w-4 text-cyan-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Doctor</p>
                          <p className="font-semibold text-gray-900">Dr. {appointment.doctor?.full_name || "N/A"}</p>
                        </div>
                      </div>
                      {appointment.doctor?.specialization && (
                        <p className="text-xs text-gray-600 ml-11">{appointment.doctor.specialization}</p>
                      )}
                    </div>
                  </div>

                  {/* Additional Info */}
                  {(appointment.reason || appointment.notes) && (
                    <div className="pt-4 border-t border-gray-100 space-y-2">
                      {appointment.reason && (
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-1">Reason for Visit</p>
                          <p className="text-sm text-gray-600">{appointment.reason}</p>
                        </div>
                      )}
                      {appointment.notes && (
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-1">Admin Notes</p>
                          <p className="text-sm text-gray-600">{appointment.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                <Calendar className="h-8 w-8 text-blue-300" />
              </div>
              <p className="text-gray-600 font-medium text-lg">No appointments yet</p>
              <p className="text-gray-400 text-sm mt-1">New appointments will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
