"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Appointment } from "@/lib/types"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { AppointmentDetailsDialog } from "@/components/appointment-details-dialog"

interface CalendarViewProps {
  appointments: Appointment[]
}

export function CalendarView({ appointments }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Get calendar data
  const { year, month, daysInMonth, firstDayOfMonth, monthName } = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })

    return { year, month, daysInMonth, firstDayOfMonth, monthName }
  }, [currentDate])

  // Group appointments by date
  const appointmentsByDate = useMemo(() => {
    const grouped: Record<string, Appointment[]> = {}

    appointments.forEach((appointment) => {
      const date = appointment.appointment_date
      if (!grouped[date]) {
        grouped[date] = []
      }
      grouped[date].push(appointment)
    })

    return grouped
  }, [appointments])

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Get appointments for a specific day
  const getAppointmentsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return appointmentsByDate[dateStr] || []
  }

  // Check if a date is today
  const isToday = (day: number) => {
    const today = new Date()
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year
  }

  // Generate calendar days
  const calendarDays = []
  const totalCells = Math.ceil((daysInMonth + firstDayOfMonth) / 7) * 7

  for (let i = 0; i < totalCells; i++) {
    const day = i - firstDayOfMonth + 1
    const isValidDay = day > 0 && day <= daysInMonth

    calendarDays.push({
      day: isValidDay ? day : null,
      appointments: isValidDay ? getAppointmentsForDay(day) : [],
      isToday: isValidDay ? isToday(day) : false,
    })
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

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsDetailsOpen(true)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{monthName}</CardTitle>
              <CardDescription>View all appointments in calendar format</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day headers */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-medium text-sm text-muted-foreground py-2">
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {calendarDays.map((cell, index) => (
              <div
                key={index}
                className={`min-h-[120px] border rounded-lg p-2 ${
                  cell.day === null
                    ? "bg-muted/30"
                    : cell.isToday
                      ? "bg-blue-50 border-blue-300"
                      : "bg-card hover:bg-accent/50"
                } transition-colors`}
              >
                {cell.day !== null && (
                  <>
                    <div
                      className={`text-sm font-medium mb-2 ${cell.isToday ? "text-blue-600 font-bold" : "text-foreground"}`}
                    >
                      {cell.day}
                    </div>
                    <div className="space-y-1">
                      {cell.appointments.slice(0, 3).map((appointment) => (
                        <button
                          key={appointment.id}
                          onClick={() => handleAppointmentClick(appointment)}
                          className="w-full text-left"
                        >
                          <div className="text-xs p-1 rounded bg-background border hover:border-primary transition-colors">
                            <div className="flex items-center gap-1 mb-1">
                              <Badge className={`${getStatusColor(appointment.status)} text-[10px] px-1 py-0`}>
                                {appointment.status}
                              </Badge>
                              <span className="font-medium truncate">{appointment.appointment_time}</span>
                            </div>
                            <div className="truncate text-muted-foreground">{appointment.patient?.full_name}</div>
                          </div>
                        </button>
                      ))}
                      {cell.appointments.length > 3 && (
                        <div className="text-xs text-muted-foreground text-center py-1">
                          +{cell.appointments.length - 3} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
              <Badge className="bg-green-100 text-green-800">Approved</Badge>
              <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
              <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointment Details Dialog */}
      <AppointmentDetailsDialog
        appointment={selectedAppointment}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </>
  )
}
