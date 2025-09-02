import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { Meetup } from '@dadconnect/shared'

export default function MeetupsScreen() {
  const router = useRouter()
  const [meetups, setMeetups] = useState<Meetup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMeetups()
  }, [])

  const loadMeetups = async () => {
    try {
      // TODO: Replace with actual API call
      const mockMeetups: Meetup[] = [
        {
          id: '1',
          title: 'NFL Sunday Watch Party',
          description: 'Come watch the game with fellow dads! Bring snacks and drinks.',
          activityType: 'watch_party',
          location: 'Mike\'s House',
          city: 'Austin',
          state: 'TX',
          startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
          currentAttendees: 5,
          maxAttendees: 12,
          status: 'upcoming',
          createdBy: 'user1',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Dad & Kids Playground Meetup',
          description: 'Bring your kids to the playground for some fun and dad bonding.',
          activityType: 'playdate',
          location: 'Zilker Park Playground',
          city: 'Austin',
          state: 'TX',
          startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
          currentAttendees: 8,
          maxAttendees: 15,
          status: 'upcoming',
          createdBy: 'user2',
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          title: 'Morning Coffee & Support',
          description: 'Weekly coffee meetup for dads to share experiences and support each other.',
          activityType: 'coffee',
          location: 'Local Coffee Shop',
          city: 'Austin',
          state: 'TX',
          startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
          currentAttendees: 12,
          status: 'upcoming',
          createdBy: 'user3',
          createdAt: new Date().toISOString(),
        }
      ]
      setMeetups(mockMeetups)
    } catch (error) {
      console.error('Error loading meetups:', error)
      Alert.alert('Error', 'Failed to load meetups')
    } finally {
      setLoading(false)
    }
  }

  const renderMeetup = ({ item }: { item: Meetup }) => (
    <TouchableOpacity 
      style={styles.meetupCard}
      onPress={() => router.push(`/meetups/${item.id}`)}
    >
      <View style={styles.meetupHeader}>
        <Text style={styles.meetupTitle}>{item.title}</Text>
        <View style={styles.activityTypeBadge}>
          <Text style={styles.activityTypeText}>
            {item.activityType.replace('_', ' ').toUpperCase()}
          </Text>
        </View>
      </View>
      
      <Text style={styles.meetupDescription}>{item.description}</Text>
      
      <View style={styles.meetupDetails}>
        <Text style={styles.meetupLocation}>📍 {item.location}</Text>
        <Text style={styles.meetupTime}>
          🕒 {new Date(item.startTime).toLocaleDateString()} at {new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <Text style={styles.meetupAttendees}>
          👥 {item.currentAttendees}{item.maxAttendees ? `/${item.maxAttendees}` : ''} dads
        </Text>
      </View>
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading meetups...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dad Meetups</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => router.push('/meetups/create')}
        >
          <Text style={styles.createButtonText}>+ Create</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={meetups}
        renderItem={renderMeetup}
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
  meetupCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  meetupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  meetupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  activityTypeBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activityTypeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1976D2',
  },
  meetupDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  meetupDetails: {
    gap: 4,
  },
  meetupLocation: {
    fontSize: 14,
    color: '#333',
  },
  meetupTime: {
    fontSize: 14,
    color: '#333',
  },
  meetupAttendees: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
})
