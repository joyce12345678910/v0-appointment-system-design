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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Trash2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface DeleteMedicalRecordDialogProps {
  recordId: string
  patientName: string
}

export function DeleteMedicalRecordDialog({ recordId, patientName }: DeleteMedicalRecordDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsLoading(true)

    const supabase = createClient()

    try {
      const { error } = await supabase.from("medical_records").delete().eq("id", recordId)

      if (error) throw error

      toast({
        title: "Medical Record Deleted",
        description: "The medical record has been successfully deleted.",
      })

      setOpen(false)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete medical record. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Medical Record</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this medical record for {patientName}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
