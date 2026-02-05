"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Trash2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface AppointmentActionsProps {
  appointmentId: string
  currentStatus: string
  appointmentDate?: string
  onActionComplete?: () => void
}

export function AppointmentActions({ appointmentId, currentStatus, appointmentDate, onActionComplete }: AppointmentActionsProps) {
  const [isApproveOpen, setIsApproveOpen] = useState(false)
  const [isRejectOpen, setIsRejectOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isCompleteOpen, setIsCompleteOpen] = useState(false)
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const isAppointmentPassed = appointmentDate ? new Date(appointmentDate) < new Date() : false

  const handleApprove = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const { error } = await supabase
        .from("appointments")
        .update({
          status: "approved",
          notes: notes || null,
          approved_by: user?.id,
          approved_at: new Date().toISOString(),
        })
        .eq("id", appointmentId)

      if (error) throw error

      toast({
        title: "Appointment Approved",
        description: "The appointment has been successfully approved.",
      })

      setIsApproveOpen(false)
      setNotes("")
      
      // Refresh the appointments list
      if (onActionComplete) {
        onActionComplete()
      } else {
        router.refresh()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve appointment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("appointments")
        .update({
          status: "cancelled",
          notes: notes || "Rejected by admin",
        })
        .eq("id", appointmentId)

      if (error) throw error

      toast({
        title: "Appointment Rejected",
        description: "The appointment has been cancelled.",
      })

      setIsRejectOpen(false)
      setNotes("")
      
      // Refresh the appointments list
      if (onActionComplete) {
        onActionComplete()
      } else {
        router.refresh()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject appointment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("appointments").delete().eq("id", appointmentId)

      if (error) throw error

      console.log("[v0] Appointment deleted successfully")
      
      toast({
        title: "Appointment Deleted",
        description: "The appointment has been permanently deleted.",
      })

      setIsDeleteOpen(false)
      
      // Refresh the appointments list
      if (onActionComplete) {
        onActionComplete()
      } else {
        router.refresh()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete appointment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const { error } = await supabase
        .from("appointments")
        .update({
          status: "completed",
          notes: notes || null,
          approved_by: user?.id,
          approved_at: new Date().toISOString(),
        })
        .eq("id", appointmentId)

      if (error) throw error

      toast({
        title: "Appointment Completed",
        description: "The appointment has been marked as completed.",
      })

      setIsCompleteOpen(false)
      setNotes("")
      
      // Refresh the appointments list
      if (onActionComplete) {
        onActionComplete()
      } else {
        router.refresh()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete appointment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex gap-1 md:gap-2 flex-wrap">
      {currentStatus === "pending" && (
        <>
          <Button size="sm" variant="default" onClick={() => setIsApproveOpen(true)} className="text-xs md:text-sm">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span className="hidden md:inline">Approve</span>
            <span className="md:hidden">OK</span>
          </Button>
          <Button size="sm" variant="destructive" onClick={() => setIsRejectOpen(true)} className="text-xs md:text-sm">
            <XCircle className="h-4 w-4 mr-1" />
            <span className="hidden md:inline">Reject</span>
            <span className="md:hidden">No</span>
          </Button>
        </>
      )}

      {currentStatus === "approved" && isAppointmentPassed && (
        <Button
          size="sm"
          variant="default"
          onClick={() => setIsCompleteOpen(true)}
          className="text-xs md:text-sm bg-blue-600 hover:bg-blue-700"
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          <span className="hidden md:inline">Complete</span>
          <span className="md:hidden">Done</span>
        </Button>
      )}

      <Button size="sm" variant="outline" onClick={() => setIsDeleteOpen(true)} className="text-xs md:text-sm">
        <Trash2 className="h-4 w-4" />
      </Button>

      {/* Approve Dialog */}
      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogContent className="w-[95vw] md:w-full">
          <DialogHeader>
            <DialogTitle>Approve Appointment</DialogTitle>
            <DialogDescription>Confirm this appointment and optionally add notes.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="approve-notes">Notes (Optional)</Label>
              <Textarea
                id="approve-notes"
                placeholder="Add any notes for this appointment..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="flex-col-reverse md:flex-row gap-2 md:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsApproveOpen(false)}
              disabled={isLoading}
              className="w-full md:w-auto"
            >
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? "Approving..." : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent className="w-[95vw] md:w-full">
          <DialogHeader>
            <DialogTitle>Reject Appointment</DialogTitle>
            <DialogDescription>Cancel this appointment and provide a reason.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reject-notes">Reason for Rejection</Label>
              <Textarea
                id="reject-notes"
                placeholder="Provide a reason for rejecting this appointment..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="flex-col-reverse md:flex-row gap-2 md:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsRejectOpen(false)}
              disabled={isLoading}
              className="w-full md:w-auto"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="w-[95vw] md:w-full">
          <DialogHeader>
            <DialogTitle>Delete Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col-reverse md:flex-row gap-2 md:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isLoading}
              className="w-full md:w-auto"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCompleteOpen} onOpenChange={setIsCompleteOpen}>
        <DialogContent className="w-[95vw] md:w-full">
          <DialogHeader>
            <DialogTitle>Mark Appointment as Completed</DialogTitle>
            <DialogDescription>
              Confirm that this appointment has been completed and optionally add notes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="complete-notes">Notes (Optional)</Label>
              <Textarea
                id="complete-notes"
                placeholder="Add any notes about the completed appointment..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="flex-col-reverse md:flex-row gap-2 md:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsCompleteOpen(false)}
              disabled={isLoading}
              className="w-full md:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleComplete}
              disabled={isLoading}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Completing..." : "Complete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
