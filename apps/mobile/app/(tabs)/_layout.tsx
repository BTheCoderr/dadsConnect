import { useEffect, useState } from "react"
import { Redirect, Tabs } from "expo-router"
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native"
import { supabase } from "../../lib/supabase"

export default function TabsLayout() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [authError, setAuthError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let active = true
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!active) return
        setAuthenticated(Boolean(session))
        setAuthError(false)
      },
    )

    const check = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        if (!active) return
        setAuthenticated(Boolean(data.session))
        setAuthError(false)
      } catch {
        if (!active) return
        // A storage failure is not proof that the member signed out.
        setAuthError(true)
      }
    }
    void check()
    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [retryCount])

  if (authError) {
    return (
      <View style={styles.center}>
        <Text accessibilityRole="alert" style={styles.message}>
          We couldn't verify your DadConnect session. Your account hasn't been signed out.
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Retry checking account"
          style={styles.retry}
          onPress={() => {
            setAuthenticated(null)
            setAuthError(false)
            setRetryCount(current => current + 1)
          }}
        >
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      </View>
    )
  }

  if (authenticated === null) {
    return <View style={styles.center}><ActivityIndicator color="#1473e6" /><Text style={styles.message}>Checking your account…</Text></View>
  }

  if (!authenticated) return <Redirect href="/sign-in" />

  return (
    <Tabs>
      <Tabs.Screen name="feed/index" options={{ title: "Feed" }} />
      <Tabs.Screen name="groups/index" options={{ title: "Groups" }} />
      <Tabs.Screen name="meetups/index" options={{ title: "Meetups" }} />
      <Tabs.Screen name="chat/index" options={{ title: "Chat" }} />
      <Tabs.Screen name="profile/index" options={{ title: "Profile" }} />
      <Tabs.Screen name="library/index" options={{ href: null, title: "Library" }} />
      <Tabs.Screen name="groups/create" options={{ href: null, title: "Create Group" }} />
      <Tabs.Screen name="meetups/create" options={{ href: null, title: "Create Meetup" }} />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: "#f4f6f8", alignItems: "center", justifyContent: "center", padding: 24, gap: 14 },
  message: { color: "#24364a", fontSize: 15, textAlign: "center" },
  retry: { minHeight: 48, backgroundColor: "#1473e6", borderRadius: 10, justifyContent: "center", paddingHorizontal: 22 },
  retryText: { color: "#fff", fontSize: 16, fontWeight: "700" },
})
