import React, { useEffect, useState } from "react"
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useRouter } from "expo-router"
import { ChatAPI } from "../../../lib/chat-api"
import { supabase } from "../../../lib/supabase"

export default function EditProfile() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [interests, setInterests] = useState("")
  const [kidsAges, setKidsAges] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [cityOptIn, setCityOptIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    void ChatAPI.getMe().then(({ profile, privateProfile }) => {
      if (!active) return
      setName(profile?.name ?? "")
      setBio(profile?.bio ?? "")
      setInterests((profile?.interests ?? []).join(", "))
      setKidsAges((privateProfile?.kidsAges ?? []).join(", "))
      setCity(privateProfile?.city ?? "")
      setState(privateProfile?.state ?? "")
      setCityOptIn(privateProfile?.cityOptIn ?? false)
    }).catch(error => {
      if (active) Alert.alert("Could not load profile", error instanceof Error ? error.message : "Try again.")
    }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const save = async () => {
    const displayName = name.trim()
    if (displayName.length < 2 || displayName.length > 80) {
      Alert.alert("Check your name", "Use 2 to 80 characters.")
      return
    }
    const interestList = interests.split(",").map(item => item.trim()).filter(Boolean).slice(0, 12)
    const kidsList = kidsAges.split(",").map(item => item.trim()).filter(Boolean).slice(0, 10)
    if (bio.trim().length > 500 || city.length > 100 || state.length > 50) {
      Alert.alert("Details too long", "Shorten your bio or location.")
      return
    }
    setSaving(true)
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) throw new Error("Please sign in again.")
      const publicUpdate = await supabase.from("profiles").update({
        name: displayName, bio: bio.trim() || null, interests: interestList,
      }).eq("id", user.id).select("id").single()
      if (publicUpdate.error) throw publicUpdate.error

      // Family stage and location stay in the owner-only RLS table.
      const privateUpdate = await supabase.from("profile_private").upsert({
        user_id: user.id,
        kids_ages: kidsList,
        city: city.trim() || null,
        state: state.trim() || null,
        city_opt_in: Boolean(cityOptIn && city.trim()),
      }, { onConflict: "user_id" }).select("user_id").single()
      if (privateUpdate.error) {
        Alert.alert("Some changes saved", "Your public profile was saved, but the private preferences were not. " + privateUpdate.error.message)
        return
      }
      Alert.alert("Profile updated", "Your changes have been saved.", [
        { text: "Done", onPress: () => router.back() },
      ])
    } catch (error) {
      Alert.alert("Could not save profile", error instanceof Error ? error.message : "Try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
      <Text style={styles.heading}>Edit profile</Text>
      <Text style={styles.note}>Only your name, bio, and interests appear to other dads. Family and location preferences are private.</Text>
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.field} value={name} onChangeText={setName} autoCapitalize="words" maxLength={80} editable={!saving && !loading} />
      <Text style={styles.label}>Bio</Text>
      <TextInput style={[styles.field, styles.area]} value={bio} onChangeText={setBio} multiline maxLength={500} editable={!saving && !loading} placeholder="A little about you" />
      <Text style={styles.label}>Interests (comma-separated)</Text>
      <TextInput style={styles.field} value={interests} onChangeText={setInterests} editable={!saving && !loading} placeholder="Outdoors, basketball, parenting" />
      <View style={styles.divider} />
      <Text style={styles.subheading}>Private preferences</Text>
      <Text style={styles.label}>Children's age ranges (comma-separated)</Text>
      <TextInput style={styles.field} value={kidsAges} onChangeText={setKidsAges} editable={!saving && !loading} placeholder="Toddler, school-age" />
      <Text style={styles.label}>City</Text>
      <TextInput style={styles.field} value={city} onChangeText={setCity} editable={!saving && !loading} maxLength={100} />
      <Text style={styles.label}>State</Text>
      <TextInput style={styles.field} value={state} onChangeText={setState} editable={!saving && !loading} maxLength={50} />
      <View style={styles.switchRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Discover local communities</Text>
          <Text style={styles.note}>Your city preference stays in your private profile.</Text>
        </View>
        <Switch value={cityOptIn} onValueChange={setCityOptIn} disabled={saving || loading} />
      </View>
      <TouchableOpacity style={[styles.save, (saving || loading) && styles.disabled]} disabled={saving || loading} onPress={save}>
        <Text style={styles.saveText}>{saving ? "Saving…" : loading ? "Loading…" : "Save changes"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.back()}><Text style={styles.cancel}>Cancel</Text></TouchableOpacity>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  page:{ flex:1, backgroundColor:"#f6f7f9" },body:{ padding:20, paddingBottom:56, gap:10 },
  heading:{ fontSize:27,fontWeight:"800",color:"#17212d" },subheading:{ fontSize:19,fontWeight:"700",color:"#17212d" },
  label:{ fontSize:14,fontWeight:"700",color:"#28323b",marginTop:8 },
  note:{ fontSize:13,lineHeight:19,color:"#667085" },
  field:{ backgroundColor:"white",borderWidth:1,borderColor:"#d9dee6",borderRadius:10,padding:13,fontSize:16,color:"#17212d" },
  area:{ minHeight:96,textAlignVertical:"top" }, divider:{height:1,backgroundColor:"#e2e6eb",marginVertical:8},
  switchRow:{flexDirection:"row",alignItems:"center",gap:10,marginVertical:14},
  save:{ backgroundColor:"#1473e6",borderRadius:10,padding:15,alignItems:"center" },
  saveText:{color:"white",fontWeight:"700"},disabled:{opacity:.5},
  cancel:{textAlign:"center",color:"#1473e6",fontWeight:"700",marginTop:10},
})
