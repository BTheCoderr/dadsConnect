import type { ContentItem, Group, Thread, PodSession } from "./types"

const baseUrl =
  (typeof process !== "undefined" && (process.env.NEXT_PUBLIC_API_URL || process.env.EXPO_PUBLIC_API_URL)) || ""

let authTokenProvider: null | (() => Promise<string | null>) = null

export function setAuthTokenProvider(provider: () => Promise<string | null>) {
  authTokenProvider = provider
}

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> | undefined),
  }

  const token = authTokenProvider ? await authTokenProvider() : null
  if (token) headers["Authorization"] = `Bearer ${token}`

  const res = await fetch(baseUrl + path, {
    ...init,
    headers,
    credentials: "include",
  })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    const message = body && typeof body === "object" && "error" in body ? String(body.error) : `${res.status} ${res.statusText}`
    throw new Error(message)
  }
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export const api = {
  getFeed: (cursor?: string) => http<{ items: ContentItem[]; nextCursor?: string }>(`/api/feed${cursor ? `?cursor=${cursor}` : ""}`),
  save: (body: { contentId: string; note?: string }) => http<{ id: string }>(`/api/save`, { method: "POST", body: JSON.stringify(body) }),
  removeSave: (id: string) => http<void>(`/api/save/${id}`, { method: "DELETE" }),
  updateSave: (id: string, body: { readStatus?: "read" | "unread"; note?: string | null }) =>
    http<{ id: string; readStatus: "read" | "unread"; note: string | null; savedAt: string }>(`/api/save/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  getLibrary: () =>
    http<{ items: {
      id: string
      content_id: string
      source: string
      url: string
      title: string
      image: string | null
      excerpt: string
      read_time: number
      read_status: "read" | "unread"
      note: string | null
      saved_at: string
    }[] }>("/api/library"),
  getMe: () => http<{ ok: boolean; profile: { id: string; name: string | null; avatarUrl: string | null; cityOptIn: boolean; interests: string[]; createdAt: string } | null; flags: Record<string, unknown> }>(
    `/api/me`,
  ),
  suggestedGroups: () => http<{ items: Group[] }>(`/api/groups/suggested`),
  groupThreads: (groupId: string) => http<{ items: Thread[] }>(`/api/group/${groupId}/threads`),
  podsSchedule: () => http<{ items: PodSession[] }>(`/api/pods/schedule`),
}


