"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ChevronDown, Trash2, UserX } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function PatientsPage() {
  const [patients, setPatients] = useState([])
  const [expandedPatient, setExpandedPatient] = useState<string | null>(null)
  const [medicalRecords, setMedicalRecords] = useState<Record<string, any[]>>({})
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [patientToDelete, setPatientToDelete] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    setLoading(true)
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "patient")
      .order("created_at", { ascending: false })

    setPatients(data || [])
    setLoading(false)
  }

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
        .order("visit_date", { ascending: false })

      setMedicalRecords((prev) => ({
        ...prev,
        [patientId]: data || [],
      }))
    }
  }

  const handleDeleteClick = (patient: any) => {
    setPatientToDelete(patient)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!patientToDelete) return

    setIsDeleting(true)

    try {
      console.log("[v0] Deleting patient:", patientToDelete.id)

      // Delete related data first (cascade delete)
      const { error: appointmentsError } = await supabase
        .from("appointments")
        .delete()
        .eq("patient_id", patientToDelete.id)

      if (appointmentsError) {
        console.error("[v0] Error deleting appointments:", appointmentsError)
        throw appointmentsError
      }

      const { error: recordsError } = await supabase
        .from("medical_records")
        .delete()
        .eq("patient_id", patientToDelete.id)

      if (recordsError) {
        console.error("[v0] Error deleting medical records:", recordsError)
        throw recordsError
      }

      // Delete the patient profile
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", patientToDelete.id)

      if (profileError) {
        console.error("[v0] Error deleting profile:", profileError)
        throw profileError
      }

      toast({
        title: "Patient Deleted",
        description: `${patientToDelete.full_name} has been successfully removed.`,
      })

      // Auto-refresh the patient list
      await fetchPatients()
      setExpandedPatient(null)
    } catch (error) {
      console.error("[v0] Delete error:", error)
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Failed to delete patient",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setPatientToDelete(null)
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
                  <div className="p-4 hover:bg-muted/50 transition-colors">
                    {/* Mobile: Stack layout, Desktop: Row layout */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      {/* Patient Info - Clickable to expand */}
                      <button
                        onClick={() => handleExpandPatient(patient.id)}
                        className="flex-1 flex items-start sm:items-center justify-between gap-2 text-left"
                      >
                        <div className="flex-1 min-w-0 space-y-1">
                          <p className="font-medium truncate">{patient.full_name}</p>
                          <p className="text-sm text-muted-foreground truncate">{patient.email}</p>
                          {patient.phone && <p className="text-xs text-muted-foreground">{patient.phone}</p>}
                          <p className="text-xs text-muted-foreground sm:hidden">
                            Joined {new Date(patient.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        
                        {/* Desktop: Date + Chevron */}
                        <div className="hidden sm:flex items-center gap-4 flex-shrink-0">
                          <div className="text-xs text-muted-foreground text-right">
                            Joined {new Date(patient.created_at).toLocaleDateString()}
                          </div>
                          <ChevronDown
                            className={`w-5 h-5 transition-transform ${expandedPatient === patient.id ? "rotate-180" : ""}`}
                          />
                        </div>
                        
                        {/* Mobile: Chevron only */}
                        <ChevronDown
                          className={`w-5 h-5 sm:hidden transition-transform flex-shrink-0 ${expandedPatient === patient.id ? "rotate-180" : ""}`}
                        />
                      </button>

                      {/* Delete Button - Fixed position on mobile */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteClick(patient)
                        }}
                        className="hover:bg-red-50 hover:text-red-600 transition-colors rounded-full self-start sm:self-center flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-full">
                <UserX className="h-5 w-5 text-red-600" />
              </div>
              <AlertDialogTitle className="text-xl">Delete Patient</AlertDialogTitle>
            </div>
            <div className="space-y-3">
              <AlertDialogDescription className="text-base">
                Are you sure you want to delete <span className="font-semibold">{patientToDelete?.full_name}</span>?
              </AlertDialogDescription>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-2">This action cannot be undone. This will permanently delete:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Patient profile and account</li>
                  <li>All appointments</li>
                  <li>All medical records</li>
                </ul>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full" disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 rounded-full"
            >
              {isDeleting ? "Deleting..." : "Delete Patient"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
