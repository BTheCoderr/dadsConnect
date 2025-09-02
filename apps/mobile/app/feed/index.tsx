import { View, Text, FlatList, Pressable, Image } from "react-native"
import { useEffect, useState } from "react"
import type { ContentItem } from "@dadconnect/shared"
import { api } from "@dadconnect/shared"

export default function FeedScreen() {
  const [items, setItems] = useState<ContentItem[]>([])
  const [cursor, setCursor] = useState<string | undefined>()

  useEffect(() => {
    api
      .getFeed()
      .then((res) => {
        setItems(res.items)
        setCursor(res.nextCursor)
      })
      .catch(() => {})
  }, [])

  return (
    <View style={{ flex: 1, paddingTop: 48 }}>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <Pressable style={{ padding: 12 }}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={{ height: 160, borderRadius: 12, marginBottom: 8 }} />
            ) : null}
            <Text style={{ fontSize: 16, fontWeight: "600" }}>{item.title}</Text>
            <Text style={{ color: "#666", marginTop: 4 }}>{item.excerpt ?? ""}</Text>
          </Pressable>
        )}
      />
    </View>
  )
}


