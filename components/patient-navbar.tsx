"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar, FileText, User, LogOut, Menu } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const navigation = [
  { name: "My Appointments", href: "/patient", icon: Calendar },
  { name: "Book Appointment", href: "/patient/book", icon: Calendar },
  { name: "Medical Records", href: "/patient/records", icon: FileText },
  { name: "Profile", href: "/patient/profile", icon: User },
]

export function PatientNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const handleLogout = () => {
    setShowLogoutDialog(true)
  }

  const confirmLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <>
      <nav className="border-b-2 border-blue-100 bg-gradient-to-r from-blue-50 to-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/patient" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg group-hover:shadow-lg transition-shadow">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-blue-900">Tactay Billedo</h2>
                <p className="text-xs text-blue-600">Patient Portal</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                      isActive
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-blue-100 hover:text-blue-900",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout} 
                className="ml-4 text-red-600 hover:bg-red-50 hover:text-red-700 border border-red-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-blue-100">
                    <Menu className="h-5 w-5 text-blue-600" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-gradient-to-b from-blue-50 to-white">
                  <div className="flex flex-col gap-3 mt-8">
                    {navigation.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                            isActive
                              ? "bg-blue-600 text-white shadow-md"
                              : "text-gray-700 hover:bg-blue-100 hover:text-blue-900",
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.name}
                        </Link>
                      )
                    })}
                    <Button 
                      variant="outline" 
                      onClick={handleLogout} 
                      className="justify-start gap-3 bg-transparent border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 mt-4"
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout? You will be redirected to the landing page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLogout} className="bg-destructive hover:bg-destructive/90">
              Logout
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
