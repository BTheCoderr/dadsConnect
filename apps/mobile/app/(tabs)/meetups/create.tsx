import React, { useEffect, useState } from 'react'
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useRouter } from 'expo-router'
import type { DadGroup, Meetup } from '@dadconnect/shared'
import { ChatAPI } from '../../../lib/chat-api'

const activities:[Meetup['activityType'],string][]=[
  ['coffee','Coffee'],
  ['playdate','Playdate'],
  ['outdoor','Outdoor'],
  ['sports','Sports'],
  ['watch_party','Watch party'],
  ['other','Other'],
]

function localIso(date:string,time:string){
  const candidate=new Date(`${date.trim()}T${time.trim()}:00`)
  return Number.isNaN(candidate.getTime()) ? null : candidate.toISOString()
}

export default function CreateMeetupScreen(){
  const router=useRouter()
  const [groups,setGroups]=useState<DadGroup[]>([])
  const [groupId,setGroupId]=useState<string | null>(null)
  const [title,setTitle]=useState('')
  const [description,setDescription]=useState('')
  const [activityType,setActivityType]=useState<Meetup['activityType']>('coffee')
  const [date,setDate]=useState('')
  const [time,setTime]=useState('')
  const [location,setLocation]=useState('')
  const [address,setAddress]=useState('')
  const [city,setCity]=useState('')
  const [state,setState]=useState('')
  const [maxAttendees,setMaxAttendees]=useState('')
  const [loadingGroups,setLoadingGroups]=useState(true)
  const [saving,setSaving]=useState(false)

  useEffect(() => {
    ;(async () => {
      try{
        const all=await ChatAPI.getGroups()
        setGroups(all.filter(group => group.isMember))
      }catch(error){
        Alert.alert('Could not load your groups',error instanceof Error ? error.message : 'You can still create a standalone meetup.')
      }finally{
        setLoadingGroups(false)
      }
    })()
  },[])

  const submit=async () => {
    const startTime=localIso(date,time)
    if(title.trim().length < 2){
      Alert.alert('Add a title','Use at least 2 characters.')
      return
    }
    if(!startTime || new Date(startTime) <= new Date()){
      Alert.alert('Check the date and time','Use YYYY-MM-DD for the date and 24-hour HH:MM for a future time.')
      return
    }

    const parsedMax=maxAttendees.trim() ? Number(maxAttendees) : null
    if(parsedMax !== null && (!Number.isInteger(parsedMax) || parsedMax < 1 || parsedMax > 10000)){
      Alert.alert('Check capacity','Capacity must be a whole number between 1 and 10,000.')
      return
    }

    setSaving(true)
    try{
      await ChatAPI.createMeetup({
        title:title.trim(),
        description:description.trim() || undefined,
        activityType,
        startTime,
        location:location.trim() || undefined,
        address:address.trim() || undefined,
        city:city.trim() || undefined,
        state:state.trim() || undefined,
        maxAttendees:parsedMax,
        groupId,
      })
      Alert.alert('Meetup created','You are marked Going automatically.',[
        {text:'View meetups',onPress:() => router.replace('/(tabs)/meetups')},
      ])
    }catch(error){
      Alert.alert('Could not create meetup',error instanceof Error ? error.message : 'Try again.')
    }finally{
      setSaving(false)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>← Meetups</Text></TouchableOpacity>
      <Text style={styles.heading}>Create a meetup</Text>
      <Text style={styles.subheading}>Make the plan concrete enough that dads can decide whether they can actually show up.</Text>

      <View style={styles.card}>
        <Field label="Title"><TextInput value={title} onChangeText={setTitle} maxLength={120} placeholder="Saturday park meetup" style={styles.input} /></Field>
        <Field label="Description"><TextInput value={description} onChangeText={setDescription} multiline placeholder="What should people know?" style={[styles.input,styles.textarea]} /></Field>

        <Text style={styles.label}>Activity</Text>
        <View style={styles.chips}>
          {activities.map(([value,label]) => (
            <TouchableOpacity key={value} onPress={() => setActivityType(value)} style={[styles.chip,activityType === value && styles.chipActive]}>
              <Text style={[styles.chipText,activityType === value && styles.chipTextActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Group</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.groupScroller}>
          <TouchableOpacity onPress={() => setGroupId(null)} style={[styles.chip,groupId === null && styles.chipActive]}>
            <Text style={[styles.chipText,groupId === null && styles.chipTextActive]}>Standalone</Text>
          </TouchableOpacity>
          {groups.map(group => (
            <TouchableOpacity key={group.id} onPress={() => setGroupId(group.id)} style={[styles.chip,groupId === group.id && styles.chipActive]}>
              <Text style={[styles.chipText,groupId === group.id && styles.chipTextActive]}>{group.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {loadingGroups ? <Text style={styles.help}>Loading joined groups…</Text> : null}

        <View style={styles.row}>
          <View style={styles.flex}><Field label="Date"><TextInput value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" keyboardType="numbers-and-punctuation" style={styles.input} /></Field></View>
          <View style={styles.flex}><Field label="Time"><TextInput value={time} onChangeText={setTime} placeholder="HH:MM" keyboardType="numbers-and-punctuation" style={styles.input} /></Field></View>
        </View>

        <Field label="Venue / place"><TextInput value={location} onChangeText={setLocation} placeholder="Park, cafe, gym…" style={styles.input} /></Field>
        <Field label="Address"><TextInput value={address} onChangeText={setAddress} placeholder="Optional exact address" style={styles.input} /></Field>
        <View style={styles.row}>
          <View style={styles.flex}><Field label="City"><TextInput value={city} onChangeText={setCity} placeholder="Optional" style={styles.input} /></Field></View>
          <View style={styles.flex}><Field label="State"><TextInput value={state} onChangeText={setState} placeholder="RI" autoCapitalize="characters" style={styles.input} /></Field></View>
        </View>
        <Field label="Max going"><TextInput value={maxAttendees} onChangeText={setMaxAttendees} keyboardType="number-pad" placeholder="Optional" style={styles.input} /></Field>

        <TouchableOpacity disabled={saving} onPress={submit} style={[styles.primary,saving && styles.disabled]}>
          <Text style={styles.primaryText}>{saving ? 'Creating…' : 'Create meetup'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

function Field({label,children}:{label:string;children:any}){
  return <View style={styles.field}><Text style={styles.label}>{label}</Text>{children}</View>
}

const styles=StyleSheet.create({
  container:{flex:1,backgroundColor:'#f5f5f5'},content:{padding:18,paddingBottom:40},back:{color:'#1473e6',fontWeight:'700',marginBottom:16},
  heading:{fontSize:28,fontWeight:'800',color:'#222'},subheading:{color:'#666',lineHeight:20,marginTop:6,marginBottom:18},card:{backgroundColor:'white',borderRadius:16,padding:18,gap:16},
  field:{gap:7},label:{fontSize:13,fontWeight:'700',color:'#333'},input:{borderWidth:1,borderColor:'#ddd',borderRadius:10,paddingHorizontal:12,paddingVertical:11,fontSize:15,backgroundColor:'#fff'},
  textarea:{minHeight:100,textAlignVertical:'top'},chips:{flexDirection:'row',flexWrap:'wrap',gap:8},groupScroller:{gap:8,paddingRight:12},
  chip:{borderWidth:1,borderColor:'#d7d7d7',paddingHorizontal:12,paddingVertical:8,borderRadius:18},chipActive:{backgroundColor:'#1473e6',borderColor:'#1473e6'},
  chipText:{fontSize:12,fontWeight:'700',color:'#444'},chipTextActive:{color:'white'},help:{fontSize:11,color:'#777'},row:{flexDirection:'row',gap:10},flex:{flex:1},
  primary:{backgroundColor:'#1473e6',padding:14,borderRadius:10,alignItems:'center'},disabled:{opacity:.55},primaryText:{color:'white',fontWeight:'800',fontSize:15},
})
