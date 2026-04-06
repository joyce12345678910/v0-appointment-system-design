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
import { Plus, X, ImageIcon } from "lucide-react"
import { toast } from "@/hooks/use-toast"

// Tooth data with names for Universal Numbering System
const teethData = {
  upper: [
    { number: 1, name: "Third Molar", type: "molar" },
    { number: 2, name: "Second Molar", type: "molar" },
    { number: 3, name: "First Molar", type: "molar" },
    { number: 4, name: "Second Premolar", type: "premolar" },
    { number: 5, name: "First Premolar", type: "premolar" },
    { number: 6, name: "Canine", type: "canine" },
    { number: 7, name: "Lateral Incisor", type: "incisor" },
    { number: 8, name: "Central Incisor", type: "incisor" },
    { number: 9, name: "Central Incisor", type: "incisor" },
    { number: 10, name: "Lateral Incisor", type: "incisor" },
    { number: 11, name: "Canine", type: "canine" },
    { number: 12, name: "First Premolar", type: "premolar" },
    { number: 13, name: "Second Premolar", type: "premolar" },
    { number: 14, name: "First Molar", type: "molar" },
    { number: 15, name: "Second Molar", type: "molar" },
    { number: 16, name: "Third Molar", type: "molar" },
  ],
  lower: [
    { number: 32, name: "Third Molar", type: "molar" },
    { number: 31, name: "Second Molar", type: "molar" },
    { number: 30, name: "First Molar", type: "molar" },
    { number: 29, name: "Second Premolar", type: "premolar" },
    { number: 28, name: "First Premolar", type: "premolar" },
    { number: 27, name: "Canine", type: "canine" },
    { number: 26, name: "Lateral Incisor", type: "incisor" },
    { number: 25, name: "Central Incisor", type: "incisor" },
    { number: 24, name: "Central Incisor", type: "incisor" },
    { number: 23, name: "Lateral Incisor", type: "incisor" },
    { number: 22, name: "Canine", type: "canine" },
    { number: 21, name: "First Premolar", type: "premolar" },
    { number: 20, name: "Second Premolar", type: "premolar" },
    { number: 19, name: "First Molar", type: "molar" },
    { number: 18, name: "Second Molar", type: "molar" },
    { number: 17, name: "Third Molar", type: "molar" },
  ],
}

interface ToothProps {
  tooth: { number: number; name: string; type: string }
  isSelected: boolean
  onClick: () => void
  isUpper: boolean
}

function Tooth({ tooth, isSelected, onClick, isUpper }: ToothProps) {
  // Get tooth dimensions based on type
  const getToothDimensions = () => {
    switch (tooth.type) {
      case "molar":
        return { width: 28, height: 32 }
      case "premolar":
        return { width: 22, height: 28 }
      case "canine":
        return { width: 18, height: 30 }
      case "incisor":
        return { width: 16, height: 26 }
      default:
        return { width: 20, height: 28 }
    }
  }

  const { width, height } = getToothDimensions()

  // SVG paths for realistic tooth shapes
  const getToothPath = () => {
    if (tooth.type === "molar") {
      if (isUpper) {
        return "M4,28 Q2,24 2,18 Q2,8 6,4 Q10,0 14,0 Q18,0 22,4 Q26,8 26,18 Q26,24 24,28 Q20,32 14,32 Q8,32 4,28 Z"
      }
      return "M4,4 Q2,8 2,14 Q2,24 6,28 Q10,32 14,32 Q18,32 22,28 Q26,24 26,14 Q26,8 24,4 Q20,0 14,0 Q8,0 4,4 Z"
    }
    if (tooth.type === "premolar") {
      if (isUpper) {
        return "M4,24 Q2,20 2,14 Q2,6 5,3 Q8,0 11,0 Q14,0 17,3 Q20,6 20,14 Q20,20 18,24 Q15,28 11,28 Q7,28 4,24 Z"
      }
      return "M4,4 Q2,8 2,14 Q2,22 5,25 Q8,28 11,28 Q14,28 17,25 Q20,22 20,14 Q20,8 18,4 Q15,0 11,0 Q7,0 4,4 Z"
    }
    if (tooth.type === "canine") {
      if (isUpper) {
        return "M3,26 Q1,22 1,16 Q1,8 4,3 Q7,0 9,0 Q11,0 14,3 Q17,8 17,16 Q17,22 15,26 Q12,30 9,30 Q6,30 3,26 Z"
      }
      return "M3,4 Q1,8 1,14 Q1,22 4,27 Q7,30 9,30 Q11,30 14,27 Q17,22 17,14 Q17,8 15,4 Q12,0 9,0 Q6,0 3,4 Z"
    }
    // Incisor
    if (isUpper) {
      return "M2,22 Q1,18 1,14 Q1,6 4,3 Q6,0 8,0 Q10,0 12,3 Q15,6 15,14 Q15,18 14,22 Q12,26 8,26 Q4,26 2,22 Z"
    }
    return "M2,4 Q1,8 1,12 Q1,20 4,23 Q6,26 8,26 Q10,26 12,23 Q15,20 15,12 Q15,8 14,4 Q12,0 8,0 Q4,0 2,4 Z"
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative group focus:outline-none"
      title={`#${tooth.number} - ${tooth.name}`}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${tooth.type === "molar" ? 28 : tooth.type === "premolar" ? 22 : tooth.type === "canine" ? 18 : 16} ${height}`}
        className="transition-transform group-hover:scale-110"
      >
        <defs>
          <linearGradient id={`tooth-gradient-${tooth.number}`} x1="0%" y1="0%" x2="100%" y2="100%">
            {isSelected ? (
              <>
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#dc2626" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#fafafa" />
                <stop offset="50%" stopColor="#f5f5f4" />
                <stop offset="100%" stopColor="#e7e5e4" />
              </>
            )}
          </linearGradient>
          <filter id={`shadow-${tooth.number}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.2" />
          </filter>
        </defs>
        <path
          d={getToothPath()}
          fill={`url(#tooth-gradient-${tooth.number})`}
          stroke={isSelected ? "#b91c1c" : "#a8a29e"}
          strokeWidth="1.5"
          filter={`url(#shadow-${tooth.number})`}
          className="transition-all"
        />
        {/* Root indication for upper teeth */}
        {isUpper && (
          <line
            x1={tooth.type === "molar" ? 14 : tooth.type === "premolar" ? 11 : tooth.type === "canine" ? 9 : 8}
            y1={height - 4}
            x2={tooth.type === "molar" ? 14 : tooth.type === "premolar" ? 11 : tooth.type === "canine" ? 9 : 8}
            y2={height}
            stroke={isSelected ? "#b91c1c" : "#d6d3d1"}
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
        {/* Root indication for lower teeth */}
        {!isUpper && (
          <line
            x1={tooth.type === "molar" ? 14 : tooth.type === "premolar" ? 11 : tooth.type === "canine" ? 9 : 8}
            y1="0"
            x2={tooth.type === "molar" ? 14 : tooth.type === "premolar" ? 11 : tooth.type === "canine" ? 9 : 8}
            y2="4"
            stroke={isSelected ? "#b91c1c" : "#d6d3d1"}
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
      </svg>
      <span className={`absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-medium ${isSelected ? "text-red-600" : "text-gray-500"}`}>
        {tooth.number}
      </span>
    </button>
  )
}

interface ToothDiagramProps {
  selectedTeeth: number[]
  onToothClick: (toothNumber: number) => void
}

function ToothDiagram({ selectedTeeth, onToothClick }: ToothDiagramProps) {
  return (
    <div className="space-y-6">
      <div className="text-center text-sm text-muted-foreground">
        Click on teeth to mark as extracted/treated
      </div>
      
      {/* Upper Jaw */}
      <div className="space-y-2">
        <div className="text-xs text-center font-medium text-gray-600 uppercase tracking-wide">Upper Jaw (Maxilla)</div>
        <div className="flex justify-center items-end gap-0.5 px-2">
          {teethData.upper.map((tooth) => (
            <Tooth
              key={tooth.number}
              tooth={tooth}
              isSelected={selectedTeeth.includes(tooth.number)}
              onClick={() => onToothClick(tooth.number)}
              isUpper={true}
            />
          ))}
        </div>
      </div>

      {/* Gum Line / Bite Line */}
      <div className="flex justify-center px-4">
        <div className="w-full max-w-lg h-2 bg-gradient-to-r from-pink-100 via-pink-200 to-pink-100 rounded-full shadow-inner"></div>
      </div>

      {/* Lower Jaw */}
      <div className="space-y-2">
        <div className="flex justify-center items-start gap-0.5 px-2 mt-4">
          {teethData.lower.map((tooth) => (
            <Tooth
              key={tooth.number}
              tooth={tooth}
              isSelected={selectedTeeth.includes(tooth.number)}
              onClick={() => onToothClick(tooth.number)}
              isUpper={false}
            />
          ))}
        </div>
        <div className="text-xs text-center font-medium text-gray-600 uppercase tracking-wide">Lower Jaw (Mandible)</div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs pt-2 border-t">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-gray-50 to-gray-200 border border-gray-300 shadow-sm"></div>
          <span className="text-gray-600">Normal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-red-400 to-red-600 border border-red-700 shadow-sm"></div>
          <span className="text-gray-600">Extracted/Treated</span>
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

      // Build diagnosis from selected teeth
      let diagnosis = ""
      if (selectedTeeth.length > 0) {
        const sortedTeeth = selectedTeeth.sort((a, b) => a - b)
        const teethDetails = sortedTeeth.map(num => {
          const tooth = [...teethData.upper, ...teethData.lower].find(t => t.number === num)
          return tooth ? `#${num} (${tooth.name})` : `#${num}`
        })
        diagnosis = `Affected Teeth: ${teethDetails.join(', ')}`
      } else {
        diagnosis = "General checkup - No specific teeth affected"
      }

      const { error } = await supabase.from("medical_records").insert({
        patient_id: formData.patient_id,
        doctor_id: formData.doctor_id,
        diagnosis: diagnosis,
        prescription: formData.prescription || null,
        lab_results: xrayUrl || null,
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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

            {/* Realistic Tooth Diagram */}
            <div className="space-y-2">
              <Label>Dental Chart</Label>
              <div className="border rounded-lg p-4 bg-gradient-to-b from-gray-50 to-white">
                <ToothDiagram
                  selectedTeeth={selectedTeeth}
                  onToothClick={handleToothClick}
                />
              </div>
              {selectedTeeth.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-red-800">
                    Selected teeth ({selectedTeeth.length}): {selectedTeeth.sort((a, b) => a - b).map(num => {
                      const tooth = [...teethData.upper, ...teethData.lower].find(t => t.number === num)
                      return `#${num}`
                    }).join(', ')}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="prescription">Treatment / Prescription</Label>
              <Textarea
                id="prescription"
                placeholder="Enter treatment details or prescription..."
                value={formData.prescription}
                onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
                rows={3}
              />
            </div>

            {/* X-ray Upload */}
            <div className="space-y-2">
              <Label>X-ray Upload</Label>
              {!xrayPreview ? (
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary hover:bg-gray-50 transition-colors">
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
                <div className="relative border rounded-lg p-2 bg-black">
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
                  <p className="text-sm text-gray-400 mt-2 text-center">
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
