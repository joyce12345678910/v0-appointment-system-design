"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Loader2 } from "lucide-react"

interface Doctor {
  full_name: string
  specialization: string
}

interface MedicalRecord {
  id: string
  patient_id: string
  doctor_id: string
  visit_date: string
  diagnosis: string
  prescription?: string
  lab_results?: string
  notes?: string
  doctor?: Doctor
}

export default function PatientRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchRecords = useCallback(async () => {
    const supabase = createClient()
    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data } = await supabase
        .from("medical_records")
        .select(`
          *,
          doctor:doctors(full_name, specialization)
        `)
        .eq("patient_id", user.id)
        .order("visit_date", { ascending: false })

      if (data) {
        setRecords(data)
      }
    } catch (error) {
      console.error("Error fetching records:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRecords()
  }, [fetchRecords])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Medical Records</h1>
        <p className="text-muted-foreground">View your medical history and records</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Medical Records</CardTitle>
          <CardDescription>Total records: {records.length || 0}</CardDescription>
        </CardHeader>
        <CardContent>
          {records.length > 0 ? (
            <div className="space-y-6">
              {records.map((record) => (
                <div key={record.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Dr. {record.doctor?.full_name}</p>
                        <p className="text-sm text-muted-foreground">{record.doctor?.specialization}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{new Date(record.visit_date).toLocaleDateString()}</Badge>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Diagnosis</p>
                      <p className="text-sm">{record.diagnosis}</p>
                    </div>

                    {record.prescription && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Prescription</p>
                        <p className="text-sm">{record.prescription}</p>
                      </div>
                    )}

                    {record.lab_results && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Lab Results</p>
                        <p className="text-sm">{record.lab_results}</p>
                      </div>
                    )}

                    {record.notes && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Additional Notes</p>
                        <p className="text-sm">{record.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No medical records found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
