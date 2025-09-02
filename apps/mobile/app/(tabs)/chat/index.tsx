import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { DadGroup, GroupMessage } from '@dadconnect/shared'
import { ChatAPI } from '../../lib/chat-api'

export default function ChatScreen() {
  const router = useRouter()
  const [groups, setGroups] = useState<DadGroup[]>([])
  const [selectedGroup, setSelectedGroup] = useState<DadGroup | null>(null)
  const [messages, setMessages] = useState<GroupMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [groupMessages, setGroupMessages] = useState<Record<string, GroupMessage[]>>({})
  const [restoredFromStorage, setRestoredFromStorage] = useState(false)

  useEffect(() => {
    loadGroups()
    restoreChatState()
  }, [])

  const loadGroups = async () => {
    try {
      const groups = await ChatAPI.getGroups()
      setGroups(groups)
    } catch (error) {
      console.error('Error loading groups:', error)
      Alert.alert('Error', 'Failed to load groups')
    } finally {
      setLoading(false)
    }
  }

  // Restore chat state from AsyncStorage
  const restoreChatState = async () => {
    try {
      const savedSelectedGroup = await AsyncStorage.getItem('selectedGroup')
      const savedMessages = await AsyncStorage.getItem('chatMessages')
      const savedGroupMessages = await AsyncStorage.getItem('groupMessages')
      
      // Restore group messages
      if (savedGroupMessages) {
        const groupMessages = JSON.parse(savedGroupMessages)
        setGroupMessages(groupMessages)
      }
      
      if (savedSelectedGroup) {
        const group = JSON.parse(savedSelectedGroup)
        setSelectedGroup(group)
        setRestoredFromStorage(true)
        
        if (savedMessages) {
          const messages = JSON.parse(savedMessages)
          setMessages(messages)
        } else {
          // Load messages for the restored group
          await loadMessages(group.id)
        }
      }
    } catch (error) {
      console.error('Error restoring chat state:', error)
    }
  }

  // Save chat state to AsyncStorage
  const saveChatState = async (group: DadGroup | null, messages: GroupMessage[]) => {
    try {
      if (group) {
        await AsyncStorage.setItem('selectedGroup', JSON.stringify(group))
        await AsyncStorage.setItem('chatMessages', JSON.stringify(messages))
        // Also save to group messages for last message display
        setGroupMessages(prev => ({
          ...prev,
          [group.id]: messages
        }))
        await AsyncStorage.setItem('groupMessages', JSON.stringify({
          ...groupMessages,
          [group.id]: messages
        }))
      } else {
        await AsyncStorage.removeItem('selectedGroup')
        await AsyncStorage.removeItem('chatMessages')
      }
    } catch (error) {
      console.error('Error saving chat state:', error)
    }
  }

  // Get last message for a group
  const getLastMessage = (groupId: string): GroupMessage | null => {
    const messages = groupMessages[groupId]
    if (!messages || messages.length === 0) return null
    return messages[messages.length - 1]
  }

  const loadMessages = async (groupId: string) => {
    try {
      const messages = await ChatAPI.getMessages(groupId)
      setMessages(messages)
      // Save messages to AsyncStorage
      await saveChatState(selectedGroup, messages)
    } catch (error) {
      console.error('Error loading messages:', error)
      Alert.alert('Error', 'Failed to load messages')
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedGroup) return

    try {
      const message = await ChatAPI.sendMessage(selectedGroup.id, newMessage.trim())
      
      const updatedMessages = [...messages, message]
      setMessages(updatedMessages)
      setNewMessage('')
      // Save updated messages to AsyncStorage
      await saveChatState(selectedGroup, updatedMessages)
    } catch (error) {
      console.error('Error sending message:', error)
      Alert.alert('Error', 'Failed to send message')
    }
  }

  const renderGroup = ({ item }: { item: DadGroup }) => {
    const lastMessage = getLastMessage(item.id)
    
    return (
      <TouchableOpacity 
        style={[
          styles.groupItem,
          selectedGroup?.id === item.id && styles.selectedGroupItem
        ]}
        onPress={async () => {
          setSelectedGroup(item)
          setRestoredFromStorage(false)
          await loadMessages(item.id)
        }}
      >
        <View style={styles.groupInfo}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupName}>{item.name}</Text>
            {lastMessage && (
              <Text style={styles.lastMessageTime}>
                {new Date(lastMessage.createdAt).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            )}
          </View>
          <Text style={styles.groupDescription}>{item.description}</Text>
          {lastMessage ? (
            <Text style={styles.lastMessage} numberOfLines={1}>
              {lastMessage.content}
            </Text>
          ) : (
            <Text style={styles.groupMembers}>{item.memberCount} members</Text>
          )}
        </View>
      </TouchableOpacity>
    )
  }

  const renderMessage = ({ item }: { item: GroupMessage }) => (
    <View style={styles.messageContainer}>
      <Text style={styles.messageContent}>{item.content}</Text>
      <Text style={styles.messageTime}>
        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
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
      {!selectedGroup ? (
        <View style={styles.groupsContainer}>
          <Text style={styles.title}>Choose a Group to Chat</Text>
          <FlatList
            data={groups}
            renderItem={renderGroup}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.groupsList}
          />
        </View>
      ) : (
        <View style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={async () => {
              setSelectedGroup(null)
              setRestoredFromStorage(false)
              await saveChatState(null, [])
            }}>
              <Text style={styles.backButton}>← Back</Text>
            </TouchableOpacity>
            <View style={styles.chatTitleContainer}>
              <Text style={styles.chatTitle}>{selectedGroup.name}</Text>
              {restoredFromStorage && (
                <Text style={styles.restoredIndicator}>• Restored</Text>
              )}
            </View>
          </View>

          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            style={styles.messagesContainer}
          />

          <View style={styles.messageInputContainer}>
            <TextInput
              style={styles.messageInput}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message..."
              multiline
            />
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={sendMessage}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  groupsContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  groupsList: {
    gap: 12,
  },
  groupItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedGroupItem: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#1976D2',
  },
  groupInfo: {
    gap: 4,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  lastMessageTime: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  groupDescription: {
    fontSize: 14,
    color: '#666',
  },
  groupMembers: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
    marginRight: 16,
  },
  chatTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  restoredIndicator: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 8,
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
    gap: 12,
  },
  messageContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  messageContent: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
  },
  messageInputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'flex-end',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
})
