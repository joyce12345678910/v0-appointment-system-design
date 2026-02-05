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
      <nav className="border-b bg-card/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo - Gen-Z friendly with gradient accent */}
            <Link href="/patient" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-br from-primary to-primary/70 p-2 rounded-xl shadow-md group-hover:shadow-lg transition-all">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Tactay Billedo
                </h2>
                <p className="text-xs text-muted-foreground font-medium">Patient Portal</p>
              </div>
            </Link>

            {/* Desktop Navigation - Modern pills */}
            <div className="hidden md:flex items-center gap-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 hover-lift",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{item.name}</span>
                  </Link>
                )
              })}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="ml-2 rounded-full hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden lg:inline">Logout</span>
              </Button>
            </div>

            {/* Mobile Navigation - Modern slide-out */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col gap-3 mt-8">
                    <div className="mb-4 pb-4 border-b">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-primary to-primary/70 p-2 rounded-xl">
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold">Patient Portal</h3>
                          <p className="text-xs text-muted-foreground">Tactay Billedo</p>
                        </div>
                      </div>
                    </div>
                    {navigation.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-md"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
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
                      className="justify-start gap-3 bg-red-50 text-red-600 hover:bg-red-100 border-red-200 rounded-xl mt-4"
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
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Are you sure you want to logout? You will be redirected to the landing page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end mt-4">
            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLogout} className="bg-red-500 hover:bg-red-600 rounded-full">
              Logout
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
