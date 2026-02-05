"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Profile } from "@/lib/types"
import { toast } from "@/hooks/use-toast"
import { Upload, X, CheckCircle, AlertCircle, ImageIcon } from "lucide-react"

export default function PatientProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [address, setAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      
      // Fetch profile photo if exists
      if (data.profile_photo_url) {
        setProfilePhoto(data.profile_photo_url)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setIsFetching(false)
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPhotoError(null)
    setIsUploadingPhoto(true)
    setUploadProgress(0)

    try {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
      if (!allowedTypes.includes(file.type)) {
        setPhotoError("Only JPEG, PNG, and WebP images are allowed")
        setIsUploadingPhoto(false)
        return
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setPhotoError("File size must be less than 5MB")
        setIsUploadingPhoto(false)
        return
      }

      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      // Generate unique filename
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 30
        })
      }, 200)

      // Upload file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from("profile-photos")
        .upload(`public/${fileName}`, file, {
          cacheControl: "3600",
          upsert: false,
        })

      clearInterval(progressInterval)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("profile-photos")
        .getPublicUrl(`public/${fileName}`)

      setUploadProgress(100)

      // Update profile with photo URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          profile_photo_url: urlData.publicUrl,
        })
        .eq("id", user.id)

      if (updateError) throw updateError

      setProfilePhoto(urlData.publicUrl)

      toast({
        title: "Photo Uploaded",
        description: "Your profile photo has been successfully updated.",
      })

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      setTimeout(() => setUploadProgress(0), 1000)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to upload photo"
      setPhotoError(message)
      toast({
        title: "Upload Error",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsUploadingPhoto(false)
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
            {/* Profile Photo Section */}
            <div className="space-y-3 pb-6 border-b border-blue-100">
              <Label className="text-blue-900 font-semibold block">Profile Photo</Label>
              
              {profilePhoto ? (
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={profilePhoto || "/placeholder.svg"}
                      alt="Profile"
                      className="w-24 h-24 rounded-lg object-cover border-2 border-blue-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setProfilePhoto(null)
                        if (fileInputRef.current) fileInputRef.current.value = ""
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                      aria-label="Remove photo"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Photo uploaded successfully
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium underline"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-blue-200 bg-blue-50 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <ImageIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-blue-900 mb-1">Upload a profile photo</p>
                  <p className="text-xs text-blue-600 mb-4">PNG, JPG, or WebP (Max 5MB)</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoUpload}
                    disabled={isUploadingPhoto}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingPhoto}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isUploadingPhoto ? (
                      <>
                        <span className="inline-block animate-spin mr-2">⏳</span>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Photo
                      </>
                    )}
                  </Button>
                </div>
              )}

              {isUploadingPhoto && uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-blue-600 text-center font-medium">{Math.round(uploadProgress)}%</p>
                </div>
              )}

              {photoError && (
                <div className="border-2 border-red-200 bg-red-50 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{photoError}</p>
                </div>
              )}
            </div>

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
