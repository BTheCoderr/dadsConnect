import { supabase } from "./supabase"
import type { ContentItem } from "@dadconnect/shared"

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL || "https://dadsconnect.netlify.app").replace(/\/$/, "")

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error || !session?.access_token) throw new Error("Please sign in again to continue.")
  const headers = new Headers(options.headers)
  headers.set("Authorization", `Bearer ${session.access_token}`)
  if (options.body != null) headers.set("Content-Type", "application/json")
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers })
  } catch {
    throw new Error("Couldn't reach DadConnect. Check your connection and try again.")
  }
  const body = response.status === 204 ? null : await response.json().catch(() => null)
  if (!response.ok) {
    const message = body && typeof body === "object" && "error" in body
      ? String(body.error)
      : `Request failed (${response.status})`
    throw new Error(message)
  }
  return body as T
}

export type LibraryItem = {
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
}

export const api = {
  getFeed: (cursor?: string) =>
    request<{ items: ContentItem[]; nextCursor?: string | null }>(
      `/api/feed${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ""}`,
    ),
  getLibrary: () => request<{ items: LibraryItem[] }>("/api/library"),
  save: (body: { contentId: string; note?: string }) =>
    request<{ id: string }>("/api/save", { method: "POST", body: JSON.stringify(body) }),
  removeSave: (id: string) =>
    request<void>(`/api/save/${encodeURIComponent(id)}`, { method: "DELETE" }),
  updateSave: (id: string, body: { readStatus?: "read" | "unread"; note?: string | null }) =>
    request<{ id: string; readStatus: "read" | "unread"; note: string | null; savedAt: string }>(
      `/api/save/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(body) },
    ),
}
