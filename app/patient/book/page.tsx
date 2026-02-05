"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
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
import { Upload, CheckCircle, AlertCircle, X } from "lucide-react"

export default function BookAppointmentPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [appointmentDate, setAppointmentDate] = useState("")
  const [appointmentTime, setAppointmentTime] = useState("")
  const [appointmentType, setAppointmentType] = useState("")
  const [reason, setReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [uploadedDocument, setUploadedDocument] = useState<{ url: string; name: string } | null>(null)
  const [isUploadingDocument, setIsUploadingDocument] = useState(false)
  const [documentError, setDocumentError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
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
    setLoadingSlots(true)

    try {
      const slots = []
      for (let hour = 8; hour < 17; hour++) {
        const timeString = `${hour.toString().padStart(2, "0")}:00`
        slots.push(timeString)
      }

      // Check availability for each time slot
      const availabilityChecks = await Promise.all(
        slots.map(async (slot) => {
          const response = await fetch("/api/appointments/check-availability", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              doctorId: selectedDoctor,
              appointmentDate,
              appointmentTime: slot,
            }),
          })

          const data = await response.json()
          return data.available ? slot : null
        })
      )

      const available = availabilityChecks.filter((slot): slot is string => slot !== null)
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

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setDocumentError(null)
    setIsUploadingDocument(true)

    try {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"]
      if (!allowedTypes.includes(file.type)) {
        setDocumentError("Only JPEG, PNG, WebP, and PDF files are allowed")
        setIsUploadingDocument(false)
        return
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setDocumentError("File size must be less than 5MB")
        setIsUploadingDocument(false)
        return
      }

      // Upload to server
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/appointments/upload-document", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload document")
      }

      setUploadedDocument({
        url: data.url,
        name: file.name,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to upload document"
      setDocumentError(message)
      toast({
        title: "Upload Error",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsUploadingDocument(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate document upload
    if (!uploadedDocument) {
      toast({
        title: "Missing Document",
        description: "Please upload a valid ID, referral slip, or required document before submitting your appointment request.",
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

      // Get user profile for email
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      // Get doctor info
      const { data: doctor } = await supabase.from("doctors").select("*").eq("id", selectedDoctor).single()

      // Insert appointment with document
      const { error, data: appointmentData } = await supabase.from("appointments").insert({
        patient_id: user.id,
        doctor_id: selectedDoctor,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        appointment_type: appointmentType,
        reason: reason,
        status: "pending",
        document_url: uploadedDocument.url,
        document_file_name: uploadedDocument.name,
        document_uploaded_at: new Date().toISOString(),
      }).select().single()

      if (error) throw error

      // Send confirmation email
      if (profile?.email && doctor) {
        await fetch("/api/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            templateName: "appointment_confirmation",
            recipientEmail: profile.email,
            recipientName: profile.full_name,
            variables: {
              full_name: profile.full_name,
              doctor_name: doctor.full_name,
              appointment_date: new Date(appointmentDate).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              }),
              appointment_time: appointmentTime,
              appointment_type: appointmentType.replace("_", " "),
            },
          }),
        }).catch((err) => console.error("Email send failed:", err))
      }

      toast({
        title: "Appointment Requested",
        description: "Your appointment request has been submitted with your document. Check your email for confirmation. Please wait for admin approval.",
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

  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl border border-blue-100">
        <h1 className="text-3xl font-bold text-blue-900">Book Appointment</h1>
        <p className="text-blue-600 mt-1">Schedule a new appointment with our doctors</p>
      </div>

      <Card className="border-blue-100">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
          <CardTitle className="text-blue-900">Appointment Details</CardTitle>
          <CardDescription className="text-blue-600">Fill in the information below to request an appointment</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Doctor Selection */}
            <div className="space-y-2">
              <Label htmlFor="doctor" className="text-blue-900 font-semibold">Select Doctor</Label>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor} required>
                <SelectTrigger className="border-blue-200 focus:border-blue-500">
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
              <Label htmlFor="type" className="text-blue-900 font-semibold">Appointment Type</Label>
              <Select value={appointmentType} onValueChange={setAppointmentType} required>
                <SelectTrigger className="border-blue-200 focus:border-blue-500">
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
                <Label htmlFor="date" className="text-blue-900 font-semibold">Preferred Date</Label>
                <Input
                  id="date"
                  type="date"
                  min={today}
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="border-blue-200 focus:border-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="text-blue-900 font-semibold">Preferred Time</Label>
                {availableTimeSlots.length > 0 ? (
                  <Select
                    value={appointmentTime}
                    onValueChange={setAppointmentTime}
                    disabled={!selectedDoctor || !appointmentDate || loadingSlots}
                    required
                  >
                    <SelectTrigger className="border-blue-200 focus:border-blue-500">
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
                  <div className="w-full px-3 py-2 border-2 border-blue-100 bg-blue-50 rounded-md text-sm text-blue-600 font-medium">
                    {loadingSlots ? "Loading available slots..." : "No available slots for this date"}
                  </div>
                )}
              </div>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-blue-900 font-semibold">Reason for Visit</Label>
              <Textarea
                id="reason"
                placeholder="Please describe your symptoms or reason for the appointment..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                className="border-blue-200 focus:border-blue-500"
                required
              />
            </div>

            {/* Document Upload */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-blue-900 font-semibold">
                  Upload Document <span className="text-red-600">*</span>
                </Label>
                <span className="text-xs text-gray-600">Required</span>
              </div>
              <p className="text-xs text-gray-600">
                Please upload a clear photo of your ID, referral slip, or required medical document for verification
              </p>

              {uploadedDocument ? (
                <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-green-900">Document Uploaded</p>
                      <p className="text-sm text-green-700 break-words">{uploadedDocument.name}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedDocument(null)
                        if (fileInputRef.current) fileInputRef.current.value = ""
                      }}
                      className="text-green-600 hover:text-green-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-blue-200 bg-blue-50 rounded-lg p-6 text-center space-y-3 hover:border-blue-400 transition-colors">
                  <Upload className="h-8 w-8 text-blue-600 mx-auto" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Click to upload or drag and drop</p>
                    <p className="text-xs text-blue-600">PNG, JPG, WebP, or PDF (Max 5MB)</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    onChange={handleDocumentUpload}
                    disabled={isUploadingDocument}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingDocument}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isUploadingDocument ? (
                      <>
                        <span className="inline-block animate-spin mr-2">⏳</span>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Select File
                      </>
                    )}
                  </Button>
                </div>
              )}

              {documentError && (
                <div className="border-2 border-red-200 bg-red-50 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{documentError}</p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-2">
              <Button type="submit" disabled={isLoading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                {isLoading ? "Submitting..." : "Request Appointment"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading} className="border-blue-200 text-blue-700 hover:bg-blue-50">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="border-blue-100 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader className="border-b border-blue-100">
          <CardTitle className="text-blue-900">Important Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <span className="text-blue-600 font-bold mt-1">•</span>
            <p className="text-gray-700">Your appointment request will be reviewed by our admin team</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-blue-600 font-bold mt-1">•</span>
            <p className="text-gray-700">You will receive email confirmation once your appointment is approved</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-blue-600 font-bold mt-1">•</span>
            <p className="text-gray-700">Please arrive 15 minutes before your scheduled time</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-blue-600 font-bold mt-1">•</span>
            <p className="text-gray-700">Bring any relevant medical documents or test results</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
