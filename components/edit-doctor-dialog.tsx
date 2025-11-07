"use client"

import type React from "react"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { Doctor } from "@/lib/types"
import { Edit } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface EditDoctorDialogProps {
  doctor: Doctor
}

export function EditDoctorDialog({ doctor }: EditDoctorDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: doctor.full_name,
    specialization: doctor.specialization,
    email: doctor.email,
    phone: doctor.phone,
    license_number: doctor.license_number,
    years_of_experience: doctor.years_of_experience?.toString() || "",
    consultation_fee: doctor.consultation_fee?.toString() || "",
    available: doctor.available,
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("doctors")
        .update({
          full_name: formData.full_name,
          specialization: formData.specialization,
          email: formData.email,
          phone: formData.phone,
          license_number: formData.license_number,
          years_of_experience: formData.years_of_experience ? Number.parseInt(formData.years_of_experience) : null,
          consultation_fee: formData.consultation_fee ? Number.parseFloat(formData.consultation_fee) : null,
          available: formData.available,
        })
        .eq("id", doctor.id)

      if (error) throw error

      toast({
        title: "Doctor Updated",
        description: "The doctor information has been successfully updated.",
      })

      setOpen(false)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update doctor. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Doctor</DialogTitle>
          <DialogDescription>Update the doctor&apos;s information</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_full_name">Full Name *</Label>
                <Input
                  id="edit_full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_specialization">Specialization *</Label>
                <Input
                  id="edit_specialization"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_email">Email *</Label>
                <Input
                  id="edit_email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_phone">Phone *</Label>
                <Input
                  id="edit_phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_license_number">License Number *</Label>
              <Input
                id="edit_license_number"
                value={formData.license_number}
                onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_years_of_experience">Years of Experience</Label>
                <Input
                  id="edit_years_of_experience"
                  type="number"
                  min="0"
                  value={formData.years_of_experience}
                  onChange={(e) => setFormData({ ...formData, years_of_experience: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_consultation_fee">Consultation Fee (₱)</Label>
                <Input
                  id="edit_consultation_fee"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.consultation_fee}
                  onChange={(e) => setFormData({ ...formData, consultation_fee: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="edit_available"
                checked={formData.available}
                onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
              />
              <Label htmlFor="edit_available">Available for appointments</Label>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Doctor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
