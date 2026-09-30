import React, { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { DadGroup, GroupMessage } from '@dadconnect/shared'
import { ChatAPI } from '../../../lib/chat-api'
import { supabase } from '../../../lib/supabase'

const LAST_GROUP_KEY='dadconnect:last-chat-group'

export default function ChatScreen() {
  const [groups,setGroups]=useState<DadGroup[]>([])
  const [selectedGroup,setSelectedGroup]=useState<DadGroup | null>(null)
  const [messages,setMessages]=useState<GroupMessage[]>([])
  const [newMessage,setNewMessage]=useState('')
  const [loading,setLoading]=useState(true)
  const [sending,setSending]=useState(false)
  const listRef=useRef<FlatList<GroupMessage> | null>(null)

  const loadGroups=async () => {
    try{
      const all=await ChatAPI.getGroups()
      const joined=all.filter(group => group.isMember)
      setGroups(joined)
      const savedId=await AsyncStorage.getItem(LAST_GROUP_KEY)
      if(savedId && !selectedGroup){
        const saved=joined.find(group => group.id === savedId)
        if(saved) await openGroup(saved)
      }
    }catch(error){
      Alert.alert('Could not load chats',error instanceof Error ? error.message : 'Try again.')
    }finally{
      setLoading(false)
    }
  }

  const loadMessages=async (groupId:string) => {
    const next=await ChatAPI.getMessages(groupId)
    setMessages(next)
  }

  const openGroup=async (group:DadGroup) => {
    setSelectedGroup(group)
    await AsyncStorage.setItem(LAST_GROUP_KEY,group.id)
    try{
      await loadMessages(group.id)
    }catch(error){
      Alert.alert('Could not open chat',error instanceof Error ? error.message : 'Try again.')
    }
  }

  useEffect(() => { void loadGroups() },[])

  useEffect(() => {
    if(!selectedGroup) return
    const channel=supabase
      .channel(`mobile-group-chat-${selectedGroup.id}`)
      .on('postgres_changes',{
        event:'INSERT',
        schema:'public',
        table:'group_messages',
        filter:`group_id=eq.${selectedGroup.id}`,
      },() => { void loadMessages(selectedGroup.id) })
      .subscribe()

    return () => { void supabase.removeChannel(channel) }
  },[selectedGroup?.id])

  useEffect(() => {
    if(messages.length) requestAnimationFrame(() => listRef.current?.scrollToEnd({animated:true}))
  },[messages])

  const sendMessage=async () => {
    const content=newMessage.trim()
    if(!content || !selectedGroup || sending) return
    setSending(true)
    try{
      const message=await ChatAPI.sendMessage(selectedGroup.id,content)
      setMessages(current => current.some(item => item.id === message.id) ? current : [...current,message])
      setNewMessage('')
    }catch(error){
      Alert.alert('Could not send message',error instanceof Error ? error.message : 'Try again.')
    }finally{
      setSending(false)
    }
  }

  if(loading) return <View style={styles.center}><Text>Loading chats…</Text></View>

  if(!selectedGroup){
    return (
      <View style={styles.container}>
        <View style={styles.header}><Text style={styles.heading}>Group Chat</Text><Text style={styles.subheading}>Only groups you joined appear here.</Text></View>
        <FlatList data={groups} keyExtractor={item => item.id} contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>Join a group first to start chatting.</Text>}
          renderItem={({item}) => (
            <TouchableOpacity style={styles.groupCard} onPress={() => openGroup(item)}>
              <Text style={styles.groupName}>{item.name}</Text>
              <Text style={styles.groupMeta}>{item.memberCount} members · {item.topics.slice(0,2).join(', ') || 'community'}</Text>
            </TouchableOpacity>
          )} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={() => {setSelectedGroup(null);setMessages([])}}><Text style={styles.back}>← Groups</Text></TouchableOpacity>
        <View><Text style={styles.chatTitle}>{selectedGroup.name}</Text><Text style={styles.groupMeta}>{selectedGroup.memberCount} members</Text></View>
      </View>
      <FlatList ref={listRef} data={messages} keyExtractor={item => item.id} contentContainerStyle={styles.messages}
        ListEmptyComponent={<Text style={styles.empty}>No messages yet. Start the conversation.</Text>}
        renderItem={({item}) => (
          <View style={styles.message}>
            {item.author?.name ? <Text style={styles.author}>{item.author.name}</Text> : null}
            <Text style={styles.messageText}>{item.content}</Text>
            <Text style={styles.time}>{new Date(item.createdAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</Text>
          </View>
        )} />
      <View style={styles.composer}>
        <TextInput value={newMessage} onChangeText={setNewMessage} placeholder="Message the group…" multiline maxLength={4000} style={styles.input} />
        <TouchableOpacity onPress={sendMessage} disabled={sending || !newMessage.trim()} style={[styles.send,(sending || !newMessage.trim()) && styles.sendDisabled]}>
          <Text style={styles.sendText}>{sending ? '…' : 'Send'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles=StyleSheet.create({
  container:{flex:1,backgroundColor:'#f5f5f5'},center:{flex:1,alignItems:'center',justifyContent:'center'},header:{padding:18,backgroundColor:'white',borderBottomWidth:1,borderBottomColor:'#e5e5e5'},
  heading:{fontSize:26,fontWeight:'700',color:'#222'},subheading:{marginTop:4,color:'#666'},list:{padding:16,gap:10},groupCard:{backgroundColor:'white',padding:16,borderRadius:12},
  groupName:{fontSize:17,fontWeight:'700',color:'#222'},groupMeta:{fontSize:12,color:'#777',marginTop:4},chatHeader:{flexDirection:'row',alignItems:'center',gap:16,padding:16,backgroundColor:'white',borderBottomWidth:1,borderBottomColor:'#e5e5e5'},
  back:{color:'#1473e6',fontWeight:'600'},chatTitle:{fontSize:18,fontWeight:'700',color:'#222'},messages:{padding:16,gap:10},message:{alignSelf:'flex-start',maxWidth:'85%',backgroundColor:'white',padding:12,borderRadius:12},
  author:{fontSize:12,fontWeight:'700',color:'#1473e6',marginBottom:3},messageText:{fontSize:15,color:'#222'},time:{fontSize:10,color:'#888',marginTop:5},
  composer:{flexDirection:'row',alignItems:'flex-end',gap:10,padding:12,backgroundColor:'white',borderTopWidth:1,borderTopColor:'#e5e5e5'},input:{flex:1,borderWidth:1,borderColor:'#ddd',borderRadius:18,paddingHorizontal:14,paddingVertical:10,maxHeight:110},
  send:{backgroundColor:'#1473e6',paddingHorizontal:16,paddingVertical:11,borderRadius:18},sendDisabled:{opacity:.45},sendText:{color:'white',fontWeight:'700'},empty:{textAlign:'center',padding:40,color:'#777'}
})
