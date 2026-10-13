import { useEffect, useState } from "react"
import { Redirect } from "expo-router"
import { ActivityIndicator, View } from "react-native"
import { supabase } from "../lib/supabase"

export default function Index() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null)
  useEffect(() => {
    let active = true
    void supabase.auth.getSession()
      .then(({ data }) => { if (active) setSignedIn(Boolean(data.session)) })
      .catch(() => { if (active) setSignedIn(false) })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setSignedIn(Boolean(session))
    })
    return () => { active = false; subscription.unsubscribe() }
  }, [])
  if (signedIn === null) return <View style={{flex:1,justifyContent:"center",alignItems:"center"}}><ActivityIndicator /></View>
  return <Redirect href={signedIn ? "/(tabs)/feed" : "/sign-in"} />
}
