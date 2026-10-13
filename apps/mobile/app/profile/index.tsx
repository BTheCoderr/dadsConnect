import { Redirect } from "expo-router"

// Preserve old /profile deep links without rendering a separate outdated profile.
export default function ProfileRedirect() {
  return <Redirect href="/(tabs)/profile" />
}
