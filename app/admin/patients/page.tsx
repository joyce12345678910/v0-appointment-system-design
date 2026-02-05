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
        <div className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl border border-blue-100">
          <h1 className="text-3xl font-bold text-blue-900">Patients</h1>
          <p className="text-blue-600 mt-1">Manage patient records and information</p>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 ml-4">Loading patients...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl border border-blue-100">
        <h1 className="text-3xl font-bold text-blue-900">Patients</h1>
        <p className="text-blue-600 mt-1">Manage patient records and information</p>
      </div>

      <Card className="border-blue-100">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
          <CardTitle className="text-blue-900">All Patients</CardTitle>
          <CardDescription className="text-blue-600">Total registered patients: {patients?.length || 0}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {patients && patients.length > 0 ? (
            <div className="space-y-3">
              {patients.map((patient) => (
                <div key={patient.id} className="bg-gradient-to-r from-blue-50 to-white border-2 border-blue-100 rounded-lg overflow-hidden hover:border-blue-300 hover:shadow-md transition-all">
                  <button
                    onClick={() => handleExpandPatient(patient.id)}
                    className="w-full flex items-center justify-between p-5 hover:bg-blue-100/30 transition-colors"
                  >
                    <div className="flex-1 text-left space-y-2">
                      <p className="font-bold text-blue-900">{patient.full_name}</p>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-blue-600">{patient.email}</p>
                        {patient.phone && <p className="text-xs text-gray-600">{patient.phone}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-xs text-gray-600 text-right">
                        <span className="font-semibold">Joined</span>
                        <br />
                        {new Date(patient.created_at).toLocaleDateString()}
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-blue-600 transition-transform ${expandedPatient === patient.id ? "rotate-180" : ""}`}
                      />
                    </div>
                  </button>

                  {expandedPatient === patient.id && (
                    <div className="border-t-2 border-blue-100 p-5 bg-blue-50 space-y-4">
                      <h3 className="font-bold text-sm text-blue-900">Medical History</h3>
                      {medicalRecords[patient.id] && medicalRecords[patient.id].length > 0 ? (
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {medicalRecords[patient.id].map((record) => (
                            <div
                              key={record.id}
                              className="bg-white border-2 border-blue-100 p-4 rounded-lg text-sm space-y-3"
                            >
                              <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                  <p className="font-bold text-blue-900">{record.diagnosis}</p>
                                  <p className="text-xs text-blue-600 mt-1">
                                    {new Date(record.date).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              {record.treatment && (
                                <div className="bg-blue-50 p-3 rounded border border-blue-100">
                                  <p className="text-xs font-semibold text-blue-900 mb-1">Treatment:</p>
                                  <p className="text-xs text-gray-700">{record.treatment}</p>
                                </div>
                              )}
                              {record.notes && (
                                <div className="bg-blue-50 p-3 rounded border border-blue-100">
                                  <p className="text-xs font-semibold text-blue-900 mb-1">Notes:</p>
                                  <p className="text-xs text-gray-700">{record.notes}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600 bg-white p-3 rounded border border-blue-100">
                          No medical records found for this patient
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-blue-300 text-4xl mb-4">👥</div>
              <p className="text-gray-600 font-medium">No patients registered yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
