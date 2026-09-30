import React, { useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native'
import { useFocusEffect, useRouter } from 'expo-router'
import type { Meetup, MeetupAttendee } from '@dadconnect/shared'
import { ChatAPI } from '../../../lib/chat-api'

export default function MeetupsScreen() {
  const router = useRouter()
  const [meetups, setMeetups] = useState<Meetup[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  const loadMeetups = async () => {
    try {
      setMeetups(await ChatAPI.getMeetups())
    } catch (error) {
      Alert.alert('Could not load meetups', error instanceof Error ? error.message : 'Try again.')
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      void loadMeetups()
    }, []),
  )

  const rsvp = async (meetup: Meetup, status: MeetupAttendee['status']) => {
    setSaving(meetup.id)
    try {
      const result = await ChatAPI.rsvp(meetup.id, status)
      setMeetups(current => current.map(item => item.id === meetup.id ? { ...item, userRsvp: status, currentAttendees: result.currentAttendees } : item))
    } catch (error) {
      Alert.alert('Could not update RSVP', error instanceof Error ? error.message : 'Try again.')
    } finally {
      setSaving(null)
    }
  }

  const renderMeetup = ({ item }: { item: Meetup }) => {
    const full = item.maxAttendees != null && item.currentAttendees >= item.maxAttendees
    return (
      <View style={styles.card}>
        <Text style={styles.type}>{item.activityType.replace('_', ' ').toUpperCase()}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description || 'No description yet.'}</Text>
        <Text style={styles.meta}>🗓 {new Date(item.startTime).toLocaleString()}</Text>
        {(item.location || item.city) && <Text style={styles.meta}>📍 {[item.location, item.city, item.state].filter(Boolean).join(' · ')}</Text>}
        <Text style={styles.attendees}>👥 {item.currentAttendees}{item.maxAttendees ? `/${item.maxAttendees}` : ''} going</Text>
        <View style={styles.actions}>
          {([['going','Going'],['maybe','Maybe'],['not_going',"Can't go"]] as [MeetupAttendee['status'], string][]).map(([status,label]) => (
            <TouchableOpacity key={status} style={[styles.rsvp, item.userRsvp === status && styles.rsvpActive]}
              disabled={saving === item.id || (status === 'going' && full && item.userRsvp !== 'going')}
              onPress={() => rsvp(item,status)}>
              <Text style={[styles.rsvpText,item.userRsvp === status && styles.rsvpTextActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerCopy}><Text style={styles.heading}>Dad Meetups</Text><Text style={styles.subtitle}>Plans and RSVPs from the live DadConnect backend</Text></View>
        <TouchableOpacity style={styles.createButton} onPress={() => router.push('/(tabs)/meetups/create')}><Text style={styles.createButtonText}>+ Create</Text></TouchableOpacity>
      </View>
      <FlatList data={meetups} renderItem={renderMeetup} keyExtractor={item => item.id} contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadMeetups} />}
        ListEmptyComponent={!loading ? <Text style={styles.empty}>No upcoming meetups yet.</Text> : null} />
    </View>
  )
}

const styles=StyleSheet.create({
  container:{flex:1,backgroundColor:'#f5f5f5'},header:{padding:18,backgroundColor:'white',borderBottomWidth:1,borderBottomColor:'#e5e5e5',flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12},headerCopy:{flex:1},createButton:{backgroundColor:'#1473e6',paddingHorizontal:13,paddingVertical:9,borderRadius:9},createButtonText:{color:'white',fontWeight:'800',fontSize:12},
  heading:{fontSize:26,fontWeight:'700',color:'#222'},subtitle:{marginTop:4,color:'#666'},list:{padding:16,gap:12},card:{backgroundColor:'white',padding:16,borderRadius:14},
  type:{fontSize:11,fontWeight:'700',color:'#1473e6'},title:{fontSize:18,fontWeight:'700',marginTop:4,color:'#222'},description:{fontSize:14,color:'#555',marginTop:8,lineHeight:20},
  meta:{fontSize:13,color:'#666',marginTop:8},attendees:{fontSize:13,fontWeight:'600',color:'#1473e6',marginTop:8},actions:{flexDirection:'row',gap:6,marginTop:14},
  rsvp:{flex:1,borderWidth:1,borderColor:'#d5d5d5',paddingVertical:9,borderRadius:8,alignItems:'center'},rsvpActive:{backgroundColor:'#1473e6',borderColor:'#1473e6'},
  rsvpText:{fontSize:12,fontWeight:'600',color:'#444'},rsvpTextActive:{color:'white'},empty:{textAlign:'center',padding:40,color:'#777'}
})
