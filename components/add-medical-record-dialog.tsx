"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Doctor, Profile } from "@/lib/types"
import { Plus, Upload, X, ImageIcon } from "lucide-react"
import { toast } from "@/hooks/use-toast"

// Tooth numbers for adult dentition (Universal Numbering System)
const upperTeeth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
const lowerTeeth = [32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17]

interface ToothDiagramProps {
  selectedTeeth: number[]
  onToothClick: (toothNumber: number) => void
}

function ToothDiagram({ selectedTeeth, onToothClick }: ToothDiagramProps) {
  const getToothColor = (toothNumber: number) => {
    if (selectedTeeth.includes(toothNumber)) {
      return "bg-red-500 text-white border-red-600"
    }
    return "bg-white hover:bg-gray-100 border-gray-300"
  }

  return (
    <div className="space-y-4">
      <div className="text-center text-sm text-muted-foreground mb-2">
        Click on teeth to mark as extracted/treated
      </div>
      
      {/* Upper Teeth */}
      <div className="space-y-1">
        <div className="text-xs text-center text-muted-foreground">Upper Teeth</div>
        <div className="flex justify-center gap-1">
          {upperTeeth.map((tooth) => (
            <button
              key={tooth}
              type="button"
              onClick={() => onToothClick(tooth)}
              className={`w-7 h-8 text-xs font-medium border rounded-t-lg transition-colors ${getToothColor(tooth)}`}
              title={`Tooth ${tooth}`}
            >
              {tooth}
            </button>
          ))}
        </div>
      </div>

      {/* Divider representing gum line */}
      <div className="flex justify-center">
        <div className="w-full max-w-md h-1 bg-pink-200 rounded"></div>
      </div>

      {/* Lower Teeth */}
      <div className="space-y-1">
        <div className="flex justify-center gap-1">
          {lowerTeeth.map((tooth) => (
            <button
              key={tooth}
              type="button"
              onClick={() => onToothClick(tooth)}
              className={`w-7 h-8 text-xs font-medium border rounded-b-lg transition-colors ${getToothColor(tooth)}`}
              title={`Tooth ${tooth}`}
            >
              {tooth}
            </button>
          ))}
        </div>
        <div className="text-xs text-center text-muted-foreground">Lower Teeth</div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs mt-2">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
          <span>Normal</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-red-500 border border-red-600 rounded"></div>
          <span>Extracted/Treated</span>
        </div>
      </div>
    </div>
  )
}

export function AddMedicalRecordDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [patients, setPatients] = useState<Profile[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [selectedTeeth, setSelectedTeeth] = useState<number[]>([])
  const [xrayFile, setXrayFile] = useState<File | null>(null)
  const [xrayPreview, setXrayPreview] = useState<string | null>(null)
  const [isUploadingXray, setIsUploadingXray] = useState(false)
  const [formData, setFormData] = useState({
    patient_id: "",
    doctor_id: "",
    diagnosis: "",
    prescription: "",
    notes: "",
    visit_date: "",
  })
  const router = useRouter()

  useEffect(() => {
    if (open) {
      fetchPatientsAndDoctors()
    }
  }, [open])

  const fetchPatientsAndDoctors = async () => {
    const supabase = createClient()

    const [{ data: patientsData }, { data: doctorsData }] = await Promise.all([
      supabase.from("profiles").select("*").eq("role", "patient").order("full_name"),
      supabase.from("doctors").select("*").order("full_name"),
    ])

    if (patientsData) setPatients(patientsData)
    if (doctorsData) setDoctors(doctorsData)
  }

  const handleToothClick = (toothNumber: number) => {
    setSelectedTeeth((prev) =>
      prev.includes(toothNumber)
        ? prev.filter((t) => t !== toothNumber)
        : [...prev, toothNumber]
    )
  }

  const handleXrayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please upload an image file for the X-ray.",
          variant: "destructive",
        })
        return
      }
      setXrayFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setXrayPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeXray = () => {
    setXrayFile(null)
    setXrayPreview(null)
  }

  const uploadXray = async (): Promise<string | null> => {
    if (!xrayFile) return null

    setIsUploadingXray(true)
    try {
      const formData = new FormData()
      formData.append('file', xrayFile)

      const response = await fetch('/api/medical-records/upload-xray', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload X-ray')
      }

      const data = await response.json()
      return data.url
    } catch (error) {
      console.error('X-ray upload error:', error)
      throw error
    } finally {
      setIsUploadingXray(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    try {
      // Upload X-ray if present
      let xrayUrl: string | null = null
      if (xrayFile) {
        xrayUrl = await uploadXray()
      }

      // Build diagnosis with tooth info
      let fullDiagnosis = formData.diagnosis
      if (selectedTeeth.length > 0) {
        const teethInfo = `\n\nAffected Teeth: ${selectedTeeth.sort((a, b) => a - b).join(', ')}`
        fullDiagnosis += teethInfo
      }

      const { error } = await supabase.from("medical_records").insert({
        patient_id: formData.patient_id,
        doctor_id: formData.doctor_id,
        diagnosis: fullDiagnosis,
        prescription: formData.prescription || null,
        lab_results: xrayUrl || null, // Store X-ray URL in lab_results field
        notes: formData.notes || null,
        visit_date: formData.visit_date,
      })

      if (error) throw error

      toast({
        title: "Medical Record Added",
        description: "The medical record has been successfully created.",
      })

      setOpen(false)
      setFormData({
        patient_id: "",
        doctor_id: "",
        diagnosis: "",
        prescription: "",
        notes: "",
        visit_date: "",
      })
      setSelectedTeeth([])
      setXrayFile(null)
      setXrayPreview(null)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add medical record. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Medical Record
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Medical Record</DialogTitle>
          <DialogDescription>Create a new medical record for a patient</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patient_id">Patient *</Label>
                <Select
                  value={formData.patient_id}
                  onValueChange={(value) => setFormData({ ...formData, patient_id: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctor_id">Doctor *</Label>
                <Select
                  value={formData.doctor_id}
                  onValueChange={(value) => setFormData({ ...formData, doctor_id: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="visit_date">Visit Date *</Label>
              <Input
                id="visit_date"
                type="date"
                value={formData.visit_date}
                onChange={(e) => setFormData({ ...formData, visit_date: e.target.value })}
                required
              />
            </div>

            {/* Tooth Diagram */}
            <div className="space-y-2">
              <Label>Tooth Diagram</Label>
              <div className="border rounded-lg p-4 bg-gray-50">
                <ToothDiagram
                  selectedTeeth={selectedTeeth}
                  onToothClick={handleToothClick}
                />
              </div>
              {selectedTeeth.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Selected teeth: {selectedTeeth.sort((a, b) => a - b).join(', ')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnosis *</Label>
              <Textarea
                id="diagnosis"
                placeholder="Enter diagnosis..."
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prescription">Prescription</Label>
              <Textarea
                id="prescription"
                placeholder="Enter prescription details..."
                value={formData.prescription}
                onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
                rows={3}
              />
            </div>

            {/* X-ray Upload */}
            <div className="space-y-2">
              <Label>X-ray Upload</Label>
              {!xrayPreview ? (
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleXrayChange}
                    className="hidden"
                    id="xray-upload"
                  />
                  <label htmlFor="xray-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 rounded-full bg-gray-100">
                        <ImageIcon className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="text-sm font-medium">Click to upload X-ray image</div>
                      <div className="text-xs text-muted-foreground">PNG, JPG up to 10MB</div>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="relative border rounded-lg p-2">
                  <button
                    type="button"
                    onClick={removeXray}
                    className="absolute top-3 right-3 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 z-10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <img
                    src={xrayPreview}
                    alt="X-ray preview"
                    className="w-full max-h-48 object-contain rounded"
                  />
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    {xrayFile?.name}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Enter any additional notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isUploadingXray}>
              {isLoading || isUploadingXray ? "Adding..." : "Add Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
