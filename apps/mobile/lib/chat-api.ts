import { DadGroup, GroupMessage } from '@dadconnect/shared'

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'

export class ChatAPI {
  private static async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Get all groups
  static async getGroups(): Promise<DadGroup[]> {
    try {
      const response = await this.request('/api/groups')
      return response.groups || []
    } catch (error) {
      console.error('Error fetching groups:', error)
      // Return mock data as fallback
      return this.getMockGroups()
    }
  }

  // Get messages for a specific group
  static async getMessages(groupId: string): Promise<GroupMessage[]> {
    try {
      const response = await this.request(`/api/groups/${groupId}/messages`)
      return response.messages || []
    } catch (error) {
      console.error('Error fetching messages:', error)
      // Return mock data as fallback
      return this.getMockMessages(groupId)
    }
  }

  // Send a message to a group
  static async sendMessage(groupId: string, content: string, messageType: string = 'text'): Promise<GroupMessage> {
    try {
      const response = await this.request(`/api/groups/${groupId}/messages`, {
        method: 'POST',
        body: JSON.stringify({
          content,
          messageType,
        }),
      })
      return response.message
    } catch (error) {
      console.error('Error sending message:', error)
      // Return mock message as fallback
      return this.createMockMessage(groupId, content)
    }
  }

  // Join a group
  static async joinGroup(groupId: string): Promise<boolean> {
    try {
      await this.request(`/api/groups/${groupId}/join`, {
        method: 'POST',
      })
      return true
    } catch (error) {
      console.error('Error joining group:', error)
      return false
    }
  }

  // Mock data fallbacks
  private static getMockGroups(): DadGroup[] {
    return [
      {
        id: '1',
        name: 'Austin Dads Support',
        description: 'Support group for dads in Austin area',
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
        description: 'Dads who love football and watching games together',
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
        description: 'Support for new dads navigating fatherhood',
        category: 'support',
        topics: ['new dad', 'support', 'advice'],
        visibility: 'public',
        memberCount: 32,
        createdBy: 'user3',
        createdAt: new Date().toISOString(),
      }
    ]
  }

  private static getMockMessages(groupId: string): GroupMessage[] {
    return [
      {
        id: '1',
        groupId,
        authorId: 'user1',
        content: 'Hey dads! Anyone up for watching the game this Sunday?',
        messageType: 'text',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        groupId,
        authorId: 'user2',
        content: 'I\'m in! What time?',
        messageType: 'text',
        createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        groupId,
        authorId: 'user3',
        content: 'Count me in too! I can bring some snacks.',
        messageType: 'text',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      }
    ]
  }

  private static createMockMessage(groupId: string, content: string): GroupMessage {
    return {
      id: Date.now().toString(),
      groupId,
      authorId: 'current_user',
      content,
      messageType: 'text',
      createdAt: new Date().toISOString(),
    }
  }
}
