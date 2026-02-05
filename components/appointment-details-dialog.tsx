"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Appointment } from "@/lib/types"
import { FileText, ExternalLink } from "lucide-react"

interface AppointmentDetailsDialogProps {
  appointment: Appointment | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AppointmentDetailsDialog({ appointment, open, onOpenChange }: AppointmentDetailsDialogProps) {
  if (!appointment) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
          <DialogDescription>Complete information about this appointment</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Status</h3>
            <Badge className={getStatusColor(appointment.status)}>{appointment.status.toUpperCase()}</Badge>
          </div>

          {/* Patient Information */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Patient Information</h3>
            <div className="space-y-1">
              <p className="font-medium">{appointment.patient?.full_name}</p>
              <p className="text-sm text-muted-foreground">{appointment.patient?.email}</p>
              {appointment.patient?.phone && (
                <p className="text-sm text-muted-foreground">{appointment.patient.phone}</p>
              )}
            </div>
          </div>

          {/* Doctor Information */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Doctor Information</h3>
            <div className="space-y-1">
              <p className="font-medium">Dr. {appointment.doctor?.full_name}</p>
              <p className="text-sm text-muted-foreground">{appointment.doctor?.specialization}</p>
            </div>
          </div>

          {/* Appointment Details */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Appointment Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{new Date(appointment.appointment_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-medium">{appointment.appointment_time}</p>
              </div>
              {appointment.appointment_type && (
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium capitalize">{appointment.appointment_type.replace("_", " ")}</p>
                </div>
              )}
            </div>
          </div>

          {/* Reason */}
          {appointment.reason && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Reason for Visit</h3>
              <p className="text-sm">{appointment.reason}</p>
            </div>
          )}

          {/* Notes */}
          {appointment.notes && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
              <p className="text-sm">{appointment.notes}</p>
            </div>
          )}

          {/* Uploaded Document */}
          {appointment.document_url && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Supporting Document</h3>
              <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{appointment.document_file_name}</p>
                    <p className="text-xs text-muted-foreground">
                      Uploaded {new Date(appointment.document_uploaded_at || "").toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent"
                  onClick={() => window.open(appointment.document_url, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                  View
                </Button>
              </div>
            </div>
          )}

          {/* Approval Information */}
          {appointment.approved_at && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Approval Information</h3>
              <p className="text-sm">Approved on {new Date(appointment.approved_at).toLocaleString()}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
