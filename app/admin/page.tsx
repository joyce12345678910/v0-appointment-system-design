import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, Stethoscope, FileText, Clock, CheckCircle } from "lucide-react"

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

  // Fetch recent appointments
  const { data: recentAppointments } = await supabase
    .from("appointments")
    .select(
      `
      *,
      patient:profiles!appointments_patient_id_fkey(full_name),
      doctor:doctors(full_name, specialization)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(5)

  const stats = [
    {
      title: "Total Patients",
      value: totalPatients || 0,
      icon: Users,
      description: "Registered patients",
      color: "text-blue-600",
    },
    {
      title: "Total Doctors",
      value: totalDoctors || 0,
      icon: Stethoscope,
      description: "Active doctors",
      color: "text-cyan-600",
    },
    {
      title: "Total Appointments",
      value: totalAppointments || 0,
      icon: Calendar,
      description: "All time appointments",
      color: "text-teal-600",
    },
    {
      title: "Pending Approvals",
      value: pendingAppointments || 0,
      icon: Clock,
      description: "Awaiting approval",
      color: "text-orange-600",
    },
    {
      title: "Approved Today",
      value: approvedAppointments || 0,
      icon: CheckCircle,
      description: "Confirmed appointments",
      color: "text-green-600",
    },
    {
      title: "Medical Records",
      value: totalRecords || 0,
      icon: FileText,
      description: "Total records",
      color: "text-purple-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to Tactay Billedo Admin Panel</p>
      </div>

      {/* Statistics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Appointments</CardTitle>
          <CardDescription>Latest appointment requests from patients</CardDescription>
        </CardHeader>
        <CardContent>
          {recentAppointments && recentAppointments.length > 0 ? (
            <div className="space-y-4">
              {recentAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="space-y-1">
                    <p className="font-medium">{appointment.patient?.full_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Dr. {appointment.doctor?.full_name} - {appointment.doctor?.specialization}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(appointment.appointment_date).toLocaleDateString()} at {appointment.appointment_time}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        appointment.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : appointment.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : appointment.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No appointments yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
