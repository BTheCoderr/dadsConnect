import { View, Text, FlatList, Pressable } from "react-native"
import { useEffect, useState } from "react"
import { api } from "@dadconnect/shared"
import type { Group } from "@dadconnect/shared"

export default function GroupsScreen() {
  const [items, setItems] = useState<Group[]>([])
  useEffect(() => {
    api
      .suggestedGroups()
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
            <Text style={{ fontSize: 16, fontWeight: "600" }}>{item.name}</Text>
            <Text style={{ color: "#666", marginTop: 4 }}>{item.topics.join(", ")}</Text>
          </Pressable>
        )}
      />
    </View>
  )
}


