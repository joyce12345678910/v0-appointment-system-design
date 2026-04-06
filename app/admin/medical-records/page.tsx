"use client"

import { useEffect, useState } from "react"

import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddMedicalRecordDialog } from "@/components/add-medical-record-dialog"
import { ViewMedicalRecordDialog } from "@/components/view-medical-record-dialog"
import { DeleteMedicalRecordDialog } from "@/components/delete-medical-record-dialog"
import type { MedicalRecord, Doctor } from "@/lib/types"
import { Search, FileText, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterRecords()
  }, [records, searchQuery, selectedDoctor])

  const fetchData = async () => {
    const supabase = createClient()
    setIsLoading(true)

    try {
      const [{ data: recordsData }, { data: doctorsData }] = await Promise.all([
        supabase
          .from("medical_records")
          .select(
            `
            *,
            patient:profiles!medical_records_patient_id_fkey(id, full_name, email),
            doctor:doctors(id, full_name, specialization)
          `,
          )
          .order("visit_date", { ascending: false }),
        supabase.from("doctors").select("*").order("full_name"),
      ])

      if (recordsData) setRecords(recordsData)
      if (doctorsData) setDoctors(doctorsData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterRecords = () => {
    let filtered = records

    if (selectedDoctor !== "all") {
      filtered = filtered.filter((record) => record.doctor_id === selectedDoctor)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (record) =>
          record.patient?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.doctor?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredRecords(filtered)
  }

  const printPatientRecords = (patientId: string, patientName: string, patientEmail: string) => {
    // Get all records for this specific patient
    const patientRecords = records.filter((record) => record.patient_id === patientId)
    
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Medical Records - ${patientName}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #16a34a;
              padding-bottom: 20px;
            }
            .clinic-name {
              font-size: 24px;
              font-weight: bold;
              color: #16a34a;
            }
            .clinic-subtitle {
              color: #666;
              margin-top: 5px;
            }
            .patient-info {
              background: #f5f5f5;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .patient-name {
              font-size: 18px;
              font-weight: bold;
            }
            .patient-email {
              color: #666;
              font-size: 14px;
            }
            .record {
              border: 1px solid #ddd;
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 15px;
            }
            .record-header {
              display: flex;
              justify-content: space-between;
              border-bottom: 1px solid #eee;
              padding-bottom: 10px;
              margin-bottom: 10px;
            }
            .record-date {
              font-weight: bold;
              color: #16a34a;
            }
            .record-doctor {
              color: #666;
            }
            .record-section {
              margin-top: 10px;
            }
            .record-label {
              font-weight: bold;
              color: #333;
            }
            .record-value {
              margin-top: 3px;
              color: #555;
            }
            .print-date {
              text-align: center;
              margin-top: 30px;
              color: #999;
              font-size: 12px;
            }
            @media print {
              body { padding: 0; }
              .record { break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="clinic-name">Tactay-Billedo Clinic</div>
            <div class="clinic-subtitle">Dental & Medical Care</div>
          </div>
          
          <div class="patient-info">
            <div class="patient-name">${patientName}</div>
            <div class="patient-email">${patientEmail}</div>
            <div style="margin-top: 5px; font-size: 14px;">Total Records: ${patientRecords.length}</div>
          </div>

          ${patientRecords
            .map(
              (record) => `
            <div class="record">
              <div class="record-header">
                <span class="record-date">Visit Date: ${new Date(record.visit_date).toLocaleDateString()}</span>
                <span class="record-doctor">Dr. ${record.doctor?.full_name} (${record.doctor?.specialization})</span>
              </div>
              <div class="record-section">
                <div class="record-label">Diagnosis:</div>
                <div class="record-value">${record.diagnosis}</div>
              </div>
              ${record.treatment ? `
              <div class="record-section">
                <div class="record-label">Treatment:</div>
                <div class="record-value">${record.treatment}</div>
              </div>
              ` : ""}
              ${record.prescription ? `
              <div class="record-section">
                <div class="record-label">Prescription:</div>
                <div class="record-value">${record.prescription}</div>
              </div>
              ` : ""}
              ${record.notes ? `
              <div class="record-section">
                <div class="record-label">Notes:</div>
                <div class="record-value">${record.notes}</div>
              </div>
              ` : ""}
            </div>
          `,
            )
            .join("")}

          <div class="print-date">
            Printed on: ${new Date().toLocaleString()}
          </div>
        </body>
      </html>
    `

    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Medical Records</h1>
          <p className="text-muted-foreground text-sm md:text-base">View and manage patient medical records</p>
        </div>
        <div className="w-full">
          <AddMedicalRecordDialog onSuccess={fetchData} />
        </div>
      </div>

      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-lg md:text-2xl">All Medical Records</CardTitle>
          <CardDescription className="text-xs md:text-sm">Total records: {records.length}</CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="mb-6 space-y-3 md:space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by patient, doctor, or diagnosis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm w-full"
              />
            </div>

            <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by doctor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Doctors</SelectItem>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    Dr. {doctor.full_name} - {doctor.specialization}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Records List */}
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8 text-sm">Loading medical records...</p>
          ) : filteredRecords.length > 0 ? (
            <div className="space-y-3 md:space-y-4">
              {filteredRecords.map((record) => (
                <div key={record.id} className="border rounded-lg p-3 md:p-4 hover:bg-accent/50 transition-colors">
                  <div className="space-y-3 md:space-y-0">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm md:text-base break-words">{record.patient?.full_name}</p>
                        <p className="text-xs md:text-sm text-muted-foreground truncate">{record.patient?.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm pl-8">
                      <div>
                        <span className="font-medium">Doctor:</span> Dr. {record.doctor?.full_name}
                      </div>
                      <div>
                        <span className="font-medium">Specialization:</span> {record.doctor?.specialization}
                      </div>
                      <div>
                        <span className="font-medium">Visit Date:</span>{" "}
                        {new Date(record.visit_date).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="text-xs md:text-sm pl-8">
                      <span className="font-medium">Diagnosis:</span>{" "}
                      <span className="line-clamp-2">{record.diagnosis}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2 pl-8">
                      <ViewMedicalRecordDialog record={record} />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => printPatientRecords(
                          record.patient_id,
                          record.patient?.full_name || "Patient",
                          record.patient?.email || ""
                        )}
                        className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <Printer className="h-4 w-4 mr-1" />
                        Print All
                      </Button>
                      <DeleteMedicalRecordDialog
                        recordId={record.id}
                        patientName={record.patient?.full_name || "Patient"}
                        onSuccess={fetchData}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-sm">No medical records found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
