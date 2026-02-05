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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl border border-blue-100">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Medical Records</h1>
          <p className="text-blue-600 mt-1">View and manage patient medical records</p>
        </div>
        <div>
          <AddMedicalRecordDialog />
        </div>
      </div>

      <Card className="border-blue-100">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
          <CardTitle className="text-blue-900">All Medical Records</CardTitle>
          <CardDescription className="text-blue-600">Total records: {records.length}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400" />
              <Input
                placeholder="Search by patient, doctor, or diagnosis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm w-full border-blue-200 focus:border-blue-500"
              />
            </div>

            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger className="w-full border-blue-200 focus:border-blue-500">
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
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-4">Loading medical records...</p>
            </div>
          ) : filteredRecords.length > 0 ? (
            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <div 
                  key={record.id} 
                  className="bg-gradient-to-r from-blue-50 to-white border-2 border-blue-100 rounded-lg p-5 hover:border-blue-300 hover:shadow-md transition-all space-y-4"
                >
                  {/* Patient Header */}
                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-blue-100">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 p-2 rounded-lg">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-blue-900">{record.patient?.full_name}</p>
                        <p className="text-sm text-blue-600">{record.patient?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Record Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-blue-100 rounded-lg p-3">
                      <p className="text-xs font-bold text-blue-900 uppercase mb-1">Doctor</p>
                      <p className="text-sm text-gray-700">Dr. {record.doctor?.full_name}</p>
                      <p className="text-xs text-gray-600 mt-1">{record.doctor?.specialization}</p>
                    </div>
                    <div className="bg-white border border-blue-100 rounded-lg p-3">
                      <p className="text-xs font-bold text-blue-900 uppercase mb-1">Visit Date</p>
                      <p className="text-sm text-gray-700">{new Date(record.visit_date).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-white border border-blue-100 rounded-lg p-3 md:col-span-2">
                      <p className="text-xs font-bold text-blue-900 uppercase mb-1">Diagnosis</p>
                      <p className="text-sm text-gray-700">{record.diagnosis}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <ViewMedicalRecordDialog record={record} />
                    <DeleteMedicalRecordDialog
                      recordId={record.id}
                      patientName={record.patient?.full_name || "Patient"}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-blue-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No medical records found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
