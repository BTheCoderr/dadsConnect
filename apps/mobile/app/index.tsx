import { useEffect, useState } from "react"
import { Redirect } from "expo-router"
import { ActivityIndicator, Pressable, Text, View } from "react-native"
import { supabase } from "../lib/supabase"

export default function Index() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null)
  const [authError, setAuthError] = useState(false)
  const [retry, setRetry] = useState(0)
  useEffect(() => {
    let active = true
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if(!active) return
      setSignedIn(Boolean(session))
      setAuthError(false)
    })
    void supabase.auth.getSession()
      .then(({ data, error }) => {
        if(error) throw error
        if(active){ setSignedIn(Boolean(data.session)); setAuthError(false) }
      })
      .catch(() => { if(active) setAuthError(true) })
    return () => { active=false; subscription.unsubscribe() }
  }, [retry])
  if(authError) return (
    <View style={{flex:1,alignItems:"center",justifyContent:"center",gap:14,padding:24}}>
      <Text accessibilityRole="alert" style={{textAlign:"center"}}>
        We couldn't read your saved session. Try again without losing your account.
      </Text>
      <Pressable accessibilityRole="button" accessibilityLabel="Retry restoring session"
        style={{backgroundColor:"#1473e6",borderRadius:10,padding:14}}
        onPress={() => {setAuthError(false);setSignedIn(null);setRetry(current => current+1)}}>
        <Text style={{color:"white",fontWeight:"700"}}>Try again</Text>
      </Pressable>
    </View>
  )
  if (signedIn === null) return <View style={{flex:1,justifyContent:"center",alignItems:"center"}}><ActivityIndicator /></View>
  return <Redirect href={signedIn ? "/(tabs)/feed" : "/sign-in"} />
}
