import React, { useState } from "react"
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useRouter } from "expo-router"
import { request } from "../../../lib/api"
import { supabase } from "../../../lib/supabase"

export default function DeleteAccount() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmation, setConfirmation] = useState("")
  const [deleting, setDeleting] = useState(false)

  const deleteAccount = () => {
    if (password.length < 8 || confirmation !== "DELETE" || deleting) return
    Alert.alert("Permanently delete account?", "This cannot be undone. Your groups, meetups and messages may be deleted, affecting other members.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete permanently", style: "destructive", onPress: async () => {
        setDeleting(true)
        try {
          await request<{ success: boolean }>("/api/account/delete", {
            method: "POST", body: JSON.stringify({ password, confirmation: "DELETE" }),
          })
          setPassword("")
          await supabase.auth.signOut()
          Alert.alert("Account deleted", "Your DadConnect account has been deleted.", [
            { text: "OK", onPress: () => router.replace("/sign-in") },
          ])
        } catch (error) {
          Alert.alert("Deletion not completed", error instanceof Error ? error.message : "Try again or contact support.")
        } finally {
          setDeleting(false)
        }
      }},
    ])
  }
  const canDelete = !deleting && password.length >= 8 && confirmation === "DELETE"

  return <ScrollView style={styles.page} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <Text style={styles.title}>Delete your account</Text>
    <Text style={styles.warning}>This permanently removes your DadConnect login, profile and personal content. Groups and meetups you created may also be removed for other members. This action cannot be reversed.</Text>
    <Text style={styles.label}>Confirm your password</Text>
    <TextInput style={styles.field} value={password} onChangeText={setPassword} secureTextEntry autoComplete="current-password" placeholder="Account password" editable={!deleting} />
    <Text style={styles.label}>Type DELETE to confirm</Text>
    <TextInput style={styles.field} value={confirmation} onChangeText={setConfirmation} autoCapitalize="characters" autoCorrect={false} placeholder="DELETE" editable={!deleting} />
    <TouchableOpacity disabled={!canDelete} onPress={deleteAccount} style={[styles.delete, !canDelete && styles.disabled]}>
      <Text style={styles.deleteText}>{deleting ? "Deleting account…" : "Permanently delete my account"}</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => router.back()} disabled={deleting}><Text style={styles.cancel}>Keep my account</Text></TouchableOpacity>
  </ScrollView>
}
const styles=StyleSheet.create({
  page:{flex:1,backgroundColor:"#f6f7f9"},content:{padding:20,paddingTop:30,gap:15},
  title:{fontSize:27,fontWeight:"800",color:"#17212d"},
  warning:{backgroundColor:"#fff0f1",padding:16,borderRadius:10,color:"#7c202b",fontSize:15,lineHeight:22},
  label:{fontSize:14,fontWeight:"700",color:"#334155"},
  field:{backgroundColor:"white",borderWidth:1,borderColor:"#d4dbe4",borderRadius:10,padding:14,fontSize:16},
  delete:{backgroundColor:"#be2937",borderRadius:10,padding:15,alignItems:"center"},disabled:{opacity:.4},
  deleteText:{color:"white",fontWeight:"700",textAlign:"center"},cancel:{textAlign:"center",color:"#1473e6",fontWeight:"700"},
})
