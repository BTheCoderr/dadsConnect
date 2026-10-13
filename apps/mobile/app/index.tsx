import { useEffect, useState } from "react"
import { Redirect } from "expo-router"
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native"
import { supabase } from "../lib/supabase"

export default function Index() {
  const [ready, setReady] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const [authError, setAuthError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let active = true
    const restore = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        if (!active) return
        setSignedIn(Boolean(data.session))
        setAuthError(false)
      } catch {
        if (!active) return
        // Do not mistake a temporary auth/storage outage for a signed-out user.
        setAuthError(true)
      } finally {
        if (active) setReady(true)
      }
    }
    void restore()
    return () => { active = false }
  }, [retryCount])

  if (!ready) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1473e6" />
        <Text style={styles.message}>Loading DadConnect…</Text>
      </View>
    )
  }

  if (authError) {
    return (
      <View style={styles.center}>
        <Text accessibilityRole="alert" style={styles.message}>
          We couldn't check your session. Your account hasn't been signed out.
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Retry DadConnect sign in check"
          style={styles.retry}
          onPress={() => {
            setReady(false)
            setRetryCount(value => value + 1)
          }}
        >
          <Text style={styles.retryLabel}>Try again</Text>
        </Pressable>
      </View>
    )
  }

  return <Redirect href={signedIn ? "/(tabs)/feed" : "/sign-in"} />
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 14,
    backgroundColor: "#f4f6f8",
  },
  message: { color: "#24364a", fontSize: 15, textAlign: "center" },
  retry: {
    minHeight: 48,
    borderRadius: 10,
    backgroundColor: "#1473e6",
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  retryLabel: { color: "#fff", fontWeight: "700", fontSize: 16 },
})
