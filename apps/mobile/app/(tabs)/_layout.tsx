import { Tabs } from "expo-router"

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="feed/index" options={{ title: "Feed" }} />
      <Tabs.Screen name="groups/index" options={{ title: "Groups" }} />
      <Tabs.Screen name="meetups/index" options={{ title: "Meetups" }} />
      <Tabs.Screen name="chat/index" options={{ title: "Chat" }} />
      <Tabs.Screen name="profile/index" options={{ title: "Profile" }} />
      <Tabs.Screen name="library/index" options={{ href: null, title: "Library" }} />
      <Tabs.Screen name="groups/create" options={{ href: null, title: "Create Group" }} />
      <Tabs.Screen name="meetups/create" options={{ href: null, title: "Create Meetup" }} />
    </Tabs>
  )
}
