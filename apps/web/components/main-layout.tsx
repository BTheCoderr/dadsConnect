"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HomeIcon, BookmarkIcon, UserIcon, LogOutIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()

  const handleLogout = () => {
    // Handle logout logic here
    console.log("User logged out")
    // In a real app, you'd clear session/token and redirect to login
    window.location.href = "/login" // Simple redirect for demo
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background p-4 shadow-sm md:hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">DadConnect</h1>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOutIcon className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="fixed inset-x-0 bottom-0 z-50 border-t bg-background shadow-lg md:hidden">
        <nav className="flex h-16 items-center justify-around">
          <Link
            href="/feed"
            className={cn(
              "flex flex-col items-center gap-1 text-xs font-medium transition-colors hover:text-primary",
              pathname === "/feed" ? "text-primary" : "text-muted-foreground",
            )}
            prefetch={false}
          >
            <HomeIcon className="h-6 w-6" />
            Feed
          </Link>
          <Link
            href="/library"
            className={cn(
              "flex flex-col items-center gap-1 text-xs font-medium transition-colors hover:text-primary",
              pathname === "/library" ? "text-primary" : "text-muted-foreground",
            )}
            prefetch={false}
          >
            <BookmarkIcon className="h-6 w-6" />
            Library
          </Link>
          <Link
            href="/profile" // Placeholder for profile page
            className={cn(
              "flex flex-col items-center gap-1 text-xs font-medium transition-colors hover:text-primary",
              pathname === "/profile" ? "text-primary" : "text-muted-foreground",
            )}
            prefetch={false}
          >
            <UserIcon className="h-6 w-6" />
            Profile
          </Link>
        </nav>
      </footer>
    </div>
  )
}
