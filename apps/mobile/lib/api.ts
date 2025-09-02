export async function getFeed(cursor?: string) {
  const base = process.env.EXPO_PUBLIC_API_URL
  const url = `${base}/api/feed${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ""}`
  const res = await fetch(url, { credentials: "include" })
  if (!res.ok) throw new Error("Failed to load feed")
  return res.json()
}


