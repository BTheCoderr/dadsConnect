import { Redirect, Tabs } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, Pressable, Text, View } from "react-native"
import { supabase } from "../../lib/supabase"

export default function TabsLayout() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null)
  const [authError, setAuthError] = useState(false)
  const [retry, setRetry] = useState(0)
  useEffect(() => {
    let active = true
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return
      setSignedIn(Boolean(session))
      setAuthError(false)
    })
    void supabase.auth.getSession()
      .then(({ data, error }) => {
        if(error) throw error
        if(active){ setSignedIn(Boolean(data.session)); setAuthError(false) }
      })
      .catch(() => {
        if(active) setAuthError(true)
      })
    return () => { active = false; subscription.unsubscribe() }
  }, [retry])
  if (authError) return (
    <View style={{flex:1,justifyContent:"center",alignItems:"center",gap:14,padding:24}}>
      <Text accessibilityRole="alert" style={{textAlign:"center",color:"#24364a"}}>
        We couldn't verify your session. Your account hasn't been signed out.
      </Text>
      <Pressable accessibilityRole="button" accessibilityLabel="Retry checking account" onPress={() => {
        setSignedIn(null);setAuthError(false);setRetry(current => current+1)
      }} style={{backgroundColor:"#1473e6",borderRadius:10,padding:14}}>
        <Text style={{color:"white",fontWeight:"700"}}>Try again</Text>
      </Pressable>
    </View>
  )
  if (signedIn === null) return <View style={{flex:1,justifyContent:"center",alignItems:"center"}}><ActivityIndicator /></View>
  if (!signedIn) return <Redirect href="/sign-in" />
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="feed" options={{ title: "Feed" }} />
      <Tabs.Screen name="groups" options={{ title: "Groups" }} />
      <Tabs.Screen name="meetups" options={{ title: "Meetups" }} />
      <Tabs.Screen name="chat" options={{ title: "Chat" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      <Tabs.Screen name="profile/edit" options={{ href: null, title: "Edit Profile" }} />
      <Tabs.Screen name="profile/delete" options={{ href: null, title: "Delete Account" }} />
      <Tabs.Screen name="profile/blocked" options={{ href: null, title: "Hidden Members" }} />
      <Tabs.Screen name="chat/report" options={{ href: null, title: "Report Message" }} />
      <Tabs.Screen name="library" options={{ href: null, title: "Library" }} />
      <Tabs.Screen name="groups/create" options={{ href: null, title: "Create Group" }} />
      <Tabs.Screen name="meetups/create" options={{ href: null, title: "Create Meetup" }} />
    </Tabs>
  )
}
