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
  // Front view tooth component with realistic shape
  const renderTooth = (
    number: number,
    x: number,
    width: number,
    height: number,
    isUpper: boolean,
    type: string
  ) => {
    const isSelected = selectedTeeth.includes(number)
    const toothInfo = [...teethData.upper, ...teethData.lower].find(t => t.number === number)
    
    // Tooth crown shape variations based on type
    const getToothPath = () => {
      const hw = width / 2
      const h = height
      
      if (type === "molar") {
        if (isUpper) {
          return `M${x - hw + 2},0 
                  Q${x - hw},${h * 0.1} ${x - hw},${h * 0.2}
                  L${x - hw + 1},${h * 0.85}
                  Q${x - hw + 2},${h} ${x},${h}
                  Q${x + hw - 2},${h} ${x + hw - 1},${h * 0.85}
                  L${x + hw},${h * 0.2}
                  Q${x + hw},${h * 0.1} ${x + hw - 2},0
                  Z`
        }
        return `M${x - hw + 2},${h}
                Q${x - hw},${h * 0.9} ${x - hw},${h * 0.8}
                L${x - hw + 1},${h * 0.15}
                Q${x - hw + 2},0 ${x},0
                Q${x + hw - 2},0 ${x + hw - 1},${h * 0.15}
                L${x + hw},${h * 0.8}
                Q${x + hw},${h * 0.9} ${x + hw - 2},${h}
                Z`
      }
      
      if (type === "premolar") {
        if (isUpper) {
          return `M${x - hw + 1},0
                  Q${x - hw - 1},${h * 0.15} ${x - hw},${h * 0.25}
                  L${x - hw + 2},${h * 0.85}
                  Q${x},${h + 2} ${x + hw - 2},${h * 0.85}
                  L${x + hw},${h * 0.25}
                  Q${x + hw + 1},${h * 0.15} ${x + hw - 1},0
                  Z`
        }
        return `M${x - hw + 1},${h}
                Q${x - hw - 1},${h * 0.85} ${x - hw},${h * 0.75}
                L${x - hw + 2},${h * 0.15}
                Q${x},${-2} ${x + hw - 2},${h * 0.15}
                L${x + hw},${h * 0.75}
                Q${x + hw + 1},${h * 0.85} ${x + hw - 1},${h}
                Z`
      }
      
      if (type === "canine") {
        if (isUpper) {
          return `M${x - hw + 2},0
                  Q${x - hw - 1},${h * 0.2} ${x - hw},${h * 0.35}
                  L${x - hw + 3},${h * 0.9}
                  Q${x},${h + 4} ${x + hw - 3},${h * 0.9}
                  L${x + hw},${h * 0.35}
                  Q${x + hw + 1},${h * 0.2} ${x + hw - 2},0
                  Z`
        }
        return `M${x - hw + 2},${h}
                Q${x - hw - 1},${h * 0.8} ${x - hw},${h * 0.65}
                L${x - hw + 3},${h * 0.1}
                Q${x},${-4} ${x + hw - 3},${h * 0.1}
                L${x + hw},${h * 0.65}
                Q${x + hw + 1},${h * 0.8} ${x + hw - 2},${h}
                Z`
      }
      
      // Incisor - rectangular with rounded edges
      if (isUpper) {
        return `M${x - hw + 1},0
                Q${x - hw - 1},${h * 0.1} ${x - hw},${h * 0.2}
                L${x - hw + 1},${h * 0.92}
                Q${x},${h + 1} ${x + hw - 1},${h * 0.92}
                L${x + hw},${h * 0.2}
                Q${x + hw + 1},${h * 0.1} ${x + hw - 1},0
                Z`
      }
      return `M${x - hw + 1},${h}
              Q${x - hw - 1},${h * 0.9} ${x - hw},${h * 0.8}
              L${x - hw + 1},${h * 0.08}
              Q${x},${-1} ${x + hw - 1},${h * 0.08}
              L${x + hw},${h * 0.8}
              Q${x + hw + 1},${h * 0.9} ${x + hw - 1},${h}
              Z`
    }

    return (
      <g
        key={number}
        onClick={() => onToothClick(number)}
        className="cursor-pointer"
        style={{ transition: "all 0.15s ease" }}
      >
        <title>#{number} - {toothInfo?.name}</title>
        
        {/* Tooth shape */}
        <path
          d={getToothPath()}
          fill={isSelected ? "#ef4444" : "url(#toothGradient)"}
          stroke={isSelected ? "#b91c1c" : "#d4d4d4"}
          strokeWidth={1}
          className="hover:brightness-95 transition-all"
          style={{
            filter: isSelected ? "drop-shadow(0 0 3px rgba(239, 68, 68, 0.5))" : "drop-shadow(0 1px 1px rgba(0,0,0,0.1))"
          }}
        />
        
        {/* Tooth number label */}
        <text
          x={x}
          y={isUpper ? -8 : height + 12}
          textAnchor="middle"
          fontSize={9}
          fontWeight="600"
          fill={isSelected ? "#dc2626" : "#64748b"}
        >
          {number}
        </text>
      </g>
    )
  }

  // Tooth widths and positions for upper teeth (front view, patient perspective)
  const upperTeeth = [
    { number: 1, width: 22, type: "molar" },
    { number: 2, width: 22, type: "molar" },
    { number: 3, width: 24, type: "molar" },
    { number: 4, width: 16, type: "premolar" },
    { number: 5, width: 16, type: "premolar" },
    { number: 6, width: 18, type: "canine" },
    { number: 7, width: 16, type: "incisor" },
    { number: 8, width: 20, type: "incisor" },
    { number: 9, width: 20, type: "incisor" },
    { number: 10, width: 16, type: "incisor" },
    { number: 11, width: 18, type: "canine" },
    { number: 12, width: 16, type: "premolar" },
    { number: 13, width: 16, type: "premolar" },
    { number: 14, width: 24, type: "molar" },
    { number: 15, width: 22, type: "molar" },
    { number: 16, width: 22, type: "molar" },
  ]

  const lowerTeeth = [
    { number: 32, width: 22, type: "molar" },
    { number: 31, width: 22, type: "molar" },
    { number: 30, width: 24, type: "molar" },
    { number: 29, width: 16, type: "premolar" },
    { number: 28, width: 16, type: "premolar" },
    { number: 27, width: 16, type: "canine" },
    { number: 26, width: 14, type: "incisor" },
    { number: 25, width: 14, type: "incisor" },
    { number: 24, width: 14, type: "incisor" },
    { number: 23, width: 14, type: "incisor" },
    { number: 22, width: 16, type: "canine" },
    { number: 21, width: 16, type: "premolar" },
    { number: 20, width: 16, type: "premolar" },
    { number: 19, width: 24, type: "molar" },
    { number: 18, width: 22, type: "molar" },
    { number: 17, width: 22, type: "molar" },
  ]

  // Calculate x positions
  const calculatePositions = (teeth: typeof upperTeeth) => {
    const totalWidth = teeth.reduce((sum, t) => sum + t.width + 2, 0)
    const startX = (460 - totalWidth) / 2
    let currentX = startX
    return teeth.map(tooth => {
      const x = currentX + tooth.width / 2
      currentX += tooth.width + 2
      return { ...tooth, x }
    })
  }

  const upperPositions = calculatePositions(upperTeeth)
  const lowerPositions = calculatePositions(lowerTeeth)

  return (
    <div className="w-full bg-gradient-to-b from-slate-50 to-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-slate-800 text-sm">Dental Chart</h4>
            <p className="text-xs text-slate-500">Click on teeth to mark as affected</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-gradient-to-b from-white to-gray-100 border border-gray-300 shadow-sm"></div>
              <span className="text-slate-600">Normal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-red-500 border border-red-400 shadow-sm"></div>
              <span className="text-slate-600">Affected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dental Chart SVG */}
      <div className="p-4">
        <svg viewBox="0 0 460 340" className="w-full max-w-[500px] mx-auto">
          <defs>
            {/* Tooth gradient for realistic look */}
            <linearGradient id="toothGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#f8f8f8" />
              <stop offset="100%" stopColor="#e8e8e8" />
            </linearGradient>
            
            {/* Gum gradient for upper jaw */}
            <linearGradient id="upperGumGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e8a0a0" />
              <stop offset="30%" stopColor="#d48888" />
              <stop offset="70%" stopColor="#c97878" />
              <stop offset="100%" stopColor="#e89898" />
            </linearGradient>
            
            {/* Gum gradient for lower jaw */}
            <linearGradient id="lowerGumGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#e8a0a0" />
              <stop offset="30%" stopColor="#d48888" />
              <stop offset="70%" stopColor="#c97878" />
              <stop offset="100%" stopColor="#e89898" />
            </linearGradient>
            
            {/* Shadow filter */}
            <filter id="gumShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15"/>
            </filter>
          </defs>

          {/* Upper Jaw Section */}
          <g transform="translate(0, 20)">
            {/* Upper gum/gingiva */}
            <path
              d="M30,0 
                 Q35,5 60,8
                 Q120,15 230,18
                 Q340,15 400,8
                 Q425,5 430,0
                 L430,55
                 Q400,52 230,50
                 Q60,52 30,55
                 Z"
              fill="url(#upperGumGradient)"
              filter="url(#gumShadow)"
            />
            
            {/* Gum line detail */}
            <path
              d="M50,50 Q230,44 410,50"
              fill="none"
              stroke="#b87070"
              strokeWidth={1.5}
              opacity={0.6}
            />

            {/* Upper teeth */}
            <g transform="translate(0, 55)">
              {upperPositions.map((tooth) => {
                const height = tooth.type === "molar" ? 42 : 
                              tooth.type === "premolar" ? 38 : 
                              tooth.type === "canine" ? 44 : 40
                return renderTooth(tooth.number, tooth.x, tooth.width, height, true, tooth.type)
              })}
            </g>
          </g>

          {/* Center line / bite indicator */}
          <line x1="80" y1="165" x2="380" y2="165" stroke="#f1f5f9" strokeWidth="3" strokeDasharray="8,4" />

          {/* Lower Jaw Section */}
          <g transform="translate(0, 170)">
            {/* Lower teeth */}
            <g transform="translate(0, 0)">
              {lowerPositions.map((tooth) => {
                const height = tooth.type === "molar" ? 38 : 
                              tooth.type === "premolar" ? 34 : 
                              tooth.type === "canine" ? 40 : 36
                return renderTooth(tooth.number, tooth.x, tooth.width, height, false, tooth.type)
              })}
            </g>

            {/* Lower gum/gingiva */}
            <g transform="translate(0, 38)">
              {/* Gum line detail */}
              <path
                d="M50,12 Q230,18 410,12"
                fill="none"
                stroke="#b87070"
                strokeWidth={1.5}
                opacity={0.6}
              />
              
              <path
                d="M30,10
                   Q35,8 60,6
                   Q120,2 230,0
                   Q340,2 400,6
                   Q425,8 430,10
                   L430,65
                   Q400,60 230,58
                   Q60,60 30,65
                   Z"
                fill="url(#lowerGumGradient)"
                filter="url(#gumShadow)"
              />
            </g>
          </g>

          {/* Labels */}
          <text x="230" y="12" textAnchor="middle" fontSize="11" fontWeight="600" fill="#64748b">UPPER (Maxillary)</text>
          <text x="230" y="332" textAnchor="middle" fontSize="11" fontWeight="600" fill="#64748b">LOWER (Mandibular)</text>
          <text x="15" y="170" textAnchor="middle" fontSize="9" fontWeight="500" fill="#94a3b8" transform="rotate(-90, 15, 170)">RIGHT</text>
          <text x="445" y="170" textAnchor="middle" fontSize="9" fontWeight="500" fill="#94a3b8" transform="rotate(90, 445, 170)">LEFT</text>
        </svg>
      </div>

      {/* Selected teeth summary */}
      {selectedTeeth.length > 0 && (
        <div className="bg-red-50 border-t border-red-100 px-4 py-3">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">{selectedTeeth.length}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-red-800">
                Affected Teeth
              </p>
              <p className="text-xs text-red-600 mt-1 leading-relaxed">
                {selectedTeeth.sort((a, b) => a - b).map(num => {
                  const tooth = [...teethData.upper, ...teethData.lower].find(t => t.number === num)
                  return `#${num} ${tooth?.name}`
                }).join(' | ')}
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
