import React, { useEffect, useState } from 'react'
import { View,Text,StyleSheet,ScrollView,TouchableOpacity,Alert,RefreshControl } from 'react-native'
import { useRouter } from 'expo-router'
import { ChatAPI } from '../../../lib/chat-api'
import { supabase } from '../../../lib/supabase'

type Me=Awaited<ReturnType<typeof ChatAPI.getMe>>

export default function ProfileScreen(){
  const router=useRouter()
  const [me,setMe]=useState<Me | null>(null)
  const [loading,setLoading]=useState(true)

  const load=async () => {
    try{
      setMe(await ChatAPI.getMe())
    }catch(error){
      Alert.alert('Could not load profile',error instanceof Error ? error.message : 'Try again.')
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => { void load() },[])

  const logout=() => {
    Alert.alert('Sign out','Sign out of DadConnect?',[
      {text:'Cancel',style:'cancel'},
      {text:'Sign out',style:'destructive',onPress:async () => {
        await supabase.auth.signOut()
        router.replace('/sign-in')
      }},
    ])
  }

  const profile=me?.profile
  const privateProfile=me?.privateProfile
  if(!profile && loading) return <View style={styles.center}><Text>Loading profile…</Text></View>
  if(!profile) return <View style={styles.center}><Text>Sign in to view your DadConnect profile.</Text></View>

  const initials=profile.name.split(' ').map(part => part[0]).join('').slice(0,2).toUpperCase()

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}>
      <View style={styles.header}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{initials || 'DC'}</Text></View>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.bio}>{profile.bio || 'DadConnect member'}</Text>
      </View>

      <View style={styles.stats}>
        {([['Groups',me?.stats.groups || 0],['Meetups',me?.stats.meetups || 0],['Discussions',me?.stats.discussions || 0]] as [string,number][]).map(([label,value]) => (
          <View key={label} style={styles.stat}><Text style={styles.statNumber}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>
        ))}
      </View>

      <View style={styles.section}><Text style={styles.sectionTitle}>Interests</Text><View style={styles.tags}>{profile.interests.length ? profile.interests.map(item => <Text key={item} style={styles.tag}>{item}</Text>) : <Text style={styles.muted}>No interests yet.</Text>}</View></View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Private preferences</Text>
        <Text style={styles.muted}>Family stage: {privateProfile?.kidsAges.length ? privateProfile.kidsAges.join(', ') : 'Not added'}</Text>
        <Text style={styles.muted}>Location: {privateProfile?.city ? `${privateProfile.city}${privateProfile.state ? `, ${privateProfile.state}` : ''}` : 'Not added'}</Text>
        <Text style={styles.note}>These stay in your self-only profile record.</Text>
      </View>

      <View style={styles.section}><TouchableOpacity style={styles.logout} onPress={logout}><Text style={styles.logoutText}>Sign out</Text></TouchableOpacity></View>
    </ScrollView>
  )
}

const styles=StyleSheet.create({
  container:{flex:1,backgroundColor:'#f5f5f5'},center:{flex:1,alignItems:'center',justifyContent:'center',padding:24},header:{backgroundColor:'white',alignItems:'center',padding:24},
  avatar:{width:82,height:82,borderRadius:41,backgroundColor:'#1473e6',alignItems:'center',justifyContent:'center'},avatarText:{color:'white',fontSize:26,fontWeight:'700'},
  name:{fontSize:24,fontWeight:'700',marginTop:12,color:'#222'},bio:{textAlign:'center',color:'#666',marginTop:6,lineHeight:20},stats:{flexDirection:'row',backgroundColor:'white',marginTop:10,padding:18,justifyContent:'space-around'},
  stat:{alignItems:'center'},statNumber:{fontSize:22,fontWeight:'700',color:'#1473e6'},statLabel:{fontSize:11,color:'#777',marginTop:3},section:{backgroundColor:'white',padding:18,marginTop:10},
  sectionTitle:{fontSize:17,fontWeight:'700',marginBottom:12,color:'#222'},tags:{flexDirection:'row',flexWrap:'wrap',gap:7},tag:{backgroundColor:'#eaf3ff',color:'#1769aa',paddingHorizontal:9,paddingVertical:5,borderRadius:14,fontSize:12},
  muted:{color:'#666',marginBottom:5},note:{fontSize:11,color:'#888',marginTop:8},logout:{backgroundColor:'#d93838',padding:12,borderRadius:9,alignItems:'center'},logoutText:{color:'white',fontWeight:'700'}
})
