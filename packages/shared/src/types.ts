export interface Profile {
  id: string
  name: string
  avatarUrl?: string | null
  city?: string | null
  state?: string | null
  bio?: string | null
  interests: string[]
  kidsAges: string[]
  createdAt: string
}

export interface DadGroup {
  id: string
  name: string
  description?: string | null
  category: "support" | "activities" | "sports" | "local" | "interests"
  topics: string[]
  city?: string | null
  state?: string | null
  visibility: "public" | "private"
  memberCount: number
  createdBy: string
  createdAt: string
}

export interface GroupMember {
  groupId: string
  userId: string
  role: "member" | "mod" | "owner"
  joinedAt: string
}

export interface GroupMessage {
  id: string
  groupId: string
  authorId: string
  content: string
  messageType: "text" | "image" | "link" | "event"
  metadata?: Record<string, any> | null
  createdAt: string
  author?: Profile
}

export interface Meetup {
  id: string
  groupId?: string | null
  createdBy: string
  title: string
  description?: string | null
  activityType: "watch_party" | "outdoor" | "sports" | "coffee" | "playdate" | "other"
  location?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  startTime: string
  endTime?: string | null
  maxAttendees?: number | null
  currentAttendees: number
  status: "upcoming" | "ongoing" | "completed" | "cancelled"
  createdAt: string
  creator?: Profile
  attendees?: MeetupAttendee[]
}

export interface MeetupAttendee {
  meetupId: string
  userId: string
  status: "going" | "maybe" | "not_going"
  joinedAt: string
  user?: Profile
}


