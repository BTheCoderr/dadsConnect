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
  cityOptIn?: boolean
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
  isMember?: boolean
}

export interface GroupMember {
  groupId: string
  userId: string
  role: "member" | "moderator" | "owner"
  joinedAt: string
}

export interface GroupMessage {
  id: string
  groupId: string
  authorId: string
  content: string
  messageType: "text" | "system"
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
  status: "upcoming" | "completed" | "cancelled"
  createdAt: string
  creator?: Profile
  attendees?: MeetupAttendee[]
  userRsvp?: MeetupAttendee["status"] | null
}

export interface MeetupAttendee {
  meetupId: string
  userId: string
  status: "going" | "maybe" | "not_going"
  joinedAt: string
  user?: Profile
}

// Additional types for API compatibility
export interface ContentItem {
  id: string
  sourceId?: string | null
  source?: string | null
  url: string
  title: string
  image?: string | null
  topics: string[]
  readTime: number
  publishedAt: string
  excerpt?: string | null
}

export interface Group {
  id: string
  name: string
  description?: string
  memberCount: number
  visibility: "public" | "private"
}

export interface Thread {
  id: string
  groupId: string
  authorId: string
  title: string
  body: string
  ts: string
  reactions?: Record<string, number>
  author?: Pick<Profile, "id" | "name" | "avatarUrl">
  group?: Pick<DadGroup, "id" | "name" | "category">
}

export interface PodSession {
  id: string
  title: string
  description?: string
  startTime: string
  endTime?: string
  maxAttendees?: number
  currentAttendees: number
}


