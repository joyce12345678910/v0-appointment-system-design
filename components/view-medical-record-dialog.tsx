"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { MedicalRecord } from "@/lib/types"
import { Eye } from "lucide-react"

interface ViewMedicalRecordDialogProps {
  record: MedicalRecord
}

export function ViewMedicalRecordDialog({ record }: ViewMedicalRecordDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Medical Record Details</DialogTitle>
          <DialogDescription>Complete medical record information</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Information */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Patient Information</h3>
            <div className="space-y-1">
              <p className="font-medium">{record.patient?.full_name}</p>
              <p className="text-sm text-muted-foreground">{record.patient?.email}</p>
            </div>
          </div>

          {/* Doctor Information */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Doctor Information</h3>
            <div className="space-y-1">
              <p className="font-medium">Dr. {record.doctor?.full_name}</p>
              <p className="text-sm text-muted-foreground">{record.doctor?.specialization}</p>
            </div>
          </div>

          {/* Visit Date */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Visit Date</h3>
            <p className="text-sm">{new Date(record.visit_date).toLocaleDateString()}</p>
          </div>

          {/* Diagnosis */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Diagnosis</h3>
            <p className="text-sm whitespace-pre-wrap">{record.diagnosis}</p>
          </div>

          {/* Prescription */}
          {record.prescription && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Prescription</h3>
              <p className="text-sm whitespace-pre-wrap">{record.prescription}</p>
            </div>
          )}

          {/* Lab Results */}
          {record.lab_results && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Lab Results</h3>
              <p className="text-sm whitespace-pre-wrap">{record.lab_results}</p>
            </div>
          )}

          {/* Notes */}
          {record.notes && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Additional Notes</h3>
              <p className="text-sm whitespace-pre-wrap">{record.notes}</p>
            </div>
          )}

          {/* Created Date */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Record Created</h3>
            <p className="text-sm">{new Date(record.created_at).toLocaleString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
