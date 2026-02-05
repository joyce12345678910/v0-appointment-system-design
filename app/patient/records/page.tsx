import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText } from "lucide-react"

export default async function PatientRecordsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch medical records
  const { data: records } = await supabase
    .from("medical_records")
    .select(
      `
      *,
      doctor:doctors(full_name, specialization)
    `,
    )
    .eq("patient_id", user?.id)
    .order("visit_date", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Medical Records</h1>
        <p className="text-muted-foreground">View your medical history and records</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Medical Records</CardTitle>
          <CardDescription>Total records: {records?.length || 0}</CardDescription>
        </CardHeader>
        <CardContent>
          {records && records.length > 0 ? (
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
