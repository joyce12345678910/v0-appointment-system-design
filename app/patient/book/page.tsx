"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Doctor } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

export default function BookAppointmentPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [appointmentDate, setAppointmentDate] = useState("")
  const [appointmentTime, setAppointmentTime] = useState("")
  const [appointmentType, setAppointmentType] = useState("")
  const [reason, setReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    const supabase = createClient()
    const { data } = await supabase.from("doctors").select("*").eq("available", true).order("full_name")

    if (data) {
      setDoctors(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("appointments").insert({
        patient_id: user.id,
        doctor_id: selectedDoctor,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        appointment_type: appointmentType,
        reason: reason,
        status: "pending",
      })

      if (error) throw error

      toast({
        title: "Appointment Requested",
        description: "Your appointment request has been submitted. Please wait for admin approval.",
      })

      router.push("/patient")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Book Appointment</h1>
        <p className="text-muted-foreground">Schedule a new appointment with our doctors</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
          <CardDescription>Fill in the information below to request an appointment</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Doctor Selection */}
            <div className="space-y-2">
              <Label htmlFor="doctor">Select Doctor</Label>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor} required>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      Dr. {doctor.full_name} - {doctor.specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Appointment Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Appointment Type</Label>
              <Select value={appointmentType} onValueChange={setAppointmentType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select appointment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="follow_up">Follow-up</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="routine_checkup">Routine Checkup</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Preferred Date</Label>
                <Input
                  id="date"
                  type="date"
                  min={today}
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Preferred Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Visit</Label>
              <Textarea
                id="reason"
                placeholder="Please describe your symptoms or reason for the appointment..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Submitting..." : "Request Appointment"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Important Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Your appointment request will be reviewed by our admin team</p>
          <p>• You will be notified once your appointment is approved</p>
          <p>• Please arrive 15 minutes before your scheduled time</p>
          <p>• Bring any relevant medical documents or test results</p>
        </CardContent>
      </Card>
    </div>
  )
}
