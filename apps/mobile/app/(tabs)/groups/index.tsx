import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { DadGroup } from '@dadconnect/shared'

export default function GroupsScreen() {
  const router = useRouter()
  const [groups, setGroups] = useState<DadGroup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGroups()
  }, [])

  const loadGroups = async () => {
    try {
      // TODO: Replace with actual API call
      const mockGroups: DadGroup[] = [
        {
          id: '1',
          name: 'Austin Dads Support',
          description: 'Support group for dads in Austin area. Share experiences, get advice, and build friendships.',
          category: 'support',
          topics: ['parenting', 'support', 'local'],
          city: 'Austin',
          state: 'TX',
          visibility: 'public',
          memberCount: 24,
          createdBy: 'user1',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Football Dads',
          description: 'Dads who love football and watching games together. Join us for watch parties and game discussions!',
          category: 'sports',
          topics: ['football', 'sports', 'watch parties'],
          visibility: 'public',
          memberCount: 18,
          createdBy: 'user2',
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'New Dad Network',
          description: 'Support for new dads navigating fatherhood. Ask questions, share tips, and connect with other new dads.',
          category: 'support',
          topics: ['new dad', 'support', 'advice'],
          visibility: 'public',
          memberCount: 32,
          createdBy: 'user3',
          createdAt: new Date().toISOString(),
        },
        {
          id: '4',
          name: 'Outdoor Adventures',
          description: 'Dads who love outdoor activities with their kids. Hiking, camping, fishing, and more!',
          category: 'activities',
          topics: ['outdoor', 'hiking', 'camping', 'fishing'],
          city: 'Austin',
          state: 'TX',
          visibility: 'public',
          memberCount: 15,
          createdBy: 'user4',
          createdAt: new Date().toISOString(),
        },
        {
          id: '5',
          name: 'Tech Dads',
          description: 'Dads working in tech sharing experiences about work-life balance and raising kids in the digital age.',
          category: 'interests',
          topics: ['tech', 'work-life balance', 'digital parenting'],
          visibility: 'public',
          memberCount: 28,
          createdBy: 'user5',
          createdAt: new Date().toISOString(),
        }
      ]
      setGroups(mockGroups)
    } catch (error) {
      console.error('Error loading groups:', error)
      Alert.alert('Error', 'Failed to load groups')
    } finally {
      setLoading(false)
    }
  }

  const joinGroup = async (groupId: string) => {
    try {
      // TODO: Replace with actual API call
      Alert.alert('Success', 'You\'ve joined the group!')
    } catch (error) {
      console.error('Error joining group:', error)
      Alert.alert('Error', 'Failed to join group')
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'support': return '#4CAF50'
      case 'sports': return '#FF9800'
      case 'activities': return '#2196F3'
      case 'local': return '#9C27B0'
      case 'interests': return '#607D8B'
      default: return '#666'
    }
  }

  const renderGroup = ({ item }: { item: DadGroup }) => (
    <View style={styles.groupCard}>
      <View style={styles.groupHeader}>
        <View style={styles.groupInfo}>
          <Text style={styles.groupName}>{item.name}</Text>
          <View style={styles.categoryContainer}>
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
              <Text style={styles.categoryText}>{item.category.toUpperCase()}</Text>
            </View>
            {item.city && (
              <Text style={styles.locationText}>📍 {item.city}, {item.state}</Text>
            )}
          </View>
        </View>
        <View style={styles.memberCount}>
          <Text style={styles.memberCountText}>{item.memberCount}</Text>
          <Text style={styles.memberCountLabel}>members</Text>
        </View>
      </View>
      
      <Text style={styles.groupDescription}>{item.description}</Text>
      
      <View style={styles.topicsContainer}>
        {item.topics.slice(0, 3).map((topic, index) => (
          <View key={index} style={styles.topicTag}>
            <Text style={styles.topicText}>{topic}</Text>
          </View>
        ))}
        {item.topics.length > 3 && (
          <Text style={styles.moreTopicsText}>+{item.topics.length - 3} more</Text>
        )}
      </View>

      <View style={styles.groupActions}>
        <TouchableOpacity 
          style={styles.joinButton}
          onPress={() => joinGroup(item.id)}
        >
          <Text style={styles.joinButtonText}>Join Group</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.chatButton}
          onPress={() => router.push('/chat')}
        >
          <Text style={styles.chatButtonText}>Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading groups...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dad Groups</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => router.push('/groups/create')}
        >
          <Text style={styles.createButtonText}>+ Create</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={groups}
        renderItem={renderGroup}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  groupCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  groupInfo: {
    flex: 1,
    marginRight: 12,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  locationText: {
    fontSize: 12,
    color: '#666',
  },
  memberCount: {
    alignItems: 'center',
  },
  memberCountText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  memberCountLabel: {
    fontSize: 10,
    color: '#666',
  },
  groupDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  topicTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  topicText: {
    fontSize: 12,
    color: '#1976D2',
  },
  moreTopicsText: {
    fontSize: 12,
    color: '#666',
    alignSelf: 'center',
  },
  groupActions: {
    flexDirection: 'row',
    gap: 12,
  },
  joinButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  chatButton: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  chatButtonText: {
    color: '#1976D2',
    fontWeight: '600',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
})
