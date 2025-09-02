import { View, Text, FlatList, Pressable } from "react-native"
import { useEffect, useState } from "react"
import { api } from "@dadconnect/shared"
import type { PodSession } from "@dadconnect/shared"

export default function PodsScreen() {
  const [items, setItems] = useState<PodSession[]>([])
  useEffect(() => {
    api
      .podsSchedule()
      .then((res) => setItems(res.items))
      .catch(() => {})
  }, [])
  return (
    <View style={{ flex: 1, paddingTop: 48 }}>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <Pressable style={{ padding: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>{item.title}</Text>
            <Text style={{ color: "#666", marginTop: 4 }}>{item.topic}</Text>
          </Pressable>
        )}
        ListEmptyComponent={() => (
          <View style={{ alignItems: "center", marginTop: 64 }}>
            <Text style={{ color: "#666" }}>No pods today</Text>
          </View>
        )}
      />
    </View>
  )
}


