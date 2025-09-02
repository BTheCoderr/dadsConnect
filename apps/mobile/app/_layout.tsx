import { Slot } from "expo-router"
import { useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { setAuthTokenProvider } from "@dadconnect/shared"

export default function RootLayout() {
  useEffect(() => {
    setAuthTokenProvider(async () => {
      const session = await supabase.auth.getSession()
      return session.data.session?.access_token ?? null
    })
  }, [])

  return <Slot />
}


