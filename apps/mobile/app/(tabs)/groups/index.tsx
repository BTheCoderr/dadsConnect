import React, { useState } from 'react'

import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native'
import { useFocusEffect, useRouter } from 'expo-router'
import type { DadGroup } from '@dadconnect/shared'
import { ChatAPI } from '../../../lib/chat-api'

export default function GroupsScreen() {
  const router = useRouter()
  const [groups, setGroups] = useState<DadGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState<string | null>(null)

  const loadGroups = async () => {
    try {
      setGroups(await ChatAPI.getGroups())
    } catch (error) {
      Alert.alert('Could not load groups', error instanceof Error ? error.message : 'Try again.')
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      void loadGroups()
    }, []),
  )

  const joinGroup = async (groupId: string) => {
    setJoining(groupId)
    try {
      await ChatAPI.joinGroup(groupId)
      await loadGroups()
    } catch (error) {
      Alert.alert('Could not join group', error instanceof Error ? error.message : 'Try again.')
    } finally {
      setJoining(null)
    }
  }

  const renderGroup = ({ item }: { item: DadGroup }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.grow}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.meta}>{item.category.toUpperCase()}{item.city ? ` · ${item.city}${item.state ? `, ${item.state}` : ''}` : ''}</Text>
        </View>
        <View style={styles.count}><Text style={styles.countNumber}>{item.memberCount}</Text><Text style={styles.countLabel}>members</Text></View>
      </View>
      <Text style={styles.description}>{item.description || 'No description yet.'}</Text>
      <View style={styles.tags}>{item.topics.slice(0, 4).map(topic => <Text key={topic} style={styles.tag}>{topic}</Text>)}</View>
      {item.isMember ? (
        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/(tabs)/chat')}>
          <Text style={styles.secondaryText}>Open group chat</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.primaryButton} disabled={joining === item.id || item.visibility === 'private'} onPress={() => joinGroup(item.id)}>
          <Text style={styles.primaryText}>{joining === item.id ? 'Joining…' : item.visibility === 'private' ? 'Private group' : 'Join group'}</Text>
        </TouchableOpacity>
      )}
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>Dad Groups</Text>
          <Text style={styles.subtitle}>Real communities from your DadConnect account</Text>
        </View>
        <TouchableOpacity style={styles.createButton} onPress={() => router.push('/(tabs)/groups/create')}>
          <Text style={styles.createButtonText}>+ Create</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={groups}
        renderItem={renderGroup}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadGroups} />}
        ListEmptyComponent={!loading ? <Text style={styles.empty}>No groups yet.</Text> : null}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#f5f5f5'},header:{padding:18,backgroundColor:'white',borderBottomWidth:1,borderBottomColor:'#e5e5e5',flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12},headerCopy:{flex:1},createButton:{backgroundColor:'#1473e6',paddingHorizontal:13,paddingVertical:9,borderRadius:9},createButtonText:{color:'white',fontWeight:'800',fontSize:12},
  title:{fontSize:26,fontWeight:'700',color:'#222'},subtitle:{marginTop:4,color:'#666'},list:{padding:16,gap:12},card:{backgroundColor:'white',padding:16,borderRadius:14},
  row:{flexDirection:'row',gap:12},grow:{flex:1},name:{fontSize:18,fontWeight:'700',color:'#222'},meta:{fontSize:12,color:'#667085',marginTop:4},
  count:{alignItems:'center'},countNumber:{fontSize:20,fontWeight:'700',color:'#1473e6'},countLabel:{fontSize:10,color:'#777'},
  description:{fontSize:14,lineHeight:20,color:'#555',marginTop:12},tags:{flexDirection:'row',flexWrap:'wrap',gap:6,marginVertical:14},
  tag:{fontSize:12,color:'#1769aa',backgroundColor:'#eaf3ff',paddingHorizontal:8,paddingVertical:4,borderRadius:12},
  primaryButton:{backgroundColor:'#1473e6',padding:12,borderRadius:9,alignItems:'center'},primaryText:{color:'white',fontWeight:'700'},
  secondaryButton:{borderWidth:1,borderColor:'#1473e6',padding:12,borderRadius:9,alignItems:'center'},secondaryText:{color:'#1473e6',fontWeight:'700'},
  empty:{textAlign:'center',padding:40,color:'#777'}
})
