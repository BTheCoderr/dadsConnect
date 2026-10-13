import React, { useState } from "react"
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { supabase } from "../../../lib/supabase"

type Reason = "harassment" | "spam" | "unsafe" | "other"
const reasons: [Reason, string][] = [
  ["harassment", "Harassment or bullying"], ["spam", "Spam or scams"],
  ["unsafe", "Threats or unsafe behavior"], ["other", "Other"],
]

export default function ReportMessage() {
  const router = useRouter()
  const { messageId, groupId, reportedUserId } = useLocalSearchParams<{
    messageId?: string; groupId?: string; reportedUserId?: string
  }>()
  const [reason, setReason] = useState<Reason>("harassment")
  const [details, setDetails] = useState("")
  const [sending, setSending] = useState(false)

  const submit = async () => {
    if (!messageId || !groupId || !reportedUserId || sending) {
      Alert.alert("Cannot report", "Return to group chat and choose a message.")
      return
    }
    setSending(true)
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) throw new Error("Sign in again before reporting.")
      if (user.id === reportedUserId) throw new Error("You cannot report your own message.")
      const response = await supabase.from("safety_reports").insert({
        reporter_id: user.id, group_id: groupId,
        message_id: messageId, reported_user_id: reportedUserId,
        reason, details: details.trim() || null,
      })
      if (response.error) throw response.error
      Alert.alert("Report submitted", "Thanks. The report is recorded for a community administrator to review.", [
        { text: "Done", onPress: () => router.back() },
      ])
    } catch (error) {
      Alert.alert("Could not submit report", error instanceof Error ? error.message : "Try again.")
    } finally { setSending(false) }
  }

  return <ScrollView style={styles.page} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <Text style={styles.heading}>Report a message</Text>
    <Text style={styles.note}>Help keep DadConnect useful and respectful. Reports are not visible to the member you report.</Text>
    <Text style={styles.label}>Reason</Text>
    {reasons.map(([value, label]) => <TouchableOpacity key={value} onPress={() => setReason(value)} style={[styles.option, reason === value && styles.active]}>
      <Text style={[styles.optionText, reason === value && styles.activeText]}>{label}</Text>
    </TouchableOpacity>)}
    <Text style={styles.label}>Additional details (optional)</Text>
    <TextInput multiline maxLength={1000} style={styles.details} value={details} onChangeText={setDetails} placeholder="Describe what happened" textAlignVertical="top" />
    <TouchableOpacity disabled={sending} onPress={submit} style={[styles.button,sending && styles.disabled]}>
      <Text style={styles.buttonText}>{sending ? "Submitting…" : "Submit report"}</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => router.back()}><Text style={styles.cancel}>Cancel</Text></TouchableOpacity>
  </ScrollView>
}
const styles=StyleSheet.create({
  page:{flex:1,backgroundColor:"#f6f7f9"},content:{padding:20,gap:12},
  heading:{fontSize:26,fontWeight:"800",color:"#17212d"},
  note:{color:"#667085",lineHeight:20,fontSize:14},label:{fontWeight:"700",color:"#17212d",marginTop:8},
  option:{padding:13,borderRadius:10,backgroundColor:"white",borderWidth:1,borderColor:"#d7dee8"},
  active:{backgroundColor:"#e9f2ff",borderColor:"#1473e6"},optionText:{color:"#334155"},activeText:{color:"#1059af",fontWeight:"700"},
  details:{backgroundColor:"white",borderColor:"#d7dee8",borderWidth:1,borderRadius:10,padding:12,fontSize:16,minHeight:110},
  button:{backgroundColor:"#1473e6",borderRadius:10,padding:14,alignItems:"center"},
  buttonText:{color:"white",fontWeight:"700"},disabled:{opacity:.5},cancel:{textAlign:"center",color:"#1473e6",fontWeight:"700"},
})
