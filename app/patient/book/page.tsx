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
import { Upload, File, X } from "lucide-react"

export default function BookAppointmentPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [appointmentDate, setAppointmentDate] = useState("")
  const [appointmentTime, setAppointmentTime] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [uploadedDocument, setUploadedDocument] = useState<{
    url: string
    filename: string
    size: number
  } | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchDoctors()
  }, [])

  useEffect(() => {
    if (selectedDoctor && appointmentDate) {
      fetchAvailableTimeSlots()
    }
  }, [selectedDoctor, appointmentDate])

  const fetchDoctors = async () => {
    const supabase = createClient()
    const { data } = await supabase.from("doctors").select("*").eq("available", true).order("full_name")

    if (data) {
      setDoctors(data)
    }
  }

  const fetchAvailableTimeSlots = async () => {
    const supabase = createClient()
    setLoadingSlots(true)

    try {
      const { data: appointments, error } = await supabase
        .from("appointments")
        .select("appointment_time")
        .eq("doctor_id", selectedDoctor)
        .eq("appointment_date", appointmentDate)
        .in("status", ["pending", "approved"])

      if (error) throw error

      const slots = []
      for (let hour = 8; hour < 17; hour++) {
        const timeString = `${hour.toString().padStart(2, "0")}:00`
        slots.push(timeString)
      }

      const bookedTimes = appointments?.map((apt) => apt.appointment_time) || []

      const available = slots.filter((slot) => !bookedTimes.includes(slot))

      setAvailableTimeSlots(available)
    } catch (error) {
      console.error("Error fetching available slots:", error)
      toast({
        title: "Error",
        description: "Failed to load available time slots",
        variant: "destructive",
      })
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/appointments/upload-document", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Upload failed")
      }

      const data = await response.json()
      setUploadedDocument({
        url: data.url,
        filename: data.filename,
        size: data.size,
      })

      toast({
        title: "Document Uploaded",
        description: "Your document has been successfully uploaded",
      })
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload document",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveDocument = () => {
    setUploadedDocument(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log("[v0] Form submitted with:", {
      selectedDoctor,
      appointmentDate,
      appointmentTime,
    })

    if (!selectedDoctor || !appointmentDate || !appointmentTime) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      console.log("[v0] Creating appointment with data:", {
        doctor: selectedDoctor,
        date: appointmentDate,
        time: appointmentTime,
      })

      const appointmentData: any = {
        patient_id: user.id,
        doctor_id: selectedDoctor,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        status: "pending",
      }

      if (uploadedDocument) {
        appointmentData.document_url = uploadedDocument.url
        appointmentData.document_filename = uploadedDocument.filename
        appointmentData.document_uploaded_at = new Date().toISOString()
      }

      const { error } = await supabase.from("appointments").insert(appointmentData)

      if (error) {
        console.error("[v0] Database error:", error)
        throw error
      }

      console.log("[v0] Appointment created successfully")

      toast({
        title: "Appointment Requested",
        description: "Your appointment request has been submitted. Please wait for admin approval.",
      })

      router.push("/patient")
    } catch (error) {
      console.error("[v0] Error booking appointment:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to book appointment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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
                {availableTimeSlots.length > 0 ? (
                  <Select
                    value={appointmentTime}
                    onValueChange={setAppointmentTime}
                    disabled={!selectedDoctor || !appointmentDate || loadingSlots}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={loadingSlots ? "Loading available slots..." : "Select available time"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm text-muted-foreground">
                    {loadingSlots ? "Loading available slots..." : "No available slots for this date"}
                  </div>
                )}
              </div>
            </div>

            {/* Document Upload */}
            <div className="space-y-2">
              <Label htmlFor="document">Supporting Document (Optional)</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Upload medical reports, referrals, or other relevant documents (PDF, JPEG, PNG, DOC - Max 10MB)
              </p>

              {!uploadedDocument ? (
                <div className="relative">
                  <input
                    type="file"
                    id="document"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                  <label
                    htmlFor="document"
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                      isUploading
                        ? "border-muted bg-muted/20 cursor-not-allowed"
                        : "border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary"
                    }`}
                  >
                    <Upload className={`h-8 w-8 mb-2 ${isUploading ? "text-muted-foreground" : "text-primary"}`} />
                    <span className="text-sm font-medium text-primary">
                      {isUploading ? "Uploading..." : "Click to upload document"}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">PDF, JPEG, PNG, DOC (Max 10MB)</span>
                  </label>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <File className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{uploadedDocument.filename}</p>
                      <p className="text-xs text-muted-foreground">
                        {(uploadedDocument.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveDocument}
                    className="hover:bg-red-50 hover:text-red-600 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
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
