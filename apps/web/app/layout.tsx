import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import ConditionalLayout from "@/components/conditional-layout"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DadConnect",
  description: "A community for dads to connect through groups, conversations, and meetups.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  )
}
