import { Redirect, Tabs } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, View } from "react-native"
import { supabase } from "../../lib/supabase"

export default function TabsLayout() {
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
