import { View, Text } from "react-native"
import { useEffect, useState } from "react"
import { api } from "@dadconnect/shared"

interface Profile {
  id: string
  name: string | null
  avatarUrl: string | null
  cityOptIn: boolean
  interests: string[]
  createdAt: string
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    api
      .getMe()
      .then((res) => setProfile(res.profile))
      .catch(() => {})
  }, [])

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
      {profile ? (
        <>
          <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 8 }}>{profile.name ?? "Anonymous"}</Text>
          <Text style={{ color: "#666" }}>Interests: {profile.interests.join(", ") || "—"}</Text>
        </>
      ) : (
        <Text>Not signed in</Text>
      )}
    </View>
  )
}


