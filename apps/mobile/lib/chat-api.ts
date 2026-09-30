import type { DadGroup, GroupMessage, Meetup, MeetupAttendee } from '@dadconnect/shared'
import { supabase } from './supabase'

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL

if (!API_BASE_URL) {
  throw new Error('Missing EXPO_PUBLIC_API_URL')
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession()
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  if (session?.access_token) headers.set('Authorization', `Bearer ${session.access_token}`)

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const body = response.status === 204 ? null : await response.json().catch(() => null)
  if (!response.ok) {
    const message = body && typeof body === 'object' && 'error' in body ? String(body.error) : `Request failed (${response.status})`
    throw new Error(message)
  }
  return body as T
}

export class ChatAPI {
  static async getGroups(): Promise<DadGroup[]> {
    const response = await request<{ groups: DadGroup[] }>('/api/groups')
    return response.groups || []
  }

  static async joinGroup(groupId: string): Promise<void> {
    await request(`/api/groups/${groupId}/join`, { method: 'POST' })
  }

  static async createGroup(input: {
    name: string
    description?: string
    category: DadGroup['category']
    topics: string[]
    city?: string
    state?: string
    visibility: DadGroup['visibility']
  }): Promise<DadGroup> {
    const response = await request<{ group: DadGroup }>('/api/groups', {
      method: 'POST',
      body: JSON.stringify(input),
    })
    return response.group
  }

  static async getMessages(groupId: string): Promise<GroupMessage[]> {
    const response = await request<{ messages: GroupMessage[] }>(`/api/groups/${groupId}/messages`)
    return response.messages || []
  }

  static async sendMessage(groupId: string, content: string): Promise<GroupMessage> {
    const response = await request<{ message: GroupMessage }>(`/api/groups/${groupId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content, messageType: 'text' }),
    })
    return response.message
  }

  static async getMeetups(): Promise<Meetup[]> {
    const response = await request<{ meetups: Meetup[] }>('/api/meetups')
    return response.meetups || []
  }

  static async createMeetup(input: {
    title: string
    description?: string
    activityType: Meetup['activityType']
    location?: string
    address?: string
    city?: string
    state?: string
    startTime: string
    endTime?: string
    maxAttendees?: number | null
    groupId?: string | null
  }): Promise<Meetup> {
    const response = await request<{ meetup: Meetup }>('/api/meetups', {
      method: 'POST',
      body: JSON.stringify(input),
    })
    return response.meetup
  }

  static async rsvp(meetupId: string, status: MeetupAttendee['status']): Promise<{ currentAttendees: number }> {
    return request<{ currentAttendees: number }>(`/api/meetups/${meetupId}/attend`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    })
  }

  static async getMe() {
    return request<{
      ok: boolean
      profile: {
        id: string
        name: string
        avatarUrl: string | null
        bio: string | null
        interests: string[]
        createdAt: string
      } | null
      privateProfile: {
        kidsAges: string[]
        city: string | null
        state: string | null
        cityOptIn: boolean
      } | null
      stats: { groups: number; meetups: number; discussions: number }
    }>('/api/me')
  }
}
