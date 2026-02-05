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
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl border border-blue-100">
        <h1 className="text-3xl font-bold text-blue-900">Medical Records</h1>
        <p className="text-blue-600 mt-1">View your medical history and records</p>
      </div>

      <Card className="border-blue-100">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
          <CardTitle className="text-blue-900">Your Medical Records</CardTitle>
          <CardDescription className="text-blue-600">Total records: {records?.length || 0}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {records && records.length > 0 ? (
            <div className="space-y-4">
              {records.map((record) => (
                <div key={record.id} className="bg-gradient-to-r from-blue-50 to-white border-2 border-blue-100 rounded-lg p-5 hover:border-blue-300 hover:shadow-md transition-all space-y-4">
                  {/* Doctor Info Header */}
                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-blue-100">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 p-2 rounded-lg">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-blue-900">Dr. {record.doctor?.full_name}</p>
                        <p className="text-sm text-blue-600 font-medium">{record.doctor?.specialization}</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 border border-blue-200 font-semibold">
                      {new Date(record.visit_date).toLocaleDateString()}
                    </Badge>
                  </div>

                  {/* Medical Details Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Diagnosis */}
                    <div className="bg-white border border-blue-100 rounded-lg p-4">
                      <p className="text-xs font-bold text-blue-900 uppercase mb-2">Diagnosis</p>
                      <p className="text-sm text-gray-700">{record.diagnosis}</p>
                    </div>

                    {/* Prescription */}
                    {record.prescription && (
                      <div className="bg-white border border-blue-100 rounded-lg p-4">
                        <p className="text-xs font-bold text-blue-900 uppercase mb-2">Prescription</p>
                        <p className="text-sm text-gray-700">{record.prescription}</p>
                      </div>
                    )}

                    {/* Lab Results */}
                    {record.lab_results && (
                      <div className="bg-white border border-blue-100 rounded-lg p-4">
                        <p className="text-xs font-bold text-blue-900 uppercase mb-2">Lab Results</p>
                        <p className="text-sm text-gray-700">{record.lab_results}</p>
                      </div>
                    )}

                    {/* Additional Notes */}
                    {record.notes && (
                      <div className="bg-white border border-blue-100 rounded-lg p-4">
                        <p className="text-xs font-bold text-blue-900 uppercase mb-2">Additional Notes</p>
                        <p className="text-sm text-gray-700">{record.notes}</p>
                      </div>
                    )}
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
