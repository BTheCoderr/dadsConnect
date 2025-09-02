"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import MainLayout from "@/components/main-layout"

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const isAuthRoute = pathname === "/" || pathname === "/auth" || pathname === "/login" || pathname === "/signup"

  if (isAuthRoute) {
    return <>{children}</>
  }

  return <MainLayout>{children}</MainLayout>
}
