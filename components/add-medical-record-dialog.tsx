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

interface PanoramicToothDiagramProps {
  selectedTeeth: number[]
  onToothClick: (toothNumber: number) => void
}

function PanoramicToothDiagram({ selectedTeeth, onToothClick }: PanoramicToothDiagramProps) {
  // SVG paths for realistic panoramic X-ray style teeth
  const getToothPath = (toothNum: number, isUpper: boolean) => {
    const tooth = [...teethData.upper, ...teethData.lower].find(t => t.number === toothNum)
    if (!tooth) return ""
    
    // Different tooth shapes based on type - more realistic X-ray appearance
    if (tooth.type === "molar") {
      if (isUpper) {
        // Upper molar with 3 roots
        return "M8,0 C12,0 16,2 18,6 L20,8 C22,10 24,14 24,20 C24,28 22,36 20,42 L18,50 C16,56 12,58 8,58 C4,58 0,56 -2,50 L-4,42 C-6,36 -8,28 -8,20 C-8,14 -6,10 -4,8 L-2,6 C0,2 4,0 8,0 M4,58 L2,72 C1,78 3,80 5,78 L8,70 M8,58 L8,75 C8,80 10,80 12,78 L14,70 M12,58 L16,72 C17,78 15,80 13,78 L10,70"
      }
      // Lower molar with 2 roots
      return "M8,80 C12,80 16,78 18,74 L20,72 C22,70 24,66 24,60 C24,52 22,44 20,38 L18,30 C16,24 12,22 8,22 C4,22 0,24 -2,30 L-4,38 C-6,44 -8,52 -8,60 C-8,66 -6,70 -4,72 L-2,74 C0,78 4,80 8,80 M4,22 L2,8 C1,2 3,0 5,2 L8,10 M12,22 L16,8 C17,2 15,0 13,2 L10,10"
    }
    
    if (tooth.type === "premolar") {
      if (isUpper) {
        return "M6,0 C9,0 12,2 14,6 L15,10 C16,14 16,20 16,28 C16,36 15,44 14,50 L12,58 C10,62 8,64 6,64 C4,64 2,62 0,58 L-2,50 C-3,44 -4,36 -4,28 C-4,20 -3,14 -2,10 L0,6 C2,2 4,0 6,0 M4,64 L3,76 C2,80 5,80 6,76 L7,64"
      }
      return "M6,80 C9,80 12,78 14,74 L15,70 C16,66 16,60 16,52 C16,44 15,36 14,30 L12,22 C10,18 8,16 6,16 C4,16 2,18 0,22 L-2,30 C-3,36 -4,44 -4,52 C-4,60 -3,66 -2,70 L0,74 C2,78 4,80 6,80 M4,16 L3,4 C2,0 5,0 6,4 L7,16"
    }
    
    if (tooth.type === "canine") {
      if (isUpper) {
        return "M5,0 C8,0 10,3 11,8 L12,14 C12,22 12,32 11,42 L10,52 C9,58 7,62 5,62 C3,62 1,58 0,52 L-1,42 C-2,32 -2,22 -1,14 L0,8 C1,3 3,0 5,0 M5,62 L5,78 C5,82 6,82 7,78 L7,62"
      }
      return "M5,80 C8,80 10,77 11,72 L12,66 C12,58 12,48 11,38 L10,28 C9,22 7,18 5,18 C3,18 1,22 0,28 L-1,38 C-2,48 -2,58 -1,66 L0,72 C1,77 3,80 5,80 M5,18 L5,2 C5,-2 6,-2 7,2 L7,18"
    }
    
    // Incisor
    if (isUpper) {
      return "M4,0 C6,0 8,2 9,6 L10,12 C10,20 10,30 9,40 L8,50 C7,56 6,60 4,60 C2,60 1,56 0,50 L-1,40 C-2,30 -2,20 -1,12 L0,6 C1,2 2,0 4,0 M4,60 L4,74 C4,78 5,78 6,74 L6,60"
    }
    return "M4,80 C6,80 8,78 9,74 L10,68 C10,60 10,50 9,40 L8,30 C7,24 6,20 4,20 C2,20 1,24 0,30 L-1,40 C-2,50 -2,60 -1,68 L0,74 C1,78 2,80 4,80 M4,20 L4,6 C4,2 5,2 6,6 L6,20"
  }

  // Calculate tooth positions along an arch curve
  const getToothPosition = (index: number, isUpper: boolean, total: number) => {
    const startAngle = isUpper ? Math.PI * 0.15 : Math.PI * 0.85
    const endAngle = isUpper ? Math.PI * 0.85 : Math.PI * 0.15
    const angle = startAngle + (endAngle - startAngle) * (index / (total - 1))
    
    const radiusX = 280
    const radiusY = isUpper ? 120 : 100
    const centerX = 320
    const centerY = isUpper ? 160 : 240
    
    const x = centerX + radiusX * Math.cos(angle)
    const y = centerY + radiusY * Math.sin(angle) * (isUpper ? -1 : 1)
    
    // Rotation to follow the arch
    const rotation = ((angle - Math.PI / 2) * 180 / Math.PI) * (isUpper ? 1 : -1)
    
    return { x, y, rotation }
  }

  const getToothWidth = (type: string) => {
    switch (type) {
      case "molar": return 32
      case "premolar": return 20
      case "canine": return 16
      case "incisor": return 14
      default: return 18
    }
  }

  return (
    <div className="w-full">
      <div className="text-center text-sm text-muted-foreground mb-3">
        Click on teeth to mark as extracted/treated
      </div>
      
      <div className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-xl p-4 overflow-hidden">
        {/* X-ray overlay effect */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40 pointer-events-none"></div>
        
        <svg viewBox="0 0 640 400" className="w-full h-auto">
          {/* Background glow effect */}
          <defs>
            <radialGradient id="xray-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0a1929" stopOpacity="0" />
            </radialGradient>
            <filter id="tooth-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="selected-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          <rect x="0" y="0" width="640" height="400" fill="url(#xray-glow)" />
          
          {/* Jaw bone outline - upper */}
          <path
            d="M60,100 Q120,20 320,10 Q520,20 580,100"
            fill="none"
            stroke="#1e3a5f"
            strokeWidth="40"
            strokeLinecap="round"
            opacity="0.3"
          />
          
          {/* Jaw bone outline - lower */}
          <path
            d="M60,300 Q120,380 320,390 Q520,380 580,300"
            fill="none"
            stroke="#1e3a5f"
            strokeWidth="40"
            strokeLinecap="round"
            opacity="0.3"
          />
          
          {/* Upper teeth */}
          {teethData.upper.map((tooth, index) => {
            const pos = getToothPosition(index, true, teethData.upper.length)
            const isSelected = selectedTeeth.includes(tooth.number)
            const width = getToothWidth(tooth.type)
            
            return (
              <g
                key={tooth.number}
                transform={`translate(${pos.x}, ${pos.y}) rotate(${pos.rotation})`}
                onClick={() => onToothClick(tooth.number)}
                className="cursor-pointer transition-transform hover:scale-110"
                filter={isSelected ? "url(#selected-glow)" : "url(#tooth-glow)"}
              >
                <title>#{tooth.number} - {tooth.name}</title>
                {/* Tooth shape */}
                <path
                  d={getToothPath(tooth.number, true)}
                  fill={isSelected ? "#ef4444" : "#c5d8e8"}
                  stroke={isSelected ? "#fca5a5" : "#8fb3d1"}
                  strokeWidth="1"
                  transform={`translate(${-width/2}, -40)`}
                  opacity={isSelected ? 1 : 0.9}
                />
                {/* Tooth number */}
                <text
                  y="-50"
                  textAnchor="middle"
                  fill={isSelected ? "#fca5a5" : "#64b5f6"}
                  fontSize="10"
                  fontWeight="bold"
                  transform={`rotate(${-pos.rotation})`}
                >
                  {tooth.number}
                </text>
              </g>
            )
          })}
          
          {/* Lower teeth */}
          {teethData.lower.map((tooth, index) => {
            const pos = getToothPosition(index, false, teethData.lower.length)
            const isSelected = selectedTeeth.includes(tooth.number)
            const width = getToothWidth(tooth.type)
            
            return (
              <g
                key={tooth.number}
                transform={`translate(${pos.x}, ${pos.y}) rotate(${pos.rotation + 180})`}
                onClick={() => onToothClick(tooth.number)}
                className="cursor-pointer transition-transform hover:scale-110"
                filter={isSelected ? "url(#selected-glow)" : "url(#tooth-glow)"}
              >
                <title>#{tooth.number} - {tooth.name}</title>
                {/* Tooth shape */}
                <path
                  d={getToothPath(tooth.number, false)}
                  fill={isSelected ? "#ef4444" : "#c5d8e8"}
                  stroke={isSelected ? "#fca5a5" : "#8fb3d1"}
                  strokeWidth="1"
                  transform={`translate(${-width/2}, -40)`}
                  opacity={isSelected ? 1 : 0.9}
                />
                {/* Tooth number */}
                <text
                  y="65"
                  textAnchor="middle"
                  fill={isSelected ? "#fca5a5" : "#64b5f6"}
                  fontSize="10"
                  fontWeight="bold"
                  transform={`rotate(${-(pos.rotation + 180)})`}
                >
                  {tooth.number}
                </text>
              </g>
            )
          })}
          
          {/* Center divider line */}
          <line x1="320" y1="160" x2="320" y2="240" stroke="#1e3a5f" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
          
          {/* Labels */}
          <text x="320" y="30" textAnchor="middle" fill="#64b5f6" fontSize="12" fontWeight="bold">UPPER (Maxilla)</text>
          <text x="320" y="385" textAnchor="middle" fill="#64b5f6" fontSize="12" fontWeight="bold">LOWER (Mandible)</text>
          <text x="30" y="200" textAnchor="middle" fill="#64b5f6" fontSize="10" transform="rotate(-90, 30, 200)">RIGHT</text>
          <text x="610" y="200" textAnchor="middle" fill="#64b5f6" fontSize="10" transform="rotate(90, 610, 200)">LEFT</text>
        </svg>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs mt-3 pt-3 border-t">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#c5d8e8] border border-[#8fb3d1]"></div>
          <span className="text-gray-600">Normal Tooth</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500 border border-red-300"></div>
          <span className="text-gray-600">Selected/Affected</span>
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

            {/* Panoramic Dental Chart */}
            <div className="space-y-2">
              <Label>Dental Chart (Panoramic View)</Label>
              <PanoramicToothDiagram
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
