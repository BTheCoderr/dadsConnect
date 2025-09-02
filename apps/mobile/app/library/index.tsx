import { View, Text, FlatList, Image } from "react-native"
import { useEffect, useState } from "react"
import { api } from "@dadconnect/shared"

interface LibraryItem {
  id: string
  source: string
  title: string
  image: string | null
  excerpt: string
  read_time: number
  read_status: "read" | "unread"
}

export default function LibraryScreen() {
  const [items, setItems] = useState<LibraryItem[]>([])

  useEffect(() => {
    api
      .getLibrary()
      .then((res) => setItems(res.items))
      .catch(() => {})
  }, [])

  return (
    <View style={{ flex: 1, paddingTop: 48 }}>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={{ padding: 12 }}>
            {item.image ? <Image source={{ uri: item.image }} style={{ height: 160, borderRadius: 12, marginBottom: 8 }} /> : null}
            <Text style={{ fontSize: 16, fontWeight: "600" }}>{item.title}</Text>
            <Text style={{ color: "#666", marginTop: 4 }}>{item.excerpt}</Text>
            <Text style={{ color: "#999", marginTop: 4 }}>
              {item.source} • {item.read_time} min • {item.read_status}
            </Text>
          </View>
        )}
      />
    </View>
  )
}


