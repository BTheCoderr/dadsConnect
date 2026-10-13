import React, { useState } from "react"
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useRouter } from "expo-router"
import { supabase } from "../lib/supabase"

export default function ForgotPasswordScreen() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [sending, setSending] = useState(false)
  const submit = async () => {
    const normalized = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      Alert.alert("Enter your email", "Use the email attached to your DadConnect account.")
      return
    }
    setSending(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(normalized, {
        redirectTo: "dadconnect://reset-password",
      })
      if (error) throw error
      Alert.alert("Check your email", "If an account exists for that email, you will receive a password reset link. Follow the link on this phone.", [
        { text: "OK", onPress: () => router.back() },
      ])
    } catch (error) {
      Alert.alert("Could not send reset link", error instanceof Error ? error.message : "Try again.")
    } finally {
      setSending(false)
    }
  }
  return <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.page}>
    <View style={styles.card}>
      <Text style={styles.title}>Reset your password</Text>
      <Text style={styles.note}>We'll email you a secure link that opens DadConnect on your phone.</Text>
      <TextInput style={styles.field} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" placeholder="Email address" />
      <TouchableOpacity disabled={sending} onPress={submit} style={styles.button}><Text style={styles.buttonText}>{sending ? "Sending…" : "Send reset link"}</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>Back to sign in</Text></TouchableOpacity>
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
