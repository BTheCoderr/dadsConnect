import React, { useEffect, useState } from "react"
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import * as Linking from "expo-linking"
import { useRouter } from "expo-router"
import { supabase } from "../lib/supabase"

export default function ResetPasswordScreen() {
  const router = useRouter()
  const link = Linking.useURL()
  const [ready, setReady] = useState(false)
  const [checking, setChecking] = useState(true)
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!link) return
    let active = true
    const acceptLink = async () => {
      try {
        const parsed = new URL(link)
        const params = new URLSearchParams(parsed.search)
        const hash = new URLSearchParams(parsed.hash.startsWith("#") ? parsed.hash.slice(1) : parsed.hash)
        const error = params.get("error_description") || hash.get("error_description")
        if (error) throw new Error(error)
        const code = params.get("code")
        const accessToken = hash.get("access_token") || params.get("access_token")
        const refreshToken = hash.get("refresh_token") || params.get("refresh_token")
        if (code) {
          const result = await supabase.auth.exchangeCodeForSession(code)
          if (result.error) throw result.error
        } else if (accessToken && refreshToken) {
          const result = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
          if (result.error) throw result.error
        } else {
          throw new Error("This reset link is invalid or expired. Request a new link.")
        }
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) throw new Error("Could not verify the reset session.")
        if (active) setReady(true)
      } catch (error) {
        if (active) Alert.alert("Reset link problem", error instanceof Error ? error.message : "Request a new link.")
      } finally {
        if (active) setChecking(false)
      }
    }
    void acceptLink()
    return () => { active = false }
  }, [link])

  const save = async () => {
    if (!ready) return
    if (password.length < 8) return Alert.alert("Password too short", "Use at least 8 characters.")
    if (password !== confirm) return Alert.alert("Passwords don't match", "Try entering them again.")
    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      await supabase.auth.signOut()
      Alert.alert("Password updated", "Sign in using your new password.", [{ text: "Sign in", onPress: () => router.replace("/sign-in") }])
    } catch (error) {
      Alert.alert("Could not reset password", error instanceof Error ? error.message : "Try again.")
    } finally { setSaving(false) }
  }

  return <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.page}>
    <View style={styles.card}>
      <Text style={styles.title}>Choose a new password</Text>
      <Text style={styles.note}>{checking ? "Checking reset link…" : ready ? "Enter your new DadConnect password." : "This reset link could not be verified. You can request a new one."}</Text>
      {ready ? <>
        <TextInput style={styles.field} value={password} onChangeText={setPassword} placeholder="New password (8+ characters)" secureTextEntry autoComplete="new-password" />
        <TextInput style={styles.field} value={confirm} onChangeText={setConfirm} placeholder="Confirm new password" secureTextEntry autoComplete="new-password" />
        <TouchableOpacity disabled={saving} onPress={save} style={styles.button}><Text style={styles.buttonText}>{saving ? "Updating…" : "Update password"}</Text></TouchableOpacity>
      </> : null}
      <TouchableOpacity onPress={() => router.replace("/forgot-password")}><Text style={styles.back}>Request another link</Text></TouchableOpacity>
    </View>
  </KeyboardAvoidingView>
}
const styles=StyleSheet.create({
  page:{flex:1,justifyContent:"center",padding:20,backgroundColor:"#f4f6f8"},
  card:{backgroundColor:"white",padding:22,borderRadius:16,gap:14},
  title:{fontSize:25,fontWeight:"800",color:"#17212d"},note:{color:"#667085",lineHeight:20},
  field:{borderWidth:1,borderColor:"#d3dae2",padding:13,borderRadius:10,fontSize:16},
  button:{backgroundColor:"#1473e6",padding:14,borderRadius:10,alignItems:"center"},
  buttonText:{color:"white",fontWeight:"700"},back:{color:"#1473e6",textAlign:"center",fontWeight:"700"},
})
