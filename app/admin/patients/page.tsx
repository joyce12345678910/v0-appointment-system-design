"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"

export default function PatientsPage() {
  const [patients, setPatients] = useState([])
  const [expandedPatient, setExpandedPatient] = useState<string | null>(null)
  const [medicalRecords, setMedicalRecords] = useState<Record<string, any[]>>({})
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchPatients = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "patient")
        .order("created_at", { ascending: false })

      setPatients(data || [])
      setLoading(false)
    }

    fetchPatients()
  }, [])

  const handleExpandPatient = async (patientId: string) => {
    if (expandedPatient === patientId) {
      setExpandedPatient(null)
      return
    }

    setExpandedPatient(patientId)

    // Fetch medical records for this patient if not already loaded
    if (!medicalRecords[patientId]) {
      const { data } = await supabase
        .from("medical_records")
        .select("*")
        .eq("patient_id", patientId)
        .order("date", { ascending: false })

      setMedicalRecords((prev) => ({
        ...prev,
        [patientId]: data || [],
      }))
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Patients</h1>
          <p className="text-muted-foreground">Manage patient records and information</p>
        </div>
        <p className="text-sm text-muted-foreground">Loading patients...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Patients</h1>
        <p className="text-muted-foreground">Manage patient records and information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Patients</CardTitle>
          <CardDescription>Total registered patients: {patients?.length || 0}</CardDescription>
        </CardHeader>
        <CardContent>
          {patients && patients.length > 0 ? (
            <div className="space-y-2">
              {patients.map((patient) => (
                <div key={patient.id} className="border rounded-lg">
                  <button
                    onClick={() => handleExpandPatient(patient.id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 text-left space-y-1">
                      <p className="font-medium">{patient.full_name}</p>
                      <p className="text-sm text-muted-foreground">{patient.email}</p>
                      {patient.phone && <p className="text-xs text-muted-foreground">{patient.phone}</p>}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-xs text-muted-foreground text-right">
                        Joined {new Date(patient.created_at).toLocaleDateString()}
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${expandedPatient === patient.id ? "rotate-180" : ""}`}
                      />
                    </div>
                  </button>

                  {expandedPatient === patient.id && (
                    <div className="border-t p-4 bg-muted/30 space-y-3">
                      <h3 className="font-semibold text-sm">Medical History</h3>
                      {medicalRecords[patient.id] && medicalRecords[patient.id].length > 0 ? (
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {medicalRecords[patient.id].map((record) => (
                            <div
                              key={record.id}
                              className="bg-white dark:bg-slate-900 p-3 rounded border text-sm space-y-2"
                            >
                              <div className="flex justify-between items-start">
                                <p className="font-medium">{record.diagnosis}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(record.date).toLocaleDateString()}
                                </p>
                              </div>
                              {record.treatment && (
                                <div>
                                  <p className="text-xs font-semibold text-muted-foreground">Treatment:</p>
                                  <p className="text-xs">{record.treatment}</p>
                                </div>
                              )}
                              {record.notes && (
                                <div>
                                  <p className="text-xs font-semibold text-muted-foreground">Notes:</p>
                                  <p className="text-xs">{record.notes}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No medical records found for this patient</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No patients registered yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
