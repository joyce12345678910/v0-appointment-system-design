"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddMedicalRecordDialog } from "@/components/add-medical-record-dialog"
import { ViewMedicalRecordDialog } from "@/components/view-medical-record-dialog"
import { DeleteMedicalRecordDialog } from "@/components/delete-medical-record-dialog"
import type { MedicalRecord, Profile } from "@/lib/types"
import { Search, FileText } from "lucide-react"

export default function MedicalRecordsPage() {
  const searchParams = useSearchParams()
  const patientIdFromUrl = searchParams.get("patient")

  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([])
  const [patients, setPatients] = useState<Profile[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPatient, setSelectedPatient] = useState(patientIdFromUrl || "all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterRecords()
  }, [records, searchQuery, selectedPatient])

  const fetchData = async () => {
    const supabase = createClient()
    setIsLoading(true)

    try {
      const [{ data: recordsData }, { data: patientsData }] = await Promise.all([
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
        supabase.from("profiles").select("*").eq("role", "patient").order("full_name"),
      ])

      if (recordsData) setRecords(recordsData)
      if (patientsData) setPatients(patientsData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterRecords = () => {
    let filtered = records

    if (selectedPatient !== "all") {
      filtered = filtered.filter((record) => record.patient_id === selectedPatient)
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

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Medical Records</h1>
          <p className="text-muted-foreground text-sm md:text-base">View and manage patient medical records</p>
        </div>
        <div className="w-full">
          <AddMedicalRecordDialog />
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

            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by patient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Patients</SelectItem>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.full_name}
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
                      <div>
                        <span className="font-medium">Created:</span> {new Date(record.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="text-xs md:text-sm pl-8">
                      <span className="font-medium">Diagnosis:</span>{" "}
                      <span className="line-clamp-2">{record.diagnosis}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2 pl-8">
                      <ViewMedicalRecordDialog record={record} />
                      <DeleteMedicalRecordDialog
                        recordId={record.id}
                        patientName={record.patient?.full_name || "Patient"}
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
