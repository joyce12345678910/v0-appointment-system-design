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

// Modern tooth icon component
function ToothIcon({ 
  type, 
  isSelected, 
  isUpper 
}: { 
  type: string
  isSelected: boolean
  isUpper: boolean 
}) {
  const baseColor = isSelected ? "#ef4444" : "#e2e8f0"
  const strokeColor = isSelected ? "#dc2626" : "#94a3b8"
  const rootColor = isSelected ? "#fca5a5" : "#cbd5e1"
  
  // Crown shapes for different tooth types
  if (type === "molar") {
    return (
      <svg viewBox="0 0 40 56" className="w-full h-full">
        {/* Roots */}
        <g transform={isUpper ? "translate(0, 0)" : "rotate(180, 20, 28)"}>
          <path d="M10,36 L8,52 Q7,56 10,54 L12,40" fill={rootColor} stroke={strokeColor} strokeWidth="0.5" />
          <path d="M20,38 L20,54 Q20,56 22,54 L22,38" fill={rootColor} stroke={strokeColor} strokeWidth="0.5" />
          <path d="M30,36 L32,52 Q33,56 30,54 L28,40" fill={rootColor} stroke={strokeColor} strokeWidth="0.5" />
        </g>
        {/* Crown */}
        <rect x="4" y={isUpper ? "8" : "12"} width="32" height="28" rx="4" fill={baseColor} stroke={strokeColor} strokeWidth="1.5" />
        {/* Occlusal surface detail */}
        <path d={`M12,${isUpper ? "16" : "20"} L28,${isUpper ? "16" : "20"} M12,${isUpper ? "28" : "32"} L28,${isUpper ? "28" : "32"} M20,${isUpper ? "14" : "18"} L20,${isUpper ? "30" : "34"}`} stroke={strokeColor} strokeWidth="0.75" opacity="0.5" />
      </svg>
    )
  }
  
  if (type === "premolar") {
    return (
      <svg viewBox="0 0 32 52" className="w-full h-full">
        {/* Root */}
        <g transform={isUpper ? "translate(0, 0)" : "rotate(180, 16, 26)"}>
          <path d="M16,36 L14,48 Q13,52 16,50 Q19,52 18,48 L16,36" fill={rootColor} stroke={strokeColor} strokeWidth="0.5" />
        </g>
        {/* Crown */}
        <rect x="4" y={isUpper ? "8" : "10"} width="24" height="26" rx="4" fill={baseColor} stroke={strokeColor} strokeWidth="1.5" />
        {/* Surface detail */}
        <ellipse cx="16" cy={isUpper ? "21" : "23"} rx="6" ry="4" fill="none" stroke={strokeColor} strokeWidth="0.75" opacity="0.5" />
      </svg>
    )
  }
  
  if (type === "canine") {
    return (
      <svg viewBox="0 0 28 54" className="w-full h-full">
        {/* Root */}
        <g transform={isUpper ? "translate(0, 0)" : "rotate(180, 14, 27)"}>
          <path d="M14,36 L12,50 Q11,54 14,52 Q17,54 16,50 L14,36" fill={rootColor} stroke={strokeColor} strokeWidth="0.5" />
        </g>
        {/* Crown - pointed */}
        <path d={`M4,${isUpper ? "34" : "18"} L14,${isUpper ? "8" : "36"} L24,${isUpper ? "34" : "18"} Q26,${isUpper ? "36" : "16"} 24,${isUpper ? "38" : "14"} L4,${isUpper ? "38" : "14"} Q2,${isUpper ? "36" : "16"} 4,${isUpper ? "34" : "18"}`} fill={baseColor} stroke={strokeColor} strokeWidth="1.5" />
      </svg>
    )
  }
  
  // Incisor
  return (
    <svg viewBox="0 0 24 50" className="w-full h-full">
      {/* Root */}
      <g transform={isUpper ? "translate(0, 0)" : "rotate(180, 12, 25)"}>
        <path d="M12,32 L10,46 Q9,50 12,48 Q15,50 14,46 L12,32" fill={rootColor} stroke={strokeColor} strokeWidth="0.5" />
      </g>
      {/* Crown - rectangular */}
      <rect x="3" y={isUpper ? "8" : "12"} width="18" height="22" rx="3" fill={baseColor} stroke={strokeColor} strokeWidth="1.5" />
    </svg>
  )
}

interface DentalChartProps {
  selectedTeeth: number[]
  onToothClick: (toothNumber: number) => void
}

function DentalChart({ selectedTeeth, onToothClick }: DentalChartProps) {
  const getToothSize = (type: string) => {
    switch (type) {
      case "molar": return { width: 40, height: 56 }
      case "premolar": return { width: 32, height: 52 }
      case "canine": return { width: 28, height: 54 }
      case "incisor": return { width: 24, height: 50 }
      default: return { width: 28, height: 50 }
    }
  }

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-3 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-slate-800 text-sm">Dental Chart</h4>
            <p className="text-xs text-slate-500">Click to select affected teeth</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-slate-200 border border-slate-300"></div>
              <span className="text-slate-600">Normal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-red-500 border border-red-400"></div>
              <span className="text-slate-600">Selected</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Upper Jaw */}
        <div className="mb-1">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider">RIGHT</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">UPPER JAW</span>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider">LEFT</span>
          </div>
          
          {/* Upper teeth row */}
          <div className="flex justify-center items-end gap-0.5 pb-2">
            {teethData.upper.map((tooth) => {
              const size = getToothSize(tooth.type)
              const isSelected = selectedTeeth.includes(tooth.number)
              return (
                <button
                  key={tooth.number}
                  onClick={() => onToothClick(tooth.number)}
                  className={`relative flex flex-col items-center transition-all duration-150 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 rounded ${isSelected ? 'z-10' : ''}`}
                  title={`#${tooth.number} - ${tooth.name}`}
                  style={{ width: size.width, height: size.height + 16 }}
                >
                  <div style={{ width: size.width, height: size.height }}>
                    <ToothIcon type={tooth.type} isSelected={isSelected} isUpper={true} />
                  </div>
                  <span className={`text-[9px] font-bold mt-0.5 ${isSelected ? 'text-red-600' : 'text-slate-500'}`}>
                    {tooth.number}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
            <span>8</span>
            <span>7</span>
            <span>6</span>
            <span>5</span>
            <span>4</span>
            <span>3</span>
            <span>2</span>
            <span>1</span>
            <span className="mx-1 text-slate-300">|</span>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
        </div>

        {/* Lower Jaw */}
        <div className="mt-1">
          {/* Lower teeth row */}
          <div className="flex justify-center items-start gap-0.5 pt-2">
            {teethData.lower.map((tooth) => {
              const size = getToothSize(tooth.type)
              const isSelected = selectedTeeth.includes(tooth.number)
              return (
                <button
                  key={tooth.number}
                  onClick={() => onToothClick(tooth.number)}
                  className={`relative flex flex-col items-center transition-all duration-150 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 rounded ${isSelected ? 'z-10' : ''}`}
                  title={`#${tooth.number} - ${tooth.name}`}
                  style={{ width: size.width, height: size.height + 16 }}
                >
                  <span className={`text-[9px] font-bold mb-0.5 ${isSelected ? 'text-red-600' : 'text-slate-500'}`}>
                    {tooth.number}
                  </span>
                  <div style={{ width: size.width, height: size.height }}>
                    <ToothIcon type={tooth.type} isSelected={isSelected} isUpper={false} />
                  </div>
                </button>
              )
            })}
          </div>
          
          <div className="flex items-center justify-between px-2 mt-2">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider">RIGHT</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">LOWER JAW</span>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider">LEFT</span>
          </div>
        </div>
      </div>

      {/* Selected teeth summary */}
      {selectedTeeth.length > 0 && (
        <div className="bg-red-50 border-t border-red-100 px-4 py-3">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
            <div>
              <p className="text-xs font-semibold text-red-700">
                {selectedTeeth.length} tooth/teeth selected
              </p>
              <p className="text-xs text-red-600 mt-0.5">
                {selectedTeeth.sort((a, b) => a - b).map(num => {
                  const tooth = [...teethData.upper, ...teethData.lower].find(t => t.number === num)
                  return `#${num}`
                }).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}
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

            {/* Panoramic Dental Chart */}
            <div className="space-y-2">
              <Label>Dental Chart (Panoramic View)</Label>
<DentalChart
              selectedTeeth={selectedTeeth}
              onToothClick={handleToothClick}
            />
              {selectedTeeth.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                  <p className="text-sm font-medium text-red-800">
                    Selected teeth ({selectedTeeth.length}): {selectedTeeth.sort((a, b) => a - b).map(num => {
                      const tooth = [...teethData.upper, ...teethData.lower].find(t => t.number === num)
                      return `#${num} (${tooth?.name})`
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
                rows={2}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isUploadingXray}>
              {isLoading || isUploadingXray ? "Saving..." : "Add Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
