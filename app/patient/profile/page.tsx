"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Profile } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

export default function PatientProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [address, setAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    const supabase = createClient()
    setIsFetching(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (error) throw error

      setProfile(data)
      setFullName(data.full_name || "")
      setPhone(data.phone || "")
      setDateOfBirth(data.date_of_birth || "")
      setAddress(data.address || "")
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setIsFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone: phone || null,
          date_of_birth: dateOfBirth || null,
          address: address || null,
        })
        .eq("id", user.id)

      if (error) throw error

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })

      fetchProfile()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center items-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 ml-4">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl border border-blue-100">
        <h1 className="text-3xl font-bold text-blue-900">Profile</h1>
        <p className="text-blue-600 mt-1">Manage your personal information</p>
      </div>

      <Card className="border-blue-100">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
          <CardTitle className="text-blue-900">Personal Information</CardTitle>
          <CardDescription className="text-blue-600">Update your profile details</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-blue-900 font-semibold">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={profile?.email || ""} 
                disabled 
                className="border-blue-200 bg-blue-50 text-gray-600"
              />
              <p className="text-xs text-blue-600">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-blue-900 font-semibold">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="border-blue-200 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-blue-900 font-semibold">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+63-917-123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border-blue-200 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-blue-900 font-semibold">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="border-blue-200 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-blue-900 font-semibold">Address</Label>
              <Input
                id="address"
                type="text"
                placeholder="123 Main St, Manila"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border-blue-200 focus:border-blue-500"
              />
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
