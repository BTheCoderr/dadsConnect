"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HomeIcon, UsersIcon, CalendarDaysIcon, MessageCircleIcon, UserIcon, LogOutIcon } from "lucide-react"
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

      <header className="sticky top-0 z-40 hidden w-full border-b bg-background shadow-sm md:block">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-6">
          <Link href="/feed" className="mr-auto text-xl font-bold">DadConnect</Link>
          <Link href="/feed" className={pathname === "/feed" ? "font-semibold text-primary" : "text-muted-foreground"}>Feed</Link>
          <Link href="/groups" className={pathname.startsWith("/groups") ? "font-semibold text-primary" : "text-muted-foreground"}>Groups</Link>
          <Link href="/meetups" className={pathname.startsWith("/meetups") ? "font-semibold text-primary" : "text-muted-foreground"}>Meetups</Link>
          <Link href="/discussions" className={pathname.startsWith("/discussions") ? "font-semibold text-primary" : "text-muted-foreground"}>Discussions</Link>
          <Link href="/profile" className={pathname.startsWith("/profile") ? "font-semibold text-primary" : "text-muted-foreground"}>Profile</Link>
        </div>
      </header>

      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      <footer className="fixed inset-x-0 bottom-0 z-50 border-t bg-background shadow-lg md:hidden">
        <nav className="grid h-16 grid-cols-5">
          <Link href="/feed" className={cn("flex flex-col items-center justify-center gap-1 text-[11px] font-medium", pathname === "/feed" ? "text-primary" : "text-muted-foreground")} prefetch={false}>
            <HomeIcon className="h-5 w-5" />Feed
          </Link>
          <Link href="/groups" className={cn("flex flex-col items-center justify-center gap-1 text-[11px] font-medium", pathname.startsWith("/groups") ? "text-primary" : "text-muted-foreground")} prefetch={false}>
            <UsersIcon className="h-5 w-5" />Groups
          </Link>
          <Link href="/meetups" className={cn("flex flex-col items-center justify-center gap-1 text-[11px] font-medium", pathname.startsWith("/meetups") ? "text-primary" : "text-muted-foreground")} prefetch={false}>
            <CalendarDaysIcon className="h-5 w-5" />Meetups
          </Link>
          <Link href="/discussions" className={cn("flex flex-col items-center justify-center gap-1 text-[11px] font-medium", pathname.startsWith("/discussions") ? "text-primary" : "text-muted-foreground")} prefetch={false}>
            <MessageCircleIcon className="h-5 w-5" />Discuss
          </Link>
          <Link href="/profile" className={cn("flex flex-col items-center justify-center gap-1 text-[11px] font-medium", pathname.startsWith("/profile") ? "text-primary" : "text-muted-foreground")} prefetch={false}>
            <UserIcon className="h-5 w-5" />Profile
          </Link>
        </nav>
      </footer>
    </div>
  )
}
