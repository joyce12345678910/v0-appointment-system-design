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

interface DeleteDoctorDialogProps {
  doctorId: string
  doctorName: string
}

export function DeleteDoctorDialog({ doctorId, doctorName }: DeleteDoctorDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsLoading(true)

    const supabase = createClient()

    try {
      const { error } = await supabase.from("doctors").delete().eq("id", doctorId)

      if (error) throw error

      toast({
        title: "Doctor Deleted",
        description: "The doctor has been successfully removed from the system.",
      })

      setOpen(false)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete doctor. They may have existing appointments.",
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
          <DialogTitle>Delete Doctor</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete Dr. {doctorName}? This action cannot be undone and will affect all related
            appointments.
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
