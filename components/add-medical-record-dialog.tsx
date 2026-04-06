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

interface DentalChartProps {
  selectedTeeth: number[]
  onToothClick: (toothNumber: number) => void
}

function DentalChart({ selectedTeeth, onToothClick }: DentalChartProps) {
  // Tooth positions for upper arch (arranged in U shape from overhead view)
  const upperTeethPositions = [
    // Right side (1-8) - patient's right
    { number: 1, x: 45, y: 35, rotation: -70, type: "molar" },
    { number: 2, x: 55, y: 55, rotation: -55, type: "molar" },
    { number: 3, x: 70, y: 75, rotation: -40, type: "molar" },
    { number: 4, x: 88, y: 95, rotation: -30, type: "premolar" },
    { number: 5, x: 108, y: 112, rotation: -20, type: "premolar" },
    { number: 6, x: 130, y: 125, rotation: -10, type: "canine" },
    { number: 7, x: 152, y: 132, rotation: -3, type: "incisor" },
    { number: 8, x: 175, y: 136, rotation: 0, type: "incisor" },
    // Left side (9-16) - patient's left
    { number: 9, x: 198, y: 136, rotation: 0, type: "incisor" },
    { number: 10, x: 221, y: 132, rotation: 3, type: "incisor" },
    { number: 11, x: 243, y: 125, rotation: 10, type: "canine" },
    { number: 12, x: 265, y: 112, rotation: 20, type: "premolar" },
    { number: 13, x: 285, y: 95, rotation: 30, type: "premolar" },
    { number: 14, x: 303, y: 75, rotation: 40, type: "molar" },
    { number: 15, x: 318, y: 55, rotation: 55, type: "molar" },
    { number: 16, x: 328, y: 35, rotation: 70, type: "molar" },
  ]

  // Tooth positions for lower arch
  const lowerTeethPositions = [
    // Right side (32-25) - patient's right
    { number: 32, x: 55, y: 35, rotation: 70, type: "molar" },
    { number: 31, x: 68, y: 55, rotation: 55, type: "molar" },
    { number: 30, x: 85, y: 72, rotation: 40, type: "molar" },
    { number: 29, x: 103, y: 88, rotation: 28, type: "premolar" },
    { number: 28, x: 123, y: 100, rotation: 18, type: "premolar" },
    { number: 27, x: 143, y: 108, rotation: 8, type: "canine" },
    { number: 26, x: 163, y: 112, rotation: 2, type: "incisor" },
    { number: 25, x: 182, y: 114, rotation: 0, type: "incisor" },
    // Left side (24-17) - patient's left
    { number: 24, x: 200, y: 114, rotation: 0, type: "incisor" },
    { number: 23, x: 219, y: 112, rotation: -2, type: "incisor" },
    { number: 22, x: 239, y: 108, rotation: -8, type: "canine" },
    { number: 21, x: 259, y: 100, rotation: -18, type: "premolar" },
    { number: 20, x: 279, y: 88, rotation: -28, type: "premolar" },
    { number: 19, x: 297, y: 72, rotation: -40, type: "molar" },
    { number: 18, x: 314, y: 55, rotation: -55, type: "molar" },
    { number: 17, x: 327, y: 35, rotation: -70, type: "molar" },
  ]

  const getToothDimensions = (type: string) => {
    switch (type) {
      case "molar": return { width: 26, height: 30 }
      case "premolar": return { width: 20, height: 24 }
      case "canine": return { width: 16, height: 22 }
      case "incisor": return { width: 14, height: 20 }
      default: return { width: 18, height: 22 }
    }
  }

  const renderTooth = (
    number: number,
    x: number,
    y: number,
    rotation: number,
    type: string,
    isUpper: boolean
  ) => {
    const isSelected = selectedTeeth.includes(number)
    const dims = getToothDimensions(type)
    const fillColor = isSelected ? "#ef4444" : "#ffffff"
    const strokeColor = isSelected ? "#dc2626" : "#d1d5db"
    const grooveColor = isSelected ? "#fca5a5" : "#9ca3af"

    return (
      <g
        key={number}
        transform={`translate(${x}, ${y}) rotate(${rotation})`}
        onClick={() => onToothClick(number)}
        className="cursor-pointer transition-all duration-150 hover:opacity-80"
        style={{ filter: isSelected ? "drop-shadow(0 0 4px rgba(239, 68, 68, 0.5))" : "none" }}
      >
        <title>#{number} - {[...teethData.upper, ...teethData.lower].find(t => t.number === number)?.name}</title>
        
        {/* Tooth shape based on type */}
        {type === "molar" && (
          <>
            <rect
              x={-dims.width / 2}
              y={-dims.height / 2}
              width={dims.width}
              height={dims.height}
              rx={5}
              ry={5}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={2}
            />
            {/* Cross groove pattern for molars */}
            <line x1={-dims.width / 4} y1={0} x2={dims.width / 4} y2={0} stroke={grooveColor} strokeWidth={1.5} />
            <line x1={0} y1={-dims.height / 4} x2={0} y2={dims.height / 4} stroke={grooveColor} strokeWidth={1.5} />
          </>
        )}
        
        {type === "premolar" && (
          <>
            <ellipse
              cx={0}
              cy={0}
              rx={dims.width / 2}
              ry={dims.height / 2}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={2}
            />
            {/* Simple groove for premolars */}
            <line x1={-dims.width / 5} y1={0} x2={dims.width / 5} y2={0} stroke={grooveColor} strokeWidth={1.5} />
          </>
        )}
        
        {type === "canine" && (
          <>
            <ellipse
              cx={0}
              cy={0}
              rx={dims.width / 2}
              ry={dims.height / 2}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={2}
            />
            {/* Point indicator for canines */}
            <circle cx={0} cy={0} r={3} fill={grooveColor} />
          </>
        )}
        
        {type === "incisor" && (
          <>
            <ellipse
              cx={0}
              cy={0}
              rx={dims.width / 2}
              ry={dims.height / 2}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={2}
            />
          </>
        )}
      </g>
    )
  }

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-3 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-slate-800 text-sm">Dental Chart</h4>
            <p className="text-xs text-slate-500">Click teeth to mark as affected</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-white border-2 border-gray-300"></div>
              <span className="text-slate-600">Normal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-red-400"></div>
              <span className="text-slate-600">Selected</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          {/* Upper Jaw */}
          <div className="relative">
            <div className="text-center mb-2">
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Upper Jaw (Maxilla)</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1 px-2">
              <span>RIGHT</span>
              <span>LEFT</span>
            </div>
            <svg viewBox="0 0 380 160" className="w-full max-w-[380px] h-auto">
              {/* Palate/Gum area */}
              <path
                d="M45,30 Q50,140 190,150 Q330,140 335,30 Q330,10 190,5 Q50,10 45,30"
                fill="#f9a8b8"
                stroke="#e88a9c"
                strokeWidth={2}
              />
              {/* Palate ridges */}
              <path d="M140,60 Q190,70 240,60" fill="none" stroke="#e88a9c" strokeWidth={1.5} opacity={0.6} />
              <path d="M130,80 Q190,95 250,80" fill="none" stroke="#e88a9c" strokeWidth={1.5} opacity={0.6} />
              <path d="M125,100 Q190,118 255,100" fill="none" stroke="#e88a9c" strokeWidth={1.5} opacity={0.6} />
              
              {/* Teeth */}
              {upperTeethPositions.map((tooth) =>
                renderTooth(tooth.number, tooth.x, tooth.y, tooth.rotation, tooth.type, true)
              )}
              
              {/* Tooth numbers */}
              {upperTeethPositions.map((tooth) => {
                const offset = tooth.number <= 8 ? -18 : 18
                const xOffset = tooth.number <= 8 
                  ? -Math.cos((tooth.rotation * Math.PI) / 180) * 20
                  : Math.cos((tooth.rotation * Math.PI) / 180) * 20
                const yOffset = -Math.abs(Math.sin((tooth.rotation * Math.PI) / 180)) * 15 - 5
                return (
                  <text
                    key={`num-${tooth.number}`}
                    x={tooth.x + (tooth.number <= 8 ? -15 : 15)}
                    y={tooth.y - 18}
                    textAnchor="middle"
                    fontSize={8}
                    fill={selectedTeeth.includes(tooth.number) ? "#dc2626" : "#64748b"}
                    fontWeight="bold"
                  >
                    {tooth.number}
                  </text>
                )
              })}
            </svg>
          </div>

          {/* Lower Jaw */}
          <div className="relative">
            <div className="text-center mb-2">
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Lower Jaw (Mandible)</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1 px-2">
              <span>RIGHT</span>
              <span>LEFT</span>
            </div>
            <svg viewBox="0 0 380 140" className="w-full max-w-[380px] h-auto">
              {/* Tongue/Gum area */}
              <path
                d="M55,130 Q60,20 190,10 Q320,20 327,130 Q320,140 190,145 Q60,140 55,130"
                fill="#f9a8b8"
                stroke="#e88a9c"
                strokeWidth={2}
              />
              {/* Tongue indication */}
              <ellipse cx={190} cy={75} rx={70} ry={40} fill="#e88a9c" opacity={0.4} />
              
              {/* Teeth */}
              {lowerTeethPositions.map((tooth) =>
                renderTooth(tooth.number, tooth.x, tooth.y, tooth.rotation, tooth.type, false)
              )}
              
              {/* Tooth numbers */}
              {lowerTeethPositions.map((tooth) => (
                <text
                  key={`num-${tooth.number}`}
                  x={tooth.x + (tooth.number >= 25 ? -15 : 15)}
                  y={tooth.y - 18}
                  textAnchor="middle"
                  fontSize={8}
                  fill={selectedTeeth.includes(tooth.number) ? "#dc2626" : "#64748b"}
                  fontWeight="bold"
                >
                  {tooth.number}
                </text>
              ))}
            </svg>
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
                  return `#${num} (${tooth?.name})`
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
