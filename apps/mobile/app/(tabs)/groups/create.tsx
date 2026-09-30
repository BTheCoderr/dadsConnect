import React, { useMemo, useState } from 'react'
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useRouter } from 'expo-router'
import type { DadGroup } from '@dadconnect/shared'
import { ChatAPI } from '../../../lib/chat-api'

const categories:[DadGroup['category'],string][]=[
  ['support','Support'],
  ['activities','Activities'],
  ['sports','Sports'],
  ['local','Local'],
  ['interests','Interests'],
]

export default function CreateGroupScreen(){
  const router=useRouter()
  const [name,setName]=useState('')
  const [description,setDescription]=useState('')
  const [category,setCategory]=useState<DadGroup['category']>('support')
  const [topicsText,setTopicsText]=useState('')
  const [city,setCity]=useState('')
  const [state,setState]=useState('')
  const [isPrivate,setIsPrivate]=useState(false)
  const [saving,setSaving]=useState(false)

  const topics=useMemo(
    () => topicsText.split(',').map(topic => topic.trim()).filter(Boolean).slice(0,12),
    [topicsText],
  )

  const submit=async () => {
    const trimmedName=name.trim()
    if(trimmedName.length < 2){
      Alert.alert('Add a group name','Use at least 2 characters.')
      return
    }

    setSaving(true)
    try{
      await ChatAPI.createGroup({
        name:trimmedName,
        description:description.trim() || undefined,
        category,
        topics,
        city:city.trim() || undefined,
        state:state.trim() || undefined,
        visibility:isPrivate ? 'private' : 'public',
      })
      Alert.alert('Group created','You are now the owner and first member.',[
        {text:'View groups',onPress:() => router.replace('/(tabs)/groups')},
      ])
    }catch(error){
      Alert.alert('Could not create group',error instanceof Error ? error.message : 'Try again.')
    }finally{
      setSaving(false)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>← Groups</Text></TouchableOpacity>
      <Text style={styles.heading}>Create a group</Text>
      <Text style={styles.subheading}>Build a useful community around a place, activity, parenting stage, or shared interest.</Text>

      <View style={styles.card}>
        <Field label="Group name">
          <TextInput value={name} onChangeText={setName} maxLength={80} placeholder="Providence Dads Outdoors" style={styles.input} />
        </Field>

        <Field label="Description">
          <TextInput value={description} onChangeText={setDescription} multiline maxLength={1000} placeholder="What is this group for?" style={[styles.input,styles.textarea]} />
        </Field>

        <Text style={styles.label}>Category</Text>
        <View style={styles.chips}>
          {categories.map(([value,label]) => (
            <TouchableOpacity key={value} onPress={() => setCategory(value)} style={[styles.chip,category === value && styles.chipActive]}>
              <Text style={[styles.chipText,category === value && styles.chipTextActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Field label="Topics">
          <TextInput value={topicsText} onChangeText={setTopicsText} placeholder="fatherhood, hiking, toddlers" style={styles.input} />
          <Text style={styles.help}>Separate up to 12 topics with commas.</Text>
        </Field>

        <View style={styles.row}>
          <View style={styles.flex}><Field label="City"><TextInput value={city} onChangeText={setCity} placeholder="Optional" style={styles.input} /></Field></View>
          <View style={styles.flex}><Field label="State"><TextInput value={state} onChangeText={setState} placeholder="RI" autoCapitalize="characters" style={styles.input} /></Field></View>
        </View>

        <View style={styles.privacyRow}>
          <View style={styles.flex}>
            <Text style={styles.label}>{isPrivate ? 'Private group' : 'Public group'}</Text>
            <Text style={styles.help}>{isPrivate ? 'Only members can see the group.' : 'Anyone can discover it and signed-in dads can join.'}</Text>
          </View>
          <Switch value={isPrivate} onValueChange={setIsPrivate} />
        </View>

        <TouchableOpacity disabled={saving} onPress={submit} style={[styles.primary,saving && styles.disabled]}>
          <Text style={styles.primaryText}>{saving ? 'Creating…' : 'Create group'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

function Field({label,children}:{label:string;children:React.ReactNode}){
  return <View style={styles.field}><Text style={styles.label}>{label}</Text>{children}</View>
}

const styles=StyleSheet.create({
  container:{flex:1,backgroundColor:'#f5f5f5'},content:{padding:18,paddingBottom:40},back:{color:'#1473e6',fontWeight:'700',marginBottom:16},
  heading:{fontSize:28,fontWeight:'800',color:'#222'},subheading:{color:'#666',lineHeight:20,marginTop:6,marginBottom:18},
  card:{backgroundColor:'white',borderRadius:16,padding:18,gap:16},field:{gap:7},label:{fontSize:13,fontWeight:'700',color:'#333'},
  input:{borderWidth:1,borderColor:'#ddd',borderRadius:10,paddingHorizontal:12,paddingVertical:11,fontSize:15,backgroundColor:'#fff'},
  textarea:{minHeight:100,textAlignVertical:'top'},help:{fontSize:11,color:'#777',marginTop:5},chips:{flexDirection:'row',flexWrap:'wrap',gap:8},
  chip:{borderWidth:1,borderColor:'#d7d7d7',paddingHorizontal:12,paddingVertical:8,borderRadius:18},chipActive:{backgroundColor:'#1473e6',borderColor:'#1473e6'},
  chipText:{fontSize:12,fontWeight:'700',color:'#444'},chipTextActive:{color:'white'},row:{flexDirection:'row',gap:10},flex:{flex:1},
  privacyRow:{flexDirection:'row',alignItems:'center',gap:14,borderTopWidth:1,borderTopColor:'#eee',paddingTop:16},
  primary:{backgroundColor:'#1473e6',padding:14,borderRadius:10,alignItems:'center'},disabled:{opacity:.55},primaryText:{color:'white',fontWeight:'800',fontSize:15},
})
