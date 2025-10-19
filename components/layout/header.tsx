"use client"

import { ChevronDown, LogOut, User, Lock } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"

export function Header() {
  const { data: session } = useSession()

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/login" })
      toast.success("Signed out successfully")
    } catch (error) {
      toast.error("Failed to sign out")
    }
  }

  const userName = session?.user?.name || "Admin"
  const userEmail = session?.user?.email || ""
  const userRole = session?.user?.role || "admin"
  const userAvatar = session?.user?.avatar

  // Get initials from name
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="flex h-16 items-center justify-end border-b border-border bg-card px-6">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-3 outline-none cursor-pointer hover:opacity-80 transition-opacity">
          <div className="text-right">
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
          </div>
          <Avatar>
            <AvatarImage src={userAvatar || "/placeholder.svg"} alt={userName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Personal Information
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Lock className="mr-2 h-4 w-4" />
            Change Password
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
